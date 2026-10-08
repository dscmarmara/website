import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/common/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { SHOP_PRODUCTS } from "@/lib/constants";
import { pick } from "@/lib/members";
import { buildAlternates } from "@/lib/seo";
import { IS_PRODUCTION } from "@/lib/env";

// The shop is preview-only for now: a 404 on the live site, reached on
// previews from the dev options bar. To open it, drop these checks and add it
// back to NAV_LINKS, the footer and the sitemap (see TRANSLATIONS.md).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (IS_PRODUCTION) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("shop.title"),
    description: t("shop.description"),
    alternates: await buildAlternates("/shop", locale),
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (IS_PRODUCTION) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
        density={0.8}
        padding="96px 24px 70px"
        titleMaxWidth="16ch"
      />

      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "80px 24px 100px" }}>
        <div className="shop-grid">
          {SHOP_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              name={pick(p.name, locale)}
              desc={pick(p.desc, locale)}
              price={p.price}
              sizes={p.sizes}
              art={p.art}
            />
          ))}
        </div>
      </div>
    </>
  );
}
