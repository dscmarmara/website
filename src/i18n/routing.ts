import { defineRouting } from "next-intl/routing";

/**
 * TEMPORARY review locale: the proposed new Turkish copy, served at /tr-x-yeni
 * next to the current one at /tr so the two can be compared page by page
 * ("TR YENİ" in the language switch). Kept out of hreflang, the sitemap and
 * search indexes. Remove before merging into main — steps in TRANSLATIONS.md.
 * A BCP 47 private-use tag, so Intl still formats dates and casing as Turkish.
 */
export const REVIEW_LOCALE = "tr-x-yeni";

/**
 * TEMPORARY preview locales: the site as it will look once the new Turkish
 * copy is final, served under /onizleme/tr and /onizleme/en with a single
 * language toggle. They have no content of their own — each reads the locale
 * it maps to. Hidden like REVIEW_LOCALE; remove with it (see TRANSLATIONS.md).
 */
export const PREVIEW_LOCALES: Record<string, string> = {
  "tr-x-onizleme": "tr-x-yeni",
  "en-x-onizleme": "en",
};

/** The locale whose messages and data a locale renders. */
export const contentLocale = (locale: string) => PREVIEW_LOCALES[locale] ?? locale;

/** Review/preview locales: not offered to search engines or the regular switch. */
export const isHiddenLocale = (locale: string) => locale === REVIEW_LOCALE || locale in PREVIEW_LOCALES;

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  // Where the Turkish copy lives: see TRANSLATIONS.md.
  locales: ["en", "tr", REVIEW_LOCALE, "tr-x-onizleme", "en-x-onizleme"],
  defaultLocale: "en",
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "tr-x-onizleme": "/onizleme/tr",
      "en-x-onizleme": "/onizleme/en",
    },
  },
  // The root always serves English; Turkish is reached through the EN/TR
  // switch or a /tr link. Without this, most of the audience (Turkish
  // browsers) would be redirected from / to /tr on their first visit.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
