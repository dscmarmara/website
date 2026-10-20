// Message keys that never show on the live site: left out of SITE_METINLERI.md
// (scripts/site-texts.mjs) and of the text-diff page (/karsilastir/farklar).
export const EXCLUDED_MESSAGE_KEYS: (string | RegExp)[] = [
  /^shop\./, /^metadata\.shop\./, "nav.shop", "footer.linkShop", // shop: preview only
  /^projects\./, /^metadata\.projects\./, // projects: preview only
  /^kpiLabels\./, // member KPIs are switched off
  "nav.englishOld", "nav.turkishOld", // dev options bar
  "metadata.siteName", "about.storyEst", "about.viewFullProfile", "blog.readArticle", // unused in code
];

export const isExcludedMessageKey = (key: string): boolean =>
  EXCLUDED_MESSAGE_KEYS.some((x) => (typeof x === "string" ? x === key : x.test(key)));
