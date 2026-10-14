// Builds src/data/excipient-sheets.json: identifiers and physicochemical data
// for each excipient from PubChem (NIH / NCBI). Text properties are taken
// only from the Hazardous Substances Data Bank (HSDB, U.S. National Library
// of Medicine; public domain), each with its HSDB reference.
//
// Usage: node scripts/excipient-sheets/fetch.mjs src/data/excipients.json src/data/excipient-sheets.json
import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
const { items } = JSON.parse(readFileSync(input, "utf8"));
const PUG = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound";
const HEADINGS = [
  "Physical Description",
  "Color/Form",
  "Odor",
  "Taste",
  "Melting Point",
  "Boiling Point",
  "Density",
  "Solubility",
  "pH",
  "Dissociation Constants",
  "Stability/Shelf Life",
  "Storage Conditions",
  "Reactivities and Incompatibilities",
  "Hygroscopicity",
];
const CAS_RE = /^\d{2,7}-\d{2}-\d$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await sleep(260); // PubChem asks for no more than 5 requests per second
    const res = await fetch(url, { headers: { "User-Agent": "PharmaVault data build (pharmavault.ir)" } });
    if (res.status === 404) return null;
    if (res.ok) return res.json();
    if (res.status === 503 || res.status === 429) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (res.status === 400) return null;
    throw new Error(`${res.status} ${url}`);
  }
  return null;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function valueText(v) {
  if (!v) return "";
  if (v.StringWithMarkup) return v.StringWithMarkup.map((s) => s.String).join(" ");
  if (v.Number) return `${v.Number.join(" – ")}${v.Unit ? ` ${v.Unit}` : ""}`;
  return "";
}

function collect(section, heading, out) {
  if (section.TOCHeading === heading && section.Information) out.push(...section.Information);
  for (const s of section.Section ?? []) collect(s, heading, out);
}

async function hsdb(cid, heading) {
  const data = await get(`${VIEW}/${cid}/JSON?heading=${encodeURIComponent(heading)}`);
  if (!data?.Record) return [];
  const refs = new Map((data.Record.Reference ?? []).map((r) => [r.ReferenceNumber, r]));
  const info = [];
  for (const s of data.Record.Section ?? []) collect(s, heading, info);
  const out = [];
  for (const i of info) {
    const ref = refs.get(i.ReferenceNumber);
    if (!ref || !/Hazardous Substances Data Bank/i.test(ref.SourceName)) continue;
    const text = valueText(i.Value).replace(/\s+/g, " ").trim();
    if (!text || out.some((o) => o.text === text)) continue;
    out.push({
      text: text.length > 420 ? `${text.slice(0, 417).replace(/\s+\S*$/, "")}…` : text,
      ref: { source: "HSDB", record: ref.Name ?? "", id: ref.SourceID ?? "", url: ref.URL ?? "" },
    });
    if (out.length === 2) break;
  }
  return out;
}

async function unii(cid) {
  const data = await get(`${VIEW}/${cid}/JSON?heading=UNII`);
  if (!data?.Record) return "";
  const info = [];
  for (const s of data.Record.Section ?? []) collect(s, "UNII", info);
  return info.map((i) => valueText(i.Value)).find((t) => /^[A-Z0-9]{10}$/.test(t)) ?? "";
}

const result = { generated: new Date().toISOString().slice(0, 10), items: {} };
let n = 0;
for (const item of items) {
  n++;
  const queries = [CAS_RE.test(item.cas) ? item.cas : null, item.name].filter(Boolean);
  let cid = null;
  for (const q of queries) {
    const r = await get(`${PUG}/compound/name/${encodeURIComponent(q)}/cids/JSON`);
    cid = r?.IdentifierList?.CID?.[0] ?? null;
    if (cid) break;
  }
  if (!cid) {
    result.items[item.name] = { cid: null };
    console.log(`${n}/${items.length} ${item.name}: no PubChem compound`);
    continue;
  }
  const p = (await get(`${PUG}/compound/cid/${cid}/property/Title,MolecularFormula,MolecularWeight,IUPACName/JSON`))?.PropertyTable?.Properties?.[0] ?? {};
  const syn = (await get(`${PUG}/compound/cid/${cid}/synonyms/JSON`))?.InformationList?.Information?.[0]?.Synonym ?? [];
  // The record matches the excipient when PubChem lists its CAS number or its name among the synonyms.
  const names = [item.name, ...item.synonyms.split(/,\s*/)].map(norm).filter(Boolean);
  const synNorm = new Set(syn.map(norm));
  const casMatch = CAS_RE.test(item.cas) && syn.includes(item.cas);
  const nameMatch = names.some((x) => synNorm.has(x)) || names.includes(norm(p.Title ?? ""));
  const props = {};
  for (const h of HEADINGS) {
    const rows = await hsdb(cid, h);
    if (rows.length) props[h] = rows;
  }
  result.items[item.name] = {
    cid,
    title: p.Title ?? "",
    formula: p.MolecularFormula ?? "",
    mw: p.MolecularWeight ? String(p.MolecularWeight) : "",
    iupac: p.IUPACName ?? "",
    unii: await unii(cid),
    match: casMatch ? "cas" : nameMatch ? "name" : "none",
    props,
  };
  console.log(`${n}/${items.length} ${item.name}: CID ${cid} (${p.Title}) match=${result.items[item.name].match} props=${Object.keys(props).length}`);
}
writeFileSync(output, JSON.stringify(result, null, 1) + "\n");
