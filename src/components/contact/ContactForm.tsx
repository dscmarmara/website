"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@/components/common/SocialIcons";
import { sendContactMessage } from "@/app/[locale]/contact/actions";
import { CONTACT_LIMITS, EMAIL_RE, HONEYPOT_FIELD } from "@/lib/contactRules";

type FormValues = { name: string; email: string; subject: string; message: string; [HONEYPOT_FIELD]?: string };

/** False in the server HTML and until hydration, true after: no effect or extra render needed. */
const noSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

const inputStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-elev)",
  color: "var(--text)",
  fontFamily: "var(--font-body-stack)",
  fontSize: 15,
  width: "100%",
};

const captionStyle: CSSProperties = {
  fontFamily: "var(--font-mono-stack)",
  fontSize: 12,
  letterSpacing: "0.08em",
  color: "var(--text-muted)",
};

const errorStyle: CSSProperties = {
  fontFamily: "var(--font-body-stack)",
  fontSize: 12.5,
  color: "var(--destructive)",
};

export function ContactForm() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const hydrated = useHydrated();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // The same checks as the server action (trimmed lengths, zod's email pattern), so a
  // whitespace-only or malformed value gets an inline field error here instead of the
  // generic "couldn't be sent" banner. Values are sent as typed: the server trims what
  // it should, and the message keeps its indentation. Maximum lengths are the inputs'
  // own `maxLength`.
  const minTwo = (message: string) => (v: string) => v.trim().length >= 2 || message;

  const onSubmit = async (values: FormValues) => {
    setSendError(null);
    let result: Awaited<ReturnType<typeof sendContactMessage>>;
    try {
      result = await sendContactMessage(values);
    } catch {
      // Network failure, or a page left open across a deploy (its action ID no longer exists).
      setSendError(t("sendError"));
      return;
    }
    if (result.ok) {
      setSent(true);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    setSendError(result.error === "rate" ? t("rateError") : t("sendError"));
  };

  if (sent) {
    return (
      <div style={{ border: "1px solid var(--accent)", borderRadius: 18, background: "var(--bg-elev)", padding: 48, textAlign: "center", boxShadow: "var(--glow-soft)" }}>
        <div style={{ width: 64, height: 64, margin: "0 auto 22px", borderRadius: "50%", background: "var(--grad)", display: "grid", placeItems: "center" }}>
          <CheckIcon size={30} />
        </div>
        <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 26, margin: "0 0 12px" }}>{t("successTitle")}</h3>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 auto 24px", maxWidth: "42ch" }}>{t("successBody")}</p>
        <button
          type="button"
          onClick={() => { reset(); setSent(false); setSendError(null); }}
          style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--accent)", fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    // method="post": a submit before hydration must not put the visitor's details in the URL,
    // where they would end up in logs and history. The send button also waits for hydration.
    <form className="contact-form" method="post" noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* Honeypot: off-screen and hidden from assistive tech, so only bots fill it. */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register(HONEYPOT_FIELD)} />
        </label>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("fullName")}</span>
        <input className="field" type="text" placeholder={t("namePlaceholder")} style={inputStyle} maxLength={CONTACT_LIMITS.name} {...register("name", { validate: minTwo(t("nameError")) })} />
        {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("email")}</span>
        <input className="field" type="email" placeholder={t("emailPlaceholder")} style={inputStyle} maxLength={CONTACT_LIMITS.email} {...register("email", { validate: (v) => EMAIL_RE.test(v.trim()) || t("emailError") })} />
        {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
      </label>

      <label className="span-2" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("subject")}</span>
        <input className="field" type="text" placeholder={t("subjectPlaceholder")} style={inputStyle} maxLength={CONTACT_LIMITS.subject} {...register("subject", { validate: minTwo(t("subjectError")) })} />
        {errors.subject && <span style={errorStyle}>{errors.subject.message}</span>}
      </label>

      <label className="span-2" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("message")}</span>
        <textarea className="field" rows={6} placeholder={t("messagePlaceholder")} style={{ ...inputStyle, resize: "vertical" }} maxLength={CONTACT_LIMITS.message} {...register("message", { validate: (v) => v.trim().length > 0 || t("messageError") })} />
        {errors.message && <span style={errorStyle}>{errors.message.message}</span>}
      </label>

      <div className="span-2" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button
          type="submit"
          className="lift-btn"
          disabled={!hydrated || isSubmitting}
          style={{ padding: "15px 34px", borderRadius: 10, border: "none", background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15, cursor: isSubmitting ? "wait" : "pointer", opacity: !hydrated || isSubmitting ? 0.7 : 1, boxShadow: "var(--glow-soft)" }}
        >
          {isSubmitting ? t("sending") : t("send")}
        </button>
        {sendError && <span role="alert" style={errorStyle}>{sendError}</span>}
      </div>
    </form>
  );
}
