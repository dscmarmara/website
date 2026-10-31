import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactElement, ReactNode } from "react";
import { ImageResponse } from "next/og";

/*
 * Share cards (the opengraph-image routes): the site's look at 1200x630 — its page gradient,
 * the home hero's hexagon lattice, the logo and nav lockup — in its own fonts. Satori reads
 * TTF/OTF/WOFF but not WOFF2, so the cards have WOFF copies in src/fonts/og (OFL).
 * Cards go out as JPEG: with a photo, a PNG card weighs 220-370 KB, and WhatsApp shows no
 * preview at all for images over about 300 KB.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/jpeg";

export const C = {
  accent: "#4dff00",
  muted: "#b8c2bc",
  grad: "linear-gradient(135deg, #4dff00 0%, #0b8f30 100%)",
};

// Every read below names its folder outright: a computed path makes the bundler trace (and
// deploy with these routes) the whole project.
const ogFont = (file: string) => readFile(path.join(process.cwd(), "src/fonts/og", file));

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: "normal" }[]> | undefined;
function ogFonts() {
  fonts ??= Promise.all([
    ogFont("BricolageGrotesque-SemiBold.woff").then((data) => ({ name: "Bricolage", data, weight: 600 as const, style: "normal" as const })),
    ogFont("BricolageGrotesque-Bold.woff").then((data) => ({ name: "Bricolage", data, weight: 700 as const, style: "normal" as const })),
    ogFont("HankenGrotesk-Medium.woff").then((data) => ({ name: "Hanken", data, weight: 500 as const, style: "normal" as const })),
    ogFont("HankenGrotesk-SemiBold.woff").then((data) => ({ name: "Hanken", data, weight: 600 as const, style: "normal" as const })),
    readFile(path.join(process.cwd(), "src/fonts/dsc-script/DSCScript-Regular.ttf")).then((data) => ({ name: "DSC Script", data, weight: 400 as const, style: "normal" as const })),
  ]);
  return fonts;
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// The home hero's lattice (.hexgrid in globals.css), fading out from the top right like its mask.
const HEXGRID = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>` +
    `<pattern id="h" width="56" height="96" patternUnits="userSpaceOnUse"><path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L56 80 L56 96 M0 80 L0 96 M28 64 L0 80" fill="none" stroke="#4DFF00" stroke-width="1.1"/></pattern>` +
    `<radialGradient id="g" cx="0.85" cy="0.05" r="0.95"><stop offset="0" stop-color="#fff"/><stop offset="0.7" stop-color="#000"/></radialGradient>` +
    `<mask id="m"><rect width="1200" height="630" fill="url(#g)"/></mask>` +
    `</defs><rect width="1200" height="630" fill="url(#h)" mask="url(#m)" opacity="0.4"/></svg>`
);

let logo: Promise<string> | undefined;
const logoUri = () => (logo ??= readFile(path.join(process.cwd(), "public/logo/dsc_logo_dark.svg")).then((b) => svgUri(b.toString())));

/** A member photo (`photo` in members.json, e.g. /team/x.jpg; they live in public/team), cropped square at `px` and inlined as a small JPEG. */
export async function teamPhotoDataUri(photo: string, px: number) {
  const { default: sharp } = await import("sharp");
  const source = await readFile(path.join(process.cwd(), "public/team", path.basename(photo)));
  const jpg = await sharp(source).resize(px, px, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${jpg.toString("base64")}`;
}

/** Small green uppercase label, as above the site's headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", fontFamily: "Hanken", fontWeight: 600, fontSize: 21, letterSpacing: 4.2, color: C.accent }}>{children}</div>
  );
}

/** The logo with the nav's "Data Science Club / university" lockup; `scale` 1 is the size in a card's corner. */
async function Lockup({ university, scale = 1 }: { university: string; scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s(20) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={await logoUri()} width={s(84)} height={s(69)} alt="" />
      <div style={{ width: s(1), height: s(48), background: "rgba(77,255,0,0.3)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: s(6) }}>
        <div style={{ fontFamily: "Bricolage", fontWeight: 600, fontSize: s(22), letterSpacing: s(4.4) }}>DATA SCIENCE CLUB</div>
        <div style={{ fontWeight: 500, fontSize: s(14), letterSpacing: s(2.8), color: C.muted }}>{university}</div>
      </div>
    </div>
  );
}

/** The card's ground: the site's page gradient and the hexagon lattice. */
function Ground({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "56px 80px 52px",
        ...(center ? { alignItems: "center", justifyContent: "center" } : {}),
        background: "linear-gradient(158deg, #000000 0%, #000000 30%, #02240f 58%, #0b8f30 88%, #2ecb25 100%)",
        color: "#ffffff",
        fontFamily: "Hanken",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HEXGRID} width={1200} height={630} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
      {children}
    </div>
  );
}

async function jpegResponse(element: ReactElement) {
  const png = await new ImageResponse(element, { ...OG_SIZE, fonts: await ogFonts() }).arrayBuffer();
  const { default: sharp } = await import("sharp");
  // 4:4:4 chroma keeps the thin green text and lines sharp.
  const jpg = await sharp(Buffer.from(png)).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": OG_TYPE } });
}

/** A card with content (member, post): the lockup in the corner, the content in the middle. */
export async function ogCard(university: string, content: ReactElement) {
  return jpegResponse(
    <Ground>
      {await Lockup({ university })}
      {/* No address line: link previews print the domain under the card themselves. */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>{content}</div>
    </Ground>
  );
}

/** The site's default card: only the logo and the lockup, large and centred. */
export async function ogBrandCard(university: string) {
  return jpegResponse(<Ground center>{await Lockup({ university, scale: 2.1 })}</Ground>);
}
