"use server";

import { databaseConfigured } from "./db";
import { saveServiceRequest } from "./service-requests";

export type ServiceRequestState = { ok?: boolean; error?: "missing" | "phone" | "unavailable" };

const field = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
const optional = (value: string) => value || null;

/** Persian and Arabic digits to ASCII, then keep only what a phone number can contain. */
const cleanPhone = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d+]/g, "");

export async function requestCtd(_: ServiceRequestState, form: FormData): Promise<ServiceRequestState> {
  // A hidden field people never see; bots that fill every input are dropped quietly.
  if (field(form, "website", 200)) return { ok: true };
  const name = field(form, "name", 120);
  const phone = cleanPhone(field(form, "phone", 40));
  if (!name || !phone) return { error: "missing" };
  if (phone.replace(/\D/g, "").length < 8) return { error: "phone" };
  if (!databaseConfigured()) return { error: "unavailable" };
  try {
    await saveServiceRequest({
      kind: "ctd",
      name,
      phone,
      company: optional(field(form, "company", 160)),
      email: optional(field(form, "email", 160)),
      product: optional(field(form, "product", 300)),
      message: optional(field(form, "message", 2000)),
      locale: field(form, "locale", 2) === "en" ? "en" : "fa",
    });
    return { ok: true };
  } catch (error) {
    console.error("service request failed", error);
    return { error: "unavailable" };
  }
}
