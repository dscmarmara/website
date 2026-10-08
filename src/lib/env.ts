/**
 * True on the live site (Vercel production). Preview-only features — the dev
 * options bar and the shop — check this so they never reach the live site.
 * Vercel exposes NEXT_PUBLIC_VERCEL_ENV to Next.js builds automatically.
 */
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
