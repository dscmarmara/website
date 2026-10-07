"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { PREVIEW_LOCALES, routing, type Locale } from "@/i18n/routing";

/** In the /onizleme preview the switch is one button that flips to the other language. */
const PREVIEW_TOGGLE: Record<string, { target: Locale; label: string; key: string }> = {
  "tr-x-onizleme": { target: "en-x-onizleme", label: "EN", key: "english" },
  "en-x-onizleme": { target: "tr-x-onizleme", label: "TR", key: "turkish" },
};

/** Button label + `nav` translation key per locale. */
const LOCALE_UI: Record<string, { label: string; key: string }> = {
  en: { label: "EN", key: "english" },
  tr: { label: "TR", key: "turkish" },
  "tr-x-yeni": { label: "TR YENİ", key: "turkishNew" },
};

export function LocaleSwitch({ large = false }: { large?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Nothing to switch between while only one locale is enabled. Driven by
  // `routing.locales`, so the switch reappears by itself if Turkish returns.
  if (routing.locales.length < 2) return null;

  const set = (l: Locale) => {
    if (l === locale) return;
    // Preserve the current route, swap only the locale.
    startTransition(() => router.replace(pathname, { locale: l }));
  };

  const pad = large ? { fontSize: 14, padding: "9px 18px" } : undefined;
  const pill = {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid var(--border)",
    borderRadius: 100,
    overflow: "hidden",
    width: "fit-content",
  } as const;

  const toggle = PREVIEW_TOGGLE[locale];
  if (toggle) {
    return (
      <div style={pill}>
        <button className="lang-btn" onClick={() => set(toggle.target)} aria-label={t(toggle.key)} style={pad}>
          {toggle.label}
        </button>
      </div>
    );
  }

  return (
    <div style={pill}>
      {routing.locales.filter((l) => !(l in PREVIEW_LOCALES)).map((l) => {
        const ui = LOCALE_UI[l] ?? { label: l.toUpperCase(), key: l };
        return (
          <button
            key={l}
            className="lang-btn"
            data-active={locale === l ? "" : undefined}
            onClick={() => set(l)}
            aria-label={t(ui.key)}
            style={pad}
          >
            {ui.label}
          </button>
        );
      })}
    </div>
  );
}
