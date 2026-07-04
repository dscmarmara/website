import type { Metadata } from "next";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Avatar } from "@/components/common/Avatar";
import { BlogFilter } from "@/components/blog/BlogFilter";
import type { PostRowData } from "@/components/cards/PostRow";
import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import { getMemberBySlug, displayRole } from "@/lib/members";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("blog.title"),
    description: t("blog.description"),
    alternates: await buildAlternates("/blog", locale),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tr = await getTranslations("roles");
  const format = await getFormatter();

  const all = getAllPosts(locale);
  const featured = getFeaturedPost(locale);
  const featuredAuthor = featured ? getMemberBySlug(featured.author) : undefined;

  const rowData: PostRowData[] = all
    .filter((p) => !p.featured)
    .map((p) => {
      const a = getMemberBySlug(p.author);
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        date: p.date,
        readingTime: p.readingTime,
        authorSlug: a?.slug,
        authorName: a?.name,
        authorInitials: a?.initials,
      };
    });

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
        density={0.7}
        titleMaxWidth="15ch"
      />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px 96px" }}>
        {featured && featuredAuthor && (
          <div data-reveal style={{ position: "relative", paddingBottom: 44, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <Link href={`/blog/${featured.slug}`} aria-label={featured.title} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <span style={{ padding: "5px 13px", borderRadius: 100, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.06em", fontWeight: 500 }}>{t("featuredBadge")}</span>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>
                {format.dateTime(new Date(featured.date), { year: "numeric", month: "short", day: "numeric" }).toUpperCase()} · {featured.readingTime}
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(28px,4.4vw,46px)", lineHeight: 1.1, margin: "0 0 18px" }}>{featured.title}</h2>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 18, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 22px", maxWidth: "62ch" }}>{featured.excerpt}</p>
            <Link
              href={`/team/${featuredAuthor.slug}`}
              className="author-link"
              style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", color: "var(--text)", width: "fit-content" }}
            >
              <Avatar photo={null} initials={featuredAuthor.initials} size={40} radius={999} fontSize={14} />
              <span className="al-name" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14 }}>{featuredAuthor.name}</span>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>{displayRole(featuredAuthor, tr)}</span>
            </Link>
          </div>
        )}

        <BlogFilter posts={rowData} />
      </div>
    </>
  );
}
