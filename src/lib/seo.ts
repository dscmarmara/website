import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SOCIALS } from "@/lib/constants";

// Fall back to the live domain, not a placeholder: if NEXT_PUBLIC_SITE_URL is
// missing on the host, every canonical, hreflang, sitemap entry and JSON-LD url
// would otherwise point at the wrong site.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dscmarmara.com.tr"
).replace(/\/$/, "");

/** Short name we want search engines to show as the site name. */
export const SITE_NAME = "DSC Marmara";
/** Full name for the organisation entity. */
export const SITE_LEGAL_NAME = "Data Science Club — Marmara University";

/**
 * Open Graph wants `language_TERRITORY` (`en_US`), not the bare language tag our
 * routing uses — `og:locale` was being emitted as a plain "en", which is not a
 * valid value. `tr` is kept even though Turkish routes are off, because the i18n
 * infrastructure was deliberately retained.
 */
const OG_LOCALES: Record<string, string> = { en: "en_US", tr: "tr_TR" };
export const ogLocale = (locale: string) => OG_LOCALES[locale] ?? "en_US";

/** Turkish name for the club. People here search for this, not the English one. */
const SITE_NAME_TR = "Marmara Üniversitesi Veri Bilimi Kulübü";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Canonical + per-locale hreflang alternates for a route, as absolute URLs. */
export async function buildAlternates(href: Href, locale: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = SITE_URL + (await getPathname({ locale: l, href }));
  }
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
    name: SITE_NAME,
    alternateName: ["Data Science Club", SITE_NAME_TR, SITE_LEGAL_NAME],
    // The site is written in English although the audience is largely Turkish;
    // stating it beats letting a crawler infer it from the Turkish brand names.
    inLanguage: "en",
    url: SITE_URL,
  };
}

/** schema.org EducationalOrganization for the club (home / layout). */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_LEGAL_NAME,
    alternateName: [SITE_NAME, SITE_NAME_TR],
    url: SITE_URL,
    // Not the brand SVG: it carries only a viewBox, no width/height, so it has
    // no intrinsic pixel size for a crawler to check against Google's minimum.
    // This PNG is a known 192x192.
    logo: `${SITE_URL}/icon-192.png`,
    sameAs: Object.values(SOCIALS).filter((u) => u !== "#"),
    // From the club's own copy ("EST. 2024 · ISTANBUL", metadata.storyEst) —
    // if that is ever corrected, correct it here too.
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Marmara University",
    },
  };
}
