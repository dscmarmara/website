import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlitchHeading } from "@/components/effects/GlitchHeading";
import { PlexusBg } from "@/components/effects/PlexusBg";
import { Hexgrid } from "@/components/effects/Hexgrid";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { DepartmentCard } from "@/components/cards/DepartmentCard";
import { pick } from "@/lib/members";
import { HOME_STATS, HOME_PROJECTS, HOME_DEPARTMENTS } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    // No `title` on purpose: `title.template` in the layout does not apply to a
    // page in the same route segment, so setting one here emitted a bare
    // "Home" as the homepage <title> (and og:title). Omitting it falls through
    // to the layout's `title.default`, which carries the brand.
    description: t("home.description"),
    alternates: await buildAlternates("/", locale),
  };
}

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  padding: "15px 30px",
  borderRadius: 10,
  background: "var(--grad)",
  color: "#04190a",
  fontFamily: "var(--font-body-stack)",
  fontWeight: 700,
  fontSize: 15,
  textDecoration: "none",
  boxShadow: "var(--glow-soft)",
} as const;

const outlineBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  padding: "15px 30px",
  borderRadius: 10,
  background: "transparent",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontFamily: "var(--font-body-stack)",
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
} as const;

const h2Style = {
  fontFamily: "var(--font-display-stack)",
  fontWeight: 700,
  fontSize: "clamp(28px,3.6vw,42px)",
  lineHeight: 1.1,
  margin: 0,
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <PlexusBg density={1.1} />
        <Hexgrid
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            WebkitMaskImage: "radial-gradient(130% 90% at 78% 10%,#000,transparent 68%)",
            maskImage: "radial-gradient(130% 90% at 78% 10%,#000,transparent 68%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: "var(--maxw)", margin: "0 auto", padding: "120px 24px 104px" }}>
          <GlitchHeading
            text={t("heroTitle")}
            hover
            style={{
              fontFamily: "var(--font-script-stack)",
              fontWeight: 700,
              paddingBottom: "0.09em",
              fontSize: "clamp(40px,7vw,80px)",
              lineHeight: 1.03,
              margin: "0 0 26px",
              maxWidth: "18ch",
            }}
          />
          <Reveal
            as="p"
            style={{ fontFamily: "var(--font-body-stack)", fontSize: "clamp(16px,2vw,21px)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "62ch", margin: "0 0 38px" }}
          >
            {t("heroSub")}
          </Reveal>
          <Reveal style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact" className="lift-btn" style={primaryBtn}>{t("joinUs")}</Link>
            <Link href="/blog" className="lift-btn outline-btn" style={outlineBtn}>{t("exploreBlog")}</Link>
          </Reveal>
          <Reveal style={{ display: "flex", gap: 46, flexWrap: "wrap", marginTop: 64 }}>
            {HOME_STATS.map((s) => (
              <div key={s.num + pick(s.label, locale)}>
                <div style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 34, color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 12, letterSpacing: "0.1em", color: "var(--text-muted)", marginTop: 8 }}>{pick(s.label, locale)}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* VISION */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px 24px" }}>
        <div className="split who" style={{ gap: 60, alignItems: "start" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 14 }}>{t("whoEyebrow")}</Eyebrow>
            <h2 style={h2Style}>
              {t("whoTitleLine1")}
              <br />
              {t("whoTitleLine2")}
            </h2>
          </Reveal>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>{t("whoP1")}</p>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>{t("whoP2")}</p>
            <Link href="/about" className="lift-arrow" style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 15, color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}>
              {t("readStory")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS — the whole section is hidden while there are no
         projects. Add entries to HOME_PROJECTS (lib/constants.ts) to bring it
         back; the cards then render automatically. */}
      {HOME_PROJECTS.length > 0 && (
        <section style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "90px 24px" }}>
            <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 46 }}>
              <div>
                <Eyebrow style={{ marginBottom: 12 }}>{t("featuredEyebrow")}</Eyebrow>
                <h2 style={h2Style}>{t("featuredTitle")}</h2>
              </div>
              <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 15, color: "var(--text-muted)" }}>{t("allProjects")}</span>
            </Reveal>
            <div className="dsc-grid-3" style={{ gap: 26 }}>
              {HOME_PROJECTS.map((p) => (
                <ProjectCard key={p.title} title={p.title} tag={p.tag} shot={p.shot} desc={pick(p.desc, locale)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEPARTMENTS */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow style={{ marginBottom: 12 }}>{t("deptEyebrow")}</Eyebrow>
          <h2 style={{ ...h2Style, margin: "0 auto 14px", maxWidth: "18ch" }}>{t("deptTitle")}</h2>
          <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "54ch", margin: "0 auto" }}>{t("deptSub")}</p>
        </Reveal>
        <div className="dsc-grid-3" style={{ gap: 22 }}>
          {HOME_DEPARTMENTS.map((d) => (
            <DepartmentCard key={d.no} no={d.no} name={d.name} desc={pick(d.desc, locale)} />
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <PlexusBg density={0.8} />
        <Reveal style={{ position: "relative", maxWidth: "var(--maxw)", margin: "0 auto", padding: "90px 24px", textAlign: "center" }}>
          <h2 style={{ ...h2Style, fontSize: "clamp(30px,4.4vw,52px)", margin: "0 auto 18px", maxWidth: "20ch" }}>{t("ctaTitle")}</h2>
          <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 17, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "52ch", margin: "0 auto 32px" }}>{t("ctaSub")}</p>
          <Link href="/contact" className="lift-btn" style={{ ...primaryBtn, padding: "16px 34px", fontSize: 16 }}>{t("joinClub")}</Link>
        </Reveal>
      </section>
    </>
  );
}
