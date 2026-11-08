import { databaseConfigured, db } from "./db";
import { GUEST_ID } from "./guest-cookie";

/*
 * Browsers of blocked accounts. Every browser carries the random pv_gid cookie (set by the proxy);
 * when a blocked account signs in, tries to, or still holds a session, that browser's id is kept
 * here and the proxy refuses it every page and API, signed in or not. The list is small and read
 * from the database at most every 10 seconds.
 */

let cache: { at: number; ids: Set<string> } | undefined;
let loading: Promise<Set<string>> | undefined;

async function load(): Promise<Set<string>> {
  const { rows } = await (await db()).query<{ gid: string }>("select gid from blocked_devices");
  return new Set(rows.map((r) => r.gid));
}

/** True when this browser belongs to a blocked account. */
export async function isBlockedDevice(gid: string | undefined): Promise<boolean> {
  if (!gid || !databaseConfigured()) return false;
  if (!cache || Date.now() - cache.at > 10_000) {
    loading ??= load()
      .then((ids) => (cache = { at: Date.now(), ids }).ids)
      .catch(() => cache?.ids ?? new Set<string>())
      .finally(() => (loading = undefined));
    await loading;
  }
  return cache?.ids.has(gid) ?? false;
}

/** Remembers a browser of a blocked account. */
export async function markBlockedDevice(gid: string | undefined, userId: string): Promise<void> {
  if (!gid || !GUEST_ID.test(gid) || !databaseConfigured()) return;
  await (await db())
    .query("insert into blocked_devices (gid, user_id) values ($1, $2) on conflict (gid) do nothing", [gid, userId])
    .catch((error) => console.error("blocked device write failed", error));
  cache?.ids.add(gid);
}
