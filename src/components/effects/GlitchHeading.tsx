import type { CSSProperties } from "react";

/**
 * Glitch entrance heading. The RGB-split ::before/::after (driven by the
 * `.glitch` CSS in globals.css) fire once on reveal; `hover` also enables the
 * hover re-trigger (Home only). Motion is disabled under reduced-motion.
 */
export function GlitchHeading({
  text,
  as: Tag = "h1",
  hover = false,
  className = "",
  style,
}: {
  text: string;
  as?: "h1" | "h2";
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`glitch${hover ? " glitch--hover" : ""}${className ? ` ${className}` : ""}`}
      data-text={text}
      data-reveal
      style={style}
    >
      {text}
    </Tag>
  );
}
