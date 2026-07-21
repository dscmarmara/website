import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // English served at the root (/about), Turkish under /tr (/tr/about).
  //
  // Turkish is currently switched OFF: it is not in `locales`, so /tr stops
  // being a route (next.config redirects /tr/* to the English equivalent),
  // hreflang/sitemap only emit English, and the language switch hides itself.
  // Everything else is intact — messages/tr.json, the request config and the
  // proxy all stay — so re-enabling it is just adding "tr" back to this array.
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
