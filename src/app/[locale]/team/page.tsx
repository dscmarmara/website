import { Fragment } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Avatar } from "@/components/common/Avatar";
import { MemberCard } from "@/components/cards/MemberCard";
import { getGroupedTeam, pick } from "@/lib/members";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("team.title"),
    description: t("team.description"),
    alternates: await buildAlternates("/team", locale),
  };
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal style={{ display: "flex", alignItems: "center", gap: 16, margin: "52px 0 24px" }}>
      <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(18px,2vw,22px)", color: "var(--text)", whiteSpace: "nowrap" }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const tr = await getTranslations("roles");
  const grouped = getGroupedTeam();
  const president = grouped.president;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
        density={0.85}
        titleMaxWidth="15ch"
      />

      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "56px 24px 96px" }}>
        {/* PRESIDENT */}
        <Link
          className="mcard"
          data-reveal
          href={`/team/${president.slug}`}
          style={{ textDecoration: "none", color: "var(--text)", border: "1px solid var(--accent)", borderRadius: 22, background: "var(--bg-elev)", padding: 34, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", boxShadow: "var(--glow-soft)" }}
        >
          <Avatar photo={president.photo} initials={president.initials} size={88} radius={20} fontSize={30} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 8 }}>{tr("president")}</div>
            <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", margin: "0 0 10px" }}>{president.name}</h2>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", margin: 0, maxWidth: "60ch" }}>{pick(president.tagline, locale)}</p>
          </div>
          <span className="m-go" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, color: "var(--text-muted)" }}>{t("viewProfile")}</span>
        </Link>

        {/* VP + SECRETARY */}
        <GroupHeading>{t("vpHeading")}</GroupHeading>
        <div className="dsc-grid-2" style={{ gap: 24 }}>
          {grouped.vp.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </div>

        {/* DEPARTMENTS */}
        {grouped.departments.map((g) => (
          <Fragment key={g.dept}>
            <GroupHeading>{g.dept}</GroupHeading>
            <div className="dsc-grid-2" style={{ gap: 24 }}>
              {g.members.map((m) => (
                <MemberCard key={m.slug} member={m} />
              ))}
            </div>
          </Fragment>
        ))}

        {/* JOIN CTA */}
        <div data-reveal style={{ marginTop: 46, border: "1px dashed var(--border)", borderRadius: 18, background: "color-mix(in srgb,var(--accent) 5%,var(--bg-elev))", padding: 40, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", margin: "0 0 10px" }}>{t("joinTitle")}</h2>
          <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "48ch", margin: "0 auto 22px" }}>{t("joinSub")}</p>
          <Link
            href="/contact"
            className="lift-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "var(--glow-soft)" }}
          >
            {t("joinClub")}
          </Link>
        </div>
      </div>
    </>
  );
}
