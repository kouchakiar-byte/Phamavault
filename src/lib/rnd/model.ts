/*
 * R&D project management: the shape of a project, the stage-gate template, the
 * departments (units) that own each task and register, and the schedule
 * arithmetic (weighted progress, planned curve, health, deadlines). Shared by
 * the server (filtering, alerts) and the browser (charts).
 */

import { isolateText } from "@/lib/bidi";
import { baseline, schedule } from "./schedule";
import { TEMPLATE } from "./template";

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
/** Text typed by people, safe to show inside a Persian sentence: its English words and numbers keep their order. */
export const T = (v: unknown) => isolateText(String(v ?? ""));

export type Comment = { by: string; name: string; unit: string; at: number; text: string };
export type Priority = "high" | "medium" | "low";
/**
 * One activity of the plan. `start`/`due` are its planned dates (inclusive), worked out from `dur` and the
 * activities in `deps` unless `pin` fixes the start by hand. `aStart`/`doneAt` are what really happened.
 * `base` is the planned end when the plan was last fixed as the baseline, to measure slippage against.
 */
export type Item = {
  id: string; t: string; done: boolean; doneAt?: string; owner?: string; due?: string; unit: Unit; comments?: Comment[];
  code?: string; start?: string; dur?: number; deps?: string[]; pin?: boolean; pct?: number; aStart?: string; base?: string;
  assignee?: string; pri?: Priority; out?: string; doc?: string; note?: string; gate?: boolean;
};
export type CheckV = "" | "yes" | "no" | "na";
export type GateCheck = { k: string; t: string; v: CheckV; note?: string };
export type GateAction = { id: string; t: string; who?: string; due?: string; done?: boolean };
/**
 * The decision at the end of a phase. A formal gate (a phase holding a gate activity) also keeps its
 * review: the checklist, the meeting (date, attendees, discussion, conditions) and the actions agreed.
 */
export type Gate = {
  decision: "pending" | "go" | "hold" | "nogo"; by?: string; date?: string; note?: string;
  checks?: GateCheck[]; meet?: string; attendees?: string; summary?: string; cond?: string; actions?: GateAction[];
};
export type Raci = "R" | "A" | "AR" | "C" | "I";
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
  /** Who is Responsible, Accountable, Consulted and Informed in each phase, by phase key; empty cells use RACI_DEFAULT. */
  raci?: Record<string, Partial<Record<Unit, Raci | "">>>;
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
export const CHECK_V: [CheckV, string][] = [["", "—"], ["yes", "بله"], ["no", "خیر"], ["na", "نامرتبط"]];
export const RACI_L: Record<Raci, string> = { R: "مسئول اجرا", A: "پاسخگو (تأییدکننده)", AR: "پاسخگو و مسئول اجرا", C: "مشاور", I: "مطلع" };
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

// ---------- gate reviews ----------
/**
 * The questions each formal gate answers before the committee decides, written for a generic oral solid
 * project (stage-gate practice; ICH Q8(R2), Q9(R1), Q10). Phases without their own list use GATE_CHECKS_ANY.
 */
export const GATE_CHECKS: Record<string, [string, string][]> = {
  p0: [
    ["brief", "Product brief تأیید شده است: شکل دارویی، قدرت، بسته‌بندی و بازار هدف"],
    ["market", "بررسی بازار، رقبا و فرآورده‌های مشابه ثبت‌شده انجام شده است"],
    ["team", "مدیر پروژه و تیم چندواحدی تعیین و به واحدها ابلاغ شده‌اند"],
    ["plan", "برنامه زمانی اولیه و بودجه برآورد شده است"],
    ["risk", "فرضیات، محدودیت‌ها و ریسک‌های اولیه ثبت شده‌اند"],
  ],
  p1: [
    ["rld", "خلاصه محصول مرجع (RLD) کامل است: ترکیب، Excipientها، بسته‌بندی و Shelf life"],
    ["patent", "Patent و انحصار داده مانعی برای ثبت یا عرضه در تاریخ هدف ندارد"],
    ["reg", "مسیر ثبت و الزامات سازمان غذا و دارو مشخص است"],
    ["qtpp", "QTPP و CQAهای اولیه تعریف شده‌اند (ICH Q8)"],
    ["risk", "ارزیابی ریسک اولیه انجام شده و ریسک‌های بالا برنامه کاهش دارند (ICH Q9)"],
    ["tech", "امکان‌سنجی فنی (تجهیزات، فرایند و ظرفیت) تأیید شده است"],
    ["budget", "بودجه و برنامه تفصیلی پروژه قابل تصویب است"],
  ],
  p4: [
    ["formula", "فرمول نهایی بر اساس QTPP انتخاب و Formula card صادر شده است"],
    ["diss", "Dissolution profile با محصول مرجع قابل مقایسه است (f2 در صورت کاربرد)"],
    ["compat", "سازگاری API و Excipientها و پایداری اولیه فرمول پذیرفتنی است"],
    ["methods", "روش‌های آنالیز برای پشتیبانی Scale-up آماده است"],
    ["supply", "API و Excipientها برای Scale-up و بچ‌های پایداری تأمین شده‌اند"],
    ["risk", "ریسک‌های فرمولاسیون و فرایند بازبینی و به‌روز شده‌اند"],
  ],
  p9: [
    ["be", "نتیجه BE یا Biowaiver پذیرفتنی است"],
    ["dossier", "پرونده CTD کامل، بازبینی QA شده و ارسال شده است"],
    ["licence", "پروانه ساخت صادر شده یا زمان صدور آن مشخص است"],
    ["stab", "داده‌های پایداری از Shelf life پیشنهادی پشتیبانی می‌کند"],
    ["spec", "Specification و روش‌های آزمون نهایی تأیید شده‌اند"],
    ["tt", "برنامه انتقال تکنولوژی و Process validation آماده است"],
    ["risk", "بودجه و ریسک‌های باقی‌مانده بازبینی شده‌اند"],
  ],
};
export const GATE_CHECKS_ANY: [string, string][] = [
  ["acts", "فعالیت‌های این فاز انجام شده یا وضعیت باقی‌مانده‌ها روشن است"],
  ["outs", "خروجی‌ها و اسناد فاز تأیید شده‌اند"],
  ["risk", "ریسک‌های باز بازبینی شده‌اند"],
  ["next", "منابع و مواد فاز بعد آماده است"],
];
/** A phase whose plan holds a gate activity has a formal gate review. */
export const isGateStage = (s: Stage) => s.items.some((i) => i.gate);
/** The checklist of a phase: its template's questions, with the answers already given kept by key. */
export function gateChecks(s: Stage): GateCheck[] {
  const saved = new Map((s.gate.checks ?? []).map((c) => [c.k, c]));
  const tpl = (GATE_CHECKS[s.key] ?? GATE_CHECKS_ANY).map(([k, t]) => ({ k, t, v: (saved.get(k)?.v ?? "") as CheckV, ...(saved.get(k)?.note ? { note: saved.get(k)!.note } : {}) }));
  // Questions the project manager added to this gate keep their place after the template's.
  return [...tpl, ...(s.gate.checks ?? []).filter((c) => !tpl.some((x) => x.k === c.k))];
}
/** What the plan says about a phase when its gate meets: work done, deliverables, risks, lateness. */
export function gateFacts(p: Project, s: Stage) {
  const work = s.items.filter((i) => !i.gate);
  return {
    done: work.filter((i) => i.done).length,
    total: work.length,
    outs: work.filter((i) => i.out && !i.done).map((i) => ({ code: i.code, out: i.out! })),
    late: work.filter((i) => !i.done && daysTo(i.due) < 0).length,
    highRisks: p.risks.filter((r) => r.status !== "closed" && riskScore(r) >= 15).length,
  };
}

// ---------- RACI ----------
const RU: Unit[] = ["pm", "form", "anal", "qa", "purch", "reg", "prod"];
const r = (s: string) => Object.fromEntries(s.split(" ").map((x, i) => [RU[i], x === "-" ? "" : x])) as Partial<Record<Unit, Raci | "">>;
/**
 * The usual split of work by phase, in the order: project manager, formulation, analysis/QC, QA, purchasing,
 * regulatory, production. Each phase has one Accountable unit (A or AR). A starting point to adjust per project.
 */
export const RACI_DEFAULT: Record<string, Partial<Record<Unit, Raci | "">>> = {
  p0: r("AR C I C I C I"),
  p1: r("A R C R I R C"),
  p2: r("A C R R R I I"),
  p3: r("I AR C I I I I"),
  p4: r("A R R C I C C"),
  p5: r("I C AR C I C I"),
  p6: r("I AR C C R C C"),
  p7: r("A R R C C I R"),
  p8: r("I C AR C I C I"),
  p9: r("C R C R I AR I"),
  p10: r("C R R A C I R"),
  p11: r("AR I I R I I R"),
};
export const RACI_UNITS = RU;
/** A phase's RACI row: what the project set, else the default. */
export const raciRow = (p: Project, key: string) => ({ ...(RACI_DEFAULT[key] ?? {}), ...(p.raci?.[key] ?? {}) });
/** A row needs exactly one Accountable and someone doing the work. */
export function raciIssue(row: Partial<Record<Unit, Raci | "">>): string | null {
  const v = Object.values(row);
  const a = v.filter((x) => x === "A" || x === "AR").length;
  if (a === 0) return "بدون پاسخگو (A)";
  if (a > 1) return "بیش از یک پاسخگو (A)";
  if (!v.some((x) => x === "R" || x === "AR")) return "بدون مسئول اجرا (R)";
  return null;
}

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
/** An activity's progress, 0–100: done counts as 100 whatever was typed. */
export const itemPct = (i: Item) => (i.done ? 100 : Math.max(0, Math.min(100, Math.round(+(i.pct ?? 0) || 0))));
export const stagePct = (s: Stage) => (s.items.length ? s.items.reduce((a, i) => a + itemPct(i), 0) / s.items.length : 0);
const weight = (p: Project) => p.stages.reduce((a, s) => a + (+s.w || 0), 0) || 1;
export const progress = (p: Project) => Math.round(p.stages.reduce((a, s) => a + (+s.w || 0) * stagePct(s), 0) / weight(p));
export const curStage = (p: Project) => p.stages.findIndex((s) => stagePct(s) < 100);
/** A phase starts with its earliest activity; a phase from before activities had dates starts when the one before it ends. */
export function stageStart(p: Project, i: number): string {
  const starts = p.stages[i].items.map((it) => it.start).filter(isDate).sort();
  if (starts.length) return starts[0];
  return i === 0 ? p.start : p.stages[i - 1].due || p.start;
}
/** How far the plan says the project should be at time t: each activity advances evenly from its start to its end. */
export function plannedAt(p: Project, t: number) {
  let acc = 0;
  p.stages.forEach((s, i) => {
    const w = +s.w || 0;
    const dated = s.items.filter((it) => isDate(it.start) && isDate(it.due));
    if (dated.length && dated.length === s.items.length) {
      const f = dated.reduce((a, it) => {
        const a0 = ms(it.start), b0 = ms(it.due) + DAY;
        return a + (t >= b0 ? 1 : t <= a0 ? 0 : (t - a0) / (b0 - a0));
      }, 0) / dated.length;
      acc += w * f;
      return;
    }
    const a = ms(stageStart(p, i)), b = ms(s.due);
    const f = !isFinite(a) || !isFinite(b) ? 0 : b <= a ? (t >= b ? 1 : 0) : Math.min(1, Math.max(0, (t - a) / (b - a)));
    acc += w * f;
  });
  return (100 * acc) / weight(p);
}
/** How far the project really was at time t: finished activities from their finish date, and today's partial progress. */
export function actualAt(p: Project, t: number) {
  const now = Date.now();
  let acc = 0;
  for (const s of p.stages) {
    if (!s.items.length) continue;
    const k = s.items.reduce((a, i) => a + (i.done ? ((i.doneAt ? ms(i.doneAt) : ms(p.start)) <= t ? 100 : 0) : t >= now - DAY ? itemPct(i) : 0), 0) / 100;
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
export type Alert = { project: string; projectName: string; unit: Unit; due: string; d: number; level: "bad" | "warn" | "info"; kind: "task" | "pull" | "purchase" | "method"; text: string };
const level = (d: number): Alert["level"] => (d < 0 ? "bad" : d <= 3 ? "warn" : "info");

/**
 * Everything with a date that is overdue or due within `days`, for the units given (all when null).
 * Names typed by people often mix Persian with English and numbers ("500 mg"): each is isolated so it
 * keeps its order inside the Persian sentence.
 */
export function alertsOf(p: Project, units: Unit[] | null, days = 30): Alert[] {
  if (!isOpen(p)) return [];
  const ok = (u: Unit) => !units || units.includes(u);
  const out: Alert[] = [];
  const add = (kind: Alert["kind"], unit: Unit, due: string, text: string) => { const d = daysTo(due); if (d <= days) out.push({ project: p.id, projectName: p.name, unit, due, d, level: level(d), kind, text }); };
  for (const s of p.stages) for (const it of s.items) if (!it.done && ok(it.unit)) { const due = it.due || s.due; if (due) add("task", it.unit, due, `${T(it.t)} (${T(s.title)})`); }
  if (ok(STABILITY_UNIT)) for (const st of p.stability) if (st.start) for (const m of st.months) if (!st.done.includes(m)) add("pull", STABILITY_UNIT, addMonths(st.start, m), `نمونه‌برداری پایداری ⁦${m}M⁩ — ⁦${st.cond}⁩`);
  for (const r of p.purchases) if (ok(r.unit) && isDate(r.eta) && !["received", "qc", "rejected"].includes(String(r.status))) add("purchase", r.unit, r.eta, `تحویل ${r.item ? T(r.item) : "ماده"}${r.supplier ? ` از ${T(r.supplier)}` : ""}`);
  for (const m of p.methods) if (ok(m.unit) && isDate(m.due) && !["done", "tr"].includes(String(m.status))) add("method", m.unit, m.due, `روش آنالیز «${m.name ? T(m.name) : "—"}»`);
  return out.sort((a, b) => a.d - b.d);
}

// ---------- a new project ----------
export const uid = (prefix: string) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
/**
 * A new project from the standard plan: every activity of the template with its unit, duration and
 * dependencies, scheduled from the start date. The plan is then fixed as the baseline.
 */
export function newProject(f: { name: string; code: string; form: string; type: string; lead: string; requester: string; priority: string; start: string; target: string; budget: number }): Project {
  const stages: Stage[] = TEMPLATE.map((ph) => ({
    key: ph.key, title: ph.title, w: ph.w, due: f.target, gate: { decision: "pending" },
    items: ph.items.map((a) => ({ id: uid("i"), code: a.code, t: a.t, done: false, unit: a.unit, dur: a.d, deps: a.deps ?? [], pct: 0, ...(a.out ? { out: a.out } : {}), ...(a.gate ? { gate: true } : {}) })),
  }));
  const p: Project = {
    id: uid("p"), name: f.name, code: f.code, form: f.form, type: P_TYPE[f.type] ? f.type : "generic", lead: f.lead, requester: f.requester,
    priority: (PRIO[f.priority] ? f.priority : "medium") as Project["priority"], start: f.start, target: f.target, status: "active", budget: f.budget || 0, unit: "میلیون تومان",
    stages, trials: [], methods: [], purchases: [], batches: [], risks: [], docs: [], costs: [], stability: [],
    events: [{ id: uid("e"), date: f.start, kind: "auto", text: "پروژه به واحد تحقیق و توسعه اعلام و ثبت شد.", at: Date.now(), unit: "pm" }],
    createdAt: Date.now(), updatedAt: Date.now(),
  };
  schedule(p);
  baseline(p);
  return p;
}

/** Fills fields an older or hand-made record may lack. */
export function normalize(raw: Record<string, unknown>, id: string): Project {
  const p = { ...raw, id } as Project;
  p.stages = (p.stages || []).map((s) => ({ ...s, w: +s.w || STAGES.find((x) => x.key === s.key)?.w || 8, gate: s.gate || { decision: "pending" }, items: (s.items || []).map((i, j) => ({ ...i, unit: isUnit(i.unit) ? i.unit : "pm", code: i.code || `${p.stages.indexOf(s) + 1}.${j + 1}`, deps: Array.isArray(i.deps) ? i.deps : [], pct: i.done ? 100 : Math.max(0, Math.min(100, +(i.pct ?? 0) || 0)) })) }));
  for (const k of LIST_KEYS) p[k] = (Array.isArray(p[k]) ? p[k] : []).map((r) => ({ ...r, unit: isUnit(r.unit) ? r.unit : LISTS[k].unit }));
  // Projects from before activities had their own dates: each activity takes its phase's dates and is
  // pinned there, so re-planning never moves work that was planned by phase.
  p.stages.forEach((s, i) => {
    const from = i === 0 ? p.start : p.stages[i - 1].due || p.start;
    for (const it of s.items) {
      if (isDate(it.start)) continue;
      const due = isDate(it.due) ? it.due : s.due;
      if (!isDate(from) || !isDate(due)) continue;
      it.start = due < from ? due : from;
      it.due = due;
      it.dur = Math.max(1, Math.round((ms(due) - ms(it.start)) / DAY) + 1);
      it.pin = true;
    }
  });
  p.stability = (Array.isArray(p.stability) ? p.stability : []).map((s) => ({ ...s, results: s.results || {}, done: s.done || [], months: s.months || [], specMin: s.specMin ?? 95, specMax: s.specMax ?? 105 }));
  p.events = (Array.isArray(p.events) ? p.events : []).map((e) => ({ ...e, unit: isUnit(e.unit) ? e.unit : "pm" }));
  p.priority = PRIO[p.priority] ? p.priority : "medium";
  p.type = P_TYPE[p.type] ? p.type : "generic";
  p.status = P_STATUS[p.status] ? p.status : "active";
  return p;
}
