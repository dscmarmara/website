import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "140px 24px 160px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-script-stack)", fontSize: "clamp(64px,12vw,120px)", color: "var(--accent)", lineHeight: 1, marginBottom: 8, paddingBottom: "0.09em" }}>404</div>
      <h1 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(24px,3vw,34px)", margin: "0 0 14px" }}>{t("title")}</h1>
      <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "44ch", margin: "0 auto 28px" }}>{t("body")}</p>
      <Link
        href="/"
        className="lift-btn"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "var(--glow-soft)" }}
      >
        {t("home")}
      </Link>
    </section>
  );
}
