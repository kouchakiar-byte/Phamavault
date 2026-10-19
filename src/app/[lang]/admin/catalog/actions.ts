"use server";

import { refresh } from "next/cache";
import { siteConfig } from "@/content/site";
import type { RawMaterial } from "@/data";
import { getUser } from "@/lib/auth";
import { loadCatalog, materialKey, supplierKey } from "@/lib/catalog";
import { cancelChange, queueChange, runDailyUpdate } from "@/lib/daily-update";
import type { SupplierRecord } from "@/lib/supplier-search";

export type CatalogState = { ok?: boolean; error?: "invalid" };

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const url = (value: string) => (value && !/^https?:\/\//.test(value) ? `https://${value}` : value);

async function requireAdmin(): Promise<string> {
  const user = await getUser();
  if (!user?.isAdmin) throw new Error("Forbidden");
  return user.id;
}

export async function saveSupplier(_: CatalogState, form: FormData): Promise<CatalogState> {
  const userId = await requireAdmin();
  const n = text(form, "n");
  const products = text(form, "p")
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()).filter(Boolean).join("|"))
    .filter(Boolean);
  const categories = form.getAll("c").map(String);
  if (!n || !categories.length) return { error: "invalid" };

  // Editing keeps the ranking flags of the existing record.
  const existing = (await loadCatalog()).companies.find((c) => supplierKey(c) === n);
  const record: SupplierRecord = {
    ...(existing ?? {}),
    n,
    e: text(form, "e"),
    t: text(form, "t") === "t" ? "t" : "m",
    c: categories,
    prov: text(form, "prov"),
    city: text(form, "city"),
    tel: text(form, "tel")
      .split(/[,،\n]/)
      .map((x) => x.trim())
      .filter(Boolean),
    mail: text(form, "mail") || undefined,
    web: url(text(form, "web")) || undefined,
    note: text(form, "note") || undefined,
    src: url(text(form, "src")) || existing?.src || siteConfig.url,
    p: products,
  };
  delete record.webDown;
  await queueChange("supplier", n, record, userId);
  refresh();
  return { ok: true };
}

export async function saveMaterial(_: CatalogState, form: FormData): Promise<CatalogState> {
  const userId = await requireAdmin();
  const record: RawMaterial = {
    name: text(form, "name"),
    cas: text(form, "cas"),
    group: text(form, "group"),
    formula: text(form, "formula").replace(/\s+/g, "") || undefined,
    mw: text(form, "mw"),
    note: { en: text(form, "noteEn"), fa: text(form, "noteFa") },
    synonyms: text(form, "synonyms"),
    bcs: /^[1-4]$/.test(text(form, "bcs")) ? text(form, "bcs") : undefined,
  };
  if (!record.name || !record.group) return { error: "invalid" };
  await queueChange("material", materialKey(record), record, userId);
  refresh();
  return { ok: true };
}

export async function hideRecord(form: FormData): Promise<void> {
  const userId = await requireAdmin();
  const kind = text(form, "kind") === "material" ? "material" : "supplier";
  const key = text(form, "key");
  if (key) await queueChange(kind, key, null, userId);
  refresh();
}

export async function cancelQueued(form: FormData): Promise<void> {
  await requireAdmin();
  const id = text(form, "id");
  if (/^\d+$/.test(id)) await cancelChange(id);
  refresh();
}

export async function publishNow(): Promise<void> {
  await requireAdmin();
  await runDailyUpdate({ force: true });
  refresh();
}
