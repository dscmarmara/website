import { initBotId } from "botid/client/core";

/**
 * Vercel BotID (Basic, free on every plan): the contact form's server action is a public
 * POST endpoint, so its requests carry a browser challenge that `checkBotId()` in
 * src/app/[locale]/contact/actions.ts verifies. A script calling the action directly has none.
 *
 * Server actions POST to the page they run on: /contact (English, at the root) and
 * /tr/contact (the review locales' copies too, on previews). Only those requests are
 * touched; the ~24 KB challenge script loads on the first send, not with the page.
 * Vercel routes the challenge itself; locally `checkBotId()` always passes.
 */
initBotId({
  protect: [
    { path: "/contact", method: "POST" },
    { path: "/*/contact", method: "POST" },
  ],
});
