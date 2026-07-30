"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendContactMail, zohoConfigured } from "@/lib/zoho";

/** Mirrors the client-side schema in ContactForm. Re-checked here: the client
 *  is not a trust boundary, a Server Action is a public endpoint. */
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  /** Honeypot: real users never see this field, bots fill everything. */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof schema>;
export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "rate" | "send" };

/**
 * Best-effort throttle. Serverless instances are ephemeral and not shared, so
 * this only slows down a burst that happens to hit the same warm instance —
 * enough to blunt casual abuse, deliberately not presented as real protection.
 */
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    // Keep the map from growing without bound on a long-lived instance.
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { name, email, subject, message, company } = parsed.data;

  // Bot: accept silently so it gets no signal that it was filtered.
  if (company && company.trim() !== "") return { ok: true };

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) return { ok: false, error: "rate" };

  if (!zohoConfigured) {
    // Without credentials, log instead of failing silently. In development that
    // makes the form testable; in production a dropped message is a real bug,
    // so surface an error rather than pretending it was sent.
    console.warn(
      `[contact] ZOHO_* not configured — message not sent:\n` +
        `  from: ${name} <${email}>\n  subject: ${subject}\n  message: ${message}`
    );
    return process.env.NODE_ENV === "production"
      ? { ok: false, error: "send" }
      : { ok: true };
  }

  try {
    await sendContactMail({ name, email, subject, message });
    return { ok: true };
  } catch (err) {
    // Log the real reason server-side; the visitor only gets a generic error.
    console.error("[contact] send failed:", err);
    return { ok: false, error: "send" };
  }
}
