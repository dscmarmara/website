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
    alternateName: ["Data Science Club", SITE_LEGAL_NAME],
    url: SITE_URL,
  };
}

/** schema.org EducationalOrganization for the club (home / layout). */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo/dsc_logo_dark.svg`,
    sameAs: Object.values(SOCIALS).filter((u) => u !== "#"),
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Marmara University",
    },
  };
}
