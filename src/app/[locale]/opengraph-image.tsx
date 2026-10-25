import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";

export const alt = "DSC Marmara · Data Science Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered once per served locale at build time.
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).map((locale) => ({ locale }));
}
export const dynamicParams = false;

/** Social share card, in the page's language: the home hero line and the university name. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Any other first segment is a 404. The proxy skips this route, and with `[locale]` as the root
  // layout `dynamicParams = false` alone does not stop it running: /anything/opengraph-image would
  // render a fresh image on every request (and the review locales would get one on the live site).
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg,#000000 0%,#02240F 52%,#0B8F30 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 40 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(120deg,#4DFF00,#0B8F30)" }} />
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#B8C2BC" }}>{tBrand("title").toLocaleUpperCase("en")}</div>
        </div>
        <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.02, maxWidth: 940 }}>{tHome("heroTitle")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 44 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#4DFF00" }} />
          <div style={{ fontSize: 28, color: "#B8C2BC" }}>{tBrand("university")}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
