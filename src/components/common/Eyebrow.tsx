import type { CSSProperties, ReactNode } from "react";

/** Small mono uppercase label above section headings. */
export function Eyebrow({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--font-mono-stack)",
        fontSize: 12,
        letterSpacing: "0.2em",
        color: "var(--accent)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
