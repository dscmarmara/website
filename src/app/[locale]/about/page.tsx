import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Avatar } from "@/components/common/Avatar";
import { MemberCard } from "@/components/cards/MemberCard";
import { DepartmentAccordions } from "@/components/about/DepartmentAccordions";
import { SocialLink, LinkedInIcon } from "@/components/common/SocialIcons";
import { getDepartmentTeasers, getMemberBySlug, pick } from "@/lib/members";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: await buildAlternates("/about", locale),
  };
}

const h2Style = {
  fontFamily: "var(--font-display-stack)",
  fontWeight: 700,
  fontSize: "clamp(28px,3.6vw,42px)",
  margin: 0,
} as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tr = await getTranslations("roles");
  const president = getMemberBySlug("ahmet")!;
  const teasers = getDepartmentTeasers();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        glitch
        density={0.9}
        padding="104px 24px 84px"
        titleMaxWidth="18ch"
      />

      {/* STORY */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "90px 24px" }}>
        <div className="split story" style={{ gap: 60, alignItems: "start" }}>
          <Reveal style={{ position: "sticky", top: 96 }}>
            <h2 style={{ ...h2Style, fontSize: "clamp(26px,3.2vw,38px)", lineHeight: 1.1, margin: "0 0 16px" }}>{t("storyTitle")}</h2>
            <p style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.1em", color: "var(--accent)", margin: 0 }}>{t("storyEst")}</p>
          </Reveal>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.8, color: "var(--text)", margin: 0 }}>{t("storyP1")}</p>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>{t("storyP2")}</p>
            <blockquote style={{ borderLeft: "3px solid var(--accent)", padding: "6px 0 6px 28px", margin: "14px 0", boxShadow: "-1px 0 0 0 var(--accent),var(--glow-soft)" }}>
              <p style={{ fontFamily: "var(--font-display-stack)", fontWeight: 500, fontSize: "clamp(20px,2.4vw,27px)", lineHeight: 1.45, fontStyle: "italic", margin: 0 }}>{t("pullQuote")}</p>
            </blockquote>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>{t("storyP3")}</p>
          </Reveal>
        </div>
      </section>

      {/* DEPARTMENTS DETAIL */}
      <section style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "90px 24px" }}>
          <Reveal style={{ marginBottom: 44 }}>
            <Eyebrow style={{ marginBottom: 12 }}>{t("orgEyebrow")}</Eyebrow>
            <h2 style={h2Style}>{t("orgTitle")}</h2>
          </Reveal>
          <DepartmentAccordions />
        </div>
      </section>

      {/* TEAM */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px 24px" }}>
        <Reveal style={{ marginBottom: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>{t("teamEyebrow")}</Eyebrow>
            <h2 style={h2Style}>{t("teamTitle")}</h2>
          </div>
          <Link href="/team" className="lift-arrow" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 15, color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>{t("meetEveryone")}</Link>
        </Reveal>

        {/* President highlight */}
        <article data-reveal className="glow-card" style={{ border: "1px solid var(--accent)", borderRadius: 20, background: "var(--bg-elev)", overflow: "hidden", display: "grid", marginBottom: 30, boxShadow: "var(--glow-soft)" }}>
          <div className="split prez">
            <div style={{ position: "relative", background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 10px,transparent 10px,transparent 20px)", minHeight: 240, display: "grid", placeItems: "center", borderRight: "1px solid var(--border)" }}>
              <Avatar photo={president.photo} initials={president.initials} size={0} variant="clip" fontSize={72} />
            </div>
            <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 14 }}>{tr("presidentFull")}</div>
              <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(26px,3vw,34px)", margin: "0 0 14px" }}>{president.name}</h3>
              <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 22px", maxWidth: "60ch" }}>{pick(president.bio1, locale)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Link href={`/team/${president.slug}`} className="lift-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>{t("viewFullProfile")}</Link>
                <SocialLink href="#" label="LinkedIn"><LinkedInIcon /></SocialLink>
              </div>
            </div>
          </div>
        </article>

        <div className="dsc-grid-3" style={{ gap: 26 }}>
          {teasers.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </div>
      </section>
    </>
  );
}
