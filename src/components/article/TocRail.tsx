"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/content";
import { TocList } from "@/components/article/toc";

/**
 * Wide screens: sticky contents beside the text, with a reading-progress bar
 * and the current section highlighted. The bar is written through a ref in
 * requestAnimationFrame, and state only changes when the section does, so
 * scrolling doesn't re-render the page. The section's #id follows in the URL.
 */
export function TocRail({ items, label, numbered }: { items: Heading[]; label: string; numbered?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let hashTimer: number | undefined;
    let current: string | null = null;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, root.scrollTop / max) : 0})`;
      // A heading is current once it passes just under the sticky nav; at the very bottom, mid-screen.
      const line = root.scrollTop >= max - 4 ? window.innerHeight / 2 : 120;
      let id: string | null = null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) id = it.id;
      }
      if (id !== current) {
        current = id;
        setActive(id);
        window.clearTimeout(hashTimer);
        hashTimer = window.setTimeout(() => {
          window.history.replaceState(window.history.state, "", id ? `#${id}` : window.location.pathname + window.location.search);
        }, 300);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(hashTimer);
    };
  }, [items]);

  return (
    <nav className="toc-rail" aria-label={label}>
      <div className="toc-progress" aria-hidden>
        <span ref={bar} />
      </div>
      <div className="toc-label">{label}</div>
      <TocList items={items} numbered={numbered} active={active} />
    </nav>
  );
}
