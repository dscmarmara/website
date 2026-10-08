"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * One button that flips to the other language on the same page: "EN" on a
 * Turkish page, "TR" on the English one. The TR / TR YENİ comparison lives in
 * the dev options bar (DevOptions.tsx), not here.
 */
export function LocaleSwitch({ large = false }: { large?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // By base language, so the review copies (tr-x-eski, en-x-eski) flip to the
  // other language's current default too.
  const toEnglish = locale.split("-")[0] !== "en";
  const target: Locale = toEnglish ? "en" : "tr";

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
      <button
        className="lang-btn"
        // Preserve the current route, swap only the locale.
        onClick={() => startTransition(() => router.replace(pathname, { locale: target }))}
        aria-label={t(toEnglish ? "english" : "turkish")}
        style={large ? { fontSize: 14, padding: "9px 18px" } : undefined}
      >
        {toEnglish ? "EN" : "TR"}
      </button>
    </div>
  );
}
