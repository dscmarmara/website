/**
 * The deployment's role (set in next.config.ts from the Vercel environment and branch):
 * "production" (live site), "staging" (branch staging: an exact copy of the live site,
 * checked before release) or "preview" (development branches, `next dev`).
 * Unknown means production, so preview-only features stay off when in doubt.
 */
export const SITE_STAGE = (process.env.NEXT_PUBLIC_SITE_STAGE || "production") as "production" | "staging" | "preview";

/**
 * Live-site behaviour: true on the live site and on staging, its copy.
 * Preview-only features (the dev options bar, projects, draft posts, the
 * review locales, /karsilastir) check this so they never reach the live
 * site, and so staging shows exactly what will go live.
 */
export const IS_PRODUCTION = SITE_STAGE === "production" || SITE_STAGE === "staging";

/** Staging only: for the few things that must differ from the live site (e.g. tagging test mail). */
export const IS_STAGING = SITE_STAGE === "staging";

/**
 * The shop, ahead of its launch: open on previews (page, menu and footer link), closed on
 * staging and on the live site. To review it on staging as it will look live, use
 * SITE_STAGE !== "production" (promoting staging to main still keeps it closed). On launch
 * day set this to true (or remove it) and add /shop to the sitemap — see TRANSLATIONS.md.
 */
export const SHOW_SHOP = SITE_STAGE === "preview";
