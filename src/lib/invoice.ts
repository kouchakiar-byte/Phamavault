import type { Locale } from "@/i18n/config";
import type { Order } from "./orders";

export const jalali = (date: Date, locale: Locale, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian-nu-latn" : "en-GB", { timeZone: "Asia/Tehran", ...opts }).format(date);

/** "12/پ/1405": order id, the pro-forma series letter and the Persian year it was issued. */
export function invoiceNumber(order: Pick<Order, "id" | "createdAt">): string {
  return `${order.id}/پ/${jalali(order.createdAt, "fa", { year: "numeric" }).replace(/\D/g, "")}`;
}
