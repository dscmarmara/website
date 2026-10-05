import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  // Where the Turkish copy lives: see TRANSLATIONS.md.
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The root always serves English; Turkish is reached through the EN/TR
  // switch or a /tr link. Without this, most of the audience (Turkish
  // browsers) would be redirected from / to /tr on their first visit.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
