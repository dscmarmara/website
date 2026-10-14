import { notFound } from "next/navigation";

/**
 * Any path that matches no page (e.g. /tr/olmayan-sayfa) lands here, so the
 * localized [locale]/not-found.tsx renders — with the nav, footer and the
 * visitor's language — instead of Next's bare default 404.
 */
export default function CatchAllPage() {
  notFound();
}
