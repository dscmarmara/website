import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isReviewLocale, isServedLocale, routing } from "@/i18n/routing";
import { bricolage, hanken, dscScript } from "@/fonts";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { organizationLd, websiteLd, ogLocale, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

/**
 * The root layout: `locale` is a root param (next/root-params, read in src/i18n/request.ts).
 * Only the served locales exist; any other first segment (the review locales on the live site,
 * /missing.html) matches no route and gets src/app/global-not-found.tsx.
 */
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).map((locale) => ({ locale }));
}
export const dynamicParams = false;

// The site is dark only: tints the mobile browser bar to the page background (--bg).
// color-scheme is also set in globals.css; the meta lets the browser know before the CSS loads.
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export async function generateMetadata({ params }: Omit<LayoutProps<"/[locale]">, "children">): Promise<Metadata> {
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
      // `en`, not `en_US`, is not a valid og:locale — see ogLocale().
      locale: ogLocale(locale),
      // No `url` here: it would be inherited by every page, so all of them
      // claimed to be the homepage. Pages rely on their canonical link instead.
    },
    twitter: { card: "summary_large_image" },
    // Review locales are side-by-side copies for proofreading, not pages to rank.
    robots: isReviewLocale(locale) ? { index: false, follow: false } : { index: true, follow: true },
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

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const fontVars = `${bricolage.variable} ${hanken.variable} ${dscScript.variable}`;

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`dark ${fontVars}`}>
      <body>
        {/* Locale only: client components get their messages from <ClientMessages> where they render. */}
        <NextIntlClientProvider messages={null}>
          <JsonLd data={websiteLd(locale)} />
          <JsonLd data={organizationLd(locale, tMeta("defaultDescription"))} />
          <Nav />
          <main>{children}</main>
          <Footer />
          <RevealOnScroll />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
