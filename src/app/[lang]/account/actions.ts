"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { account } from "@/content/account";
import { hasLocale, type Locale } from "@/i18n/config";
import { checkLogin, createPasswordReset, endSession, getUser, hashPassword, normalizeMobile, startSession, applyPasswordReset } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { mailConfigured, sendMail } from "@/lib/mail";
import { logMail } from "@/lib/mail-log";
import { siteOrigin } from "@/lib/site-origin";
import { allow } from "@/lib/rate-limit";
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

const ACCOUNT_KINDS = ["individual", "company", "pharmacy"] as const;
type AccountKind = (typeof ACCOUNT_KINDS)[number];

/** A plausible email address, lower-cased, or null. */
const email = (value: string) => {
  const v = value.trim().toLowerCase().slice(0, 160);
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(v) ? v : null;
};

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const name = text(form, "name").slice(0, 120);
  const mobile = normalizeMobile(text(form, "mobile"));
  const mail = email(text(form, "email"));
  const kindValue = text(form, "kind");
  const kind: AccountKind = (ACCOUNT_KINDS as readonly string[]).includes(kindValue) ? (kindValue as AccountKind) : "individual";
  // The company or pharmacy name is required for those accounts; optional for individuals.
  const org = text(form, "org").slice(0, 160) || null;
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "name" };
  if (!mobile) return { error: "mobile" };
  if (!mail) return { error: "email" };
  if (kind !== "individual" && !org) return { error: kind === "company" ? "company" : "pharmacy" };
  if (password.length < 8) return { error: "password" };
  if (password !== String(form.get("passwordRepeat") ?? "")) return { error: "mismatch" };

  const { rows } = await (await db()).query<{ id: string }>(
    `insert into users (mobile, name, password_hash, email, kind, org) values ($1, $2, $3, $4, $5, $6)
     on conflict (mobile) do nothing returning id`,
    [mobile, name, await hashPassword(password), mail, kind, org],
  );
  if (!rows[0]) return { error: "taken" };
  await startSession(rows[0].id);
  redirect(nextPath(locale, text(form, "next")));
}

/**
 * Emails a one-hour reset link to the address on the account found by mobile number or email.
 * The answer is the same whether or not an account exists, so the form cannot be used to test numbers.
 */
export async function forgotPassword(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(`forgot:${ip}`, 5, 15 * 60_000)) return { error: "tooMany" };
  const value = text(form, "identifier");
  const mobile = normalizeMobile(value);
  const mail = email(value);
  if (!mobile && !mail) return { error: "identifier" };
  const { rows } = await (await db()).query<{ id: string; name: string; email: string | null }>(
    "select id, name, email from users where not blocked and (mobile = $1 or lower(email) = $2) limit 1",
    [mobile, mail],
  );
  const user = rows[0];
  if (!user) await logMail({ kind: "reset", recipient: value, ok: false, detail: "noAccount" });
  else if (!user.email) await logMail({ kind: "reset", recipient: value, userId: user.id, ok: false, detail: "noEmail" });
  else if (!allow(`forgot:u:${user.id}`, 3, 60 * 60_000)) await logMail({ kind: "reset", recipient: user.email, userId: user.id, ok: false, detail: "limited" });
  else if (!mailConfigured()) await logMail({ kind: "reset", recipient: user.email, userId: user.id, ok: false, detail: "smtpOff" });
  else {
    const token = await createPasswordReset(user.id);
    const link = `${await siteOrigin()}${href(locale, "account/reset")}?token=${token}`;
    const m = account.reset.mail;
    try {
      await sendMail({
        to: user.email,
        subject: m.subject[locale],
        text: `${m.hello[locale].replace("{name}", user.name)}\n\n${m.body[locale]}\n${link}\n\n${m.ignore[locale]}\n\nPharmaVault — https://pharmavault.ir`,
        html: `<div dir="${locale === "fa" ? "rtl" : "ltr"}" style="font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:2;color:#12233b">
<p>${m.hello[locale].replace("{name}", escapeHtml(user.name))}</p><p>${m.body[locale]}</p>
<p><a href="${link}" style="display:inline-block;background:#0b1f3a;color:#fff;text-decoration:none;padding:10px 24px;border-radius:999px;font-weight:bold">${m.button[locale]}</a></p>
<p style="color:#5b6b80;font-size:12px">${m.ignore[locale]}</p><p style="color:#5b6b80;font-size:12px">PharmaVault · <span dir="ltr">https://pharmavault.ir</span></p></div>`,
      });
      await logMail({ kind: "reset", recipient: user.email, userId: user.id, ok: true, detail: "sent" });
    } catch (error) {
      console.error("password reset email failed", error);
      await logMail({ kind: "reset", recipient: user.email, userId: user.id, ok: false, detail: error instanceof Error ? error.message : String(error) });
    }
  }
  return { ok: true };
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sets the new password from a reset link, then signs the user in. */
export async function setNewPassword(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "password" };
  if (password !== String(form.get("passwordRepeat") ?? "")) return { error: "mismatch" };
  const userId = await applyPasswordReset(text(form, "token"), password);
  if (!userId) return { error: "resetExpired" };
  await startSession(userId);
  redirect(href(locale, "account"));
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const mobile = normalizeMobile(text(form, "mobile"));
  if (!mobile) return { error: "mobile" };
  const { result, userId } = await checkLogin(mobile, String(form.get("password") ?? ""));
  if (result === "blocked") return { error: "blocked" };
  if (result === "locked") return { error: "locked" };
  if (result !== "ok" || !userId) return { error: "login" };
  await startSession(userId);
  redirect(nextPath(locale, text(form, "next")));
}

export async function logout(form: FormData): Promise<void> {
  await endSession();
  redirect(href(localeOf(form)));
}


export async function buy(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!databaseConfigured()) return { error: "unavailable" };
  const user = await getUser();
  if (!user) {
    // Sign up first, then come back to the last key with the same choices.
    const choice = new URLSearchParams({
      plan: text(form, "plan") || "individual",
      seats: text(form, "seats"),
      months: text(form, "months"),
      ready: "1",
    });
    redirect(`${href(locale, "account/register")}?next=${encodeURIComponent(`${href(locale, "account/buy")}?${choice}`)}`);
  }

  // A renewal repeats the plan of a subscription the buyer owns.
  const renewId = text(form, "renew");
  const renewing = renewId ? await getSubscription(renewId) : null;
  if (renewId && renewing?.ownerId !== user.id) return { error: "purchase" };

  const purchase = normalizePurchase(
    renewing
      ? { plan: renewing.plan, seats: renewing.seats, months: Number(form.get("months")) }
      : {
          plan: text(form, "plan"),
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
