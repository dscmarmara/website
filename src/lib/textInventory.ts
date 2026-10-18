import en from "../../messages/en.json";
import tr from "../../messages/tr.json";
import enEski from "../../messages/en-x-eski.json";
import trEski from "../../messages/tr-x-eski.json";
import enV1 from "../../messages/en-x-v1.json";
import trV1 from "../../messages/tr-x-v1.json";
import { ABOUT_DEPARTMENTS, ABOUT_FLOW, HOME_DEPARTMENTS, HOME_STATS } from "@/lib/constants";
import { TEXT_VERSIONS, type TextVersion } from "@/lib/copyVersions";
import { getMembers, pick, type Localized } from "@/lib/members";
import { isExcludedMessageKey } from "@/lib/siteTextKeys";
import { SKILLS_TR, skillLabel } from "@/lib/skills";

/** One text in every version; null = not on the page in that version. */
export type VersionValues = Record<TextVersion, string | null>;

export interface TextRow {
  id: string;
  label: string;
  /** The label is a message key (shown in monospace). */
  isKey: boolean;
  tr: VersionValues;
  en: VersionValues;
}

export interface TextSection {
  title: string;
  /** Site path the texts appear on; null for texts not shown in the page (tab titles, search descriptions). */
  path: string | null;
  rows: TextRow[];
}

const flatten = (obj: object, prefix = ""): [string, string][] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)] as [string, string]]
  );

// English first, so keys come in en.json order; keys only some versions have follow.
const MESSAGES = new Map(
  Object.entries({ en, tr, "en-x-eski": enEski, "tr-x-eski": trEski, "en-x-v1": enV1, "tr-x-v1": trV1 }).map(
    ([locale, messages]) => [locale, new Map(flatten(messages))]
  )
);
const KEYS = [...new Set([...MESSAGES.values()].flatMap((m) => [...m.keys()]))].filter((k) => !isExcludedMessageKey(k));

/** Reads one text per version and language with the site's own lookup rules. */
const values = (read: (locale: string) => string | null | undefined): Pick<TextRow, "tr" | "en"> => {
  const per = (lang: "tr" | "en") =>
    Object.fromEntries(TEXT_VERSIONS.map((v) => [v.id, read(v[lang]) || null])) as VersionValues;
  return { tr: per("tr"), en: per("en") };
};
const localized = (field: Localized) => values((locale) => pick(field, locale));
const row = (id: string, label: string, vals: Pick<TextRow, "tr" | "en">, isKey = false): TextRow => ({ id, label, isKey, ...vals });

/**
 * TEMPORARY preview tool: every text the site shows, in all three copy
 * versions, grouped by page in SITE_METINLERI.md order. Read by
 * /karsilastir/farklar; never shipped to the live site.
 */
export function getTextInventory(): TextSection[] {
  const placed = new Set<string>();
  const messageRows = (...namespaces: string[]): TextRow[] =>
    KEYS.filter((k) => namespaces.some((ns) => k.startsWith(`${ns}.`))).map((k) => {
      placed.add(k);
      return row(k, k, values((locale) => MESSAGES.get(locale)?.get(k)), true);
    });
  const members = getMembers();

  const sections: TextSection[] = [
    { title: "Sekme başlıkları ve arama motoru açıklamaları", path: null, rows: messageRows("metadata") },
    { title: "Menü ve logo", path: "/", rows: messageRows("nav", "brand") },
    {
      title: "Anasayfa",
      path: "/",
      rows: [
        ...messageRows("home"),
        ...HOME_STATS.map((s) => row(`stat:${s.num}`, `Sayı: ${s.num}`, localized(s.label))),
        ...HOME_DEPARTMENTS.map((d) => row(`home-dept:${d.no}`, `Departman kartı: ${d.no} ${d.name}`, localized(d.desc))),
      ],
    },
    {
      title: "Hakkımızda",
      path: "/about",
      rows: [
        ...messageRows("about"),
        ...ABOUT_DEPARTMENTS.flatMap((d) => [
          row(`dept:${d.no}:purpose`, `${d.no} ${d.name}: Amaç`, localized(d.purpose)),
          row(
            `dept:${d.no}:focus`,
            `${d.no} ${d.name}: Odak etiketleri`,
            values((locale) => (d.focusByLocale?.[locale] ?? d.focusByLocale?.[locale.split("-")[0]] ?? d.focus).join(" · "))
          ),
          row(`dept:${d.no}:vision`, `${d.no} ${d.name}: Vizyon`, localized(d.vision)),
        ]),
        ...ABOUT_FLOW.map((s, i) => row(`flow:${i}`, `Paslaşma ${i + 1}. adım: ${s.name} (önizleme)`, localized(s.text))),
      ],
    },
    { title: "Ekip", path: "/team", rows: messageRows("team", "roles") },
    { title: "Üye profili", path: `/team/${members[0].slug}`, rows: messageRows("member") },
    ...members.map((m) => ({
      title: `Üye: ${m.name}`,
      path: `/team/${m.slug}`,
      rows: [
        row(`${m.slug}:tagline`, "Kısa tanıtım (ekip kartı ve profil)", localized(m.tagline)),
        row(`${m.slug}:bio1`, "Biyografi, 1. paragraf", localized(m.bio1)),
        row(`${m.slug}:bio2`, "Biyografi, 2. paragraf", localized(m.bio2)),
        row(`${m.slug}:quote`, "Alıntı", localized(m.quote)),
        row(`${m.slug}:skills`, "Odak alanı etiketleri", values((locale) => m.focus.map((s) => skillLabel(s, locale)).join(" · "))),
      ],
    })),
    {
      title: "Odak alanı etiketleri (sözlük)",
      path: "/team",
      rows: Object.keys(SKILLS_TR).map((skill) => row(`skill:${skill}`, skill, values((locale) => skillLabel(skill, locale)))),
    },
    { title: "Blog", path: "/blog", rows: messageRows("blog") },
    { title: "İletişim", path: "/contact", rows: messageRows("contact") },
    { title: "Alt bilgi (footer)", path: "/", rows: messageRows("footer") },
    { title: "404 sayfası", path: "/sayfa-yok", rows: messageRows("notFound") },
  ];

  // A namespace added later still shows up instead of silently missing.
  const rest = KEYS.filter((k) => !placed.has(k));
  if (rest.length) sections.push({ title: "Diğer", path: null, rows: rest.map((k) => row(k, k, values((locale) => MESSAGES.get(locale)?.get(k)), true)) });
  return sections;
}
