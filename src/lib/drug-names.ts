/*
 * Names of medicines the site already knows (raw-material database and the
 * interaction checker), used by the Iran medicine search: the generic names
 * the nightly refresh asks the register for, and the other spellings of a
 * search word (English and Persian names, US and international names) so the
 * stored copy answers a search however the medicine was written. Server only.
 */

import { rawMaterials } from "@/data";
import { drugs } from "@/data/interactions";
import { INN, moieties } from "./moieties";

/** Lower case, Arabic ي/ك as Persian ی/ک, Persian digits as Latin, no ZWNJ (the same folding as the stored copy). */
export const foldName = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‌‎‏]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const single = (s: string) => {
  const f = foldName(s);
  return f && !f.includes(" ") ? f : "";
};

let built: { seeds: string[]; alts: Map<string, Set<string>> } | undefined;

function build() {
  if (built) return built;
  const seeds = new Set<string>();
  const alts = new Map<string, Set<string>>();
  const link = (group: string[]) => {
    const words = [...new Set(group.filter(Boolean))];
    if (words.length < 2) return;
    for (const w of words) {
      const set = alts.get(w) ?? new Set<string>();
      for (const o of words) if (o !== w) set.add(o);
      alts.set(w, set);
    }
  };
  const core = (name: string) => [...moieties(name)].map((m) => m.toLowerCase());

  for (const item of rawMaterials.items) {
    const bases = core(item.name);
    // The generic to ask the register for: the active moiety without its salt.
    if (bases.length === 1) seeds.add(bases[0]);
    const synonyms = (item.synonyms ?? "").split(/[,،]/).map((s) => single(s));
    link([...bases.filter(() => bases.length === 1), ...synonyms]);
  }
  for (const d of drugs) {
    const en = single(d.en);
    if (en) seeds.add(en);
    link([en, single(d.fa), ...(d.aliases ?? []).map(single)]);
  }
  for (const [us, intl] of Object.entries(INN)) link([us.toLowerCase(), intl.toLowerCase()]);
  built = { seeds: [...seeds].filter((s) => s.length >= 4).sort(), alts };
  return built;
}

/** Generic names the site knows, to ask the register for a few each night. */
export const seedTerms = (): string[] => build().seeds;

/** A search word and its other known spellings (English, Persian, US and international names). */
export function spellings(word: string): string[] {
  const w = foldName(word);
  return [w, ...(build().alts.get(w) ?? [])];
}

/** Levenshtein distance, stopping early once it exceeds `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, row[j]);
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/** Words of `vocabulary` within one typo of `word` (two for words of 8 letters or more). */
export function nearWords(word: string, vocabulary: Iterable<string>, limit = 5): string[] {
  const w = foldName(word);
  if (w.length < 4) return [];
  const max = w.length >= 8 ? 2 : 1;
  const found: [string, number][] = [];
  for (const v of vocabulary) {
    if (v === w || v.length < 3) continue;
    const d = distance(w, v, max);
    if (d <= max) found.push([v, d]);
  }
  return found.sort((a, b) => a[1] - b[1]).slice(0, limit).map(([v]) => v);
}
