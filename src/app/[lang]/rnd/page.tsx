import type React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Loading, accountMetadata } from "@/components/account/shell";
import { Donut, Gantt, Legend, PortfolioBars, StageBars, Bar, C, fmt } from "@/components/rnd/charts";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { NewProject } from "@/components/rnd/new-project";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import { HEALTH, P_STATUS, P_TYPE, PRIO, T, UNITS, alertsOf, curStage, daysTo, health, isOpen, progress, riskScore, spent, sv, type Health, type Project } from "@/lib/rnd/model";
import { filterProject, loadProjects, type Access } from "@/lib/rnd/server";

// A neutral title: the tab and the 404 shown to anyone without access do not say what is here.
export const generateMetadata = () => accountMetadata(rndTitle);

const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);
const card = "min-w-0 rounded-card border border-line bg-white p-4 sm:p-5";
const pill = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold";

function Kpi({ label, value, sub, tone = "" }: { label: string; value: string | number; sub: React.ReactNode; tone?: "" | "bad" | "warn" | "ok" }) {
  const c = tone === "bad" ? "border-red-200" : tone === "warn" ? "border-amber-200" : tone === "ok" ? "border-emerald-200" : "border-line";
  const t = tone === "bad" ? "text-red-700" : tone === "warn" ? "text-amber-700" : "text-vault-900";
  return (
    <div className={`rounded-card border bg-white p-4 ${c}`}>
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 font-mono text-2xl font-extrabold ${t}`} dir="ltr" style={{ textAlign: "right" }}>{value}</div>
      <div className="mt-1 text-xs text-muted">{sub}</div>
    </div>
  );
}

function Owner({ locale, ps, access }: { locale: Locale; ps: Project[]; access: Access }) {
  const open = ps.filter(isOpen), active = ps.filter((p) => p.status === "active");
  const hc: Record<Health, number> = { ok: 0, risk: 0, late: 0, hold: 0, done: 0, cancelled: 0 };
  for (const p of open) hc[health(p)]++;
  const avg = open.length ? Math.round(open.reduce((a, p) => a + progress(p), 0) / open.length) : 0;
  const avgSv = active.length ? Math.round(active.reduce((a, p) => a + sv(p), 0) / active.length) : 0;
  const alerts = open.flatMap((p) => alertsOf(p, null, 60)).sort((a, b) => a.d - b.d);
  const over = alerts.filter((a) => a.d < 0).length, soon = alerts.filter((a) => a.d >= 0 && a.d <= 7).length;
  const hiRisks = open.reduce((a, p) => a + p.risks.filter((r) => r.status !== "closed" && riskScore(r) >= 15).length, 0);
  const bud = open.reduce((a, p) => a + (+(p.budget ?? 0) || 0), 0), sp = open.reduce((a, p) => a + spent(p), 0);
  const leads: Record<string, number> = {};
  for (const p of open) leads[p.lead || "بدون مسئول"] = (leads[p.lead || "بدون مسئول"] || 0) + 1;
  const lmx = Math.max(1, ...Object.values(leads));
  const go = (id: string) => `${rndHref(locale, "project")}?id=${id}`;
  const order = { high: 0, medium: 1, low: 2 };
  const list = [...ps].sort((a, b) => Number(!isOpen(a)) - Number(!isOpen(b)) || order[a.priority] - order[b.priority] || sv(a) - sv(b));
  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="پروژه‌های در جریان" value={open.length} sub={`${hc.hold} متوقف · ${ps.length} کل`} />
        <Kpi label="میانگین پیشرفت" value={`${avg}%`} sub={<>انحراف از برنامه: <bdi dir="ltr">{`${avgSv > 0 ? "+" : ""}${avgSv}%`}</bdi></>} />
        <Kpi label="عقب از برنامه" value={hc.late} sub={`${hc.risk} در معرض تأخیر`} tone={hc.late ? "bad" : hc.risk ? "warn" : "ok"} />
        <Kpi label="موعدهای گذشته" value={over} sub={`${soon} موعد در 7 روز آینده`} tone={over ? "bad" : soon ? "warn" : ""} />
        <Kpi label="ریسک‌های بالا" value={hiRisks} sub="باز، امتیاز 15 و بیشتر" tone={hiRisks ? "bad" : ""} />
        <Kpi label="هزینه از بودجه" value={bud ? `${Math.round((100 * sp) / bud)}%` : "—"} sub={bud ? <bdi dir="ltr">{`${sp.toLocaleString("en-US")} / ${bud.toLocaleString("en-US")}`}</bdi> : "بودجه‌ای تعریف نشده"} tone={bud && sp > bud ? "bad" : ""} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <h2 className="mb-3 text-base font-bold text-vault-900">پیشرفت واقعی در برابر برنامه</h2>
          <PortfolioBars ps={open} href={go} />
        </div>
        <div className={card}>
          <h2 className="mb-3 text-base font-bold text-vault-900">موعدهای پیش رو و گذشته <span className="text-xs font-normal text-muted">60 روز آینده، همه واحدها</span></h2>
          <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
            {alerts.slice(0, 50).map((a, i) => (
              <li key={i}>
                <Link href={go(a.project)} className={`flex gap-3 rounded-md border px-3 py-2 text-sm hover:border-molecule-500 ${a.d < 0 ? "border-red-200 bg-red-50" : a.d <= 3 ? "border-amber-200 bg-amber-50" : "border-line"}`}>
                  <span className={`w-20 shrink-0 text-xs font-bold ${a.d < 0 ? "text-red-700" : a.d <= 3 ? "text-amber-700" : "text-muted"}`}>{when(a.d)}<span className="block font-normal">{fmt(a.due)}</span></span>
                  <span className="min-w-0"><b>{T(a.projectName)}</b> <span className={`${pill} bg-vault-50 text-vault-800`}>{UNITS[a.unit]}</span><span className="block text-xs text-muted">{a.text}</span></span>
                </Link>
              </li>
            ))}
            {!alerts.length && <li className="text-sm text-muted">در 60 روز آینده موعدی نیست.</li>}
          </ul>
        </div>
      </section>
      <section className={card}>
        <h2 className="mb-3 text-base font-bold text-vault-900">خط زمانی مراحل <span className="text-xs font-normal text-muted">هر نوار: یک مرحله، از پایان مرحله قبل تا موعد آن</span></h2>
        <Gantt ps={open.length ? open : ps} href={go} />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className={card}>
          <h2 className="mb-3 text-base font-bold text-vault-900">سلامت پورتفولیو</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Donut parts={[{ v: hc.ok, c: HEALTH.ok.color }, { v: hc.risk, c: HEALTH.risk.color }, { v: hc.late, c: HEALTH.late.color }, { v: hc.hold, c: HEALTH.hold.color }]} center={String(open.length)} sub="پروژه در جریان" />
            <ul className="flex flex-col gap-1.5 text-sm">
              {(["ok", "risk", "late", "hold"] as Health[]).map((h) => <li key={h} className="flex items-center gap-1.5"><i className="size-2 rounded-full" style={{ background: HEALTH[h].color }} />{HEALTH[h].label}: <b className="font-mono">{hc[h]}</b></li>)}
            </ul>
          </div>
          <p className="mt-3 text-xs text-muted">عقب از برنامه: بیش از 15% عقب‌تر از منحنی برنامه، مرحله‌ای بیش از 30 روز تأخیر، یا گذشتن تاریخ هدف. در معرض تأخیر: 5 تا 15% عقب‌تر یا مرحله‌ای با موعد گذشته.</p>
        </div>
        <div className={card}><h2 className="mb-3 text-base font-bold text-vault-900">پروژه‌ها در هر مرحله</h2><StageBars open={open} /></div>
        <div className={card}>
          <h2 className="mb-3 text-base font-bold text-vault-900">پروژه‌ها به تفکیک مسئول</h2>
          <div className="flex flex-col gap-2 text-xs">
            {Object.entries(leads).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(0,8rem)_1fr_1.5rem] items-center gap-2"><span className="truncate">{T(k)}</span><Bar value={(100 * v) / lmx} tone={C.gold} /><span className="font-mono">{v}</span></div>
            ))}
            {!open.length && <p className="text-muted">—</p>}
          </div>
        </div>
      </section>
      <section className={card}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-vault-900">فهرست پروژه‌ها</h2>
          {access.role === "owner" && <NewProject projectHref={rndHref(locale, "project")} />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-vault-50 text-right text-xs text-vault-900">
                {["سلامت", "محصول", "کد", "اولویت", "مرحله جاری", "پیشرفت", "انحراف", "موعد مرحله جاری", "تاریخ هدف", "ریسک باز"].map((h) => <th key={h} className="px-2 py-2 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const h = health(p), ci = curStage(p), v = sv(p), nx = ci >= 0 ? p.stages[ci] : null, or = p.risks.filter((r) => r.status !== "closed");
                return (
                  <tr key={p.id} className={`border-b border-line hover:bg-molecule-50/40 ${isOpen(p) ? "" : "opacity-60"}`}>
                    <td className="px-2 py-2"><span className={`${pill} ${HEALTH[h].tone}`}><i className="size-2 rounded-full" style={{ background: HEALTH[h].color }} />{HEALTH[h].label}</span></td>
                    <td className="px-2 py-2"><Link href={go(p.id)} className="font-bold text-vault-900 hover:text-molecule-700">{T(p.name)}</Link><div className="text-xs text-muted">{P_TYPE[p.type]}{p.form ? ` · ${p.form}` : ""}{p.lead ? ` · ${p.lead}` : ""}{isOpen(p) ? "" : ` · ${P_STATUS[p.status]}`}</div></td>
                    <td className="px-2 py-2 font-mono text-xs" dir="ltr">{p.code || "—"}</td>
                    <td className="px-2 py-2"><span className={`${pill} ${p.priority === "high" ? "bg-red-50 text-red-700" : p.priority === "low" ? "bg-vault-50 text-muted" : "bg-amber-50 text-amber-700"}`}>{PRIO[p.priority]}</span></td>
                    <td className="px-2 py-2 text-xs">{nx ? `${ci + 1}. ${T(nx.title)}` : "همه مراحل"}</td>
                    <td className="w-28 px-2 py-2"><Bar value={progress(p)} tone={h === "late" ? C.bad : h === "risk" ? C.warn : undefined} /><span className="font-mono text-xs">{progress(p)}%</span></td>
                    <td className={`px-2 py-2 font-mono text-xs font-bold ${v < -15 ? "text-red-700" : v < -5 ? "text-amber-700" : "text-emerald-700"}`} dir="ltr" style={{ textAlign: "right" }}>{v > 0 ? "+" : ""}{v}%</td>
                    <td className="px-2 py-2 text-xs">{nx ? <>{fmt(nx.due)}{daysTo(nx.due) < 0 && <span className={`${pill} mr-1 bg-red-50 text-red-700`}>{-daysTo(nx.due)} روز</span>}</> : "—"}</td>
                    <td className="px-2 py-2 text-xs">{fmt(p.target)}</td>
                    <td className="px-2 py-2">{or.length ? <span className={`${pill} ${or.some((r) => riskScore(r) >= 15) ? "bg-red-50 text-red-700" : "bg-vault-50 text-muted"}`}>{or.length}</span> : "—"}</td>
                  </tr>
                );
              })}
              {!ps.length && <tr><td colSpan={10} className="py-8 text-center text-sm text-muted">هنوز پروژه‌ای ثبت نشده است. هر پروژه 9 مرحله استاندارد Stage-gate دارد، از اعلام به R&D تا بچ صنعتی.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/** A member's start page: their unit's tasks across projects, and nothing of the other units. */
function Member({ locale, ps, access }: { locale: Locale; ps: Project[]; access: Access }) {
  const unit = access.unit!;
  const go = (id: string) => `${rndHref(locale, "project")}?id=${id}`;
  const rows = ps.filter(isOpen).map((p) => {
    const items = p.stages.flatMap((s) => s.items.map((it) => ({ it, due: it.due || s.due })));
    const open = items.filter((x) => !x.it.done).sort((a, b) => (a.due < b.due ? -1 : 1));
    return { p, total: items.length, done: items.length - open.length, over: open.filter((x) => daysTo(x.due) < 0).length, next: open[0] };
  }).filter((r) => r.total || r.p.purchases.length || r.p.methods.length || r.p.stability.length || r.p.trials.length || r.p.batches.length || r.p.docs.length || r.p.risks.length);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">پروژه‌هایی که واحد {UNITS[unit]} در آن‌ها کار دارد. با باز کردن هر پروژه فقط وظایف و ردیف‌های واحد خودتان را می‌بینید.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ p, total, done, over, next }) => (
          <Link key={p.id} href={go(p.id)} className={`${card} flex flex-col gap-3 transition hover:border-molecule-500`}>
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-bold text-vault-900">{T(p.name)}</div><div className="text-xs text-muted">{p.code && <span dir="ltr">{p.code} · </span>}مسئول: {p.lead || "—"} · هدف: {fmt(p.target)}</div></div>
              <span className={`${pill} ${p.priority === "high" ? "bg-red-50 text-red-700" : "bg-vault-50 text-muted"}`}>{PRIO[p.priority]}</span>
            </div>
            <div><div className="mb-1 flex justify-between text-xs text-muted"><span>وظایف واحد شما</span><span className="font-mono">{done} / {total}</span></div><Bar value={total ? (100 * done) / total : 0} tone={over ? C.bad : undefined} /></div>
            <div className="text-xs">{over ? <span className="font-bold text-red-700">{over} کار عقب‌افتاده</span> : next ? <span className="text-muted">کار بعدی: {T(next.it.t)} — {fmt(next.due)} ({when(daysTo(next.due))})</span> : <span className="text-emerald-700">کار بازی نمانده است.</span>}</div>
          </Link>
        ))}
      </div>
      {!rows.length && <p className={`${card} text-center text-sm text-muted`}>فعلاً در هیچ پروژه‌ای کاری به واحد شما داده نشده است.</p>}
      <Legend items={[[null, "سطح دسترسی شما را مدیر پروژه تعیین می‌کند."]]} />
    </div>
  );
}

async function Workspace({ locale }: { locale: Locale }) {
  const { access, urgent } = await requireAccess(locale, rndHref(locale));
  const ps = (await loadProjects()).map((p) => filterProject(p, access));
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="home">
      {access.role === "member" ? <Member locale={locale} ps={ps} access={access} /> : <Owner locale={locale} ps={ps} access={access} />}
    </RndFrame>
  );
}

export default async function RndPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Workspace locale={locale} />
    </Suspense>
  );
}
