import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loading, accountMetadata } from "@/components/account/shell";
import { Bar, C, fmt } from "@/components/rnd/charts";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { PrintStyle, Sheet, SheetBar, SheetTitle, Stat, when } from "@/components/rnd/report";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import {
  DAY, EV_KIND, HEALTH, T, UNITS, actualAt, alertsOf, daysTo, health, isOpen, ms, nowMs, plannedAt, progress, sv, toISO, today,
  type Unit,
} from "@/lib/rnd/model";
import { activitySince, loadProjects } from "@/lib/rnd/server";

export const generateMetadata = () => accountMetadata(rndTitle);

type Search = Promise<Record<string, string | string[] | undefined>>;
const PERIODS = [7, 14, 30];
const MAX = 12;

function More({ n }: { n: number }) {
  return n > MAX ? <p className="pt-0.5 text-[10px] text-muted">و {n - MAX} مورد دیگر</p> : null;
}

async function Weekly({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const asked = Number((await searchParams).days);
  const days = PERIODS.includes(asked) ? asked : 7;
  const { access, urgent } = await requireAccess(locale, `${rndHref(locale, "weekly")}${days === 7 ? "" : `?days=${days}`}`);
  // Every unit's work in one place: for the owner and managers only.
  if (access.role === "member") notFound();
  const [all, activity] = await Promise.all([loadProjects(), activitySince(days).catch(() => [])]);
  const ps = all.filter(isOpen), now = nowMs();
  const inPeriod = (iso?: string) => { const d = daysTo(iso); return d <= 0 && d > -days; };
  const go = (id: string) => `${rndHref(locale, "project")}?id=${id}`;

  const done = ps.flatMap((p) => p.stages.flatMap((s) => s.items.filter((i) => i.done && inPeriod(i.doneAt)).map((it) => ({ p, s, it })))).sort((a, b) => (a.it.doneAt! < b.it.doneAt! ? 1 : -1));
  const alerts = ps.flatMap((p) => alertsOf(p, null, 7));
  const overdue = alerts.filter((a) => a.d < 0), coming = alerts.filter((a) => a.d >= 0);
  const events = ps.flatMap((p) => p.events.filter((e) => (e.kind === "decision" || e.kind === "issue") && inPeriod(e.date)).map((e) => ({ p, e }))).sort((a, b) => b.e.at - a.e.at);
  const rows = ps.map((p) => ({
    p, h: health(p), pc: progress(p), plan: Math.round(plannedAt(p, now)), v: sv(p),
    gain: Math.round(actualAt(p, now) - actualAt(p, now - days * DAY)),
    done: done.filter((d) => d.p.id === p.id).length, over: overdue.filter((a) => a.project === p.id).length,
  })).sort((a, b) => a.v - b.v);
  const units = (Object.keys(UNITS) as Unit[]).map((u) => ({
    u, done: done.filter((d) => d.it.unit === u), over: overdue.filter((a) => a.unit === u), coming: coming.filter((a) => a.unit === u),
  })).filter((x) => x.done.length || x.over.length || x.coming.length);
  const line = "flex items-start justify-between gap-2 border-b border-line/70 py-[3px] last:border-0";
  const TAG = { late: ["موعد گذشته", "bg-red-50 text-red-700"], soon: ["پیش رو", "bg-amber-50 text-amber-700"], done: ["انجام شد", "bg-emerald-50 text-emerald-700"] } as const;
  /** One line of a unit's list: what it is, which project, and when. */
  const row = (kind: keyof typeof TAG, text: string, project: string, at: string, key: string) => (
    <div key={key} className="rnd-keep grid grid-cols-[4.2rem_minmax(0,1fr)_5.2rem] items-start gap-2 border-b border-line/70 py-[3px] last:border-0">
      <span className={`rounded-full px-1.5 text-center text-[10px] font-bold ${TAG[kind][1]}`}>{TAG[kind][0]}</span>
      <span className="min-w-0">{text} <span className="text-muted">· {T(project)}</span></span>
      <span className={`whitespace-nowrap text-left ${kind === "late" ? "font-bold text-red-700" : "text-muted"}`}>{kind === "done" ? <bdi dir="ltr" className="font-mono text-[10.5px]">{at}</bdi> : at}</span>
    </div>
  );
  const from = toISO(new Date(ms(today()) - (days - 1) * DAY));

  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="weekly">
      <PrintStyle />
      <SheetBar back={rndHref(locale)} backLabel="همه پروژه‌ها">
        <span className="text-xs text-muted">دوره:</span>
        {PERIODS.map((d) => (
          <Link key={d} href={`${rndHref(locale, "weekly")}${d === 7 ? "" : `?days=${d}`}`} aria-current={d === days ? "true" : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${d === days ? "border-vault-900 bg-vault-900 text-white" : "border-line bg-white text-vault-900 hover:border-molecule-500"}`}>
            {d} روز گذشته
          </Link>
        ))}
      </SheetBar>
      <Sheet>
        <header className="mb-3 flex items-end justify-between gap-4 border-b-2 border-vault-900 pb-2">
          <div>
            <p className="text-[10px] font-semibold text-molecule-700">پروژه‌های تحقیق و توسعه</p>
            <h1 className="text-[18px] font-extrabold leading-7 text-vault-900">{days === 7 ? "خلاصه هفتگی" : `خلاصه ${days} روز گذشته`}</h1>
          </div>
          <p className="text-[10.5px] text-muted">از <bdi dir="ltr" className="font-mono">{fmt(from)}</bdi> تا <bdi dir="ltr" className="font-mono">{fmt(today())}</bdi> · {ps.length} پروژه در جریان</p>
        </header>

        <section className="mb-3 grid grid-cols-6 gap-2">
          <Stat label="کارهای انجام‌شده" value={done.length} sub={`در ${days} روز گذشته`} tone={done.length ? "ok" : ""} />
          <Stat label="موعدهای گذشته" value={overdue.length} sub="تا امروز" tone={overdue.length ? "bad" : "ok"} />
          <Stat label="موعدهای پیش رو" value={coming.length} sub="7 روز آینده" tone={coming.length ? "warn" : ""} />
          <Stat label="مشکلات ثبت‌شده" value={events.filter((x) => x.e.kind === "issue").length} sub="در این دوره" tone={events.some((x) => x.e.kind === "issue") ? "warn" : ""} />
          <Stat label="تصمیم‌ها" value={events.filter((x) => x.e.kind === "decision").length} sub="در این دوره" />
          <Stat label="عقب از برنامه" value={rows.filter((r) => r.h === "late").length} sub={`${rows.filter((r) => r.h === "risk").length} در معرض تأخیر`} tone={rows.some((r) => r.h === "late") ? "bad" : rows.some((r) => r.h === "risk") ? "warn" : "ok"} />
        </section>

        <section className="rnd-keep mb-4">
          <SheetTitle aside="مرتب از بیشترین عقب‌ماندگی">وضعیت پروژه‌ها</SheetTitle>
          <table className="w-full border-collapse">
            <thead>
              <tr className="whitespace-nowrap text-right text-[10px] text-muted">
                <th className="pb-1 font-semibold">پروژه</th><th className="px-2 pb-1 font-semibold">سلامت</th><th className="w-32 px-2 pb-1 font-semibold">پیشرفت</th>
                <th className="px-2 pb-1 font-semibold">رشد در دوره</th><th className="px-2 pb-1 font-semibold">انحراف از برنامه</th><th className="px-2 pb-1 font-semibold">انجام‌شده</th><th className="ps-2 pb-1 font-semibold">موعد گذشته</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.p.id} className="border-t border-line/70">
                  <td className="py-[3px]"><Link href={go(r.p.id)} className="font-bold text-vault-900">{T(r.p.name)}</Link>{r.p.lead ? <span className="text-muted"> · {T(r.p.lead)}</span> : null}</td>
                  <td className="whitespace-nowrap px-2 py-[3px]"><span className="inline-flex items-center gap-1"><i className="size-2 rounded-full" style={{ background: HEALTH[r.h].color }} />{HEALTH[r.h].label}</span></td>
                  <td className="px-2 py-[3px]"><span className="flex items-center gap-1.5"><Bar value={r.pc} plan={r.plan} tone={r.h === "late" ? C.bad : r.h === "risk" ? C.warn : undefined} /><span className="w-8 shrink-0 font-mono text-[10.5px]" dir="ltr">{r.pc}%</span></span></td>
                  <td className={`px-2 py-[3px] font-mono font-bold ${r.gain > 0 ? "text-emerald-700" : "text-muted"}`}><bdi dir="ltr">{r.gain > 0 ? `+${r.gain}%` : "0%"}</bdi></td>
                  <td className={`px-2 py-[3px] font-mono font-bold ${r.v < -15 ? "text-red-700" : r.v < -5 ? "text-amber-700" : "text-emerald-700"}`}><bdi dir="ltr">{r.v > 0 ? "+" : ""}{r.v}%</bdi></td>
                  <td className="px-2 py-[3px] font-mono">{r.done}</td>
                  <td className={`ps-2 py-[3px] font-mono ${r.over ? "font-bold text-red-700" : ""}`}>{r.over}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} className="py-3 text-center text-muted">پروژه در جریانی وجود ندارد.</td></tr>}
            </tbody>
          </table>
          <p className="mt-1 text-[10px] text-muted">رشد در دوره: افزایش پیشرفت وزنی پروژه در {days} روز گذشته. خط تیره روی نوار پیشرفت، جایی است که پروژه طبق برنامه باید باشد.</p>
        </section>

        {units.map(({ u, done: d, over, coming: c }) => (
          <section key={u} className="mb-3.5">
            <SheetTitle aside={`${over.length} موعد گذشته · ${c.length} موعد پیش رو · ${d.length} انجام‌شده`}>واحد {UNITS[u]}</SheetTitle>
            {over.slice(0, MAX).map((a, i) => row("late", a.text, a.projectName, `${-a.d} روز تأخیر`, `o${i}`))}
            <More n={over.length} />
            {c.slice(0, MAX).map((a, i) => row("soon", a.text, a.projectName, when(a.d), `c${i}`))}
            <More n={c.length} />
            {d.slice(0, MAX).map(({ p, s, it }) => row("done", `${T(it.t)} (${T(s.title)})`, p.name, fmt(it.doneAt), it.id))}
            <More n={d.length} />
          </section>
        ))}
        {!units.length && <p className="mb-4 text-muted">در این دوره کاری انجام نشده و موعدی هم در پیش نیست.</p>}

        <div className="grid grid-cols-[1.4fr_1fr] gap-5">
          <section className="rnd-keep">
            <SheetTitle>تصمیم‌ها و مشکلات این دوره ({events.length})</SheetTitle>
            {events.slice(0, 20).map(({ p, e }) => (
              <div key={e.id} className={line}>
                <span className="min-w-0"><b className={e.kind === "issue" ? "text-red-700" : "text-molecule-700"}>{EV_KIND[e.kind]}</b> <span className="text-muted">· {T(p.name)}{e.by ? ` · ${T(e.by)}` : ""}:</span> {T(e.text)}</span>
                <bdi dir="ltr" className="shrink-0 font-mono text-[10.5px] text-muted">{fmt(e.date)}</bdi>
              </div>
            ))}
            {!events.length && <p className="text-muted">در این دوره تصمیم یا مشکلی ثبت نشده است.</p>}
          </section>
          <section className="rnd-keep">
            <SheetTitle aside="تعداد تغییرات ثبت‌شده">فعالیت اعضا</SheetTitle>
            {activity.map((a, i) => (
              <div key={i} className={line}>
                <span className="min-w-0">{T(a.name)} <span className="text-muted">· {a.role === "owner" ? "مدیر پروژه‌ها" : a.role === "manager" ? "مدیر" : UNITS[a.unit as Unit] ?? a.unit}</span></span>
                {a.actions ? <span className="shrink-0 font-mono font-bold">{a.actions}</span> : <span className="shrink-0 text-red-700">بدون فعالیت</span>}
              </div>
            ))}
            {!activity.length && <p className="text-muted">هنوز عضوی دسترسی ندارد.</p>}
          </section>
        </div>

        <footer className="mt-4 flex justify-between border-t border-line pt-1.5 text-[9.5px] text-muted">
          <span>تهیه‌شده از داده‌های ثبت‌شده در سامانه مدیریت پروژه‌های تحقیق و توسعه، در تاریخ <bdi dir="ltr" className="font-mono">{fmt(today())}</bdi>.</span>
          <span>محرمانه — فقط برای استفاده داخلی</span>
        </footer>
      </Sheet>
    </RndFrame>
  );
}

export default async function RndWeeklyPage({ searchParams }: { searchParams: Search }) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Weekly locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
