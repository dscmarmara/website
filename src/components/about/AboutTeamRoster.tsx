import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/common/Avatar";
import { MemberCard } from "@/components/cards/MemberCard";
import { SocialLink, LinkedInIcon } from "@/components/common/SocialIcons";
import { pick, type Member } from "@/lib/members";

/**
 * The full roster block that used to sit in the About page's team section:
 * a president highlight card followed by a card per remaining member.
 *
 * NOT currently rendered. The About page now links out to /team instead of
 * repeating it, but this is kept intact so the block can be dropped back in
 * with a single <AboutTeamRoster … /> should we want the long form again.
 */
export function AboutTeamRoster({
  president,
  others,
  locale,
  presidentRole,
  viewFullProfileLabel,
}: {
  president: Member;
  others: Member[];
  locale: string;
  /** e.g. t("roles.presidentFull") */
  presidentRole: string;
  /** e.g. t("about.viewFullProfile") */
  viewFullProfileLabel: string;
}) {
  return (
    <>
      {/* President highlight */}
      <article data-reveal className="glow-card" style={{ border: "1px solid var(--accent)", borderRadius: 20, background: "var(--bg-elev)", overflow: "hidden", display: "grid", marginBottom: 30, boxShadow: "var(--glow-soft)" }}>
        <div className="split prez">
          <div style={{ position: "relative", background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 10px,transparent 10px,transparent 20px)", minHeight: 240, display: "grid", placeItems: "center", borderRight: "1px solid var(--border)" }}>
            <Avatar photo={president.photo} initials={president.initials} size={0} variant="clip" fontSize={72} />
          </div>
          <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 14 }}>{presidentRole}</div>
            <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(26px,3vw,34px)", margin: "0 0 14px" }}>{president.name}</h3>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 22px", maxWidth: "60ch" }}>{pick(president.bio1, locale)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Link href={`/team/${president.slug}`} className="lift-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>{viewFullProfileLabel}</Link>
              {president.linkedin && (
                <SocialLink href={president.linkedin} label="LinkedIn" external><LinkedInIcon /></SocialLink>
              )}
            </div>
          </div>
        </div>
      </article>

      <div className="dsc-grid-3" style={{ gap: 26 }}>
        {others.map((m) => (
          <MemberCard key={m.slug} member={m} />
        ))}
      </div>
    </>
  );
}
