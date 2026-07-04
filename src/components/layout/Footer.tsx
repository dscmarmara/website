import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SOCIALS } from "@/lib/constants";
import {
  SocialLink,
  LinkedInIcon,
  InstagramIcon,
  MediumIcon,
} from "@/components/common/SocialIcons";

const FOOT_DEPARTMENTS = ["Data Insights", "Core AI", "Data Pipelines", "Summits & Awards"];

const footLink = {
  fontFamily: "var(--font-body-stack)",
  fontSize: 14,
  color: "var(--text-muted)",
} as const;

const footHeading = {
  fontFamily: "var(--font-display-stack)",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text)",
  margin: "0 0 18px",
} as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--border)", background: "var(--bg-elev)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--grad)", opacity: 0.6 }} />
      <div className="footer-grid" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "60px 24px 32px", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 48 }}>
        <div>
          <Link href="/" aria-label="Data Science Club" style={{ display: "inline-block", textDecoration: "none", color: "var(--text)", marginBottom: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/dsc_logo_dark.svg" alt="Data Science Club" style={{ height: 54, width: "auto", display: "block" }} />
          </Link>
          <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 340, margin: "0 0 22px" }}>
            {t("description")}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <SocialLink href={SOCIALS.linkedin} label="LinkedIn"><LinkedInIcon /></SocialLink>
            <SocialLink href={SOCIALS.instagram} label="Instagram"><InstagramIcon /></SocialLink>
            <SocialLink href={SOCIALS.medium} label="Medium"><MediumIcon /></SocialLink>
          </div>
        </div>

        <div>
          <h4 style={footHeading}>{t("exploreTitle")}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <Link className="dsc-foot-link author-link" href="/" style={footLink}>{t("linkHome")}</Link>
            <Link className="dsc-foot-link author-link" href="/about" style={footLink}>{t("linkAbout")}</Link>
            <Link className="dsc-foot-link author-link" href="/blog" style={footLink}>{t("linkBlog")}</Link>
            <Link className="dsc-foot-link author-link" href="/contact" style={footLink}>{t("linkContact")}</Link>
          </div>
        </div>

        <div>
          <h4 style={footHeading}>{t("departmentsTitle")}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {FOOT_DEPARTMENTS.map((d) => (
              <Link key={d} className="dsc-foot-link author-link" href="/about" style={footLink}>{d}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-body-stack)", fontSize: 13, color: "var(--text-muted)" }}>{t("copyright")}</span>
          <span style={{ fontFamily: "var(--font-body-stack)", fontSize: 12, letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "var(--glow-soft)" }} />
            {t("tagline")}
          </span>
        </div>
      </div>
    </footer>
  );
}
