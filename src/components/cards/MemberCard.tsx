import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";
import { initialsOf, pick, teamRoleKey, type Member } from "@/lib/members";

export function MemberCard({ member }: { member: Member }) {
  const locale = useLocale();
  const t = useTranslations("team");
  const tr = useTranslations("roles");

  return (
    <Link
      className="mcard member-card"
      data-reveal
      href={`/team/${member.slug}`}
      style={{ color: "var(--text)", border: "1px solid var(--border)" }}
    >
      <div className="member-card__head">
        <Avatar photo={member.photo} initials={initialsOf(member, locale)} size={60} radius={16} fontSize={20} />
        <div>
          <h3 className="member-card__name">{member.name}</h3>
          <div className="member-card__role">
            {tr(teamRoleKey[member.teamRole])}
          </div>
        </div>
      </div>
      <p className="member-card__tagline">
        {pick(member.tagline, locale)}
      </p>
      <span className="m-go member-card__go" style={{ gap: 8, color: "var(--text-muted)" }}>
        {t("viewProfile")}
      </span>
    </Link>
  );
}
