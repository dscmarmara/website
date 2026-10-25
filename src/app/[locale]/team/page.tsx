import { Fragment } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Avatar } from "@/components/common/Avatar";
import { MemberCard } from "@/components/cards/MemberCard";
import { getGroupedTeam, initialsOf, pick } from "@/lib/members";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team">): Promise<Metadata> {
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
    <div className="team-group" data-reveal>
      <span className="team-group__title">{children}</span>
      <span className="team-group__rule" />
    </div>
  );
}

export default async function TeamPage({
  params,
}: PageProps<"/[locale]/team">) {
  const { locale } = await params;
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

      <div className="team-page">
        {/* PRESIDENT */}
        <Link
          className="mcard team-prez"
          data-reveal
          href={`/team/${president.slug}`}
          style={{ color: "var(--text)", border: "1px solid var(--accent)", gap: 28, boxShadow: "var(--glow-soft)" }}
        >
          <Avatar photo={president.photo} initials={initialsOf(president, locale)} size={88} radius={20} fontSize={30} />
          <div className="team-prez__body">
            <div className="team-prez__role">{tr("president")}</div>
            <h2 className="team-prez__name">{president.name}</h2>
            <p className="team-prez__tagline">{pick(president.tagline, locale)}</p>
          </div>
          <span className="m-go member-card__go" style={{ gap: 8, color: "var(--text-muted)" }}>{t("viewProfile")}</span>
        </Link>

        {/* VP + SECRETARY */}
        <GroupHeading>{t("vpHeading")}</GroupHeading>
        <div className="dsc-grid-2 team-grid">
          {grouped.vp.map((m) => (
            <MemberCard key={m.slug} member={m} />
          ))}
        </div>

        {/* DEPARTMENTS */}
        {grouped.departments.map((g) => (
          <Fragment key={g.dept}>
            <GroupHeading>{g.dept}</GroupHeading>
            <div className="dsc-grid-2 team-grid">
              {g.members.map((m) => (
                <MemberCard key={m.slug} member={m} />
              ))}
            </div>
          </Fragment>
        ))}

        {/* JOIN CTA */}
        <div className="team-join" data-reveal>
          <h2 className="team-join__title">{t("joinTitle")}</h2>
          <p className="team-join__sub">{t("joinSub")}</p>
          <Link
            href="/contact"
            className="lift-btn team-join__btn"
            style={{ boxShadow: "var(--glow-soft)" }}
          >
            {t("joinClub")}
          </Link>
        </div>
      </div>
    </>
  );
}
