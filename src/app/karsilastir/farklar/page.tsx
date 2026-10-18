import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiffView } from "@/components/dev/DiffView";
import { IS_PRODUCTION } from "@/lib/env";
import { getTextInventory } from "@/lib/textInventory";

export const metadata: Metadata = {
  title: "Metin farkları · DSC Marmara",
  robots: { index: false, follow: false },
};

/** TEMPORARY preview tool: the texts that differ between two copy versions (see DiffView). */
export default function TextDiffPage() {
  // The layout 404s too, but pages render alongside it: without this the
  // inventory would still be serialized into the live site's 404 response.
  if (IS_PRODUCTION) notFound();
  return (
    <Suspense>
      <DiffView sections={getTextInventory()} />
    </Suspense>
  );
}
