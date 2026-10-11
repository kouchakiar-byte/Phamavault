import { rawMaterials, type RawMaterial } from "@/data";
import suppliersJson from "@/data/suppliers.json";
import { databaseConfigured, db } from "./db";
import type { SupplierRecord } from "./supplier-search";

/*
 * The supplier bank and the raw-material database: the JSON files in
 * src/data are the base, and edits made in the admin page are layered on top
 * from the database. Edits wait in a queue and are published by the daily
 * update at 18:00 Tehran time (src/lib/daily-update.ts), which also checks
 * every supplier website and stamps the "last updated" time.
 */

export type CatalogKind = "supplier" | "material";

export type Catalog = {
  companies: SupplierRecord[];
  synonyms: string[][];
  provinceOrder: string[];
  materials: RawMaterial[];
  materialGroups: typeof rawMaterials.groups;
  /** ISO time of the last daily update (18:00 Tehran), or null before the first one. */
  updatedAt: string | null;
};

/** A failing website is flagged only after this many daily checks in a row. */
export const DEAD_LINK_FAILS = 3;

export const supplierKey = (s: Pick<SupplierRecord, "n">) => s.n.trim();
export const materialKey = (m: Pick<RawMaterial, "name">) => m.name.trim();

/** 18:00 of a Tehran calendar day (yyyy-mm-dd), as an ISO time. Iran has no daylight saving. */
export const updateTimeOf = (day: string) => new Date(`${day}T18:00:00+03:30`).toISOString();

type Overrides = {
  entries: { kind: CatalogKind; key: string; data: unknown; hidden: boolean }[];
  deadLinks: Set<string>;
  lastDay: string | null;
};

async function overrides(): Promise<Overrides> {
  const empty: Overrides = { entries: [], deadLinks: new Set(), lastDay: null };
  if (!databaseConfigured()) return empty;
  try {
    const pool = await db();
    const [entries, links, runs] = await Promise.all([
      pool.query<Overrides["entries"][number]>("select kind, key, data, hidden from catalog_entries"),
      pool.query<{ url: string }>("select url from supplier_links where fails >= $1", [DEAD_LINK_FAILS]),
      pool.query<{ day: string }>("select day from catalog_runs where finished_at is not null order by day desc limit 1"),
    ]);
    return { entries: entries.rows, deadLinks: new Set(links.rows.map((r) => r.url)), lastDay: runs.rows[0]?.day ?? null };
  } catch (error) {
    // The base data still serves the site if the database is unreachable.
    console.error("catalog overrides unavailable", error);
    return empty;
  }
}

function applyOverrides<T>(base: T[], key: (item: T) => string, entries: Overrides["entries"], kind: CatalogKind): T[] {
  const items = new Map(base.map((item) => [key(item), item]));
  for (const entry of entries) {
    if (entry.kind !== kind) continue;
    if (entry.hidden) items.delete(entry.key);
    else items.set(entry.key, entry.data as T);
  }
  return [...items.values()];
}

const CACHE_MS = 10 * 60_000;
const g = globalThis as unknown as { pvCatalog?: { at: number; data: Promise<Catalog> } };

/**
 * The live catalog, kept in memory for a few minutes and dropped as soon as
 * the daily update publishes. (A plain in-process cache rather than
 * "use cache": the Liara build does not apply next.config.ts.)
 */
export function getCatalog(): Promise<Catalog> {
  const now = performance.now(); // a timer, not a date shown anywhere
  if (!g.pvCatalog || now - g.pvCatalog.at > CACHE_MS) {
    const data = loadCatalog();
    g.pvCatalog = { at: now, data };
    data.catch(() => (g.pvCatalog = undefined));
  }
  return g.pvCatalog.data;
}

/** Makes the next request read the catalog afresh. */
export function invalidateCatalog(): void {
  g.pvCatalog = undefined;
}

/** The catalog straight from the base data and the database, uncached. */
export async function loadCatalog(): Promise<Catalog> {
  const o = await overrides();
  const companies = applyOverrides(suppliersJson.companies as SupplierRecord[], supplierKey, o.entries, "supplier").map((c) =>
    c.web && o.deadLinks.has(c.web) ? { ...c, webDown: true } : c,
  );
  return {
    companies,
    synonyms: suppliersJson.synonyms,
    provinceOrder: suppliersJson.provinceOrder,
    materials: applyOverrides(rawMaterials.items, materialKey, o.entries, "material"),
    materialGroups: rawMaterials.groups,
    updatedAt: o.lastDay ? updateTimeOf(o.lastDay) : null,
  };
}
