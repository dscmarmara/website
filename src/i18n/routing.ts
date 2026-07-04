import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
