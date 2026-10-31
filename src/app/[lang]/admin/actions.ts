"use server";

import { refresh } from "next/cache";
import { account } from "@/content/account";
import { getUser, hashPassword, normalizeMobile } from "@/lib/auth";
import { db } from "@/lib/db";
import { setStatus } from "@/lib/orders";
import { normalizePurchase } from "@/lib/pricing";
import { setRequestHandled } from "@/lib/service-requests";
import { decodeMark } from "@/lib/watermark";
import { activateOrder, extendSubscription, grantManually, setRevoked, setSeats } from "@/lib/subscriptions";

export type AdminState = { error?: keyof typeof account.errors; ok?: boolean };

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const id = (form: FormData) => {
  const value = text(form, "id");
  return /^\d+$/.test(value) ? value : null;
};

/** Every admin action checks the caller again; the page being hidden is not enough. */
async function requireAdmin(): Promise<void> {
  const user = await getUser();
  if (!user?.isAdmin) throw new Error("Forbidden");
}

async function userIdByMobile(value: string): Promise<string | null> {
  const mobile = normalizeMobile(value);
  if (!mobile) return null;
  const { rows } = await (await db()).query<{ id: string }>("select id from users where mobile = $1", [mobile]);
  return rows[0]?.id ?? null;
}

export async function markOrderPaid(form: FormData): Promise<void> {
  await requireAdmin();
  const orderId = id(form);
  if (orderId) await activateOrder(orderId, { note: text(form, "note") || null });
  refresh();
}

export async function cancelOrder(form: FormData): Promise<void> {
  await requireAdmin();
  const orderId = id(form);
  if (orderId) await setStatus(orderId, "cancelled");
  refresh();
}

export async function extend(form: FormData): Promise<void> {
  await requireAdmin();
  const subscriptionId = id(form);
  const days = Math.trunc(Number(form.get("days")));
  if (subscriptionId && Number.isFinite(days) && days !== 0 && Math.abs(days) <= 3660) {
    await extendSubscription(subscriptionId, days);
  }
  refresh();
}

export async function changeSeats(form: FormData): Promise<void> {
  await requireAdmin();
  const subscriptionId = id(form);
  const seats = Math.trunc(Number(form.get("seats")));
  if (subscriptionId && seats >= 1 && seats <= 500) await setSeats(subscriptionId, seats);
  refresh();
}

export async function toggleRevoked(form: FormData): Promise<void> {
  await requireAdmin();
  const subscriptionId = id(form);
  if (subscriptionId) await setRevoked(subscriptionId, text(form, "revoked") === "1");
  refresh();
}

export async function toggleRequestHandled(form: FormData): Promise<void> {
  await requireAdmin();
  const requestId = id(form);
  if (requestId) await setRequestHandled(requestId, text(form, "handled") === "1");
  refresh();
}

export async function grant(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const ownerId = await userIdByMobile(text(form, "mobile"));
  if (!ownerId) return { error: "userNotFound" };
  const purchase = normalizePurchase({
    plan: text(form, "plan"),
    seats: Number(form.get("seats")),
    months: Number(form.get("months")),
  });
  if (!purchase) return { error: "purchase" };
  const amount = Math.max(0, Math.trunc(Number(form.get("amount")) || 0));
  await grantManually({ ownerId, ...purchase, amount, note: text(form, "note").slice(0, 300) });
  refresh();
  return { ok: true };
}

export async function resetPassword(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const userId = await userIdByMobile(text(form, "mobile"));
  if (!userId) return { error: "userNotFound" };
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "password" };
  const pool = await db();
  await pool.query("update users set password_hash = $2, failed_logins = 0, locked_until = null where id = $1", [
    userId,
    await hashPassword(password),
  ]);
  await pool.query("delete from sessions where user_id = $1", [userId]);
  return { ok: true };
}

export type TraceState = { user?: { id: string; name: string; mobile: string }; none?: boolean };

/** Finds the account whose invisible code is in a piece of copied text (see lib/watermark). */
export async function traceCopy(_: TraceState, form: FormData): Promise<TraceState> {
  await requireAdmin();
  const userId = decodeMark(String(form.get("text") ?? ""));
  if (userId === null) return { none: true };
  const { rows } = await (await db()).query<{ id: string; name: string; mobile: string }>("select id, name, mobile from users where id = $1", [userId]);
  return rows[0] ? { user: rows[0] } : { none: true };
}
