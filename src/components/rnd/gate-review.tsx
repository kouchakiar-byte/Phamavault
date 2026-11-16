"use client";

/*
 * The review of a formal gate: what the plan says (work, deliverables, lateness, high risks), the
 * checklist the committee answers, the meeting minutes, the actions agreed and the decision itself.
 * The project manager fills it in; managers read it. Members only ever see the decision.
 */
import { useState } from "react";
import { CheckCircle2, Printer, Trash2 } from "lucide-react";
import { CHECK_V, GATE, GATE_CHECKS, GATE_CHECKS_ANY, T, gateChecks, gateFacts, today, uid, type GateAction, type Stage } from "@/lib/rnd/model";
import { Cell, Select, btn, inp, pill, type Ctx } from "./fields";

function Area({ value, onSave, disabled, label, placeholder, rows = 3 }: { value?: string; onSave: (v: string) => void; disabled?: boolean; label: string; placeholder?: string; rows?: number }) {
  const v = value ?? "";
  return (
    <textarea key={v} className={`${inp} leading-relaxed`} rows={rows} defaultValue={v} disabled={disabled} aria-label={label} placeholder={placeholder}
      onBlur={(e) => e.target.value !== v && onSave(e.target.value)} />
  );
}

const Fact = ({ label, value, bad }: { label: string; value: string; bad?: boolean }) => (
  <div className={`rounded-lg border px-3 py-1.5 ${bad ? "border-red-200 bg-red-50" : "border-line bg-white"}`}>
    <div className="text-[11px] text-muted">{label}</div>
    <div className={`font-mono text-sm font-bold ${bad ? "text-red-700" : "text-vault-900"}`} dir="ltr" style={{ textAlign: "right" }}>{value}</div>
  </div>
);

export function GateReview({ ctx, s }: { ctx: Ctx; s: Stage }) {
  const { p } = ctx;
  const owner = ctx.viewer.role === "owner", g = s.gate;
  const checks = gateChecks(s), f = gateFacts(p, s);
  const fixed = new Set((GATE_CHECKS[s.key] ?? GATE_CHECKS_ANY).map(([k]) => k));
  const gateItem = s.items.find((i) => i.gate);
  const answered = checks.filter((c) => c.v).length, no = checks.filter((c) => c.v === "no").length;
  const [q, setQ] = useState("");
  const [act, setAct] = useState({ t: "", who: "" });
  const gate = (d: Record<string, unknown>) => ctx.send([{ op: "gate", stage: s.key, ...d }]);
  const actions = g.actions ?? [];
  const saveActions = (a: GateAction[]) => gate({ actions: a });
  const decide = (v: string) => {
    if (v === "go" && (answered < checks.length || no)) {
      const why = [answered < checks.length && `${checks.length - answered} پرسش بی‌پاسخ`, no && `${no} پاسخ «خیر»`].filter(Boolean).join(" و ");
      if (!window.confirm(`چک‌لیست این Gate ${why} دارد. Go با این وضعیت ثبت شود؟ شرایط Go را در صورت‌جلسه بنویسید.`)) return;
    }
    ctx.send([{ op: "stage", stage: s.key, decision: v, by: g.by, date: g.date || today(), note: g.note }]);
  };

  return (
    <div data-gate={s.key} className="m-4 mt-0 rounded-lg border border-capsule-400/50 bg-capsule-50/40 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-vault-900">بازبینی Gate{gateItem ? <span className="font-normal"> — {T(gateItem.t)}</span> : null}</div>
          <p className="text-xs text-muted">کمیته با چک‌لیست و داده‌های برنامه تصمیم می‌گیرد: Go، Hold یا No-go.</p>
        </div>
        {ctx.gateHref && <a href={ctx.gateHref(s.key)} className={btn}><Printer className="size-3.5" aria-hidden="true" />صورت‌جلسه (چاپ یا PDF)</a>}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Fact label="فعالیت‌های انجام‌شده" value={`${f.done} / ${f.total}`} bad={f.done < f.total} />
        <Fact label="خروجی‌های باقی‌مانده" value={String(f.outs.length)} bad={f.outs.length > 0} />
        <Fact label="فعالیت عقب‌افتاده" value={String(f.late)} bad={f.late > 0} />
        <Fact label="ریسک بالای باز (≥ 15)" value={String(f.highRisks)} bad={f.highRisks > 0} />
      </div>
      {f.outs.length > 0 && (
        <p className="mt-2 text-xs text-muted">خروجی‌های آماده‌نشده: {f.outs.map((o) => `${o.code ?? ""} ${T(o.out)}`.trim()).join("، ")}</p>
      )}

      <h4 className="mb-1.5 mt-4 flex items-center justify-between text-xs font-bold text-vault-900">
        <span>چک‌لیست Gate</span>
        <span className={`${pill} ${no ? "bg-red-50 text-red-700" : answered === checks.length ? "bg-emerald-50 text-emerald-700" : "bg-vault-50 text-muted"}`}>{answered} از {checks.length} پاسخ داده شده{no ? ` · ${no} خیر` : ""}</span>
      </h4>
      <ul className="divide-y divide-line rounded-lg border border-line bg-white">
        {checks.map((c) => (
          <li key={c.k} className="grid gap-2 px-3 py-2 sm:grid-cols-[minmax(0,1fr)_7rem_14rem_1.5rem] sm:items-center">
            <span className="text-sm text-vault-900">{c.v === "yes" && <CheckCircle2 className="me-1 inline size-4 text-emerald-600" aria-hidden="true" />}{T(c.t)}</span>
            <Select value={c.v} options={CHECK_V} label={`پاسخ: ${c.t}`} disabled={!owner} onSave={(v) => gate({ checks: [{ k: c.k, v }] })}
              className={c.v === "no" ? "!border-red-300 !text-red-700" : c.v === "yes" ? "!border-emerald-300" : ""} />
            <Cell value={c.note} label={`توضیح: ${c.t}`} placeholder="شاهد یا توضیح" disabled={!owner} onSave={(v) => gate({ checks: [{ k: c.k, note: v }] })} />
            {owner && !fixed.has(c.k)
              ? <button type="button" className="text-muted hover:text-red-600" aria-label="حذف پرسش" onClick={() => gate({ delCheck: c.k })}><Trash2 className="size-4" /></button>
              : <span />}
          </li>
        ))}
      </ul>
      {owner && (
        <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { gate({ addCheck: q }); setQ(""); } }}>
          <input className={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="افزودن پرسش به چک‌لیست این Gate…" aria-label="پرسش جدید" />
          <button className={btn} type="submit">افزودن</button>
        </form>
      )}

      <h4 className="mb-1.5 mt-4 text-xs font-bold text-vault-900">صورت‌جلسه</h4>
      <div className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <Cell type="date" value={g.meet} label="تاریخ جلسه" disabled={!owner} onSave={(v) => gate({ meet: v })} />
        <Cell value={g.attendees} label="حاضران" placeholder="حاضران جلسه (نام و واحد)" disabled={!owner} onSave={(v) => gate({ attendees: v })} />
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <Area value={g.summary} label="خلاصه بحث" placeholder="خلاصه بحث و یافته‌های کلیدی" disabled={!owner} onSave={(v) => gate({ summary: v })} />
        <Area value={g.cond} label="شرایط تصمیم" placeholder="شرایط Go یا دلیل Hold / No-go" disabled={!owner} onSave={(v) => gate({ cond: v })} />
      </div>

      <h4 className="mb-1.5 mt-4 text-xs font-bold text-vault-900">اقدامات مصوب</h4>
      {actions.length > 0 ? (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {actions.map((a, i) => {
            const set = (d: Partial<GateAction>) => saveActions(actions.map((x, j) => (j === i ? { ...x, ...d } : x)));
            return (
              <li key={a.id} className="grid gap-2 px-3 py-2 sm:grid-cols-[1.5rem_minmax(0,1fr)_10rem_9rem_1.5rem] sm:items-center">
                <input type="checkbox" className="size-4 accent-molecule-600" checked={Boolean(a.done)} disabled={!owner} aria-label="انجام شد" onChange={(e) => set({ done: e.target.checked })} />
                <Cell value={a.t} label="اقدام" disabled={!owner} onSave={(v) => set({ t: v })} className={a.done ? "line-through" : ""} />
                <Cell value={a.who} label="مسئول اقدام" placeholder="مسئول" disabled={!owner} onSave={(v) => set({ who: v })} />
                <Cell type="date" value={a.due} label="موعد اقدام" disabled={!owner} onSave={(v) => set({ due: v })} />
                {owner ? <button type="button" className="text-muted hover:text-red-600" aria-label="حذف اقدام" onClick={() => saveActions(actions.filter((_, j) => j !== i))}><Trash2 className="size-4" /></button> : <span />}
              </li>
            );
          })}
        </ul>
      ) : <p className="text-xs text-muted">اقدامی ثبت نشده است.</p>}
      {owner && (
        <form className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem_auto]"
          onSubmit={(e) => { e.preventDefault(); if (act.t.trim()) { saveActions([...actions, { id: uid("a"), t: act.t, who: act.who, done: false }]); setAct({ t: "", who: "" }); } }}>
          <input className={inp} value={act.t} onChange={(e) => setAct({ ...act, t: e.target.value })} placeholder="اقدام جدید (مثلاً تکمیل داده پایداری 3 ماهه)" aria-label="اقدام جدید" />
          <input className={inp} value={act.who} onChange={(e) => setAct({ ...act, who: e.target.value })} placeholder="مسئول" aria-label="مسئول اقدام جدید" />
          <button className={btn} type="submit">افزودن اقدام</button>
        </form>
      )}

      <h4 className="mb-1.5 mt-4 text-xs font-bold text-vault-900">تصمیم</h4>
      <div className="grid gap-2 sm:grid-cols-[11rem_10rem_10rem_minmax(0,1fr)]">
        <Select value={g.decision} options={GATE} label="تصمیم" disabled={!owner} onSave={decide} />
        <Cell value={g.by} label="تصمیم‌گیرنده" placeholder="تصمیم‌گیرنده" disabled={!owner} onSave={(v) => ctx.send([{ op: "stage", stage: s.key, decision: g.decision, by: v, date: g.date, note: g.note }])} />
        <Cell type="date" value={g.date} label="تاریخ تصمیم" disabled={!owner} onSave={(v) => ctx.send([{ op: "stage", stage: s.key, decision: g.decision, by: g.by, date: v, note: g.note }])} />
        <Cell value={g.note} label="شرح تصمیم" placeholder="شرح کوتاه تصمیم" disabled={!owner} onSave={(v) => ctx.send([{ op: "stage", stage: s.key, decision: g.decision, by: g.by, date: g.date, note: v }])} />
      </div>
    </div>
  );
}
