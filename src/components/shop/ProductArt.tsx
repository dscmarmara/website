import type { ShopProduct } from "@/lib/constants";

/**
 * Line-drawn stand-ins for product photos. Swap the card's art block for a
 * next/image once real photos exist.
 */
export function ProductArt({ art, size = 132 }: { art: ShopProduct["art"]; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  const mark = (y: number) => (
    <text x="60" y={y} textAnchor="middle" fill="var(--accent)" stroke="none" style={{ fontFamily: "var(--font-mono-stack)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>
      DSC
    </text>
  );

  if (art === "tshirt") {
    return (
      <svg {...common}>
        <path d="M42 18 L28 24 L10 40 L22 56 L32 48 L32 104 L88 104 L88 48 L98 56 L110 40 L92 24 L78 18 C74 26 67 30 60 30 C53 30 46 26 42 18 Z" />
        {mark(62)}
      </svg>
    );
  }

  if (art === "hoodie") {
    return (
      <svg {...common}>
        <path d="M40 26 C40 12 50 6 60 6 C70 6 80 12 80 26 C76 34 68 38 60 38 C52 38 44 34 40 26 Z" />
        <path d="M40 26 L24 32 L12 62 L12 100 L26 100 L30 64 L32 106 L88 106 L90 64 L94 100 L108 100 L108 62 L96 32 L80 26" />
        <path d="M54 38 L54 52 M66 38 L66 52" />
        <path d="M44 80 L76 80 L82 100 L38 100 Z" />
        {mark(68)}
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M20 76 C20 48 38 34 58 34 C80 34 96 50 96 76 Z" />
      <path d="M88 76 C98 73 109 75 116 82 C107 86 95 86 84 82" />
      <path d="M46 37 C40 50 38 63 40 76" />
      <circle cx="58" cy="34" r="3" />
      {mark(64)}
    </svg>
  );
}
