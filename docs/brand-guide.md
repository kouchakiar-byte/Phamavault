# PharmaVault — Brand Guide

## Identity

| | |
| --- | --- |
| **Name** | PharmaVault (always one word, capital P and V) |
| **Tagline** | Pharmaceutical Knowledge & Formulation Intelligence — *دانش دارویی و هوشمندی فرمولاسیون* |
| **Slogan** | Your Gateway to Pharmaceutical Development — *دروازه شما به توسعه دارو* |
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
| `vault-900` | `#0B1F3A` | Primary brand navy — hero, headings, primary dark surfaces |
| `vault-950` | `#06111F` | Footer, deepest surfaces |
| `vault-800` / `700` | `#12305A` / `#1C4373` | Hover states, gradients |
| `molecule-500` | `#0E9F9A` | Primary action colour (buttons, links, icons) |
| `molecule-400` | `#2CC4BC` | Accents on dark backgrounds |
| `molecule-50` | `#EDFAF9` | Tinted info surfaces |
| `capsule-500` / `400` | `#C9A54C` / `#DCBD6D` | Premium accent — use sparingly (slogan, keyhole, project icons) |
| `paper` | `#F6F8FB` | Page background |
| `ink` | `#0F1B2D` | Body text |
| `muted` | `#52627A` | Secondary text |
| `line` | `#DDE4EE` | Borders and dividers |

Tokens are defined once in `src/app/globals.css` (`@theme`) and used as Tailwind classes (`bg-vault-900`, `text-molecule-500`, …).

## Typography

| Script | Typeface | Notes |
| --- | --- | --- |
| Persian | **Vazirmatn** | Body line-height 1.85 for comfortable Persian reading |
| English | **IBM Plex Sans** | Technical, neutral, highly legible |
| Data / code | **IBM Plex Mono** | Formulae, codes, numeric data |

Fonts are self-hosted at build time through `next/font/google` (no runtime requests to Google).

## Visual language

- **Scientific / premium**: deep navy surfaces, generous white space, thin borders, restrained shadows.
- **Hexagonal lattice** pattern (`MoleculePattern`) at 3–5% opacity behind dark sections — never on white.
- **Icons**: Lucide line icons, teal on navy tiles.
- Rounded corners: 1rem cards, full-pill buttons.
- RTL/LTR: layouts use logical properties (`ms-`, `ps-`, `start-`), directional icons flip with `rtl:`.
