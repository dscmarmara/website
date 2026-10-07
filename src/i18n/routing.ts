import { defineRouting } from "next-intl/routing";

/**
 * TEMPORARY review locale: the previous Turkish copy, kept at /tr-x-eski so it
 * can still be compared page by page with the new one at /tr ("TR ESKİ" in
 * the dev options bar). Kept out of hreflang, the sitemap and search indexes.
 * Remove once nobody needs the old copy — steps in TRANSLATIONS.md.
 * A BCP 47 private-use tag, so Intl still formats dates and casing as Turkish.
 */
export const REVIEW_LOCALE = "tr-x-eski";

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  // Where the Turkish copy lives: see TRANSLATIONS.md.
  locales: ["en", "tr", REVIEW_LOCALE],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The root always serves English; Turkish is reached through the EN/TR
  // switch or a /tr link. Without this, most of the audience (Turkish
  // browsers) would be redirected from / to /tr on their first visit.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
