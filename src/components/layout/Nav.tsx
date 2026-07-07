"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitch } from "./LocaleSwitch";

export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "team", href: "/team" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <Link
          href="/"
          aria-label="Data Science Club"
          onClick={() => setMenuOpen(false)}
          style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "var(--text)" }}
        >
          <span style={{ display: "flex", alignItems: "center", height: 52, flex: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/dsc_logo_dark.svg" alt="Data Science Club" style={{ height: 52, width: "auto", display: "block" }} />
          </span>
          <span
            className="nav-lockup"
            style={{ display: "flex", flexDirection: "column", gap: 4, borderLeft: "1px solid var(--border)", paddingLeft: 14, lineHeight: 1 }}
          >
            <span lang="en" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text)" }}>
              {tb("title")}
            </span>
            <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 500, fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {tb("university")}
            </span>
          </span>
        </Link>

        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 34 }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              className="navlink"
              href={l.href}
              data-active={isActive(pathname, l.href) ? "" : undefined}
              style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14.5, letterSpacing: "0.01em", color: "var(--text)" }}
            >
              {t(l.key)}
            </Link>
          ))}
          <LocaleSwitch />
        </nav>

        <div className="nav-mobile">
          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 42,
              height: 42,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu: inline collapsible panel that opens below the bar (matches the prototype) */}
      {menuOpen && (
        <div
          className="nav-collapse"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)", padding: "8px 24px 18px", display: "flex", flexDirection: "column" }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-body-stack)",
                fontWeight: 600,
                fontSize: 16,
                color: isActive(pathname, l.href) ? "var(--accent)" : "var(--text)",
                textDecoration: "none",
                padding: "14px 4px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {t(l.key)}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <LocaleSwitch large />
          </div>
        </div>
      )}
    </header>
  );
}
