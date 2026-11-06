"use server";

import { redirect } from "next/navigation";
import { getUser } from "./auth";
import { databaseConfigured } from "./db";
import { href } from "./paths";
import { addAlert, removeAlert } from "./supplier-alerts";

export type AlertState = { ok?: boolean; error?: "short" | "email" | "full" | "signin" | "unavailable" };

/** "Tell me when a supplier is listed" from the supplier bank's empty result. */
export async function requestSupplierAlert(state: AlertState, form: FormData): Promise<AlertState> {
  const query = String(form.get("q") ?? "").trim().replace(/\s+/g, " ").slice(0, 100);
  const email = String(form.get("email") ?? "").trim().slice(0, 160);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (query.length < 2) return { error: "short" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "email" };
  if (!databaseConfigured()) return { error: "unavailable" };
  const user = await getUser().catch(() => null);
  if (!user) return { error: "signin" };
  try {
    const r = await addAlert(user.id, query, email || null, locale);
    return r === "full" ? { error: "full" } : { ok: true };
  } catch {
    return { error: "unavailable" };
  }
}

export async function deleteSupplierAlert(form: FormData): Promise<void> {
  const user = await getUser().catch(() => null);
  const id = String(form.get("id") ?? "");
  if (user && /^\d+$/.test(id)) await removeAlert(user.id, id);
  redirect(href(form.get("lang") === "en" ? "en" : "fa", "account"));
}
