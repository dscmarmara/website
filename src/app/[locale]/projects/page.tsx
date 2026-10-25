import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/common/PageHero";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { IS_PRODUCTION } from "@/lib/env";
import { getAllProjects } from "@/lib/projects";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  if (IS_PRODUCTION) return {}; // preview-only (the page 404s on the live site)
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("projects.title"),
    description: t("projects.description"),
    alternates: await buildAlternates("/projects", locale),
  };
}

/** Project index. Preview-only for now: 404 on the live site (see TRANSLATIONS.md to open it). */
export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/projects">) {
  if (IS_PRODUCTION) notFound();
  const { locale } = await params;
  const t = await getTranslations("projects");
  const projects = getAllProjects(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("heroTitle")} sub={t("heroSub")} density={0.7} plain titleMaxWidth="18ch" />
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px 24px 96px" }}>
        {projects.length > 0 ? (
          <div className="dsc-grid-3" style={{ gap: 26 }}>
            {projects.map((p) => (
              <ProjectCard key={p.slug} href={`/projects/${p.slug}`} title={p.title} category={p.category} excerpt={p.excerpt} cover={p.cover} />
            ))}
          </div>
        ) : (
          <div
            data-reveal
            style={{ border: "1px dashed var(--border)", borderRadius: 18, background: "var(--bg-elev)", padding: "clamp(48px,8vw,84px) 24px", textAlign: "center" }}
          >
            <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: "clamp(24px,3.4vw,34px)", margin: "0 0 12px" }}>{t("comingSoon")}</h2>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "46ch", margin: "0 auto" }}>{t("comingSoonSub")}</p>
          </div>
        )}
      </div>
    </>
  );
}
