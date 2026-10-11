"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { account } from "@/content/account";
import { hasLocale, type Locale } from "@/i18n/config";
import { checkLogin, endSession, getUser, hashPassword, normalizeMobile, startSession } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { createOrder, setAuthority, setStatus } from "@/lib/orders";
import { href } from "@/lib/paths";
import { normalizePurchase, totalPrice } from "@/lib/pricing";
import { addMember, getSubscription, removeMember } from "@/lib/subscriptions";
import { onlinePaymentEnabled, requestPayment } from "@/lib/zarinpal";

export type FormState = { error?: keyof typeof account.errors; ok?: boolean };

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const localeOf = (form: FormData): Locale => {
  const value = text(form, "lang");
  return hasLocale(value) ? value : "fa";
};

/** Only same-site paths in the current language are followed after sign-in. */
function nextPath(locale: Locale, value: string): string {
  return value.startsWith(`/${locale}/`) && !value.startsWith("//") && !value.includes("\\") ? value : href(locale, "account");
}

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const name = text(form, "name").slice(0, 120);
  const mobile = normalizeMobile(text(form, "mobile"));
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "name" };
  if (!mobile) return { error: "mobile" };
  if (password.length < 8) return { error: "password" };
  if (password !== String(form.get("passwordRepeat") ?? "")) return { error: "mismatch" };

  const { rows } = await (await db()).query<{ id: string }>(
    "insert into users (mobile, name, password_hash) values ($1, $2, $3) on conflict (mobile) do nothing returning id",
    [mobile, name, await hashPassword(password)],
  );
  if (!rows[0]) return { error: "taken" };
  await startSession(rows[0].id);
  redirect(nextPath(locale, text(form, "next")));
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const mobile = normalizeMobile(text(form, "mobile"));
  if (!mobile) return { error: "mobile" };
  const { result, userId } = await checkLogin(mobile, String(form.get("password") ?? ""));
  if (result === "locked") return { error: "locked" };
  if (result !== "ok" || !userId) return { error: "login" };
  await startSession(userId);
  redirect(nextPath(locale, text(form, "next")));
}

export async function logout(form: FormData): Promise<void> {
  await endSession();
  redirect(href(localeOf(form)));
}

/** Address the gateway sends the buyer back to. SITE_URL wins over the request's own host. */
async function siteOrigin(): Promise<string> {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
}

export async function buy(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  const user = await getUser();
  if (!user) redirect(href(locale, "account/login"));

  // A renewal repeats the plan of a subscription the buyer owns.
  const renewId = text(form, "renew");
  const renewing = renewId ? await getSubscription(renewId) : null;
  if (renewId && renewing?.ownerId !== user.id) return { error: "purchase" };

  const purchase = normalizePurchase(
    renewing
      ? { plan: renewing.plan, sections: renewing.sections, seats: renewing.seats, months: Number(form.get("months")) }
      : {
          plan: text(form, "plan"),
          sections: form.getAll("sections").map(String),
          seats: Number(form.get("seats")),
          months: Number(form.get("months")),
        },
  );
  if (!purchase) return { error: "purchase" };

  const online = onlinePaymentEnabled() && text(form, "method") !== "invoice";
  const amount = totalPrice(purchase);
  const orderId = await createOrder({
    userId: user.id,
    purchase,
    amount,
    method: online ? "online" : "invoice",
    locale,
    renews: renewing?.id ?? null,
  });
  if (!online) redirect(`${href(locale, "account")}?order=invoice`);

  let payUrl: string;
  try {
    const payment = await requestPayment({
      amount,
      description: `PharmaVault #${orderId} · ${purchase.plan} · ${purchase.months}m`,
      callbackUrl: `${await siteOrigin()}/api/pay/callback`,
      mobile: user.mobile,
      orderId,
    });
    await setAuthority(orderId, payment.authority);
    payUrl = payment.payUrl;
  } catch (error) {
    console.error(error);
    await setStatus(orderId, "failed");
    return { error: "gateway" };
  }
  redirect(payUrl);
}

export async function addTeamMember(_: FormState, form: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) return { error: "unavailable" };
  const mobile = normalizeMobile(text(form, "mobile"));
  if (!mobile) return { error: "mobile" };
  const result = await addMember(text(form, "subscription"), user.id, mobile);
  if (result === "full") return { error: "full" };
  if (result === "denied") return { error: "purchase" };
  refresh();
  return { ok: true };
}

export async function removeTeamMember(form: FormData): Promise<void> {
  const user = await getUser();
  const mobile = normalizeMobile(text(form, "mobile"));
  if (!user || !mobile) return;
  await removeMember(text(form, "subscription"), user.id, mobile);
  refresh();
}
