import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlexusBg } from "@/components/effects/PlexusBg";
import { Reveal } from "@/components/effects/Reveal";
import { Avatar, PHOTO_QUALITY } from "@/components/common/Avatar";
import {
  SocialLink,
  LinkedInIcon,
  GitHubIcon,
  MailIcon,
  GlobeIcon,
} from "@/components/common/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbLd } from "@/components/seo/BreadcrumbLd";
import { memberJobTitle } from "@/lib/memberJobTitle";
import {
  getMemberBySlug,
  getMemberSlugs,
  getPrevNext,
  displayRole,
  initialsOf,
  pick,
} from "@/lib/members";
import { getPostsByAuthor } from "@/lib/posts";
import { skillLabel } from "@/lib/skills";
import { buildAlternates, clampDescription, openGraphBase, ORG_ID, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

/**
 * Member KPI figures are switched off until the numbers are confirmed, and
 * the band is left out with them. The figures remain in members.json
 * (`kpis`) — set this to true to show the band again.
 */
const SHOW_KPIS = false;

export function generateStaticParams() {
  return getMemberSlugs().map((slug) => ({ slug }));
}

// Only the slugs above exist; any other URL is a 404 instead of an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tagline = pick(m.tagline, locale);
  // The tagline alone ("Secretary of the club.") says neither who nor which club;
  // the club's name goes in whenever the snippet still fits.
  const withClub = t("member.description", { name: m.name, tagline });
  const description = withClub.length <= 160 ? withClub : clampDescription(`${m.name}: ${tagline}`);
  const alternates = await buildAlternates(`/team/${slug}`, locale);
  const og = openGraphBase(locale);
  // Shared profiles show the member's own card: photo, name and role on the club's design
  // (./opengraph-image.tsx), in the large 1200x630 format.
  const images = [{ url: `/${locale}/team/${slug}/opengraph-image`, width: 1200, height: 630, alt: m.name, type: "image/png" }];
  const title = t("titleTemplate").replace("%s", m.name);
  return {
    title: m.name,
    description,
    alternates,
    openGraph: { ...og, type: "profile", url: alternates.canonical, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function MemberPage({
  params,
}: PageProps<"/[locale]/team/[slug]">) {
  const { locale, slug } = await params;
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
  const tNav = await getTranslations("nav");
  const url = `${SITE_URL}${prefix}/team/${slug}`;
  const personLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: m.name,
    jobTitle: await memberJobTitle(m, locale),
    description: pick(m.tagline, locale),
    url,
    // A member of the club (the organisation node every page carries), not its employee.
    memberOf: { "@id": ORG_ID },
  };
  if (m.photo) personLd.image = `${SITE_URL}${m.photo}`;
  // `sameAs` is how a search engine ties this page to the real-world person:
  // other profile URLs it can cross-reference. LinkedIn is the strongest such
  // signal and nearly every member has one, whereas `github` / `websiteUrl` are
  // set for few — so LinkedIn goes first and the list is filtered rather than assumed.
  const sameAs = [m.linkedin, m.github, m.websiteUrl].filter((u): u is string => Boolean(u));
  if (sameAs.length) personLd.sameAs = sameAs;

  const MAXW = 1080;

  return (
    <>
      <JsonLd data={personLd} />
      <BreadcrumbLd trail={[{ href: "/team", name: tNav("team") }, { href: `/team/${slug}`, name: m.name }]} />

      {/* HERO */}
      <section className="member-top">
        <PlexusBg density={1} />
        <div className="member-top__glow" />
        <div className="member-top__inner" style={{ maxWidth: MAXW }}>
          <Link
            className="member-top__back"
            href="/team"
            data-reveal
          >
            {t("backToTeam")}
          </Link>
          <div className="split member-hero member-top__grid">
            <div data-reveal className="avatar-ring member-top__ring" style={{ position: "relative" }}>
              <div className="member-top__frame">
                {m.photo ? (
                  // The photo fills the panel; the size-based <Avatar> would render it at 0px here.
                  <Image className="member-top__img" src={m.photo} alt={m.name} fill sizes="188px" quality={PHOTO_QUALITY} preload />
                ) : (
                  <>
                    <div className="member-top__stripes" />
                    <Avatar photo={null} initials={initialsOf(m, locale)} size={0} variant="clip" fontSize={64} />
                  </>
                )}
              </div>
            </div>
            <Reveal>
              <div className="member-top__role">{role}</div>
              <h1 className="member-top__name">{m.name}</h1>
              <p className="member-top__tagline">{pick(m.tagline, locale)}</p>
              <div className="member-top__meta">
                <span className="member-top__dept">{m.dept}</span>
                <div className="member-top__socials">
                  {/* Only rendered for members who actually have one — no dead
                      "#" links. Fill in `linkedin` / `github` / `email` in members.json
                      (or later, the admin profile form) to switch them on. */}
                  {m.linkedin && (
                    <SocialLink href={m.linkedin} label={t("linkedin")} size={40} external><LinkedInIcon size={17} /></SocialLink>
                  )}
                  {m.github && (
                    <SocialLink href={m.github} label={t("github")} size={40} external><GitHubIcon size={17} /></SocialLink>
                  )}
                  {m.email && (
                    <SocialLink href={`mailto:${m.email}`} label={t("email")} size={40}><MailIcon size={17} /></SocialLink>
                  )}
                  {m.website && m.websiteUrl && (
                    <a
                      className="social-ico member-social"
                      href={m.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("website")}
                      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
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

      {/* STATS — only when figures are switched on and the member has some.
          Otherwise the hero's own bottom rule is the only divider: an empty
          band would be decoration with nothing to say. */}
      {SHOW_KPIS && m.kpis.length > 0 && (
        <section className="member-stats">
          <div data-reveal className="dsc-grid-3 member-stats__grid" style={{ maxWidth: MAXW }}>
            {m.kpis.map((k, i) => (
              <div className="member-stats__cell" key={k.label + i}>
                <div className="member-stats__value">{k.num}</div>
                <div className="member-stats__label">{tk(k.label)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT + FOCUS */}
      <div className="split member-main member-body" style={{ maxWidth: MAXW }}>
        <Reveal>
          <h2 className="member-body__title">{t("about", { name: m.first })}</h2>
          <p className="member-body__bio">{pick(m.bio1, locale)}</p>
          {pick(m.bio2, locale) && (
            <p className="member-body__bio-muted">{pick(m.bio2, locale)}</p>
          )}
          {/* quote is only shown when the member actually has one — never invented */}
          {pick(m.quote, locale) && (
            <blockquote className="member-quote">
              <p className="member-quote__text">“{pick(m.quote, locale)}”</p>
            </blockquote>
          )}
        </Reveal>
        <Reveal className="member-box" as="aside">
          <div className="member-box__label">{t("focusLabel")}</div>
          <div className="member-skills">
            {m.focus.map((skill) => (
              <span className="member-skill" key={skill}>{skillLabel(skill, locale)}</span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* WRITING */}
      {posts.length > 0 && (
        <section className="member-posts" style={{ maxWidth: MAXW }}>
          <Reveal className="member-posts__head">
            <h2 className="member-posts__title">{t("writingTitle")}</h2>
            <Link className="member-posts__all" href="/blog">{t("allPosts")}</Link>
          </Reveal>
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="art-row member-post"
              data-reveal
              style={{ color: "var(--text)", padding: "22px 0", borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h3 className="art-title member-post__title">{p.title}</h3>
                <span className="member-post__meta">
                  {p.category} · {format.dateTime(new Date(p.date), { year: "numeric", month: "short", day: "numeric" }).toLocaleUpperCase(locale)}
                </span>
              </div>
              <span className="member-post__arrow">→</span>
            </Link>
          ))}
        </section>
      )}

      {/* PREV / NEXT */}
      <section className="member-nav">
        <div className="dsc-grid-2 member-nav__grid" style={{ maxWidth: MAXW }}>
          <Link className="glow-card glow-card--sm member-nav__card" href={`/team/${prev.slug}`} style={{ border: "1px solid var(--border)" }}>
            <span className="member-nav__arrow">←</span>
            <Avatar photo={prev.photo} initials={initialsOf(prev, locale)} size={46} radius={999} fontSize={15} />
            <span className="member-nav__text">
              <span className="member-nav__label">{t("previous")}</span>
              <span className="member-nav__name">{prev.name}</span>
            </span>
          </Link>
          <Link className="glow-card glow-card--sm member-nav__card-next" href={`/team/${next.slug}`} style={{ border: "1px solid var(--border)" }}>
            <span className="member-nav__text-next">
              <span className="member-nav__label">{t("next")}</span>
              <span className="member-nav__name">{next.name}</span>
            </span>
            <Avatar photo={next.photo} initials={initialsOf(next, locale)} size={46} radius={999} fontSize={15} />
            <span className="member-nav__arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
