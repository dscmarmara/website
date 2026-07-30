import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { bricolage, hanken, pacifico, condiment } from "@/fonts";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, websiteLd, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

type Params = { locale: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
    // Short brand name, matching the WebSite JSON-LD, so search engines and
    // social cards all agree on what this site is called.
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
      url: SITE_URL,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    // Explicit, query-less icon links. Bing (unlike Google) does not reliably
    // guess /favicon.ico and wants a plain <link rel="icon"> advertising a
    // 32x32 entry; Next's file-convention links carry a cache-busting query.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
        // Bing is reported to render favicons more reliably from a larger PNG
        // than from an ICO, so offer one alongside the ICO and the SVG.
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      ],
      shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const fontVars = `${bricolage.variable} ${hanken.variable} ${pacifico.variable} ${condiment.variable}`;

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`dark ${fontVars}`}>
      <body>
        <NextIntlClientProvider>
          <JsonLd data={websiteLd()} />
          <JsonLd data={organizationLd()} />
          <Nav />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
