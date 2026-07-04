import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { getMemberSlugs } from "@/lib/members";
import { getPostSlugs, getPostBySlug } from "@/lib/posts";

async function entry(
  href: string,
  lastModified?: string | Date
): Promise<MetadataRoute.Sitemap[number]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = SITE_URL + (await getPathname({ locale: l, href }));
  }
  return {
    url: SITE_URL + (await getPathname({ locale: routing.defaultLocale, href })),
    lastModified,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const href of ["/", "/about", "/team", "/blog", "/contact"]) {
    entries.push(await entry(href));
  }
  for (const slug of getMemberSlugs()) {
    entries.push(await entry(`/team/${slug}`));
  }
  for (const slug of getPostSlugs()) {
    const post = getPostBySlug(slug, routing.defaultLocale);
    entries.push(await entry(`/blog/${slug}`, post?.date));
  }

  return entries;
}
