# PharmaVault

**Pharmaceutical Knowledge & Formulation Intelligence** — the website for [pharmavault.ir](https://pharmavault.ir):
a bilingual (Persian/English) knowledge and R&D platform for pharmaceutical formulation, drug development,
excipients, APIs and regulatory affairs.

- Brand guide: [`docs/brand-guide.md`](docs/brand-guide.md)
- Sitemap & content plan: [`docs/sitemap.md`](docs/sitemap.md)

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components, Turbopack) + TypeScript
- Tailwind CSS v4 with brand tokens in `src/app/globals.css`
- MDX for Knowledge Base articles (`@next/mdx` + `remark-gfm`)
- Dictionary-based i18n: `fa` (default, RTL) and `en` (LTR)

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /fa or /en
npm run build   # production build (all pages prerendered)
npm run lint
```

## Project structure

```
src/
  app/
    [lang]/                  # root layout per locale (html lang/dir, fonts, header, footer)
      page.tsx               # Home
      [section]/page.tsx     # shared template for sitemap pages (formulation, apis, …)
      knowledge-base/        # article index and [slug] article pages
    sitemap.ts, robots.ts, icon.svg
  components/                # header, footer, logo, UI primitives
  content/articles/{fa,en}/  # MDX articles
  i18n/                      # locale config + fa/en dictionaries
  lib/site.ts                # sitemap definition (slugs, icons, groups)
  lib/articles.ts            # article registry and loaders
  proxy.ts                   # locale detection / redirect
```

## Common tasks

- **Edit page copy** — `src/i18n/dictionaries/fa.json` and `en.json` (keep both in sync).
- **Add an article** — create `src/content/articles/<locale>/<slug>.mdx` exporting `metadata`
  (`title`, `description`, `date`, `category`, `readingMinutes`), then add the slug in `src/lib/articles.ts`.
- **Add a sitemap page** — add an entry to `sections` in `src/lib/site.ts` and its copy under `sections` in both dictionaries.
- **Give a page a custom design** — create `src/app/[lang]/<slug>/page.tsx`.
