"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch({ large = false }: { large?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const set = (l: "en" | "tr") => {
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
      <button
        className="lang-btn"
        data-active={locale === "en" ? "" : undefined}
        onClick={() => set("en")}
        aria-label={t("english")}
        style={pad}
      >
        EN
      </button>
      <button
        className="lang-btn"
        data-active={locale === "tr" ? "" : undefined}
        onClick={() => set("tr")}
        aria-label={t("turkish")}
        style={pad}
      >
        TR
      </button>
    </div>
  );
}
