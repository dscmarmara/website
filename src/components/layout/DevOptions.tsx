"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { REVIEW_LOCALE, type Locale } from "@/i18n/routing";

/** TEMPORARY: the two Turkish copies the team is comparing. */
const OPTIONS: { locale: Locale; label: string; key: string }[] = [
  { locale: "tr", label: "TR", key: "turkish" },
  { locale: REVIEW_LOCALE, label: "TR YENİ", key: "turkishNew" },
];

const btn = { padding: "4px 12px", fontSize: 11.5 } as const;

/**
 * TEMPORARY dev options bar under the nav: switches the page between the
 * current Turkish copy and the proposed one (TR YENİ) for review. Hidden on
 * Vercel production, so it never reaches the live site; remove before merging
 * into main (see TRANSLATIONS.md). Its labels are Turkish on purpose: it is a
 * tool for the club's own team, not for visitors.
 */
export function DevOptions() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return null;

  return (
    <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "6px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>
          DEV OPTIONS
        </span>
        <span style={{ fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" }}>Türkçe metin:</span>
        <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" }}>
          {OPTIONS.map((o) => (
            <button
              key={o.locale}
              className="lang-btn"
              data-active={locale === o.locale ? "" : undefined}
              aria-label={t(o.key)}
              onClick={() => {
                if (o.locale !== locale) startTransition(() => router.replace(pathname, { locale: o.locale }));
              }}
              style={btn}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
