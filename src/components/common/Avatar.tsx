import Image from "next/image";

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
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          display: "block",
          flex: "none",
          boxShadow: "var(--glow-soft)",
        }}
      >
        <Image
          src={photo}
          alt={initials}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
