"use server";

import { getUser } from "./auth";
import { databaseConfigured, db } from "./db";

/** A saved specification: the material, its pharmacopoeia and options, and its tests with acceptance criteria. */
export type SavedSpec = { id: string; name: string; material: string; updatedAt: string; data: unknown };
export type SpecResult = { ok: true; specs: SavedSpec[] } | { ok: false; error: "signin" | "full" | "invalid" | "unavailable" };

const MAX_SPECS = 200;
const MAX_BYTES = 60_000;

async function list(userId: number | string): Promise<SavedSpec[]> {
  const r = await (await db()).query<{ id: string; name: string; material: string; updated_at: Date; data: unknown }>(
    "select id, name, material, updated_at, data from coa_specs where user_id = $1 order by updated_at desc",
    [userId],
  );
  return r.rows.map((x) => ({ id: String(x.id), name: x.name, material: x.material, updatedAt: x.updated_at.toISOString(), data: x.data }));
}

export async function listCoaSpecs(): Promise<SpecResult> {
  if (!databaseConfigured()) return { ok: false, error: "unavailable" };
  const user = await getUser().catch(() => null);
  if (!user) return { ok: false, error: "signin" };
  try {
    return { ok: true, specs: await list(user.id) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** Saves (or replaces, by name) a specification in the signed-in user's library. */
export async function saveCoaSpec(name: string, material: string, data: unknown): Promise<SpecResult> {
  const n = String(name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const m = String(material ?? "").trim().slice(0, 200);
  const json = JSON.stringify(data ?? null);
  if (!n || !m || json.length > MAX_BYTES || typeof data !== "object" || data === null) return { ok: false, error: "invalid" };
  if (!databaseConfigured()) return { ok: false, error: "unavailable" };
  const user = await getUser().catch(() => null);
  if (!user) return { ok: false, error: "signin" };
  try {
    const pool = await db();
    const exists = await pool.query("select 1 from coa_specs where user_id = $1 and name = $2", [user.id, n]);
    if (!exists.rowCount) {
      const count = await pool.query<{ c: string }>("select count(*) as c from coa_specs where user_id = $1", [user.id]);
      if (Number(count.rows[0]?.c ?? 0) >= MAX_SPECS) return { ok: false, error: "full" };
    }
    await pool.query(
      `insert into coa_specs (user_id, name, material, data) values ($1, $2, $3, $4::jsonb)
       on conflict (user_id, name) do update set material = excluded.material, data = excluded.data, updated_at = now()`,
      [user.id, n, m, json],
    );
    return { ok: true, specs: await list(user.id) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function deleteCoaSpec(id: string): Promise<SpecResult> {
  if (!databaseConfigured()) return { ok: false, error: "unavailable" };
  const user = await getUser().catch(() => null);
  if (!user) return { ok: false, error: "signin" };
  if (!/^\d+$/.test(String(id))) return { ok: false, error: "invalid" };
  try {
    await (await db()).query("delete from coa_specs where id = $1 and user_id = $2", [id, user.id]);
    return { ok: true, specs: await list(user.id) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}
