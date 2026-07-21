import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlexusBg } from "@/components/effects/PlexusBg";
import { Reveal } from "@/components/effects/Reveal";
import { Avatar } from "@/components/common/Avatar";
import {
  SocialLink,
  LinkedInIcon,
  MailIcon,
  GlobeIcon,
} from "@/components/common/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getMemberBySlug,
  getMemberSlugs,
  getPrevNext,
  displayRole,
  pick,
} from "@/lib/members";
import { getPostsByAuthor } from "@/lib/posts";
import { buildAlternates, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return getMemberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) return {};
  return {
    title: m.name,
    description: pick(m.tagline, locale),
    alternates: await buildAlternates(`/team/${slug}`, locale),
  };
}

const chipStyle = {
  padding: "7px 14px",
  borderRadius: 100,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  fontFamily: "var(--font-body-stack)",
  fontSize: 13,
  color: "var(--text)",
} as const;

export default async function MemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const m = getMemberBySlug(slug);
  if (!m) notFound();

  const t = await getTranslations("member");
  const tr = await getTranslations("roles");
  const tk = await getTranslations("kpiLabels");
  const format = await getFormatter();

  const role = displayRole(m, tr);
  const { prev, next } = getPrevNext(slug);
  const posts = getPostsByAuthor(slug, locale);

  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const personLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: role,
    url: `${SITE_URL}${prefix}/team/${slug}`,
    worksFor: { "@type": "Organization", name: "Data Science Club — Marmara University" },
  };
  if (m.websiteUrl) personLd.sameAs = [m.websiteUrl];

  const MAXW = 1080;

  return (
    <>
      <JsonLd data={personLd} />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <PlexusBg density={1} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 18% 0,color-mix(in srgb,var(--accent) 10%,transparent),transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: MAXW, margin: "0 auto", padding: "48px 24px 64px" }}>
          <Link
            href="/team"
            data-reveal
            style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.06em", color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 40 }}
          >
            {t("backToTeam")}
          </Link>
          <div className="split member-hero" style={{ gap: 44, alignItems: "center" }}>
            <div data-reveal className="avatar-ring" style={{ position: "relative", width: 188, height: 188, flex: "none" }}>
              <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", borderRadius: 24, background: "var(--bg-elev)", display: "grid", placeItems: "center", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 10px,transparent 10px,transparent 20px)" }} />
                <Avatar photo={m.photo} initials={m.initials} size={0} variant="clip" fontSize={64} />
              </div>
            </div>
            <Reveal>
              <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 14 }}>{role}</div>
              <h1 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(38px,6vw,68px)", lineHeight: 1.02, margin: "0 0 16px" }}>{m.name}</h1>
              <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "54ch", margin: "0 0 24px" }}>{pick(m.tagline, locale)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <span style={{ padding: "6px 15px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--bg-elev)", fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.05em", color: "var(--accent)" }}>{m.dept}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <SocialLink href="#" label={t("linkedin")} size={40}><LinkedInIcon size={17} /></SocialLink>
                  <SocialLink href="#" label={t("email")} size={40}><MailIcon size={17} /></SocialLink>
                  {m.website && m.websiteUrl && (
                    <a
                      className="social-ico"
                      href={m.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("website")}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 15px", borderRadius: 10, border: "1px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", fontFamily: "var(--font-mono-stack)", fontSize: 12 }}
                    >
                      <GlobeIcon size={16} />
                      {m.website}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS — omitted for members with no published figures */}
      {m.kpis.length > 0 && (
        <section style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elev)" }}>
          <div data-reveal className="dsc-grid-3" style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 24px" }}>
            {m.kpis.map((k, i) => (
              <div key={k.label + i} style={{ padding: "30px 0", textAlign: "center", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 34, color: "var(--accent)", lineHeight: 1 }}>{k.num}</div>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-muted)", marginTop: 8 }}>{tk(k.label)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT + FOCUS */}
      <div className="split member-main" style={{ maxWidth: MAXW, margin: "0 auto", padding: "72px 24px 40px", gap: 56, alignItems: "start" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(22px,2.6vw,30px)", margin: "0 0 20px" }}>{t("about", { name: m.first })}</h2>
          <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.8, color: "var(--text)", margin: "0 0 20px" }}>{pick(m.bio1, locale)}</p>
          {pick(m.bio2, locale) && (
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", margin: "0 0 32px" }}>{pick(m.bio2, locale)}</p>
          )}
          {/* quote is only shown when the member actually has one — never invented */}
          {pick(m.quote, locale) && (
            <blockquote style={{ borderLeft: "3px solid var(--accent)", padding: "4px 0 4px 26px", margin: 0, boxShadow: "-1px 0 0 0 var(--accent),var(--glow-soft)" }}>
              <p style={{ fontFamily: "var(--font-display-stack)", fontWeight: 500, fontSize: "clamp(19px,2.2vw,24px)", lineHeight: 1.45, fontStyle: "italic", margin: 0 }}>“{pick(m.quote, locale)}”</p>
            </blockquote>
          )}
        </Reveal>
        <Reveal as="aside" style={{ border: "1px solid var(--border)", borderRadius: 16, background: "var(--bg-elev)", padding: 26 }}>
          <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 16 }}>{t("focusLabel")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {m.focus.map((f) => (
              <span key={f} style={chipStyle}>{f}</span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* WRITING */}
      {posts.length > 0 && (
        <section style={{ maxWidth: MAXW, margin: "0 auto", padding: "20px 24px 70px" }}>
          <Reveal style={{ marginBottom: 8, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(22px,2.6vw,30px)", margin: 0 }}>{t("writingTitle")}</h2>
            <Link href="/blog" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, color: "var(--accent)", textDecoration: "none" }}>{t("allPosts")}</Link>
          </Reveal>
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="art-row"
              data-reveal
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, textDecoration: "none", color: "var(--text)", padding: "22px 0", borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h3 className="art-title" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 19, margin: "0 0 6px" }}>{p.title}</h3>
                <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, color: "var(--text-muted)" }}>
                  {p.category} · {format.dateTime(new Date(p.date), { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-display-stack)", fontSize: 20, color: "var(--accent)", flex: "none" }}>→</span>
            </Link>
          ))}
        </section>
      )}

      {/* PREV / NEXT */}
      <section style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
        <div className="dsc-grid-2" style={{ maxWidth: MAXW, margin: "0 auto", padding: "40px 24px", gap: 20 }}>
          <Link className="glow-card glow-card--sm" href={`/team/${prev.slug}`} style={{ border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg)", padding: 22, textDecoration: "none", color: "var(--text)", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-display-stack)", fontSize: 22, color: "var(--accent)" }}>←</span>
            <Avatar photo={prev.photo} initials={prev.initials} size={46} radius={999} fontSize={15} />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--text-muted)" }}>{t("previous")}</span>
              <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 16 }}>{prev.name}</span>
            </span>
          </Link>
          <Link className="glow-card glow-card--sm" href={`/team/${next.slug}`} style={{ border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg)", padding: 22, textDecoration: "none", color: "var(--text)", display: "flex", alignItems: "center", gap: 16, justifyContent: "flex-end", textAlign: "right" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--text-muted)" }}>{t("next")}</span>
              <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 16 }}>{next.name}</span>
            </span>
            <Avatar photo={next.photo} initials={next.initials} size={46} radius={999} fontSize={15} />
            <span style={{ fontFamily: "var(--font-display-stack)", fontSize: 22, color: "var(--accent)" }}>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
