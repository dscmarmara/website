const TR: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };

/**
 * URL fragment for a heading ("Veri Hikâyeleştirme" → "veri-hikayelestirme").
 * Shared by the MDX heading components and the table of contents, so both
 * produce the same ids from the same text.
 */
export function slugify(text: string): string {
  return (
    text
      .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => TR[c])
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}
