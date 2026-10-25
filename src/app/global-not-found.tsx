import type { Metadata } from "next";
import Link from "next/link";
import { bricolage, hanken, dscScript } from "@/fonts";
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";
import "./globals.css";

export const metadata: Metadata = { title: `404 · ${tr.notFound.title} · ${en.notFound.title}` };

/**
 * 404 for URLs that match no route, so no language is known: a first segment
 * that is not a served locale (the old-copy locales on the live site, /missing.html,
 * which the locale proxy skips). `[locale]` is the root layout and only lists the
 * served locales (`dynamicParams = false`), so Next answers these with this page
 * directly (experimental.globalNotFound). Missing pages inside a locale get the
 * localized [locale]/not-found.tsx instead. Both languages, same look.
 */
export default function GlobalNotFound() {
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
  } as const;

  return (
    <html lang="tr" className={`dark ${fontVars}`}>
      <body>
        <main>
          <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "140px 24px 160px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-script-stack)", fontSize: "clamp(64px,12vw,120px)", color: "var(--accent)", lineHeight: 1, marginBottom: 8, paddingBottom: "0.09em" }}>404</div>
            <h1 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: "clamp(24px,3vw,34px)", margin: "0 0 14px" }}>
              {tr.notFound.title} · <span lang="en">{en.notFound.title}</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "44ch", margin: "0 auto 6px" }}>{tr.notFound.body}</p>
            <p lang="en" style={{ fontFamily: "var(--font-body-stack)", fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "44ch", margin: "0 auto 28px" }}>{en.notFound.body}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/tr" className="lift-btn" style={{ ...btn, background: "var(--grad)", color: "#04190a", boxShadow: "var(--glow-soft)" }}>
                {tr.notFound.home}
              </Link>
              <Link href="/" lang="en" style={{ ...btn, border: "1px solid var(--border)", color: "var(--text)" }}>
                {en.notFound.home}
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
