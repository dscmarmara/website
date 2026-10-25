import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Next.js 16 renamed the `middleware` file convention to `proxy`; the function carries the name too.
export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension (assets, favicon).
  // Also the share images: their URLs already carry the locale (/en/opengraph-image),
  // and the locale redirect would otherwise bounce /en/… to /… before serving them.
  // And the preview-only side-by-side tool, which lives outside the locale routes.
  matcher: ["/((?!api|_next|_vercel|karsilastir|.*opengraph-image|.*\\..*).*)"],
};
