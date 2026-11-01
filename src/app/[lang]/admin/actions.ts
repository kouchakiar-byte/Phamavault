"use server";

import { refresh } from "next/cache";
import { account } from "@/content/account";
import { getUser, hashPassword, normalizeMobile } from "@/lib/auth";
import { db } from "@/lib/db";
import { setStatus } from "@/lib/orders";
import { normalizePurchase } from "@/lib/pricing";
import { setRequestHandled } from "@/lib/service-requests";
import { mailConfigured, sendMail } from "@/lib/mail";
import { logMail } from "@/lib/mail-log";
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

/** Blocks an account (it can no longer sign in and its sessions end) or lifts the block. Admin accounts cannot be blocked. */
export async function setBlocked(form: FormData): Promise<void> {
  await requireAdmin();
  const userId = id(form);
  if (!userId) return;
  const blocked = text(form, "blocked") === "1";
  const pool = await db();
  const admins = (process.env.ADMIN_MOBILES ?? "").split(/[,\s]+/).map(normalizeMobile).filter(Boolean);
  await pool.query("update users set blocked = $2 where id = $1 and not (mobile = any($3::text[]))", [userId, blocked, admins]);
  if (blocked) await pool.query("delete from sessions where user_id = $1", [userId]);
  refresh();
}

/** Deletes an account that has no subscriptions or orders; anything with a purchase history is blocked instead. */
export async function deleteUser(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const userId = id(form);
  if (!userId) return {};
  const pool = await db();
  const { rows } = await pool.query<{ n: number }>(
    "select (select count(*) from subscriptions where owner_id = $1) + (select count(*) from orders where user_id = $1) as n",
    [userId],
  );
  if (Number(rows[0]?.n) > 0) return { error: "hasRecords" };
  const admins = (process.env.ADMIN_MOBILES ?? "").split(/[,\s]+/).map(normalizeMobile).filter(Boolean);
  await pool.query("delete from users where id = $1 and not (mobile = any($2::text[]))", [userId, admins]);
  refresh();
  return { ok: true };
}

/** Creates an account by hand, for someone who cannot sign up themselves. */
export async function addUser(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const name = text(form, "name").slice(0, 120);
  const mobile = normalizeMobile(text(form, "mobile"));
  const emailValue = text(form, "email").toLowerCase().slice(0, 160);
  const kindValue = text(form, "kind");
  const kind = ["individual", "company", "pharmacy"].includes(kindValue) ? kindValue : "individual";
  const org = text(form, "org").slice(0, 160) || null;
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "name" };
  if (!mobile) return { error: "mobile" };
  if (emailValue && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(emailValue)) return { error: "email" };
  if (kind !== "individual" && !org) return { error: kind === "company" ? "company" : "pharmacy" };
  if (password.length < 8) return { error: "password" };
  const { rows } = await (await db()).query(
    `insert into users (mobile, name, password_hash, email, kind, org) values ($1, $2, $3, $4, $5, $6)
     on conflict (mobile) do nothing returning id`,
    [mobile, name, await hashPassword(password), emailValue || null, kind, org],
  );
  if (!rows[0]) return { error: "taken" };
  refresh();
  return { ok: true };
}

export type MailTestState = { ok?: boolean; error?: string };

/** Sends a test email and shows the SMTP server's answer, so a wrong setting is visible right away. */
export async function testMail(_: MailTestState, form: FormData): Promise<MailTestState> {
  await requireAdmin();
  const to = text(form, "to").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { error: "email" };
  if (!mailConfigured()) {
    await logMail({ kind: "test", recipient: to, ok: false, detail: "smtpOff" });
    return { error: "smtpOff" };
  }
  try {
    await sendMail({
      to,
      subject: "PharmaVault — test email / ایمیل آزمایشی",
      text: "This is a test email from the PharmaVault admin panel.\nاین یک ایمیل آزمایشی از پنل مدیریت PharmaVault است.",
      html: '<div style="font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:2"><p>This is a test email from the PharmaVault admin panel.</p><p dir="rtl">این یک ایمیل آزمایشی از پنل مدیریت PharmaVault است.</p></div>',
    });
    await logMail({ kind: "test", recipient: to, ok: true, detail: "sent" });
    refresh();
    return { ok: true };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    await logMail({ kind: "test", recipient: to, ok: false, detail });
    refresh();
    return { error: detail };
  }
}
