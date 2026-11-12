import Link from "next/link";
import { Suspense } from "react";
import { Loading, accountMetadata } from "@/components/account/shell";
import { fmt } from "@/components/rnd/charts";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import { UNITS, type Alert } from "@/lib/rnd/model";
import { alertsFor } from "@/lib/rnd/server";

// A neutral title: the tab and the 404 shown to anyone without access do not say what is here.
export const generateMetadata = () => accountMetadata(rndTitle);

const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);

function Group({ title, tone, items, locale, showUnit }: { title: string; tone: string; items: Alert[]; locale: Locale; showUnit: boolean }) {
  if (!items.length) return null;
  return (
    <section className="rounded-card border border-line bg-white p-4 sm:p-5">
      <h2 className={`mb-3 text-base font-bold ${tone}`}>{title} <span className="font-mono">({items.length})</span></h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((a, i) => (
          <li key={i}>
            <Link href={`${rndHref(locale, "project")}?id=${a.project}`} className={`flex gap-3 rounded-md border px-3 py-2 text-sm hover:border-molecule-500 ${a.d < 0 ? "border-red-200 bg-red-50" : a.d <= 3 ? "border-amber-200 bg-amber-50" : "border-line"}`}>
              <span className={`w-24 shrink-0 text-xs font-bold ${a.d < 0 ? "text-red-700" : a.d <= 3 ? "text-amber-700" : "text-muted"}`}>{when(a.d)}<span className="block font-normal">{fmt(a.due)}</span></span>
              <span className="min-w-0"><b>{a.projectName}</b>{showUnit && <span className="mr-2 rounded-full bg-vault-50 px-2 py-0.5 text-xs text-vault-800">{UNITS[a.unit]}</span>}<span className="block text-xs text-muted">{a.text}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Alerts({ locale }: { locale: Locale }) {
  const { access, urgent } = await requireAccess(locale, rndHref(locale, "alerts"));
  const all = await alertsFor(access);
  const showUnit = access.role !== "member";
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="alerts">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          {access.role === "member" ? `موعدهای واحد ${UNITS[access.unit!]} در همه پروژه‌ها` : "موعدهای همه واحدها در همه پروژه‌ها"}: وظایف مراحل، نمونه‌برداری‌های پایداری، تحویل مواد خریداری‌شده و Validation روش‌های آنالیز. هشدار از 30 روز مانده به موعد نمایش داده می‌شود و از 3 روز مانده در نشان قرمز بالای صفحه شمرده می‌شود.
        </p>
        <Group title="موعد گذشته" tone="text-red-700" items={all.filter((a) => a.d < 0)} locale={locale} showUnit={showUnit} />
        <Group title="امروز تا 3 روز آینده" tone="text-amber-700" items={all.filter((a) => a.d >= 0 && a.d <= 3)} locale={locale} showUnit={showUnit} />
        <Group title="4 تا 30 روز آینده" tone="text-vault-900" items={all.filter((a) => a.d > 3)} locale={locale} showUnit={showUnit} />
        {!all.length && <p className="rounded-card border border-line bg-white p-6 text-center text-sm text-muted">در 30 روز آینده موعدی ندارید.</p>}
      </div>
    </RndFrame>
  );
}

export default async function RndAlertsPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Alerts locale={locale} />
    </Suspense>
  );
}
