import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** A project in a grid (home, /projects): the whole card links to its case study. */
export function ProjectCard({
  href,
  title,
  category,
  excerpt,
  cover,
}: {
  href: string;
  title: string;
  category: string;
  excerpt: string;
  cover?: string;
}) {
  const t = useTranslations("home");
  return (
    <article
      className="glow-card"
      data-reveal
      style={{ position: "relative", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--bg)", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          height: 184,
          position: "relative",
          background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 11px,transparent 11px,transparent 22px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {cover && (
          // Covers come from content frontmatter without known dimensions; next/image would need them.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
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
            fontSize: 12,
            letterSpacing: "0.06em",
            color: "var(--accent)",
          }}
        >
          {category}
        </span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 21, lineHeight: 1.25, margin: "0 0 10px" }}>
          {/* The link's ::after covers the card, so the whole card is clickable. */}
          <Link href={href} className="card-link">
            {title}
          </Link>
        </h3>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)", margin: "0 0 20px", flex: 1 }}>{excerpt}</p>
        <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14, color: "var(--accent)" }}>{t("viewDetails")}</span>
      </div>
    </article>
  );
}
