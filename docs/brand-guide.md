# PharmaVault — Brand Guide

## Identity

| | |
| --- | --- |
| **Name** | PharmaVault (always one word, capital P and V) |
| **Tagline** | Pharmaceutical Knowledge & Intelligence Platform — *پلتفرم دانش و اطلاعات هوشمند دارویی* |
| **Headline** | Everything a pharmaceutical company looks for — *هر چیزی که یک شرکت داروسازی دنبالش می‌گردد* |
| **Domain** | pharmavault.ir |
| **Positioning** | A professional knowledge and R&D platform for pharmaceutical development — not a shop, not a news site. |

### Mission

To make reliable, practical pharmaceutical development knowledge — formulation, excipients, APIs and
regulatory practice — accessible to the people who develop medicines.

### Audiences

| Audience | What they come for |
| --- | --- |
| Pharmacists | Applied formulation and product knowledge |
| Pharmaceutical companies | Development support, consulting, regulatory readiness |
| R&D teams | Methods, guidelines, development strategy |
| Formulators | Excipient selection, process and dosage-form design |
| Regulatory affairs | CTD structure, ICH guidelines, IFDA requirements |
| Raw-material suppliers | Visibility to formulators, technical data for excipients and APIs |

### Voice

- **Scientific, not academic.** Precise terminology, short sentences, practical conclusions.
- **Referenced.** Cite ICH, pharmacopoeias and regulatory guidance where a claim depends on them.
- **Bilingual by design.** Persian first for the domestic audience; English for international credibility.
  **Every title is shown in both languages side by side** (the reader's language first), on both `/fa` and `/en` — see `BiTitle` in `src/components/ui.tsx`.
  Keep established technical terms (API, CTD, BCS, DSC, ICH Q8) in Latin script inside Persian text.
- **No fabricated proof.** No invented clients, numbers or testimonials — case studies are published only when real.

## Logo

The mark is a **benzene-ring hexagon** whose inner aromatic circle doubles as a **vault dial with a keyhole**:
chemistry + protected, curated knowledge.

- Source: `src/components/logo.tsx` (`LogoMark`, `Logo`), static copy in `public/logo-mark.svg`, favicon `src/app/icon.svg`.
- Wordmark: "Pharma" in navy (or white on dark), "Vault" in Molecule teal, set in IBM Plex Sans Bold.
- The wordmark is always written in Latin script and left-to-right, including on Persian pages.
- Minimum size: 24px for the mark; keep clear space equal to the keyhole height around it.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `vault-900` | `#1F426F` | Primary brand navy — headings, enterprise plan, hero gradient start |
| `vault-950` | `#18355C` | Footer |
| `vault-800` / `700` | `#2A5288` / `#3864A0` | Hero gradient, hover states |
| `molecule-600` | `#0D8A84` | Primary buttons and active tabs (white text) |
| `molecule-500` | `#14A49D` | Icons, illustrations, focus rings |
| `molecule-400` | `#43CBC3` | Accents on dark backgrounds |
| `molecule-50` | `#EEF9F8` | Page-header and info tints |
| `capsule-500` / `400` | `#C39B3D` / `#E0C27A` | Premium accent — use sparingly (logo keyhole) |
| `paper` | `#F8FAFC` | Page background |
| `ink` | `#16273D` | Body text |
| `muted` | `#566A80` | Secondary text |
| `line` | `#DFE6EF` | Borders and dividers |

The palette was lightened in October 2026 at the owner's request (same hues, lighter navy, white page headers).

Tokens are defined once in `src/app/globals.css` (`@theme`) and used as Tailwind classes (`bg-vault-900`, `text-molecule-500`, …).

## Typography

| Script | Typeface | Notes |
| --- | --- | --- |
| Persian | **Vazirmatn** | Body line-height 1.85 for comfortable Persian reading |
| English | **IBM Plex Sans** | Technical, neutral, highly legible |
| Data / code | **IBM Plex Mono** | Formulae, codes, numeric data |

Fonts are self-hosted at build time through `next/font/google` (no runtime requests to Google).

## Visual language

- **Scientific / premium, light**: white surfaces, a navy-to-teal gradient only in the home hero, thin borders, restrained shadows.
- **Hexagonal lattice** pattern (`MoleculePattern`) at low opacity behind the hero, page headers and contact band.
- **Section illustrations**: animated line drawings per section (`art` in `src/content/sections.ts`), motion disabled for reduced-motion users.
- **Icons**: Lucide line icons.
- Rounded corners: 1rem cards, full-pill buttons.
- RTL/LTR: layouts use logical properties (`ms-`, `ps-`, `start-`), directional icons flip with `rtl:`.
