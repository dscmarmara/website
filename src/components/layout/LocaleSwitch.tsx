"use client";

import NextLink from "next/link";
import { getPathname, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * One link that flips to the other language on the same page: "EN" on a Turkish
 * page, "TR" on the English one. A real <a href>, so it works before hydration,
 * search engines can follow it and Back returns to the previous language. The
 * server picks the target (Nav.tsx); only the current path is read here. The
 * TR / TR YENİ comparison lives in the dev options bar (DevOptions.tsx).
 */
export function LocaleSwitch({ target, label, large = false }: { target: Locale; label: string; large?: boolean }) {
  // The same page in the other language, as its final URL (/team, /tr/team). next-intl's
  // <Link locale> would always prefix it (/en/team) for its locale cookie, which this site
  // doesn't use (localeDetection: false): one redirect for every visitor and crawler.
  const href = getPathname({ href: usePathname(), locale: target });
  return (
    <div className="lang-switch">
      <NextLink
        className="lang-btn"
        href={href}
        hrefLang={target}
        aria-label={label}
        style={large ? { fontSize: 14, padding: "9px 18px" } : undefined}
      >
        {target === "en" ? "EN" : "TR"}
      </NextLink>
    </div>
  );
}
