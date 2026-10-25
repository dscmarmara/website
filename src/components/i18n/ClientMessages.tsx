import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

/**
 * Gives the Client Components inside it only the message namespaces they use. The locale
 * layout passes no messages at all (`messages={null}`): before, every page carried the whole
 * catalog (~11 KB) in its HTML for the few client components that translate text.
 */
export async function ClientMessages({ namespaces, children }: { namespaces: string[]; children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={Object.fromEntries(namespaces.map((ns) => [ns, messages[ns]]))}>
      {children}
    </NextIntlClientProvider>
  );
}
