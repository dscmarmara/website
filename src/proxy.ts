import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Next.js 16 renamed the `middleware` file convention to `proxy`; the function carries the name too.
export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  // next-intl sends /en/… to the unprefixed English URL with a temporary 307. That URL is the
  // permanent one, so say so (308): search engines then drop /en/… instead of re-checking it.
  if (response.status === 307 && /^\/en(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension (assets, favicon).
  // Also the share images: their URLs already carry the locale (/en/opengraph-image),
  // and the locale redirect would otherwise bounce /en/… to /… before serving them.
  // And the preview-only side-by-side tool, which lives outside the locale routes.
  matcher: ["/((?!api|_next|_vercel|karsilastir|.*opengraph-image|.*\\..*).*)"],
};
