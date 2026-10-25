"use client";

import { useActionState, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@/components/common/SocialIcons";
import { sendContactMessage, type ContactField, type ContactState } from "@/app/[locale]/contact/actions";
import { CONTACT_LIMITS, EMAIL_RE, HONEYPOT_FIELD } from "@/lib/contactRules";

/** False in the server HTML and until hydration, true after: no effect or extra render needed. */
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

const INITIAL: ContactState = { status: "idle" };

/**
 * The same checks as the server action (trimmed lengths, zod's email pattern), run before
 * sending so a whitespace-only or malformed value gets its field error at once. Values are
 * sent as typed: the server trims what it should, and the message keeps its indentation.
 * Maximum lengths are the inputs' own `maxLength`.
 */
function invalidFields(data: FormData): ContactField[] {
  const value = (key: ContactField) => String(data.get(key) ?? "");
  const bad: ContactField[] = [];
  if (value("name").trim().length < 2) bad.push("name");
  if (!EMAIL_RE.test(value("email").trim())) bad.push("email");
  if (value("subject").trim().length < 2) bad.push("subject");
  if (!value("message").trim()) bad.push("message");
  return bad;
}

/**
 * Runs the server action. A thrown error would reach the nearest error boundary, which here
 * is the whole-site error page, so a network failure or a page left open across a deploy
 * (its action ID no longer exists) becomes the form's send error instead.
 */
async function submit(prev: ContactState, data: FormData): Promise<ContactState> {
  try {
    return await sendContactMessage(prev, data);
  } catch {
    const value = (key: ContactField) => String(data.get(key) ?? "");
    return { status: "error", error: "send", values: { name: value("name"), email: value("email"), subject: value("subject"), message: value("message") } };
  }
}

/** A new key starts a fresh form ("send another"): useActionState has no reset of its own. */
export function ContactForm() {
  const [round, setRound] = useState(0);
  return <ContactFormRound key={round} onSendAnother={() => setRound((r) => r + 1)} />;
}

function ContactFormRound({ onSendAnother }: { onSendAnother: () => void }) {
  const t = useTranslations("contact");
  const hydrated = useHydrated();
  const [state, formAction, pending] = useActionState(submit, INITIAL);
  const [clientErrors, setClientErrors] = useState<ContactField[]>([]);

  useEffect(() => {
    if (state.status !== "sent") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [state.status]);

  if (state.status === "sent") {
    return (
      <div className="cform-done">
        <div className="cform-done__icon">
          <CheckIcon size={30} />
        </div>
        <h3 className="cform-done__title">{t("successTitle")}</h3>
        <p className="cform-done__body">{t("successBody")}</p>
        <button
          className="cform-done__again"
          type="button"
          onClick={onSendAnother}
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;
  // Errors from the last check made: this submit's, or the server's answer to the previous one.
  const errors = clientErrors.length ? clientErrors : state.status === "error" ? (state.fields ?? []) : [];
  const sendError = state.status === "error" && state.error !== "invalid" ? t(state.error === "rate" ? "rateError" : "sendError") : null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const bad = invalidFields(new FormData(e.currentTarget));
    setClientErrors(bad);
    // A prevented submit never reaches the action, so nothing is reset either.
    if (bad.length) e.preventDefault();
  };

  return (
    // The send button waits for hydration: the action runs from client code (BotID adds its
    // check to the request there), so a submit before that would go nowhere.
    <form className="contact-form" action={formAction} onSubmit={onSubmit} noValidate>
      {/* Honeypot: off-screen and hidden from assistive tech, so only bots fill it. */}
      <div className="cform-hp" aria-hidden>
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="cform-field">
        <span className="cform-caption">{t("fullName")}</span>
        <input className="field cform-input" type="text" name="name" placeholder={t("namePlaceholder")} style={{ border: "1px solid var(--border)", color: "var(--text)" }} maxLength={CONTACT_LIMITS.name} defaultValue={values?.name} />
        {errors.includes("name") && <span className="cform-error">{t("nameError")}</span>}
      </label>

      <label className="cform-field">
        <span className="cform-caption">{t("email")}</span>
        <input className="field cform-input" type="email" name="email" placeholder={t("emailPlaceholder")} style={{ border: "1px solid var(--border)", color: "var(--text)" }} maxLength={CONTACT_LIMITS.email} defaultValue={values?.email} />
        {errors.includes("email") && <span className="cform-error">{t("emailError")}</span>}
      </label>

      <label className="span-2 cform-field">
        <span className="cform-caption">{t("subject")}</span>
        <input className="field cform-input" type="text" name="subject" placeholder={t("subjectPlaceholder")} style={{ border: "1px solid var(--border)", color: "var(--text)" }} maxLength={CONTACT_LIMITS.subject} defaultValue={values?.subject} />
        {errors.includes("subject") && <span className="cform-error">{t("subjectError")}</span>}
      </label>

      <label className="span-2 cform-field">
        <span className="cform-caption">{t("message")}</span>
        <textarea className="field cform-textarea" name="message" rows={6} placeholder={t("messagePlaceholder")} style={{ border: "1px solid var(--border)", color: "var(--text)" }} maxLength={CONTACT_LIMITS.message} defaultValue={values?.message} />
        {errors.includes("message") && <span className="cform-error">{t("messageError")}</span>}
      </label>

      <div className="span-2 cform-actions">
        <button
          type="submit"
          className="lift-btn cform-submit"
          disabled={!hydrated || pending}
          style={{ cursor: pending ? "wait" : "pointer", opacity: !hydrated || pending ? 0.7 : 1, boxShadow: "var(--glow-soft)" }}
        >
          {pending ? t("sending") : t("send")}
        </button>
        {sendError && <span className="cform-error" role="alert">{sendError}</span>}
      </div>
    </form>
  );
}
