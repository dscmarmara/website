"use client";

import { useState } from "react";
import NextLink from "next/link";
import { versionHref } from "@/lib/copyVersions";

export interface FontSample {
  lang: "tr" | "en";
  where: string;
  path: string;
  text: string;
  size: string;
}

type LangFilter = "tr" | "en" | "both";

const BEFORE = "var(--font-condiment-legacy), var(--font-pacifico-legacy), cursive";
const AFTER = "var(--font-dsc-script), cursive";
// The letters Condiment lacked (Ğ ğ İ Ş ş), plus ı, which the old setup also sent to Pacifico.
const AFFECTED = /([ĞğİŞşı])/;
const STRIP = "Ğ ğ İ Ş ş ı · Ç ç Ö ö Ü ü â î û";

const caption = { fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" } as const;
const link = { ...caption, color: "var(--accent)", textDecoration: "none" } as const;
const toggle = { padding: "5px 12px", fontSize: 12 } as const;
const pill = { display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" } as const;

function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(AFFECTED).map((part, i) => (i % 2 ? <span key={i} className="fnt-mark">{part}</span> : part))}
    </>
  );
}

function Line({ label, family, text, size }: { label: string; family: string; text: string; size: string }) {
  return (
    <div className="fnt-line">
      <span className="dif-lang">{label}</span>
      <div style={{ fontFamily: family, fontWeight: 700, fontSize: size, lineHeight: 1.1, paddingBottom: "0.09em" }}>
        <Marked text={text} />
      </div>
    </div>
  );
}

/**
 * TEMPORARY preview tool: the site's script headings, once in the old setup
 * (Condiment, missing letters falling back to Pacifico) and once in DSC Script.
 * Affected letters are underlined in both.
 */
export function FontCompare({ samples }: { samples: FontSample[] }) {
  const [lang, setLang] = useState<LangFilter>("tr");
  const shown = samples.filter((s) => lang === "both" || s.lang === lang);
  return (
    <div className="dif">
      <div className="cmp-bar dif-bar">
        <NextLink href="/tr" style={link}>
          ← Siteye dön
        </NextLink>
        <NextLink href="/karsilastir/farklar" style={link}>
          Farklar →
        </NextLink>
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>FONT: ÖNCE / SONRA</span>
        <div style={pill} role="group" aria-label="Dil">
          {(["tr", "en", "both"] as LangFilter[]).map((l) => (
            <button key={l} type="button" className="lang-btn" data-active={lang === l ? "" : undefined} aria-pressed={lang === l} onClick={() => setLang(l)} style={toggle}>
              {l === "both" ? "TR + EN" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <main className="dif-main">
        <p className="dif-summary">Başlıklardaki el yazısı fontu: önce Condiment + Pacifico, sonra DSC Script.</p>
        <p className="dif-legend">
          Condiment&apos;te Ğ ğ İ Ş ş yoktu; bu harfler ve ı başka bir fonttan (Pacifico) çiziliyordu. DSC Script aynı fontun
          kendi harflerinden üretildi. <span className="fnt-mark">Altı çizili</span> harfler değişenler.
        </p>
        <section className="dif-section">
          <header className="dif-section-head">
            <h2>Harfler</h2>
          </header>
          <div className="dif-row">
            <Line label="ÖNCE" family={BEFORE} text={STRIP} size="clamp(36px,6vw,64px)" />
            <Line label="SONRA" family={AFTER} text={STRIP} size="clamp(36px,6vw,64px)" />
          </div>
        </section>
        {shown.map((s, i) => (
          <section key={i} className="dif-section">
            <header className="dif-section-head">
              <h2>{s.where}</h2>
              <span className="dif-count">{s.lang.toUpperCase()}</span>
              <span className="dif-links">
                <a href={versionHref(s.lang, s.path)} style={link}>
                  Sayfada gör →
                </a>
              </span>
            </header>
            <div className="dif-row">
              <Line label="ÖNCE" family={BEFORE} text={s.text} size={s.size} />
              <Line label="SONRA" family={AFTER} text={s.text} size={s.size} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
