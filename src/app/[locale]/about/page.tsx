import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";
import { DepartmentAccordions } from "@/components/about/DepartmentAccordions";
import { DevFlagGate } from "@/components/dev/DevFlagGate";
import { getMembers, departmentOrder, pick } from "@/lib/members";
import { ABOUT_FLOW } from "@/lib/constants";
import { IS_PRODUCTION } from "@/lib/env";
import { buildAlternates, pageOpenGraph } from "@/lib/seo";
import { BreadcrumbLd } from "@/components/seo/BreadcrumbLd";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = await buildAlternates("/about", locale);
  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates,
    openGraph: pageOpenGraph(locale, alternates.canonical),
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
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  // Counts for the team call-to-action, derived from the data so they stay
  // correct as the roster changes.
  const memberCount = getMembers().length;
  const departmentCount = departmentOrder.length;

  return (
    <>
      <BreadcrumbLd trail={[{ href: "/about", name: tNav("about") }]} />
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
            {/* The old-copy locales have no intro and render without it. */}
            {t.has("orgSub") && (
              <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "62ch", margin: "14px 0 0" }}>{t("orgSub")}</p>
            )}
          </Reveal>
          <DepartmentAccordions />
        </div>
      </section>

      {/* HANDOFFS: how work moves between the departments. Preview-only for
          now: shown when "Paslaşma" is on in the dev options bar, never on
          the live site (checked here too, so its markup is not even sent
          there). The old-copy locales have no such section. */}
      {!IS_PRODUCTION && t.has("flowTitle") && (
        <DevFlagGate flag="flow">
          <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px 24px 0" }}>
            <Reveal style={{ marginBottom: 44 }}>
              <Eyebrow style={{ marginBottom: 12 }}>{t("flowEyebrow")}</Eyebrow>
              <h2 style={h2Style}>{t("flowTitle")}</h2>
              <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "68ch", margin: "14px 0 0" }}>{t("flowSub")}</p>
            </Reveal>
            <ol className="dsc-grid-3" style={{ gap: 22, listStyle: "none", padding: 0, margin: 0 }}>
              {ABOUT_FLOW.map((step, i) => (
                <li
                  key={step.name}
                  className="glow-card"
                  data-reveal
                  style={{ border: "1px solid var(--border)", borderRadius: 16, background: "var(--bg-elev)", padding: 28 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 12,
                        background: "color-mix(in srgb,var(--accent) 12%,transparent)",
                        border: "1px solid var(--border)",
                        color: "var(--accent)",
                        fontFamily: "var(--font-display-stack)",
                        fontWeight: 700,
                        fontSize: 17,
                      }}
                    >
                      {i + 1}
                    </span>
                    {i < ABOUT_FLOW.length - 1 && (
                      <span aria-hidden style={{ fontFamily: "var(--font-display-stack)", fontSize: 20, color: "var(--accent)" }}>→</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 18, margin: "0 0 8px" }}>{step.name}</h3>
                  <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{pick(step.text, locale)}</p>
                </li>
              ))}
            </ol>
          </section>
        </DevFlagGate>
      )}

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
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.12em", color: "var(--text-muted)", marginTop: 9 }}>{s.label}</div>
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
