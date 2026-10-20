"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { COPY_VERSIONS, isCopyVersion, stripLocale, textVersionOf, versionHref } from "@/lib/copyVersions";
import { routing, type Locale } from "@/i18n/routing";
import { setDevFlag, useDevFlag } from "@/lib/devFlags";

const PAGES = [
  { path: "/", label: "Anasayfa" },
  { path: "/about", label: "Hakkımızda" },
  { path: "/team", label: "Ekip" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "İletişim" },
];

type Side = "left" | "right";
const other = (side: Side): Side => (side === "left" ? "right" : "left");

/** Version (locale) a frame is showing, read from its URL path. */
function versionOf(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return (routing.locales as readonly string[]).includes(first) ? (first as Locale) : routing.defaultLocale;
}

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

/**
 * TEMPORARY preview tool: one site page in two copy versions side by side.
 * Clicking a link in either frame takes the other to the same page; scrolling
 * one scrolls the other to the same relative position. The choices live in
 * the URL (?sol=…&sag=…&sayfa=…) so a view can be shared.
 */
export function CompareView() {
  const params = useSearchParams();
  const [initial] = useState(() => {
    const sol = params.get("sol");
    const sag = params.get("sag");
    const sayfa = params.get("sayfa") ?? "/";
    return {
      left: isCopyVersion(sol) ? sol : ("tr" as Locale),
      right: isCopyVersion(sag) ? sag : ("en" as Locale),
      path: sayfa.startsWith("/") ? sayfa : "/",
    };
  });

  const [versions, setVersions] = useState<Record<Side, Locale>>({ left: initial.left, right: initial.right });
  const [path, setPath] = useState(initial.path);
  const [syncScroll, setSyncScroll] = useState(true);
  // A frame we cannot read (e.g. an error page or a host that refuses framing).
  const [blocked, setBlocked] = useState<Record<Side, boolean>>({ left: false, right: false });
  const flowOn = useDevFlag("flow");

  const frames = useRef<Record<Side, HTMLIFrameElement | null>>({ left: null, right: null });
  // Latest choices for the polling loop, which outlives renders.
  const state = useRef({ versions, path, syncScroll });
  useEffect(() => {
    state.current = { versions, path, syncScroll };
  }, [versions, path, syncScroll]);
  // A frame we sent somewhere is ignored by the watcher until it gets there.
  const pending = useRef<Record<Side, string | null>>({ left: null, right: null });
  const scrollLock = useRef<Side | null>(null);
  // Per document: a full reload inside a frame brings a new document and needs a new listener.
  const hooked = useRef(new WeakSet<Document>());
  const firstRun = useRef(true);

  // Send each frame to the selected version of the current page (skips frames already there).
  useEffect(() => {
    window.history.replaceState(null, "", `/karsilastir?${new URLSearchParams({ sol: versions.left, sag: versions.right, sayfa: path })}`);
    if (firstRun.current) {
      firstRun.current = false; // the iframes' own src handles the first load
      return;
    }
    for (const side of ["left", "right"] as Side[]) {
      const frame = frames.current[side];
      const target = versionHref(versions[side], path);
      let here: string | null = null;
      try {
        here = frame?.contentWindow?.location.pathname ?? null;
      } catch {
        here = null;
      }
      if (frame && here !== target) {
        pending.current[side] = target;
        if (frame.contentWindow) frame.contentWindow.location.replace(target);
        else frame.src = target;
      }
    }
  }, [versions, path]);

  // Watch both frames: in-site links navigate client-side (no load event), so poll the URL.
  useEffect(() => {
    const onScroll = (side: Side) => {
      if (!state.current.syncScroll || scrollLock.current === other(side)) return;
      const from = frames.current[side]?.contentWindow;
      const to = frames.current[other(side)]?.contentWindow;
      if (!from || !to) return;
      const fromMax = from.document.documentElement.scrollHeight - from.innerHeight;
      const toMax = to.document.documentElement.scrollHeight - to.innerHeight;
      scrollLock.current = side;
      // "instant": the site sets smooth scrolling, which would lag and make the frames fight.
      to.scrollTo({ top: fromMax > 0 ? (from.scrollY / fromMax) * toMax : 0, behavior: "instant" });
      window.setTimeout(() => {
        if (scrollLock.current === side) scrollLock.current = null;
      }, 120);
    };

    const tick = () => {
      for (const side of ["left", "right"] as Side[]) {
        const win = frames.current[side]?.contentWindow;
        let pathname: string;
        try {
          if (!win || win.location.href === "about:blank") continue;
          pathname = win.location.pathname;
        } catch {
          setBlocked((prev) => (prev[side] ? prev : { ...prev, [side]: true }));
          continue;
        }
        setBlocked((prev) => (prev[side] ? { ...prev, [side]: false } : prev));
        const doc = win.document;
        if (doc.readyState !== "loading" && !hooked.current.has(doc)) {
          hooked.current.add(doc);
          doc.addEventListener("scroll", () => onScroll(side), { passive: true });
        }
        if (pending.current[side]) {
          if (pathname === pending.current[side]) pending.current[side] = null;
          continue;
        }
        const { versions: v, path: p } = state.current;
        const framePath = stripLocale(pathname);
        const frameVersion = versionOf(pathname);
        if (frameVersion !== v[side]) setVersions((prev) => ({ ...prev, [side]: frameVersion }));
        if (framePath !== p) setPath(framePath);
      }
    };
    const id = window.setInterval(tick, 300);
    return () => window.clearInterval(id);
  }, []);

  const pageOptions = PAGES.some((pg) => pg.path === path) ? PAGES : [...PAGES, { path, label: path }];
  const versionSelect = (side: Side) => (
    <select
      aria-label={side === "left" ? "Sol sürüm" : "Sağ sürüm"}
      value={versions[side]}
      onChange={(e) => setVersions((prev) => ({ ...prev, [side]: e.target.value as Locale }))}
      style={control}
    >
      {COPY_VERSIONS.map((v) => (
        <option key={v.locale} value={v.locale}>
          {v.label}
        </option>
      ))}
    </select>
  );
  const labelOf = (locale: Locale) => COPY_VERSIONS.find((v) => v.locale === locale)?.label ?? locale;
  // Text differences between the two sides (the defaults when both are the same version, e.g. TR vs EN).
  const diffHref = (() => {
    const once = textVersionOf(versions.left);
    const sonra = textVersionOf(versions.right);
    const q = once === sonra ? new URLSearchParams() : new URLSearchParams({ once, sonra });
    const lang = versions.left.split("-")[0];
    if (lang === versions.right.split("-")[0]) q.set("dil", lang);
    const query = q.toString();
    return `/karsilastir/farklar${query ? `?${query}` : ""}`;
  })();

  return (
    <div className="cmp">
      <div className="cmp-bar">
        <a href={versionHref(versions.left, path)} style={{ ...caption, color: "var(--accent)", textDecoration: "none" }}>
          ← Siteye dön
        </a>
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>YAN YANA</span>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={caption}>Sol:</span>
          {versionSelect("left")}
        </label>
        <button
          type="button"
          className="lang-btn"
          title="Sol ile sağı değiştir"
          onClick={() => setVersions((prev) => ({ left: prev.right, right: prev.left }))}
          style={{ ...toggle, border: "1px solid var(--border)", borderRadius: 100 }}
        >
          ⇄
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={caption}>Sağ:</span>
          {versionSelect("right")}
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={caption}>Sayfa:</span>
          <select aria-label="Sayfa" value={path} onChange={(e) => setPath(e.target.value)} style={control}>
            {pageOptions.map((pg) => (
              <option key={pg.path} value={pg.path}>
                {pg.label}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" }}>
          <button
            type="button"
            className="lang-btn"
            data-active={syncScroll ? "" : undefined}
            aria-pressed={syncScroll}
            onClick={() => setSyncScroll((s) => !s)}
            style={toggle}
          >
            Kaydırmayı eşle {syncScroll ? "AÇIK" : "KAPALI"}
          </button>
        </div>
        <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" }}>
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
        <a href={diffHref} style={{ ...caption, color: "var(--accent)", textDecoration: "none" }} title="İki sürüm arasındaki metin farkları">
          Farklar →
        </a>
        <NextLink href="/karsilastir/font" style={{ ...caption, color: "var(--accent)", textDecoration: "none" }} title="Başlıkların el yazısı fontu: önce / sonra">
          Font →
        </NextLink>
      </div>
      <div className="cmp-frames">
        {(["left", "right"] as Side[]).map((side) => (
          <section key={side} className="cmp-pane">
            <div className="cmp-pane-label">
              <strong style={{ color: "var(--accent)" }}>{labelOf(versions[side])}</strong>
              <span>{versionHref(versions[side], path)}</span>
              {blocked[side] && (
                <a href={versionHref(versions[side], path)} target="_blank" rel="noopener noreferrer" style={{ color: "#ff8a8a" }}>
                  çerçevede açılamadı · yeni sekmede aç ↗
                </a>
              )}
            </div>
            <iframe
              ref={(el) => {
                frames.current[side] = el;
              }}
              // Only the first URL comes from React; later moves go through the effect above.
              src={versionHref(side === "left" ? initial.left : initial.right, initial.path)}
              title={side === "left" ? "Sol sürüm" : "Sağ sürüm"}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
