"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { rndApply, rndAudit, rndDelete, rndGet, type AuditRow } from "@/lib/rnd/actions";
import {
  EV_KIND, GATE, HEALTH, LISTS, P_STATUS, P_TYPE, PRIO, STABILITY_UNIT, STAB_TPL, T, UNITS, MEMBER_UNITS,
  addMonths, nowMs, alertsOf, curStage, daysTo, health, ms, plannedAt, progress, riskScore, spent, stagePct, stageStart, sv, today,
  type Item, type ListKey, type Project, type Role, type Row, type Stage, type Study, type Unit,
} from "@/lib/rnd/model";
import type { Op } from "@/lib/rnd/server";
import { saveBlob } from "@/lib/doc-export";
import { fromJalali, maskJalali, toJalali } from "@/lib/rnd/jalali";
import { Bar, C, Donut, RiskHeat, SCurve, Trend, fmt } from "./charts";

export type Viewer = { role: Role; unit: Unit | null; name: string };

const pill = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold";
const btn = "inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-vault-900 transition hover:border-molecule-500 disabled:opacity-50";
const inp = "w-full rounded-md border border-line bg-white px-2 py-1 text-sm focus:border-molecule-500 focus:outline-none disabled:bg-vault-50 disabled:text-muted";
const panel = "min-w-0 rounded-card border border-line bg-white p-4 sm:p-5";
const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);
const tone = (d: number) => (d < 0 ? "border-red-300 bg-red-50" : d <= 3 ? "border-amber-300 bg-amber-50" : "border-line bg-white");

/**
 * A date, read and typed in the Solar Hijri calendar (1405/08/29) and stored as a Gregorian ISO date.
 * It saves when the field is left; a value that is not a real date is marked and not saved.
 */
function DateCell({ value, onSave, disabled, label, className = "" }: { value: unknown; onSave: (v: string) => void; disabled?: boolean; label: string; className?: string }) {
  const iso = value ? String(value) : "", shown = toJalali(iso);
  const [bad, setBad] = useState(false);
  return (
    <input key={shown} className={`${inp} font-mono ${bad ? "!border-red-400 !text-red-700" : ""} ${className}`} dir="ltr" inputMode="numeric" defaultValue={shown} disabled={disabled}
      placeholder="تاریخ شمسی" aria-label={`${label} (تاریخ شمسی)`} aria-invalid={bad} title={bad ? "تاریخ معتبر نیست. نمونه: 1405/08/29" : "تاریخ شمسی: سال/ماه/روز"}
      onChange={(e) => { e.target.value = maskJalali(e.target.value); if (bad) setBad(false); }}
      onBlur={(e) => {
        const t = e.target.value.trim();
        if (t === shown) return;
        if (!t) return onSave("");
        const g = fromJalali(t);
        if (!g) return setBad(true);
        if (g === iso) e.target.value = shown; else onSave(g);
      }}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
  );
}

/** A text field that saves when it loses focus (or on Enter), and only when its value changed. */
function Cell({ value, onSave, type = "text", ltr, disabled, label, placeholder, className = "" }: { value: unknown; onSave: (v: string) => void; type?: string; ltr?: boolean; disabled?: boolean; label: string; placeholder?: string; className?: string }) {
  if (type === "date") return <DateCell value={value} onSave={onSave} disabled={disabled} label={label} className={className} />;
  const v = value == null ? "" : String(value);
  return (
    <input key={v} className={`${inp} ${className}`} type={type} dir={ltr || type === "number" ? "ltr" : undefined} defaultValue={v} disabled={disabled} aria-label={label} placeholder={placeholder}
      step={type === "number" ? "any" : undefined}
      onBlur={(e) => e.target.value !== v && onSave(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
  );
}
function Select({ value, options, onSave, disabled, label, className = "" }: { value: unknown; options: Record<string, string>; onSave: (v: string) => void; disabled?: boolean; label: string; className?: string }) {
  return (
    <select className={`${inp} ${className}`} value={String(value ?? "")} disabled={disabled} aria-label={label} onChange={(e) => onSave(e.target.value)}>
      {Object.entries(options).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}
function Panel({ title, aside, children, className = "" }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`${panel} ${className}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-vault-900">{title}</h2>
        {aside && <div className="text-xs text-muted">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
const UnitTag = ({ u }: { u: Unit }) => <span className={`${pill} bg-vault-50 text-vault-800`}>{UNITS[u]}</span>;
function Kpi({ label, value, tone: t = "" }: { label: string; value: ReactNode; tone?: "" | "ok" | "warn" | "bad" }) {
  const c = t === "bad" ? "text-red-700" : t === "warn" ? "text-amber-700" : t === "ok" ? "text-emerald-700" : "text-vault-900";
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2">
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-mono text-xl font-extrabold ${c}`} dir="ltr" style={{ textAlign: "right" }}>{value}</div>
    </div>
  );
}

function csv(p: Project, key: ListKey) {
  const L = LISTS[key], q = (x: unknown) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const head = [...L.cols.map((c) => c.l), "واحد"].map(q).join(",");
  const rows = (p[key] as Row[]).map((r) => [...L.cols.map((c) => (c.t === "calc" ? riskScore(r) : c.o ? c.o[String(r[c.k])] ?? r[c.k] : r[c.k])), UNITS[r.unit]].map(q).join(","));
  saveBlob(new Blob(["﻿" + [head, ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" }), `${p.code || "project"}-${key}.csv`);
}

type Tab = "overview" | "stages" | ListKey | "stability" | "budget" | "log";

export function ProjectView({ initial, viewer, homeHref, reportHref }: { initial: Project; viewer: Viewer; homeHref: string; reportHref?: string }) {
  const [p, setP] = useState(initial);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const owner = viewer.role === "owner", member = viewer.role === "member";
  const mine = useCallback((u: Unit) => owner || (member && viewer.unit === u), [owner, member, viewer.unit]);

  const send = useCallback(async (ops: Op[]) => {
    setBusy(true); setErr("");
    const r = await rndApply(p.id, ops).catch(() => ({ ok: false as const, error: "unavailable" as const }));
    setBusy(false);
    if (r.ok) { setP(r.project); setSaved(Date.now()); }
    else setErr(r.error === "denied" ? "این تغییر در محدوده دسترسی شما نیست." : r.error === "signin" ? "نشست شما پایان یافته یا دسترسی شما لغو شده است. صفحه را دوباره باز کنید." : r.error === "invalid" ? "مقدار واردشده معتبر نیست." : "ذخیره انجام نشد. اتصال را بررسی و دوباره امتحان کنید.");
  }, [p.id]);

  // Others save too: refresh every minute while the page is visible and nobody is typing.
  useEffect(() => {
    const t = setInterval(async () => {
      if (document.hidden) return;
      const a = document.activeElement;
      if (a && root.current?.contains(a) && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT")) return;
      const r = await rndGet(p.id).catch(() => null);
      if (r?.ok) setP(r.project);
    }, 60_000);
    return () => clearInterval(t);
  }, [p.id]);

  const h = health(p), pc = progress(p), plv = Math.round(plannedAt(p, nowMs())), v = sv(p);
  const myItems = useMemo(() => p.stages.flatMap((s) => s.items.map((it) => ({ ...it, s }))).filter((x) => !member || x.unit === viewer.unit), [p, member, viewer.unit]);
  const myDone = myItems.filter((x) => x.done).length;
  const myOver = myItems.filter((x) => !x.done && daysTo(x.due || x.s.due) < 0).length;

  const tabs: [Tab, string, number][] = (
    [
      ["overview", "نمای کلی", 0],
      ["stages", member ? "وظایف من" : "مراحل و Gate", myItems.filter((x) => !x.done).length],
      ["trials", "فرمولاسیون", p.trials.length],
      ["methods", "آنالیز", p.methods.length],
      ["stability", "پایداری", p.stability.length],
      ["purchases", "خرید مواد", p.purchases.length],
      ["batches", "بچ‌ها", p.batches.length],
      ["risks", "ریسک‌ها", p.risks.filter((r) => r.status !== "closed").length],
      ["docs", "اسناد", p.docs.length],
      ["budget", "بودجه", p.costs.length],
      ["log", "تاریخچه", p.events.length],
    ] as [Tab, string, number][]
  ).filter(([k, , n]) => {
    if (!member) return true;
    if (k === "budget") return false;
    if (k === "stability") return viewer.unit === STABILITY_UNIT;
    if (k in LISTS) return n > 0 || LISTS[k as ListKey].unit === viewer.unit;
    return true;
  });

  return (
    <div ref={root} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap gap-2">
          <a href={homeHref} className={btn}>→ همه پروژه‌ها</a>
          {reportHref && <a href={reportHref} className={btn}>گزارش وضعیت (چاپ یا PDF)</a>}
        </span>
        <span className="text-xs text-muted" aria-live="polite">{busy ? "در حال ذخیره…" : err ? "" : saved ? "ذخیره شد" : ""}</span>
      </div>
      {err && <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}

      <section className={`${panel} flex flex-wrap items-center justify-between gap-4`}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold text-vault-900 sm:text-2xl">{T(p.name)}</h1>
            <span className={`${pill} ${HEALTH[h].tone}`}><i className="size-2 rounded-full" style={{ background: HEALTH[h].color }} />{HEALTH[h].label}</span>
            {member && viewer.unit && <span className={`${pill} bg-molecule-50 text-molecule-700`}>نمای واحد {UNITS[viewer.unit]}</span>}
          </div>
          <p className="mt-1 text-sm text-muted">
            {p.code && <span className="font-mono" dir="ltr">{p.code}</span>}{p.code && " · "}{P_TYPE[p.type]} · اولویت {PRIO[p.priority]} · مسئول: {p.lead ? T(p.lead) : "—"} · {fmt(p.start)} تا {fmt(p.target)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {member ? (
              <>
                <Kpi label="وظایف واحد شما" value={`${myDone} / ${myItems.length}`} />
                <Kpi label="وظایف عقب‌افتاده" value={myOver} tone={myOver ? "bad" : "ok"} />
                <Kpi label="پیشرفت کل پروژه" value={`${p.overall ?? pc}%`} />
                <Kpi label="روز تا تاریخ هدف" value={p.target ? daysTo(p.target) : "—"} tone={p.target && daysTo(p.target) < 0 ? "bad" : ""} />
              </>
            ) : (
              <>
                <Kpi label="پیشرفت واقعی" value={`${pc}%`} />
                <Kpi label="طبق برنامه تا امروز" value={`${plv}%`} />
                <Kpi label="انحراف از برنامه" value={`${v > 0 ? "+" : ""}${v}%`} tone={v < -15 ? "bad" : v < -5 ? "warn" : "ok"} />
                <Kpi label="روز تا تاریخ هدف" value={p.target ? daysTo(p.target) : "—"} tone={p.target && daysTo(p.target) < 0 ? "bad" : ""} />
                <Kpi label="هزینه از بودجه" value={p.budget ? `${Math.round((100 * spent(p)) / p.budget)}%` : "—"} tone={p.budget && spent(p) > p.budget ? "bad" : ""} />
              </>
            )}
          </div>
        </div>
        <Donut parts={[{ v: member ? (myItems.length ? (100 * myDone) / myItems.length : 0) : pc, c: pc >= 100 ? C.ok : C.accent }, { v: member ? (myItems.length ? 100 - (100 * myDone) / myItems.length : 100) : 100 - pc, c: C.track }]}
          center={member ? `${myItems.length ? Math.round((100 * myDone) / myItems.length) : 0}%` : `${pc}%`} sub={member ? "وظایف شما" : "تکمیل"} size={124} />
      </section>
      {member && <p className="text-xs text-muted">در این صفحه فقط وظایف، ردیف‌ها و رویدادهای واحد شما نمایش داده می‌شود. پیشرفت کل پروژه را مدیر پروژه بر اساس کار همه واحدها محاسبه می‌کند.</p>}

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1" role="tablist">
        {tabs.map(([k, l, n]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition ${tab === k ? "border-molecule-600 text-molecule-700" : "border-transparent text-muted hover:text-vault-900"}`}>
            {l}{n > 0 && <span className="mr-1.5 rounded-full bg-vault-50 px-1.5 font-mono text-xs">{n}</span>}
          </button>
        ))}
      </nav>

      {tab === "overview" && <Overview p={p} viewer={viewer} mine={mine} send={send} setTab={setTab} homeHref={homeHref} />}
      {tab === "stages" && <Stages p={p} viewer={viewer} mine={mine} send={send} />}
      {tab === "risks" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="ماتریس ریسک (5×5)" aside="امتیاز = شدت × احتمال"><RiskHeat risks={p.risks} /></Panel>
          <Panel title="راهنمای امتیاز">
            <ul className="space-y-1.5 text-sm">
              <li><span className={`${pill} bg-red-50 font-mono text-red-700`}>15–25</span> بالا: اقدام فوری و بررسی در Gate بعدی.</li>
              <li><span className={`${pill} bg-amber-50 font-mono text-amber-700`}>8–12</span> متوسط: اقدام کاهش ریسک با مسئول و موعد.</li>
              <li><span className={`${pill} bg-emerald-50 font-mono text-emerald-700`}>1–6</span> پایین: پایش.</li>
              <li className="text-xs text-muted">ارزیابی بر پایه ICH Q9(R1).</li>
            </ul>
          </Panel>
        </div>
      )}
      {tab in LISTS && <ListTable p={p} k={tab as ListKey} viewer={viewer} mine={mine} send={send} />}
      {tab === "stability" && <Stability p={p} canEdit={mine(STABILITY_UNIT)} send={send} />}
      {tab === "budget" && <Budget p={p} owner={owner} send={send} />}
      {tab === "log" && <Log p={p} viewer={viewer} send={send} />}
    </div>
  );
}

type Ctx = { p: Project; viewer: Viewer; mine: (u: Unit) => boolean; send: (ops: Op[]) => Promise<void> };

function TaskLine({ it, s, ctx, compact }: { it: Item; s: Stage; ctx: Ctx; compact?: boolean }) {
  const due = it.due || s.due, d = daysTo(due), over = !it.done && d < 0;
  return (
    <li className={`flex items-start gap-2 rounded-md px-2 py-1.5 ${over ? "bg-red-50" : ""}`}>
      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-molecule-600" checked={it.done} disabled={!ctx.mine(it.unit)} aria-label="انجام شد"
        onChange={(e) => ctx.send([{ op: "item", stage: s.key, item: it.id, done: e.target.checked }])} />
      <span className="min-w-0 flex-1 text-sm">
        <span className={it.done ? "text-muted line-through" : ""}>{T(it.t)}</span>
        <span className="block text-xs text-muted">{compact ? `${T(s.title)} · ` : ""}{UNITS[it.unit]}{it.owner ? ` · ${T(it.owner)}` : ""}</span>
      </span>
      <span className={`shrink-0 text-xs ${over ? "font-bold text-red-700" : "text-muted"}`}>{it.done ? fmt(it.doneAt) : over ? when(d) : fmt(due)}</span>
    </li>
  );
}

function Overview({ p, viewer, mine, send, setTab, homeHref }: Ctx & { setTab: (t: Tab) => void; homeHref: string }) {
  const ctx = { p, viewer, mine, send };
  const member = viewer.role === "member", owner = viewer.role === "owner";
  const tasks = p.stages.flatMap((s) => s.items.filter((i) => !i.done).map((it) => ({ it, s, due: it.due || s.due })));
  const over = tasks.filter((t) => daysTo(t.due) < 0).sort((a, b) => ms(a.due) - ms(b.due));
  const next = tasks.filter((t) => !(daysTo(t.due) < 0)).sort((a, b) => ms(a.due) - ms(b.due)).slice(0, 8);
  const others = alertsOf(p, member && viewer.unit ? [viewer.unit] : null, 45).filter((a) => a.kind !== "task");
  const ci = curStage(p);
  const meta = (k: string, label: string, ltr = false, type = "text") => (
    <label className="block text-xs text-muted">{label}
      <Cell value={(p as Record<string, unknown>)[k]} label={label} ltr={ltr} type={type} disabled={!owner} onSave={(v) => send([{ op: "meta", data: { [k]: v } }])} className="mt-1" />
    </label>
  );
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {member ? (
          <Panel title="پیشرفت وظایف واحد شما در هر مرحله">
            <div className="flex flex-col gap-2">
              {p.stages.filter((s) => s.items.length).map((s) => (
                <div key={s.key} className="grid grid-cols-[minmax(0,1fr)_40%_3rem] items-center gap-2 text-sm">
                  <span className="truncate">{T(s.title)}</span><Bar value={stagePct(s)} tone={stagePct(s) >= 100 ? C.ok : undefined} /><span className="font-mono text-xs">{Math.round(stagePct(s))}%</span>
                </div>
              ))}
              {!p.stages.some((s) => s.items.length) && <p className="text-sm text-muted">در این پروژه هنوز وظیفه‌ای به واحد شما داده نشده است.</p>}
            </div>
          </Panel>
        ) : (
          <Panel title="منحنی پیشرفت (S-curve)" aside="پیشرفت وزنی بر اساس حجم کار هر مرحله"><SCurve p={p} /></Panel>
        )}
        <Panel title={member ? "کارهای واحد شما" : "اقدامات"}>
          {over.length > 0 && (<><h3 className="mb-1 text-sm font-bold text-red-700">عقب‌افتاده ({over.length})</h3><ul className="mb-3">{over.slice(0, 8).map((t) => <TaskLine key={t.it.id} it={t.it} s={t.s} ctx={ctx} compact />)}</ul></>)}
          <h3 className="mb-1 text-sm font-bold text-vault-900">کارهای بعدی</h3>
          <ul>{next.map((t) => <TaskLine key={t.it.id} it={t.it} s={t.s} ctx={ctx} compact />)}</ul>
          {!next.length && !over.length && <p className="text-sm text-muted">کار بازی نمانده است.</p>}
          {others.length > 0 && (
            <>
              <h3 className="mb-1 mt-3 text-sm font-bold text-vault-900">پایداری، خرید و روش‌ها در 45 روز آینده</h3>
              <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto">
                {others.map((a, i) => <li key={i} className={`rounded-md border px-2 py-1 text-xs ${tone(a.d)}`}><b>{when(a.d)}</b> · {a.text}</li>)}
              </ul>
            </>
          )}
        </Panel>
      </div>
      <Panel title="مراحل" aside="برای جزئیات، روی هر مرحله بزنید">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {p.stages.map((s, i) => {
            const sp = Math.round(stagePct(s)), late = s.due && sp < 100 && daysTo(s.due) < 0, g = s.gate.decision;
            return (
              <button key={s.key} type="button" onClick={() => setTab("stages")}
                className={`flex flex-col gap-1 rounded-lg border p-2 text-right text-xs transition hover:border-molecule-500 ${i === ci ? "border-molecule-500 bg-molecule-50" : late ? "border-red-300" : "border-line"}`}>
                <span className="flex justify-between text-muted"><span>مرحله {i + 1}</span><span className="font-mono">{s.items.length ? `${sp}%` : "—"}</span></span>
                <span className="line-clamp-2 min-h-8 font-semibold text-vault-900">{T(s.title)}</span>
                <Bar value={sp} tone={sp >= 100 ? C.ok : late ? C.bad : undefined} />
                {g !== "pending" && <span className={`font-bold ${g === "go" ? "text-emerald-700" : g === "nogo" ? "text-red-700" : "text-amber-700"}`}>Gate: {g === "go" ? "Go" : g === "nogo" ? "No-go" : "Hold"}</span>}
              </button>
            );
          })}
        </div>
      </Panel>
      <Panel title="مشخصات پروژه" aside={owner ? "تغییرات با خروج از هر خانه ذخیره می‌شود" : "فقط مدیر پروژه می‌تواند ویرایش کند"}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {meta("name", "نام محصول")}{meta("code", "کد پروژه", true)}{meta("form", "شکل دارویی")}{meta("strength", "قدرت")}
          <label className="block text-xs text-muted">نوع پروژه<Select className="mt-1" value={p.type} options={P_TYPE} label="نوع پروژه" disabled={!owner} onSave={(v) => send([{ op: "meta", data: { type: v } }])} /></label>
          <label className="block text-xs text-muted">اولویت<Select className="mt-1" value={p.priority} options={PRIO} label="اولویت" disabled={!owner} onSave={(v) => send([{ op: "meta", data: { priority: v } }])} /></label>
          <label className="block text-xs text-muted">وضعیت<Select className="mt-1" value={p.status} options={P_STATUS} label="وضعیت" disabled={!owner} onSave={(v) => send([{ op: "meta", data: { status: v } }])} /></label>
          {meta("lead", "مسئول پروژه")}
          {!member && meta("requester", "درخواست‌دهنده")}{meta("market", "بازار هدف")}{meta("rld", "محصول مرجع (RLD)")}
          {!member && meta("team", "اعضای تیم")}
          {meta("start", "تاریخ اعلام به R&D", false, "date")}{meta("target", "تاریخ هدف", false, "date")}
        </div>
        {!member && (
          <label className="mt-3 block text-xs text-muted">شرح و یادداشت پروژه
            <textarea key={p.notes ?? ""} className={`${inp} mt-1`} rows={4} defaultValue={p.notes ?? ""} disabled={!owner} onBlur={(e) => e.target.value !== (p.notes ?? "") && send([{ op: "meta", data: { notes: e.target.value } }])} />
          </label>
        )}
        {owner && <ProjectAdmin p={p} homeHref={homeHref} />}
      </Panel>
    </>
  );
}

function ProjectAdmin({ p, homeHref }: { p: Project; homeHref: string }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
      <button type="button" className={btn} onClick={() => saveBlob(new Blob([JSON.stringify(p, null, 1)], { type: "application/json" }), `${p.code || p.id}.json`)}>خروجی JSON پروژه</button>
      {confirm ? (
        <>
          <span className="text-sm text-red-700">پروژه از همه فهرست‌ها حذف می‌شود.</span>
          <button type="button" className={`${btn} border-red-300 text-red-700`} onClick={async () => { const r = await rndDelete(p.id); if (r.ok) location.href = homeHref; }}>بله، حذف شود</button>
          <button type="button" className={btn} onClick={() => setConfirm(false)}>انصراف</button>
        </>
      ) : (
        <button type="button" className={`${btn} text-red-700`} onClick={() => setConfirm(true)}>حذف پروژه</button>
      )}
    </div>
  );
}

function Comments({ it, s, ctx }: { it: Item; s: Stage; ctx: Ctx }) {
  const [text, setText] = useState("");
  const can = ctx.viewer.role !== "member" || ctx.viewer.unit === it.unit;
  return (
    <div className="mt-2 rounded-md bg-paper p-2">
      {(it.comments ?? []).map((c, i) => (
        <p key={i} className="mb-1.5 text-xs"><b>{T(c.name)}</b> <span className="text-muted">({c.unit} · {fmt(new Date(c.at).toISOString().slice(0, 10))})</span>: {T(c.text)}</p>
      ))}
      {!(it.comments ?? []).length && <p className="mb-1.5 text-xs text-muted">یادداشتی ثبت نشده است.</p>}
      {can && (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { ctx.send([{ op: "comment", stage: s.key, item: it.id, text }]); setText(""); } }}>
          <input className={inp} value={text} onChange={(e) => setText(e.target.value)} placeholder="یادداشت، نتیجه یا مشکل این کار…" aria-label="یادداشت" />
          <button className={btn} type="submit">ثبت</button>
        </form>
      )}
    </div>
  );
}

function Stages({ p, viewer, mine, send }: Ctx) {
  const ctx = { p, viewer, mine, send };
  const owner = viewer.role === "owner", member = viewer.role === "member";
  const ci = curStage(p);
  const [open, setOpen] = useState<string | null>(null);
  const [add, setAdd] = useState<Record<string, { t: string; unit: Unit }>>({});
  const unitOpts = Object.fromEntries((Object.keys(UNITS) as Unit[]).map((u) => [u, UNITS[u]]));
  return (
    <div className="flex flex-col gap-3">
      {member && <p className="text-sm text-muted">وظایف واحد شما در هر مرحله. برای ثبت انجام کار، خانه کنار آن را بزنید؛ برای نوشتن نتیجه یا مشکل، «یادداشت» را باز کنید.</p>}
      {p.stages.map((s, i) => {
        if (member && !s.items.length) return null;
        const sp = Math.round(stagePct(s)), d = daysTo(s.due), late = s.due && sp < 100 && d < 0, g = s.gate;
        return (
          <details key={s.key} open={i === ci || (member && s.items.some((x) => !x.done))} className={`group ${panel} !p-0`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${sp >= 100 ? "bg-emerald-50 text-emerald-700" : "bg-vault-50 text-vault-900"}`}>{sp >= 100 ? "✓" : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-vault-900">{T(s.title)}</span>
                <span className="text-xs text-muted">{s.items.filter((x) => x.done).length} از {s.items.length} کار · {fmt(stageStart(p, i))} تا {fmt(s.due)}{!member && <> · وزن <span className="font-mono">{s.w}</span></>}</span>
                {late && <span className={`${pill} mr-2 bg-red-50 text-red-700`}>{-d} روز تأخیر</span>}
                {g.decision !== "pending" && <span className={`${pill} mr-2 ${g.decision === "go" ? "bg-emerald-50 text-emerald-700" : g.decision === "nogo" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>Gate: {GATE[g.decision].split(" — ")[0]}</span>}
              </span>
              <span className="font-mono font-bold">{sp}%</span>
            </summary>
            <div className="border-t border-line p-4">
              <ul className="flex flex-col gap-2">
                {s.items.map((it) => {
                  const due = it.due || s.due, od = !it.done && daysTo(due) < 0, can = mine(it.unit);
                  return (
                    <li key={it.id} className={`rounded-lg border p-2 ${od ? "border-red-200 bg-red-50/50" : "border-line"}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <input type="checkbox" className="size-4 accent-molecule-600" checked={it.done} disabled={!can} aria-label="انجام شد" onChange={(e) => send([{ op: "item", stage: s.key, item: it.id, done: e.target.checked }])} />
                        <span className={`min-w-40 flex-1 text-sm ${it.done ? "text-muted line-through" : "text-ink"}`}>
                          {owner ? <Cell value={it.t} label="شرح کار" onSave={(v) => send([{ op: "item", stage: s.key, item: it.id, t: v }])} className="border-transparent hover:border-line" /> : T(it.t)}
                          {it.doneAt && <span className="block text-xs text-muted">انجام: {fmt(it.doneAt)}</span>}
                        </span>
                        {owner ? (
                          <>
                            <Select className="!w-36" value={it.unit} options={unitOpts} label="واحد مسئول" onSave={(v) => send([{ op: "item", stage: s.key, item: it.id, unit: v }])} />
                            <Cell className="!w-32" value={it.owner} label="مسئول کار" placeholder="مسئول" onSave={(v) => send([{ op: "item", stage: s.key, item: it.id, owner: v }])} />
                            <Cell className="!w-36" type="date" value={it.due} label="موعد کار" onSave={(v) => send([{ op: "item", stage: s.key, item: it.id, due: v }])} />
                          </>
                        ) : (
                          <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                            {!member && <UnitTag u={it.unit} />}{it.owner && <span>{T(it.owner)}</span>}
                            <span className={od ? "font-bold text-red-700" : ""}>موعد: {fmt(due)}{od ? ` (${when(daysTo(due))})` : ""}</span>
                          </span>
                        )}
                        <button type="button" className={btn} onClick={() => setOpen(open === it.id ? null : it.id)} aria-expanded={open === it.id}>یادداشت{it.comments?.length ? ` (${it.comments.length})` : ""}</button>
                        {owner && <button type="button" className="px-1 text-lg leading-none text-muted hover:text-red-700" aria-label="حذف کار" onClick={() => confirm(`کار «${it.t}» حذف شود؟`) && send([{ op: "delItem", stage: s.key, item: it.id }])}>×</button>}
                      </div>
                      {open === it.id && <Comments it={it} s={s} ctx={ctx} />}
                    </li>
                  );
                })}
                {!s.items.length && <li className="text-sm text-muted">کاری تعریف نشده است.</li>}
              </ul>
              {owner && (
                <>
                  <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); const a = add[s.key]; if (a?.t.trim()) { send([{ op: "addItem", stage: s.key, t: a.t, unit: a.unit }]); setAdd({ ...add, [s.key]: { t: "", unit: a.unit } }); } }}>
                    <input className={`${inp} min-w-48 flex-1`} placeholder="افزودن کار به این مرحله…" aria-label="کار جدید" value={add[s.key]?.t ?? ""} onChange={(e) => setAdd({ ...add, [s.key]: { t: e.target.value, unit: add[s.key]?.unit ?? "form" } })} />
                    <select className={`${inp} !w-40`} aria-label="واحد مسئول" value={add[s.key]?.unit ?? "form"} onChange={(e) => setAdd({ ...add, [s.key]: { t: add[s.key]?.t ?? "", unit: e.target.value as Unit } })}>
                      {(Object.keys(UNITS) as Unit[]).map((u) => <option key={u} value={u}>{UNITS[u]}</option>)}
                    </select>
                    <button className={btn} type="submit">افزودن</button>
                  </form>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <label className="text-xs text-muted">موعد مرحله<Cell className="mt-1 !w-40" type="date" value={s.due} label="موعد مرحله" onSave={(v) => send([{ op: "stage", stage: s.key, due: v }])} /></label>
                    <label className="text-xs text-muted">وزن (حجم کار)<Cell className="mt-1 !w-24" type="number" value={s.w} label="وزن" onSave={(v) => send([{ op: "stage", stage: s.key, w: +v }])} /></label>
                  </div>
                </>
              )}
              {!member && (
                <div className="mt-4 rounded-lg border border-dashed border-line bg-paper p-3">
                  <div className="mb-2 text-sm font-bold text-vault-900">Gate پایان مرحله <span className="text-xs font-normal text-muted">تصمیم برای ورود به مرحله بعد</span></div>
                  <div className="grid gap-2 sm:grid-cols-[10rem_10rem_10rem_1fr]">
                    <Select value={g.decision} options={GATE} label="تصمیم" disabled={!owner} onSave={(v) => send([{ op: "stage", stage: s.key, decision: v, by: g.by, date: g.date || today(), note: g.note }])} />
                    <Cell value={g.by} label="تصمیم‌گیرنده" placeholder="تصمیم‌گیرنده" disabled={!owner} onSave={(v) => send([{ op: "stage", stage: s.key, decision: g.decision, by: v, date: g.date, note: g.note }])} />
                    <Cell type="date" value={g.date} label="تاریخ تصمیم" disabled={!owner} onSave={(v) => send([{ op: "stage", stage: s.key, decision: g.decision, by: g.by, date: v, note: g.note }])} />
                    <Cell value={g.note} label="شرح تصمیم" placeholder="شرح تصمیم و شرایط" disabled={!owner} onSave={(v) => send([{ op: "stage", stage: s.key, decision: g.decision, by: g.by, date: g.date, note: v }])} />
                  </div>
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function ListTable({ p, k, viewer, mine, send }: Ctx & { k: ListKey }) {
  const L = LISTS[k], rows = p[k] as Row[], owner = viewer.role === "owner";
  const canAdd = owner || (viewer.role === "member" && !L.ownerOnly);
  const unitOpts = Object.fromEntries([...MEMBER_UNITS, "pm" as Unit].map((u) => [u, UNITS[u]]));
  return (
    <Panel title={L.title} aside={
      <span className="flex gap-2">
        {rows.length > 0 && <button type="button" className={btn} onClick={() => csv(p, k)}>خروجی CSV</button>}
        {canAdd && <button type="button" className={btn} onClick={() => send([{ op: "row", list: k, data: {} }])}>{L.add}</button>}
      </span>
    }>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-vault-50 text-right text-xs text-vault-900">
              {L.cols.map((c) => <th key={c.k} className="px-2 py-2 font-semibold" style={c.w ? { width: c.w } : undefined}>{c.l}</th>)}
              {viewer.role !== "member" && <th className="px-2 py-2 font-semibold" style={{ width: 130 }}>واحد</th>}
              <th style={{ width: 28 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const can = mine(r.unit);
              return (
                <tr key={r.id} className="border-b border-line align-top">
                  {L.cols.map((c) => (
                    <td key={c.k} className="px-1 py-1">
                      {c.t === "calc" ? (
                        <span className={`${pill} font-mono ${riskScore(r) >= 15 ? "bg-red-50 text-red-700" : riskScore(r) >= 8 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{riskScore(r)}</span>
                      ) : c.t === "sel" ? (
                        <Select value={r[c.k]} options={c.o!} label={c.l} disabled={!can} onSave={(v) => send([{ op: "row", list: k, id: r.id, data: { [c.k]: v } }])} />
                      ) : (
                        <Cell value={r[c.k]} type={c.t === "num" ? "number" : c.t === "date" ? "date" : "text"} ltr={c.ltr} label={c.l} disabled={!can} onSave={(v) => send([{ op: "row", list: k, id: r.id, data: { [c.k]: v } }])} />
                      )}
                    </td>
                  ))}
                  {viewer.role !== "member" && (
                    <td className="px-1 py-1">
                      <Select value={r.unit} options={unitOpts} label="واحد" disabled={!owner} onSave={(v) => send([{ op: "row", list: k, id: r.id, data: { unit: v } }])} />
                    </td>
                  )}
                  <td className="py-1">{can && <button type="button" className="px-1 text-lg leading-none text-muted hover:text-red-700" aria-label="حذف ردیف" onClick={() => confirm("این ردیف حذف شود؟") && send([{ op: "delRow", list: k, id: r.id }])}>×</button>}</td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={L.cols.length + 2} className="py-6 text-center text-sm text-muted">ردیفی ثبت نشده است.</td></tr>}
          </tbody>
        </table>
      </div>
      {L.note && <p className="mt-3 text-xs text-muted">{L.note}</p>}
    </Panel>
  );
}

function StudyCard({ st, canEdit, send }: { st: Study; canEdit: boolean; send: (ops: Op[]) => Promise<void> }) {
  const upd = (data: Record<string, unknown>) => send([{ op: "study", id: st.id, data }]);
  const res = (m: number, k: string, v: string) => send([{ op: "pull", id: st.id, month: m, result: { [k]: v } }]);
  return (
    <div className="rounded-lg border border-line p-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-bold text-vault-900" dir="ltr" style={{ textAlign: "right" }}>{st.cond}</h3>
          <label className="mt-1 flex items-center gap-2 text-xs text-muted">بچ‌ها<Cell className="!w-48" ltr value={st.batches} label="شماره بچ‌ها" placeholder="B001, B002, B003" disabled={!canEdit} onSave={(v) => upd({ batches: v })} /></label>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-muted">شروع مطالعه<Cell className="mt-1 !w-36" type="date" value={st.start} label="شروع مطالعه" disabled={!canEdit} onSave={(v) => upd({ start: v })} /></label>
          <label className="text-xs text-muted">Assay حداقل<Cell className="mt-1 !w-20" type="number" value={st.specMin} label="Assay حداقل" disabled={!canEdit} onSave={(v) => upd({ specMin: v })} /></label>
          <label className="text-xs text-muted">Assay حداکثر<Cell className="mt-1 !w-20" type="number" value={st.specMax} label="Assay حداکثر" disabled={!canEdit} onSave={(v) => upd({ specMax: v })} /></label>
          {canEdit && <button type="button" className="px-1 text-lg text-muted hover:text-red-700" aria-label="حذف مطالعه" onClick={() => confirm("این مطالعه پایداری حذف شود؟") && send([{ op: "delStudy", id: st.id }])}>×</button>}
        </div>
      </div>
      <div className="my-3 flex flex-wrap gap-1.5">
        {st.months.map((m) => {
          const due = st.start ? addMonths(st.start, m) : "", d = daysTo(due), done = st.done.includes(m), fail = st.results[m]?.ok === "fail";
          const cls = done ? (fail ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-300 bg-emerald-50 text-emerald-700") : d < 0 ? "border-red-300 bg-red-50 text-red-700" : d <= 30 ? "border-amber-300 bg-amber-50 text-amber-700" : "border-line bg-white text-muted";
          return (
            <button key={m} type="button" disabled={!canEdit} onClick={() => send([{ op: "pull", id: st.id, month: m, done: !done }])} title={done ? "نمونه‌برداری شد؛ برای برداشتن علامت بزنید" : "علامت‌گذاری: نمونه‌برداری شد"}
              className={`flex flex-col items-center rounded-md border px-2 py-1 text-xs ${cls}`}>
              <b className="font-mono">{m}M</b><span>{fmt(due)}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-b border-line bg-vault-50 text-right text-xs"><th className="p-2">زمان</th><th className="p-2">تاریخ</th><th className="p-2">Assay %</th><th className="p-2">Imp. %</th><th className="p-2">Diss. %</th><th className="p-2">سایر</th><th className="p-2">نتیجه</th></tr></thead>
            <tbody>
              {st.months.map((m) => {
                const r = st.results[m] ?? {}, bad = r.assay !== undefined && r.assay !== "" && (+r.assay < st.specMin || +r.assay > st.specMax);
                return (
                  <tr key={m} className="border-b border-line">
                    <td className="p-1 font-mono">{m}M</td><td className="p-1 text-xs">{fmt(st.start ? addMonths(st.start, m) : "")}</td>
                    <td className="w-20 p-1"><Cell type="number" value={r.assay} label="Assay" disabled={!canEdit} className={bad ? "!border-red-400 !text-red-700" : ""} onSave={(v) => res(m, "assay", v)} /></td>
                    <td className="w-20 p-1"><Cell type="number" value={r.imp} label="Total impurities" disabled={!canEdit} onSave={(v) => res(m, "imp", v)} /></td>
                    <td className="w-20 p-1"><Cell type="number" value={r.diss} label="Dissolution" disabled={!canEdit} onSave={(v) => res(m, "diss", v)} /></td>
                    <td className="p-1"><Cell value={r.other} label="سایر آزمون‌ها" placeholder="ظاهر، رطوبت…" disabled={!canEdit} onSave={(v) => res(m, "other", v)} /></td>
                    <td className="w-28 p-1"><Select value={r.ok ?? ""} options={{ "": "—", pass: "منطبق", fail: "OOS / OOT" }} label="نتیجه" disabled={!canEdit} onSave={(v) => res(m, "ok", v)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div><Trend st={st} /></div>
      </div>
    </div>
  );
}

function Stability({ p, canEdit, send }: { p: Project; canEdit: boolean; send: (ops: Op[]) => Promise<void> }) {
  const [tpl, setTpl] = useState(0);
  return (
    <Panel title="برنامه و نتایج پایداری" aside={canEdit && (
      <span className="flex flex-wrap gap-2">
        <select className={`${inp} !w-auto`} value={tpl} onChange={(e) => setTpl(+e.target.value)} aria-label="شرایط مطالعه" dir="ltr">
          {STAB_TPL.map((t, i) => <option key={i} value={i}>{t.cond} — {t.months.join(", ")} M</option>)}
        </select>
        <button type="button" className={btn} onClick={() => send([{ op: "study", data: { cond: STAB_TPL[tpl].cond, months: STAB_TPL[tpl].months, start: today() } }])}>+ مطالعه</button>
      </span>
    )}>
      <p className="mb-3 text-xs text-muted">روی هر نقطه زمانی بزنید تا «نمونه‌برداری شد» علامت بخورد. سبز: انجام‌شده، قرمز: موعد گذشته یا OOS، نارنجی: تا 30 روز آینده. نتیجه Assay خارج از محدوده خودکار در تاریخچه به‌عنوان «مشکل» ثبت می‌شود. هر نمونه‌برداری که موعدش برسد برای واحد آنالیز و QC هشدار صادر می‌کند.</p>
      <div className="flex flex-col gap-4">
        {p.stability.map((st) => <StudyCard key={st.id} st={st} canEdit={canEdit} send={send} />)}
        {!p.stability.length && <p className="text-sm text-muted">مطالعه‌ای ثبت نشده است.{canEdit ? " شرایط را انتخاب و «+ مطالعه» را بزنید." : ""}</p>}
      </div>
    </Panel>
  );
}

function Budget({ p, owner, send }: { p: Project; owner: boolean; send: (ops: Op[]) => Promise<void> }) {
  const cats = LISTS.costs.cols[1].o!, by: Record<string, number> = {};
  for (const c of p.costs) by[String(c.cat || "other")] = (by[String(c.cat || "other")] || 0) + (+(c.amount as number) || 0);
  const sp = spent(p), mx = Math.max(1, p.budget || 0, sp), cmx = Math.max(1, ...Object.values(by));
  const n0 = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="بودجه و هزینه" aside={`واحد: ${p.unit || "—"}`}>
          <div className="flex flex-col gap-3 text-sm">
            <div>بودجه مصوب <span className="font-mono">{n0(p.budget || 0)}</span><Bar value={(100 * (p.budget || 0)) / mx} tone={C.plan} /></div>
            <div>هزینه‌شده <span className="font-mono">{n0(sp)}</span>{p.budget ? <> (<span className="font-mono">{Math.round((100 * sp) / p.budget)}%</span>)</> : null}<Bar value={(100 * sp) / mx} tone={p.budget && sp > p.budget ? C.bad : C.accent} /></div>
          </div>
          {owner && (
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="text-xs text-muted">بودجه مصوب<Cell className="mt-1 !w-40" type="number" value={p.budget || ""} label="بودجه مصوب" onSave={(v) => send([{ op: "meta", data: { budget: v } }])} /></label>
              <label className="text-xs text-muted">واحد<Cell className="mt-1 !w-40" value={p.unit} label="واحد پول" onSave={(v) => send([{ op: "meta", data: { unit: v } }])} /></label>
            </div>
          )}
        </Panel>
        <Panel title="هزینه به تفکیک دسته">
          <div className="flex flex-col gap-2">
            {Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7rem_1fr_5rem] items-center gap-2 text-xs"><span>{cats[k] || k}</span><Bar value={(100 * v) / cmx} tone={C.gold} /><span className="font-mono">{n0(v)}</span></div>
            ))}
            {!p.costs.length && <p className="text-sm text-muted">هزینه‌ای ثبت نشده است.</p>}
          </div>
        </Panel>
      </div>
      <ListTable p={p} k="costs" viewer={{ role: owner ? "owner" : "manager", unit: null, name: "" }} mine={() => owner} send={send} />
    </>
  );
}

function Log({ p, viewer, send }: { p: Project; viewer: Viewer; send: (ops: Op[]) => Promise<void> }) {
  const [kind, setKind] = useState("note"), [text, setText] = useState(""), [date, setDate] = useState(() => toJalali(today()));
  const when = fromJalali(date);
  const [audit, setAudit] = useState<AuditRow[] | null>(null);
  const kindTone: Record<string, string> = { decision: "border-molecule-500", issue: "border-red-400", note: "border-capsule-400", auto: "border-line" };
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="تاریخچه رویدادها" aside="تغییرات مهم خودکار ثبت می‌شود">
        <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim() && when) { send([{ op: "event", kind, text, date: when }]); setText(""); } }}>
          <input className={`${inp} !w-32 font-mono ${when ? "" : "!border-red-400"}`} dir="ltr" inputMode="numeric" value={date} onChange={(e) => setDate(maskJalali(e.target.value))} aria-label="تاریخ (شمسی)" aria-invalid={!when} placeholder="1405/01/31" />
          <select className={`${inp} !w-28`} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="نوع رویداد">
            <option value="note">{EV_KIND.note}</option><option value="decision">{EV_KIND.decision}</option><option value="issue">{EV_KIND.issue}</option>
          </select>
          <input className={`${inp} min-w-48 flex-1`} value={text} onChange={(e) => setText(e.target.value)} placeholder="چه اتفاقی افتاد؟ (جلسه، تصمیم، مشکل، نتیجه)" aria-label="شرح رویداد" />
          <button className={btn} type="submit">ثبت رویداد</button>
        </form>
        <ul className="flex flex-col gap-2">
          {p.events.map((e) => (
            <li key={e.id} className={`border-r-4 pr-3 ${kindTone[e.kind] ?? "border-line"}`}>
              <div className="text-xs text-muted">{fmt(e.date)} · {EV_KIND[e.kind]}{viewer.role !== "member" ? ` · ${UNITS[e.unit]}` : ""}{e.by ? ` · ${T(e.by)}` : ""}</div>
              <div className="text-sm">{T(e.text)}</div>
            </li>
          ))}
          {!p.events.length && <li className="text-sm text-muted">رویدادی ثبت نشده است.</li>}
        </ul>
      </Panel>
      {viewer.role === "owner" && (
        <Panel title="ردپای تغییرات (Audit trail)" aside="چه کسی، چه زمانی، چه کاری">
          {audit ? (
            <ul className="flex max-h-[32rem] flex-col gap-1.5 overflow-y-auto text-xs">
              {audit.map((a, i) => (
                <li key={i} className="border-b border-line pb-1.5">
                  <span className="text-muted" dir="ltr">{new Date(a.at).toLocaleString("fa-IR-u-ca-persian-nu-latn", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tehran" })}</span> · <b>{a.who}</b> ({UNITS[a.unit as Unit] ?? (a.unit === "owner" ? "مدیر پروژه" : a.unit === "manager" ? "مدیر" : a.unit)}): {a.action}
                </li>
              ))}
              {!audit.length && <li className="text-muted">تغییری ثبت نشده است.</li>}
            </ul>
          ) : (
            <button type="button" className={btn} onClick={async () => { const r = await rndAudit(p.id); setAudit(r.ok ? r.rows : []); }}>نمایش ردپای تغییرات</button>
          )}
        </Panel>
      )}
    </div>
  );
}
