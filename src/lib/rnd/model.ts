/*
 * R&D project management: the shape of a project, the stage-gate template, the
 * departments (units) that own each task and register, and the schedule
 * arithmetic (weighted progress, planned curve, health, deadlines). Shared by
 * the server (filtering, alerts) and the browser (charts).
 */

export type Unit = "pm" | "form" | "anal" | "qa" | "purch" | "reg" | "prod";
export type Role = "owner" | "manager" | "member";

export const UNITS: Record<Unit, string> = {
  pm: "مدیریت پروژه",
  form: "فرمولاسیون",
  anal: "آنالیز و QC",
  qa: "تضمین کیفیت (QA)",
  purch: "خرید و تأمین",
  reg: "ثبت و رگولاتوری",
  prod: "تولید",
};
export const MEMBER_UNITS = (Object.keys(UNITS) as Unit[]).filter((u) => u !== "pm");
export const isUnit = (u: unknown): u is Unit => typeof u === "string" && u in UNITS;

export type Comment = { by: string; name: string; unit: string; at: number; text: string };
export type Item = { id: string; t: string; done: boolean; doneAt?: string; owner?: string; due?: string; unit: Unit; comments?: Comment[] };
export type Gate = { decision: "pending" | "go" | "hold" | "nogo"; by?: string; date?: string; note?: string };
export type Stage = { key: string; title: string; w: number; due: string; gate: Gate; items: Item[] };
export type Row = { id: string; unit: Unit; [k: string]: unknown };
export type Study = { id: string; cond: string; months: number[]; start: string; done: number[]; results: Record<string, Record<string, string>>; specMin: number; specMax: number; batches?: string };
export type Event = { id: string; date: string; kind: "note" | "decision" | "issue" | "auto"; text: string; at: number; unit: Unit; by?: string };

export type Project = {
  id: string;
  name: string;
  code?: string;
  form?: string;
  strength?: string;
  type: string;
  priority: "high" | "medium" | "low";
  lead?: string;
  requester?: string;
  market?: string;
  rld?: string;
  team?: string;
  start: string;
  target: string;
  status: "active" | "hold" | "done" | "cancelled";
  notes?: string;
  budget?: number;
  unit?: string;
  stages: Stage[];
  trials: Row[];
  methods: Row[];
  purchases: Row[];
  batches: Row[];
  risks: Row[];
  docs: Row[];
  costs: Row[];
  stability: Study[];
  events: Event[];
  createdAt: number;
  updatedAt: number;
  /** Members see a filtered copy: these say what was left out. */
  partial?: boolean;
  /** For a filtered copy: the whole project's weighted progress, worked out on the server. */
  overall?: number;
};

export const O = (s: string): Record<string, string> => Object.fromEntries(s.split("|").map((x) => x.split(":")));
export const P_STATUS = O("active:در جریان|hold:متوقف|done:تکمیل|cancelled:لغو");
export const P_TYPE = O("generic:ژنریک|new:فرمولاسیون جدید|ext:توسعه خط تولید|transfer:انتقال تکنولوژی|reform:اصلاح فرمول");
export const PRIO = O("high:بالا|medium:متوسط|low:پایین");
export const GATE = O("pending:در انتظار|go:Go — ادامه|hold:Hold — توقف موقت|nogo:No-go — خاتمه");
export const EV_KIND = O("note:یادداشت|decision:تصمیم|issue:مشکل|auto:سیستم");

type T = [string, Unit];
export const STAGES: { key: string; title: string; w: number; items: T[] }[] = [
  { key: "brief", title: "اعلام و Brief پروژه", w: 4, items: [["دریافت درخواست رسمی و ثبت پروژه", "pm"], ["تعریف محصول: شکل دارویی، قدرت، بسته‌بندی", "pm"], ["بررسی محصول مرجع (RLD) و فرآورده‌های ثبت‌شده", "reg"], ["تعیین مسئول و تیم پروژه", "pm"], ["تصویب برنامه زمانی و بودجه", "pm"]] },
  { key: "feas", title: "امکان‌سنجی و QTPP", w: 6, items: [["بررسی فنی و ثبتی", "reg"], ["بررسی Patent و انحصار داده", "reg"], ["تعریف QTPP و CQAها (ICH Q8)", "form"], ["ارزیابی ریسک اولیه (ICH Q9)", "qa"], ["برآورد هزینه و زمان", "pm"]] },
  { key: "supply", title: "درخواست خرید و تأمین مواد", w: 10, items: [["درخواست خرید API", "form"], ["درخواست خرید Excipientها", "form"], ["دریافت مدارک تأمین‌کننده (CoA، DMF یا CEP)", "purch"], ["ورود مواد و نمونه‌برداری", "purch"], ["آنالیز و تأیید QC مواد اولیه", "anal"], ["خرید استاندارد مرجع و ناخالصی‌ها", "purch"], ["تهیه نمونه محصول مرجع", "purch"]] },
  { key: "form", title: "پیش‌فرمولاسیون و فرمولاسیون", w: 16, items: [["مطالعه پیش‌فرمولاسیون API (حلالیت، Polymorph، PSD)", "form"], ["مطالعه سازگاری API با Excipientها", "form"], ["طراحی فرمول‌های اولیه", "form"], ["ساخت بچ‌های آزمایشی (Lab trials)", "form"], ["مقایسه Dissolution profile با مرجع (f2)", "anal"], ["انتخاب فرمول نهایی", "form"], ["انتخاب بسته‌بندی اولیه", "form"]] },
  { key: "anal", title: "توسعه و Validation روش آنالیز", w: 10, items: [["توسعه روش Assay و Related substances", "anal"], ["توسعه روش Dissolution", "anal"], ["Validation روش‌ها (ICH Q2)", "anal"], ["تدوین Specification و روش‌های آزمون", "anal"]] },
  { key: "pilot", title: "Pilot و Scale-up", w: 10, items: [["ساخت بچ Pilot", "prod"], ["تعیین پارامترهای بحرانی فرایند (CPP)", "form"], ["آنالیز بچ Pilot", "anal"], ["ساخت بچ‌های پایداری (3 بچ)", "prod"]] },
  { key: "stab", title: "مطالعه پایداری", w: 22, items: [["شروع مطالعه Accelerated (40 °C / 75% RH)", "anal"], ["شروع مطالعه Long-term", "anal"], ["Photostability (ICH Q1B) در صورت نیاز", "anal"], ["گزارش پایداری 6 ماهه", "anal"], ["پیشنهاد Shelf life (ICH Q1E)", "qa"]] },
  { key: "reg", title: "پرونده و ثبت", w: 12, items: [["گزارش توسعه دارویی (3.2.P.2)", "form"], ["تهیه پرونده CTD", "reg"], ["مطالعه BE یا Biowaiver در صورت نیاز", "reg"], ["ارسال پرونده به سازمان غذا و دارو", "reg"], ["پاسخ به سؤالات و اخذ پروانه", "reg"]] },
  { key: "tt", title: "انتقال تکنولوژی و بچ صنعتی", w: 10, items: [["پروتکل انتقال تکنولوژی", "qa"], ["تهیه Master batch record", "prod"], ["ساخت 3 بچ Process validation", "prod"], ["گزارش Process validation", "qa"], ["آزادسازی و شروع تولید تجاری", "qa"], ["پایداری بچ‌های صنعتی (Ongoing stability)", "anal"]] },
];

export const STAB_TPL = [
  { cond: "Accelerated — 40 °C / 75% RH", months: [0, 1, 2, 3, 6] },
  { cond: "Long-term — 25 °C / 60% RH", months: [0, 3, 6, 9, 12, 18, 24, 36] },
  { cond: "Long-term — 30 °C / 65% RH", months: [0, 3, 6, 9, 12, 18, 24, 36] },
  { cond: "Long-term — 30 °C / 75% RH", months: [0, 3, 6, 9, 12, 18, 24, 36] },
  { cond: "Intermediate — 30 °C / 65% RH", months: [0, 6, 9, 12] },
  { cond: "Refrigerated — 5 °C ± 3 °C", months: [0, 3, 6, 9, 12, 18, 24] },
];

export type Col = { k: string; l: string; t: "text" | "date" | "sel" | "num" | "calc"; o?: Record<string, string>; ltr?: boolean; w?: number; log?: boolean };
export type ListKey = "trials" | "methods" | "purchases" | "batches" | "risks" | "docs" | "costs";
/** One schema drives each register: its columns, and the unit that owns its rows by default. */
export const LISTS: Record<ListKey, { title: string; add: string; unit: Unit; ownerOnly?: boolean; note?: string; cols: Col[] }> = {
  trials: { title: "سوابق فرمولاسیون (Trials)", add: "+ Trial", unit: "form", note: "هر Trial را با کد یکتا ثبت کنید (F1، F2، …) و تغییر نسبت به Trial قبل و نتایج کلیدی را بنویسید تا مسیر رسیدن به فرمول نهایی در گزارش توسعه دارویی (3.2.P.2) ردیابی شود.", cols: [
    { k: "code", l: "کد", t: "text", ltr: true, w: 80 }, { k: "date", l: "تاریخ", t: "date", w: 140 }, { k: "desc", l: "فرمول / تغییر نسبت به Trial قبل", t: "text" },
    { k: "process", l: "فرایند", t: "text", w: 150 }, { k: "results", l: "نتایج کلیدی (سختی، DT، f2، Assay)", t: "text" },
    { k: "outcome", l: "نتیجه", t: "sel", o: O("ongoing:در حال ارزیابی|pass:قابل قبول|fail:رد"), w: 130, log: true }] },
  methods: { title: "روش‌های آنالیز", add: "+ روش", unit: "anal", note: "روش‌هایی که موعدشان نزدیک است و هنوز Validate نشده‌اند در هشدارها نمایش داده می‌شوند.", cols: [
    { k: "name", l: "روش", t: "text" }, { k: "type", l: "آزمون", t: "sel", o: O("assay:Assay|rs:Related substances|diss:Dissolution|id:Identification|cu:Content uniformity|water:Water|rsolv:Residual solvents|micro:Microbial|other:سایر"), w: 160 },
    { k: "status", l: "وضعیت", t: "sel", o: O("dev:در حال توسعه|val:در حال Validation|done:Validate شده|tr:منتقل شده به QC"), w: 150, log: true },
    { k: "report", l: "کد گزارش", t: "text", ltr: true, w: 120 }, { k: "due", l: "موعد", t: "date", w: 140 }] },
  purchases: { title: "درخواست‌های خرید مواد", add: "+ درخواست خرید", unit: "purch", note: "اگر زمان تحویل بگذرد و ماده دریافت نشده باشد، هشدار تأخیر صادر می‌شود.", cols: [
    { k: "item", l: "ماده", t: "text" }, { k: "supplier", l: "تأمین‌کننده", t: "text", w: 150 }, { k: "qty", l: "مقدار", t: "text", w: 80 },
    { k: "pr", l: "شماره PR", t: "text", ltr: true, w: 100 }, { k: "po", l: "شماره PO", t: "text", ltr: true, w: 100 },
    { k: "date", l: "تاریخ درخواست", t: "date", w: 140 }, { k: "eta", l: "زمان تحویل", t: "date", w: 140 },
    { k: "status", l: "وضعیت", t: "sel", o: O("requested:درخواست شده|ordered:سفارش داده شد|received:دریافت شد|qc:تأیید QC|rejected:رد QC"), w: 130, log: true }] },
  batches: { title: "بچ‌ها", add: "+ بچ", unit: "prod", cols: [
    { k: "no", l: "شماره بچ", t: "text", ltr: true, w: 110 }, { k: "type", l: "نوع", t: "sel", o: O("lab:Lab trial|pilot:Pilot|stab:پایداری|pv:Process validation|com:تجاری|be:BE"), w: 140 },
    { k: "size", l: "اندازه", t: "text", w: 90 }, { k: "date", l: "تاریخ ساخت", t: "date", w: 140 },
    { k: "status", l: "وضعیت", t: "sel", o: O("planned:برنامه‌ریزی|made:ساخته شد|testing:در حال آنالیز|released:آزاد شد|rejected:رد شد"), w: 130, log: true },
    { k: "note", l: "توضیح", t: "text" }] },
  risks: { title: "ثبت ریسک‌ها", add: "+ ریسک", unit: "qa", cols: [
    { k: "risk", l: "ریسک", t: "text" }, { k: "sev", l: "شدت", t: "sel", o: O("1:1|2:2|3:3|4:4|5:5"), w: 64 }, { k: "prob", l: "احتمال", t: "sel", o: O("1:1|2:2|3:3|4:4|5:5"), w: 64 },
    { k: "_score", l: "امتیاز", t: "calc", w: 70 }, { k: "mitigation", l: "اقدام کاهش ریسک", t: "text" }, { k: "owner", l: "مسئول", t: "text", w: 110 },
    { k: "status", l: "وضعیت", t: "sel", o: O("open:باز|watch:در پایش|closed:بسته"), w: 110, log: true }] },
  docs: { title: "اسناد پروژه", add: "+ سند", unit: "qa", note: "پروتکل‌ها، گزارش‌ها، Specificationها و بخش‌های CTD را با کد و ویرایش ثبت کنید.", cols: [
    { k: "code", l: "کد سند", t: "text", ltr: true, w: 130 }, { k: "title", l: "عنوان", t: "text" },
    { k: "type", l: "نوع", t: "sel", o: O("protocol:پروتکل|report:گزارش|spec:Specification|stp:روش آزمون|mbr:Master batch record|ctd:بخش CTD|other:سایر"), w: 150 },
    { k: "version", l: "ویرایش", t: "text", ltr: true, w: 70 }, { k: "date", l: "تاریخ", t: "date", w: 140 },
    { k: "status", l: "وضعیت", t: "sel", o: O("draft:پیش‌نویس|review:در بازبینی|approved:تأیید شده|obsolete:منسوخ"), w: 130, log: true }] },
  costs: { title: "هزینه‌ها", add: "+ هزینه", unit: "pm", ownerOnly: true, cols: [
    { k: "item", l: "شرح", t: "text" }, { k: "cat", l: "دسته", t: "sel", o: O("mat:مواد اولیه|std:استاندارد مرجع|ext:آنالیز خارج|be:مطالعه BE|eq:تجهیزات|reg:ثبت|other:سایر"), w: 140 },
    { k: "amount", l: "مبلغ", t: "num", w: 120 }, { k: "date", l: "تاریخ", t: "date", w: 140 }] },
};
export const LIST_KEYS = Object.keys(LISTS) as ListKey[];
/** Units whose rows of a register a member works on (the stability programme belongs to the laboratory). */
export const STABILITY_UNIT: Unit = "anal";

// ---------- dates ----------
export const DAY = 86400000;
/** The current time. Schedules are about "now", so views that use it are meant to change from one render to the next. */
export const nowMs = () => Date.now();
export const toISO = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
/** Today in Tehran, as YYYY-MM-DD. */
export const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
export const ms = (iso?: string) => (iso ? new Date(iso + "T00:00:00").getTime() : NaN);
export const addMonths = (iso: string, m: number) => { const d = new Date(iso + "T00:00:00"); d.setMonth(d.getMonth() + m); return toISO(d); };
export const daysTo = (iso?: string) => (iso ? Math.round((ms(iso) - ms(today())) / DAY) : NaN);
/** A real calendar date in a sensible range (a half-typed year such as 0002 is not one). */
export const isDate = (v: unknown): v is string => typeof v === "string" && /^(19|20|21)\d{2}-\d{2}-\d{2}$/.test(v) && !isNaN(ms(v));

// ---------- schedule arithmetic ----------
export const stagePct = (s: Stage) => (s.items.length ? (100 * s.items.filter((i) => i.done).length) / s.items.length : 0);
const weight = (p: Project) => p.stages.reduce((a, s) => a + (+s.w || 0), 0) || 1;
export const progress = (p: Project) => Math.round(p.stages.reduce((a, s) => a + (+s.w || 0) * stagePct(s), 0) / weight(p));
export const curStage = (p: Project) => p.stages.findIndex((s) => stagePct(s) < 100);
export const stageStart = (p: Project, i: number) => (i === 0 ? p.start : p.stages[i - 1].due || p.start);
export function plannedAt(p: Project, t: number) {
  let acc = 0;
  p.stages.forEach((s, i) => {
    const a = ms(stageStart(p, i)), b = ms(s.due);
    const f = !isFinite(a) || !isFinite(b) ? 0 : b <= a ? (t >= b ? 1 : 0) : Math.min(1, Math.max(0, (t - a) / (b - a)));
    acc += (+s.w || 0) * f;
  });
  return (100 * acc) / weight(p);
}
export function actualAt(p: Project, t: number) {
  let acc = 0;
  for (const s of p.stages) {
    if (!s.items.length) continue;
    const k = s.items.filter((i) => i.done && (i.doneAt ? ms(i.doneAt) : ms(p.start)) <= t).length;
    acc += ((+s.w || 0) * k) / s.items.length;
  }
  return (100 * acc) / weight(p);
}
export const lateStages = (p: Project) => p.stages.filter((s) => s.due && stagePct(s) < 100 && daysTo(s.due) < 0);
export const isOpen = (p: Project) => p.status === "active" || p.status === "hold";
export const sv = (p: Project) => Math.round(actualAt(p, Date.now()) - plannedAt(p, Date.now()));
export type Health = "ok" | "risk" | "late" | "hold" | "done" | "cancelled";
export function health(p: Project): Health {
  if (p.status === "done" || progress(p) >= 100) return "done";
  if (p.status === "cancelled") return "cancelled";
  if (p.status === "hold") return "hold";
  const v = sv(p), late = lateStages(p), worst = late.length ? Math.max(...late.map((s) => -daysTo(s.due))) : 0;
  if (v < -15 || worst > 30 || (p.target && daysTo(p.target) < 0)) return "late";
  if (v < -5 || late.length) return "risk";
  return "ok";
}
export const HEALTH: Record<Health, { label: string; tone: string; color: string }> = {
  ok: { label: "بر اساس برنامه", tone: "bg-emerald-50 text-emerald-700", color: "#1f8a4c" },
  risk: { label: "در معرض تأخیر", tone: "bg-amber-50 text-amber-700", color: "#b26a00" },
  late: { label: "عقب از برنامه", tone: "bg-red-50 text-red-700", color: "#c2362f" },
  hold: { label: "متوقف", tone: "bg-vault-50 text-muted", color: "#8a9ab0" },
  done: { label: "تکمیل", tone: "bg-molecule-50 text-molecule-700", color: "#0b8f8a" },
  cancelled: { label: "لغو", tone: "bg-vault-50 text-muted", color: "#8a9ab0" },
};
export const riskScore = (r: Row) => (+(r.sev as string) || 0) * (+(r.prob as string) || 0);
export const spent = (p: Project) => p.costs.reduce((a, c) => a + (+(c.amount as number) || 0), 0);

// ---------- deadlines and alerts ----------
export type Alert = { project: string; projectName: string; unit: Unit; due: string; d: number; level: "bad" | "warn" | "info"; text: string };
const level = (d: number): Alert["level"] => (d < 0 ? "bad" : d <= 3 ? "warn" : "info");

/** Everything with a date that is overdue or due within `days`, for the units given (all when null). */
export function alertsOf(p: Project, units: Unit[] | null, days = 30): Alert[] {
  if (!isOpen(p)) return [];
  const ok = (u: Unit) => !units || units.includes(u);
  const out: Alert[] = [];
  const add = (unit: Unit, due: string, text: string) => { const d = daysTo(due); if (d <= days) out.push({ project: p.id, projectName: p.name, unit, due, d, level: level(d), text }); };
  for (const s of p.stages) for (const it of s.items) if (!it.done && ok(it.unit)) { const due = it.due || s.due; if (due) add(it.unit, due, `${it.t} (${s.title})`); }
  if (ok(STABILITY_UNIT)) for (const st of p.stability) if (st.start) for (const m of st.months) if (!st.done.includes(m)) add(STABILITY_UNIT, addMonths(st.start, m), `نمونه‌برداری پایداری ${m}M — ${st.cond}`);
  for (const r of p.purchases) if (ok(r.unit) && isDate(r.eta) && !["received", "qc", "rejected"].includes(String(r.status))) add(r.unit, r.eta, `تحویل ${r.item || "ماده"}${r.supplier ? ` از ${r.supplier}` : ""}`);
  for (const m of p.methods) if (ok(m.unit) && isDate(m.due) && !["done", "tr"].includes(String(m.status))) add(m.unit, m.due, `روش آنالیز «${m.name || "—"}»`);
  return out.sort((a, b) => a.d - b.d);
}

// ---------- a new project ----------
export const uid = (prefix: string) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export function newProject(f: { name: string; code: string; form: string; type: string; lead: string; requester: string; priority: string; start: string; target: string; budget: number }): Project {
  const span = Math.max(1, (ms(f.target) - ms(f.start)) / DAY), total = STAGES.reduce((a, s) => a + s.w, 0);
  let acc = 0;
  const stages: Stage[] = STAGES.map((s) => {
    acc += s.w;
    return { key: s.key, title: s.title, w: s.w, due: toISO(new Date(ms(f.start) + ((span * acc) / total) * DAY)), gate: { decision: "pending" }, items: s.items.map(([t, unit]) => ({ id: uid("i"), t, done: false, unit })) };
  });
  return {
    id: uid("p"), name: f.name, code: f.code, form: f.form, type: P_TYPE[f.type] ? f.type : "generic", lead: f.lead, requester: f.requester,
    priority: (PRIO[f.priority] ? f.priority : "medium") as Project["priority"], start: f.start, target: f.target, status: "active", budget: f.budget || 0, unit: "میلیون تومان",
    stages, trials: [], methods: [], purchases: [], batches: [], risks: [], docs: [], costs: [], stability: [],
    events: [{ id: uid("e"), date: f.start, kind: "auto", text: "پروژه به واحد تحقیق و توسعه اعلام و ثبت شد.", at: Date.now(), unit: "pm" }],
    createdAt: Date.now(), updatedAt: Date.now(),
  };
}

/** Fills fields an older or hand-made record may lack. */
export function normalize(raw: Record<string, unknown>, id: string): Project {
  const p = { ...raw, id } as Project;
  p.stages = (p.stages || []).map((s) => ({ ...s, w: +s.w || STAGES.find((x) => x.key === s.key)?.w || 8, gate: s.gate || { decision: "pending" }, items: (s.items || []).map((i) => ({ ...i, unit: isUnit(i.unit) ? i.unit : "pm" })) }));
  for (const k of LIST_KEYS) p[k] = (Array.isArray(p[k]) ? p[k] : []).map((r) => ({ ...r, unit: isUnit(r.unit) ? r.unit : LISTS[k].unit }));
  p.stability = (Array.isArray(p.stability) ? p.stability : []).map((s) => ({ ...s, results: s.results || {}, done: s.done || [], months: s.months || [], specMin: s.specMin ?? 95, specMax: s.specMax ?? 105 }));
  p.events = (Array.isArray(p.events) ? p.events : []).map((e) => ({ ...e, unit: isUnit(e.unit) ? e.unit : "pm" }));
  p.priority = PRIO[p.priority] ? p.priority : "medium";
  p.type = P_TYPE[p.type] ? p.type : "generic";
  p.status = P_STATUS[p.status] ? p.status : "active";
  return p;
}
