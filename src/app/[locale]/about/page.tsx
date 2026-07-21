import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";
import { DepartmentAccordions } from "@/components/about/DepartmentAccordions";
import { getMembers, departmentOrder } from "@/lib/members";
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
  // Counts for the team call-to-action, derived from the data so they stay
  // correct as the roster changes.
  const memberCount = getMembers().length;
  const departmentCount = departmentOrder.length;

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
          <Reveal>
            <h2 style={{ ...h2Style, fontSize: "clamp(26px,3.2vw,38px)", lineHeight: 1.1, margin: "0 0 16px" }}>{t("storyTitle")}</h2>
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

        {/* Points at /team rather than repeating the roster here. The long-form
            block lives on in components/about/AboutTeamRoster.tsx. */}
        <Reveal
          className="glow-card"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 20,
            background: "var(--bg-elev)",
            padding: "clamp(40px,6vw,64px) 32px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(36px,7vw,72px)", flexWrap: "wrap", marginBottom: 30 }}>
            {[
              { num: memberCount, label: t("peopleLabel") },
              { num: departmentCount, label: t("departmentsLabel") },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 40, color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.12em", color: "var(--text-muted)", marginTop: 9 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link
            href="/team"
            className="lift-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 28px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15, textDecoration: "none" }}
          >
            {t("meetEveryone")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
