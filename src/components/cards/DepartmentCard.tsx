import { Link } from "@/i18n/navigation";

export function DepartmentCard({
  no,
  name,
  desc,
}: {
  no: string;
  name: string;
  desc: string;
}) {
  return (
    <Link
      href="/about"
      className="glow-card"
      data-reveal
      style={{ textDecoration: "none", border: "1px solid var(--border)", borderRadius: 16, background: "var(--bg-elev)", padding: 28, display: "block" }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          display: "grid",
          placeItems: "center",
          borderRadius: 14,
          background: "color-mix(in srgb,var(--accent) 12%,transparent)",
          border: "1px solid var(--border)",
          marginBottom: 18,
          color: "var(--accent)",
        }}
      >
        <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 18 }}>{no}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 19, margin: "0 0 8px", color: "var(--text)" }}>{name}</h3>
      <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{desc}</p>
    </Link>
  );
}
