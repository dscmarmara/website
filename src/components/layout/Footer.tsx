import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SOCIALS } from "@/lib/constants";
import {
  SocialLink,
  LinkedInIcon,
  InstagramIcon,
  GitHubIcon,
} from "@/components/common/SocialIcons";

const FOOT_DEPARTMENTS = ["Data Insights", "Core AI", "Data Pipelines", "Summits & Awards"];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="site-footer">
      <div className="site-footer__line" />
      <div className="footer-grid site-footer__grid" style={{ gridTemplateColumns: "1.6fr 1fr 1fr" }}>
        <div>
          <Link className="site-footer__brand" href="/" aria-label="Data Science Club">
            {/* width/height: the SVG viewBox ratio, so its width is reserved before it loads (CSS sets the size). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="site-footer__logo" src="/logo/dsc_logo_dark.svg" alt="Data Science Club" width={2350} height={1920} />
          </Link>
          <p className="site-footer__about">
            {t("description")}
          </p>
          <div className="site-footer__social">
            <SocialLink href={SOCIALS.linkedin} label="LinkedIn" external><LinkedInIcon /></SocialLink>
            <SocialLink href={SOCIALS.instagram} label="Instagram" external><InstagramIcon /></SocialLink>
            <SocialLink href={SOCIALS.github} label="GitHub" external><GitHubIcon /></SocialLink>
          </div>
        </div>

        <div>
          <h4 className="site-footer__heading">{t("exploreTitle")}</h4>
          <div className="site-footer__list">
            <Link className="dsc-foot-link author-link site-footer__link" href="/" style={{ color: "var(--text-muted)" }}>{t("linkHome")}</Link>
            <Link className="dsc-foot-link author-link site-footer__link" href="/about" style={{ color: "var(--text-muted)" }}>{t("linkAbout")}</Link>
            <Link className="dsc-foot-link author-link site-footer__link" href="/blog" style={{ color: "var(--text-muted)" }}>{t("linkBlog")}</Link>
            <Link className="dsc-foot-link author-link site-footer__link" href="/contact" style={{ color: "var(--text-muted)" }}>{t("linkContact")}</Link>
          </div>
        </div>

        <div>
          <h4 className="site-footer__heading">{t("departmentsTitle")}</h4>
          <div className="site-footer__list">
            {FOOT_DEPARTMENTS.map((d) => (
              <Link key={d} className="dsc-foot-link author-link site-footer__link" href="/about" style={{ color: "var(--text-muted)" }}>{d}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__bottom-row">
          <span className="site-footer__copy">{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
