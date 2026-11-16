import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loading, accountMetadata } from "@/components/account/shell";
import { fmt } from "@/components/rnd/charts";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { PrintStyle, Sheet, SheetBar, SheetTitle, Stat } from "@/components/rnd/report";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import {
  CHECK_V, GATE, P_TYPE, RACI_UNITS, T, UNITS, gateChecks, gateFacts, isGateStage, raciRow, today,
  type Project, type Stage,
} from "@/lib/rnd/model";
import { loadProject } from "@/lib/rnd/server";

export const generateMetadata = () => accountMetadata(rndTitle);

type Search = Promise<Record<string, string | string[] | undefined>>;
const ANSWER = Object.fromEntries(CHECK_V);
const empty = (v?: string) => (v && v.trim() ? T(v) : <span className="text-muted">—</span>);

/** The minutes of one gate meeting on an A4 sheet, ready to sign: facts, checklist, discussion, decision, actions. */
function Minutes({ p, s }: { p: Project; s: Stage }) {
  const g = s.gate, f = gateFacts(p, s), checks = gateChecks(s);
  const gateItem = s.items.find((i) => i.gate);
  const row = raciRow(p, s.key);
  const accountable = RACI_UNITS.filter((u) => row[u] === "A" || row[u] === "AR").map((u) => UNITS[u]);
  const cell = "border border-line px-2 py-[3px] align-top";
  return (
    <Sheet>
      <header className="mb-2.5 flex items-start justify-between gap-4 border-b-2 border-vault-900 pb-1.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-molecule-700">صورت‌جلسه بازبینی Gate</p>
          <h1 className="text-[17px] font-extrabold leading-7 text-vault-900">{gateItem ? T(gateItem.t) : T(s.title)}</h1>
          <p className="text-muted">
            پروژه: {T(p.name)}{p.code && <> · <bdi dir="ltr" className="font-mono">{p.code}</bdi></>} · {P_TYPE[p.type]} · فاز: {T(s.title)}
          </p>
          <p className="text-muted">مسئول پروژه: {p.lead ? T(p.lead) : "—"}{accountable.length ? ` · پاسخگوی فاز (RACI): ${accountable.join("، ")}` : ""}</p>
        </div>
        <div className="shrink-0 text-left text-[10px] text-muted">
          <p>تاریخ جلسه: <bdi dir="ltr" className="font-mono">{g.meet ? fmt(g.meet) : "—"}</bdi></p>
          <p>تاریخ چاپ: <bdi dir="ltr" className="font-mono">{fmt(today())}</bdi></p>
        </div>
      </header>

      <section className="mb-2.5">
        <p><b>حاضران:</b> {empty(g.attendees)}</p>
      </section>

      <section className="mb-2.5 grid grid-cols-4 gap-2">
        <Stat label="فعالیت‌های انجام‌شده" value={`${f.done} / ${f.total}`} tone={f.done < f.total ? "warn" : "ok"} />
        <Stat label="خروجی‌های باقی‌مانده" value={f.outs.length} tone={f.outs.length ? "warn" : "ok"} />
        <Stat label="فعالیت عقب‌افتاده" value={f.late} tone={f.late ? "bad" : "ok"} />
        <Stat label="ریسک بالای باز" value={f.highRisks} tone={f.highRisks ? "bad" : "ok"} />
      </section>

      <section className="rnd-keep mb-2.5">
        <SheetTitle aside={`${checks.filter((c) => c.v).length} از ${checks.length} پاسخ داده شده`}>چک‌لیست Gate</SheetTitle>
        <table className="w-full border-collapse">
          <thead><tr className="bg-vault-50 text-right text-[10px] text-muted"><th className={`${cell} w-6`}>#</th><th className={cell}>پرسش</th><th className={`${cell} w-16`}>پاسخ</th><th className={`${cell} w-[38%]`}>توضیح یا شاهد</th></tr></thead>
          <tbody>
            {checks.map((c, i) => (
              <tr key={c.k}>
                <td className={`${cell} font-mono`}>{i + 1}</td>
                <td className={cell}>{T(c.t)}</td>
                <td className={`${cell} font-semibold ${c.v === "no" ? "text-red-700" : c.v === "yes" ? "text-emerald-700" : "text-muted"}`}>{ANSWER[c.v] ?? "—"}</td>
                <td className={cell}>{c.note ? T(c.note) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rnd-keep mb-2.5 grid grid-cols-2 gap-3">
        <div><SheetTitle>خلاصه بحث</SheetTitle><p className="min-h-10 whitespace-pre-line">{empty(g.summary)}</p></div>
        <div><SheetTitle>شرایط تصمیم</SheetTitle><p className="min-h-10 whitespace-pre-line">{empty(g.cond)}</p></div>
      </section>

      <section className="rnd-keep mb-2.5 rounded-lg border border-vault-900/30 bg-paper px-3 py-2">
        <p className="text-[12px]"><b>تصمیم کمیته:</b> <span className={`font-extrabold ${g.decision === "go" ? "text-emerald-700" : g.decision === "nogo" ? "text-red-700" : g.decision === "hold" ? "text-amber-700" : "text-muted"}`}>{GATE[g.decision]}</span></p>
        <p>تصمیم‌گیرنده: {empty(g.by)} · تاریخ تصمیم: <bdi dir="ltr" className="font-mono">{g.date ? fmt(g.date) : "—"}</bdi></p>
        {g.note && <p>شرح: {T(g.note)}</p>}
      </section>

      <section className="rnd-keep mb-2.5">
        <SheetTitle>اقدامات مصوب</SheetTitle>
        {(g.actions ?? []).length ? (
          <table className="w-full border-collapse">
            <thead><tr className="bg-vault-50 text-right text-[10px] text-muted"><th className={`${cell} w-6`}>#</th><th className={cell}>اقدام</th><th className={`${cell} w-32`}>مسئول</th><th className={`${cell} w-24`}>موعد</th><th className={`${cell} w-16`}>وضعیت</th></tr></thead>
            <tbody>
              {g.actions!.map((a, i) => (
                <tr key={a.id}>
                  <td className={`${cell} font-mono`}>{i + 1}</td>
                  <td className={cell}>{T(a.t)}</td>
                  <td className={cell}>{a.who ? T(a.who) : "—"}</td>
                  <td className={cell}><bdi dir="ltr" className="font-mono">{a.due ? fmt(a.due) : "—"}</bdi></td>
                  <td className={cell}>{a.done ? "انجام شد" : "باز"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted">اقدامی ثبت نشده است.</p>}
      </section>

      <section className="rnd-keep mt-5 grid grid-cols-3 gap-4 text-center text-[10.5px]">
        {["مدیر پروژه", "تضمین کیفیت (QA)", "مدیر تحقیق و توسعه"].map((r) => (
          <div key={r}><div className="mb-1 h-10 border-b border-dashed border-vault-900/40" />{r}<br /><span className="text-muted">نام، امضا و تاریخ</span></div>
        ))}
      </section>

      <footer className="mt-4 flex justify-between border-t border-line pt-1.5 text-[9.5px] text-muted">
        <span>این صورت‌جلسه از داده‌های ثبت‌شده در سامانه مدیریت پروژه‌های تحقیق و توسعه تهیه شده است.</span>
        <span>محرمانه — فقط برای استفاده داخلی</span>
      </footer>
    </Sheet>
  );
}

async function Page({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const q = await searchParams;
  const id = String(q.id ?? ""), key = String(q.s ?? "");
  const { access, urgent } = await requireAccess(locale, `${rndHref(locale, "gate")}?id=${encodeURIComponent(id)}&s=${encodeURIComponent(key)}`);
  // Gate minutes hold the committee's discussion: for the owner and managers only, like the report.
  if (access.role === "member") notFound();
  const p = await loadProject(id);
  const s = p?.stages.find((x) => x.key === key);
  if (!p || !s || !isGateStage(s)) notFound();
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="project">
      <PrintStyle />
      <SheetBar back={`${rndHref(locale, "project")}?id=${p.id}`} backLabel="بازگشت به پروژه" />
      <Minutes p={p} s={s} />
    </RndFrame>
  );
}

export default async function RndGatePage({ searchParams }: { searchParams: Search }) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Page locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
