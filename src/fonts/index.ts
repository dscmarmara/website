import { Bricolage_Grotesque, Hanken_Grotesk, Pacifico } from "next/font/google";
import localFont from "next/font/local";

// Display / headings
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Body / labels
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Turkish-capable brush script fallback for the hero headings
export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});

// Condiment (script hero). Its unicode-range deliberately EXCLUDES the Turkish
// Latin-Extended letters (Ğ ğ İ ı Ş ş) so those glyphs fall through the
// `--font-script` stack to Pacifico. `adjustFontFallback:false` is required so
// next/font does not inject an un-ranged metric fallback that would grab those
// glyphs before Pacifico is reached.
export const condiment = localFont({
  src: "./condiment/Condiment-Regular.ttf",
  variable: "--font-condiment",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0-11D, U+120-12F, U+132-15D, U+160-2AF, U+2000-206F, U+20A0-20BF",
    },
  ],
});
