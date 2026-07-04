import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SOCIALS } from "@/lib/constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dataclub.marmara.edu.tr"
).replace(/\/$/, "");

export const SITE_NAME = "Data Science Club";

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

/** schema.org EducationalOrganization for the club (home / layout). */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Data Science Club — Marmara University",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/dsc_logo_dark.svg`,
    sameAs: Object.values(SOCIALS).filter((u) => u !== "#"),
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Marmara University",
    },
  };
}
