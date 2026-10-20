import { notFound } from "next/navigation";
import { bricolage, hanken, dscScript } from "@/fonts";
import { IS_PRODUCTION } from "@/lib/env";
import "../globals.css";

/**
 * TEMPORARY preview tool (/karsilastir): its own root document, outside the
 * locale routes (the proxy skips this path). 404 on the live site.
 */
export default function CompareLayout({ children }: { children: React.ReactNode }) {
  if (IS_PRODUCTION) notFound();
  const fontVars = `${bricolage.variable} ${hanken.variable} ${dscScript.variable}`;
  return (
    <html lang="tr" className={`dark ${fontVars}`}>
      <body>{children}</body>
    </html>
  );
}
