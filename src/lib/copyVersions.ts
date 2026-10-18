import { routing, type Locale } from "@/i18n/routing";

/**
 * TEMPORARY: the copy versions shown side by side on previews (dev options bar
 * and /karsilastir). ESKİ = live on main, YENİ 1 = earlier draft, YENİ 2 = the
 * current default (/tr, /). Labels are Turkish: a tool for the club's team.
 */
export const COPY_VERSIONS: { locale: Locale; lang: "tr" | "en"; label: string; title: string }[] = [
  { locale: "tr-x-eski", lang: "tr", label: "TR ESKİ", title: "Türkçe, canlıdaki metin" },
  { locale: "tr-x-v1", lang: "tr", label: "TR YENİ 1", title: "Türkçe, ilk yeni metin" },
  { locale: "tr", lang: "tr", label: "TR YENİ 2", title: "Türkçe, varsayılan (en yeni) metin" },
  { locale: "en-x-eski", lang: "en", label: "EN ESKİ", title: "İngilizce, canlıdaki metin" },
  { locale: "en-x-v1", lang: "en", label: "EN YENİ 1", title: "İngilizce, ilk yeni metin" },
  { locale: "en", lang: "en", label: "EN YENİ 2", title: "İngilizce, varsayılan (en yeni) metin" },
];

/** The same three versions, one entry per version (both languages), for the text-diff page (/karsilastir/farklar). */
export const TEXT_VERSIONS = [
  { id: "eski", label: "ESKİ (canlı)", tr: "tr-x-eski", en: "en-x-eski" },
  { id: "v1", label: "YENİ 1", tr: "tr-x-v1", en: "en-x-v1" },
  { id: "v2", label: "YENİ 2", tr: "tr", en: "en" },
] as const satisfies readonly { id: string; label: string; tr: Locale; en: Locale }[];

export type TextVersion = (typeof TEXT_VERSIONS)[number]["id"];

export const isTextVersion = (value: string | null): value is TextVersion =>
  value !== null && TEXT_VERSIONS.some((v) => v.id === value);

/** The version a locale belongs to ("tr-x-v1" → "v1"). */
export const textVersionOf = (locale: string): TextVersion =>
  TEXT_VERSIONS.find((v) => v.tr === locale || v.en === locale)?.id ?? "v2";

export const isCopyVersion = (value: string | null): value is Locale =>
  value !== null && COPY_VERSIONS.some((v) => v.locale === value);

/** URL of a site path in a given version, matching the "as-needed" prefix rule (English at the root). */
export function versionHref(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

/** The locale-free path of a URL path ("/tr-x-v1/about" → "/about"). */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if ((routing.locales as readonly string[]).includes(first)) return `/${rest.join("/")}`;
  return pathname || "/";
}
