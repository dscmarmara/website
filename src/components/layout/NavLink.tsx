"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { isActive } from "./navLinks";

/** A navigation link that marks itself `data-active` on its page; the rest of the bar renders on the server. */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  return <Link href={href} data-active={isActive(pathname, href) ? "" : undefined} {...props} />;
}
