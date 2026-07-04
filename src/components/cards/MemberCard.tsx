import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";
import { pick, teamRoleKey, type Member } from "@/lib/members";

export function MemberCard({ member }: { member: Member }) {
  const locale = useLocale();
  const t = useTranslations("team");
  const tr = useTranslations("roles");

  return (
    <Link
      className="mcard"
      data-reveal
      href={`/team/${member.slug}`}
      style={{
        textDecoration: "none",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        background: "var(--bg-elev)",
        padding: 28,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <Avatar photo={member.photo} initials={member.initials} size={60} radius={16} fontSize={20} />
        <div>
          <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 20, margin: "0 0 4px" }}>{member.name}</h3>
          <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, letterSpacing: "0.06em", color: "var(--accent)" }}>
            {tr(teamRoleKey[member.teamRole])}
          </div>
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 20px", flex: 1 }}>
        {pick(member.tagline, locale)}
      </p>
      <span className="m-go" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, color: "var(--text-muted)" }}>
        {t("viewProfile")}
      </span>
    </Link>
  );
}
