// Checks the monograph files in src/data/monographs against the schema the sheet page expects.
// Usage: node scripts/monographs/validate.mjs [file ...]
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "src/data/monographs";
const names = new Set(JSON.parse(readFileSync("src/data/excipients.json", "utf8")).items.map((i) => i.name));
const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => join(dir, f));
const BI = ["applications", "description", "stability", "incompatibilities", "manufacture", "safety", "handling", "regulatory", "related", "comments"];
const PH = new Set(["BP", "JP", "PhEur", "USP-NF"]);
const REFS = new Set(["usp", "ep", "bp", "jp", "iid", "gras", "eu-additives", "efsa", "jecfa", "ich", "hsdb"]);
const fa = /[؀-ۿ]/;
let errors = 0;
const seen = new Map();
const err = (f, n, m) => { errors++; console.log(`${f} · ${n}: ${m}`); };
for (const f of files) {
  let data;
  try { data = JSON.parse(readFileSync(f, "utf8")); } catch (e) { err(f, "-", `invalid JSON: ${e.message}`); continue; }
  for (const [n, m] of Object.entries(data)) {
    if (!names.has(n)) err(f, n, "name is not in src/data/excipients.json");
    if (seen.has(n)) err(f, n, `duplicate (also in ${seen.get(n)})`);
    seen.set(n, f);
    if (!Array.isArray(m.names)) err(f, n, "names must be an array");
    else for (const x of m.names) if (!PH.has(x.ph) || !x.name) err(f, n, `bad names entry ${JSON.stringify(x)}`);
    for (const k of ["tradeNames", "chemicalName", "formula", "mw"]) if (typeof m[k] !== "string") err(f, n, `${k} must be a string`);
    for (const k of BI) {
      const v = m[k];
      if (!v || typeof v.en !== "string" || typeof v.fa !== "string" || !v.en.trim() || !v.fa.trim()) err(f, n, `${k} needs non-empty en and fa`);
      else if (!fa.test(v.fa)) err(f, n, `${k}.fa is not Persian`);
    }
    if (!Array.isArray(m.properties)) err(f, n, "properties must be an array");
    else for (const p of m.properties) if (!p.k?.en || !p.k?.fa || !p.v?.en || !p.v?.fa) err(f, n, `bad property ${JSON.stringify(p).slice(0, 80)}`);
    if (!Array.isArray(m.refs) || m.refs.some((r) => !REFS.has(r))) err(f, n, `refs must use only: ${[...REFS].join(", ")}`);
  }
}
console.log(`${seen.size} monographs checked, ${errors} problem(s)`);
process.exit(errors ? 1 : 0);
