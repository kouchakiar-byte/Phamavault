// Checks the expanded SOP files in src/data/sop-extended against the schema the SOP page expects.
// Usage: node scripts/monographs/validate-sops.mjs [file ...]
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "src/data/sop-extended";
const codes = new Set(JSON.parse(readFileSync("src/data/sops.json", "utf8")).items.map((i) => i.code));
const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => join(dir, f));
const fa = /[؀-ۿ]/;
let errors = 0;
const seen = new Map();
const err = (f, c, m) => { errors++; console.log(`${f} · ${c}: ${m}`); };
const strList = (f, c, k, v, min) => {
  if (!Array.isArray(v) || v.length < min || v.some((x) => typeof x !== "string" || !x.trim())) err(f, c, `${k} must be a list of at least ${min} non-empty strings`);
};
for (const f of files) {
  let data;
  try { data = JSON.parse(readFileSync(f, "utf8")); } catch (e) { err(f, "-", `invalid JSON: ${e.message}`); continue; }
  for (const [c, s] of Object.entries(data)) {
    if (!codes.has(c)) err(f, c, "code is not in src/data/sops.json");
    if (seen.has(c)) err(f, c, `duplicate (also in ${seen.get(c)})`);
    seen.set(c, f);
    for (const k of ["purpose", "scope"]) if (typeof s[k] !== "string" || !fa.test(s[k]) || s[k].length < 60) err(f, c, `${k} must be a Persian paragraph`);
    if (!Array.isArray(s.responsibilities) || s.responsibilities.length < 3 || s.responsibilities.some((r) => !r.role || !r.duty)) err(f, c, "responsibilities: at least 3 {role, duty}");
    if (!Array.isArray(s.definitions) || s.definitions.some((d) => !d.term || !d.def)) err(f, c, "definitions: list of {term, def}");
    strList(f, c, "safety", s.safety, 0);
    strList(f, c, "materials", s.materials, 0);
    if (!Array.isArray(s.procedure) || s.procedure.length < 3 || s.procedure.some((p) => !p.title || !Array.isArray(p.steps) || p.steps.length < 2)) err(f, c, "procedure: at least 3 sections {title, steps[≥2]}");
    strList(f, c, "acceptance", s.acceptance, 0);
    if (!Array.isArray(s.calculations) || s.calculations.some((x) => !x.name || !x.formula || typeof x.note !== "string")) err(f, c, "calculations: list of {name, formula, note}");
    strList(f, c, "deviations", s.deviations, 1);
    strList(f, c, "records", s.records, 2);
    strList(f, c, "references", s.references, 2);
  }
}
console.log(`${seen.size} SOPs checked, ${errors} problem(s)`);
process.exit(errors ? 1 : 0);
