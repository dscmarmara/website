import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || "";

// Custom Shiki theme reproducing the prototype's neon-green code palette.
// Passed as a plain (serializable) object so it survives Turbopack's Rust boundary.
const dscShikiTheme = {
  name: "dsc-green",
  type: "dark",
  colors: {
    "editor.background": "#050d08",
    "editor.foreground": "#cfe0d4",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6f8377" } },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.control.import",
        "keyword.control.flow",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "#4DFF00" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call.generic"],
      settings: { foreground: "#8fe0a2" },
    },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#b6f36a" } },
    { scope: ["string", "string.quoted"], settings: { foreground: "#a7e0b0" } },
    { scope: ["variable", "meta.definition.variable", "variable.parameter"], settings: { foreground: "#cfe0d4" } },
  ],
} as const;

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // Keeps the `---` front matter out of the rendered body; src/lib/content.ts reads it from the file.
      "remark-frontmatter",
      // Tables, footnotes, ~~strikethrough~~ and bare-URL links in posts and case studies.
      "remark-gfm",
    ],
    rehypePlugins: [
      ["rehype-pretty-code", { keepBackground: false, theme: dscShikiTheme }],
    ],
  },
});

/**
 * The deployment's role, read by src/lib/env.ts (SITE_STAGE, IS_PRODUCTION):
 *   production: the live site (Vercel production, branch main)
 *   staging:    branch "staging", a Vercel preview that behaves exactly like the live site
 *   preview:    every other Vercel branch (preview-development…) and `next dev`: dev tools and
 *               preview-only pages on
 * An explicit NEXT_PUBLIC_SITE_STAGE wins (local checks: `NEXT_PUBLIC_SITE_STAGE=preview npm run build`).
 * Fails closed: a build that cannot tell where it runs (a local `next build`, a host without Vercel's
 * variables) is production, so the dev tools never ship by accident. Vercel normally exposes
 * NEXT_PUBLIC_VERCEL_ENV itself; falling back to VERCEL_ENV keeps the gate working if that is ever off.
 */
function siteStage(phase: string): string {
  if (process.env.NEXT_PUBLIC_SITE_STAGE) return process.env.NEXT_PUBLIC_SITE_STAGE;
  if (vercelEnv === "production") return "production";
  if (process.env.VERCEL_GIT_COMMIT_REF === "staging") return "staging";
  if (vercelEnv === "preview" || vercelEnv === "development" || phase === PHASE_DEVELOPMENT_SERVER) return "preview";
  return "production";
}

/**
 * Content-Security-Policy. Scripts and styles need 'unsafe-inline': Next inlines its bootstrap
 * scripts, and a nonce would make every page dynamic (no static HTML, no CDN cache); the site also
 * styles with `style={{}}`. What the policy still buys: no third-party scripts, styles, frames or
 * connections, no framing by other sites (clickjacking), no <base> or form-target hijacking, no plugins.
 * Fonts are self-hosted by next/font, Plotly needs no eval, BotID's challenge script is same-origin.
 * Off the live site the Vercel toolbar (vercel.live) is allowed too. Not sent by `next dev` (HMR uses eval).
 */
function contentSecurityPolicy(stage: string): string {
  const toolbar = stage === "production" ? [] : ["https://vercel.live"];
  return [
    "default-src 'self'",
    ["script-src 'self' 'unsafe-inline'", ...toolbar].join(" "),
    ["style-src 'self' 'unsafe-inline'", ...toolbar].join(" "),
    ["img-src 'self' data: blob:", ...toolbar, ...(toolbar.length ? ["https://vercel.com"] : [])].join(" "),
    ["font-src 'self'", ...toolbar, ...(toolbar.length ? ["https://assets.vercel.com"] : [])].join(" "),
    ["connect-src 'self'", ...toolbar, ...(toolbar.length ? ["wss://ws-us3.pusher.com"] : [])].join(" "),
    ["frame-src 'self'", ...toolbar].join(" "),
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export default function config(phase: string): NextConfig {
  const stage = siteStage(phase);
  const nextConfig: NextConfig = {
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    poweredByHeader: false,
    // Allow the LAN origin during `npm run dev:lan` (testing the responsive site on a phone).
    // Hostnames only: Next ignores the scheme and port.
    allowedDevOrigins: ["192.168.1.89"],
    images: {
      // next/image only serves qualities listed here (Next 16 default: [75]).
      // 90 is PHOTO_QUALITY for member photos (src/components/common/Avatar.tsx).
      qualities: [75, 90],
      // The only next/image use is member photos, at most 188 CSS px (564 px on a 3x screen); the
      // default list up to 3840w only made every srcset longer. imageSizes (32…384) stay default.
      deviceSizes: [640, 828, 1080],
      // Member photos change rarely: keep optimized copies for 31 days instead of the default 4 hours.
      minimumCacheTTL: 2678400,
    },
    env: {
      NEXT_PUBLIC_VERCEL_ENV: vercelEnv,
      NEXT_PUBLIC_SITE_STAGE: stage,
    },
    async headers() {
      if (phase === PHASE_DEVELOPMENT_SERVER) return [];
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Content-Security-Policy", value: contentSecurityPolicy(stage) },
            // Older browsers that ignore frame-ancestors.
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          ],
        },
      ];
    },
  };
  // BotID's challenge (src/instrumentation-client.ts): Vercel routes it on its own; off Vercel
  // (`next dev`, a local production build) these rewrites fetch it from Vercel's API instead,
  // so the contact form also works locally.
  const withChallenge = process.env.VERCEL ? (c: NextConfig) => c : withBotId;
  return withNextIntl(withMDX(withChallenge(nextConfig)));
}
