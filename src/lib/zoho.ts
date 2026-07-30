import "server-only";

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

const REGION = (process.env.ZOHO_REGION ?? "eu").trim();
const ACCOUNTS_HOST = `https://accounts.zoho.${REGION}`;
const MAIL_HOST = `https://mail.zoho.${REGION}`;

const CLIENT_ID = process.env.ZOHO_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET?.trim();
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN?.trim();

/** All three OAuth values present — otherwise the caller falls back to logging. */
export const zohoConfigured = Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);

/** Access tokens are valid ~1h; reuse within a warm serverless instance. */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    refresh_token: REFRESH_TOKEN!,
  });
  const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token?${params}`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) {
    throw new Error(`Zoho token refresh failed (${res.status}): ${JSON.stringify(data)}`);
  }

  const ttlMs = (Number(data.expires_in) || 3600) * 1000;
  // Renew a minute early so an in-flight request can't race the expiry.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + ttlMs - 60_000 };
  return cachedToken.value;
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
    throw new Error(`Zoho accounts lookup failed (${res.status}): ${JSON.stringify(data)}`);
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
 * Every control character becomes a space (CR/LF included), whitespace is
 * collapsed, and the result is capped — headers are not the place for essays.
 */
function headerSafe(value: string, maxLength = 200): string {
  return [...value]
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      return code < 0x20 || code === 0x7f ? " " : ch;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
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
  const token = await getAccessToken();
  const accountId = await getAccountId(token);

  const from = (process.env.CONTACT_FROM ?? "iletisim@dscmarmara.com.tr").trim();
  const to = (process.env.CONTACT_INBOX ?? from).trim();

  const content = `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 6px"><strong>Gönderen:</strong> ${escapeHtml(input.name)}</p>
  <p style="margin:0 0 6px"><strong>E-posta:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
  <p style="margin:0 0 6px"><strong>Konu:</strong> ${escapeHtml(input.subject)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
  <p style="white-space:pre-wrap;margin:0">${escapeHtml(input.message)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
  <p style="font-size:12px;color:#666;margin:0">dscmarmara.com.tr iletişim formundan gönderildi.</p>
</div>`;

  const res = await fetch(`${MAIL_HOST}/api/accounts/${accountId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      fromAddress: from,
      toAddress: to,
      // zod already rejects a malformed address, but the sanitiser belongs at the
      // header boundary rather than relying on the validator upstream.
      replyTo: headerSafe(input.email, 200),
      // Name first, then the subject. Every submission arrives from the club's
      // own mailbox, so the sender column reads "Me" for all of them and the
      // subject line is the only field that tells one message from the next.
      // The visitor's address is deliberately NOT in here: a university address
      // alone runs ~30 characters and would push the real subject past the ~40
      // a mobile inbox shows, while `replyTo` above already makes Reply work and
      // the body carries it as a mailto link.
      // Each part is capped separately — zod allows a 120-char name, which would
      // otherwise crowd the subject out of the line.
      subject: `${headerSafe(input.name, 60)} · ${headerSafe(input.subject, 120)}`,
      content,
      mailFormat: "html",
      askReceipt: "no",
    }),
  });

  const data = await res.json().catch(() => ({}));
  // Zoho can answer 200 with a failure code in the body, so check both.
  const code = Number(data?.status?.code);
  if (!res.ok || (Number.isFinite(code) && code >= 400)) {
    throw new Error(`Zoho send failed (${res.status}): ${JSON.stringify(data)}`);
  }
}
