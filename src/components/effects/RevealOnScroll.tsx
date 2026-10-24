"use client";

import { useEffect } from "react";

/**
 * Plays the `[data-reveal]` rise once, when an element first scrolls into view
 * (globals.css, "Reveal on scroll"). Mounted once in the locale layout.
 *
 * Not a scroll-linked animation (`animation-timeline: view()`, the previous
 * version): that recomputes every card's animation on every frame of a scroll,
 * and on a fast fling through /team it dropped about 7 frames a second on a
 * phone viewport; this plays a short animation once and is done, as smooth as
 * no animation at all (measured 2026-10-24).
 *
 * Elements already on screen, or above it, when they are first seen are marked
 * without animating, so nothing visible blinks out after hydration. Only then
 * does `data-reveal-js` on <html> let the CSS hide the rest until they arrive;
 * without JS, or with reduced motion, nothing is ever hidden. Elements added
 * later (client navigation, the blog filter) are picked up by a MutationObserver.
 * An attribute, not a class: React owns the elements' `className`.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "anim");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px" }
    );

    const track = (el: Element) => {
      if (el.hasAttribute("data-revealed")) return;
      if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-revealed", "now");
      else {
        el.setAttribute("data-revealed", "wait");
        io.observe(el);
      }
    };
    const trackWithin = (node: Node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-reveal]")) track(node);
      node.querySelectorAll("[data-reveal]").forEach(track);
    };

    trackWithin(document.body);
    root.setAttribute("data-reveal-js", "");

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach(trackWithin);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      root.removeAttribute("data-reveal-js");
    };
  }, []);

  return null;
}
