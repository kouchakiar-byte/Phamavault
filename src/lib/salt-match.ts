/*
 * Links from the API database to the salt table: each raw material whose name
 * is a salt form in the table, with the water of crystallisation of the form
 * the database lists (from its molecular weight) and the salt factor of that
 * form. Server only: the salt table stays out of the page bundle.
 */

import saltForms from "@/data/salt-forms.json";

export type SaltLink = { en: string; w: number; sf: number };

const WATER = 2 * 1.008 + 15.999;
const INN: [RegExp, string][] = [
  [/besilate/g, "besylate"],
  [/mesilate/g, "mesylate"],
  [/tosilate/g, "tosylate"],
  [/esilate/g, "esylate"],
  [/sulphate/g, "sulfate"],
];
const key = (s: string) => INN.reduce((k, [a, b]) => k.replace(a, b), s.toLowerCase()).replace(/\s+/g, " ").trim();

type Row = { en: string; n: number; w: number; ms: number; mb: number };

/** Raw material name → its salt link, for the names found in the table. */
export function saltLinks(materials: { name: string; mw: string }[]): Record<string, SaltLink> {
  const table = new Map((saltForms.rows as Row[]).map((r) => [key(r.en), r]));
  const out: Record<string, SaltLink> = {};
  for (const m of materials) {
    const r = table.get(key(m.name));
    if (!r) continue;
    const anhydrous = r.ms - r.w * WATER;
    // Water per formula unit of the listed form, kept only when it comes out a whole or half number.
    const listed = parseFloat(m.mw);
    const extra = listed > 0 ? (listed - anhydrous) / WATER : r.w;
    const half = Math.round(extra * 2) / 2;
    const w = half >= 0 && Math.abs(extra - half) < 0.02 ? half : r.w;
    out[m.name] = { en: r.en, w, sf: (anhydrous + w * WATER) / (r.n * r.mb) };
  }
  return out;
}
