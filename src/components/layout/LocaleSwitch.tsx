"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/** Button label + `nav` translation key per locale. */
const LOCALE_UI: Record<string, { label: string; key: string }> = {
  en: { label: "EN", key: "english" },
  tr: { label: "TR", key: "turkish" },
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

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid var(--border)",
        borderRadius: 100,
        overflow: "hidden",
        width: "fit-content",
      }}
    >
      {routing.locales.map((l) => {
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
