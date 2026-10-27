# Weekly free handbooks

Each folder builds one PDF handbook in the site's colours, with the site's own fonts.

```
node tools/handbooks/hplc/build.mjs            # full handbook → tools/handbooks/hplc/out/PharmaVault-HPLC-Handbook.pdf
node tools/handbooks/hplc/build.mjs --preview  # cover + first chapters only
node tools/handbooks/dissolution/build.mjs     # issue 2 → tools/handbooks/dissolution/out/PharmaVault-Dissolution-Handbook.pdf
```

Needs Playwright with Chromium (`/opt/node-tools/node_modules/playwright`, `/opt/pw-browsers/chromium`),
`qpdf`, `pdfinfo`/`pdftotext` (poppler) and Python 3 with `pypdf`.

- `ch/*.mjs` hold the chapters; `parts.mjs` sets their order; `lib.mjs` the page styles, boxes, tables and SVG figure tools.
- The table of contents is filled from a first render: each heading carries a hidden marker that is found again in the PDF text.
- The finished file is encrypted (printing allowed; copying, editing and extraction not) and its fonts carry no
  text mapping, so copied text comes out as meaningless glyph codes.

To publish an issue, copy the PDF to `public/downloads/`, put the cover and sample-page images in
`src/assets/handbooks/` and add the issue to `src/content/free-handbooks.ts`.

Persian text follows `.claude/skills/fa-technical-writing/SKILL.md`. Each `build.mjs` runs
`isolateLatin()` before printing so English terms, numbers and units keep their order inside
Persian ("900 mL Medium"); keep it in any new handbook, and keep equation boxes free of
Persian words.
