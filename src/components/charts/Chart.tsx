"use client";

import { useEffect, useRef, useState } from "react";
import { baseLayout, CONFIG, SERIES, withAlpha } from "@/components/charts/chartTheme";

type Row = Record<string, string | number | null>;

export interface ChartProps {
  type: "line" | "area" | "bar" | "scatter" | "histogram";
  /** Rows of data, inline… */
  data?: Row[];
  /** …or a JSON file of rows under public/ (e.g. "/projects/<slug>/waits.json"). */
  src?: string;
  /** Column for the x axis (bar: categories; not used by histogram). */
  x?: string;
  /** One or more value columns, one series each (histogram: the values to bin). */
  y: string | string[];
  /** Display names for the series, by column. */
  names?: Record<string, string>;
  xTitle?: string;
  yTitle?: string;
  /** Shown above the chart, like a figure title. */
  caption?: string;
  /** Small print under the chart (source, sample size, caveat). */
  note?: string;
  height?: number;
  /** Unit added to hover values ("dk", "%"). */
  unit?: string;
  horizontal?: boolean;
  stacked?: boolean;
  bins?: number;
  /** Scatter: draw the y = x line (predicted vs actual). */
  diagonal?: boolean;
}

// Plotly is large (~1.4 MB): fetched once, and only when a chart nears the viewport.
let plotly: Promise<typeof import("plotly.js-cartesian-dist-min").default> | null = null;
const loadPlotly = () => (plotly ??= import("plotly.js-cartesian-dist-min").then((m) => m.default));

function buildTraces(p: ChartProps, rows: Row[]) {
  const keys = Array.isArray(p.y) ? p.y : [p.y];
  const col = (k: string) => rows.map((r) => r[k]);
  const name = (k: string) => p.names?.[k] ?? k;
  const unit = p.unit ? ` ${p.unit}` : "";
  return keys.map((k, i) => {
    const color = SERIES[i % SERIES.length];
    const extra = `<extra>${keys.length > 1 ? name(k) : ""}</extra>`;
    switch (p.type) {
      case "histogram":
        return {
          type: "histogram",
          x: col(k),
          name: name(k),
          nbinsx: p.bins,
          opacity: keys.length > 1 ? 0.65 : 1,
          marker: { color: withAlpha(color, 0.85), line: { color: "#000", width: 1 } },
          hovertemplate: `%{x}${unit}: %{y}${extra}`,
        };
      case "bar":
        return p.horizontal
          ? { type: "bar", orientation: "h", y: col(p.x ?? ""), x: col(k), name: name(k), marker: { color }, hovertemplate: `%{y}: %{x}${unit}${extra}` }
          : { type: "bar", x: col(p.x ?? ""), y: col(k), name: name(k), marker: { color }, hovertemplate: `%{x}: %{y}${unit}${extra}` };
      case "scatter":
        return {
          type: "scatter",
          mode: "markers",
          x: col(p.x ?? ""),
          y: col(k),
          name: name(k),
          marker: { color: withAlpha(color, 0.7), size: 8, line: { color, width: 1 } },
          hovertemplate: `%{x}, %{y}${unit}${extra}`,
        };
      case "area":
        return {
          type: "scatter",
          mode: "lines",
          x: col(p.x ?? ""),
          y: col(k),
          name: name(k),
          line: { color, width: 2 },
          ...(p.stacked ? { stackgroup: "s" } : { fill: "tozeroy" }),
          fillcolor: withAlpha(color, p.stacked ? 0.35 : 0.16),
          hovertemplate: `%{y}${unit}${extra}`,
        };
      default:
        return {
          type: "scatter",
          mode: "lines+markers",
          x: col(p.x ?? ""),
          y: col(k),
          name: name(k),
          line: { color, width: 2.5 },
          marker: { color, size: 6 },
          hovertemplate: `%{y}${unit}${extra}`,
        };
    }
  });
}

/** y = x across the data's range, for predicted-vs-actual scatters. */
function diagonal(p: ChartProps, rows: Row[]) {
  const keys = Array.isArray(p.y) ? p.y : [p.y];
  const nums = rows.flatMap((r) => [r[p.x ?? ""], ...keys.map((k) => r[k])]).filter((v): v is number => typeof v === "number");
  const lo = Math.min(...nums);
  const hi = Math.max(...nums);
  return [{ type: "line", xref: "x", yref: "y", x0: lo, y0: lo, x1: hi, y1: hi, line: { color: "rgba(255,255,255,0.35)", width: 1.5, dash: "dot" } }];
}

/**
 * MDX chart: a figure card (caption above, note below) around an interactive
 * Plotly chart in the site's theme. Axes stay fixed (no zoom or drag) so the
 * page scrolls normally over it; hovering shows the values.
 */
export function Chart(props: ChartProps) {
  const { caption, note, height = 300 } = props;
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    let drawn = false;
    let resize: ResizeObserver | undefined;
    const draw = async () => {
      drawn = true;
      try {
        const rows: Row[] = props.data ?? (await (await fetch(props.src ?? "")).json());
        const Plotly = await loadPlotly();
        if (cancelled) return;
        const keys = Array.isArray(props.y) ? props.y : [props.y];
        const swap = props.type === "bar" && props.horizontal;
        const layout = {
          ...baseLayout({
            xTitle: swap ? props.yTitle : props.xTitle,
            yTitle: swap ? props.xTitle : props.yTitle,
            legend: keys.length > 1,
            height,
          }),
          hovermode: props.type === "line" || props.type === "area" ? "x unified" : "closest",
          barmode: props.type === "histogram" ? "overlay" : props.stacked ? "stack" : "group",
          shapes: props.type === "scatter" && props.diagonal ? diagonal(props, rows) : [],
        };
        await Plotly.react(el, buildTraces(props, rows), layout, CONFIG);
        if (cancelled) return;
        setState("ready");
        let t: number | undefined;
        resize = new ResizeObserver(() => {
          window.clearTimeout(t);
          t = window.setTimeout(() => Plotly.Plots.resize(el), 120);
        });
        resize.observe(el);
      } catch {
        if (!cancelled) setState("error");
      }
    };
    const seen = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          seen.disconnect();
          void draw();
        }
      },
      { rootMargin: "400px 0px" }
    );
    seen.observe(el);
    return () => {
      cancelled = true;
      seen.disconnect();
      resize?.disconnect();
      if (drawn) void loadPlotly().then((P) => P.purge(el));
    };
  }, [props, height]);

  return (
    <figure className="chart-card">
      {caption && <figcaption className="chart-cap">{caption}</figcaption>}
      <div className="chart-plot" data-state={state} style={{ height }}>
        {/* Plotly owns this element's children; React leaves it empty. */}
        <div ref={box} role="img" aria-label={caption} style={{ height: "100%" }} />
      </div>
      {note && <p className="chart-note">{note}</p>}
    </figure>
  );
}
