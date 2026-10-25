import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { NAV_LINKS } from "./navLinks";
import { NavLink } from "./NavLink";
import { LocaleSwitch } from "./LocaleSwitch";
import { MenuButton, MenuPanel, MobileMenuProvider } from "./MobileMenu";

// Previews only. The condition is the inlined build-time value (not IS_PRODUCTION from another
// module), so on live and staging builds the import is dropped and the bar's code ships nowhere:
// a client component imported here is bundled with the header even when it isn't rendered.
const DevOptions =
  process.env.NEXT_PUBLIC_SITE_STAGE === "preview"
    ? dynamic(() => import("./DevOptions").then((m) => m.DevOptions))
    : null;

/**
 * The site header, rendered on the server. Only the parts that react to the visitor are
 * client components, each given its text as props: the active-link marker (NavLink), the
 * mobile menu (MobileMenu) and the language link (LocaleSwitch).
 */
export async function Nav() {
  const t = await getTranslations("nav");
  const tb = await getTranslations("brand");
  // By base language, so the review copies (tr-x-eski, en-x-eski) flip to the
  // other language's current default too.
  const toEnglish = (await getLocale()).split("-")[0] !== "en";
  const switchTarget: Locale = toEnglish ? "en" : "tr";
  const switchLabel = t(toEnglish ? "english" : "turkish");
  const links = NAV_LINKS.map((l) => ({ href: l.href, label: t(l.key) }));

  return (
    <header className="site-nav">
      <MobileMenuProvider>
        <div
          style={{
            maxWidth: "var(--maxw)",
            margin: "0 auto",
            padding: "0 24px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <Link
            href="/"
            aria-label="Data Science Club"
            style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: "var(--text)" }}
          >
            <span style={{ display: "flex", alignItems: "center", height: 52, flex: "none" }}>
              {/* width/height: the SVG viewBox ratio, so its width is reserved before it loads (CSS sets the size). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/dsc_logo_dark.svg" alt="Data Science Club" width={2350} height={1920} style={{ height: 52, width: "auto", display: "block" }} />
            </span>
            <span
              className="nav-lockup"
              style={{ display: "flex", flexDirection: "column", gap: 4, borderLeft: "1px solid var(--border)", paddingLeft: 14, lineHeight: 1 }}
            >
              <span lang="en" style={{ fontFamily: "var(--font-display-stack)", fontWeight: 600, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text)" }}>
                {tb("title")}
              </span>
              <span style={{ fontFamily: "var(--font-body-stack)", fontWeight: 500, fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {tb("university")}
              </span>
            </span>
          </Link>

          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 34 }}>
            {links.map((l) => (
              <NavLink
                key={l.href}
                className="navlink"
                href={l.href}
                style={{ fontFamily: "var(--font-body-stack)", fontWeight: 600, fontSize: 14.5, letterSpacing: "0.01em", color: "var(--text)" }}
              >
                {l.label}
              </NavLink>
            ))}
            <LocaleSwitch target={switchTarget} label={switchLabel} />
          </nav>

          <div className="nav-mobile">
            {/* Language toggle stays in the bar, left of the burger. */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LocaleSwitch target={switchTarget} label={switchLabel} large />
              <MenuButton openLabel={t("openMenu")} closeLabel={t("closeMenu")} />
            </div>
          </div>
        </div>

        {DevOptions && <DevOptions />}

        <MenuPanel links={links} />
      </MobileMenuProvider>
    </header>
  );
}
