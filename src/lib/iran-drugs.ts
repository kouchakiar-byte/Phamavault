/*
 * Live search of the Iran FDA product register (irc.fda.gov.ir/nfi). The
 * register is reachable from servers inside Iran only, so the site's own
 * server asks it one query at a time — no bulk copy — keeps each answer for a
 * day, and caps how often it asks, so the public register is never loaded.
 * Every product the register returns is also kept in the database, so when the
 * register does not answer, any name found in that stored copy — the exact
 * search, a brand, a company or part of a title, written in English or
 * Persian, under its US or international name, or with a small typo — is
 * shown, with its date. Each night, besides renewing the most asked searches,
 * the site asks for a few generic names it knows and has not stored yet, so
 * the stored copy grows steadily without ever copying the register in bulk.
 * Server only.
 */

import { databaseConfigured, db } from "./db";
import { nearWords, seedTerms, spellings } from "./drug-names";
import { ircGet } from "./irc-http";

export const IRC_ORIGIN = "https://irc.fda.gov.ir";
export const ircSearchUrl = (term: string, page = 1, size = 10) =>
  `${IRC_ORIGIN}/nfi/Search?Term=${encodeURIComponent(term)}&PageNumber=${page}&PageSize=${size}`;

export type IranDrug = {
  titleFa: string;
  titleEn: string;
  brandOwner: string;
  licenseHolder: string;
  /** Price per pack in Rial as the register shows it, or null. */
  priceRial: number | null;
  pack: string;
  productCode: string;
  genericCode: string;
  /** The product's own brand name ("" for a product sold under its generic name). */
  brandFa: string;
  brandEn: string;
};

/** Products of one generic (same generic code: ingredient, form and strength) — the alternatives to each other. */
export type IranGeneric = {
  genericCode: string;
  /** The generic name with form and strength, e.g. "محلول تزریقی سماگلوتاید 2 mg/1.5 mL". */
  titleFa: string;
  titleEn: string;
  products: IranDrug[];
};

export type IranDrugResult = {
  term: string;
  /** "ok", "empty" (no products), "unreadable" (page fetched but not understood) or "unavailable" (register not reachable). */
  status: "ok" | "empty" | "unreadable" | "unavailable";
  generics: IranGeneric[];
  total: number;
  fetchedAt: string;
  source: string;
  /** True when the register did not answer and this is the last stored copy. */
  stored?: boolean;
};

/** Lower case, Arabic ي/ك as Persian ی/ک, Persian digits as Latin, no ZWNJ: how stored products are matched. */
const fold = (s: string) =>
  latinDigits(s)
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const searchText = (d: IranDrug) => fold([d.titleFa, d.titleEn, d.brandFa, d.brandEn, d.brandOwner, d.licenseHolder, d.productCode, d.genericCode].join(" | "));

/** The last good answer to this exact search, or null. */
async function storedResult(key: string): Promise<IranDrugResult | null> {
  if (!databaseConfigured()) return null;
  try {
    const { rows } = await (await db()).query<{ result: IranDrugResult }>("select result from iran_drug_cache where term = $1", [key]);
    return rows[0] ? { ...rows[0].result, stored: true } : null;
  } catch {
    return null;
  }
}

/** Stored products whose search text contains, for every group, at least one of its spellings. */
async function matchStored(groups: string[][]): Promise<{ data: IranDrug; seen_at: Date }[]> {
  const params: string[] = [];
  const where = groups
    .map((alts) => `(${alts.map((a) => `strpos(search, $${params.push(a)}) > 0`).join(" or ")})`)
    .join(" and ");
  const { rows } = await (await db()).query<{ data: IranDrug; seen_at: Date }>(
    `select data, seen_at from iran_drug_products where ${where} order by seen_at desc limit 500`,
    params,
  );
  return rows;
}

/** Every word in the stored copy, renewed every 6 hours: what a mistyped search word is checked against. */
let vocabulary: { at: number; words: Promise<string[]> } | undefined;
const storedWords = () => {
  if (!vocabulary || Date.now() - vocabulary.at > 6 * 3600_000) {
    vocabulary = {
      at: Date.now(),
      words: db()
        .then((pool) =>
          pool.query<{ w: string }>(
            String.raw`select distinct w from iran_drug_products, regexp_split_to_table(search, '[\s|()/,+\-]+') w where length(w) >= 3`,
          ),
        )
        .then((r) => r.rows.map((row) => row.w))
        .catch(() => []),
    };
  }
  return vocabulary.words;
};

/**
 * Stored products that match every word of the search, in any of its known
 * spellings (English or Persian name, US or international name); failing that,
 * with each word also matched to stored words one typo away.
 */
async function storedProducts(base: IranDrugResult): Promise<IranDrugResult | null> {
  if (!databaseConfigured()) return null;
  const terms = fold(base.term).split(" ").filter((w) => w.length >= 2).slice(0, 5);
  if (!terms.length) return null;
  try {
    let rows = await matchStored(terms.map(spellings));
    if (!rows.length) {
      const words = await storedWords();
      const groups = terms.map((w) => [...new Set([...spellings(w), ...spellings(w).flatMap((s) => nearWords(s, words))])]);
      if (groups.some((g, i) => g.length > spellings(terms[i]).length)) rows = await matchStored(groups);
    }
    if (!rows.length) return null;
    const generics = groupByGeneric(rows.map((r) => r.data));
    const newest = rows.reduce((t, r) => Math.max(t, new Date(r.seen_at).getTime()), 0);
    return { ...base, status: "ok", generics, total: rows.length, fetchedAt: new Date(newest).toISOString(), stored: true };
  } catch {
    return null;
  }
}

/** Stores an answer; `asked` is 0 for the nightly generic names, so they do not count as readers' searches. */
async function storeResult(key: string, result: IranDrugResult, asked = 1): Promise<void> {
  if (!databaseConfigured()) return;
  const pool = await db();
  await pool
    .query(
      `insert into iran_drug_cache (term, result, fetched_at, asked) values ($1, $2, now(), $3)
       on conflict (term) do update set result = excluded.result, fetched_at = now(), asked = iran_drug_cache.asked + $3`,
      [key, JSON.stringify(result), asked],
    )
    .catch((error) => console.error("iran drug cache write failed", error));
  await storeProducts(result);
}

/** Keeps every product of an answer, renewing those already kept. */
async function storeProducts(result: IranDrugResult): Promise<void> {
  const products = result.generics.flatMap((g) => g.products).filter((d) => d.productCode);
  if (!products.length) return;
  await (await db())
    .query(
      `insert into iran_drug_products (product_code, search, data, seen_at)
       select p->>'productCode', p->>'search', p->'data', now() from jsonb_array_elements($1::jsonb) p
       on conflict (product_code) do update set search = excluded.search, data = excluded.data, seen_at = now()`,
      [JSON.stringify(products.map((d) => ({ productCode: d.productCode, search: searchText(d), data: d })))],
    )
    .catch((error) => console.error("iran drug products write failed", error));
}

/** Once per server start: products of answers stored before the product copy existed. */
let backfilled: Promise<void> | undefined;
const backfill = () =>
  (backfilled ??= (async () => {
    if (!databaseConfigured()) return;
    const { rows } = await (await db()).query<{ result: IranDrugResult }>(
      `select result from iran_drug_cache
       where not exists (select 1 from iran_drug_products limit 1)`,
    );
    for (const r of rows) await storeProducts(r.result);
  })().catch((error) => console.error("iran drug products backfill failed", error)));

/** When the register fails, it is not asked again for 3 minutes: searches meanwhile answer at once from the stored copy. */
let registerDownUntil = 0;

/** The register did not answer: today's answer, else the stored answer to this search, else stored products that match, else "unavailable". */
async function fallback(key: string, hit: IranDrugResult | undefined, base: IranDrugResult): Promise<IranDrugResult> {
  if (hit) return { ...hit, stored: true };
  await backfill();
  return (await storedResult(key)) ?? (await storedProducts(base)) ?? base;
}

const PAGE_SIZE = 100;
const cache = new Map<string, { at: number; result: IranDrugResult }>();
/** How often each term was asked for: the daily refresh renews the most asked first. */
const asked = new Map<string, number>();

/** The last 18:00 Tehran time (UTC+3:30) at or before `now`: answers older than that are renewed. */
export function lastDailyUpdate(now = Date.now()): number {
  const tehranOffset = 3.5 * 3600_000;
  const local = new Date(now + tehranOffset);
  let at = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 18) - tehranOffset;
  if (at > now) at -= 24 * 3600_000;
  return at;
}

// At most 20 requests to the register per minute from the whole site.
const window: number[] = [];
const allowRequest = () => {
  const now = Date.now();
  while (window.length && now - window[0] > 60_000) window.shift();
  if (window.length >= 20) return false;
  window.push(now);
  return true;
};

const latinDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)));

/** The page as lines of visible text, in reading order. */
export function textLines(html: string): string[] {
  return decode(
    html
      .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr|td|th|span|a|b|strong|label|button|section|article)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .split("\n")
    .map((l) => l.replace(/[‌‎‏]/g, " ").replace(/\s+/g, " ").trim())
    .filter((l) => l && l !== ":");
}

const LABELS = {
  brandOwner: /^صاحب\s*برند/,
  licenseHolder: /^صاحب\s*پروانه/,
  price: /^قیمت\s*هر\s*بسته/,
  pack: /^بسته\s*بندی/,
  productCode: /^کد\s*فرآورده/,
  genericCode: /^کد\s*ژنریک/,
} as const;
type Field = keyof typeof LABELS;
const fieldOf = (line: string) => (Object.keys(LABELS) as Field[]).find((k) => LABELS[k].test(line));
const NOISE = /^(نتیجه جستجو|عنوان دارو|جستجو|صفحه|بعدی|قبلی|«|»|\d+)$/;

/** Reads the product cards of a register search page. */
export function parseIrc(html: string): IranDrug[] {
  const lines = textLines(html);
  const out: IranDrug[] = [];
  let card: Partial<Record<Field, string>> & { title: string[] } = { title: [] };
  let pending: string[] = [];

  const valueAt = (i: number, field: Field): [string, number] => {
    const rest = lines[i].replace(LABELS[field], "").replace(/^\s*:\s*/, "").trim();
    if (rest) return [rest, i];
    const next = (lines[i + 1] ?? "").replace(/^\s*:\s*/, "").trim();
    return [next, i + 1];
  };

  for (let i = 0; i < lines.length; i++) {
    const field = fieldOf(lines[i]);
    if (!field) {
      if (!NOISE.test(lines[i])) pending.push(lines[i]);
      continue;
    }
    if (field === "brandOwner") {
      // A new card: what came before its first field is its title.
      card = { title: pending.slice(-4) };
      pending = [];
    }
    const [value, end] = valueAt(i, field);
    card[field] = value;
    i = end;
    if (field === "genericCode") {
      // The card's own title: the last Persian line and the last Latin line before its fields.
      const fa = card.title.filter((t) => /[؀-ۿ]/.test(t)).at(-1) ?? "";
      const en = card.title.filter((t) => !/[؀-ۿ]/.test(t) && /[A-Za-z]/.test(t)).at(-1) ?? "";
      const price = latinDigits(card.price ?? "").replace(/[^\d]/g, "");
      // "(SALT FORM … )BASE FORM …" as the register prints it → "BASE FORM … (SALT FORM …)"
      const titleEn = en.replace(/^\((.+?)\s*\)\s*(.+)$/, "$2 ($1)");
      out.push({
        titleFa: fa,
        titleEn,
        brandFa: brandFa(fa),
        brandEn: brandEn(titleEn),
        brandOwner: card.brandOwner ?? "",
        licenseHolder: card.licenseHolder ?? "",
        priceRial: price ? Number(price) : null,
        pack: card.pack ?? "",
        productCode: latinDigits(card.productCode ?? "").replace(/\s/g, ""),
        genericCode: latinDigits(card.genericCode ?? "").replace(/\s/g, ""),
      });
      card = { title: [] };
      pending = [];
    }
  }
  return out;
}

/** "OUTER (INNER)" → [outer, inner]; the register writes the product title, then the generic in brackets. */
const splitTitle = (t: string): [string, string] => {
  const m = /^(.*?)\s*\((.*)\)\s*$/.exec(t.trim());
  return m ? [m[1].trim(), m[2].trim()] : [t.trim(), ""];
};
const words = (t: string) => t.split(/\s+/).filter(Boolean);
const titleCase = (t: string) => t.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, p: string, c: string) => p + c.toUpperCase());

/** Brand part of an English title: what precedes the form and strength it shares with the generic. */
export function brandEn(title: string): string {
  const [outer, inner] = splitTitle(title);
  if (!inner) return "";
  const o = words(outer);
  const i = words(inner);
  let k = 0;
  while (k < o.length && k < i.length && o[o.length - 1 - k].toLowerCase() === i[i.length - 1 - k].toLowerCase()) k++;
  const prefix = o.slice(0, o.length - k);
  const innerSet = new Set(i.map((w) => w.toLowerCase()));
  if (!prefix.length || prefix.every((w) => innerSet.has(w.toLowerCase()))) return "";
  return titleCase(prefix.join(" "));
}

/** Brand part of a Persian title: what precedes the dosage-form word that opens the generic in brackets. */
export function brandFa(title: string): string {
  const [outer, inner] = splitTitle(title);
  if (!inner) return "";
  const o = words(outer);
  const i = words(inner);
  const at = o.indexOf(i[0]);
  if (at <= 0) return "";
  const prefix = o.slice(0, at);
  return prefix.every((w) => i.includes(w)) ? "" : prefix.join(" ");
}

/** The generic of a product title: the bracketed name, with the strength taken from the product title. */
function genericTitle(title: string): string {
  const [outer, inner] = splitTitle(title);
  if (!inner) return outer;
  if (/\d/.test(inner)) return inner;
  const o = words(outer);
  const first = o.findIndex((w) => /\d/.test(w));
  return first < 0 ? inner : `${inner} ${o.slice(first).join(" ")}`;
}

export function groupByGeneric(drugs: IranDrug[]): IranGeneric[] {
  const groups = new Map<string, IranGeneric>();
  const seen = new Set<string>();
  for (const d of drugs) {
    // Pages can overlap (or repeat when the register ignores the page number): one row per product.
    const id = d.productCode || `${d.brandOwner}|${d.titleEn}|${d.pack}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const key = d.genericCode || d.titleEn || d.titleFa;
    const g = groups.get(key) ?? { genericCode: d.genericCode, titleFa: genericTitle(d.titleFa), titleEn: genericTitle(d.titleEn), products: [] };
    g.products.push(d);
    groups.set(key, g);
  }
  for (const g of groups.values()) g.products.sort((a, b) => (a.priceRial ?? Infinity) - (b.priceRial ?? Infinity));
  return [...groups.values()];
}

/** Fetches one register search page; throws when the register cannot be reached. */
export async function fetchIrcPage(term: string, page = 1): Promise<string> {
  const res = await ircGet(ircSearchUrl(term, page, PAGE_SIZE));
  if (res.status < 200 || res.status >= 300) throw new Error(`IRC ${res.status}`);
  return res.body;
}

export async function searchIranDrugs(raw: string, { count = true }: { count?: boolean } = {}): Promise<IranDrugResult> {
  const term = raw.trim().replace(/\s+/g, " ").slice(0, 60);
  const key = term.toLowerCase();
  const base = { term, generics: [], total: 0, fetchedAt: new Date().toISOString(), source: ircSearchUrl(term) };
  if (term.length < 3) return { ...base, status: "empty" };

  if (count) asked.set(key, (asked.get(key) ?? 0) + 1);
  const hit = cache.get(key);
  // Answers are renewed daily at 18:00 Tehran time, together with the rest of the catalog.
  if (hit && hit.at >= lastDailyUpdate()) return hit.result;
  if (Date.now() < registerDownUntil || !allowRequest()) return fallback(key, hit?.result, { ...base, status: "unavailable" });

  let html: string;
  try {
    html = await fetchIrcPage(term);
  } catch {
    registerDownUntil = Date.now() + 3 * 60_000;
    return fallback(key, hit?.result, { ...base, status: "unavailable" });
  }
  const drugs = parseIrc(html);
  // A full page means there may be more: read up to 4 further pages while the rate allows.
  for (let page = 2; drugs.length === (page - 1) * PAGE_SIZE && page <= 5 && allowRequest(); page++) {
    try {
      drugs.push(...parseIrc(await fetchIrcPage(term, page)));
    } catch {
      break;
    }
  }
  const looksLikeResults = /صاحب\s*برند|کد\s*ژنریک/.test(textLines(html).join(" "));
  const result: IranDrugResult = {
    ...base,
    status: drugs.length ? "ok" : looksLikeResults ? "unreadable" : "empty",
    generics: groupByGeneric(drugs),
    total: 0,
  };
  result.total = result.generics.reduce((n, g) => n + g.products.length, 0);
  if (result.status !== "unreadable") {
    if (cache.size > 1000) cache.delete(cache.keys().next().value!);
    cache.set(key, { at: Date.now(), result });
    if (result.status === "ok") await storeResult(key, result, count ? 1 : 0);
  } else {
    return fallback(key, hit?.result, result);
  }
  return result;
}

/** How many nightly generic names are left: [asked so far, all the site knows]. */
async function seedProgress(): Promise<[number, number]> {
  const all = seedTerms();
  if (!databaseConfigured()) return [0, all.length];
  const { rows } = await (await db()).query<{ n: number }>("select count(*)::int as n from iran_drug_seeded where term = any($1)", [all]);
  return [rows[0]?.n ?? 0, all.length];
}

/** Generic names the site knows that were never asked for, in order, up to `limit`. */
async function unseeded(limit: number): Promise<string[]> {
  const all = seedTerms();
  const { rows } = await (await db()).query<{ term: string }>(
    `select t as term from unnest($1::text[]) with ordinality u(t, i)
     where not exists (select 1 from iran_drug_seeded s where s.term = u.t)
       and not exists (select 1 from iran_drug_cache c where c.term = u.t)
     order by i limit $2`,
    [all, limit],
  );
  return rows.map((r) => r.term);
}

/**
 * The daily 18:00 refresh: renews the answers of the most asked terms (up to
 * 60) and with them the stored products, then asks for up to 40 generic names
 * the site knows and has not stored yet. One request every 4 seconds, so the
 * register is never loaded; it stops as soon as the register stops answering.
 */
export async function refreshIranDrugs(limit = 60, seeds = 40): Promise<number> {
  const terms = [...asked.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t]) => t);
  if (terms.length < limit && databaseConfigured()) {
    const { rows } = await (await db())
      .query<{ term: string }>("select term from iran_drug_cache where asked > 0 order by asked desc limit $1", [limit])
      .catch(() => ({ rows: [] as { term: string }[] }));
    for (const r of rows) if (terms.length < limit && !terms.includes(r.term)) terms.push(r.term);
  }
  let renewed = 0;
  for (const term of terms) {
    const hit = cache.get(term);
    if (hit && hit.at >= lastDailyUpdate()) continue;
    await new Promise((r) => setTimeout(r, 4_000));
    const result = await searchIranDrugs(term, { count: false });
    // The register stopped answering: the stored copy stays as it is until the next day.
    if (result.stored || result.status === "unavailable") return renewed;
    if (result.status === "ok" || result.status === "empty") renewed++;
  }
  if (!databaseConfigured() || seeds <= 0) return renewed;
  for (const term of await unseeded(seeds).catch(() => [])) {
    await new Promise((r) => setTimeout(r, 4_000));
    const result = await searchIranDrugs(term, { count: false });
    if (result.stored || result.status === "unavailable") break;
    if (result.status === "unreadable") continue;
    await (await db())
      .query("insert into iran_drug_seeded (term, found) values ($1, $2) on conflict (term) do update set found = excluded.found, at = now()", [term, result.total])
      .catch((error) => console.error("iran drug seed write failed", error));
    renewed++;
  }
  return renewed;
}

export type IranDrugStats = {
  products: number;
  generics: number;
  searches: number;
  /** Products first stored in the last 7 days. */
  addedWeek: number;
  newest: Date | null;
  seeded: number;
  seedTotal: number;
};

/** Size of the stored copy, for the admin page. */
export async function iranDrugStats(): Promise<IranDrugStats | null> {
  if (!databaseConfigured()) return null;
  const pool = await db();
  const [{ rows }, cacheRows, [seeded, seedTotal]] = await Promise.all([
    pool.query<{ products: number; generics: number; added: number; newest: Date | null }>(
      `select count(*)::int as products,
              count(distinct nullif(data->>'genericCode', ''))::int as generics,
              count(*) filter (where first_seen > now() - interval '7 days')::int as added,
              max(seen_at) as newest
       from iran_drug_products`,
    ),
    pool.query<{ n: number }>("select count(*)::int as n from iran_drug_cache where asked > 0"),
    seedProgress(),
  ]);
  const r = rows[0];
  return { products: r.products, generics: r.generics, searches: cacheRows.rows[0].n, addedWeek: r.added, newest: r.newest, seeded, seedTotal };
}
