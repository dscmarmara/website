import { getMemberBySlug, getMemberSlugs, type Member } from "@/lib/members";
import { DEPARTMENTS } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { readEntry, slugsOf } from "@/lib/content";

/** A key number shown in the case study's metric strip (and the card). */
export interface ProjectMetric {
  value: string;
  label: string;
  note?: string;
  /** The headline number, highlighted. */
  accent?: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  /** One or two sentences: the question and what came out of it (standfirst, card, search snippet). */
  excerpt: string;
  category: string; // one of DEPARTMENTS
  /** Member slugs (members.json); linked in the byline. */
  team?: string[];
  /** People who aren't on the team page, shown unlinked. */
  teamNames?: string[];
  date: string; // ISO, e.g. "2026-10-20"
  status: "done" | "ongoing";
  stack?: string[];
  links?: { repo?: string; demo?: string };
  metrics?: ProjectMetric[];
  /** Image under public/, e.g. "/projects/<slug>/cover.png". */
  cover?: string;
  featured?: boolean;
  /** Made-up content that only demonstrates the template: shows a notice. */
  example?: boolean;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
}

export function getProjectSlugs(): string[] {
  return slugsOf("projects");
}

export function getProjectBySlug(slug: string, locale: string): Project | null {
  return readEntry<ProjectFrontmatter>("projects", slug, locale);
}

export function getAllProjects(locale: string): Project[] {
  assertProjectIntegrity();
  return getProjectSlugs()
    .map((slug) => getProjectBySlug(slug, locale))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getFeaturedProjects(locale: string): Project[] {
  return getAllProjects(locale).filter((p) => p.featured);
}

export function getProjectTeam(p: Project): Member[] {
  return (p.team ?? []).map((s) => getMemberBySlug(s)).filter((m): m is Member => Boolean(m));
}

/** Build-time guard: real departments and team slugs, so a typo fails the build instead of the page. */
let checked = false;
function assertProjectIntegrity(): void {
  if (checked) return;
  checked = true;
  const members = new Set(getMemberSlugs());
  const departments = new Set<string>(DEPARTMENTS);
  for (const slug of getProjectSlugs()) {
    const p = getProjectBySlug(slug, routing.defaultLocale);
    if (!p) continue;
    if (!departments.has(p.category)) throw new Error(`[content] Project "${slug}" has unknown category "${p.category}".`);
    for (const m of p.team ?? []) {
      if (!members.has(m)) throw new Error(`[content] Project "${slug}" lists unknown team member "${m}"; use "teamNames" for people not on the team page.`);
    }
    if (p.status !== "done" && p.status !== "ongoing") throw new Error(`[content] Project "${slug}" has status "${p.status}" (use "done" or "ongoing").`);
  }
}
