import { defineRouting } from "next-intl/routing";

/**
 * TEMPORARY review locales: the previous Turkish and English copies, kept at
 * /tr-x-eski and /en-x-eski so they can still be compared page by page with
 * the current ones at /tr and / ("TR ESKİ" / "EN ESKİ" in the dev options
 * bar). Kept out of hreflang, the sitemap and search indexes. Remove once
 * nobody needs the old copy — steps in TRANSLATIONS.md. BCP 47 private-use
 * tags, so Intl still formats dates and casing for their base language.
 */
export const REVIEW_LOCALES = ["tr-x-eski", "en-x-eski"] as const;

export const isReviewLocale = (locale: string) => (REVIEW_LOCALES as readonly string[]).includes(locale);

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  // Where the Turkish copy lives: see TRANSLATIONS.md.
  locales: ["en", "tr", ...REVIEW_LOCALES],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The root always serves English; Turkish is reached through the EN/TR
  // switch or a /tr link. Without this, most of the audience (Turkish
  // browsers) would be redirected from / to /tr on their first visit.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
