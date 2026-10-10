import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
    rehypePlugins: [
      ["rehype-pretty-code", { keepBackground: false, theme: dscShikiTheme }],
    ],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Allow the LAN origin during `next dev` (e.g. testing the responsive site on a phone).
  allowedDevOrigins: ["192.168.1.89", "192.168.1.89:3737"],
  // next/image only serves qualities listed here (Next 16 default: [75]).
  // 90 is PHOTO_QUALITY for member photos (src/components/common/Avatar.tsx).
  images: { qualities: [75, 90] },
  // IS_PRODUCTION (src/lib/env.ts) keeps the shop, the dev options bar and the
  // old-copy locales off the live site. Vercel normally exposes this variable
  // itself; falling back to VERCEL_ENV keeps that gate closed even if the
  // project's "expose System Environment Variables" setting is ever turned off.
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || "",
  },
};

export default withNextIntl(withMDX(nextConfig));
