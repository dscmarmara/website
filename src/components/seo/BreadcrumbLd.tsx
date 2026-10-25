import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

type Crumb = Parameters<typeof breadcrumbLd>[2][number];

/** BreadcrumbList JSON-LD for a page below Home: `trail` is the path after Home, named in the page's language. */
export async function BreadcrumbLd({ trail }: { trail: Crumb[] }) {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  return <JsonLd data={await breadcrumbLd(locale, t("home"), trail)} />;
}
