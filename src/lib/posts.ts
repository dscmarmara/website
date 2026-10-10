import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  getMemberBySlug,
  getMemberSlugs,
  initialsFromName,
  initialsOf,
  type Member,
} from "@/lib/members";
import { DEPARTMENTS } from "@/lib/constants";
import { routing } from "@/i18n/routing";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  author?: string; // member slug — resolved to a person via getMemberBySlug
  authorName?: string; // instead of `author` when the writer isn't in members.json; shown unlinked
  date: string; // ISO, e.g. "2026-06-22"
  category: string; // one of DEPARTMENTS
  readingTime: string; // e.g. "7 MIN"
  excerpt: string;
  featured?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
}

const localeDir = (locale: string) => path.join(CONTENT_DIR, locale);

/**
 * Content folders to try for a locale, in order: the locale itself, its base
 * language ("tr-x-eski" → "tr"), then the default locale.
 */
export function localeChain(locale: string): string[] {
  return [...new Set([locale, locale.split("-")[0], routing.defaultLocale])];
}

export function getPostSlugs(): string[] {
  // Slugs are language-independent; the default-locale folder is canonical.
  const dir = localeDir(routing.defaultLocale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    // `_`-prefixed files are drafts/templates, not posts. `_template.mdx` also
    // keeps at least one module in the folder: the post body is loaded with a
    // dynamic `import()`, and with zero .mdx files the bundler cannot build
    // that import map and the production build fails to resolve it.
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readFrontmatter(slug: string, locale: string): Post | null {
  // Missing translation → fall back along localeChain.
  const file = localeChain(locale)
    .map((l) => path.join(localeDir(l), `${slug}.mdx`))
    .find((f) => fs.existsSync(f));
  if (!file) return null;
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return { slug, ...(data as PostFrontmatter) };
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  return readFrontmatter(slug, locale);
}

export function getAllPosts(locale: string): Post[] {
  assertContentIntegrity();
  return getPostSlugs()
    .map((slug) => readFrontmatter(slug, locale))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getFeaturedPost(locale: string): Post | undefined {
  return getAllPosts(locale).find((p) => p.featured);
}

export function getPostsByAuthor(slug: string, locale: string): Post[] {
  return getAllPosts(locale).filter((p) => p.author === slug);
}

export interface PostAuthor {
  name: string;
  initials: string;
  /** Set when the author is on the team; the byline then links to their profile. */
  member?: Member;
}

/** A post's byline: a team member (`author`) or a plain name (`authorName`). */
export function getPostAuthor(post: Post, locale: string): PostAuthor | undefined {
  const member = post.author ? getMemberBySlug(post.author) : undefined;
  if (member) return { name: member.name, initials: initialsOf(member, locale), member };
  if (post.authorName) return { name: post.authorName, initials: initialsFromName(post.authorName) };
  return undefined;
}

/**
 * Build-time integrity guard: every post names an author (a member slug that
 * exists in members.json, or a plain `authorName`) and every category is a
 * real department. A broken link fails the build instead of silently 404-ing
 * at runtime.
 */
let integrityChecked = false;
export function assertContentIntegrity(): void {
  if (integrityChecked) return;
  integrityChecked = true;
  const memberSlugs = new Set(getMemberSlugs());
  const validCategories = new Set<string>(DEPARTMENTS);
  for (const slug of getPostSlugs()) {
    const post = readFrontmatter(slug, routing.defaultLocale);
    if (!post) continue;
    if (post.author && !memberSlugs.has(post.author)) {
      throw new Error(
        `[content] Blog post "${slug}" has unknown author "${post.author}" — not found in members.json. ` +
          `Use "authorName" for someone who isn't on the team.`
      );
    }
    if (!post.author && !post.authorName) {
      throw new Error(
        `[content] Blog post "${slug}" has no author — set "author" (member slug) or "authorName".`
      );
    }
    if (!validCategories.has(post.category)) {
      throw new Error(
        `[content] Blog post "${slug}" has unknown category "${post.category}".`
      );
    }
  }
}
