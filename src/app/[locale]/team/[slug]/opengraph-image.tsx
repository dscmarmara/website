import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { isServedLocale, routing } from "@/i18n/routing";
import { displayRole, getMemberBySlug, getMemberSlugs, initialsOf } from "@/lib/members";
import { C, Eyebrow, OG_SIZE, OG_TYPE, ogCard, teamPhotoDataUri } from "@/lib/og";

export const alt = "DSC Marmara · Data Science Club";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Rendered at build time for every member in every served locale. An image route lists all its
// params itself: with only `slug` here, no card was prerendered and every one was a 404.
export function generateStaticParams() {
  return routing.locales.filter(isServedLocale).flatMap((locale) => getMemberSlugs().map((slug) => ({ locale, slug })));
}
export const dynamicParams = false;

const PHOTO = 330;

/** A member's share card, in the page's language: role, name, and the photo framed as on their page. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  // As in ../../opengraph-image.tsx: any other locale or slug is a 404, never a fresh render.
  if (!hasLocale(routing.locales, locale) || !isServedLocale(locale)) notFound();
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const tRoles = await getTranslations({ locale, namespace: "roles" });
  const photo = m.photo ? await teamPhotoDataUri(m.photo, PHOTO) : null;

  return ogCard(
    tBrand("university").toLocaleUpperCase(locale),
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 56 }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Eyebrow>{displayRole(m, tRoles)}</Eyebrow>
        <div style={{ fontFamily: "Bricolage", fontWeight: 700, fontSize: 78, lineHeight: 1.04, letterSpacing: -1.5, marginTop: 20 }}>{m.name}</div>
      </div>
      {/* The member page's photo frame: rounded square inside a green gradient ring. */}
      <div style={{ display: "flex", padding: 6, borderRadius: 44, background: C.grad, boxShadow: "0 0 56px rgba(77,255,0,0.35)" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={PHOTO} height={PHOTO} alt="" style={{ borderRadius: 38 }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: PHOTO, height: PHOTO, borderRadius: 38, background: "#0a0a0a", fontFamily: "Bricolage", fontWeight: 700, fontSize: 110 }}>
            {initialsOf(m, locale)}
          </div>
        )}
      </div>
    </div>
  );
}
