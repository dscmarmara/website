import "server-only";
import { IS_STAGING } from "@/lib/env";

/**
 * Zoho Mail REST API sender (region-aware, defaults to EU).
 *
 * Server-only by construction: the `import "server-only"` above makes the build
 * fail if this module is ever pulled into a client bundle, and none of the
 * ZOHO_* vars carry the NEXT_PUBLIC_ prefix, so the credentials cannot reach
 * the browser.
 *
 * HTTPS API rather than SMTP: Vercel blocks outbound SMTP ports (25/465/587),
 * so Nodemailer against Zoho SMTP would hang until the function times out.
 */

/** Zoho's data centres. Anything else is a typo, and the client secret must not go to a host it names. */
const REGIONS = ["eu", "com", "in", "com.au", "jp", "ca", "sa", "com.cn", "uk"];
const REGION = REGIONS.includes(process.env.ZOHO_REGION?.trim() || "eu") ? process.env.ZOHO_REGION?.trim() || "eu" : "eu";
const ACCOUNTS_HOST = `https://accounts.zoho.${REGION}`;
const MAIL_HOST = `https://mail.zoho.${REGION}`;

const CLIENT_ID = process.env.ZOHO_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET?.trim();
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN?.trim();

/** All three OAuth values present — otherwise the caller falls back to logging. */
export const zohoConfigured = Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);

/** Zoho's error code, for logs: the full response body can echo request data. */
const errorCodeOf = (data: unknown) => {
  const d = data as { error?: unknown; data?: { errorCode?: unknown }; status?: { description?: unknown } } | null;
  return String(d?.error ?? d?.data?.errorCode ?? d?.status?.description ?? "unknown");
};

/** Access tokens are valid ~1h; reuse within a warm serverless instance. */
let cachedToken: { value: string; expiresAt: number } | null = null;
/** One refresh at a time: concurrent sends wait for the same request instead of each refreshing. */
let refreshing: Promise<string> | null = null;
/** After a failed refresh, wait before asking Zoho again (it throttles token requests). */
let refreshBlockedUntil = 0;

async function refreshAccessToken(): Promise<string> {
  if (Date.now() < refreshBlockedUntil) throw new Error("Zoho token refresh backing off");
  // Credentials in the body, not the query string, where proxies and logs keep URLs.
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) {
    refreshBlockedUntil = Date.now() + 30_000;
    throw new Error(`Zoho token refresh failed (${res.status}): ${errorCodeOf(data)}`);
  }

  // Seconds, at most an hour: older responses gave `expires_in` in milliseconds.
  const ttlSec = Math.min(Number(data.expires_in_sec ?? data.expires_in) || 3600, 3600);
  // Renew a minute early so an in-flight request can't race the expiry.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + ttlSec * 1000 - 60_000 };
  return cachedToken.value;
}

async function getAccessToken(force = false): Promise<string> {
  if (!force && cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/** The mailbox accountId never changes; look it up once (or read it from env). */
let cachedAccountId: string | null = process.env.ZOHO_ACCOUNT_ID?.trim() || null;

async function getAccountId(token: string): Promise<string> {
  if (cachedAccountId) return cachedAccountId;

  const res = await fetch(`${MAIL_HOST}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  const id = data?.data?.[0]?.accountId;
  if (!res.ok || !id) {
    throw new Error(`Zoho accounts lookup failed (${res.status}): ${errorCodeOf(data)}`);
  }
  cachedAccountId = String(id);
  return cachedAccountId;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Make an untrusted string safe to interpolate into a mail header.
 *
 * This is a security control, not cosmetics. A CR or LF inside a header value
 * terminates that header, and everything after it is parsed as further headers —
 * so `"...\r\nBcc: victim@example.com"` in the subject appends a real `Bcc` and
 * turns the contact form into an open relay sending from the club's own mailbox.
 * That was reproduced against Zoho and confirmed in the delivered message, so
 * Zoho does NOT sanitise this for us and its docs promise nothing about it.
 *
 * Every control character becomes a space: C0 (CR/LF included), DEL and C1
 * (NEL, U+0085, is a line break to some parsers). So do the invisible ones that
 * can disguise how a subject reads in the inbox (zero-width, bidi overrides) and
 * lone surrogates. Whitespace is collapsed, and the result is capped by code
 * point so an emoji is never cut in half — headers are not the place for essays.
 */
const UNSAFE_IN_HEADER = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]|\p{Cs}/gu;

function headerSafe(value: string, maxLength = 200): string {
  const clean = value.replace(UNSAFE_IN_HEADER, " ").replace(/\s+/g, " ").trim();
  return Array.from(clean).slice(0, maxLength).join("").trim();
}

export interface ContactMail {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Deliver one contact-form submission to the club inbox.
 *
 * Sent FROM the club mailbox, never from the visitor: Zoho documents
 * `fromAddress` as having to be "associated to the authenticated account", and a
 * spoofed From would fail SPF/DKIM at the recipient anyway. `replyTo` carries the
 * visitor's address instead, so hitting Reply in Zoho answers the visitor.
 *
 * No display name on `fromAddress`: Zoho discards the label and substitutes the
 * mailbox's own identity (verified — the inbox showed the account name, not the
 * visitor's). The visitor's name is in the subject, which Zoho does render.
 *
 * `replyTo` is UNDOCUMENTED — it appears in neither the Send nor the Send Reply
 * parameter list — but it demonstrably works: Zoho validates keys strictly
 * (`replyToAddress` was rejected with `EXTRA_KEY_FOUND_IN_JSON` while `replyTo`
 * succeeded), and the delivered message really does carry the Reply-To header.
 * Being undocumented, it could stop working without notice; if replies ever start
 * going to the club instead of the visitor, this is the first thing to check.
 *
 * `CONTACT_FROM` must be the mailbox's PRIMARY address, not an alias. Sending from
 * an alias with a per-visitor `replyTo` is refused ("You need to verify the ReplyTo
 * address"), so the two features are mutually exclusive and the per-visitor
 * Reply-To is the more useful one. An alias also does not stop the club's client
 * from labelling the mail "Me" — it is still the same account — so it gains
 * nothing. Both facts were measured, not assumed.
 *
 * Every header value goes through `headerSafe` — see the note there; the subject
 * was an exploitable header-injection sink before that was added.
 */
export async function sendContactMail(input: ContactMail): Promise<void> {
  // `||`, not `??`: an empty variable (copied from .env.example) means "use the default".
  const from = process.env.CONTACT_FROM?.trim() || "iletisim@dscmarmara.com.tr";
  const to = process.env.CONTACT_INBOX?.trim() || from;

  const content = `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 6px"><strong>Gönderen:</strong> ${escapeHtml(input.name)}</p>
  <p style="margin:0 0 6px"><strong>E-posta:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
  <p style="margin:0 0 6px"><strong>Konu:</strong> ${escapeHtml(input.subject)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
  <p style="white-space:pre-wrap;margin:0">${escapeHtml(input.message)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
  <p style="font-size:12px;color:#666;margin:0">dscmarmara.com.tr iletişim formundan gönderildi.</p>
</div>`;

  const body = JSON.stringify({
    fromAddress: from,
    toAddress: to,
    // zod already rejects a malformed address, but the sanitiser belongs at the
    // header boundary rather than relying on the validator upstream.
    replyTo: headerSafe(input.email, 200),
    // `[İletişim]` marks the mail as coming from the site form. The club
    // mailbox also receives ordinary mail and the sender column cannot tell
    // them apart — a self-addressed message just reads "Me" — so the tag is
    // the only reliable marker, and it doubles as a stable string to build a
    // Zoho filter or label on.
    // Then the name, then the subject: the name is what you scan by, so it
    // has to come before the part that gets truncated.
    // The visitor's address is deliberately NOT in here: a university address
    // alone runs ~30 characters and would push the real subject past the ~40
    // a mobile inbox shows, while `replyTo` above already makes Reply work and
    // the body carries it as a mailto link.
    // Each part is capped separately — zod allows a 120-char name, which would
    // otherwise crowd the subject out of the line.
    // On staging (the live site's copy) the form works for real; `[STAGING]` keeps test mail apart.
    subject: `${IS_STAGING ? "[STAGING] " : ""}[İletişim] ${headerSafe(input.name, 60)} · ${headerSafe(input.subject, 120)}`,
    content,
    mailFormat: "html",
    askReceipt: "no",
  });

  const send = async (token: string) => {
    const accountId = await getAccountId(token);
    const res = await fetch(`${MAIL_HOST}/api/accounts/${accountId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body,
    });
    return { res, data: await res.json().catch(() => ({})) };
  };

  let { res, data } = await send(await getAccessToken());
  // A token Zoho revoked before its expiry: refresh once and retry, instead of this warm
  // instance failing every send until the cached token runs out.
  if (res.status === 401 || errorCodeOf(data) === "INVALID_OAUTHTOKEN") {
    ({ res, data } = await send(await getAccessToken(true)));
  }
  // Zoho can answer 200 with a failure code in the body, so check both.
  const code = Number(data?.status?.code);
  if (!res.ok || (Number.isFinite(code) && code >= 400)) {
    throw new Error(`Zoho send failed (${res.status}): ${errorCodeOf(data)}`);
  }
}
