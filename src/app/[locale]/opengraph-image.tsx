import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";
import { OG_SIZE, OG_TYPE, ogBrandCard } from "@/lib/og";

export const alt = "DSC Marmara · Data Science Club";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Rendered once per served locale at build time.
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).map((locale) => ({ locale }));
}
export const dynamicParams = false;

/** The site's default share card: the logo and "Data Science Club / university", in the page's language. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Any other first segment is a 404. The proxy skips this route, and with `[locale]` as the root
  // layout `dynamicParams = false` alone does not stop it running: /anything/opengraph-image would
  // render a fresh image on every request (and the review locales would get one on the live site).
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  return ogBrandCard(tBrand("university").toLocaleUpperCase(locale));
}
