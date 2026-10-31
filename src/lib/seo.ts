import { getPathname } from "@/i18n/navigation";
import { isReviewLocale, routing } from "@/i18n/routing";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/constants";

// Fall back to the live domain, not a placeholder: if NEXT_PUBLIC_SITE_URL is
// missing on the host, every canonical, hreflang, sitemap entry and JSON-LD url
// would otherwise point at the wrong site.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dscmarmara.com.tr"
).replace(/\/$/, "");

/**
 * Stable JSON-LD node ids. Every page carries the WebSite and the organisation (layout),
 * so member pages, posts and breadcrumbs point at these instead of restating the club.
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Short name we want search engines to show as the site name. */
export const SITE_NAME = "DSC Marmara";
/** Full English name for the organisation entity. */
export const SITE_LEGAL_NAME = "Marmara University Data Science Club";

/**
 * Open Graph wants `language_TERRITORY` (`en_US`), not the bare language tag our
 * routing uses — `og:locale` was being emitted as a plain "en", which is not a
 * valid value.
 */
const OG_LOCALES: Record<string, string> = { en: "en_US", tr: "tr_TR" };
export const ogLocale = (locale: string) =>
  OG_LOCALES[locale] ?? OG_LOCALES[locale.split("-")[0]] ?? "en_US";

/**
 * Open Graph fields every page shares: site name, locale and the share card
 * from [locale]/opengraph-image.tsx (keep `alt` in step with that file). A
 * page's own `openGraph` replaces the layout's entirely, so a page that sets
 * one spreads this, or its share preview loses the image.
 */
export function openGraphBase(locale: string) {
  return {
    siteName: SITE_NAME,
    locale: ogLocale(locale),
    images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: "DSC Marmara · Data Science Club", type: "image/jpeg" }],
  };
}

/**
 * A page's own Open Graph block: the shared fields plus `og:url` (its canonical URL). The layout
 * leaves `url` out, or every page would claim to be the homepage, so each page states its own.
 */
export function pageOpenGraph(locale: string, url: string) {
  return { ...openGraphBase(locale), type: "website" as const, url };
}

/**
 * Search results cut descriptions at about 160 characters. Keeps the whole
 * sentences that fit; if not even the first one does, cuts at a word and adds "…".
 */
export function clampDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  let out = "";
  for (const sentence of text.match(/[^.!?]+[.!?]+\s*/g) ?? []) {
    if ((out + sentence).trim().length > max) break;
    out += sentence;
  }
  if (out.trim()) return out.trim();
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:]+$/, "")}…`;
}

/** Locales advertised to search engines: everything but the review locales. */
export const PUBLIC_LOCALES = routing.locales.filter((l) => !isReviewLocale(l));

/** Turkish name for the club. People here search for this, not the English one. */
const SITE_NAME_TR = "Marmara Üniversitesi Veri Bilimi Kulübü";

/** The club's full name in the page's language (JSON-LD organisation, publisher, worksFor). */
export const orgName = (locale: string) => (locale.split("-")[0] === "tr" ? SITE_NAME_TR : SITE_LEGAL_NAME);

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Per-locale hreflang URLs for a route, plus `x-default` (the English page):
 * where a visitor's language matches neither, search engines send them there.
 */
export async function hreflangUrls(href: Href): Promise<Record<string, string>> {
  const languages: Record<string, string> = {};
  for (const l of PUBLIC_LOCALES) {
    languages[l] = SITE_URL + (await getPathname({ locale: l, href }));
  }
  languages["x-default"] = SITE_URL + (await getPathname({ locale: routing.defaultLocale, href }));
  return languages;
}

/** Canonical + hreflang alternates for a route, as absolute URLs. */
export async function buildAlternates(href: Href, locale: string) {
  const languages = await hreflangUrls(href);
  return {
    canonical: SITE_URL + (await getPathname({ locale, href })),
    languages,
  };
}

/**
 * schema.org WebSite. This is the signal Google uses to choose the site name it
 * prints above the URL in search results; without it, it falls back to the bare
 * domain (which is why results were reading "dscmarmara.com.tr").
 */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ["Data Science Club", SITE_NAME_TR, SITE_LEGAL_NAME],
    // One site in both languages (the page's own language is in <html lang>).
    inLanguage: PUBLIC_LOCALES,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

/** Absolute URL of a route in a locale (breadcrumbs, JSON-LD). */
export const absoluteUrl = async (href: Href, locale: string) => SITE_URL + (await getPathname({ locale, href }));

/**
 * schema.org BreadcrumbList for a page below the homepage: Home › … › the page.
 * `trail` is the path after Home, each step with its name in the page's language.
 */
export async function breadcrumbLd(locale: string, homeName: string, trail: { href: Href; name: string }[]) {
  const steps = [{ href: "/" as Href, name: homeName }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: await Promise.all(
      steps.map(async (s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, item: await absoluteUrl(s.href, locale) }))
    ),
  };
}

/**
 * schema.org EducationalOrganization for the club (layout), named in the
 * page's language with the other language's name as an alternate.
 * `description` is the site's default meta description for that language.
 */
export function organizationLd(locale: string, description: string) {
  const name = orgName(locale);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name,
    alternateName: [SITE_NAME, name === SITE_NAME_TR ? SITE_LEGAL_NAME : SITE_NAME_TR],
    description,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    // Not the brand SVG: it carries only a viewBox, no width/height, so it has
    // no intrinsic pixel size for a crawler to check against Google's minimum.
    // This PNG is a known 192x192.
    logo: `${SITE_URL}/icon-192.png`,
    sameAs: Object.values(SOCIALS).filter((u) => u !== "#"),
    // No foundingDate: the club does not state its founding year anywhere.
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: name === SITE_NAME_TR ? "Marmara Üniversitesi" : "Marmara University",
      url: "https://www.marmara.edu.tr",
    },
  };
}
