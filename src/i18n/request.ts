import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * The locale comes from the `[locale]` root segment via next/root-params (next-intl 4.14's
 * documented setup; `setRequestLocale` is legacy). Reading it this way keeps every page static
 * without a `setRequestLocale` call in each layout and page.
 *
 * An explicit `locale` (getTranslations({ locale })) wins: the share image route and
 * generateMetadata pass one, and root params are not available in route handlers.
 * Either way it is checked: the share image route also runs for unknown first segments
 * (/foo/opengraph-image), and an unchecked value would be imported as a messages file.
 */
export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: (await import(`../../messages/${requested}.json`)).default,
  };
});
