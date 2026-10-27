@AGENTS.md

## Persian content

All Persian text on the site and in the handbooks follows
`.claude/skills/fa-technical-writing/SKILL.md`: formal technical Persian, technical terms in
English (Disintegrant, Glidant, Detector …), English digits, SI units (`900 mL Medium`), and
every Latin or numeric run isolated so it keeps its order inside Persian. `npm run check`
enforces the parts a script can check (`scripts/check-text.mjs`); render pages and PDFs with
mixed text and read them before committing.
