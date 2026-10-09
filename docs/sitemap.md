# PharmaVault — Sitemap & Content Plan

All pages exist in both locales: `/fa/...` (default, RTL) and `/en/...` (LTR).
Visiting `/` redirects by saved preference (`NEXT_LOCALE` cookie), then browser language, then Persian.

| # | Page | Path | Status | Planned content |
| --- | --- | --- | --- | --- |
| 1 | Home | `/` | ✅ Built | Hero, audiences, expertise, latest articles, resources, project areas, CTA |
| 2 | Pharmaceutical Formulation | `/formulation` | 🟡 Outline | Pre-formulation, solid oral, liquids & semi-solids, MR systems, scale-up, stability |
| 3 | Drug Development | `/drug-development` | 🟡 Outline | Generic development, reverse engineering, dissolution & f2, BE design, QbD, analytical methods |
| 4 | Pharmaceutical Excipients | `/excipients` | 🟡 Outline | Functionality & grades, compatibility, functional classes, CR polymers, solubilizers, specs |
| 5 | APIs | `/apis` | 🟡 Outline | Monographs, BCS, polymorphism, impurities, DMF/CEP, supplier qualification |
| 6 | Regulatory & CTD | `/regulatory` | 🟡 Outline | CTD/eCTD modules, Module 3, IFDA requirements, ICH overview, variations, GMP |
| 7 | Pharmaceutical Resources | `/resources` | 🟡 Outline | Guideline library, calculators, templates, pharmacopoeia refs, glossary, databases |
| 8 | Articles / Knowledge Base | `/knowledge-base` | ✅ Built | Article index + article pages (MDX); 2 seed articles per language |
| 9 | Projects | `/projects` | 🟡 Outline | Project areas now; real case studies when available |
| 10 | About Us | `/about` | 🟡 Outline | Mission, team, scientific approach, partnerships |
| 11 | Contact | `/contact` | 🟡 Outline | Enquiry topics + email; contact form planned |

"Outline" pages are rendered by the shared `src/app/[lang]/[section]/page.tsx` from dictionary copy.
To give a page its own design, create `src/app/[lang]/<slug>/page.tsx` — it takes precedence automatically.

## Suggested next steps

1. Confirm remaining brand decisions (colours, logo concept). Contact email `info@pharmavault.ir` is confirmed.
2. Write full content for each expertise page (Formulation → Excipients → Regulatory first).
3. Grow the Knowledge Base: categories, tags, search, related articles.
4. Resources: start with the guideline library and a glossary; then calculators.
5. Contact form (with spam protection) and About page with real team bios.
6. Deployment (e.g. Vercel or an Iranian host with Node.js) and analytics.
