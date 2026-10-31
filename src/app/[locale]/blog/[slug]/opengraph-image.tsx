import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";
import { getPostAuthor, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { C, Eyebrow, OG_SIZE, OG_TYPE, ogCard, teamPhotoDataUri } from "@/lib/og";

export const alt = "DSC Marmara · Blog";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Rendered at build time for every post in every served locale; drafts only where they are
// shown (previews and staging, see getPostSlugs).
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).flatMap((locale) => getPostSlugs().map((slug) => ({ locale, slug })));
}
export const dynamicParams = false;

const AVATAR = 72;

/** A post's share card, in the page's language: department, title, and the byline with the author's photo. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  // As in ../../opengraph-image.tsx: any other locale or slug is a 404, never a fresh render.
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();
  const author = getPostAuthor(post, locale);
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const tBlog = await getTranslations({ locale, namespace: "blog" });
  const format = await getFormatter({ locale });
  const date = format.dateTime(new Date(post.date), { year: "numeric", month: "short", day: "numeric" }).toLocaleUpperCase(locale);
  const photo = author?.photo ? await teamPhotoDataUri(author.photo, AVATAR * 2) : null;
  // Long titles step down so they stay within three lines.
  const titleSize = post.title.length <= 36 ? 72 : post.title.length <= 64 ? 58 : 48;

  return ogCard(
    tBrand("university").toLocaleUpperCase(locale),
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Department names stay English, so they are uppercased without the Turkish dotted İ. */}
      <Eyebrow>{`BLOG · ${post.category.toLocaleUpperCase("en")}`}</Eyebrow>
      <div style={{ fontFamily: "Bricolage", fontWeight: 700, fontSize: titleSize, lineHeight: 1.08, letterSpacing: -1, marginTop: 20, maxWidth: 1040 }}>{post.title}</div>
      {author && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} width={AVATAR} height={AVATAR} alt="" style={{ borderRadius: AVATAR, border: `3px solid ${C.accent}` }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: AVATAR, height: AVATAR, borderRadius: AVATAR, background: C.grad, color: "#04190a", fontFamily: "Bricolage", fontWeight: 700, fontSize: 26 }}>
              {author.initials}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 26 }}>{author.name}</div>
            <div style={{ fontWeight: 500, fontSize: 18, letterSpacing: 1.8, color: C.muted }}>{`${date} · ${post.readingTime} ${tBlog("readSuffix")}`}</div>
          </div>
        </div>
      )}
    </div>
  );
}
