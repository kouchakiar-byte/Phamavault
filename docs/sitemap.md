# PharmaVault — Sitemap

The structure follows the approved design (claude.ai artifact "Pharmavault").
Every page exists in both locales: `/fa/...` (default, RTL) and `/en/...` (LTR); every title is shown in both languages.

| Page | Path | Content | Data source |
| --- | --- | --- | --- |
| Home | `/` | Hero with referenced standards, supplier bank spotlight, by-department overview (R&D, QC, QA, production, regulatory, supply), nine sections with live counts, databases, calculations, three-step access, plans (`#plans`, `#enterprise`) with comparison table, separate orders, FAQ, contact (`#contact`); plan buttons open a pre-filled request email | `src/content/site.ts`, `src/content/sections.ts` |
| Handbooks · هندبوک‌ها | `/handbooks` | 8 planned handbooks with chapters (in preparation) | `src/data/handbooks.json` |
| **Supplier & Manufacturer Bank** · بانک تأمین‌کنندگان و تولیدکنندگان مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی (featured) | `/suppliers` (`?q=`, `?cat=`, `?type=`) | 139 Iranian manufacturers and importers, 2,164 materials: synonym-aware search (B1 = thiamine = تیامین, B1 ≠ B12), filters, credibility sort, copyable phones. Featured on the home page (search band, stats, category links), in the header and as the hero's main button | `src/data/suppliers.json`, `src/lib/supplier-search.ts` |
| Excipient Database · بانک اکسیپیان | `/excipients` | 272 excipients: search (EN/FA/trade name/CAS), filter by function and dosage form | `src/data/excipients.json` |
| Raw Material Database · بانک مواد اولیه | `/materials` | 32 APIs, vitamins and minerals; search and group filter | `src/data/raw-materials.json` |
| Pharmaceutical Calculators · ماشین‌حساب‌های دارویی | `/tools` | 8 live calculators: HLB, isotonicity, dilution, buffer, suppository, mg/mmol/mEq, vitamins, batch scale-up | `src/components/calculators.tsx` |
| Formulation Tools · ابزار فرمولاسیون | `/formulation` | Starting-formula builder for 8 dosage forms | `src/data/formulation.json` |
| Regulatory Resources · منابع رگولاتوری | `/regulatory` | CTD structure, 20 ICH guidelines (searchable), ICH Q1A stability conditions | `src/data/regulatory.json` |
| Quality Assurance · تضمین کیفیت | `/qa` | 136 SOPs by department (search, filter), standard SOP template | `src/data/sops.json` |
| SOP full text | `/qa/<code>` | Full Persian text of each SOP with copy button (e.g. `/fa/qa/qa-001`) | `src/data/sops.json` |
| Enterprise Solutions · راهکار سازمانی | `/#enterprise` | Enterprise plan on the home page | `src/content/site.ts` |

## Next steps

1. Write the handbooks (currently titles and chapters only).
2. Accounts and subscriptions (plans are shown, sign-up is by email for now).
3. Deployment and analytics.
