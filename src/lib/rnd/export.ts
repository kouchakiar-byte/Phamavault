/*
 * R&D projects as Excel workbooks: one project with every register on its own sheet, or the whole
 * portfolio on one sheet. The caller passes the copy the reader may see (a member's filtered copy
 * holds only their unit's work), so nothing here decides access. Dates are written in the Solar
 * Hijri calendar, as the workspace shows them; numbers stay numbers so they can be summed.
 */
import { xlsx, type XCell, type XSheet } from "@/lib/xlsx";
import { toJalali } from "./jalali";
import {
  CHECK_V, GATE, HEALTH, LISTS, LIST_KEYS, P_STATUS, P_TYPE, PRIO, RACI_UNITS, UNITS, addMonths, curStage, daysTo,
  gateChecks, health, isGateStage, plannedAt, progress, raciIssue, raciRow, riskScore, spent, sv, today, nowMs,
  type ListKey, type Project, type Row,
} from "./model";
import { activityStatus, cpm, type ActivityStatus } from "./schedule";

const J = (iso?: unknown) => (typeof iso === "string" && iso ? toJalali(iso) : "");
const STATUS: Record<ActivityStatus, string> = {
  done: "انجام‌شده", late: "عقب‌افتاده", active: "در جریان", waiting: "منتظر پیش‌نیاز", ready: "آماده شروع", upcoming: "شروع‌نشده",
};
const ANSWER = Object.fromEntries(CHECK_V);
const num = (v: unknown) => (v === "" || v == null || !Number.isFinite(+v) ? (v as XCell) : +v);

function summary(p: Project): XSheet {
  const items = p.stages.flatMap((s) => s.items);
  const cur = p.stages[curStage(p)];
  const rows: [string, XCell][] = [
    ["نام پروژه", p.name], ["کد پروژه", p.code], ["نوع", P_TYPE[p.type]], ["شکل دارویی", p.form], ["قدرت", p.strength],
    ["اولویت", PRIO[p.priority]], ["وضعیت", P_STATUS[p.status]], ["مسئول پروژه", p.lead], ["درخواست‌دهنده", p.requester],
    ["محصول مرجع (RLD)", p.rld], ["بازار هدف", p.market],
    ["تاریخ اعلام", J(p.start)], ["تاریخ هدف", J(p.target)], ["روز تا تاریخ هدف", p.target ? daysTo(p.target) : ""],
    ["سلامت برنامه", HEALTH[health(p)].label], ["فاز جاری", cur?.title ?? "تکمیل"],
    ["پیشرفت واقعی (%)", p.overall ?? progress(p)],
  ];
  if (!p.partial) {
    rows.push(["طبق برنامه تا امروز (%)", Math.round(plannedAt(p, nowMs()))], ["انحراف از برنامه (%)", sv(p)]);
    if (p.budget) rows.push(["بودجه", p.budget], ["هزینه ثبت‌شده", spent(p)], ["واحد مبلغ", p.unit]);
  }
  rows.push(["فعالیت‌ها", `${items.filter((i) => i.done).length} از ${items.length} انجام شده`], ["تاریخ خروجی", J(today())]);
  if (p.partial) rows.push(["توضیح", "این فایل فقط کار واحد شماست؛ پیشرفت کل پروژه را مدیر پروژه محاسبه می‌کند."]);
  return { name: "خلاصه", head: ["مورد", "مقدار"], rows, widths: [26, 60] };
}

function activities(p: Project): XSheet {
  const crit = p.partial ? new Map() : cpm(p);
  const rows: XCell[][] = [];
  for (const s of p.stages)
    for (const it of s.items)
      rows.push([
        it.code, s.title, it.t, UNITS[it.unit], it.owner, J(it.start), J(it.due), it.dur, (it.deps ?? []).join("، "),
        it.done ? 100 : (it.pct ?? 0), STATUS[activityStatus(p, it)], J(it.aStart), J(it.doneAt), J(it.base),
        crit.get(it.id)?.crit ? "بله" : "", it.out, it.doc, it.pri ? PRIO[it.pri] : "", it.gate ? "Gate" : "", it.note,
      ]);
  return {
    name: "فعالیت‌ها",
    head: ["کد", "فاز", "فعالیت", "واحد مسئول", "مسئول", "شروع برنامه", "پایان برنامه", "مدت (روز)", "پیش‌نیازها", "پیشرفت (%)", "وضعیت", "شروع واقعی", "پایان واقعی", "پایان Baseline", "مسیر بحرانی", "خروجی", "کد سند", "اولویت", "نوع", "یادداشت"],
    rows,
    widths: [7, 24, 48, 16, 16, 12, 12, 9, 14, 10, 14, 12, 12, 12, 10, 26, 14, 9, 7, 30],
  };
}

function gates(p: Project): XSheet[] {
  const head = ["فاز", "تصمیم", "تصمیم‌گیرنده", "تاریخ تصمیم", "شرح"];
  const decisions: XSheet = {
    name: "Gateها",
    head: p.partial ? ["فاز", "تصمیم"] : [...head, "تاریخ جلسه", "حاضران", "پاسخ‌های چک‌لیست", "شرایط تصمیم", "اقدامات باز"],
    rows: p.stages.map((s) => {
      const g = s.gate;
      if (p.partial) return [s.title, GATE[g.decision]];
      const checks = isGateStage(s) ? gateChecks(s) : [];
      return [
        s.title, GATE[g.decision], g.by, J(g.date), g.note, J(g.meet), g.attendees,
        checks.length ? `${checks.filter((c) => c.v).length} از ${checks.length}${checks.some((c) => c.v === "no") ? ` (${checks.filter((c) => c.v === "no").length} خیر)` : ""}` : "",
        g.cond, (g.actions ?? []).filter((a) => !a.done).length || "",
      ];
    }),
    widths: p.partial ? [30, 22] : [28, 20, 18, 12, 30, 12, 30, 16, 36, 10],
  };
  if (p.partial) return [decisions];
  const checks: XSheet = {
    name: "چک‌لیست Gate",
    head: ["فاز", "پرسش", "پاسخ", "توضیح یا شاهد"],
    rows: p.stages.filter(isGateStage).flatMap((s) => gateChecks(s).map((c) => [s.title, c.t, ANSWER[c.v] ?? "", c.note])),
    widths: [28, 60, 10, 36],
  };
  const actions: XSheet = {
    name: "اقدامات Gate",
    head: ["فاز", "اقدام", "مسئول", "موعد", "وضعیت"],
    rows: p.stages.flatMap((s) => (s.gate.actions ?? []).map((a) => [s.title, a.t, a.who, J(a.due), a.done ? "انجام شد" : "باز"])),
    widths: [28, 50, 18, 12, 10],
  };
  return [decisions, checks, actions];
}

function raci(p: Project): XSheet {
  return {
    name: "RACI",
    head: ["فاز", ...RACI_UNITS.map((u) => UNITS[u]), "بررسی"],
    rows: p.stages.map((s) => {
      const row = raciRow(p, s.key);
      return [s.title, ...RACI_UNITS.map((u) => (row[u] === "AR" ? "A/R" : row[u] ?? "")), raciIssue(row) ?? "درست"];
    }),
    widths: [30, ...RACI_UNITS.map(() => 14), 22],
  };
}

function register(p: Project, k: ListKey): XSheet {
  const L = LISTS[k];
  return {
    name: L.title.replace(/\s*\(.*\)$/, ""),
    head: [...L.cols.map((c) => c.l), "واحد"],
    rows: (p[k] as Row[]).map((r) => [
      ...L.cols.map((c) => (c.t === "calc" ? riskScore(r) : c.t === "date" ? J(r[c.k]) : c.t === "num" ? num(r[c.k]) : c.o ? c.o[String(r[c.k])] ?? (r[c.k] as XCell) : (r[c.k] as XCell))),
      UNITS[r.unit],
    ]),
  };
}

function stability(p: Project): XSheet {
  const rows: XCell[][] = [];
  for (const st of p.stability)
    for (const m of st.months) {
      const r = st.results[m] ?? {};
      const other = Object.entries(r).filter(([k]) => k !== "assay" && k !== "ok").map(([k, v]) => `${k}: ${v}`).join("؛ ");
      rows.push([st.cond, st.batches, m, J(st.start ? addMonths(st.start, m) : ""), st.done.includes(m) ? "انجام شد" : "", num(r.assay), `${st.specMin}–${st.specMax}`, r.ok === "fail" ? "خارج از حد" : r.ok === "pass" ? "منطبق" : "", other]);
    }
  return { name: "پایداری", head: ["شرایط", "بچ‌ها", "ماه", "موعد نمونه‌برداری", "وضعیت", "Assay (%)", "حدود Assay", "نتیجه", "سایر نتایج"], rows, widths: [30, 16, 6, 14, 10, 10, 12, 12, 40] };
}

function log(p: Project): XSheet {
  const KIND: Record<string, string> = { note: "یادداشت", decision: "تصمیم", issue: "مشکل", auto: "سیستم" };
  return { name: "تاریخچه", head: ["تاریخ", "نوع", "شرح", "واحد", "ثبت‌کننده"], rows: p.events.map((e) => [J(e.date), KIND[e.kind] ?? e.kind, e.text, UNITS[e.unit], e.by]), widths: [12, 10, 70, 16, 18] };
}

/** Every sheet of one project, as the reader may see it. */
export function projectWorkbook(p: Project): Uint8Array {
  const sheets: XSheet[] = [summary(p), activities(p), ...gates(p), raci(p)];
  for (const k of LIST_KEYS) if (!(LISTS[k].ownerOnly && p.partial)) sheets.push(register(p, k));
  if (p.stability.length || !p.partial) sheets.push(stability(p));
  sheets.push(log(p));
  return xlsx(sheets, { title: `${p.name}${p.code ? ` (${p.code})` : ""}` });
}

/** All projects on one sheet: where each stands, for a portfolio meeting. */
export function portfolioWorkbook(ps: Project[]): Uint8Array {
  const rows = ps.map((p) => {
    const cur = p.stages[curStage(p)], items = p.stages.flatMap((s) => s.items);
    const late = items.filter((i) => !i.done && daysTo(i.due) < 0).length;
    const high = p.risks.filter((r) => r.status !== "closed" && riskScore(r) >= 15).length;
    return [
      p.code, p.name, P_TYPE[p.type], p.form, PRIO[p.priority], P_STATUS[p.status], p.lead, HEALTH[health(p)].label, cur?.title ?? "تکمیل",
      progress(p), Math.round(plannedAt(p, nowMs())), sv(p), `${items.filter((i) => i.done).length} / ${items.length}`, late, high,
      J(p.start), J(p.target), p.target ? daysTo(p.target) : "", p.budget || "", spent(p) || "", p.unit,
    ];
  });
  return xlsx([{
    name: "پروژه‌ها",
    head: ["کد", "نام پروژه", "نوع", "شکل دارویی", "اولویت", "وضعیت", "مسئول", "سلامت برنامه", "فاز جاری", "پیشرفت (%)", "طبق برنامه (%)", "انحراف (%)", "فعالیت‌ها", "فعالیت عقب‌افتاده", "ریسک بالای باز", "اعلام", "هدف", "روز تا هدف", "بودجه", "هزینه", "واحد مبلغ"],
    rows,
    widths: [14, 34, 16, 16, 8, 10, 16, 14, 26, 10, 12, 10, 10, 12, 12, 12, 12, 10, 12, 12, 12],
  }], { title: "پروژه‌های تحقیق و توسعه" });
}
