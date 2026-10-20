import { Pacifico } from "next/font/google";
import localFont from "next/font/local";

// TEMPORARY: the script heading setup before DSC Script, kept only for the
// before/after preview (/karsilastir/font). Condiment lacks Ğ ğ İ Ş ş, so its
// unicode-range left those (and ı) to Pacifico; `adjustFontFallback:false`
// stopped next/font from adding an un-ranged fallback that would catch them
// first. Remove together with that page (TRANSLATIONS.md).
export const pacificoLegacy = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico-legacy",
  display: "swap",
});

export const condimentLegacy = localFont({
  src: "./condiment/Condiment-Regular.ttf",
  variable: "--font-condiment-legacy",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0-11D, U+120-12F, U+132-15D, U+160-2AF, U+2000-206F, U+20A0-20BF",
    },
  ],
});
