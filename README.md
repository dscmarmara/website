# DSC Marmara website

The Data Science Club site at <https://www.dscmarmara.com.tr>: Next.js 16 (App Router), React 19, next-intl
(English at `/`, Turkish at `/tr`), MDX for blog posts, deployed on Vercel.

## Develop

```bash
npm install
npm run dev        # http://localhost:3737/tr
npm run dev:lan    # the same, reachable from a phone on the local network
```

| Script | What it does |
|---|---|
| `npm run build` / `npm start` | production build and server. A local build counts as the live site; add `NEXT_PUBLIC_SITE_STAGE=preview` for the preview tools |
| `npm run lint` | ESLint |
| `npm run seo-audit [baseUrl]` | checks titles, descriptions, canonical/hreflang and structured data on every sitemap URL |
| `npm run indexnow` | notifies search engines after a release |
| `npm run site-texts` | writes `SITE_METINLERI.md`: every text the live site shows, page by page |

## Where things are

- `TRANSLATIONS.md`: where each piece of text lives, the release flow (`preview-development` → `staging` →
  `main`), blog writing, security notes.
- `AGENTS.md`: instructions for AI coding agents (the Next.js block is maintained by `next dev`).
- Version-matched Next.js docs: `node_modules/next/dist/docs/`.
