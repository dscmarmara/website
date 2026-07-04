import { useTranslations } from "next-intl";

export function ProjectCard({
  title,
  tag,
  shot,
  desc,
}: {
  title: string;
  tag: string;
  shot: string;
  desc: string;
}) {
  const t = useTranslations("home");
  return (
    <article
      className="glow-card"
      data-reveal
      style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--bg)", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          height: 184,
          position: "relative",
          background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 11px,transparent 11px,transparent 22px)",
          display: "grid",
          placeItems: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, color: "var(--text-muted)" }}>[ {shot} ]</span>
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "5px 12px",
            borderRadius: 100,
            background: "color-mix(in srgb,var(--bg) 65%,transparent)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-mono-stack)",
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--accent)",
          }}
        >
          {tag}
        </span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 21, margin: "0 0 10px" }}>{title}</h3>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)", margin: "0 0 20px", flex: 1 }}>{desc}</p>
        <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, color: "var(--accent)" }}>{t("viewDetails")}</span>
      </div>
    </article>
  );
}
