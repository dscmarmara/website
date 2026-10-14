/**
 * Pass-through root layout. <html> and <body> live in [locale]/layout.tsx;
 * this file only exists so app/not-found.tsx can catch the 404s that happen
 * outside a locale (see that file).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
