import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  SocialLink,
  LinkedInIcon,
  InstagramIcon,
  GitHubIcon,
} from "@/components/common/SocialIcons";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";
import { ClientMessages } from "@/components/i18n/ClientMessages";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: await buildAlternates("/contact", locale),
  };
}

export default async function ContactPage() {
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

      <div className="contact-page">
        <div className="split contact contact-page__grid">
          <Reveal>
            <ClientMessages namespaces={["contact"]}>
              <ContactForm />
            </ClientMessages>
          </Reveal>

          <Reveal className="contact-aside" as="aside">
            <div className="contact-card">
              <div className="contact-card__label">{t("emailUs")}</div>
              <a
                className="author-link contact-card__mail"
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ color: "var(--text)" }}
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-social__label">{t("follow")}</div>
              <div className="contact-social">
                <SocialLink href={SOCIALS.linkedin} label="LinkedIn" size={44} radius={11} external><LinkedInIcon size={19} /></SocialLink>
                <SocialLink href={SOCIALS.instagram} label="Instagram" size={44} radius={11} external><InstagramIcon size={19} /></SocialLink>
                <SocialLink href={SOCIALS.github} label="GitHub" size={44} radius={11} external><GitHubIcon size={19} /></SocialLink>
              </div>
            </div>

            <div className="contact-join">
              <h3 className="contact-join__title">{t("applyTitle")}</h3>
              <p className="contact-join__text">{t("applyBody")}</p>
              <a
                href="#"
                className="lift-btn contact-join__btn"
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
