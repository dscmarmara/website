import { getTranslations } from "next-intl/server";
import type { Member } from "@/lib/members";

/**
 * A member's plain job title ("Başkan Yardımcısı", "Core AI Eş Direktörü") for search engines and the
 * share card. The page itself shows the uppercase role label ("DİREKTÖR · CORE AI") instead.
 */
export async function memberJobTitle(m: Member, locale: string): Promise<string> {
  const tm = await getTranslations({ locale, namespace: "metadata" });
  return m.teamRole === "PRESIDENT"
    ? tm("jobTitle.president")
    : m.teamRole === "VICE PRESIDENT"
      ? tm("jobTitle.vicePresident")
      : m.teamRole === "SECRETARY"
        ? tm("jobTitle.secretary")
        : tm("jobTitle.director", { dept: m.group });
}
