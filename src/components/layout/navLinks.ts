/** The main navigation, shared by the server-rendered bar and its client parts. */
export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "team", href: "/team" },
  { key: "blog", href: "/blog" },
  // The shop is preview-only for now and linked from the dev options bar.
  { key: "contact", href: "/contact" },
] as const;

/** A link is current on its own page and below it (/team for /team/irmak-evci); home only on home. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
