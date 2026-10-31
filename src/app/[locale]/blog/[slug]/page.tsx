import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { TocRail } from "@/components/article/TocRail";
import { TocInline } from "@/components/article/toc";
import { PostRow } from "@/components/cards/PostRow";
import {
  SocialLink,
  LinkedInIcon,
  GitHubIcon,
  GlobeIcon,
} from "@/components/common/SocialIcons";
import { memberJobTitle } from "@/lib/memberJobTitle";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbLd } from "@/components/seo/BreadcrumbLd";
import { getAllPosts, getPostAuthor, getPostBySlug, getPostSlugs, localeChain, postRowData } from "@/lib/posts";
import { firstParagraphOf, headingsOf } from "@/lib/content";
import { displayRole, pick } from "@/lib/members";
import { absoluteUrl, buildAlternates, clampDescription, openGraphBase, orgName, ORG_ID, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

// Only the slugs above exist; any other URL is a 404 instead of an on-demand render.
export const dynamicParams = false;

async function importBody(locale: string, slug: string) {
  const chain = localeChain(locale);
  for (const l of chain.slice(0, -1)) {
    try {
      return await import(`@content/blog/${l}/${slug}.mdx`);
    } catch {
      // Not translated into this locale; try the next one in the chain.
    }
  }
  return await import(`@content/blog/${chain[chain.length - 1]}/${slug}.mdx`);
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  const author = getPostAuthor(post, locale);
  const alternates = await buildAlternates(`/blog/${slug}`, locale);
  const og = openGraphBase(locale);
  // The post's own card (./opengraph-image.tsx): department, title and byline.
  const images = [{ url: `/${locale}/blog/${slug}/opengraph-image`, width: 1200, height: 630, alt: post.title, type: "image/jpeg" }];
  const t = await getTranslations({ locale, namespace: "metadata" });
  // Search results show ~60 characters of a title: a long post title goes without the " · DSC Marmara" suffix.
  const title = t("titleTemplate").replace("%s", post.title).length > 60 ? { absolute: post.title } : post.title;
  const description = clampDescription(post.excerpt);
  return {
    title,
    description,
    alternates,
    // Replaces the layout's openGraph and twitter, so the shared fields and the share card are restated.
    openGraph: {
      ...og,
      type: "article",
      url: alternates.canonical,
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      // article:author is a profile URL: the member's page; a guest author has only a name.
      authors: author ? [author.member ? await absoluteUrl(`/team/${author.member.slug}`, locale) : author.name] : undefined,
      section: post.category,
      images,
    },
    twitter: { card: "summary_large_image", title: post.title, description, images },
  };
}

export default async function BlogDetailPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const author = getPostAuthor(post, locale);
  // Only team members get a profile link, role line and bio box.
  const member = author?.member;
  const t = await getTranslations("blog");
  const ta = await getTranslations("article");
  const tr = await getTranslations("roles");
  const tNav = await getTranslations("nav");
  const format = await getFormatter();
  const { default: Body } = await importBody(locale, slug);

  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/blog/${slug}`;
  const blogLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    // `updated` in the frontmatter once a published post is revised; until then, the publish date.
    dateModified: post.updated ?? post.date,
    articleSection: post.category,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    // The post's own share card; Google's article results want an image.
    image: `${SITE_URL}/${locale}/blog/${slug}/opengraph-image`,
    // The club node every page carries (@id), restated so the post stands on its own too.
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: orgName(locale),
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-192.png` },
    },
  };
  if (member && author) {
    // A team member: the Person node of their profile page (@id), restated with what an article's
    // author needs on its own: role, photo, the club, and their profiles elsewhere (sameAs).
    const memberUrl = `${SITE_URL}${prefix}/team/${member.slug}`;
    const sameAs = [member.linkedin, member.github, member.websiteUrl].filter((u): u is string => Boolean(u));
    blogLd.author = {
      "@type": "Person",
      "@id": `${memberUrl}#person`,
      name: author.name,
      url: memberUrl,
      jobTitle: await memberJobTitle(member, locale),
      ...(member.photo ? { image: `${SITE_URL}${member.photo}` } : {}),
      memberOf: { "@id": ORG_ID },
      ...(sameAs.length ? { sameAs } : {}),
    };
  } else if (author) {
    // A guest author (authorName): a name only.
    blogLd.author = { "@type": "Person", name: author.name };
  }

  const dateLabel = format.dateTime(new Date(post.date), { year: "numeric", month: "short", day: "numeric" });
  const headings = headingsOf("blog", slug, locale);
  const hasToc = headings.length >= 3;
  // The excerpt as standfirst, unless the opening paragraph already says it (excerpts are often lifted from it).
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase(locale);
  const standfirst = norm(firstParagraphOf("blog", slug, locale)).includes(norm(post.excerpt).slice(0, 60)) ? undefined : post.excerpt;
  // Same department first, then the newest.
  const related = getAllPosts(locale)
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3)
    .map((p) => postRowData(p, locale));

  const byline = member && author ? (
    <Link href={`/team/${member.slug}`} rel="author" className="author-link" style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none", color: "var(--text)" }}>
      <Avatar photo={author.photo} initials={author.initials} size={44} radius={999} fontSize={15} />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
        <span className="al-name" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15 }}>{author.name}</span>
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>{displayRole(member, tr)}</span>
      </span>
    </Link>
  ) : author ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, color: "var(--text)" }}>
      <Avatar photo={author.photo} initials={author.initials} size={44} radius={999} fontSize={15} />
      <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15 }}>{author.name}</span>
    </span>
  ) : null;

  return (
    <>
      <JsonLd data={blogLd} />
      <BreadcrumbLd trail={[{ href: "/blog", name: tNav("blog") }, { href: `/blog/${slug}`, name: post.title }]} />
      <ReadingProgress />

      <article className="read-layout">
        <aside className="read-toc">{hasToc && <TocRail items={headings} label={ta("toc")} />}</aside>
        <div className="read-main">
          {post.draft && <div className="example-banner">{t("draftNote")}</div>}
          <ArticleHeader
            back={{ href: "/blog", label: t("backToBlog") }}
            // lang="en": department names stay English, so uppercase them without the Turkish dotted İ.
            meta={[<span key="c" lang="en">{post.category}</span>, dateLabel, `${post.readingTime} ${t("readSuffix")}`]}
            title={post.title}
            standfirst={standfirst}
            byline={byline}
          />
          {hasToc && <TocInline items={headings} label={ta("toc")} />}

          <div className="article">
            <Body />
          </div>

          {member && author && (
            <div style={{ marginTop: 40, border: "1px solid var(--border)", borderRadius: 18, background: "var(--bg-elev)", padding: 30, display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Link href={`/team/${member.slug}`} className="author-link" style={{ textDecoration: "none" }}>
                <Avatar photo={author.photo} initials={author.initials} size={62} radius={999} fontSize={20} />
              </Link>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 6 }}>{t("writtenBy")}</div>
                <Link href={`/team/${member.slug}`} rel="author" className="author-link" style={{ textDecoration: "none", color: "var(--text)" }}>
                  <h3 className="al-name" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 21, margin: "0 0 4px" }}>{author.name}</h3>
                </Link>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>{displayRole(member, tr)}</div>
                <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14.5, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 16px" }}>{pick(member.bio1, locale)}</p>
                {/* The author's own profiles: who wrote this, checkable elsewhere (also sameAs in the JSON-LD). */}
                <div style={{ display: "flex", gap: 11 }}>
                  {member.linkedin && (
                    <SocialLink href={member.linkedin} label="LinkedIn" size={38} radius={9} external><LinkedInIcon size={16} /></SocialLink>
                  )}
                  {member.github && (
                    <SocialLink href={member.github} label="GitHub" size={38} radius={9} external><GitHubIcon size={16} /></SocialLink>
                  )}
                  {member.websiteUrl && (
                    <SocialLink href={member.websiteUrl} label={member.website ?? "Website"} size={38} radius={9} external><GlobeIcon size={16} /></SocialLink>
                  )}
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <section className="read-related">
              <h2 className="read-related-title">{t("related")}</h2>
              {related.map((p) => (
                <PostRow key={p.slug} post={p} />
              ))}
            </section>
          )}
        </div>
      </article>
    </>
  );
}
