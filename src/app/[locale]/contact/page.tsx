import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  SocialLink,
  LinkedInIcon,
  InstagramIcon,
} from "@/components/common/SocialIcons";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: await buildAlternates("/contact", locale),
  };
}

const cardStyle = {
  border: "1px solid var(--border)",
  borderRadius: 16,
  background: "var(--bg-elev)",
  padding: 26,
} as const;

const cardLabel = {
  fontFamily: "var(--font-mono-stack)",
  fontSize: 11,
  letterSpacing: "0.12em",
  color: "var(--accent)",
} as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        sub={t("heroSub")}
        density={0.8}
        padding="96px 24px 70px"
        titleMaxWidth="16ch"
      />

      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "80px 24px 100px" }}>
        <div className="split contact" style={{ gap: 56, alignItems: "start" }}>
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal as="aside" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={cardStyle}>
              <div style={{ ...cardLabel, marginBottom: 8 }}>{t("emailUs")}</div>
              <a
                className="author-link"
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 18, color: "var(--text)", textDecoration: "none", wordBreak: "break-all" }}
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div style={cardStyle}>
              <div style={{ ...cardLabel, marginBottom: 14 }}>{t("follow")}</div>
              <div style={{ display: "flex", gap: 12 }}>
                <SocialLink href={SOCIALS.linkedin} label="LinkedIn" size={44} radius={11} external><LinkedInIcon size={19} /></SocialLink>
                <SocialLink href={SOCIALS.instagram} label="Instagram" size={44} radius={11} external><InstagramIcon size={19} /></SocialLink>
              </div>
            </div>

            <div style={{ border: "1px solid var(--accent)", borderRadius: 16, background: "color-mix(in srgb,var(--accent) 9%,var(--bg-elev))", padding: 26, boxShadow: "var(--glow-soft)" }}>
              <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 19, margin: "0 0 8px" }}>{t("applyTitle")}</h3>
              <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 18px" }}>{t("applyBody")}</p>
              <a
                href="#"
                className="lift-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                {t("applyNow")}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
