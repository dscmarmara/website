"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { SHOP_WHATSAPP, type ShopProduct } from "@/lib/constants";
import { ProductArt } from "@/components/shop/ProductArt";

const labelStyle = {
  fontFamily: "var(--font-mono-stack)",
  fontSize: 11,
  letterSpacing: "0.12em",
  color: "var(--accent)",
  marginBottom: 8,
} as const;

export function ProductCard({
  name,
  desc,
  price,
  sizes,
  art,
}: {
  name: string;
  desc: string;
  price: number;
  sizes: string[];
  art: ShopProduct["art"];
}) {
  const t = useTranslations("shop");
  const format = useFormatter();
  const [size, setSize] = useState<string | null>(null);

  // The order is placed in WhatsApp: open a chat with the product and size
  // already written, so the buyer only has to press send.
  const sizeText = sizes.length === 0 ? t("oneSize") : (size ?? t("sizeUnset"));
  const orderHref = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(t("orderMessage", { product: name, size: sizeText }))}`;

  return (
    <article
      className="glow-card"
      data-reveal
      style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--bg)", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          height: 240,
          position: "relative",
          background: "repeating-linear-gradient(135deg,var(--bg-elev2),var(--bg-elev2) 11px,transparent 11px,transparent 22px)",
          display: "grid",
          placeItems: "center",
          borderBottom: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <ProductArt art={art} />
        <span style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontFamily: "var(--font-mono-stack)", fontSize: 11, color: "var(--text-muted)" }}>
          [ {t("photoSoon")} ]
        </span>
      </div>

      <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, margin: "0 0 8px" }}>
          <h3 style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 19, margin: 0 }}>{name}</h3>
          <span style={{ fontFamily: "var(--font-display-stack)", fontWeight: 700, fontSize: 18, color: "var(--accent)", whiteSpace: "nowrap" }}>
            {format.number(price, { style: "currency", currency: "TRY", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 })}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-body-stack)", fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 18px", flex: 1 }}>{desc}</p>

        <div style={labelStyle}>{t("sizeLabel")}</div>
        {sizes.length > 0 ? (
          <div role="group" aria-label={t("sizeLabel")} style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0 0 18px" }}>
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className="chip size-chip"
                data-active={s === size ? "" : undefined}
                aria-pressed={s === size}
                onClick={() => setSize(s === size ? null : s)}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: "var(--font-body-stack)", fontSize: 13, color: "var(--text-muted)", padding: "7px 0", margin: "0 0 18px" }}>{t("oneSize")}</div>
        )}

        <a
          href={orderHref}
          target="_blank"
          rel="noopener noreferrer"
          className="lift-btn"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 10, background: "var(--grad)", color: "#04190a", fontFamily: "var(--font-body-stack)", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "var(--glow-soft)" }}
        >
          {t("order")}
        </a>
      </div>
    </article>
  );
}
