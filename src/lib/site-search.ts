import { calculations } from "@/content/calculations";
import { referenceSections } from "@/content/references";
import { searchCopy } from "@/content/search";
import { sections } from "@/content/sections";
import { excipients, formulation, handbooks, regulatory, sops, type RawMaterial } from "@/data";
import { monographs } from "@/data/monographs";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getUser } from "./auth";
import { getCatalog } from "./catalog";
import { handbookAnchor } from "./handbook-anchor";
import { excipientSlug } from "./excipient-slug";
import { searchOrangeBook } from "./orange-book";
import { href } from "./paths";
import { isPaidSection, type PaidSection } from "./pricing";
import { paywallEnabled, sectionsFor } from "./subscriptions";
import { has, norm, prepare, search as searchSuppliers, terms, type Supplier, type SupplierRecord } from "./supplier-search";

/*
 * The site-wide PharmaVault search. Every record of the vault becomes an
 * entry with normalised titles and keywords; a query is split into terms
 * (with the supplier bank's synonym groups, so B1 = thiamine = تیامین),
 * entries are scored by where the terms match, and results come back grouped
 * by kind. Exact codes (CAS, SOP code, ICH code) win outright; a query with
 * no match falls back to a one- or two-letter typo tolerance. Server only.
 */

export type GroupKey = keyof typeof searchCopy.groups;

type Entry = {
  group: GroupKey;
  section: PaidSection | null;
  title: Bi;
  sub: Bi;
  /** Path below the locale root. */
  path: string;
  /** Normalised titles, aliases included. */
  titles: string[];
  /** Normalised title as shown. */
  shown: string;
  /** Normalised keywords beyond the titles. */
  extra: string;
  /** Normalised codes that match only as a whole: CAS, SOP and ICH codes, abbreviations. */
  exact: string[];
};

export type SearchHit = { title: string; sub: string; href: string; locked: boolean };
export type SearchGroup = { key: GroupKey; label: string; total: number; more: string | null; items: SearchHit[] };
export type SearchResult = { query: string; total: number; fuzzy: boolean; groups: SearchGroup[] };

const same = (text: string): Bi => ({ en: text, fa: text });
const joinBi = (parts: Bi[], sep = " · "): Bi => ({
  en: parts.map((p) => p.en).filter(Boolean).join(sep),
  fa: parts.map((p) => p.fa).filter(Boolean).join(sep),
});
/** The supplier bank's normaliser, also splitting on dashes and symbols (USP–NF, USP <621>). */
const nrm = (s: string | undefined | null) =>
  norm(s ?? "")
    .replace(/[–—/<>+:;[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const keys = (...parts: (string | undefined | null)[]) => nrm(parts.filter(Boolean).join(" "));
const PERSIAN = /[\u0600-\u06FF]/;
/** Comma-separated synonyms; the first Persian one names the item in Persian. */
const splitSynonyms = (s: string) => s.split(/[,،;]/).map((x) => x.trim()).filter(Boolean);
const persianName = (synonyms: string) => splitSynonyms(synonyms).find((x) => PERSIAN.test(x));

/** `aliases` (synonyms, trade names) count as titles when matching but are not shown. */
function entry(e: Omit<Entry, "titles" | "shown" | "extra" | "exact"> & { extra?: string; exact?: string[]; aliases?: string[] }): Entry {
  const { aliases = [], ...rest } = e;
  return {
    ...rest,
    titles: [...new Set([e.title.en, e.title.fa, ...aliases].map(nrm).filter(Boolean))],
    shown: ` ${nrm(`${e.title.en} ${e.title.fa}`)} `,
    extra: e.extra ?? "",
    exact: (e.exact ?? []).map(nrm).filter(Boolean),
  };
}

/** Records that only change with a deploy: indexed once per server. */
let staticEntries: Entry[] | null = null;

function buildStatic(): Entry[] {
  const out: Entry[] = [];

  for (const s of sections) {
    out.push(
      entry({
        group: "sections",
        section: isPaidSection(s.slug) ? s.slug : null,
        title: s.title,
        sub: s.description,
        path: s.href,
        extra: keys(s.description.en, s.description.fa),
        exact: [s.plate],
      }),
    );
  }

  for (const x of excipients.items) {
    const mono = monographs[x.name];
    const fns = x.functions.map((f) => excipients.functions[f]).filter(Boolean);
    out.push(
      entry({
        group: "excipients",
        section: "excipients",
        title: { en: x.name, fa: [x.name, persianName(x.synonyms)].filter(Boolean).join(" — ") },
        aliases: splitSynonyms(x.synonyms),
        sub: joinBi([same(x.cas ? `CAS ${x.cas}` : ""), joinBi(fns, "، ")]),
        path: mono ? `excipients/${excipientSlug(x.name)}` : `excipients?q=${encodeURIComponent(x.name)}`,
        extra: keys(
          x.synonyms,
          x.cas,
          fns.map((f) => `${f.en} ${f.fa}`).join(" "),
          mono?.tradeNames,
          mono?.chemicalName,
          mono?.names.map((n) => n.name).join(" "),
        ),
        exact: [x.cas],
      }),
    );
  }

  const deps = sops.departments;
  for (const s of sops.items) {
    out.push(
      entry({
        group: "sops",
        section: "qa",
        title: joinBi([same(s.code), s.title], " — "),
        sub: joinBi([deps[s.dep] ?? same(""), s.covers]),
        path: s.text ? `qa/${s.code.toLowerCase()}` : `qa?q=${encodeURIComponent(s.code)}`,
        extra: keys(s.covers.en, s.covers.fa, s.title.en, s.title.fa, deps[s.dep]?.en, deps[s.dep]?.fa),
        exact: [s.code, s.code.replace("-", "")],
      }),
    );
  }

  for (const c of calculations) {
    out.push(
      entry({
        group: "calculators",
        section: "tools",
        title: c.label,
        sub: c.title,
        path: `tools?calc=${c.key}`,
        extra: keys(c.title.en, c.title.fa, "equation" in c ? String(c.equation) : ""),
      }),
    );
  }

  for (const g of regulatory.ich) {
    out.push(
      entry({
        group: "regulatory",
        section: "regulatory",
        title: joinBi([same(`ICH ${g.code}`), { en: g.en, fa: g.fa }], " — "),
        sub: same(""),
        path: `regulatory?q=${encodeURIComponent(g.code)}`,
        extra: keys(g.en, g.fa),
        exact: [g.code, `ICH ${g.code}`, g.code.replace(/\(.*\)/, "")],
      }),
    );
  }
  for (const m of regulatory.ctd) {
    out.push(
      entry({
        group: "regulatory",
        section: "regulatory",
        title: joinBi([same("CTD"), m.title], " — "),
        sub: m.items[0] ?? same(""),
        path: "regulatory",
        extra: keys("ctd", m.items.map((i) => `${i.en} ${i.fa}`).join(" ")),
      }),
    );
  }

  for (const h of handbooks) {
    for (const t of h.topics) {
      out.push(
        entry({
          group: "handbooks",
          section: "handbooks",
          title: t.title,
          sub: h.title,
          path: `handbooks#${handbookAnchor(h)}`,
          extra: keys(h.title.en, h.title.fa, t.summary.en, t.summary.fa),
        }),
      );
    }
  }

  for (const t of formulation.templates) {
    out.push(
      entry({
        group: "formulation",
        section: "formulation",
        title: t.name,
        sub: same(t.rows.map((r) => r.material).filter(Boolean).slice(0, 6).join("، ")),
        path: "formulation",
        extra: keys(t.rows.map((r) => `${r.material ?? ""} ${formulation.functions[r.fn]?.en ?? ""} ${formulation.functions[r.fn]?.fa ?? ""}`).join(" ")),
      }),
    );
  }

  for (const r of referenceSections) {
    out.push(
      entry({
        group: "references",
        section: "references",
        title: r.title,
        sub: same(r.chip),
        path: `references#${r.key}`,
        extra: keys(r.abbr, r.chip, r.text.en, r.text.fa),
        exact: [r.abbr, r.chip],
      }),
    );
  }
  return out;
}

const materialCache = new WeakMap<RawMaterial[], Entry[]>();

function materialEntries(items: RawMaterial[], groups: Record<string, Bi>): Entry[] {
  const cached = materialCache.get(items);
  if (cached) return cached;
  const out = items.map((m) =>
    entry({
      group: "materials",
      section: "materials",
      title: { en: m.name, fa: [m.name, persianName(m.synonyms)].filter(Boolean).join(" — ") },
      aliases: splitSynonyms(m.synonyms),
      sub: joinBi([same(m.cas ? `CAS ${m.cas}` : ""), groups[m.group] ?? same(""), m.note]),
      path: `materials?q=${encodeURIComponent(m.name)}`,
      extra: keys(m.synonyms, m.cas, m.formula, groups[m.group]?.en, groups[m.group]?.fa, m.note.en, m.note.fa),
      exact: [m.cas, m.formula ?? ""],
    }),
  );
  materialCache.set(items, out);
  return out;
}

const supplierCache = new WeakMap<SupplierRecord[], Supplier[]>();

function preparedSuppliers(companies: SupplierRecord[]): Supplier[] {
  let prepared = supplierCache.get(companies);
  if (!prepared) {
    prepared = prepare(companies);
    supplierCache.set(companies, prepared);
  }
  return prepared;
}

/** Score of an entry for the query terms; 0 means no match. */
function score(e: Entry, q: string, sets: string[][]): number {
  if (e.exact.includes(q)) return 1000;
  if (e.titles.includes(q)) return 900;
  const shortest = Math.min(...e.titles.map((t) => t.length));
  if (e.titles.some((t) => sets.every((s) => s.some((a) => has(t, a))))) {
    // A hit in the title as shown beats one in an alias; a title starting with the query beats one containing it.
    const inShown = e.shown.includes(` ${q} `) ? 150 : 0;
    const starts = e.titles.some((t) => t.startsWith(q)) ? 100 : e.titles.some((t) => has(t, q)) ? 50 : 0;
    return 500 + inShown + starts - Math.min(shortest, 100) / 2;
  }
  const all = `${e.titles.join(" ")} ${e.extra}`;
  if (sets.every((s) => s.some((a) => has(all, a)))) return 300 - Math.min(shortest, 100);
  return 0;
}

/** Damerau–Levenshtein distance, stopping early above `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      best = Math.min(best, d[i][j]);
    }
    if (best > max) return max + 1;
  }
  return d[a.length][b.length];
}

/** Typo-tolerant match: every query word of 4+ letters is within 1 (or 2 for long words) edits of a word of the entry. */
function fuzzyScore(e: Entry, words: string[]): number {
  const near = (pool: string[]) =>
    words.every((w) => {
      const max = w.length >= 8 ? 2 : 1;
      return pool.some((t) => distance(w, t, max) <= max);
    });
  if (near(e.titles.join(" ").split(" "))) return 200;
  return near(e.extra.split(" ")) ? 100 : 0;
}

/** Link to the whole result list of a group inside its own section, when the section has a search box. */
function moreLink(group: GroupKey, query: string): string | null {
  const q = encodeURIComponent(query);
  switch (group) {
    case "excipients":
      return `excipients?q=${q}`;
    case "materials":
      return `materials?q=${q}`;
    case "suppliers":
      return `suppliers?q=${q}`;
    case "sops":
      return `qa?q=${q}`;
    case "regulatory":
      return `regulatory?q=${q}`;
    case "orangeBook":
      return `references?ob=${q}#orange-book-search`;
    default:
      return null;
  }
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s;,(/-])([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase());

/**
 * Searches the whole vault. `locked` tells whether a section is closed to the
 * visitor, so hits in it can carry a lock.
 */
export async function siteSearch(
  raw: string,
  locale: Locale,
  perGroup: number,
  locked: (section: PaidSection | null) => boolean,
): Promise<SearchResult> {
  const query = raw.trim().slice(0, 80);
  const q = nrm(query);
  const empty: SearchResult = { query, total: 0, fuzzy: false, groups: [] };
  if (q.replace(/\s/g, "").length < 2) return empty;

  const catalog = await getCatalog();
  const synonyms = catalog.synonyms.map((g) => g.map(nrm));
  let sets = terms(q, synonyms);
  if (!sets.length) sets = [[q]];

  staticEntries ??= buildStatic();
  const entries = [...staticEntries, ...materialEntries(catalog.materials, catalog.materialGroups)];

  let scored = entries.map((e) => ({ e, s: score(e, q, sets) })).filter((x) => x.s > 0);

  // Supplier bank: its own ranked search, so synonyms and credibility tiers apply as on the bank page.
  const suppliers = searchSuppliers(
    preparedSuppliers(catalog.companies),
    { query, type: "all", cat: "all", sort: "cred", telOnly: false },
    synonyms,
    catalog.provinceOrder,
  );
  const supplierHits = suppliers.map((r, i) => ({
    e: entry({
      group: "suppliers",
      section: "suppliers",
      title: { en: r.s.e || r.s.n, fa: r.s.n },
      sub: r.hits.length
        ? joinBi([
            {
              en: searchCopy.suppliersMatch.en.replace("{n}", String(r.hits.length)),
              fa: searchCopy.suppliersMatch.fa.replace("{n}", r.hits.length.toLocaleString("fa-IR")),
            },
            { en: r.hits.slice(0, 3).map((h) => h.en || h.fa).join(", "), fa: r.hits.slice(0, 3).map((h) => h.fa).join("، ") },
          ])
        : same(r.s.city || r.s.prov),
      path: `suppliers?q=${encodeURIComponent(query)}`,
    }),
    s: 390 - i / 10,
  }));

  // Orange Book: English drug and brand names only.
  const obHits: { e: Entry; s: number }[] = [];
  if (/[a-z]{4}/.test(q)) {
    const ob = searchOrangeBook(query, false);
    ob.groups.forEach((g, i) => {
      const trades = [...new Set(g.products.map((p) => p.trade))].slice(0, 4).join(", ");
      const n = g.products.length + g.more;
      obHits.push({
        e: entry({
          group: "orangeBook",
          section: "references",
          title: same(titleCase(g.ingredient)),
          sub: joinBi([
            {
              en: searchCopy.orangeBookProducts.en.replace("{n}", String(n)),
              fa: searchCopy.orangeBookProducts.fa.replace("{n}", n.toLocaleString("fa-IR")),
            },
            same(trades),
          ]),
          path: `references?ob=${encodeURIComponent(g.ingredient)}#orange-book-search`,
        }),
        s: 380 - i / 10,
      });
    });
  }

  scored = [...scored, ...supplierHits, ...obHits];
  let fuzzy = false;
  if (!scored.length) {
    const words = q.split(" ").filter((w) => w.length >= 4);
    if (words.length) {
      scored = entries.map((e) => ({ e, s: fuzzyScore(e, words) })).filter((x) => x.s > 0);
      fuzzy = scored.length > 0;
    }
  }

  const byGroup = new Map<GroupKey, { e: Entry; s: number }[]>();
  for (const x of scored) byGroup.set(x.e.group, [...(byGroup.get(x.e.group) ?? []), x]);
  const groups = [...byGroup.entries()]
    .map(([key, list]) => {
      list.sort((a, b) => b.s - a.s);
      return { key, best: list[0].s, list };
    })
    .sort((a, b) => b.best - a.best)
    .map(({ key, list }) => {
      const more = moreLink(key, query);
      return {
        key,
        label: searchCopy.groups[key][locale],
        total: list.length,
        more: more ? href(locale, more) : null,
        items: list.slice(0, perGroup).map(({ e }) => ({
          title: e.title[locale] || e.title.en,
          sub: e.sub[locale] || e.sub.en,
          href: href(locale, e.path),
          locked: locked(e.section),
        })),
      };
    });

  return { query, total: scored.length, fuzzy, groups };
}

/** Which sections are closed to the visitor of this request (none while the paywall is off). */
export async function lockedSections(): Promise<(section: PaidSection | null) => boolean> {
  if (!paywallEnabled()) return () => false;
  const user = await getUser().catch(() => null);
  if (user?.isAdmin) return () => false;
  const open = user ? await sectionsFor(user.mobile).catch(() => new Set<PaidSection>()) : new Set<PaidSection>();
  return (section) => section !== null && !open.has(section);
}
