import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";
import { Reveal } from "@/components/effects/Reveal";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import {
  SocialLink,
  LinkedInIcon,
  MediumIcon,
} from "@/components/common/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { getMemberBySlug, displayRole, pick } from "@/lib/members";
import { buildAlternates, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

async function importBody(locale: string, slug: string) {
  try {
    return await import(`@content/blog/${locale}/${slug}.mdx`);
  } catch {
    return await import(`@content/blog/${routing.defaultLocale}/${slug}.mdx`);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  const author = getMemberBySlug(post.author);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: await buildAlternates(`/blog/${slug}`, locale),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: author ? [author.name] : undefined,
      section: post.category,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const author = getMemberBySlug(post.author);
  const t = await getTranslations("blog");
  const tr = await getTranslations("roles");
  const format = await getFormatter();
  const { default: Body } = await importBody(locale, slug);

  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const blogLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    articleSection: post.category,
    inLanguage: locale,
    mainEntityOfPage: `${SITE_URL}${prefix}/blog/${slug}`,
    publisher: { "@type": "Organization", name: "Data Science Club — Marmara University" },
  };
  if (author) blogLd.author = { "@type": "Person", name: author.name };

  const dateLabel = format
    .dateTime(new Date(post.date), { year: "numeric", month: "short", day: "numeric" })
    .toUpperCase();

  return (
    <>
      <JsonLd data={blogLd} />
      <ReadingProgress />

      <article>
        <header style={{ maxWidth: 880, margin: "0 auto", padding: "64px 24px 0" }}>
          <Link
            href="/blog"
            data-reveal
            style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.06em", color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 26 }}
          >
            {t("backToBlog")}
          </Link>
          <Reveal style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ padding: "5px 13px", borderRadius: 100, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.06em", fontWeight: 500 }}>{post.category}</span>
          </Reveal>
          <Reveal
            as="h1"
            style={{ fontFamily: "var(--font-script-stack)", fontWeight: 700, paddingBottom: "0.09em", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.08, margin: "0 0 28px" }}
          >
            {post.title}
          </Reveal>
          <Reveal style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", paddingBottom: 34, borderBottom: "1px solid var(--border)" }}>
            {author && (
              <Link href={`/team/${author.slug}`} className="author-link" style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none", color: "var(--text)" }}>
                <Avatar photo={null} initials={author.initials} size={48} radius={999} fontSize={16} />
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
                  <span className="al-name" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15 }}>{author.name}</span>
                  <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>{displayRole(author, tr)}</span>
                </span>
              </Link>
            )}
            <span style={{ width: 1, height: 30, background: "var(--border)", margin: "0 6px" }} />
            <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>{dateLabel}</span>
            <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>· {post.readingTime} {t("readSuffix")}</span>
          </Reveal>
        </header>

        <div className="article" style={{ maxWidth: "var(--readw)", margin: "0 auto", padding: "56px 24px 20px" }}>
          <Body />
        </div>

        {author && (
          <div style={{ maxWidth: "var(--readw)", margin: "24px auto 0", padding: "0 24px" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 18, background: "var(--bg-elev)", padding: 30, display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Link href={`/team/${author.slug}`} className="author-link" style={{ textDecoration: "none" }}>
                <Avatar photo={null} initials={author.initials} size={62} radius={999} fontSize={20} />
              </Link>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 6 }}>{t("writtenBy")}</div>
                <Link href={`/team/${author.slug}`} className="author-link" style={{ textDecoration: "none", color: "var(--text)" }}>
                  <h3 className="al-name" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 21, margin: "0 0 8px" }}>{author.name}</h3>
                </Link>
                <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14.5, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 16px" }}>{pick(author.bio1, locale)}</p>
                <div style={{ display: "flex", gap: 11 }}>
                  <SocialLink href="#" label="LinkedIn" size={38} radius={9}><LinkedInIcon size={16} /></SocialLink>
                  <SocialLink href="#" label="Medium" size={38} radius={9}><MediumIcon size={18} /></SocialLink>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ paddingBottom: 70 }} />
      </article>
    </>
  );
}
