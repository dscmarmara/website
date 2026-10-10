/**
 * True on the live site (Vercel production). Preview-only features — the dev
 * options bar, the shop and the old-copy review locales — check this so they
 * never reach the live site. Vercel exposes NEXT_PUBLIC_VERCEL_ENV to Next.js
 * builds automatically (next.config.ts falls back to VERCEL_ENV).
 */
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
