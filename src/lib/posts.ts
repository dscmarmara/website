import {
  getMemberBySlug,
  getMemberSlugs,
  initialsFromName,
  initialsOf,
  type Member,
} from "@/lib/members";
import { DEPARTMENTS } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { readEntry, slugsOf } from "@/lib/content";
import { IS_PRODUCTION } from "@/lib/env";
import type { PostRowData } from "@/components/cards/PostRow";

export { localeChain } from "@/lib/content";

export interface PostFrontmatter {
  title: string;
  author?: string; // member slug — resolved to a person via getMemberBySlug
  authorName?: string; // instead of `author` when the writer isn't in members.json; shown unlinked
  date: string; // ISO, e.g. "2026-06-22"
  updated?: string; // ISO; set when a published post is revised (JSON-LD dateModified)
  category: string; // one of DEPARTMENTS
  readingTime: string; // e.g. "7 MIN"
  excerpt: string;
  featured?: boolean;
  /** Shown on previews only (with a notice); the live site never lists or serves it. */
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
}

/** Post slugs (content/blog/en; see slugsOf for the `_template.mdx` rule). Drafts only off the live site. */
export function getPostSlugs(): string[] {
  return slugsOf("blog").filter((slug) => !(IS_PRODUCTION && readFrontmatter(slug, routing.defaultLocale)?.draft));
}

function readFrontmatter(slug: string, locale: string): Post | null {
  // Missing translation → fall back along localeChain.
  return readEntry<PostFrontmatter>("blog", slug, locale);
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  // Only listed slugs exist, even when a URL is requested directly: no `_template`,
  // and no drafts on the live site.
  return getPostSlugs().includes(slug) ? readFrontmatter(slug, locale) : null;
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
  /** The member's photo, if any; otherwise the avatar shows the initials. */
  photo: string | null;
  /** Set when the author is on the team; the byline then links to their profile. */
  member?: Member;
}

/** A post's byline: a team member (`author`) or a plain name (`authorName`). */
export function getPostAuthor(post: Post, locale: string): PostAuthor | undefined {
  const member = post.author ? getMemberBySlug(post.author) : undefined;
  if (member) return { name: member.name, initials: initialsOf(member, locale), photo: member.photo, member };
  if (post.authorName) return { name: post.authorName, initials: initialsFromName(post.authorName), photo: null };
  return undefined;
}

/** A post as a list row (blog list, "more from the blog"). */
export function postRowData(p: Post, locale: string): PostRowData {
  const a = getPostAuthor(p, locale);
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readingTime: p.readingTime,
    authorSlug: a?.member?.slug,
    authorName: a?.name,
    authorInitials: a?.initials,
    authorPhoto: a?.photo,
  };
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
