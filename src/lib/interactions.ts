import { drugs, rules, severityOrder, type Drug, type Ref, type Rule, type Severity } from "@/data/interactions";

/*
 * The interaction engine: finds drugs from free text in Persian or English and
 * checks every pair against the class and drug rules.
 */

/** Lower-case, Persian/Arabic letters and digits unified, ZWNJ and punctuation removed. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ۀة]/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/[‌‏‎ً-ٟ]/g, "")
    .replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
    .replace(/[-–—()\/'’.,،]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Entry = { drug: Drug; key: string };

const index: Entry[] = drugs.flatMap((drug) =>
  [drug.id, drug.en, drug.fa, ...(drug.aliases ?? [])].map((name) => ({ drug, key: normalize(name) })),
);

export const drugById = (id: string): Drug | undefined => drugs.find((d) => d.id === id);

/** Best drug for a typed name: exact name first, then a name that starts with it, then one that contains it. */
export function findDrug(text: string): Drug | null {
  const q = normalize(text);
  if (q.length < 2) return null;
  const exact = index.find((e) => e.key === q);
  if (exact) return exact.drug;
  const starts = index.find((e) => e.key.startsWith(q) || q.startsWith(e.key + " "));
  if (starts) return starts.drug;
  const contains = q.length >= 4 ? index.find((e) => e.key.includes(q)) : undefined;
  return contains?.drug ?? null;
}

/** Up to `limit` suggestions for an autocomplete box. */
export function suggest(text: string, limit = 8): Drug[] {
  const q = normalize(text);
  if (!q) return [];
  const seen = new Set<string>();
  const ranked = [
    ...index.filter((e) => e.key.startsWith(q)),
    ...index.filter((e) => !e.key.startsWith(q) && e.key.includes(q)),
  ];
  const out: Drug[] = [];
  for (const e of ranked) {
    if (seen.has(e.drug.id)) continue;
    seen.add(e.drug.id);
    out.push(e.drug);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Splits a question such as «تداخل وارفارین با ایبوپروفن» or
 * "interaction between warfarin and ibuprofen" into drugs.
 */
export function parseQuery(text: string): { found: Drug[]; unknown: string[] } {
  const cleaned = text
    .replace(/^\s*(تداخل(های)?(\s+دارویی)?|بررسی\s+تداخل|drug\s+interactions?|interactions?)\s*(بین|میان|of|between)?\s*/i, "")
    .replace(/[؟?]/g, "");
  const parts = cleaned
    .split(/\s+(?:با|و|and|with|vs\.?|versus)\s+|\s*[+،,؛;&]\s*|\n/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const found: Drug[] = [];
  const unknown: string[] = [];
  for (const p of parts) {
    const drug = findDrug(p);
    if (drug) {
      if (!found.some((d) => d.id === drug.id)) found.push(drug);
    } else unknown.push(p);
  }
  return { found, unknown };
}

const matches = (ref: Ref, drug: Drug) =>
  ref.startsWith("d:") ? ref.slice(2) === drug.id : (drug.classes as string[]).includes(ref.slice(2));

const rank = (s: Severity) => severityOrder.indexOf(s);
const specificity = (rule: Rule) => (rule.a.startsWith("d:") ? 1 : 0) + (rule.b.startsWith("d:") ? 1 : 0);

export type PairResult = { a: Drug; b: Drug; rules: Rule[] };

/** All rules for one pair; per topic only the most severe (then most specific) rule is kept. */
export function checkPair(a: Drug, b: Drug): Rule[] {
  if (a.id === b.id) return [];
  const hits = rules.filter((r) => (matches(r.a, a) && matches(r.b, b)) || (matches(r.a, b) && matches(r.b, a)));
  const byTopic = new Map<string, Rule>();
  for (const r of hits) {
    const best = byTopic.get(r.topic);
    if (!best || rank(r.severity) < rank(best.severity) || (rank(r.severity) === rank(best.severity) && specificity(r) > specificity(best))) {
      byTopic.set(r.topic, r);
    }
  }
  return [...byTopic.values()].sort((x, y) => rank(x.severity) - rank(y.severity));
}

/** Every pair among the drugs, most severe first; pairs without an interaction are listed separately. */
export function checkAll(list: Drug[]): { pairs: PairResult[]; clear: [Drug, Drug][] } {
  const pairs: PairResult[] = [];
  const clear: [Drug, Drug][] = [];
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const found = checkPair(list[i], list[j]);
      if (found.length) pairs.push({ a: list[i], b: list[j], rules: found });
      else clear.push([list[i], list[j]]);
    }
  pairs.sort((x, y) => rank(x.rules[0].severity) - rank(y.rules[0].severity));
  return { pairs, clear };
}

export const worst = (pairs: PairResult[]): Severity | null => (pairs.length ? pairs[0].rules[0].severity : null);
