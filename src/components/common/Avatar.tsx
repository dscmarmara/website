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
        className="avatar"
        style={{ width: size, height: size, borderRadius: radius }}
      >
        {/* `fill` + `sizes` (not width/height) so 3x screens get a sharp enough
            source too; quality must be listed in next.config `images.qualities`. */}
        <Image
          className="avatar__img"
          src={photo}
          // The name is always written next to the photo, so the image adds nothing for screen readers.
          alt=""
          fill
          sizes={`${size}px`}
          quality={PHOTO_QUALITY}
        />
      </span>
    );
  }

  if (variant === "clip") {
    return (
      <span
        className="avatar__clip"
        style={{ fontSize: fs }}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      className="avatar__tile"
      style={{ width: size, height: size, borderRadius: radius, fontSize: fs }}
    >
      {initials}
    </span>
  );
}
