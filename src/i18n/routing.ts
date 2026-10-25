import { defineRouting } from "next-intl/routing";
import { IS_PRODUCTION } from "@/lib/env";

/**
 * TEMPORARY review locales: other versions of the Turkish and English copy,
 * compared page by page with the current default at /tr and / in the dev
 * options bar and on /karsilastir:
 * - tr-x-eski / en-x-eski: the copy that is live on main ("ESKİ")
 * - tr-x-v1 / en-x-v1: an earlier draft of the new copy ("YENİ 1")
 * Kept out of hreflang, the sitemap and search indexes, and 404 on the live
 * site (IS_PRODUCTION in [locale]/layout.tsx) — previews only. Remove once
 * nobody needs them — steps in TRANSLATIONS.md. BCP 47 private-use tags, so
 * Intl still formats dates and casing for their base language.
 */
export const REVIEW_LOCALES = ["tr-x-eski", "en-x-eski", "tr-x-v1", "en-x-v1"] as const;

export const isReviewLocale = (locale: string) => (REVIEW_LOCALES as readonly string[]).includes(locale);

/** Review locales exist on previews only; the live site (and staging) 404s them. */
export const isServedLocale = (locale: string) => !(IS_PRODUCTION && isReviewLocale(locale));

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
  // No hreflang `Link` response header: next-intl builds it from every locale above, so it
  // advertised the review locales (404 on the live site). The pages' own <link rel="alternate">
  // tags (buildAlternates in src/lib/seo.ts) and the sitemap list en, tr and x-default.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
