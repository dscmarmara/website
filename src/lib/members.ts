import data from "@/data/members.json";
import type { Locale } from "@/i18n/routing";

export type Localized = { en: string; tr: string };

export function pick(value: Localized, locale: string): string {
  return value[locale as keyof Localized] ?? value.en;
}

export interface Kpi {
  num: string;
  label: string;
}

export interface Member {
  slug: string;
  name: string;
  first: string;
  initials: string;
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
  focus: string[];
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
