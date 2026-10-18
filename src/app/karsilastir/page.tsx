import { Suspense } from "react";
import type { Metadata } from "next";
import { CompareView } from "@/components/dev/CompareView";

export const metadata: Metadata = {
  title: "Yan yana · DSC Marmara",
  robots: { index: false, follow: false },
};

/** TEMPORARY preview tool: one page in two copy versions side by side (see CompareView). */
export default function ComparePage() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  );
}
