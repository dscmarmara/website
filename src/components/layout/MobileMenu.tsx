"use client";

import { createContext, useContext, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { isActive } from "./navLinks";

/**
 * The mobile menu: a burger in the bar and a panel below it (after the dev options strip),
 * so the two share their open state through a context. The provider wraps the header's
 * server-rendered content without turning it into client code.
 *
 * The menu is open for the page it was opened on: navigating anywhere closes it, with no
 * effect needed, because the stored path no longer matches.
 */
const MenuContext = createContext<{ open: boolean; toggle: () => void; close: () => void } | null>(null);

function useMenu() {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("MobileMenu parts must be inside <MobileMenuProvider>");
  return menu;
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const menu = {
    open,
    toggle: () => setOpenOn(open ? null : pathname),
    close: () => setOpenOn(null),
  };
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>;
}

/** 24px icon grid, 2px rounded strokes: three bars, or a cross when open. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 5h16M4 12h16M4 19h16" />}
    </svg>
  );
}

export function MenuButton({ openLabel, closeLabel }: { openLabel: string; closeLabel: string }) {
  const { open, toggle } = useMenu();
  return (
    <button
      type="button"
      aria-label={open ? closeLabel : openLabel}
      aria-expanded={open}
      onClick={toggle}
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
      <MenuIcon open={open} />
    </button>
  );
}

/** Inline collapsible panel that opens below the bar (matches the prototype). */
export function MenuPanel({ links }: { links: readonly { href: string; label: string }[] }) {
  const { open, close } = useMenu();
  const pathname = usePathname();
  if (!open) return null;
  return (
    <div
      className="nav-collapse"
      style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elev)", padding: "8px 24px 18px", display: "flex", flexDirection: "column" }}
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={close}
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
          {l.label}
        </Link>
      ))}
    </div>
  );
}
