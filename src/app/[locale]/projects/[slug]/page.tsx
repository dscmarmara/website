import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Avatar } from "@/components/common/Avatar";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { TocRail } from "@/components/article/TocRail";
import { TocInline } from "@/components/article/toc";
import { Metrics, Stat } from "@/components/mdx";
import { JsonLd } from "@/components/seo/JsonLd";
import { IS_PRODUCTION } from "@/lib/env";
import { headingsOf, localeChain } from "@/lib/content";
import { initialsFromName, initialsOf } from "@/lib/members";
import { getProjectBySlug, getProjectSlugs, getProjectTeam } from "@/lib/projects";
import { buildAlternates, clampDescription, openGraphBase, orgName, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

// Only the slugs above exist; any other URL is a 404 instead of an on-demand render.
export const dynamicParams = false;

async function importBody(locale: string, slug: string) {
  const chain = localeChain(locale);
  for (const l of chain.slice(0, -1)) {
    try {
      return await import(`@content/projects/${l}/${slug}.mdx`);
    } catch {
      // Not translated into this locale; try the next one in the chain.
    }
  }
  return await import(`@content/projects/${chain[chain.length - 1]}/${slug}.mdx`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  // Preview-only: on the live site the page 404s, and its metadata must not leak the project either.
  if (IS_PRODUCTION) return {};
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  const alternates = await buildAlternates(`/projects/${slug}`, locale);
  const og = openGraphBase(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("titleTemplate").replace("%s", project.title).length > 60 ? { absolute: project.title } : project.title;
  const description = clampDescription(project.excerpt);
  return {
    title,
    description,
    alternates,
    openGraph: { ...og, type: "article", url: alternates.canonical, title: project.title, description, publishedTime: project.date },
    twitter: { card: "summary_large_image", title: project.title, description, images: og.images },
  };
}

/** A project case study. Preview-only for now: 404 on the live site. */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  if (IS_PRODUCTION) notFound();
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProjectBySlug(slug, locale);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const ta = await getTranslations("article");
  const format = await getFormatter();
  const { default: Body } = await importBody(locale, slug);
  const team = getProjectTeam(project);
  const headings = headingsOf("projects", slug, locale);
  const hasToc = headings.length >= 3;

  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/projects/${slug}`;
  const people = [...team.map((m) => m.name), ...(project.teamNames ?? [])];
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.excerpt,
    datePublished: project.date,
    inLanguage: locale,
    url,
    about: project.category,
    publisher: { "@type": "Organization", name: orgName(locale), url: SITE_URL },
  };
  if (people.length) ld.creator = people.map((name) => ({ "@type": "Person", name }));
  if (project.stack?.length) ld.keywords = project.stack.join(", ");

  const byline = people.length > 0 && (
    <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px" }}>
      <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>{t("team")}</span>
      {team.map((m) => (
        <Link key={m.slug} href={`/team/${m.slug}`} className="author-link" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text)" }}>
          <Avatar photo={m.photo} initials={initialsOf(m, locale)} size={34} radius={999} fontSize={12} />
          <span className="al-name" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14 }}>{m.name}</span>
        </Link>
      ))}
      {(project.teamNames ?? []).map((name) => (
        <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--text)" }}>
          <Avatar photo={null} initials={initialsFromName(name)} size={34} radius={999} fontSize={12} />
          <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14 }}>{name}</span>
        </span>
      ))}
    </span>
  );

  return (
    <>
      <JsonLd data={ld} />
      <ReadingProgress />

      <article className="read-layout case-layout">
        <aside className="read-toc">{hasToc && <TocRail items={headings} label={ta("toc")} numbered />}</aside>
        <div className="read-main">
          {project.example && <div className="example-banner">{t("exampleNote")}</div>}
          <ArticleHeader
            back={{ href: "/projects", label: t("backToProjects") }}
            meta={[
              // English department name: uppercase without the Turkish dotted İ.
              <span key="c" lang="en">{project.category}</span>,
              format.dateTime(new Date(project.date), { year: "numeric", month: "short" }),
              t(project.status === "ongoing" ? "statusOngoing" : "statusDone"),
            ]}
            title={project.title}
            standfirst={project.excerpt}
            byline={byline || undefined}
          >
            {project.stack?.map((s) => (
              <span key={s} className="ah-chip">
                {s}
              </span>
            ))}
            {project.links?.repo && (
              <a href={project.links.repo} className="ah-link" target="_blank" rel="noopener noreferrer">
                {t("repo")}
              </a>
            )}
            {project.links?.demo && (
              <a href={project.links.demo} className="ah-link" target="_blank" rel="noopener noreferrer">
                {t("demo")}
              </a>
            )}
          </ArticleHeader>

          {project.metrics && project.metrics.length > 0 && (
            <Metrics>
              {project.metrics.map((m) => (
                <Stat key={m.label} value={m.value} label={m.label} note={m.note} accent={m.accent} />
              ))}
            </Metrics>
          )}
          {hasToc && <TocInline items={headings} label={ta("toc")} numbered />}

          <div className="article case">
            <Body />
          </div>
        </div>
      </article>
    </>
  );
}
