/*
 * A worked example for showing the workspace to others: a generic metformin 500 mg film-coated tablet,
 * about eight months into an 18-month plan. Every value is illustrative and the project says so in
 * its name and notes; suppliers and people are placeholders, not real companies or staff.
 */
import { DAY, ms, newProject, toISO, today, uid, type Project, type Row, type Unit } from "./model";

export function sampleProject(): Project {
  const t0 = ms(today()) - 240 * DAY;
  const D = (d: number) => toISO(new Date(t0 + d * DAY));
  const p = newProject({
    name: "قرص روکش‌دار متفورمین 500 mg (پروژه نمونه)", code: "RD-SAMPLE-01", form: "قرص روکش‌دار", type: "generic",
    lead: "مسئول نمونه", requester: "واحد بازاریابی", priority: "high", start: D(0), target: D(540), budget: 1200,
  });
  p.strength = "500 mg";
  p.market = "داخلی";
  p.rld = "Glucophage 500 mg";
  p.team = "فرمولاسیون، آنالیز و QC، QA، خرید، ثبت، تولید";
  p.notes = "این پروژه نمونه برای معرفی سامانه است و همه داده‌هایش فرضی است. پس از معرفی، از پایین تب «نمای کلی» حذفش کنید.";

  // How far each stage has got, when its tasks were done, and the gates passed so far.
  const doneCount = [5, 5, 7, 5, 2, 0, 0, 0, 0];
  let acc = 0;
  const total = p.stages.reduce((a, s) => a + s.w, 0);
  p.stages.forEach((s, i) => {
    const start = Math.round((540 * acc) / total);
    acc += s.w;
    const end = Math.round((540 * acc) / total);
    s.items.forEach((it, j) => {
      if (j < doneCount[i]) {
        it.done = true;
        it.doneAt = D(start + Math.round(((end - start) * (j + 1)) / (s.items.length + 1)) + (i === 3 ? 20 : 0));
      }
    });
    if (i < 3) s.gate = { decision: "go", by: "کمیته R&D", date: D(end - 2), note: i === 2 ? "مواد اولیه تأیید QC شدند؛ ورود به فرمولاسیون." : "" };
  });
  // Two late tasks with an owner and a due date, so the alerts have something to show.
  Object.assign(p.stages[3].items[5], { owner: "کارشناس فرمولاسیون", due: D(225) });
  Object.assign(p.stages[3].items[6], { owner: "کارشناس فرمولاسیون", due: D(232) });
  Object.assign(p.stages[4].items[2], { owner: "آزمایشگاه R&D", due: D(270) });
  p.stages[3].items[3].comments = [
    { by: "", name: "کارشناس فرمولاسیون", unit: "فرمولاسیون", at: Date.now() - 70 * DAY, text: "سه Trial ساخته شد؛ F2 بهترین f2 را داشت." },
    { by: "", name: "آزمایشگاه R&D", unit: "آنالیز و QC", at: Date.now() - 66 * DAY, text: "نتایج Dissolution در سه pH در پوشه پروژه ثبت شد." },
  ];

  const row = (unit: Unit, data: Record<string, unknown>): Row => ({ id: uid("r"), unit, ...data });
  p.trials = [
    row("form", { code: "F1", date: D(150), desc: "Wet granulation، PVP K30 3%", process: "HSG، خشک‌کن FBD", results: "سختی 12 kp، DT 9 min، f2 = 46 در pH 6.8", outcome: "fail" }),
    row("form", { code: "F2", date: D(172), desc: "PVP K30 4%، افزودن Crospovidone 2%", process: "HSG، خشک‌کن FBD", results: "سختی 13 kp، DT 6 min، f2 = 58", outcome: "pass" }),
    row("form", { code: "F3", date: D(205), desc: "F2 با روکش Opadry", process: "Pan coating", results: "Weight gain 3%، f2 = 61", outcome: "ongoing" }),
  ];
  p.methods = [
    row("anal", { name: "HPLC Assay", type: "assay", status: "done", report: "AMV-01", due: D(200) }),
    row("anal", { name: "Dissolution — Apparatus 2, pH 6.8", type: "diss", status: "val", report: "AMV-02", due: D(265) }),
    row("anal", { name: "HPLC Related substances", type: "rs", status: "dev", report: "", due: D(285) }),
  ];
  p.purchases = [
    row("purch", { item: "Metformin HCl (API)", supplier: "تأمین‌کننده نمونه", qty: "25 kg", pr: "PR-0412", po: "PO-0988", date: D(18), eta: D(60), status: "qc" }),
    row("purch", { item: "Povidone K30", supplier: "تأمین‌کننده نمونه", qty: "5 kg", pr: "PR-0413", po: "PO-0990", date: D(18), eta: D(50), status: "qc" }),
    row("purch", { item: "Opadry II White", supplier: "تأمین‌کننده نمونه", qty: "2 kg", pr: "PR-0477", po: "PO-1031", date: D(190), eta: D(250), status: "ordered" }),
  ];
  p.batches = [
    row("prod", { no: "LT-F1", type: "lab", size: "1 kg", date: D(150), status: "rejected", note: "f2 پایین" }),
    row("prod", { no: "LT-F2", type: "lab", size: "1 kg", date: D(172), status: "released", note: "" }),
    row("prod", { no: "LT-F3", type: "lab", size: "2 kg", date: D(205), status: "testing", note: "روکش‌دار" }),
  ];
  p.risks = [
    row("form", { risk: "f2 کمتر از 50 در pH 6.8", sev: "4", prob: "3", mitigation: "افزایش Disintegrant و کنترل سختی", owner: "فرمولاسیون", status: "watch" }),
    row("purch", { risk: "تأخیر در تحویل Opadry", sev: "3", prob: "4", mitigation: "تأمین‌کننده دوم", owner: "خرید", status: "open" }),
    row("qa", { risk: "Nitrosamine در API (NDMA)", sev: "5", prob: "3", mitigation: "ارزیابی ریسک و آزمون تأییدی LC-MS/MS", owner: "QA", status: "open" }),
  ];
  p.docs = [
    row("qa", { code: "QTPP-01", title: "QTPP و CQAها", type: "report", version: "1.0", date: D(35), status: "approved" }),
    row("anal", { code: "AMV-01", title: "گزارش Validation روش Assay", type: "report", version: "1.0", date: D(200), status: "approved" }),
    row("anal", { code: "STP-01", title: "روش آزمون محصول", type: "stp", version: "0.2", date: D(215), status: "draft" }),
  ];
  p.costs = [
    row("pm", { item: "API و Excipientها", cat: "mat", amount: 380, date: D(40) }),
    row("pm", { item: "استانداردهای مرجع و ناخالصی", cat: "std", amount: 210, date: D(70) }),
    row("pm", { item: "آنالیز Nitrosamine (آزمایشگاه بیرونی)", cat: "ext", amount: 95, date: D(190) }),
  ];
  p.stability = [{
    id: uid("s"), cond: "Accelerated — 40 °C / 75% RH", months: [0, 1, 2, 3, 6], start: D(175), done: [0, 1], batches: "LT-F2", specMin: 95, specMax: 105,
    results: { 0: { assay: "100.4", imp: "0.08", diss: "96", ok: "pass" }, 1: { assay: "99.6", imp: "0.12", diss: "95", ok: "pass" } },
  }];
  const ev = (d: number, kind: "decision" | "issue" | "note", unit: Unit, text: string, by: string) => ({ id: uid("e"), date: D(d), kind, text, at: t0 + d * DAY, unit, by });
  p.events = [
    ev(230, "note", "anal", "نمونه‌برداری ماه اول پایداری Accelerated انجام شد؛ نتایج منطبق.", "آزمایشگاه R&D"),
    ev(205, "decision", "form", "فرمول F2 برای روکش‌دهی و پایداری انتخاب شد.", "کمیته R&D"),
    ev(150, "issue", "anal", "Dissolution فرمول F1 در pH 6.8 پایین‌تر از مرجع بود (f2 = 46).", "آزمایشگاه R&D"),
    ev(95, "decision", "purch", "تأمین‌کننده API پس از تأیید QC و بررسی CEP انتخاب شد.", "کمیته R&D"),
    ...p.events.map((e) => ({ ...e, at: t0 })),
  ];
  return p;
}
