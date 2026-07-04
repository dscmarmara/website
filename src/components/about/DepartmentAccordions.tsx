import { useLocale, useTranslations } from "next-intl";
import { ABOUT_DEPARTMENTS } from "@/lib/constants";
import { pick } from "@/lib/members";

const labelStyle = {
  fontFamily: "var(--font-mono-stack)",
  fontSize: 11,
  letterSpacing: "0.12em",
  color: "var(--accent)",
  marginBottom: 10,
} as const;

const pStyle = {
  fontFamily: "var(--font-body-stack)",
  fontSize: 14.5,
  lineHeight: 1.7,
  color: "var(--text-muted)",
  margin: 0,
} as const;

const focusChip = {
  padding: "5px 11px",
  borderRadius: 100,
  border: "1px solid var(--border)",
  background: "var(--bg-elev)",
  fontFamily: "var(--font-body-stack)",
  fontSize: 12.5,
  color: "var(--text)",
} as const;

export function DepartmentAccordions() {
  const locale = useLocale();
  const t = useTranslations("about");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {ABOUT_DEPARTMENTS.map((d) => (
        <details key={d.no} className="dsc-acc glow-card" data-reveal style={{ border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg)", overflow: "hidden" }}>
          <summary style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 26px" }}>
            <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 15, color: "var(--accent)", flex: "none", width: 34 }}>{d.no}</span>
            <span className="acc-title" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: "clamp(18px,2.2vw,23px)", flex: 1 }}>{d.name}</span>
            <span className="chev" style={{ color: "var(--accent)", flex: "none", display: "inline-flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </span>
          </summary>
          <div className="dsc-grid-3 acc-body" style={{ padding: "0 26px 28px 80px", gap: 28 }}>
            <div>
              <div style={labelStyle}>{t("purposeLabel")}</div>
              <p style={pStyle}>{pick(d.purpose, locale)}</p>
            </div>
            <div>
              <div style={labelStyle}>{t("focusLabel")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {d.focus.map((f) => (
                  <span key={f} style={focusChip}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={labelStyle}>{t("visionLabel")}</div>
              <p style={pStyle}>{pick(d.vision, locale)}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
