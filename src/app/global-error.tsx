"use client";

import { bricolage, hanken, dscScript } from "@/fonts";
import "./globals.css";

/**
 * Last-resort error page: shown only when the root layout itself fails, so it
 * brings its own <html>, fonts and styles and cannot use translations. Both
 * languages, in the same look as the 404 pages. `retry` re-renders the layout
 * (the Next 16.3+ name for `reset`).
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const fontVars = `${bricolage.variable} ${hanken.variable} ${dscScript.variable}`;
  const btn = {
    display: "inline-flex",
    alignItems: "center",
    padding: "14px 28px",
    borderRadius: 10,
    fontFamily: "var(--font-body-stack)",
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    cursor: "pointer",
  } as const;

  return (
    <html lang="tr" className={`dark ${fontVars}`}>
      <body>
        <title>Bir sorun oluştu · Something went wrong</title>
        <main>
          <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "140px 24px 160px", textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(24px,3vw,34px)", margin: "0 0 14px" }}>
              Bir sorun oluştu · <span lang="en">Something went wrong</span>
            </h1>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
              <button type="button" onClick={() => retry()} className="lift-btn" style={{ ...btn, border: "none", background: "var(--grad)", color: "#04190a", boxShadow: "var(--glow-soft)" }}>
                {"Tekrar dene · "}
                <span lang="en">Try again</span>
              </button>
              {/* A plain link, not next/link: after a root failure a full page load is the safer way out. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/tr" style={{ ...btn, border: "1px solid var(--border)", color: "var(--text)" }}>
                Anasayfaya dön →
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
