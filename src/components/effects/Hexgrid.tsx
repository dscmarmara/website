import type { CSSProperties } from "react";

/** Hexagon lattice motif background (masked to fade). Home hero only. */
export function Hexgrid({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div aria-hidden className={`hexgrid${className ? ` ${className}` : ""}`} style={style} />;
}
