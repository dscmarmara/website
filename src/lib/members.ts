import data from "@/data/members.json";
import type { Locale } from "@/i18n/routing";

// "tr-x-eski" / "en-x-eski" are the temporary review locales holding the
// previous copy (see REVIEW_LOCALES in i18n/routing.ts): set only where it
// differs from `tr` / `en`.
export type Localized = { en: string; tr: string; "tr-x-eski"?: string; "en-x-eski"?: string };

/** Exact locale, then its base language ("tr-x-eski" → "tr"), then English. */
export function pick(value: Localized, locale: string): string {
  const v = value as Record<string, string | undefined>;
  return v[locale] ?? v[locale.split("-")[0]] ?? value.en;
}

/** A member's avatar letters for a locale. */
export function initialsOf(m: { initials: string | Localized }, locale: string): string {
  return typeof m.initials === "string" ? m.initials : pick(m.initials, locale);
}

/** Avatar letters for someone not in members.json: one per name part (Mustafa Kaan Yıldız → MKY). */
export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toLocaleUpperCase("tr"))
    .join("");
}

export interface Kpi {
  num: string;
  label: string;
}

export interface Member {
  slug: string;
  name: string;
  first: string;
  /**
   * Avatar letters: a plain string in every locale, or `{ en, tr, … }` per locale. Read via initialsOf().
   * Convention: one letter per name part, so three-part names get three (Ahmet Hamza Mülayim → AHM).
   */
  initials: string | Localized;
  group: string; // 'president' | 'vp' | <department name>
  teamRole: "PRESIDENT" | "VICE PRESIDENT" | "SECRETARY" | "DIRECTOR";
  dept: string; // uppercase, e.g. "CORE AI"
  photo: string | null;
  website?: string;
  websiteUrl?: string;
  /** Full profile URL. The LinkedIn icon is hidden when absent. */
  linkedin?: string;
  /** Public contact address. The mail icon is hidden when absent. */
  email?: string;
  tagline: Localized;
  bio1: Localized;
  bio2: Localized;
  quote: Localized;
  /** Skill chips: a plain string shows in every locale, `{ en, tr }` per locale. */
  focus: (string | Localized)[];
  kpis: Kpi[];
}

export interface MembersData {
  departmentOrder: string[];
  members: Member[];
}

const db = data as unknown as MembersData;

export const departmentOrder = db.departmentOrder;

export const getMembers = (): Member[] => db.members;
export const getMemberSlugs = (): string[] => db.members.map((m) => m.slug);
export const getMemberBySlug = (slug: string): Member | undefined =>
  db.members.find((m) => m.slug === slug);

/** teamRole → messages `roles` namespace key */
export const teamRoleKey: Record<Member["teamRole"], string> = {
  PRESIDENT: "president",
  "VICE PRESIDENT": "vicePresident",
  SECRETARY: "secretary",
  DIRECTOR: "director",
};

export interface GroupedTeam {
  president: Member;
  vp: Member[];
  departments: { dept: string; members: Member[] }[];
}

export function getGroupedTeam(): GroupedTeam {
  const byGroup = (g: string) => db.members.filter((m) => m.group === g);
  return {
    president: db.members.find((m) => m.group === "president")!,
    vp: byGroup("vp"), // VP + Secretary
    departments: db.departmentOrder.map((dept) => ({
      dept,
      members: byGroup(dept),
    })),
  };
}

/** Circular prev/next over the flat members[] order (matches the prototype). */
export function getPrevNext(slug: string): { prev: Member; next: Member } {
  const arr = db.members;
  let i = arr.findIndex((m) => m.slug === slug);
  if (i < 0) i = 0;
  return {
    prev: arr[(i - 1 + arr.length) % arr.length],
    next: arr[(i + 1) % arr.length],
  };
}

/** About page team teaser: first director of each department, in order. */
export function getDepartmentTeasers(): Member[] {
  return db.departmentOrder.map((dep) => db.members.find((m) => m.group === dep)!);
}

/**
 * Full display role for the member hero, e.g. "DIRECTOR · CORE AI",
 * "CLUB PRESIDENT", "VICE PRESIDENT". `t` is the `roles` translator.
 */
export function displayRole(
  member: Member,
  t: (key: string) => string
): string {
  switch (member.teamRole) {
    case "PRESIDENT":
      return t("presidentFull");
    case "DIRECTOR":
      return `${t("director")} · ${member.dept}`;
    default:
      return t(teamRoleKey[member.teamRole]);
  }
}

export type { Locale };
