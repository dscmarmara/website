import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { contentLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment.
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Preview locales have no messages file of their own (see PREVIEW_LOCALES).
    messages: (await import(`../../messages/${contentLocale(locale)}.json`)).default,
  };
});
