"use client";

import { useSyncExternalStore, useTransition } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { IS_PRODUCTION } from "@/lib/env";
import { setDevFlag, useDevFlag } from "@/lib/devFlags";
import { COPY_VERSIONS } from "@/lib/copyVersions";

/** TEMPORARY: per language, the copy versions (see copyVersions.ts). */
const GROUPS = [
  { title: "Türkçe metin:", options: COPY_VERSIONS.filter((v) => v.lang === "tr") },
  { title: "İngilizce metin:", options: COPY_VERSIONS.filter((v) => v.lang === "en") },
];

const btn = { padding: "4px 12px", fontSize: 11.5 } as const;
const pill = { display: "inline-flex", border: "1px solid var(--border)", borderRadius: 100, overflow: "hidden" } as const;
const caption = { fontFamily: "var(--font-body-stack)", fontSize: 12, color: "var(--text-muted)" } as const;

const noopSubscribe = () => () => {};

/**
 * TEMPORARY dev options bar under the nav: switches the page between the copy
 * versions (ESKİ = live, YENİ 1, YENİ 2 = default) in Turkish and in English,
 * opens the side-by-side view (/karsilastir), links the preview-only pages
 * (the shop) and toggles preview-only sections (the About page's department
 * handoffs). Hidden on Vercel production, where the review locales 404 as
 * well, so it is safe to merge into main; remove it once the extra versions
 * are dropped (see TRANSLATIONS.md). Hidden inside the side-by-side frames.
 * Its labels are Turkish on purpose: it is a tool for the club's own team.
 */
export function DevOptions() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const flowOn = useDevFlag("flow");
  const inFrame = useSyncExternalStore(noopSubscribe, () => window.self !== window.top, () => false);

  if (IS_PRODUCTION || inFrame) return null;
  const onShop = pathname === "/shop" || pathname.startsWith("/shop/");
  const toggleFlow = () => {
    setDevFlag("flow", !flowOn);
    // Turning it on elsewhere jumps to the page that shows it.
    if (!flowOn && pathname !== "/about") router.push("/about");
  };
  // Side by side: this page in this version, next to the other language's default.
  const compareHref = `/karsilastir?${new URLSearchParams({
    sol: locale,
    sag: locale.split("-")[0] === "tr" ? "en" : "tr",
    sayfa: pathname,
  })}`;

  return (
    <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "6px 24px",
          display: "flex",
          alignItems: "center",
          columnGap: 20,
          rowGap: 6,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--accent)" }}>
          DEV OPTIONS
        </span>
        {GROUPS.map((g) => (
          <div key={g.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={caption}>{g.title}</span>
            <div style={pill}>
              {g.options.map((o) => (
                <button
                  key={o.locale}
                  className="lang-btn"
                  data-active={locale === o.locale ? "" : undefined}
                  aria-label={o.title}
                  title={o.title}
                  onClick={() => {
                    if (o.locale !== locale) startTransition(() => router.replace(pathname, { locale: o.locale }));
                  }}
                  style={btn}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {/* Preview-only pages and sections, kept out of the nav and the live site. */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={caption}>Önizleme:</span>
          <div style={pill}>
            {/* Plain <a>: /karsilastir lives outside the locale routes. */}
            <a href={compareHref} className="lang-btn" style={{ ...btn, textDecoration: "none" }} title="Bu sayfayı iki sürümde yan yana aç">
              Yan yana →
            </a>
          </div>
          <div style={pill}>
            <Link href="/shop" className="lang-btn" data-active={onShop ? "" : undefined} style={{ ...btn, textDecoration: "none" }}>
              Mağaza →
            </Link>
          </div>
          {/* A switch, remembered per browser. */}
          <div style={pill}>
            <button
              type="button"
              className="lang-btn"
              data-active={flowOn ? "" : undefined}
              aria-pressed={flowOn}
              title="Hakkımızda: departmanlar arası paslaşma bölümü"
              onClick={toggleFlow}
              style={btn}
            >
              Paslaşma {flowOn ? "AÇIK" : "KAPALI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
