import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { routing } from "@/i18n/routing";
import { slugify } from "@/lib/slug";

/** MDX content collections: content/<collection>/<locale>/<slug>.mdx */
export type Collection = "blog" | "projects";

const dirOf = (collection: Collection, locale: string) => path.join(process.cwd(), "content", collection, locale);

/**
 * Content folders to try for a locale, in order: the locale itself, its base
 * language ("tr-x-eski" → "tr"), then the default locale.
 */
export function localeChain(locale: string): string[] {
  return [...new Set([locale, locale.split("-")[0], routing.defaultLocale])];
}

export function slugsOf(collection: Collection): string[] {
  // Slugs are language-independent; the default-locale folder is canonical.
  const dir = dirOf(collection, routing.defaultLocale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    // `_`-prefixed files are drafts/templates, not entries. `_template.mdx` also
    // keeps at least one module in each folder: bodies are loaded with a dynamic
    // `import()`, and with zero .mdx files the bundler cannot build that import
    // map and the production build fails to resolve it.
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** The file used for a locale: missing translations fall back along localeChain. */
function sourceFile(collection: Collection, slug: string, locale: string): string | undefined {
  return localeChain(locale)
    .map((l) => path.join(dirOf(collection, l), `${slug}.mdx`))
    .find((f) => fs.existsSync(f));
}

export function readEntry<T>(collection: Collection, slug: string, locale: string): (T & { slug: string }) | null {
  const file = sourceFile(collection, slug, locale);
  if (!file) return null;
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return { slug, ...(data as T) };
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Markdown inline syntax → the plain text the heading renders as. */
const plain = (s: string) =>
  s
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();

/** The ## / ### headings of an entry (outside code blocks), for its table of contents. */
export function headingsOf(collection: Collection, slug: string, locale: string): Heading[] {
  const file = sourceFile(collection, slug, locale);
  if (!file) return [];
  const { content } = matter(fs.readFileSync(file, "utf8"));
  const out: Heading[] = [];
  let fence: string | null = null;
  for (const line of content.split(/\r?\n/)) {
    const f = line.match(/^\s*(```|~~~)/);
    if (f) {
      fence = fence === null ? f[1] : fence === f[1] ? null : fence;
      continue;
    }
    if (fence) continue;
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const text = plain(m[2]);
      out.push({ id: slugify(text), text, level: m[1].length as 2 | 3 });
    }
  }
  return out;
}

/** The body's first paragraph as plain text (to skip a standfirst that would only repeat it). */
export function firstParagraphOf(collection: Collection, slug: string, locale: string): string {
  const file = sourceFile(collection, slug, locale);
  if (!file) return "";
  const { content } = matter(fs.readFileSync(file, "utf8"));
  const para = content
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|<|>|```|~~~|import |export |[-*+] |\d+\. |\|)/.test(b));
  return para ? plain(para.replace(/\s+/g, " ")) : "";
}
