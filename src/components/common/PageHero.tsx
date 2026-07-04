import type { ReactNode } from "react";
import { PlexusBg } from "@/components/effects/PlexusBg";
import { GlitchHeading } from "@/components/effects/GlitchHeading";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";

/** Shared page header: plexus background + eyebrow + script H1 (+ optional sub). */
export function PageHero({
  eyebrow,
  title,
  sub,
  density = 0.85,
  glitch = false,
  padding = "96px 24px 64px",
  titleMaxWidth = "16ch",
}: {
  eyebrow: ReactNode;
  title: string;
  sub?: ReactNode;
  density?: number;
  glitch?: boolean;
  padding?: string;
  titleMaxWidth?: string;
}) {
  const titleStyle = {
    fontFamily: "var(--font-script-stack)",
    fontWeight: 700,
    paddingBottom: "0.09em",
    fontSize: "clamp(36px,6vw,68px)",
    lineHeight: 1.04,
    margin: "0 0 18px",
    maxWidth: titleMaxWidth,
  } as const;

  return (
    <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
      <PlexusBg density={density} />
      <div style={{ position: "relative", maxWidth: "var(--maxw)", margin: "0 auto", padding }}>
        <Reveal>
          <Eyebrow style={{ marginBottom: 18 }}>{eyebrow}</Eyebrow>
        </Reveal>
        {glitch ? (
          <GlitchHeading text={title} style={titleStyle} />
        ) : (
          <Reveal as="h1" style={titleStyle}>
            {title}
          </Reveal>
        )}
        {sub && (
          <Reveal
            as="p"
            style={{ fontFamily: "var(--font-body-stack)", fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "56ch", margin: 0 }}
          >
            {sub}
          </Reveal>
        )}
      </div>
    </section>
  );
}
