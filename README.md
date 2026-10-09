# PharmaVault

**Pharmaceutical Knowledge & Formulation Intelligence** — the website for [pharmavault.ir](https://pharmavault.ir):
a bilingual (Persian/English) knowledge and R&D platform for pharmaceutical formulation, drug development,
excipients, APIs and regulatory affairs.

- Brand guide: [`docs/brand-guide.md`](docs/brand-guide.md)
- Sitemap & content plan: [`docs/sitemap.md`](docs/sitemap.md)

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components, Turbopack) + TypeScript
- Tailwind CSS v4 with brand tokens in `src/app/globals.css`
- Bilingual content: `fa` (default, RTL) and `en` (LTR); every string is held as `{ en, fa }` and titles show both

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
  app/[lang]/                # root layout per locale (html lang/dir, fonts, header, footer)
    page.tsx                 # Home: hero, nine sections, plans, contact
    handbooks/ suppliers/ excipients/ materials/ tools/ formulation/ regulatory/
    qa/ and qa/[code]/       # SOP library and one page per SOP
  app/sitemap.ts, robots.ts, icon.svg
  components/                # header, footer, logo, BiTitle, tables, calculators, formula builder
  content/site.ts            # site copy (home, plans, contact, common labels)
  content/sections.ts        # the nine sections: titles, descriptions, illustrations
  content/pages.ts           # section page headers and labels
  data/*.json                # reference databases (excipients, materials, SOPs, …)
  i18n/                      # locales, Bi type and helpers
  proxy.ts                   # locale detection / redirect
```

## Common tasks

- **Edit copy** — `src/content/*.ts`; each string is `bi("English", "فارسی")`.
- **Edit a database** — the JSON in `src/data/` (types in `src/data/index.ts`).
- **Show a title in both languages** — use `<BiTitle text={…} locale={locale} />`.
