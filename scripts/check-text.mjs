// Checks the Persian technical writing on the site and in the handbooks
// (rules: .claude/skills/fa-technical-writing/SKILL.md): technical terms stay in
// English instead of coined or colloquial Persian equivalents, no colloquial
// words, SI unit spelling (mL, not ml) and a space between a number and its unit.
// Data copied from outside sources (supplier catalogues, PubChem, FDA files) is
// quoted as published and not checked.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const QUOTED = /(suppliers|excipient-sheets|orange-book|iran-products|raw-materials)\.json$/;
// Glossaries and search aliases may name the Persian equivalent on purpose.
const ALLOWED = /tools\/handbooks\/[^/]+\/ch\/app[A-Z]\.mjs$|src\/lib\/site-search\.ts$/;

const files = [
  ...walk("src/content"),
  ...walk("src/data"),
  ...walk("src/app"),
  ...walk("src/components"),
  ...walk("src/lib"),
  ...walk("tools/handbooks").filter((f) => f.includes("/ch/")),
].filter((f) => /\.(ts|tsx|json|mjs)$/.test(f) && !QUOTED.test(f));

const P = "[\\u0600-\\u06FF\\u200c]";
const rules = [
  {
    name: "Persian equivalent of an English technical term",
    re: /باززا|تسهیل[‌ ]?کننده(?:\s|‌)جریان|رقیق[‌ ]?کننده|آشکارساز|دگازر|متلاشی[‌ ]?کننده/g,
    fix: "Disintegrant, Glidant, Diluent, Detector/Detection, Degasser",
    skip: ALLOWED,
  },
  {
    name: "colloquial word",
    re: new RegExp(`(?<!${P})(یه|میشه|می‌شه|نمیشه|اینجوری|اونجوری|اونجا|اینا|اونا|چجوری|دیگه|براش|بهش|ازش|میخوای|می‌خوای)(?!${P})`, "g"),
    fix: "formal written Persian",
  },
  { name: "unit spelled ml", re: /\b\d+(?:[.,]\d+)?\s?ml\b/g, fix: "mL" },
  {
    name: "number joined to its unit",
    re: /(?<![A-Za-z\-/])\d+(?:\.\d+)?(?:mg|mL|kg|μg|µg|μL|µL|μm|µm|nm|rpm|kPa|MPa|mM|min)\b/g,
    fix: "a space between number and unit (10 mg)",
  },
];

const errors = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (const rule of rules) {
    if (rule.skip?.test(file)) continue;
    lines.forEach((line, i) => {
      for (const m of line.matchAll(rule.re)) errors.push(`${file}:${i + 1}: ${rule.name} "${m[0]}" → ${rule.fix}`);
    });
  }
}

if (errors.length) {
  console.error(`check-text: ${errors.length} problem(s)\n${errors.slice(0, 50).join("\n")}`);
  process.exit(1);
}
console.log(`check-text: OK (${files.length} files)`);
