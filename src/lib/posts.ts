import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getMemberSlugs } from "@/lib/members";
import { DEPARTMENTS } from "@/lib/constants";
import { routing } from "@/i18n/routing";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  author: string; // member slug — resolved to a person via getMemberBySlug
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

export function getPostSlugs(): string[] {
  // Slugs are language-independent; the default-locale folder is canonical.
  const dir = localeDir(routing.defaultLocale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readFrontmatter(slug: string, locale: string): Post | null {
  let file = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    // Missing translation → fall back to the default locale.
    file = path.join(localeDir(routing.defaultLocale), `${slug}.mdx`);
    if (!fs.existsSync(file)) return null;
  }
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

/**
 * Build-time integrity guard: every post's author must exist in members.json
 * and every category must be a real department. A broken link fails the build
 * instead of silently 404-ing at runtime.
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
    if (!memberSlugs.has(post.author)) {
      throw new Error(
        `[content] Blog post "${slug}" has unknown author "${post.author}" — not found in members.json.`
      );
    }
    if (!validCategories.has(post.category)) {
      throw new Error(
        `[content] Blog post "${slug}" has unknown category "${post.category}".`
      );
    }
  }
}
