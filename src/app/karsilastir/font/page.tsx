import type { Metadata } from "next";
import { notFound } from "next/navigation";
import tr from "../../../../messages/tr.json";
import en from "../../../../messages/en.json";
import { FontCompare, type FontSample } from "@/components/dev/FontCompare";
import { condimentLegacy, pacificoLegacy } from "@/fonts/legacy";
import { IS_PRODUCTION } from "@/lib/env";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Font: önce / sonra · DSC Marmara",
  robots: { index: false, follow: false },
};

// Hero sizes as on the site (page.tsx, PageHero, the blog post page, the 404 page).
const HOME = "clamp(40px,7vw,80px)";
const HERO = "clamp(36px,6vw,68px)";
const POST = "clamp(32px,5vw,56px)";

/** TEMPORARY preview tool: every script-font heading of the site, in the old and the new script font. */
export default function FontComparePage() {
  if (IS_PRODUCTION) notFound();
  const samples: FontSample[] = [];
  for (const [lang, m] of [["tr", tr], ["en", en]] as const) {
    samples.push(
      { lang, where: "Anasayfa", path: "/", text: m.home.heroTitle, size: HOME },
      { lang, where: "Hakkımızda", path: "/about", text: m.about.heroTitle, size: HERO },
      { lang, where: "Ekip", path: "/team", text: m.team.heroTitle, size: HERO },
      { lang, where: "Blog", path: "/blog", text: m.blog.heroTitle, size: HERO },
      ...getPostSlugs().map((slug) => ({ lang, where: "Blog yazısı", path: `/blog/${slug}`, text: getPostBySlug(slug, lang)?.title ?? slug, size: POST })),
      { lang, where: "İletişim", path: "/contact", text: m.contact.heroTitle, size: HERO },
      { lang, where: "Mağaza (önizleme)", path: "/shop", text: m.shop.heroTitle, size: HERO }
    );
  }
  return (
    <div className={`${condimentLegacy.variable} ${pacificoLegacy.variable}`}>
      <FontCompare samples={samples} />
    </div>
  );
}
