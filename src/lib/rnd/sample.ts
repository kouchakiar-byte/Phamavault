/*
 * A worked example for showing the workspace to others: a generic metformin 500 mg film-coated tablet,
 * about six months into a 22-month plan, in formulation optimisation. Every value is illustrative and the project says so in
 * its name and notes; suppliers and people are placeholders, not real companies or staff.
 */
import { DAY, GATE_CHECKS, ms, newProject, toISO, today, uid, type Project, type Row, type Unit } from "./model";

export function sampleProject(): Project {
  // The plan is made from today, then moved back in time so that today falls in formulation
  // optimisation, with that activity a week overdue.
  const draft = newProject({ name: "x", code: "", form: "", type: "generic", lead: "", requester: "", priority: "high", start: today(), target: today(), budget: 0 });
  const opt = draft.stages.flatMap((x) => x.items).find((x) => x.code === "4.7")!;
  const back = Math.round((ms(opt.due!) - ms(today())) / DAY) + 7;
  const t0 = ms(today()) - back * DAY;
  const D = (d: number) => toISO(new Date(t0 + d * DAY));
  const p = newProject({
    name: "قرص روکش‌دار متفورمین 500 mg (پروژه نمونه)", code: "RD-SAMPLE-01", form: "قرص روکش‌دار", type: "generic",
    lead: "مسئول نمونه", requester: "واحد بازاریابی", priority: "high", start: D(0), target: D(660), budget: 1200,
  });
  p.strength = "500 mg";
  p.market = "داخلی";
  p.rld = "Glucophage 500 mg";
  p.team = "فرمولاسیون، آنالیز و QC، QA، خرید، ثبت، تولید";
  p.notes = "این پروژه نمونه برای معرفی سامانه است و همه داده‌هایش فرضی است. پس از معرفی، از پایین تب «نمای کلی» حذفش کنید.";

  // Eight months in: what was due by now is done (a few things late), what is under way has partial
  // progress, and two activities are behind. The rest of the plan is then re-planned from that state.
  const now = ms(today()), owners: Partial<Record<Unit, string>> = { pm: "مسئول نمونه", form: "کارشناس فرمولاسیون", anal: "آزمایشگاه R&D", qa: "کارشناس QA", purch: "کارشناس خرید", reg: "کارشناس ثبت", prod: "سرپرست تولید" };
  const lateBy: Record<string, number> = { "2.13": 9, "3.6": 12, "4.3": 15 };
  const behind = new Set(["4.7"]);
  const all = p.stages.flatMap((x) => x.items), byCode = new Map(all.map((x) => [x.code, x]));
  for (const it of all) it.owner = owners[it.unit];
  // Done only when everything it depends on is done: walk until nothing changes.
  for (let changed = true; changed; ) {
    changed = false;
    for (const it of all) {
      if (it.done || !it.start || !it.due || behind.has(it.code ?? "")) continue;
      if (ms(it.due) >= now || !(it.deps ?? []).every((c) => byCode.get(c)?.done)) continue;
      it.done = true; it.pct = 100; it.aStart = it.start;
      it.doneAt = toISO(new Date(ms(it.due) + (lateBy[it.code ?? ""] ?? 0) * DAY));
      changed = true;
    }
  }
  for (const it of all) {
    if (it.done || !it.start || ms(it.start) > now || !(it.deps ?? []).every((c) => byCode.get(c)?.done)) continue;
    const a = ms(it.start), b = ms(it.due!);
    it.aStart = it.start;
    it.pct = behind.has(it.code ?? "") ? 60 : Math.min(90, Math.max(10, Math.round(((now - a) / Math.max(DAY, b - a)) * 10) * 10));
  }
  for (const s of p.stages) if (s.items.every((it) => it.done)) s.gate = { decision: "go", by: "کمیته R&D", date: s.items.find((i) => i.gate)?.doneAt ?? s.due, note: "" };
  if (p.stages[2].gate.decision === "go") p.stages[2].gate.note = "مواد اولیه تأیید QC شدند؛ ورود به فرمولاسیون.";
  // The two gates already passed carry their review, as a project manager would have filled them in.
  const reviewed: Record<string, { summary: string; cond: string; actions: [string, string][] }> = {
    p0: { summary: "Brief محصول و برآورد اولیه بودجه ارائه شد. بازار متفورمین 500 mg روکش‌دار رقابتی است و مزیت پروژه، تأمین API از دو منبع است.", cond: "Go؛ برآورد تفصیلی بودجه در Gate 1 ارائه شود.", actions: [["تهیه برآورد تفصیلی هزینه و منابع", "مدیر پروژه"]] },
    p1: { summary: "QTPP و CQAها مرور شد. Patent مانعی ندارد. امکان‌سنجی فنی خط گرانول‌سازی تأیید شد.", cond: "Go؛ ارزیابی دومین تأمین‌کننده API پیش از خرید Scale-up کامل شود.", actions: [["ارزیابی صلاحیت تأمین‌کننده دوم API", "تضمین کیفیت"], ["به‌روزرسانی Risk register پس از انتخاب API", "مدیر پروژه"]] },
  };
  for (const s of p.stages) {
    const r = reviewed[s.key];
    if (!r || s.gate.decision !== "go") continue;
    const at = s.gate.date;
    Object.assign(s.gate, {
      checks: (GATE_CHECKS[s.key] ?? []).map(([k, t]) => ({ k, t, v: "yes" as const })),
      meet: at, attendees: "مدیر پروژه، فرمولاسیون، آنالیز و QC، تضمین کیفیت، ثبت و رگولاتوری", summary: r.summary, cond: r.cond,
      actions: r.actions.map(([t, who]) => ({ id: uid("a"), t, who, done: true })),
    });
  }
  const find = (code: string) => p.stages.flatMap((x) => x.items).find((x) => x.code === code)!;
  Object.assign(find("4.7"), { pri: "high", note: "منتظر نتایج تکراری Dissolution در pH 6.8" });
  find("4.3").comments = [
    { by: "", name: "کارشناس فرمولاسیون", unit: "فرمولاسیون", at: Date.now() - 70 * DAY, text: "سه Trial ساخته شد؛ F2 بهترین f2 را داشت." },
    { by: "", name: "آزمایشگاه R&D", unit: "آنالیز و QC", at: Date.now() - 66 * DAY, text: "نتایج Dissolution در سه pH در پوشه پروژه ثبت شد." },
  ];
  Object.assign(find("5.9"), { doc: "AMV-01" });
  Object.assign(find("1.5"), { doc: "QTPP-01" });

  // The registers, dated from today backwards: trials and lab batches of the last weeks, materials
  // bought months ago, methods being validated, a short accelerated study on the chosen formula.
  const R = (d: number) => toISO(new Date(ms(today()) + d * DAY));
  const row = (unit: Unit, data: Record<string, unknown>): Row => ({ id: uid("r"), unit, ...data });
  p.trials = [
    row("form", { code: "F1", date: R(-48), desc: "Wet granulation، PVP K30 3%", process: "HSG، خشک‌کن FBD", results: "سختی 12 kp، DT 9 min، f2 = 46 در pH 6.8", outcome: "fail" }),
    row("form", { code: "F2", date: R(-34), desc: "PVP K30 4%، افزودن Crospovidone 2%", process: "HSG، خشک‌کن FBD", results: "سختی 13 kp، DT 6 min، f2 = 58", outcome: "pass" }),
    row("form", { code: "F3", date: R(-12), desc: "F2 با روکش Opadry", process: "Pan coating", results: "Weight gain 3%، f2 = 61", outcome: "ongoing" }),
  ];
  p.methods = [
    row("anal", { name: "HPLC Assay و Related substances", type: "assay", status: "dev", report: "", due: R(20) }),
    row("anal", { name: "Dissolution — Apparatus 2, pH 6.8", type: "diss", status: "dev", report: "", due: R(10) }),
    row("anal", { name: "Identification و Water content", type: "id", status: "val", report: "AMV-03", due: R(35) }),
  ];
  p.purchases = [
    row("purch", { item: "Metformin HCl (API)", supplier: "تأمین‌کننده نمونه", qty: "25 kg", pr: "PR-0412", po: "PO-0988", date: R(-120), eta: R(-95), status: "qc" }),
    row("purch", { item: "Povidone K30", supplier: "تأمین‌کننده نمونه", qty: "5 kg", pr: "PR-0413", po: "PO-0990", date: R(-110), eta: R(-90), status: "qc" }),
    row("purch", { item: "Opadry II White", supplier: "تأمین‌کننده نمونه", qty: "2 kg", pr: "PR-0477", po: "PO-1031", date: R(-30), eta: R(6), status: "ordered" }),
  ];
  p.batches = [
    row("prod", { no: "LT-F1", type: "lab", size: "1 kg", date: R(-48), status: "rejected", note: "f2 پایین" }),
    row("prod", { no: "LT-F2", type: "lab", size: "1 kg", date: R(-34), status: "released", note: "" }),
    row("prod", { no: "LT-F3", type: "lab", size: "2 kg", date: R(-12), status: "testing", note: "روکش‌دار" }),
  ];
  p.risks = [
    row("form", { risk: "f2 کمتر از 50 در pH 6.8", sev: "4", prob: "3", mitigation: "افزایش Disintegrant و کنترل سختی", owner: "فرمولاسیون", status: "watch" }),
    row("purch", { risk: "تأخیر در تحویل Opadry", sev: "3", prob: "4", mitigation: "تأمین‌کننده دوم", owner: "خرید", status: "open" }),
    row("qa", { risk: "Nitrosamine در API (NDMA)", sev: "5", prob: "3", mitigation: "ارزیابی ریسک و آزمون تأییدی LC-MS/MS", owner: "QA", status: "open" }),
  ];
  p.docs = [
    row("qa", { code: "QTPP-01", title: "QTPP و CQAها", type: "report", version: "1.0", date: R(-150), status: "approved" }),
    row("form", { code: "PF-01", title: "گزارش پیش‌فرمولاسیون", type: "report", version: "1.0", date: R(-60), status: "approved" }),
    row("anal", { code: "AMV-P-02", title: "پروتکل Validation روش Dissolution", type: "protocol", version: "0.1", date: R(-3), status: "draft" }),
  ];
  p.costs = [
    row("pm", { item: "API و Excipientها", cat: "mat", amount: 380, date: R(-120) }),
    row("pm", { item: "استانداردهای مرجع و ناخالصی", cat: "std", amount: 210, date: R(-100) }),
    row("pm", { item: "آنالیز Nitrosamine (آزمایشگاه بیرونی)", cat: "ext", amount: 95, date: R(-20) }),
  ];
  p.stability = [{
    id: uid("s"), cond: "Accelerated — 40 °C / 75% RH", months: [0, 1, 2, 3], start: R(-33), done: [0, 1], batches: "LT-F2", specMin: 95, specMax: 105,
    results: { 0: { assay: "100.4", imp: "0.08", diss: "96", ok: "pass" }, 1: { assay: "99.6", imp: "0.12", diss: "95", ok: "pass" } },
  }];
  const ev = (d: number, kind: "decision" | "issue" | "note", unit: Unit, text: string, by: string) => ({ id: uid("e"), date: R(d), kind, text, at: ms(today()) + d * DAY, unit, by });
  p.events = [
    ev(-2, "issue", "form", "بهینه‌سازی فرمول یک هفته عقب افتاد: نتایج تکراری Dissolution در pH 6.8 لازم است.", "کارشناس فرمولاسیون"),
    ev(-3, "note", "anal", "نمونه‌برداری ماه اول پایداری Accelerated فرمول F2 انجام شد؛ نتایج منطبق.", "آزمایشگاه R&D"),
    ev(-12, "decision", "form", "فرمول F2 برای روکش‌دهی انتخاب شد.", "کمیته R&D"),
    ev(-48, "issue", "anal", "Dissolution فرمول F1 در pH 6.8 پایین‌تر از مرجع بود (f2 = 46).", "آزمایشگاه R&D"),
    ev(-95, "decision", "purch", "تأمین‌کننده API پس از تأیید QC و بررسی CEP انتخاب شد.", "کمیته R&D"),
    ...p.events.map((e) => ({ ...e, at: t0 })),
  ];
  return p;
}
