"use server";

import { headers } from "next/headers";
import { checkBotId } from "botid/server";
import { z } from "zod";
import { sendContactMail, zohoConfigured } from "@/lib/zoho";
import { CONTACT_LIMITS, EMAIL_RE, HONEYPOT_FIELD } from "@/lib/contactRules";

/** Mirrors the client-side rules in ContactForm. Re-checked here: the client
 *  is not a trust boundary, a Server Action is a public endpoint. */
const schema = z.object({
  name: z.string().trim().min(2).max(CONTACT_LIMITS.name),
  email: z.string().trim().max(CONTACT_LIMITS.email).regex(EMAIL_RE),
  subject: z.string().trim().min(2).max(CONTACT_LIMITS.subject),
  // Checked against the trimmed value but stored untrimmed: `.trim()` in zod is
  // a transform, so it would edit what the visitor wrote. That matters because
  // trim strips the ends of the whole string, not per line — a pasted indented
  // code block would lose the indentation of its first line only and arrive
  // misaligned, and the mail body renders it with `white-space: pre-wrap`.
  // One character is enough; the refine is what rejects an all-whitespace message.
  message: z.string().max(CONTACT_LIMITS.message).refine((s) => s.trim().length > 0),
  /** Honeypot: real users never see this field, bots fill everything. */
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof schema>;
export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "rate" | "send" };

/**
 * Best-effort throttle. Serverless instances are ephemeral and not shared, so
 * this only slows down a burst that happens to hit the same warm instance. The
 * real gate against scripted senders is BotID (checkBotId below); this caps what
 * gets through it: a few messages per visitor, and a daily ceiling per instance
 * so a flood cannot exhaust the club mailbox's sending limit.
 */
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DAILY_LIMIT = 40;
const DAY_MS = 24 * 60 * 60 * 1000;
const hits = new Map<string, number[]>();
let sentToday: number[] = [];

/** One key per visitor: an IPv6 visitor controls a whole /64, so the key is that prefix. */
function visitorKey(ip: string): string {
  const v4 = ip.match(/^(?:::ffff:)?(\d{1,3}(?:\.\d{1,3}){3})$/i); // plain or IPv4-mapped
  if (v4) return v4[1];
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.replace(/%.*$/, "").split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
  return groups.slice(0, 4).map((g) => g.toLowerCase().replace(/^0+(?=.)/, "")).join(":") + "::/64";
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  sentToday = sentToday.filter((t) => now - t < DAY_MS);
  if (sentToday.length >= DAILY_LIMIT) return true;

  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  sentToday.push(now);
  if (hits.size > 500) {
    // Keep the map from growing without bound on a long-lived instance.
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

/**
 * BotID: the form's POST carries a browser challenge (src/instrumentation-client.ts); a
 * script calling the action directly has none. Always passes under `next dev`.
 */
async function looksLikeBot(): Promise<boolean> {
  try {
    return (await checkBotId()).isBot;
  } catch (err) {
    // Off Vercel (a local production build) there is no OIDC token to verify with. Fail open:
    // a broken check must not take the form down; the rate limits below still apply.
    console.error("[contact] BotID check failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  // An error rather than a silent "sent", so a visitor misjudged as a bot is told to
  // email instead of losing the message.
  if (await looksLikeBot()) return { ok: false, error: "send" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { name, email, subject, message } = parsed.data;

  // Bot: accept silently so it gets no signal that it was filtered.
  if (parsed.data[HONEYPOT_FIELD]?.trim()) {
    console.info("[contact] honeypot filled, message dropped");
    return { ok: true };
  }

  // On Vercel x-forwarded-for is set by the platform (the client's own value is replaced).
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  if (rateLimited(visitorKey(ip))) return { ok: false, error: "rate" };

  if (!zohoConfigured) {
    // Without credentials, log instead of failing silently. In development that
    // makes the form testable; anywhere else a dropped message is a real bug, so
    // surface an error rather than pretending it was sent. Only the visitor's
    // message in development: deployment logs are not the place for personal data.
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] ZOHO_* not configured: message not sent");
      return { ok: false, error: "send" };
    }
    console.warn(
      `[contact] ZOHO_* not configured — message not sent:\n` +
        `  from: ${name} <${email}>\n  subject: ${subject}\n  message: ${message}`
    );
    return { ok: true };
  }

  try {
    await sendContactMail({ name, email, subject, message });
    return { ok: true };
  } catch (err) {
    // Log the reason server-side (status codes only, see zoho.ts); the visitor gets a generic error.
    console.error("[contact] send failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "send" };
  }
}
