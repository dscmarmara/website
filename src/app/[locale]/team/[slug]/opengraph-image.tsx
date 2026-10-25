import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";
import { getMemberBySlug, getMemberSlugs, initialsOf } from "@/lib/members";
import { memberJobTitle } from "@/lib/memberJobTitle";

export const alt = "DSC Marmara · Data Science Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered at build time for every member in every served locale. An image route lists all its
// params itself: with only `slug` here, no card was prerendered and every one was a 404.
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).flatMap((locale) => getMemberSlugs().map((slug) => ({ locale, slug })));
}
export const dynamicParams = false;

const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

/** A member's share card, in the page's language: photo, name and role on the club card's design. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  // As in ../../opengraph-image.tsx: any other locale or slug is a 404, never a fresh render.
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const role = await memberJobTitle(m, locale);
  // The photo is read from public/ at build time and inlined.
  const photo = m.photo
    ? `data:${MIME[path.extname(m.photo).toLowerCase()] ?? "image/jpeg"};base64,${(await readFile(path.join(process.cwd(), "public", m.photo))).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 70,
          padding: "80px 90px",
          background: "linear-gradient(135deg,#000000 0%,#02240F 52%,#0B8F30 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 40 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(120deg,#4DFF00,#0B8F30)" }} />
            <div style={{ fontSize: 26, letterSpacing: 10, color: "#B8C2BC" }}>{tBrand("title").toLocaleUpperCase("en")}</div>
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.04 }}>{m.name}</div>
          <div style={{ fontSize: 34, color: "#4DFF00", marginTop: 22 }}>{role}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 44 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#4DFF00" }} />
            <div style={{ fontSize: 28, color: "#B8C2BC" }}>{tBrand("university")}</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 372,
            height: 372,
            flex: "none",
            borderRadius: "50%",
            padding: 8,
            background: "linear-gradient(120deg,#4DFF00,#0B8F30)",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} width={356} height={356} alt="" style={{ borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 356, height: 356, borderRadius: "50%", background: "#02240F", fontSize: 120, fontWeight: 700 }}>
              {initialsOf(m, locale)}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
