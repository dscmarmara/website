"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TEXT_VERSIONS, isTextVersion, versionHref, type TextVersion } from "@/lib/copyVersions";
import { setDevFlag, useDevFlag } from "@/lib/devFlags";
import type { TextRow, TextSection } from "@/lib/textInventory";
import { wordDiff } from "@/lib/wordDiff";

type Lang = "tr" | "en";
type LangFilter = Lang | "both";

const control = {
  background: "var(--bg)",
  color: "var(--text)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "5px 8px",
  fontFamily: "var(--font-body-stack)",
  fontSize: 13,
} as const;
const caption = { fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" } as const;
const toggle = { padding: "5px 12px", fontSize: 12 } as const;
const pill = { display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" } as const;
const link = { ...caption, color: "var(--accent)", textDecoration: "none" } as const;

const versionOf = (id: TextVersion) => TEXT_VERSIONS.find((v) => v.id === id) ?? TEXT_VERSIONS[2];
const changedIn = (r: TextRow, lang: Lang, before: TextVersion, after: TextVersion) => r[lang][before] !== r[lang][after];

function DiffText({ before, after }: { before: string | null; after: string | null }) {
  if (before === after) return <span className="dif-same">{after ?? "(bu sürümde yok)"}</span>;
  if (before === null) return <><span className="dif-note">(önceki sürümde yok) </span><ins className="dif-ins">{after}</ins></>;
  if (after === null) return <><del className="dif-del">{before}</del><span className="dif-note"> (bu sürümde yok)</span></>;
  return (
    <>
      {wordDiff(before, after).map((part, i) =>
        part.type === "same" ? <span key={i}>{part.text}</span> : part.type === "del" ? <del key={i} className="dif-del">{part.text}</del> : <ins key={i} className="dif-ins">{part.text}</ins>
      )}
    </>
  );
}

/**
 * TEMPORARY preview tool: every text that differs between two copy versions,
 * page by page, with deletions and insertions marked word by word. The
 * choices live in the URL (?once=…&sonra=…&dil=…) so a view can be shared.
 */
export function DiffView({ sections }: { sections: TextSection[] }) {
  const params = useSearchParams();
  const [initial] = useState(() => {
    const once = params.get("once");
    const sonra = params.get("sonra");
    const dil = params.get("dil");
    return {
      before: isTextVersion(once) ? once : ("eski" as TextVersion),
      after: isTextVersion(sonra) ? sonra : ("v2" as TextVersion),
      lang: dil === "tr" || dil === "en" ? dil : ("both" as LangFilter),
      showSame: params.get("hepsi") === "1",
    };
  });
  const [before, setBefore] = useState(initial.before);
  const [after, setAfter] = useState(initial.after);
  const [lang, setLang] = useState<LangFilter>(initial.lang);
  const [showSame, setShowSame] = useState(initial.showSame);
  const flowOn = useDevFlag("flow");

  useEffect(() => {
    const q = new URLSearchParams({ once: before, sonra: after });
    if (lang !== "both") q.set("dil", lang);
    if (showSame) q.set("hepsi", "1");
    window.history.replaceState(null, "", `/karsilastir/farklar?${q}`);
  }, [before, after, lang, showSame]);

  const langs: Lang[] = lang === "both" ? ["tr", "en"] : [lang];
  // Preview-only texts count only while their switch is on, like on the page itself.
  const { visible, hiddenChanges } = useMemo(() => {
    const on = { flow: flowOn };
    const isOn = (r: TextRow) => r.flag === undefined || on[r.flag];
    const hidden = sections.flatMap((s) => s.rows).filter((r) => !isOn(r));
    return {
      visible: sections.map((s) => ({ ...s, rows: s.rows.filter(isOn) })),
      hiddenChanges: hidden.filter((r) => changedIn(r, "tr", before, after)).length + hidden.filter((r) => changedIn(r, "en", before, after)).length,
    };
  }, [sections, flowOn, before, after]);
  const totals = useMemo(() => {
    const count = (l: Lang) => visible.reduce((n, s) => n + s.rows.filter((r) => changedIn(r, l, before, after)).length, 0);
    return { tr: count("tr"), en: count("en") };
  }, [visible, before, after]);

  const shown = visible
    .map((s) => ({
      ...s,
      changed: s.rows.filter((r) => langs.some((l) => changedIn(r, l, before, after))).length,
      rows: showSame ? s.rows : s.rows.filter((r) => langs.some((l) => changedIn(r, l, before, after))),
    }))
    .filter((s) => s.rows.length > 0);

  const versionSelect = (value: TextVersion, onChange: (v: TextVersion) => void, label: string) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value as TextVersion)} style={control}>
      {TEXT_VERSIONS.map((v) => (
        <option key={v.id} value={v.id}>
          {v.label}
        </option>
      ))}
    </select>
  );
  const sideBySide = (l: Lang, path: string) =>
    `/karsilastir?${new URLSearchParams({ sol: versionOf(before)[l], sag: versionOf(after)[l], sayfa: path })}`;
  const mainLang: Lang = lang === "en" ? "en" : "tr";

  return (
    <div className="dif">
      <div className="cmp-bar dif-bar">
        <a href={versionHref(versionOf(after)[mainLang], "/")} style={link}>
          ← Siteye dön
        </a>
        <a href={sideBySide(mainLang, "/")} style={link}>
          ← Yan yana
        </a>
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>METİN FARKLARI</span>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={caption}>Önceki:</span>
          {versionSelect(before, setBefore, "Önceki sürüm")}
        </label>
        <button
          type="button"
          className="lang-btn"
          title="Önceki ile sonrakini değiştir"
          onClick={() => {
            setBefore(after);
            setAfter(before);
          }}
          style={{ ...toggle, border: "1px solid var(--border)", borderRadius: 100 }}
        >
          ⇄
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={caption}>Sonraki:</span>
          {versionSelect(after, setAfter, "Sonraki sürüm")}
        </label>
        <div style={pill} role="group" aria-label="Dil">
          {(["both", "tr", "en"] as LangFilter[]).map((l) => (
            <button key={l} type="button" className="lang-btn" data-active={lang === l ? "" : undefined} aria-pressed={lang === l} onClick={() => setLang(l)} style={toggle}>
              {l === "both" ? "TR + EN" : l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={pill}>
          <button type="button" className="lang-btn" data-active={showSame ? "" : undefined} aria-pressed={showSame} onClick={() => setShowSame((s) => !s)} style={toggle}>
            Değişmeyenleri de göster {showSame ? "AÇIK" : "KAPALI"}
          </button>
        </div>
        <div style={pill}>
          <button
            type="button"
            className="lang-btn"
            data-active={flowOn ? "" : undefined}
            aria-pressed={flowOn}
            title="Hakkımızda: departmanlar arası paslaşma bölümü"
            onClick={() => setDevFlag("flow", !flowOn)}
            style={toggle}
          >
            Paslaşma {flowOn ? "AÇIK" : "KAPALI"}
          </button>
        </div>
      </div>

      <main className="dif-main">
        <p className="dif-summary" data-testid="diff-summary">
          {before === after ? (
            "Aynı sürüm seçili: fark yok."
          ) : (
            <>
              <strong>{totals.tr + totals.en} metin değişti</strong> (TR {totals.tr}, EN {totals.en}) · {versionOf(before).label} → {versionOf(after).label}
            </>
          )}
        </p>
        <p className="dif-legend">
          <del className="dif-del">silinen</del> <ins className="dif-ins">eklenen</ins> · Sekme başlıkları ve arama motoru açıklamaları sayfada görünmez.
        </p>
        {hiddenChanges > 0 && (
          <p className="dif-note" data-testid="diff-hidden" style={{ margin: "-12px 0 24px" }}>
            {`Paslaşma bölümü kapalı: ${hiddenChanges} önizleme metni gizli (Hakkımızda'da yalnızca Paslaşma AÇIK iken görünür).`}
          </p>
        )}

        {shown.length === 0 && <p className="dif-note">Bu iki sürüm arasında {lang === "both" ? "" : `${lang.toUpperCase()} `}metin farkı yok.</p>}

        {shown.map((s) => (
          <section key={s.title} className="dif-section" data-testid="diff-section">
            <header className="dif-section-head">
              <h2>{s.title}</h2>
              <span className="dif-count">{s.changed ? `${s.changed} değişiklik` : "değişiklik yok"}</span>
              {s.path && before !== after && (
                <span className="dif-links">
                  {langs.map((l) => (
                    <a key={l} href={sideBySide(l, s.path!)} style={link}>
                      {langs.length > 1 ? `${l.toUpperCase()} sayfada gör →` : "Sayfada gör →"}
                    </a>
                  ))}
                </span>
              )}
            </header>
            {s.rows.map((r) => (
              <div key={r.id} className="dif-row">
                <div className={r.isKey ? "dif-key dif-key-code" : "dif-key"}>{r.label}</div>
                {langs.map((l) =>
                  changedIn(r, l, before, after) || showSame ? (
                    <div key={l} className="dif-line">
                      <span className="dif-lang">{l.toUpperCase()}</span>
                      <span>
                        <DiffText before={r[l][before]} after={r[l][after]} />
                      </span>
                    </div>
                  ) : (
                    <div key={l} className="dif-line">
                      <span className="dif-lang">{l.toUpperCase()}</span>
                      <span className="dif-note">değişmedi</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
