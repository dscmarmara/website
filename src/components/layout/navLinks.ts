import { SHOW_SHOP } from "@/lib/env";

/** The main navigation, shared by the server-rendered bar and its client parts. */
export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "team", href: "/team" },
  { key: "blog", href: "/blog" },
  // The shop: on previews until its launch, not on staging or the live site (SHOW_SHOP).
  ...(SHOW_SHOP ? ([{ key: "shop", href: "/shop" }] as const) : []),
  { key: "contact", href: "/contact" },
] as const;

/** A link is current on its own page and below it (/team for /team/irmak-evci); home only on home. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
