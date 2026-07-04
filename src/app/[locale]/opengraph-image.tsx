import { ImageResponse } from "next/og";

export const alt = "Data Science Club — Marmara University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg,#000000 0%,#02240F 52%,#0B8F30 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 40 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(120deg,#4DFF00,#0B8F30)" }} />
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#B8C2BC" }}>DATA SCIENCE CLUB</div>
        </div>
        <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.02, maxWidth: 940 }}>
          The data club that thinks like a startup.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 44 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#4DFF00" }} />
          <div style={{ fontSize: 28, color: "#B8C2BC" }}>Marmara University</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
