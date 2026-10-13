// Turn the Orange Book products.txt (tilde-delimited, with a header row) into
// src/data/orange-book.json: one compact row per product.
//   usage: node scripts/orange-book/build.mjs <products.txt> <out.json>
import { readFile, writeFile } from "node:fs/promises";

const [src, out] = process.argv.slice(2);
const text = (await readFile(src, "latin1")).replace(/\r/g, "");
const [head, ...lines] = text.split("\n").filter((l) => l.trim());

// Find columns by name, ignoring case and punctuation, so small header changes do not break the import.
const cols = head.split("~").map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
/** Index of the first of the given names that exists, in order of preference. */
const col = (...names) => {
  for (const n of names) {
    const i = cols.indexOf(n);
    if (i >= 0) return i;
  }
  throw new Error(`column not found: ${names[0]} (header: ${head})`);
};
const c = {
  ingredient: col("ingredient"),
  form: col("dfroute"),
  trade: col("tradename"),
  applicant: col("applicantfullname", "applicant"),
  strength: col("strength"),
  applType: col("appltype"),
  applNo: col("applno"),
  te: col("tecode"),
  rld: col("rld"),
  rs: col("rs"),
  type: col("type"),
};

const rows = [];
for (const line of lines) {
  const f = line.split("~").map((x) => x.trim());
  if (f.length < cols.length - 1) continue;
  rows.push([
    f[c.ingredient],
    f[c.trade],
    f[c.applicant],
    f[c.strength],
    f[c.form],
    f[c.applType] === "N" ? "N" : "A",
    f[c.applNo],
    f[c.te],
    f[c.rld] === "Yes" ? 1 : 0,
    f[c.rs] === "Yes" ? 1 : 0,
    f[c.type] === "RX" ? "R" : f[c.type] === "OTC" ? "O" : "D",
  ]);
}
rows.sort((a, b) => a[0].localeCompare(b[0]) || b[8] - a[8] || a[1].localeCompare(b[1]));

const data = {
  source: "FDA, Approved Drug Products with Therapeutic Equivalence Evaluations (Orange Book) — data files",
  updated: new Date().toISOString().slice(0, 10),
  fields: ["ingredient", "trade", "applicant", "strength", "dosageFormRoute", "applType", "applNo", "teCode", "rld", "rs", "type"],
  products: rows,
};
await writeFile(out, JSON.stringify(data) + "\n");
console.log(`${rows.length} products, ${new Set(rows.map((r) => r[0])).size} ingredients → ${out}`);
