/**
 * One theme for every chart (dark site): series colours, and a base layout that
 * charts extend. Colours come from the site's CSS tokens where there is one.
 */
export const SERIES = ["#4dff00", "#38bdf8", "#a78bfa", "#f59e0b", "#2ecb25", "#f472b6"];

export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

type Obj = Record<string, unknown>;

/** Base layout read from the page (fonts, tokens, number format of the page's language). */
export function baseLayout(opts: { xTitle?: string; yTitle?: string; legend: boolean; height: number }): Obj {
  const root = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback;
  const muted = token("--text-muted", "#b8c2bc");
  const accent = token("--accent", "#4dff00");
  const family = getComputedStyle(document.body).fontFamily;
  const grid = "rgba(255,255,255,0.08)";
  const axis = (title?: string): Obj => ({
    title: title ? { text: title, font: { size: 12, color: muted }, standoff: 10 } : undefined,
    gridcolor: grid,
    zerolinecolor: "rgba(255,255,255,0.16)",
    linecolor: "rgba(255,255,255,0.14)",
    tickcolor: "rgba(255,255,255,0.14)",
    tickfont: { size: 11.5, color: muted },
    fixedrange: true,
    automargin: true,
  });
  return {
    height: opts.height,
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family, size: 12, color: muted },
    margin: { l: 8, r: 8, t: 8, b: 8 },
    xaxis: axis(opts.xTitle),
    yaxis: axis(opts.yTitle),
    showlegend: opts.legend,
    legend: { orientation: "h", x: 0, y: 1.02, yanchor: "bottom", font: { size: 12, color: muted }, bgcolor: "rgba(0,0,0,0)" },
    hoverlabel: { bgcolor: "#0a0a0a", bordercolor: accent, font: { family, size: 12.5, color: "#ffffff" } },
    dragmode: false,
    bargap: 0.22,
    // Decimal comma in Turkish, point in English.
    separators: document.documentElement.lang.startsWith("tr") ? ",." : ".,",
  };
}

export const CONFIG = { displayModeBar: false, scrollZoom: false, responsive: false, doubleClick: false };
