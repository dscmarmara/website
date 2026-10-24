/**
 * Rules shared by the contact form (client) and its server action, so the form
 * accepts exactly what the server does. Plain values, no zod: the client bundle
 * stays small and only the server action loads the validator.
 */
export const CONTACT_LIMITS = { name: 120, email: 200, subject: 200, message: 5000 } as const;

/** zod 4's `z.email()` pattern (v4.6), used on both sides. */
export const EMAIL_RE =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

/**
 * The honeypot field: off-screen, real visitors never fill it. Deliberately not
 * a word like "company" or "website", which browser autofill recognises and
 * fills, silently dropping a real visitor's message.
 */
export const HONEYPOT_FIELD = "hp_note";
