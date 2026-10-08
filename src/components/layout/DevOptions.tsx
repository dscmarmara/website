"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { IS_PRODUCTION } from "@/lib/env";

/** TEMPORARY: per language, the previous copy (review locale) and the current default. */
const GROUPS: { title: string; options: { locale: Locale; label: string; key: string }[] }[] = [
  {
    title: "Türkçe metin:",
    options: [
      { locale: "tr-x-eski", label: "TR ESKİ", key: "turkishOld" },
      { locale: "tr", label: "TR YENİ", key: "turkish" },
    ],
  },
  {
    title: "İngilizce metin:",
    options: [
      { locale: "en-x-eski", label: "EN ESKİ", key: "englishOld" },
      { locale: "en", label: "EN YENİ", key: "english" },
    ],
  },
];

const btn = { padding: "4px 12px", fontSize: 11.5 } as const;

/**
 * TEMPORARY dev options bar under the nav: switches the page between the
 * previous copy (ESKİ) and the current default (YENİ), in Turkish and in
 * English, and links the preview-only pages (the shop). Hidden on Vercel
 * production, so it never reaches the live site;
 * remove before merging into main (see TRANSLATIONS.md). Its labels are
 * Turkish on purpose: it is a tool for the club's own team, not for visitors.
 */
export function DevOptions() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (IS_PRODUCTION) return null;
  const onShop = pathname === "/shop" || pathname.startsWith("/shop/");

  return (
    <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "6px 24px",
          display: "flex",
          alignItems: "center",
          columnGap: 20,
          rowGap: 6,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>
          DEV OPTIONS
        </span>
        {GROUPS.map((g) => (
          <div key={g.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" }}>{g.title}</span>
            <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" }}>
              {g.options.map((o) => (
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
        ))}
        {/* Preview-only pages, kept out of the nav and the live site. */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" }}>Önizleme:</span>
          <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" }}>
            <Link href="/shop" className="lang-btn" data-active={onShop ? "" : undefined} style={{ ...btn, textDecoration: "none" }}>
              Mağaza →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
