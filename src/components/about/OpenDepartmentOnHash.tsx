"use client";

import { useEffect } from "react";

/** Opens the department accordion with this id, if it is one and still closed. */
function openDepartment(id: string) {
  const el = id ? document.getElementById(id) : null;
  if (el instanceof HTMLDetailsElement && !el.open) el.open = true;
  return el;
}

/**
 * Opens the department a link points at (/about#core-ai, the footer's department links):
 * on arrival, and when such a link is clicked on /about itself. Next's <Link> changes the URL
 * with history.pushState, which fires no hashchange, so the click is caught instead; opening
 * it before Next scrolls makes the scroll land on the open accordion.
 */
export function OpenDepartmentOnHash() {
  useEffect(() => {
    const fromHash = () => openDepartment(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: "start" });
    fromHash();
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href*='#']") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      const url = new URL(a.href);
      if (url.pathname === location.pathname) openDepartment(decodeURIComponent(url.hash.slice(1)));
    };
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
