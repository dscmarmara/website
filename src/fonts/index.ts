import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";

// latin-ext preloaded too: ğ ş İ (and the other Turkish letters outside basic Latin) live there,
// and almost every page has them (the /tr copy, members' names). Without it that file loads only
// once the text needs it, and those letters swap in after the rest of the heading.

// Display / headings
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

// Body / labels
export const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});

// Script hero headings: Condiment with the Turkish letters it lacks (Ğ ğ İ Ş ş)
// added from its own letters and accents, renamed as the OFL requires
// (built by scripts/build-script-font.mjs; licence in ./dsc-script/OFL.txt).
export const dscScript = localFont({
  src: "./dsc-script/DSCScript-Regular.ttf",
  variable: "--font-dsc-script",
  display: "swap",
});
