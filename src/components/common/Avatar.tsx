import Image from "next/image";

/** Member photos are small faces: a higher quality than next/image's default 75 keeps them crisp. */
export const PHOTO_QUALITY = 90;

/**
 * Member avatar. Renders the photo when present, otherwise an initials
 * monogram — a green-gradient tile (`tile`) or gradient text-clip (`clip`,
 * used on the member hero over the striped panel).
 */
export function Avatar({
  photo,
  initials,
  size,
  radius = 16,
  variant = "tile",
  fontSize,
}: {
  photo: string | null;
  initials: string;
  size: number;
  radius?: number;
  variant?: "tile" | "clip";
  fontSize?: number;
}) {
  const fs = fontSize ?? Math.round(size * 0.34);

  if (photo) {
    return (
      <span
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          display: "block",
          flex: "none",
          boxShadow: "var(--glow-soft)",
        }}
      >
        {/* `fill` + `sizes` (not width/height) so 3x screens get a sharp enough
            source too; quality must be listed in next.config `images.qualities`. */}
        <Image
          src={photo}
          alt={initials}
          fill
          sizes={`${size}px`}
          quality={PHOTO_QUALITY}
          style={{ objectFit: "cover" }}
        />
      </span>
    );
  }

  if (variant === "clip") {
    return (
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-display-stack)",
          fontWeight: 700,
          fontSize: fs,
          background: "var(--grad)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flex: "none",
        boxShadow: "var(--glow-soft)",
        background: "var(--grad)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-display-stack)",
        fontWeight: 700,
        fontSize: fs,
        color: "#04190a",
      }}
    >
      {initials}
    </span>
  );
}
