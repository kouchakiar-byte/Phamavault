// Checks the site's data before a build or a merge: every JSON file parses,
// every supplier record is complete and unique, every "last reviewed" date
// exists, no "last updated" date is typed by hand into the content (those go
// stale; dates come from the daily update or scripts/data-dates.mjs), and every
// number is written in English digits.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const fail = (msg) => errors.push(msg);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

// 1. Every JSON data file parses.
for (const file of walk("src/data").filter((f) => f.endsWith(".json"))) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${file}: invalid JSON (${error.message})`);
  }
}

// 2. Supplier records: required fields, known categories, no duplicates.
const pages = readFileSync("src/content/pages.ts", "utf8");
const categoryStart = pages.indexOf("categories: {");
const categoryBlock = pages.slice(categoryStart, pages.indexOf("\n    }", categoryStart));
const categories = new Set([...categoryBlock.matchAll(/^\s+(\w+): bi\(/gm)].map((m) => m[1]));
const { companies, synonyms, provinceOrder } = JSON.parse(readFileSync("src/data/suppliers.json", "utf8"));
if (!Array.isArray(synonyms) || !Array.isArray(provinceOrder)) fail("suppliers.json: synonyms and provinceOrder must be arrays");
const names = new Set();
for (const [i, c] of companies.entries()) {
  const at = `suppliers.json company ${i} (${c.n ?? "?"})`;
  for (const key of ["n", "e", "prov", "city", "src"]) if (typeof c[key] !== "string" || !c[key].trim()) fail(`${at}: missing ${key}`);
  if (c.t !== "m" && c.t !== "t") fail(`${at}: type must be "m" or "t"`);
  if (!Array.isArray(c.c) || !c.c.length) fail(`${at}: no category`);
  for (const cat of c.c ?? []) if (!categories.has(cat)) fail(`${at}: unknown category "${cat}"`);
  if (!Array.isArray(c.tel)) fail(`${at}: tel must be an array`);
  if (!Array.isArray(c.p)) fail(`${at}: p must be an array`);
  for (const p of c.p ?? []) if (typeof p !== "string" || !p.includes("|")) fail(`${at}: product "${p}" is not "فارسی|English"`);
  if (names.has(c.n)) fail(`${at}: duplicate name`);
  names.add(c.n);
}

// 3. Every "last reviewed" key has a date.
const dates = JSON.parse(readFileSync("src/data/data-dates.json", "utf8"));
for (const [key, value] of Object.entries(dates)) if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) fail(`data-dates.json: bad date for ${key}`);

// 4. No hand-typed "last updated / reviewed" dates in the content.
const stale = /(آخرین (به‌روزرسانی|بازبینی)[^"`]{0,30}[0-9۰-۹]{1,2} (فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند))|(آخرین (به‌روزرسانی|بازبینی)[^"`{]{0,30}(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند) [0-9۰-۹]{4})|(Last (updated|reviewed)[^"`{]{0,20}\d{4})/;
for (const file of [...walk("src/content"), ...walk("src/data"), ...walk("src/components"), ...walk("src/app")].filter((f) => /\.(ts|tsx)$/.test(f))) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, n) => {
      if (stale.test(line)) fail(`${file}:${n + 1}: hand-typed "last updated" date; use the daily-update stamp or {month} with withReviewedMonth`);
    });
}

// 5. English digits everywhere in the content (Persian ones only in code that reads what users type).
const persianDigits = /[۰-۹٠-٩٫٬٪]/;
const digitCode = /۰۱۲۳|٠١٢٣|\/\[[^\]\n]*[۰-۹٠-٩٫٬٪][^\]\n]*\][^/\n]*\/[a-z]*|\/[٫٬٪]\/[a-z]*/;
for (const file of walk("src").filter((f) => /\.(ts|tsx|json)$/.test(f))) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, n) => {
      if (persianDigits.test(line) && !digitCode.test(line)) fail(`${file}:${n + 1}: Persian digit; the site writes numbers in English digits`);
    });
}

if (errors.length) {
  console.error(`check-data: ${errors.length} problem(s)\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`check-data: OK (${companies.length} suppliers, ${categories.size} categories)`);
