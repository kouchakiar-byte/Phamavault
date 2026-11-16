"use client";

import { Fragment, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, ChevronDown, Flame, GanttChartSquare, Link2, ListChecks, Lock, RotateCcw, Search, Target } from "lucide-react";
import { toJalali } from "@/lib/rnd/jalali";
import { GATE, PRIO, isGateStage, T, UNITS, daysTo, isDate, itemPct, ms, stagePct, today, type Item, type Stage, type Unit } from "@/lib/rnd/model";
import { cpm, waitingOn, type CpmInfo } from "@/lib/rnd/schedule";
import { Bar, C } from "./charts";
import { Cell, Comments, Select, btn, inp, panel, pill, type Ctx } from "./fields";
import { GateReview } from "./gate-review";

export type Person = { id: string; name: string; unit: string };

/** Where an activity stands, worked out from its dates, its progress and its predecessors. */
type Status = "done" | "late" | "active" | "waiting" | "ready" | "upcoming";
const STATUS: Record<Status, { label: string; tone: string; dot: string }> = {
  done: { label: "انجام‌شده", tone: "bg-emerald-50 text-emerald-700", dot: "#1f8a4c" },
  late: { label: "عقب‌افتاده", tone: "bg-red-50 text-red-700", dot: "#c2362f" },
  active: { label: "در جریان", tone: "bg-molecule-50 text-molecule-700", dot: "#0b8f8a" },
  waiting: { label: "منتظر پیش‌نیاز", tone: "bg-amber-50 text-amber-700", dot: "#b26a00" },
  ready: { label: "آماده شروع", tone: "bg-sky-50 text-sky-700", dot: "#0369a1" },
  upcoming: { label: "شروع‌نشده", tone: "bg-vault-50 text-muted", dot: "#8a9ab0" },
};
function statusOf(ctx: Ctx, it: Item): Status {
  if (it.done) return "done";
  if (isDate(it.due) && daysTo(it.due) < 0) return "late";
  if ((it.pct ?? 0) > 0 || it.aStart) return "active";
  const wait = waitingOn(ctx.p, it).length > 0;
  if (isDate(it.start) && daysTo(it.start) <= 0) return wait ? "waiting" : "ready";
  return "upcoming";
}
const jd = (iso?: string) => (iso ? toJalali(iso) : "—");
const short = (iso?: string) => (iso ? toJalali(iso).slice(2) : "—");

/** The plan: every phase and activity, with filters, the list or the Gantt chart, and an editor for each activity. */
export function Activities({ ctx, people }: { ctx: Ctx; people: Person[] }) {
  const { p, viewer, send } = ctx;
  const owner = viewer.role === "owner", member = viewer.role === "member";
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState<"" | Unit>("");
  const [status, setStatus] = useState<"" | Status>("");
  const [critOnly, setCritOnly] = useState(false);
  const [view, setView] = useState<"list" | "gantt">("list");
  const [open, setOpen] = useState<string | null>(null);
  const [closed, setClosed] = useState<Set<string>>(() => new Set(p.stages.filter((s) => stagePct(s) >= 100).map((s) => s.key)));
  const crit = useMemo(() => cpm(p), [p]);
  const all = p.stages.flatMap((s) => s.items);
  const st = useMemo(() => new Map(all.map((it) => [it.id, statusOf(ctx, it)])), [all, ctx]);
  const match = (it: Item) =>
    (!unit || it.unit === unit) && (!status || st.get(it.id) === status) && (!critOnly || Boolean(crit.get(it.id)?.crit)) &&
    (!q || `${it.code} ${it.t} ${it.owner ?? ""} ${it.out ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()));
  const filtered = Boolean(q || unit || status || critOnly);
  const end = all.map((i) => i.due).filter(isDate).sort().pop();
  const counts = { done: 0, late: 0, active: 0, waiting: 0, ready: 0, upcoming: 0 } as Record<Status, number>;
  for (const it of all) counts[st.get(it.id)!]++;
  const critCount = all.filter((i) => crit.get(i.id)?.crit).length;
  const slip = end && p.target ? Math.round((ms(end) - ms(p.target)) / 86400000) : 0;
  const toggle = (k: string) => setClosed((c) => { const n = new Set(c); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const nameOf = (id?: string) => people.find((x) => x.id === id)?.name;

  return (
    <div className="flex flex-col gap-4">
      {/* The plan at a glance */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {([["همه فعالیت‌ها", all.length, ""], ["انجام‌شده", counts.done, "ok"], ["در جریان", counts.active, ""], ["عقب‌افتاده", counts.late, counts.late ? "bad" : "ok"], ["روی مسیر بحرانی", critCount, critCount ? "warn" : ""], ["پایان برنامه‌ریزی‌شده", end ? jd(end) : "—", slip > 0 ? "bad" : "ok"]] as const).map(([l, v, t]) => (
          <div key={l} className="rounded-lg border border-line bg-white px-3 py-2">
            <div className="text-xs text-muted">{l}</div>
            <div className={`font-mono text-lg font-extrabold ${t === "bad" ? "text-red-700" : t === "warn" ? "text-amber-700" : t === "ok" ? "text-emerald-700" : "text-vault-900"}`} dir="ltr" style={{ textAlign: "right" }}>{v}</div>
            {l === "پایان برنامه‌ریزی‌شده" && p.target && <div className="text-[11px] text-muted">هدف: <bdi dir="ltr" className="font-mono">{jd(p.target)}</bdi>{slip > 0 ? ` · ${slip} روز دیرتر` : slip < 0 ? ` · ${-slip} روز زودتر` : ""}</div>}
          </div>
        ))}
      </section>

      {/* Filters, view and the project manager's plan tools */}
      <section className={`${panel} flex flex-col gap-3`}>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-48 flex-1">
            <Search className="absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input className={`${inp} ps-8`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی کد، فعالیت، مسئول یا خروجی…" aria-label="جست‌وجوی فعالیت" />
          </label>
          {!member && (
            <select className={`${inp} !w-auto`} value={unit} onChange={(e) => setUnit(e.target.value as Unit | "")} aria-label="واحد">
              <option value="">همه واحدها</option>
              {(Object.keys(UNITS) as Unit[]).map((u) => <option key={u} value={u}>{UNITS[u]}</option>)}
            </select>
          )}
          <select className={`${inp} !w-auto`} value={status} onChange={(e) => setStatus(e.target.value as Status | "")} aria-label="وضعیت">
            <option value="">همه وضعیت‌ها</option>
            {(Object.keys(STATUS) as Status[]).map((k) => <option key={k} value={k}>{STATUS[k].label} ({counts[k]})</option>)}
          </select>
          <label className={`${btn} cursor-pointer ${critOnly ? "!border-red-400 !bg-red-50 !text-red-700" : ""}`}>
            <input type="checkbox" className="sr-only" checked={critOnly} onChange={(e) => setCritOnly(e.target.checked)} />
            <Flame className="size-3.5" aria-hidden="true" />فقط مسیر بحرانی
          </label>
          <div className="ms-auto flex rounded-full border border-line p-0.5" role="group" aria-label="نمایش">
            {([["list", "فهرست", ListChecks], ["gantt", "Gantt", GanttChartSquare]] as const).map(([k, l, Icon]) => (
              <button key={k} type="button" onClick={() => setView(k)} aria-pressed={view === k}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${view === k ? "bg-vault-900 text-white" : "text-vault-900"}`}>
                <Icon className="size-3.5" aria-hidden="true" />{l}
              </button>
            ))}
          </div>
        </div>
        {owner && (
          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs">
            <span className="text-muted">ابزار برنامه‌ریزی:</span>
            <button type="button" className={btn} onClick={() => send([{ op: "reschedule", mode: "plan" }])} title="تاریخ‌ها از روی مدت و پیش‌نیازها دوباره چیده می‌شوند">
              <CalendarClock className="size-3.5" aria-hidden="true" />بازچینی برنامه
            </button>
            <button type="button" className={btn} onClick={() => confirm("کارهای انجام‌شده از تاریخ واقعی پایانشان و کارهای عقب‌افتاده از امروز حساب می‌شوند و بقیه برنامه جابه‌جا می‌شود. ادامه می‌دهید؟") && send([{ op: "reschedule", mode: "actual" }])}
              title="باقی برنامه از وضعیت واقعی امروز دوباره چیده می‌شود (Forecast)">
              <RotateCcw className="size-3.5" aria-hidden="true" />بازچینی بر اساس وضعیت واقعی
            </button>
            <button type="button" className={btn} onClick={() => confirm("برنامه فعلی به‌عنوان برنامه پایه (Baseline) ثبت می‌شود و تأخیرها از این به بعد نسبت به آن سنجیده می‌شوند. ادامه می‌دهید؟") && send([{ op: "baseline" }])}>
              <Target className="size-3.5" aria-hidden="true" />تثبیت برنامه پایه (Baseline)
            </button>
            <span className="text-muted">روی هر فعالیت بزنید تا مسئول، تاریخ، مدت، پیش‌نیاز و خروجی آن را تنظیم کنید.</span>
          </div>
        )}
      </section>

      {view === "gantt" ? (
        <Gantt ctx={ctx} crit={crit} match={match} filtered={filtered} />
      ) : (
        p.stages.map((s, si) => {
          const items = s.items.filter(match);
          if (!items.length && (filtered || member)) return null;
          const sp = Math.round(stagePct(s)), isClosed = closed.has(s.key) && !filtered;
          const late = s.items.filter((i) => st.get(i.id) === "late").length;
          const start = s.items.map((i) => i.start).filter(isDate).sort()[0];
          return (
            <section key={s.key} className={`${panel} !p-0`}>
              <button type="button" onClick={() => toggle(s.key)} aria-expanded={!isClosed} className="flex w-full items-center gap-3 p-4 text-start">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${sp >= 100 ? "bg-emerald-50 text-emerald-700" : "bg-vault-900 text-white"}`}>{sp >= 100 ? "✓" : p.stages[0]?.key === "p0" ? si : si + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-vault-900">{T(s.title)}</span>
                  <span className="text-xs text-muted">
                    {s.items.filter((i) => i.done).length} از {s.items.length} فعالیت · <bdi dir="ltr" className="font-mono">{jd(start)}</bdi> تا <bdi dir="ltr" className="font-mono">{jd(s.due)}</bdi>
                    {late > 0 && <span className={`${pill} ms-2 bg-red-50 text-red-700`}>{late} عقب‌افتاده</span>}
                    {s.gate.decision !== "pending" && <span className={`${pill} ms-2 ${s.gate.decision === "go" ? "bg-emerald-50 text-emerald-700" : s.gate.decision === "nogo" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>Gate: {GATE[s.gate.decision].split(" — ")[0]}</span>}
                  </span>
                </span>
                <span className="hidden w-32 sm:block"><Bar value={sp} tone={sp >= 100 ? C.ok : late ? C.bad : undefined} /></span>
                <span className="w-10 text-end font-mono font-bold">{sp}%</span>
                <ChevronDown className={`size-4 shrink-0 text-muted transition ${isClosed ? "" : "rotate-180"}`} aria-hidden="true" />
              </button>
              {!isClosed && (
                <div className="border-t border-line">
                  <div className="hidden grid-cols-[2rem_3.2rem_minmax(0,1fr)_9.5rem_5.5rem_6.5rem_1.5rem] gap-2 bg-vault-50 px-4 py-1.5 text-[11px] font-semibold text-muted md:grid">
                    <span /><span>کد</span><span>فعالیت · واحد · مسئول</span><span>شروع تا پایان</span><span>پیشرفت</span><span>وضعیت</span><span />
                  </div>
                  <ul>
                    {items.map((it) => (
                      <ActivityRow key={it.id} ctx={ctx} s={s} it={it} status={st.get(it.id)!} info={crit.get(it.id)} open={open === it.id} onOpen={() => setOpen(open === it.id ? null : it.id)} people={people} who={nameOf(it.assignee)} />
                    ))}
                  </ul>
                  {owner && !filtered && <AddActivity ctx={ctx} s={s} />}
                  {!member && !filtered && (isGateStage(s) ? <GateReview ctx={ctx} s={s} /> : <GatePanel ctx={ctx} s={s} />)}
                </div>
              )}
            </section>
          );
        })
      )}
      {view === "list" && filtered && !p.stages.some((s) => s.items.some(match)) && <p className={`${panel} text-center text-sm text-muted`}>فعالیتی با این فیلترها پیدا نشد.</p>}
    </div>
  );
}

function ActivityRow({ ctx, s, it, status, info, open, onOpen, people, who }: { ctx: Ctx; s: Stage; it: Item; status: Status; info?: CpmInfo; open: boolean; onOpen: () => void; people: Person[]; who?: string }) {
  const can = ctx.mine(it.unit), pc = itemPct(it), S = STATUS[status];
  const slip = it.base && it.due ? Math.round((ms(it.due) - ms(it.base)) / 86400000) : 0;
  return (
    <li className={`border-b border-line last:border-0 ${open ? "bg-molecule-50/40" : ""} ${info?.crit ? "border-s-4 border-s-red-400" : ""}`}>
      <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 px-4 py-2 md:grid-cols-[2rem_3.2rem_minmax(0,1fr)_9.5rem_5.5rem_6.5rem_1.5rem]">
        <input type="checkbox" className="size-4 accent-molecule-600" checked={it.done} disabled={!can} aria-label={`انجام شد: ${it.t}`}
          onChange={(e) => ctx.send([{ op: "item", stage: s.key, item: it.id, done: e.target.checked }])} />
        <span className="hidden font-mono text-xs text-muted md:block" dir="ltr">{it.code}</span>
        <button type="button" onClick={onOpen} aria-expanded={open} className="min-w-0 text-start">
          <span className={`block text-sm ${it.done ? "text-muted line-through" : "font-medium text-ink"}`}>
            <span className="font-mono text-xs text-muted md:hidden" dir="ltr">{it.code} </span>
            {it.gate && <Lock className="me-1 inline size-3.5 text-capsule-600" aria-label="Gate" />}
            {T(it.t)}
            {it.pri === "high" && <span className={`${pill} ms-1 bg-red-50 text-red-700`}>فوری</span>}
            {(it.comments?.length ?? 0) > 0 && <span className="ms-1 text-xs text-muted">· {it.comments!.length} یادداشت</span>}
          </span>
          <span className="block truncate text-xs text-muted">
            {UNITS[it.unit]}{who || it.owner ? ` · ${T(who ?? it.owner)}` : ""}{it.out ? ` · خروجی: ${T(it.out)}` : ""}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] md:hidden">
            <span className="text-muted"><bdi dir="ltr" className="font-mono">{short(it.start)}</bdi> تا <bdi dir="ltr" className="font-mono">{short(it.due)}</bdi></span>
            <span className={`${pill} ${S.tone}`}>{S.label}</span><span className="font-mono">{pc}%</span>
          </span>
        </button>
        <span className="hidden text-xs md:block">
          <span className={status === "late" ? "font-bold text-red-700" : "text-muted"}><bdi dir="ltr" className="font-mono">{short(it.start)}</bdi> تا <bdi dir="ltr" className="font-mono">{short(it.due)}</bdi></span>
          {slip > 0 && <span className="block text-[10.5px] text-red-700">{slip} روز دیرتر از Baseline</span>}
        </span>
        <span className="hidden items-center gap-1.5 md:flex"><Bar value={pc} tone={pc >= 100 ? C.ok : status === "late" ? C.bad : undefined} /><span className="w-8 font-mono text-[11px]">{pc}%</span></span>
        <span className={`hidden md:inline-flex ${pill} ${S.tone} w-fit`}>{S.label}</span>
        <span className="hidden md:block">{info?.crit && <Flame className="size-4 text-red-600" aria-label="روی مسیر بحرانی" />}</span>
      </div>
      {open && <ActivityEditor ctx={ctx} s={s} it={it} info={info} people={people} />}
    </li>
  );
}

/** Everything about one activity: what the owner of the plan sets, and what the person doing it reports. */
function ActivityEditor({ ctx, s, it, info, people }: { ctx: Ctx; s: Stage; it: Item; info?: CpmInfo; people: Person[] }) {
  const { p, viewer, send } = ctx;
  const owner = viewer.role === "owner", can = ctx.mine(it.unit);
  const set = (data: Record<string, unknown>) => send([{ op: "item", stage: s.key, item: it.id, ...data }]);
  const wait = waitingOn(p, it);
  const succ = p.stages.flatMap((x) => x.items).filter((x) => x.deps?.includes(it.code ?? "§"));
  const [pct, setPct] = useState(itemPct(it));
  const unitOpts = Object.fromEntries((Object.keys(UNITS) as Unit[]).map((u) => [u, UNITS[u]]));
  const label = "block text-xs text-muted";
  return (
    <div className="border-t border-line bg-paper px-4 py-4">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>عنوان فعالیت<Cell className="mt-1" value={it.t} label="عنوان فعالیت" disabled={!owner} onSave={(v) => set({ t: v })} /></label>
          <label className={label}>واحد مسئول<Select className="mt-1" value={it.unit} options={unitOpts} label="واحد مسئول" disabled={!owner} onSave={(v) => set({ unit: v })} /></label>
          <label className={label}>مسئول انجام (عضو تیم)
            <Select className="mt-1" value={it.assignee ?? ""} options={[["", "— انتخاب نشده —"], ...people.map((x): [string, string] => [x.id, `${x.name} · ${x.unit === "owner" ? "مدیر پروژه" : UNITS[x.unit as Unit] ?? "مدیر"}`])]} label="مسئول انجام" disabled={!owner}
              onSave={(v) => set({ assignee: v, owner: people.find((x) => x.id === v)?.name ?? "" })} />
          </label>
          {owner && !people.length && <p className="text-[11px] text-muted sm:col-span-2">برای انتخاب مسئول، اول اعضای تیم را از «تیم و دسترسی‌ها» اضافه کنید. تا آن موقع نام را در «نام مسئول» بنویسید.</p>}
          <label className={label}>نام مسئول (اگر عضو سامانه نیست)<Cell className="mt-1" value={it.owner} label="نام مسئول" disabled={!owner} onSave={(v) => set({ owner: v })} /></label>
          <label className={label}>اولویت<Select className="mt-1" value={it.pri ?? "medium"} options={PRIO} label="اولویت" disabled={!owner} onSave={(v) => set({ pri: v })} /></label>
          <label className={label}>شروع برنامه‌ای {it.pin ? <span className="text-capsule-700">(دستی)</span> : <span>(خودکار)</span>}<Cell className="mt-1" type="date" value={it.start} label="شروع برنامه‌ای" disabled={!owner} onSave={(v) => set({ start: v })} /></label>
          <label className={label}>پایان برنامه‌ای<Cell className="mt-1" type="date" value={it.due} label="پایان برنامه‌ای" disabled={!owner} onSave={(v) => set({ due: v })} /></label>
          <label className={label}>مدت (روز)<Cell className="mt-1" type="number" value={it.dur} label="مدت به روز" disabled={!owner} onSave={(v) => set({ dur: +v })} /></label>
          <label className={label}>پیش‌نیازها (کد فعالیت‌ها)
            <Cell className="mt-1 font-mono" ltr value={(it.deps ?? []).join(", ")} label="پیش‌نیازها" placeholder="مثلاً 4.3, 5.2" disabled={!owner}
              onSave={(v) => set({ deps: v.split(/[,،\s]+/).map((x) => x.trim()).filter(Boolean) })} />
          </label>
          <label className={`${label} sm:col-span-2`}>خروجی (Deliverable)<Cell className="mt-1" value={it.out} label="خروجی" placeholder="مثلاً گزارش Validation روش" disabled={!owner} onSave={(v) => set({ out: v })} /></label>
          {owner && it.pin && <button type="button" className={`${btn} w-fit`} onClick={() => set({ pin: false })}>برگرداندن شروع به حالت خودکار</button>}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-line bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-xs"><span className="font-bold text-vault-900">گزارش انجام کار</span><span className="font-mono text-base font-extrabold text-molecule-700">{pct}%</span></div>
            <input type="range" min={0} max={100} step={5} value={pct} disabled={!can} aria-label="درصد پیشرفت" className="w-full accent-molecule-600"
              onChange={(e) => setPct(+e.target.value)} onPointerUp={() => pct !== itemPct(it) && set({ pct })} onKeyUp={() => pct !== itemPct(it) && set({ pct })} />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className={label}>شروع واقعی<Cell className="mt-1" type="date" value={it.aStart} label="شروع واقعی" disabled={!can} onSave={(v) => set({ aStart: v })} /></label>
              <label className={label}>پایان واقعی<span className="mt-1 block rounded-md border border-line bg-vault-50 px-2 py-1 font-mono text-sm" dir="ltr">{it.doneAt ? jd(it.doneAt) : "—"}</span></label>
            </div>
            <label className={`${label} mt-2`}>سند یا لینک (کد سند، آدرس فایل)<Cell className="mt-1" ltr value={it.doc} label="سند یا لینک" placeholder="AMV-01 یا https://…" disabled={!can} onSave={(v) => set({ doc: v })} /></label>
            {it.doc && /^https?:\/\//.test(it.doc) && <a href={it.doc} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-molecule-700 underline"><Link2 className="size-3.5" aria-hidden="true" />باز کردن سند</a>}
            <label className={`${label} mt-2`}>توضیح<Cell className="mt-1" value={it.note} label="توضیح" disabled={!can} onSave={(v) => set({ note: v })} /></label>
          </div>
          <div className="rounded-lg border border-line bg-white p-3 text-xs leading-6">
            <div><span className="text-muted">شناوری (Slack): </span>{info ? (info.crit ? <b className="text-red-700">صفر — روی مسیر بحرانی؛ هر روز تأخیر، پایان پروژه را عقب می‌برد</b> : <b>{info.slack} روز</b>) : "—"}</div>
            {it.base && <div><span className="text-muted">پایان در برنامه پایه: </span><bdi dir="ltr" className="font-mono">{jd(it.base)}</bdi></div>}
            <div><span className="text-muted">منتظر: </span>{wait.length ? wait.map((w) => <span key={w.id} className={`${pill} me-1 bg-amber-50 text-amber-700`} dir="ltr">{w.code}</span>) : <span className="text-emerald-700">پیش‌نیازها کامل است</span>}</div>
            {succ.length > 0 && <div><span className="text-muted">کارهای وابسته به این فعالیت: </span>{succ.map((x) => <span key={x.id} className={`${pill} me-1 bg-vault-50 text-vault-800`} dir="ltr">{x.code}</span>)}</div>}
          </div>
        </div>
      </div>
      <Comments it={it} s={s} ctx={ctx} />
      {owner && <div className="mt-3 text-end"><button type="button" className="text-xs text-red-700 hover:underline" onClick={() => confirm(`فعالیت ${it.code} «${it.t}» حذف شود؟`) && send([{ op: "delItem", stage: s.key, item: it.id }])}>حذف این فعالیت</button></div>}
    </div>
  );
}

function AddActivity({ ctx, s }: { ctx: Ctx; s: Stage }) {
  const [t, setT] = useState(""), [unit, setUnit] = useState<Unit>("form"), [dur, setDur] = useState(5);
  return (
    <form className="flex flex-wrap gap-2 border-t border-line px-4 py-3" onSubmit={(e) => { e.preventDefault(); if (t.trim()) { ctx.send([{ op: "addItem", stage: s.key, t, unit, dur }]); setT(""); } }}>
      <input className={`${inp} min-w-48 flex-1`} placeholder="افزودن فعالیت به این فاز…" aria-label="فعالیت جدید" value={t} onChange={(e) => setT(e.target.value)} />
      <select className={`${inp} !w-40`} aria-label="واحد مسئول" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
        {(Object.keys(UNITS) as Unit[]).map((u) => <option key={u} value={u}>{UNITS[u]}</option>)}
      </select>
      <label className="flex items-center gap-1 text-xs text-muted">مدت<input type="number" min={1} className={`${inp} !w-16 font-mono`} dir="ltr" value={dur} onChange={(e) => setDur(+e.target.value || 1)} aria-label="مدت به روز" />روز</label>
      <button className={btn} type="submit">افزودن</button>
    </form>
  );
}

function GatePanel({ ctx, s }: { ctx: Ctx; s: Stage }) {
  const owner = ctx.viewer.role === "owner", g = s.gate;
  const send = (d: Record<string, unknown>) => ctx.send([{ op: "stage", stage: s.key, decision: g.decision, by: g.by, date: g.date, note: g.note, ...d }]);
  return (
    <div className="m-4 mt-0 rounded-lg border border-dashed border-line bg-paper p-3">
      <div className="mb-2 text-sm font-bold text-vault-900">Gate پایان فاز <span className="text-xs font-normal text-muted">تصمیم برای ورود به فاز بعد</span></div>
      <div className="grid gap-2 sm:grid-cols-[10rem_10rem_10rem_1fr]">
        <Select value={g.decision} options={GATE} label="تصمیم" disabled={!owner} onSave={(v) => send({ decision: v, date: g.date || today() })} />
        <Cell value={g.by} label="تصمیم‌گیرنده" placeholder="تصمیم‌گیرنده" disabled={!owner} onSave={(v) => send({ by: v })} />
        <Cell type="date" value={g.date} label="تاریخ تصمیم" disabled={!owner} onSave={(v) => send({ date: v })} />
        <Cell value={g.note} label="شرح تصمیم" placeholder="شرح تصمیم و شرایط" disabled={!owner} onSave={(v) => send({ note: v })} />
      </div>
    </div>
  );
}

/**
 * The Gantt chart: one row per phase and, for open phases, one per activity. Time runs in the reading
 * direction (right to left in Persian). Planned bars with their progress, critical activities in red,
 * the baseline end as a tick, and today as a line.
 */
function Gantt({ ctx, crit, match, filtered }: { ctx: Ctx; crit: Map<string, CpmInfo>; match: (it: Item) => boolean; filtered: boolean }) {
  const { p } = ctx;
  const [zoom, setZoom] = useState(3);
  const [shut, setShut] = useState<Set<string>>(() => new Set(p.stages.filter((s) => stagePct(s) >= 100).map((s) => s.key)));
  const dated = p.stages.flatMap((s) => s.items).filter((i) => isDate(i.start) && isDate(i.due));
  if (!dated.length) return <p className={`${panel} text-sm text-muted`}>برای نمودار Gantt، فعالیت‌ها باید تاریخ شروع و پایان داشته باشند. «بازچینی برنامه» را بزنید.</p>;
  const DAY = 86400000;
  const t0 = Math.min(ms(p.start), ...dated.map((i) => ms(i.start))) - 7 * DAY;
  const t1 = Math.max(ms(p.target) || 0, ...dated.map((i) => ms(i.due)), ...dated.map((i) => (i.base ? ms(i.base) : 0))) + 14 * DAY;
  const days = Math.round((t1 - t0) / DAY), W = days * zoom, x = (iso: string) => Math.round((ms(iso) - t0) / DAY) * zoom;
  const months: { at: number; label: string }[] = [];
  for (let d = new Date(t0); d.getTime() < t1; d.setDate(d.getDate() + 1)) {
    const j = toJalali(d.toISOString().slice(0, 10));
    if (j.endsWith("/01")) months.push({ at: Math.round((d.getTime() - t0) / DAY) * zoom, label: j.slice(2, 7) });
  }
  const now = x(today());
  const LABEL = 260;
  return (
    <section className={`${panel} !p-0`}>
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2 text-xs">
        <span className="font-bold text-vault-900">نمودار Gantt</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-5 rounded-sm bg-molecule-500/30" />برنامه</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-5 rounded-sm bg-molecule-600" />انجام‌شده</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-2.5 w-5 rounded-sm bg-red-500/70" />مسیر بحرانی</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-3 w-0.5 bg-vault-900" />پایان در Baseline</span>
        <span className="inline-flex items-center gap-1"><i className="inline-block h-3 w-0.5 bg-red-600" />امروز</span>
        <span className="ms-auto flex items-center gap-1">بزرگ‌نمایی
          {[1.5, 3, 6].map((z) => <button key={z} type="button" onClick={() => setZoom(z)} aria-pressed={zoom === z} className={`rounded-full border px-2 py-0.5 ${zoom === z ? "border-vault-900 bg-vault-900 text-white" : "border-line"}`}>{z === 1.5 ? "کل" : z === 3 ? "ماه" : "هفته"}</button>)}
        </span>
      </div>
      <div className="max-h-[70vh] overflow-auto">
        <div className="relative" style={{ width: LABEL + W }}>
          {/* Month scale */}
          <div className="sticky top-0 z-20 flex h-7 border-b border-line bg-white text-[10px] text-muted">
            <div className="sticky start-0 z-30 shrink-0 border-e border-line bg-white" style={{ width: LABEL }} />
            <div className="relative" style={{ width: W }}>
              {months.map((m) => <span key={m.at} className="absolute top-1.5 font-mono" style={{ insetInlineStart: m.at + 3 }}><bdi dir="ltr">{m.label}</bdi></span>)}
            </div>
          </div>
          {p.stages.map((s) => {
            const items = s.items.filter((i) => match(i) && isDate(i.start) && isDate(i.due));
            if (!items.length) return null;
            const a = items.map((i) => i.start!).sort()[0], b = items.map((i) => i.due!).sort().pop()!;
            const open = filtered || !shut.has(s.key), sp = Math.round(stagePct(s));
            return (
              <Fragment key={s.key}>
                <div className="flex h-8 border-b border-line bg-vault-50/60">
                  <button type="button" onClick={() => setShut((c) => { const n = new Set(c); if (n.has(s.key)) n.delete(s.key); else n.add(s.key); return n; })}
                    className="sticky start-0 z-10 flex shrink-0 items-center gap-1 truncate border-e border-line bg-vault-50 px-2 text-start text-xs font-bold text-vault-900" style={{ width: LABEL }} aria-expanded={open}>
                    <ChevronDown className={`size-3.5 shrink-0 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" /><span className="truncate">{T(s.title)}</span><span className="ms-auto font-mono text-muted">{sp}%</span>
                  </button>
                  <div className="relative" style={{ width: W }}>
                    <Grid months={months} now={now} />
                    <span className="absolute top-2.5 h-3 rounded-sm bg-vault-900/80" style={{ insetInlineStart: x(a), width: Math.max(zoom, x(b) - x(a) + zoom) }}>
                      <span className="absolute inset-y-0 start-0 rounded-sm bg-molecule-400" style={{ width: `${sp}%` }} />
                    </span>
                  </div>
                </div>
                {open && items.map((it) => {
                  const c = crit.get(it.id)?.crit, pc = itemPct(it), late = !it.done && daysTo(it.due) < 0;
                  return (
                    <div key={it.id} className="flex h-7 border-b border-line/60">
                      <div className="sticky start-0 z-10 flex shrink-0 items-center gap-1.5 truncate border-e border-line bg-white px-2 text-[11px]" style={{ width: LABEL }} title={it.t}>
                        <span className="w-9 shrink-0 font-mono text-muted" dir="ltr">{it.code}</span>
                        <span className={`truncate ${it.done ? "text-muted line-through" : late ? "font-semibold text-red-700" : "text-ink"}`}>{T(it.t)}</span>
                      </div>
                      <div className="relative" style={{ width: W }}>
                        <Grid months={months} now={now} />
                        <span className={`absolute top-1.5 h-4 overflow-hidden rounded-sm ${c ? "bg-red-500/25 ring-1 ring-red-500" : "bg-molecule-500/25"}`} style={{ insetInlineStart: x(it.start!), width: Math.max(zoom, x(it.due!) - x(it.start!) + zoom) }}
                          title={`${it.code} · ${jd(it.start)} تا ${jd(it.due)} · ${pc}%`}>
                          <span className={`absolute inset-y-0 start-0 ${c ? "bg-red-500/80" : "bg-molecule-600"}`} style={{ width: `${pc}%` }} />
                        </span>
                        {it.base && it.base !== it.due && <span className="absolute top-1 h-5 w-0.5 bg-vault-900" style={{ insetInlineStart: x(it.base) + zoom }} title={`Baseline: ${jd(it.base)}`} />}
                        {it.gate && <span className="absolute top-1 text-[13px] leading-5 text-capsule-600" style={{ insetInlineStart: x(it.due!) + zoom + 2 }}>◆</span>}
                      </div>
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
      <p className="flex items-center gap-1.5 border-t border-line px-4 py-2 text-[11px] text-muted"><AlertTriangle className="size-3.5" aria-hidden="true" />نوار قرمز: فعالیت روی مسیر بحرانی (بدون شناوری). ◆: Gate. برای جزئیات و پیش‌نیازها از نمای «فهرست» استفاده کنید.</p>
    </section>
  );
}

function Grid({ months, now }: { months: { at: number }[]; now: number }) {
  return (
    <>
      {months.map((m) => <span key={m.at} className="absolute inset-y-0 w-px bg-line/70" style={{ insetInlineStart: m.at }} />)}
      <span className="absolute inset-y-0 z-[1] w-0.5 bg-red-600/80" style={{ insetInlineStart: now }} />
    </>
  );
}
