"use client";

import { useState, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@/components/common/SocialIcons";
import { sendContactMessage } from "@/app/[locale]/contact/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const schema = z.object({
    // `.trim()` mirrors the server schema. Without it a whitespace-only value
    // passes here and is only caught server-side, where the visitor gets the
    // generic "couldn't be sent" banner instead of an inline field error.
    name: z.string().trim().min(2, t("nameError")),
    email: z.string().trim().regex(EMAIL_RE, t("emailError")),
    subject: z.string().trim().min(2, t("subjectError")),
    // Deliberately NOT trimmed — zodResolver hands onSubmit the parsed value, so
    // a `.trim()` here would edit the message before it is ever sent. One
    // character is enough; the refine is what rejects an all-whitespace message.
    message: z.string().refine((s) => s.trim().length > 0, t("messageError")),
    /** Honeypot — hidden from real users; see `company` in the server action. */
    company: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSendError(null);
    const result = await sendContactMessage(values);
    if (result.ok) {
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    <form className="contact-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* Honeypot: off-screen and hidden from assistive tech, so only bots fill it. */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("fullName")}</span>
        <input className="field" type="text" placeholder={t("namePlaceholder")} style={inputStyle} {...register("name")} />
        {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("email")}</span>
        <input className="field" type="email" placeholder={t("emailPlaceholder")} style={inputStyle} {...register("email")} />
        {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
      </label>

      <label className="span-2" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("subject")}</span>
        <input className="field" type="text" placeholder={t("subjectPlaceholder")} style={inputStyle} {...register("subject")} />
        {errors.subject && <span style={errorStyle}>{errors.subject.message}</span>}
      </label>

      <label className="span-2" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span style={captionStyle}>{t("message")}</span>
        <textarea className="field" rows={6} placeholder={t("messagePlaceholder")} style={{ ...inputStyle, resize: "vertical" }} {...register("message")} />
        {errors.message && <span style={errorStyle}>{errors.message.message}</span>}
      </label>

      <div className="span-2" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button
          type="submit"
          className="lift-btn"
          disabled={isSubmitting}
          style={{ padding: "15px 34px", borderRadius: 10, border: "none", background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15, cursor: isSubmitting ? "wait" : "pointer", opacity: isSubmitting ? 0.7 : 1, boxShadow: "var(--glow-soft)" }}
        >
          {isSubmitting ? t("sending") : t("send")}
        </button>
        {sendError && <span role="alert" style={errorStyle}>{sendError}</span>}
      </div>
    </form>
  );
}
