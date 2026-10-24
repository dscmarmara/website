"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Line opacity is quantised to this many levels so each level is one stroke() call. */
const LEVELS = 8;
/** The drift is slow enough that 30 fps looks the same as 60 or 120, at a fraction of the work. */
const FRAME_MS = 1000 / 30;

/**
 * Animated connected-dots network background. Ported from the prototype's
 * `plexus.js`. Reads --plexus-rgb / --plexus-alpha and honours
 * prefers-reduced-motion (a single static frame instead of animating, also
 * when the setting changes while the page is open).
 *
 * Kept cheap because it sits behind most page heroes:
 * - draws only while on screen (IntersectionObserver), at most 30 fps, with
 *   movement scaled by elapsed time so the speed is the same at any frame rate;
 * - pixel density capped at 1.5 (a soft background gains nothing from more);
 * - one stroke per opacity level and one fill for all dots, instead of a
 *   path and a colour string per line;
 * - a size change (the mobile URL bar showing or hiding) rescales the existing
 *   dots instead of scattering new ones, so the network does not jump.
 */
export function PlexusBg({
  density = 1,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const cs = getComputedStyle(document.documentElement);
    const rgb = (cs.getPropertyValue("--plexus-rgb") || "77,255,0").trim();
    const alpha = parseFloat(cs.getPropertyValue("--plexus-alpha") || "0.5");
    const maxD2 = 130 * 130;
    const lineStyles = Array.from(
      { length: LEVELS },
      (_, i) => `rgba(${rgb},${(alpha * 0.5 * ((i + 0.5) / LEVELS)).toFixed(3)})`
    );
    const dotStyle = `rgba(${rgb},${(alpha * 0.9).toFixed(3)})`;
    const segments: number[][] = Array.from({ length: LEVELS }, () => []);

    let w = 0;
    let h = 0;
    const pts: Point[] = [];
    let raf = 0;
    let last = 0;
    let visible = false;

    const randomPoint = (): Point => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
    });

    /** `step`: how far to move, in 60 fps frames (0 = draw in place). */
    function draw(step: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (step) {
        for (const p of pts) {
          p.x += p.vx * step;
          p.y += p.vy * step;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));
        }
      }
      for (const s of segments) s.length = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const level = Math.min(LEVELS - 1, Math.floor((1 - d2 / maxD2) * LEVELS));
            segments[level].push(a.x, a.y, b.x, b.y);
          }
        }
      }
      ctx.lineWidth = 1;
      for (let level = 0; level < LEVELS; level++) {
        const s = segments[level];
        if (!s.length) continue;
        ctx.strokeStyle = lineStyles[level];
        ctx.beginPath();
        for (let k = 0; k < s.length; k += 4) {
          ctx.moveTo(s[k], s[k + 1]);
          ctx.lineTo(s[k + 2], s[k + 3]);
        }
        ctx.stroke();
      }
      ctx.fillStyle = dotStyle;
      ctx.beginPath();
      for (const p of pts) {
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < FRAME_MS - 2) return;
      // Clamp, so returning to the tab or scrolling back does not teleport the dots.
      draw(Math.min(elapsed, 100) / (1000 / 60));
      last = now;
    }

    function start() {
      if (raf || !visible || motionQuery.matches) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function resize(width: number, height: number) {
      if (!canvas || !ctx) return;
      const nw = Math.max(1, Math.round(width));
      const nh = Math.max(1, Math.round(height));
      if (nw === w && nh === h) return;
      if (pts.length) {
        for (const p of pts) {
          p.x *= nw / w;
          p.y *= nh / h;
        }
      }
      w = nw;
      h = nh;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(24, Math.min(150, Math.round(((w * h) / 16000) * density)));
      if (pts.length > target) pts.length = target;
      while (pts.length < target) pts.push(randomPoint());
      // Resizing clears the canvas; repaint now rather than leave it blank until the next frame.
      draw(0);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width, entry.contentRect.height);
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const onMotionChange = () => {
      if (motionQuery.matches) stop();
      else start();
    };

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    motionQuery.addEventListener("change", onMotionChange);
    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [density]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
