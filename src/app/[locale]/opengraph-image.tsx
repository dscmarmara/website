import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";
import { Eyebrow, OG_SIZE, OG_TYPE, ogCard } from "@/lib/og";

export const alt = "DSC Marmara · Data Science Club";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Rendered once per served locale at build time.
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).map((locale) => ({ locale }));
}
export const dynamicParams = false;

/** The site's share card, in the page's language: the club's full name and the home hero line in the script font. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Any other first segment is a 404. The proxy skips this route, and with `[locale]` as the root
  // layout `dynamicParams = false` alone does not stop it running: /anything/opengraph-image would
  // render a fresh image on every request (and the review locales would get one on the live site).
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return ogCard(
    tBrand("university").toLocaleUpperCase(locale),
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Eyebrow>{tHome("heroEyebrow")}</Eyebrow>
      <div style={{ fontFamily: "DSC Script", fontSize: 104, lineHeight: 1.2, marginTop: 22, maxWidth: 1000 }}>{tHome("heroTitle")}</div>
    </div>
  );
}
