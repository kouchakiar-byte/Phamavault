"use client";

import { useMemo, useState, type DragEvent } from "react";
import { BellRing, CheckCheck, CircleCheck, Columns3, ExternalLink, ListChecks, Play } from "lucide-react";
import { rndApply, rndReadNotices } from "@/lib/rnd/actions";
import { toJalali } from "@/lib/rnd/jalali";
import { T, UNITS, daysTo, itemPct } from "@/lib/rnd/model";
import { activityStatus, type ActivityStatus } from "@/lib/rnd/schedule";
import type { MyTask, RndNotice } from "@/lib/rnd/server";
import { Bar, C } from "./charts";
import { btn, inp, panel, pill } from "./fields";

const STATUS: Record<ActivityStatus, { label: string; tone: string }> = {
  late: { label: "عقب‌افتاده", tone: "bg-red-50 text-red-700" },
  active: { label: "در جریان", tone: "bg-molecule-50 text-molecule-700" },
  ready: { label: "آماده شروع", tone: "bg-sky-50 text-sky-700" },
  waiting: { label: "منتظر پیش‌نیاز", tone: "bg-amber-50 text-amber-700" },
  upcoming: { label: "شروع‌نشده", tone: "bg-vault-50 text-muted" },
  done: { label: "انجام‌شده", tone: "bg-emerald-50 text-emerald-700" },
};
const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);
const jd = (iso?: string) => (iso ? toJalali(iso) : "—");
type Column = "todo" | "active" | "late" | "done";
const colOf = (s: ActivityStatus): Column => (s === "done" ? "done" : s === "late" ? "late" : s === "active" ? "active" : "todo");
const COLS: { k: Column; title: string; hint: string }[] = [
  { k: "todo", title: "شروع‌نشده", hint: "آماده، منتظر پیش‌نیاز یا بعدی" },
  { k: "active", title: "در جریان", hint: "پیشرفت ثبت شده" },
  { k: "late", title: "عقب‌افتاده", hint: "موعد گذشته" },
  { k: "done", title: "انجام‌شده", hint: "" },
];

/** The reader's own work across projects: what is late, what is due this week, what comes next, and what was asked of them. */
export function MyTasks({ initial, notices: initialNotices, projectHref, role }: { initial: MyTask[]; notices: RndNotice[]; projectHref: string; role: string }) {
  const [tasks, setTasks] = useState(initial);
  const [notices, setNotices] = useState(initialNotices);
  const [view, setView] = useState<"list" | "board">("list");
  const [project, setProject] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState<string | null>(null);
  const projects = useMemo(() => [...new Map(tasks.map((t) => [t.project, t.projectName])).entries()], [tasks]);
  const shown = tasks.filter((t) => (!project || t.project === project) && (!onlyMine || t.mine === "assigned") && (t.status !== "done" || daysTo(t.item.doneAt) > -14));
  const unread = notices.filter((n) => !n.read);
  const open = (t: MyTask) => `${projectHref}?id=${t.project}`;

  async function update(t: MyTask, data: Record<string, unknown>) {
    setBusy(t.item.id); setErr("");
    const r = await rndApply(t.project, [{ op: "item", stage: t.stage, item: t.item.id, ...data }]).catch(() => null);
    setBusy(null);
    if (!r?.ok) { setErr("ذخیره نشد. اتصال یا دسترسی را بررسی کنید."); return; }
    const p = r.project, it = p.stages.flatMap((s) => s.items).find((x) => x.id === t.item.id);
    if (it) setTasks((all) => all.map((x) => (x.item.id === it.id ? { ...x, item: it, status: activityStatus(p, it) } : x)));
  }
  const moveTo = (t: MyTask, c: Column) => {
    if (c === "done" && !t.item.done) update(t, { done: true });
    else if (c === "active" && (t.item.done || itemPct(t.item) === 0)) update(t, t.item.done ? { pct: 90 } : { pct: 10 });
    else if (c === "todo" && (t.item.done || itemPct(t.item) > 0)) update(t, { pct: 0 });
  };

  const counts = {
    late: shown.filter((t) => t.status === "late").length,
    week: shown.filter((t) => t.status !== "done" && t.status !== "late" && daysTo(t.item.due) <= 7).length,
    active: shown.filter((t) => t.status === "active").length,
    waiting: shown.filter((t) => t.status === "waiting").length,
    done: shown.filter((t) => t.status === "done").length,
  };
  const groups: [string, string, MyTask[]][] = [
    ["late", "عقب‌افتاده", shown.filter((t) => t.status === "late")],
    ["week", "موعد تا 7 روز آینده", shown.filter((t) => t.status !== "done" && t.status !== "late" && daysTo(t.item.due) <= 7)],
    ["next", "بعدی", shown.filter((t) => t.status !== "done" && t.status !== "late" && !(daysTo(t.item.due) <= 7))],
    ["done", "انجام‌شده در 14 روز اخیر", shown.filter((t) => t.status === "done")],
  ];

  return (
    <div className="flex flex-col gap-4">
      {unread.length > 0 && (
        <section className={`${panel} border-molecule-500/60 bg-molecule-50/40`}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-bold text-vault-900"><BellRing className="size-5 text-molecule-600" aria-hidden="true" />اعلان‌های تازه ({unread.length})</h2>
            <button type="button" className={btn} onClick={async () => { await rndReadNotices(); setNotices((n) => n.map((x) => ({ ...x, read: true }))); }}><CheckCheck className="size-3.5" aria-hidden="true" />همه خوانده شد</button>
          </div>
          <ul className="flex flex-col gap-1.5 text-sm">
            {unread.slice(0, 12).map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2">
                <span className="min-w-0">{T(n.text)}<span className="block text-[11px] text-muted" dir="ltr" style={{ textAlign: "right" }}>{new Date(n.at).toLocaleString("fa-IR-u-ca-persian-nu-latn", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tehran" })}</span></span>
                <a href={`${projectHref}?id=${n.project}`} className={`${btn} shrink-0`} onClick={() => rndReadNotices([n.id])}>باز کردن</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {([["عقب‌افتاده", counts.late, counts.late ? "text-red-700" : "text-emerald-700"], ["موعد این هفته", counts.week, counts.week ? "text-amber-700" : "text-vault-900"], ["در جریان", counts.active, "text-molecule-700"], ["منتظر پیش‌نیاز", counts.waiting, "text-vault-900"], ["انجام‌شده (14 روز)", counts.done, "text-emerald-700"]] as const).map(([l, v, c]) => (
          <div key={l} className="rounded-lg border border-line bg-white px-3 py-2"><div className="text-xs text-muted">{l}</div><div className={`font-mono text-2xl font-extrabold ${c}`}>{v}</div></div>
        ))}
      </section>

      <section className={`${panel} flex flex-wrap items-center gap-2`}>
        <select className={`${inp} !w-auto`} value={project} onChange={(e) => setProject(e.target.value)} aria-label="پروژه">
          <option value="">همه پروژه‌ها</option>
          {projects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        {role === "member" && (
          <label className={`${btn} cursor-pointer ${onlyMine ? "!border-molecule-500 !bg-molecule-50" : ""}`}>
            <input type="checkbox" className="sr-only" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />فقط کارهایی که به نام من است
          </label>
        )}
        <div className="ms-auto flex rounded-full border border-line p-0.5" role="group" aria-label="نمایش">
          {([["list", "فهرست", ListChecks], ["board", "Kanban", Columns3]] as const).map(([k, l, Icon]) => (
            <button key={k} type="button" onClick={() => setView(k)} aria-pressed={view === k} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${view === k ? "bg-vault-900 text-white" : "text-vault-900"}`}>
              <Icon className="size-3.5" aria-hidden="true" />{l}
            </button>
          ))}
        </div>
      </section>
      {err && <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}

      {view === "list" ? (
        groups.map(([k, title, list]) => list.length > 0 && (
          <section key={k} className={panel}>
            <h2 className={`mb-3 text-base font-bold ${k === "late" ? "text-red-700" : k === "week" ? "text-amber-700" : "text-vault-900"}`}>{title} <span className="font-mono">({list.length})</span></h2>
            <ul className="flex flex-col gap-2">{list.map((t) => <TaskCard key={t.item.id} t={t} busy={busy === t.item.id} update={update} href={open(t)} />)}</ul>
          </section>
        ))
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COLS.map((c) => {
            const list = shown.filter((t) => colOf(t.status) === c.k);
            return (
              <section key={c.k} className={`${panel} !p-3 ${drag ? "outline-dashed outline-1 outline-line" : ""}`}
                onDragOver={(e) => { if (c.k !== "late") e.preventDefault(); }}
                onDrop={(e: DragEvent) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain") || drag; const t = tasks.find((x) => x.item.id === id); setDrag(null); if (t && c.k !== "late") moveTo(t, c.k); }}>
                <h2 className={`mb-1 flex items-center justify-between text-sm font-bold ${c.k === "late" ? "text-red-700" : "text-vault-900"}`}>{c.title}<span className="rounded-full bg-vault-50 px-2 font-mono text-xs">{list.length}</span></h2>
                {c.hint && <p className="mb-2 text-[11px] text-muted">{c.hint}</p>}
                <ul className="flex flex-col gap-2">
                  {list.map((t) => (
                    <li key={t.item.id} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.item.id); e.dataTransfer.effectAllowed = "move"; setDrag(t.item.id); }} onDragEnd={() => setDrag(null)} className="cursor-grab rounded-lg border border-line bg-white p-2.5 text-sm active:cursor-grabbing">
                      <div className="flex items-start justify-between gap-2"><span className="font-mono text-[11px] text-muted" dir="ltr">{t.item.code}</span>{t.item.pri === "high" && <span className={`${pill} bg-red-50 text-red-700`}>فوری</span>}</div>
                      <div className="font-medium leading-6">{T(t.item.t)}</div>
                      <div className="truncate text-[11px] text-muted">{T(t.projectName)}</div>
                      <div className="mt-1.5 flex items-center gap-2"><Bar value={itemPct(t.item)} tone={t.status === "late" ? C.bad : itemPct(t.item) >= 100 ? C.ok : undefined} /><span className="font-mono text-[11px]">{itemPct(t.item)}%</span></div>
                      <div className={`mt-1 text-[11px] ${t.status === "late" ? "font-bold text-red-700" : "text-muted"}`}>موعد: <bdi dir="ltr" className="font-mono">{jd(t.item.due)}</bdi>{!t.item.done && t.item.due ? ` · ${when(daysTo(t.item.due))}` : ""}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {!t.item.done && itemPct(t.item) === 0 && <button type="button" disabled={busy === t.item.id} className={btn} onClick={() => update(t, { pct: 10 })}><Play className="size-3" aria-hidden="true" />شروع</button>}
                        {!t.item.done && <button type="button" disabled={busy === t.item.id} className={btn} onClick={() => update(t, { done: true })}><CircleCheck className="size-3" aria-hidden="true" />انجام شد</button>}
                        <a href={open(t)} className={btn}><ExternalLink className="size-3" aria-hidden="true" /></a>
                      </div>
                    </li>
                  ))}
                  {!list.length && <li className="py-4 text-center text-xs text-muted">—</li>}
                </ul>
              </section>
            );
          })}
        </div>
      )}
      {!shown.length && <p className={`${panel} text-center text-sm text-muted`}>فعلاً کاری به شما واگذار نشده است.</p>}
      {view === "board" && <p className="text-xs text-muted">کارت‌ها را بین ستون‌ها بکشید یا از دکمه‌ها استفاده کنید. ستون «عقب‌افتاده» خودکار پر می‌شود.</p>}
    </div>
  );
}

function TaskCard({ t, busy, update, href }: { t: MyTask; busy: boolean; update: (t: MyTask, d: Record<string, unknown>) => void; href: string }) {
  const it = t.item, pc = itemPct(it), S = STATUS[t.status];
  return (
    <li className={`rounded-lg border p-3 ${t.status === "late" ? "border-red-200 bg-red-50/40" : "border-line"}`}>
      <div className="flex flex-wrap items-start gap-3">
        <input type="checkbox" className="mt-1 size-5 accent-molecule-600" checked={it.done} disabled={busy} aria-label={`انجام شد: ${it.t}`} onChange={(e) => update(t, { done: e.target.checked })} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted" dir="ltr">{it.code}</span>
            <span className={`text-sm font-semibold ${it.done ? "text-muted line-through" : "text-ink"}`}>{T(it.t)}</span>
            <span className={`${pill} ${S.tone}`}>{S.label}</span>
            {it.pri === "high" && <span className={`${pill} bg-red-50 text-red-700`}>فوری</span>}
            {t.mine === "assigned" && <span className={`${pill} bg-capsule-50 text-capsule-700`}>به نام شما</span>}
          </div>
          <div className="mt-0.5 text-xs text-muted">{T(t.projectName)} · {T(t.stageTitle)} · {UNITS[it.unit]}{it.out ? ` · خروجی: ${T(it.out)}` : ""}</div>
          <div className={`mt-1 text-xs ${t.status === "late" ? "font-bold text-red-700" : "text-muted"}`}>
            <bdi dir="ltr" className="font-mono">{jd(it.start)}</bdi> تا <bdi dir="ltr" className="font-mono">{jd(it.due)}</bdi>{!it.done && it.due ? ` · ${when(daysTo(it.due))}` : ""}
            {t.waiting.length > 0 && <span className="ms-2 text-amber-700">منتظر: <bdi dir="ltr" className="font-mono">{t.waiting.join(", ")}</bdi></span>}
          </div>
        </div>
        <a href={href} className={`${btn} shrink-0`}><ExternalLink className="size-3.5" aria-hidden="true" />در پروژه</a>
      </div>
      {!it.done && (
        <div className="mt-2 flex flex-wrap items-center gap-2 ps-8">
          <span className="w-28"><Bar value={pc} tone={t.status === "late" ? C.bad : undefined} /></span>
          <span className="w-9 font-mono text-xs">{pc}%</span>
          <span className="text-xs text-muted">ثبت پیشرفت:</span>
          {[25, 50, 75].map((v) => (
            <button key={v} type="button" disabled={busy || pc === v} className={`${btn} !px-2 font-mono ${pc === v ? "!bg-molecule-50" : ""}`} onClick={() => update(t, { pct: v })}>{v}%</button>
          ))}
          <button type="button" disabled={busy} className={`${btn} !border-emerald-300 !text-emerald-700`} onClick={() => update(t, { done: true })}><CircleCheck className="size-3.5" aria-hidden="true" />انجام شد</button>
        </div>
      )}
    </li>
  );
}
