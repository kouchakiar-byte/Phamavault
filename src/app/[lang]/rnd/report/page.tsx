import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loading, accountMetadata } from "@/components/account/shell";
import { Bar, C, SCurve, fmt } from "@/components/rnd/charts";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { PrintStyle, Sheet, SheetBar, SheetTitle, Stat, when } from "@/components/rnd/report";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import {
  EV_KIND, GATE, HEALTH, LISTS, P_STATUS, P_TYPE, PRIO, T, UNITS, alertsOf, daysTo, health, nowMs, plannedAt, progress, riskScore, spent, stagePct, sv, today,
  type Project,
} from "@/lib/rnd/model";
import { loadProject } from "@/lib/rnd/server";

export const generateMetadata = () => accountMetadata(rndTitle);

type Search = Promise<Record<string, string | string[] | undefined>>;
const n0 = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** One A4 page a manager can take to a meeting: where the project stands, what is late, what comes next. */
function Report({ p }: { p: Project }) {
  const h = health(p), pc = progress(p), plan = Math.round(plannedAt(p, nowMs())), v = sv(p);
  const alerts = alertsOf(p, null, 30);
  const overdue = alerts.filter((a) => a.d < 0), next = alerts.filter((a) => a.d >= 0);
  const risks = p.risks.filter((r) => r.status !== "closed").sort((a, b) => riskScore(b) - riskScore(a));
  const events = p.events.filter((e) => e.kind === "decision" || e.kind === "issue").slice(0, 4);
  const cost = spent(p), items = p.stages.flatMap((s) => s.items);
  const pulls = p.stability.flatMap((s) => s.months.map((m) => s.done.includes(m)));
  const counts: [string, string][] = [
    ["کارهای انجام‌شده", `${items.filter((i) => i.done).length} از ${items.length}`],
    ["Trial فرمولاسیون", `${p.trials.length} (${p.trials.filter((t) => t.outcome === "pass").length} قابل قبول)`],
    ["روش آنالیز Validate شده", `${p.methods.filter((m) => m.status === "done" || m.status === "tr").length} از ${p.methods.length}`],
    ["نمونه‌برداری پایداری", `${pulls.filter(Boolean).length} از ${pulls.length}`],
    ["خرید دریافت‌شده", `${p.purchases.filter((r) => ["received", "qc"].includes(String(r.status))).length} از ${p.purchases.length}`],
    ["بچ ساخته‌شده", `${p.batches.filter((b) => b.status !== "planned").length} از ${p.batches.length}`],
    ["سند تأییدشده", `${p.docs.filter((d) => d.status === "approved").length} از ${p.docs.length}`],
  ];
  const line = "flex items-start justify-between gap-2 border-b border-line/70 py-[3px] last:border-0";
  return (
    <Sheet>
      <header className="mb-2.5 flex items-start justify-between gap-4 border-b-2 border-vault-900 pb-1.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-molecule-700">گزارش وضعیت پروژه تحقیق و توسعه</p>
          <h1 className="text-[18px] font-extrabold leading-7 text-vault-900">{T(p.name)}</h1>
          <p className="text-muted">
            {p.code && <><bdi dir="ltr" className="font-mono">{p.code}</bdi> · </>}{P_TYPE[p.type]}{p.form ? ` · ${T(p.form)}` : ""}{p.strength ? ` · ${T(p.strength)}` : ""} · اولویت {PRIO[p.priority]} · وضعیت: {P_STATUS[p.status]}
          </p>
          <p className="text-muted">مسئول پروژه: {p.lead ? T(p.lead) : "—"}{p.requester ? ` · درخواست‌دهنده: ${T(p.requester)}` : ""}{p.rld ? ` · محصول مرجع: ${T(p.rld)}` : ""}</p>
        </div>
        <div className="shrink-0 text-left">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${HEALTH[h].tone}`}><i className="size-2 rounded-full" style={{ background: HEALTH[h].color }} />{HEALTH[h].label}</span>
          <p className="mt-1 text-[10px] text-muted">تاریخ گزارش: <bdi dir="ltr" className="font-mono">{fmt(today())}</bdi></p>
          <p className="text-[10px] text-muted">اعلام: <bdi dir="ltr" className="font-mono">{fmt(p.start)}</bdi> · هدف: <bdi dir="ltr" className="font-mono">{fmt(p.target)}</bdi></p>
        </div>
      </header>

      <section className="mb-2.5 grid grid-cols-5 gap-2">
        <Stat label="پیشرفت واقعی" value={`${pc}%`} sub={`${items.filter((i) => i.done).length} از ${items.length} کار`} />
        <Stat label="طبق برنامه تا امروز" value={`${plan}%`} sub="از موعد مراحل" />
        <Stat label="انحراف از برنامه" value={`${v > 0 ? "+" : ""}${v}%`} sub={v < -5 ? "عقب‌تر از برنامه" : v > 5 ? "جلوتر از برنامه" : "نزدیک به برنامه"} tone={v < -15 ? "bad" : v < -5 ? "warn" : "ok"} />
        <Stat label="روز تا تاریخ هدف" value={p.target ? daysTo(p.target) : "—"} sub={<bdi dir="ltr" className="font-mono">{fmt(p.target)}</bdi>} tone={p.target && daysTo(p.target) < 0 ? "bad" : ""} />
        <Stat label="هزینه از بودجه" value={p.budget ? `${Math.round((100 * cost) / p.budget)}%` : "—"} sub={p.budget ? <><bdi dir="ltr" className="font-mono">{n0(cost)} / {n0(p.budget)}</bdi>{p.unit ? ` ${T(p.unit)}` : ""}</> : "بودجه تعریف نشده"} tone={p.budget && cost > p.budget ? "bad" : ""} />
      </section>

      <section className="rnd-keep mb-2">
        <SheetTitle aside="پیشرفت وزنی بر اساس حجم کار هر مرحله">منحنی پیشرفت برنامه‌ای و واقعی</SheetTitle>
        <SCurve p={p} height={160} />
      </section>

      <div className="mb-2 grid grid-cols-[1.15fr_1fr] gap-5">
        <section className="rnd-keep">
          <SheetTitle>مراحل و Gate</SheetTitle>
          <table className="w-full border-collapse">
            <thead><tr className="text-right text-[10px] text-muted"><th className="pb-1 font-semibold">مرحله</th><th className="px-2 pb-1 font-semibold">موعد</th><th className="w-28 pb-1 font-semibold">پیشرفت</th><th className="ps-2 pb-1 font-semibold">Gate</th></tr></thead>
            <tbody>
              {p.stages.map((s, i) => {
                const sp = Math.round(stagePct(s)), late = sp < 100 && daysTo(s.due) < 0, g = s.gate.decision;
                return (
                  <tr key={s.key} className="border-t border-line/70">
                    <td className="py-[3px]"><span className="font-mono text-muted">{i + 1}.</span> {T(s.title)}</td>
                    <td className={`whitespace-nowrap px-2 py-[3px] font-mono text-[10.5px] ${late ? "font-bold text-red-700" : ""}`}><bdi dir="ltr">{fmt(s.due)}</bdi></td>
                    <td className="py-[3px]"><span className="flex items-center gap-1.5"><Bar value={sp} tone={sp >= 100 ? C.ok : late ? C.bad : undefined} /><span className="w-8 shrink-0 font-mono text-[10.5px]" dir="ltr">{sp}%</span></span></td>
                    <td className={`whitespace-nowrap ps-2 py-[3px] text-[10.5px] font-semibold ${g === "go" ? "text-emerald-700" : g === "nogo" ? "text-red-700" : g === "hold" ? "text-amber-700" : "text-muted"}`}>{g === "pending" ? "—" : GATE[g].split(" — ")[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <div>
          <section className="rnd-keep mb-2">
            <SheetTitle aside={overdue.length > 5 ? `5 مورد از ${overdue.length}` : undefined}>موعدهای گذشته ({overdue.length})</SheetTitle>
            {overdue.slice(0, 5).map((a, i) => (
              <div key={i} className={line}><span className="min-w-0">{a.text} <span className="text-muted">· {UNITS[a.unit]}</span></span><span className="shrink-0 font-bold text-red-700">{-a.d} روز</span></div>
            ))}
            {!overdue.length && <p className="text-emerald-700">موعد گذشته‌ای وجود ندارد.</p>}
          </section>
          <section className="rnd-keep">
            <SheetTitle aside={next.length > 5 ? `5 مورد از ${next.length}` : undefined}>موعدهای 30 روز آینده ({next.length})</SheetTitle>
            {next.slice(0, 5).map((a, i) => (
              <div key={i} className={line}><span className="min-w-0">{a.text} <span className="text-muted">· {UNITS[a.unit]}</span></span><span className="shrink-0 whitespace-nowrap text-muted">{when(a.d)}</span></div>
            ))}
            {!next.length && <p className="text-muted">در 30 روز آینده موعدی نیست.</p>}
          </section>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-5">
        <section className="rnd-keep">
          <SheetTitle aside="امتیاز = شدت × احتمال">ریسک‌های باز ({risks.length})</SheetTitle>
          {risks.slice(0, 4).map((r) => {
            const sc = riskScore(r);
            return (
              <div key={r.id} className={line}>
                <span className="min-w-0">{T(r.risk)}{r.mitigation ? <span className="text-muted"> — {T(r.mitigation)}</span> : null}</span>
                <span className={`shrink-0 rounded-full px-1.5 font-mono font-bold ${sc >= 15 ? "bg-red-50 text-red-700" : sc >= 8 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{sc}</span>
              </div>
            );
          })}
          {!risks.length && <p className="text-muted">ریسک بازی ثبت نشده است.</p>}
        </section>
        <section className="rnd-keep">
          <SheetTitle>تصمیم‌ها و مشکلات اخیر</SheetTitle>
          {events.map((e) => (
            <div key={e.id} className={line}>
              <span className="min-w-0"><b className={e.kind === "issue" ? "text-red-700" : "text-molecule-700"}>{EV_KIND[e.kind]}:</b> {T(e.text)}</span>
              <span className="shrink-0 font-mono text-[10.5px] text-muted" dir="ltr">{fmt(e.date)}</span>
            </div>
          ))}
          {!events.length && <p className="text-muted">تصمیم یا مشکلی ثبت نشده است.</p>}
        </section>
      </div>

      <section className="rnd-keep">
        <SheetTitle>خلاصه ثبت‌ها</SheetTitle>
        <div className="grid grid-cols-4 gap-x-4 gap-y-1">
          {counts.map(([l, v]) => <div key={l} className="flex justify-between gap-2 border-b border-line/70 py-[2px]"><span className="text-muted">{l}</span><b>{v}</b></div>)}
          <div className="flex justify-between gap-2 border-b border-line/70 py-[2px]"><span className="text-muted">{LISTS.risks.title}</span><b>{p.risks.length} ({risks.filter((r) => riskScore(r) >= 15).length} بالا)</b></div>
        </div>
      </section>

      <footer className="mt-2.5 flex justify-between border-t border-line pt-1.5 text-[9.5px] text-muted">
        <span>این گزارش از داده‌های ثبت‌شده در سامانه مدیریت پروژه‌های تحقیق و توسعه تهیه شده است.</span>
        <span>محرمانه — فقط برای استفاده داخلی</span>
      </footer>
    </Sheet>
  );
}

async function Page({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const id = String((await searchParams).id ?? "");
  const { access, urgent } = await requireAccess(locale, `${rndHref(locale, "report")}?id=${encodeURIComponent(id)}`);
  // The report shows every unit's work and the budget: it is for the owner and managers only.
  if (access.role === "member") notFound();
  const p = await loadProject(id);
  if (!p) notFound();
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="project">
      <PrintStyle />
      <SheetBar back={`${rndHref(locale, "project")}?id=${p.id}`} backLabel="بازگشت به پروژه" />
      <Report p={p} />
    </RndFrame>
  );
}

export default async function RndReportPage({ searchParams }: { searchParams: Search }) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Page locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
