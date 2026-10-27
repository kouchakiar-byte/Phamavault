---
name: fa-technical-writing
description: PharmaVault's rules for Persian technical writing — formal Persian with English technical terms, correct order of English words, numbers and units inside Persian text (e.g. "900 mL Medium"), SI units, English digits and translation of sources. Use for any Persian text written or edited for pharmavault.ir (src/content, src/data, pages, components), for the free handbooks and other PDFs under tools/handbooks, for translations and summaries of English sources, and before publishing any Persian content.
---

# Persian technical writing for PharmaVault

PharmaVault is a specialist pharmaceutical site. Every Persian sentence on the site and in
the handbooks must read as professional technical Persian and render in the right order.
Apply these rules without being asked, every time Persian content is written, edited,
translated or summarised.

## 1. Register and terminology

- Formal written Persian (فارسی رسمی و نوشتاری). No colloquial forms: not «یه»، «میشه»،
  «اینجوری»، «اینا»، «دیگه»، «براش»؛ write «یک»، «می‌شود»، «به این شکل»، «این‌ها».
- Technical terms stay in English, as pharmacists use them. Never coin or use a Persian
  equivalent for them:

  | Write | Not |
  | --- | --- |
  | Disintegrant, Disintegration, Superdisintegrant | باززا، متلاشی‌کننده |
  | Glidant | تسهیل‌کننده جریان |
  | Filler / Diluent | رقیق‌کننده |
  | Lubricant, Binder | (keep English where the site already does) |
  | Detector, Detection | آشکارساز، آشکارسازی |
  | Degasser, Deaeration | دگازر |
  | Medium, Paddle, Basket, Vessel, Sinker, Coning | — |
  | System suitability, Resolution, Tailing factor | — |
  | Assay, Impurities, Specification, OOS, CAPA | — |

  Persian plural or suffix after an English term: `Mediumها`، `Excipientهای` (with ZWNJ
  when needed). Established Persian words that are standard in Iranian pharmacy (انحلال،
  پایداری، ناخالصی، صحه‌گذاری، فارماکوپه) are fine.
- Glossaries (handbook appendices) and search aliases (`src/lib/site-search.ts`) may list
  Persian equivalents on purpose; they are the only exception.

## 2. Numbers, units and symbols

- English digits only (0–9), never Persian digits.
- SI spelling and case: `mL`, `μL`, `L`, `mg`, `μg`, `g`, `kg`, `μm`, `nm`, `°C`, `rpm`,
  `min`, `h`, `kPa`, `MPa`, `mM`, `N`. Write `mL`, never `ml` or `ML`.
- A space between a number and its unit: `10 mg`, `900 mL`, `37 °C`, `50 rpm`, `0.1 N HCl`.
  Percent sticks to the number: `85%`.
- Ranges with «تا» in Persian prose (`50 تا 75 rpm`) or an en dash inside an English run.
- Keep a quantity, its unit and the English noun it describes in one run: `900 mL Medium`,
  `Apparatus 2 (Paddle)`, `Q + 5%`, `(S1 + S2) ≥ Q`.

## 3. Order of English and numbers inside Persian (bidi)

Inside right-to-left text the browser reorders Latin runs unless they are isolated; that is
how "900 mL Medium" turned into "Medium 900 :mL". Every Latin or numeric run inside Persian
must be isolated:

- **Site content (TS/TSX):** use the `ltr()` helper (`⁦…⁩`, LRI/PDI) found in the content
  files, or the `isolate()` / `LATIN_RUN` pass used by the sheet pages
  (`src/app/[lang]/excipients/[slug]/page.tsx`,
  `src/app/[lang]/references/general-chapters/[slug]/page.tsx`). Codes such as `USP <711>`,
  `Ph. Eur. 2.9.3`, `ICH Q2(R2)` and CTD numbers (`3.2.P.5.1`) are one run.
- **Handbooks (tools/handbooks):** `build.mjs` runs `isolateLatin()` before printing. Keep it
  in every new handbook build. It keeps a label and its value apart ("A1: آزادسازی") and
  leaves an unmatched bracket to the Persian text.
- **Equation boxes and other left-to-right blocks** contain no Persian words. Use English
  labels inside them ("Without SLS: …", "Max. amount of Pepsin = …"); put the Persian
  explanation in the caption below.
- **CTD and chapter codes:** the number comes before the English title (`3.2.P.5.1
  Specification(s)`), isolated as one run.

## 4. Translating and summarising sources

- Translate the meaning into fluent technical Persian; keep the technical terms in English
  (section 1). Do not translate word for word.
- Do not reproduce copyrighted text (pharmacopoeias, Handbook of Pharmaceutical Excipients,
  paid guidance). Write PharmaVault's own explanation and cite the source.
- State only what the source says; never invent values, limits or references. When unsure
  of a number, leave it out or say it must be checked against the official text.

## 5. Check before you finish

1. Run `npm run check`. It includes `scripts/check-text.mjs`, which fails on Persian coined
   terms, colloquial words, `ml`, and a number joined to its unit.
2. For a page or a PDF with mixed Persian and English, render it (Playwright screenshot or
   `pdftoppm`) and read the mixed lines: numbers, units, codes, formulas and brackets in the
   right order.
3. Fix what the check or the screenshot shows before committing.
