"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { bi, type Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { copy } from "@/content/site";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "./calc-format";
import { BiTitle } from "./ui";

/*
 * The eight pharmaceutical calculators. Formulas and presets follow the
 * approved design exactly; every result recomputes on each keystroke.
 */

type Values = Record<string, string>;
type Ctx = { locale: Locale; v: Values; set: (key: string, value: string) => void };

const num = (s: string | undefined) => parseFloat(s ?? "");

// ---------- shared building blocks ----------

function NumberInput({ ctx, id, label, readOnly = false }: { ctx: Ctx; id: string; label: Bi; readOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <input
        id={id}
        type="number"
        step="any"
        className="field-input"
        value={ctx.v[id] ?? ""}
        readOnly={readOnly}
        onChange={(e) => ctx.set(id, e.target.value)}
      />
    </div>
  );
}

type Preset = { label: Bi; values: string[] };

/** A select whose options fill (and lock) a set of number inputs, plus "custom". */
function PresetSelect({ ctx, id, label, presets, targets }: { ctx: Ctx; id: string; label: Bi; presets: Preset[]; targets: string[] }) {
  const value = ctx.v[id] ?? "0";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select
        id={id}
        className="field-input"
        value={value}
        onChange={(e) => {
          ctx.set(id, e.target.value);
          const preset = presets[Number(e.target.value)];
          if (preset) targets.forEach((t, i) => ctx.set(t, preset.values[i]));
        }}
      >
        {presets.map((p, i) => (
          <option key={i} value={i}>
            {p.label[ctx.locale]}
          </option>
        ))}
        <option value="custom">{copy.common.custom[ctx.locale]}</option>
      </select>
    </div>
  );
}

const isLocked = (ctx: Ctx, id: string) => (ctx.v[id] ?? "0") !== "custom";

function Select({ ctx, id, label, options }: { ctx: Ctx; id: string; label: Bi; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select id={id} className="field-input" value={ctx.v[id]} onChange={(e) => ctx.set(id, e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

type Result = { label: Bi; value: string; hidden?: boolean };

function Panel({ ctx, title, form, results, message, note, children }: {
  ctx: Ctx;
  title: Bi;
  form: ReactNode;
  results: Result[];
  message?: string;
  note: Bi;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-card border border-line bg-white p-6">
      <BiTitle as="h2" text={title} locale={ctx.locale} className="text-xl font-bold text-vault-900" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">{form}</div>
        <div className="flex h-fit flex-col gap-3 rounded-xl bg-vault-50 p-5">
          {results
            .filter((r) => !r.hidden)
            .map((r) => (
              <div key={r.label.en} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2.5 text-sm text-muted">
                <span>{r.label[ctx.locale]}</span>
                <b className="font-mono text-base font-medium text-ink tabular-nums" dir="ltr">
                  {r.value}
                </b>
              </div>
            ))}
          <p className="min-h-5 text-sm text-warn" aria-live="polite">
            {message}
          </p>
        </div>
      </div>
      {children}
      <p className="text-sm text-muted">{note[ctx.locale]}</p>
    </div>
  );
}

const DASH = "–";
const bad = (ctx: Ctx) => copy.common.badInput[ctx.locale];

// ---------- 1. HLB blend ----------

const hlbPairs: Preset[] = [
  { label: bi("Span 80 + Tween 80", "Span 80 + Tween 80"), values: ["4.3", "15.0"] },
  { label: bi("Span 60 + Tween 60", "Span 60 + Tween 60"), values: ["4.7", "14.9"] },
  { label: bi("Span 20 + Tween 20", "Span 20 + Tween 20"), values: ["8.6", "16.7"] },
];

function Hlb({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const lo = num(v["h-lo"]), hi = num(v["h-hi"]), r = num(v["h-req"]), m = num(v["h-mass"]);
  let plo = DASH, phi = DASH, msg = "";
  if (!(hi > lo) || !Number.isFinite(r) || !(m >= 0)) msg = bad(ctx);
  else if (r < lo || r > hi)
    msg = bi("The required HLB must lie between the two emulsifiers.", "HLB موردنیاز باید بین HLB دو امولسیفایر باشد.")[locale];
  else {
    const b = (r - lo) / (hi - lo);
    plo = `${fixed((1 - b) * 100, 1)}%  ·  ${fixed((1 - b) * m)} g`;
    phi = `${fixed(b * 100, 1)}%  ·  ${fixed(b * m)} g`;
  }
  const locked = isLocked(ctx, "h-pair");
  return (
    <Panel
      ctx={ctx}
      title={calculation("hlb").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="h-pair" label={bi("Emulsifier pair", "زوج امولسیفایر")} presets={hlbPairs} targets={["h-lo", "h-hi"]} />
          <NumberInput ctx={ctx} id="h-lo" label={bi("HLB of low-HLB emulsifier", "HLB امولسیفایر با HLB پایین")} readOnly={locked} />
          <NumberInput ctx={ctx} id="h-hi" label={bi("HLB of high-HLB emulsifier", "HLB امولسیفایر با HLB بالا")} readOnly={locked} />
          <NumberInput ctx={ctx} id="h-req" label={bi("Required HLB of the oil phase", "HLB موردنیاز فاز روغنی")} />
          <NumberInput ctx={ctx} id="h-mass" label={bi("Total emulsifier (g)", "مقدار کل امولسیفایر (گرم)")} />
        </>
      }
      results={[
        { label: bi("Low-HLB emulsifier", "امولسیفایر HLB پایین"), value: plo },
        { label: bi("High-HLB emulsifier", "امولسیفایر HLB بالا"), value: phi },
      ]}
      message={msg}
      note={bi("High-HLB fraction = (required − low) ÷ (high − low)", "کسر امولسیفایر HLB بالا = (موردنیاز − پایین) ÷ (بالا − پایین)")}
    />
  );
}

// ---------- 2. Isotonicity ----------

const tonicityAgents: Preset[] = [
  { label: bi("Sodium chloride (E = 1.00)", "سدیم کلراید (E = 1.00)"), values: ["1"] },
  { label: bi("Dextrose monohydrate (E = 0.16)", "دکستروز مونوهیدرات (E = 0.16)"), values: ["0.16"] },
];

function Iso({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const c = num(v["i-c"]), e = num(v["i-e"]), vol = num(v["i-v"]), ea = num(v["i-ea"]);
  let need = DASH, drug = DASH, add = DASH, msg = "";
  if (!(c >= 0) || !(e >= 0) || !(vol > 0) || !(ea > 0)) msg = bad(ctx);
  else {
    const n = 0.009 * vol, d = (c / 100) * vol * e, a = (n - d) / ea;
    need = `${fixed(n, 3)} g`;
    drug = `${fixed(d, 3)} g`;
    add = a > 0 ? `${fixed(a, 3)} g` : "0 g";
    if (a < 0) msg = bi("The drug alone makes the solution hypertonic.", "دارو به‌تنهایی محلول را هیپرتونیک می‌کند.")[locale];
    else if (a === 0) msg = bi("The solution is already isotonic.", "محلول همین حالا ایزوتونیک است.")[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("iso").title}
      form={
        <>
          <NumberInput ctx={ctx} id="i-c" label={bi("Drug concentration (% w/v)", "غلظت دارو (% وزنی/حجمی)")} />
          <NumberInput ctx={ctx} id="i-e" label={bi("Sodium chloride equivalent of the drug (E)", "معادل سدیم کلراید دارو (E)")} />
          <NumberInput ctx={ctx} id="i-v" label={bi("Volume to prepare (mL)", "حجم ساخت (میلی‌لیتر)")} />
          <PresetSelect ctx={ctx} id="i-agent" label={bi("Tonicity agent", "ماده تنظیم‌کننده تونیسیته")} presets={tonicityAgents} targets={["i-ea"]} />
          <NumberInput ctx={ctx} id="i-ea" label={bi("E of the tonicity agent", "E ماده تنظیم‌کننده")} readOnly={isLocked(ctx, "i-agent")} />
        </>
      }
      results={[
        { label: bi("NaCl for isotonicity alone", "NaCl لازم بدون دارو"), value: need },
        { label: bi("NaCl equivalent of the drug", "معادل NaCl دارو"), value: drug },
        { label: bi("Tonicity agent to add", "مقدار ماده تنظیم‌کننده"), value: add },
      ]}
      message={msg}
      note={bi("Agent (g) = (0.9% × V − drug (g) × E) ÷ E of agent", "ماده تنظیم‌کننده (گرم) = (0.9% × حجم − گرم دارو × E) ÷ E ماده")}
    />
  );
}

// ---------- 3. Dilution and alligation ----------

function Dil({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const hi = num(v["d-hi"]), lo = num(v["d-lo"]), t = num(v["d-t"]), q = num(v["d-q"]);
  let ahi = DASH, alo = DASH, ratio = DASH, msg = "";
  if (!(hi > lo) || !(lo >= 0) || !Number.isFinite(t) || !(q >= 0)) msg = bad(ctx);
  else if (t < lo || t > hi) msg = bi("The target must lie between the two strengths.", "غلظت هدف باید بین دو غلظت باشد.")[locale];
  else {
    const a = (q * (t - lo)) / (hi - lo);
    ahi = fixed(a);
    alo = fixed(q - a);
    ratio = `${fixed(t - lo, 2)} : ${fixed(hi - t, 2)}`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("dil").title}
      form={
        <>
          <NumberInput ctx={ctx} id="d-hi" label={bi("Higher strength", "غلظت بالاتر")} />
          <NumberInput ctx={ctx} id="d-lo" label={bi("Lower strength (0 for a plain diluent)", "غلظت پایین‌تر (برای حلال خالص 0)")} />
          <NumberInput ctx={ctx} id="d-t" label={bi("Target strength", "غلظت هدف")} />
          <NumberInput ctx={ctx} id="d-q" label={bi("Final quantity", "مقدار نهایی")} />
        </>
      }
      results={[
        { label: bi("Higher-strength portion", "سهم غلظت بالاتر"), value: ahi },
        { label: bi("Lower-strength portion", "سهم غلظت پایین‌تر"), value: alo },
        { label: bi("Ratio (high : low)", "نسبت (بالا : پایین)"), value: ratio },
      ]}
      message={msg}
      note={bi(
        "Parts of high = target − low; parts of low = high − target. Strengths share one unit, and portions come out in the unit of the final quantity.",
        "سهم غلظت بالا = هدف − پایین؛ سهم غلظت پایین = بالا − هدف. غلظت‌ها باید یک واحد داشته باشند و سهم‌ها با واحد مقدار نهایی به دست می‌آیند.",
      )}
    />
  );
}

// ---------- 4. Buffer ----------

const bufferSystems: Preset[] = [
  { label: bi("Acetate (pKa 4.76)", "استات (pKa 4.76)"), values: ["4.76"] },
  { label: bi("Phosphate (pKa2 7.21)", "فسفات (pKa2 7.21)"), values: ["7.21"] },
  { label: bi("Citrate (pKa3 6.40)", "سیترات (pKa3 6.40)"), values: ["6.40"] },
  { label: bi("Tris (pKa 8.07)", "تریس (pKa 8.07)"), values: ["8.07"] },
];

function Buf({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const pk = num(v["b-pka"]), ph = num(v["b-ph"]), c = num(v["b-c"]), vol = num(v["b-v"]);
  let ratio = DASH, base = DASH, acid = DASH, msg = "";
  if (!Number.isFinite(pk) || !Number.isFinite(ph) || !(c >= 0) || !(vol >= 0)) msg = bad(ctx);
  else {
    const r = Math.pow(10, ph - pk), b = (c * r) / (1 + r), a = c / (1 + r);
    ratio = `${fixed(r, 3)} : 1`;
    base = `${fixed(b)} mM  ·  ${fixed((b * vol) / 1000)} mmol`;
    acid = `${fixed(a)} mM  ·  ${fixed((a * vol) / 1000)} mmol`;
    if (Math.abs(ph - pk) > 1)
      msg = bi(
        "Target pH is more than 1 unit from the pKa, so buffer capacity will be weak.",
        "pH هدف بیش از 1 واحد با pKa فاصله دارد و ظرفیت بافری ضعیف خواهد بود.",
      )[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("buf").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="b-sys" label={bi("Buffer system", "سیستم بافری")} presets={bufferSystems} targets={["b-pka"]} />
          <NumberInput ctx={ctx} id="b-pka" label={bi("pKa", "pKa")} readOnly={isLocked(ctx, "b-sys")} />
          <NumberInput ctx={ctx} id="b-ph" label={bi("Target pH", "pH هدف")} />
          <NumberInput ctx={ctx} id="b-c" label={bi("Total buffer concentration (mM)", "غلظت کل بافر (میلی‌مولار)")} />
          <NumberInput ctx={ctx} id="b-v" label={bi("Volume (mL)", "حجم (میلی‌لیتر)")} />
        </>
      }
      results={[
        { label: bi("Base : acid ratio", "نسبت باز به اسید"), value: ratio },
        { label: bi("Conjugate base (salt form)", "باز مزدوج (فرم نمکی)"), value: base },
        { label: bi("Acid form", "فرم اسیدی"), value: acid },
      ]}
      message={msg}
      note={bi("pH = pKa + log([base] ÷ [acid]). pKa values at 25 °C.", "pH = pKa + log([باز] ÷ [اسید]). مقادیر pKa در 25 درجه سانتی‌گراد.")}
    />
  );
}

// ---------- 5. Suppository base ----------

function Sup({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const cap = num(v["s-cap"]), dose = num(v["s-dose"]) / 1000, dv = num(v["s-dv"]), n = num(v["s-n"]), ov = num(v["s-ov"]);
  let per = DASH, base = DASH, drug = DASH, msg = "";
  if (!(cap > 0) || !(dose >= 0) || !(dv > 0) || !(n > 0) || !(ov >= 0)) msg = bad(ctx);
  else {
    const p = cap - dose / dv, k = n * (1 + ov / 100);
    if (p <= 0) msg = bi("The drug dose is larger than the mould can hold.", "مقدار دارو از ظرفیت قالب بیشتر است.")[locale];
    else {
      per = `${fixed(p, 3)} g`;
      base = `${fixed(p * k)} g`;
      drug = `${fixed(dose * k, 3)} g`;
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("sup").title}
      form={
        <>
          <NumberInput ctx={ctx} id="s-cap" label={bi("Mould capacity (g of base)", "ظرفیت قالب (گرم پایه)")} />
          <NumberInput ctx={ctx} id="s-dose" label={bi("Drug per suppository (mg)", "دارو در هر شیاف (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="s-dv" label={bi("Displacement value", "ضریب جابه‌جایی")} />
          <NumberInput ctx={ctx} id="s-n" label={bi("Number of suppositories", "تعداد شیاف")} />
          <NumberInput ctx={ctx} id="s-ov" label={bi("Overage (%)", "اضافه‌ساخت (%)")} />
        </>
      }
      results={[
        { label: bi("Base per suppository", "پایه در هر شیاف"), value: per },
        { label: bi("Total base", "کل پایه"), value: base },
        { label: bi("Total drug", "کل دارو"), value: drug },
      ]}
      message={msg}
      note={bi(
        "Base per unit = mould capacity − (drug ÷ displacement value). Displacement value is the grams of drug that displace 1 g of base.",
        "پایه هر شیاف = ظرفیت قالب − (دارو ÷ ضریب جابه‌جایی). ضریب جابه‌جایی یعنی چند گرم دارو جای 1 گرم پایه را می‌گیرد.",
      )}
    />
  );
}

// ---------- 6. mg, mmol, mEq ----------

const salts: Preset[] = [
  { label: bi("Sodium chloride, NaCl", "سدیم کلراید، NaCl"), values: ["58.44", "1"] },
  { label: bi("Potassium chloride, KCl", "پتاسیم کلراید، KCl"), values: ["74.55", "1"] },
  { label: bi("Sodium bicarbonate, NaHCO₃", "سدیم بی‌کربنات، NaHCO₃"), values: ["84.01", "1"] },
  { label: bi("Calcium chloride dihydrate, CaCl₂·2H₂O", "کلسیم کلراید دی‌هیدرات، CaCl₂·2H₂O"), values: ["147.01", "2"] },
  { label: bi("Magnesium sulfate heptahydrate, MgSO₄·7H₂O", "منیزیم سولفات هپتاهیدرات، MgSO₄·7H₂O"), values: ["246.47", "2"] },
];

function Meq({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const mw = num(v["m-mw"]), val = num(v["m-val"]), a = num(v["m-amt"]), unit = v["m-unit"];
  let mg = DASH, mmolOut = DASH, meq = DASH, msg = "";
  if (!(mw > 0) || !(val > 0) || !(a >= 0)) msg = bad(ctx);
  else {
    const mmol = unit === "mg" ? a / mw : unit === "mmol" ? a : a / val;
    mg = `${fixed(mmol * mw)} mg`;
    mmolOut = `${fixed(mmol, 3)} mmol`;
    meq = `${fixed(mmol * val, 3)} mEq`;
  }
  const locked = isLocked(ctx, "m-salt");
  return (
    <Panel
      ctx={ctx}
      title={calculation("meq").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="m-salt" label={bi("Substance", "ماده")} presets={salts} targets={["m-mw", "m-val"]} />
          <NumberInput ctx={ctx} id="m-mw" label={bi("Molecular weight (g/mol)", "وزن مولکولی (g/mol)")} readOnly={locked} />
          <NumberInput ctx={ctx} id="m-val" label={bi("Valence", "ظرفیت")} readOnly={locked} />
          <NumberInput ctx={ctx} id="m-amt" label={bi("Amount", "مقدار")} />
          <Select ctx={ctx} id="m-unit" label={bi("Unit of the amount", "واحد مقدار")} options={["mg", "mmol", "mEq"]} />
        </>
      }
      results={[
        { label: bi("Mass", "جرم"), value: mg },
        { label: bi("Millimoles", "میلی‌مول"), value: mmolOut },
        { label: bi("Milliequivalents", "میلی‌اکی‌والان"), value: meq },
      ]}
      message={msg}
      note={bi("mmol = mg ÷ MW; mEq = mmol × valence", "mmol = mg ÷ وزن مولکولی؛ mEq = mmol × ظرفیت")}
    />
  );
}

// ---------- 7. Vitamin converter ----------

/** IU per mg for each vitamin form. */
const vitaminForms = [
  { group: "Vitamin A", forms: [["Retinol", 3333.3333], ["Retinyl acetate", 2906.9767], ["Retinyl palmitate", 1818.1818], ["Beta-carotene (supplement)", 1666.6667]] },
  { group: "Vitamin D", forms: [["Cholecalciferol (D3)", 40000], ["Ergocalciferol (D2)", 40000]] },
  {
    group: "Vitamin E",
    forms: [
      ["dl-α-Tocopheryl acetate", 1.0],
      ["dl-α-Tocopherol", 1.1],
      ["dl-α-Tocopheryl acid succinate", 0.89],
      ["d-α-Tocopheryl acetate", 1.36],
      ["d-α-Tocopherol", 1.49],
      ["d-α-Tocopheryl acid succinate", 1.21],
    ],
  },
] as const;

const flatForms = vitaminForms.flatMap((g) => g.forms.map(([name, k]) => ({ group: g.group, name, k })));

function Vit({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const form = flatForms[Number(v["v-form"])] ?? flatForms[0];
  const k = form.k, a = num(v["v-amt"]), unit = v["v-unit"], isA = form.group === "Vitamin A";
  let iuOut = DASH, mcg = DASH, mgOut = DASH, rae = DASH, factor = DASH, msg = "";
  if (!(a >= 0)) msg = bad(ctx);
  else {
    const mg = unit === "IU" ? a / k : unit === "mcg" ? a / 1000 : unit === "mg" ? a : a * 1000;
    const iu = mg * k;
    iuOut = `${sig(iu)} IU`;
    mcg = `${sig(mg * 1000)} mcg`;
    mgOut = `${sig(mg)} mg`;
    rae = `${sig(iu * 0.3)} mcg RAE`;
    factor = k >= 100 ? `1 IU = ${sig(1000 / k)} mcg` : `1 mg = ${sig(k)} IU`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("vit").title}
      form={
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="v-form" className="text-sm text-muted">
              {bi("Vitamin and chemical form", "ویتامین و فرم شیمیایی")[locale]}
            </label>
            <select id="v-form" className="field-input" dir="ltr" value={v["v-form"]} onChange={(e) => ctx.set("v-form", e.target.value)}>
              {vitaminForms.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.forms.map(([name]) => {
                    const i = flatForms.findIndex((f) => f.name === name);
                    return (
                      <option key={name} value={i}>
                        {name}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          </div>
          <NumberInput ctx={ctx} id="v-amt" label={bi("Amount", "مقدار")} />
          <Select ctx={ctx} id="v-unit" label={bi("Unit of the amount", "واحد مقدار")} options={["IU", "mcg", "mg", "g"]} />
        </>
      }
      results={[
        { label: bi("International units", "واحد بین‌المللی"), value: iuOut },
        { label: bi("Micrograms", "میکروگرم"), value: mcg },
        { label: bi("Milligrams", "میلی‌گرم"), value: mgOut },
        { label: bi("Retinol activity equivalents", "معادل فعالیت رتینول"), value: rae, hidden: !isA },
        { label: bi("Factor used", "ضریب استفاده‌شده"), value: factor },
      ]}
      message={msg}
      note={bi(
        "The IU factor depends on the chemical form, so pick the form named on the raw material certificate of analysis. For vitamin A, 1 IU equals 0.3 mcg RAE.",
        "ضریب IU به فرم شیمیایی بستگی دارد؛ فرمی را انتخاب کنید که در برگه آنالیز ماده اولیه آمده است. برای ویتامین A، هر IU برابر 0.3 میکروگرم RAE است.",
      )}
    />
  );
}

// ---------- 8. Batch scale-up ----------

type BatchRow = { id: number; name: string; mg: string };

const exampleFormula: BatchRow[] = [
  ["Paracetamol", "500"],
  ["Microcrystalline cellulose", "80"],
  ["Povidone K30", "20"],
  ["Croscarmellose sodium", "15"],
  ["Magnesium stearate", "5"],
].map(([name, mg], id) => ({ id, name, mg }));

function Batch({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const [rows, setRows] = useState(exampleFormula);
  const units = num(v["x-units"]), ov = num(v["x-ov"]);
  const parsed = rows.map((r) => parseFloat(r.mg));
  const ok = units > 0 && ov >= 0 && parsed.every((x) => x >= 0);
  const mgs = parsed.map((x) => (x >= 0 ? x : 0));
  const sum = mgs.reduce((s, x) => s + x, 0);
  const scale = units * (1 + ov / 100);
  const update = (id: number, patch: Partial<BatchRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <Panel
      ctx={ctx}
      title={calculation("bat").title}
      form={
        <>
          <NumberInput ctx={ctx} id="x-units" label={bi("Batch size (units)", "اندازه بچ (تعداد واحد)")} />
          <NumberInput ctx={ctx} id="x-ov" label={bi("Overage (%)", "اضافه‌ساخت (%)")} />
        </>
      }
      results={[
        { label: bi("Unit weight", "وزن هر واحد"), value: ok ? `${fixed(sum, 1)} mg` : DASH },
        { label: bi("Batch weight", "وزن بچ"), value: ok ? `${fixed((sum * scale) / 1e6, 3)} kg` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi("The formula below is an example. Replace the rows with your own.", "فرمول نمونه است. ردیف‌ها را با فرمول خودتان عوض کنید.")}
    >
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="db min-w-[520px]">
          <thead>
            <tr>
              <th>{bi("Ingredient", "ماده")[locale]}</th>
              <th>{bi("mg per unit", "mg در هر واحد")[locale]}</th>
              <th>% w/w</th>
              <th>{bi("kg per batch", "kg در بچ")[locale]}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <input
                    type="text"
                    aria-label="Ingredient"
                    className="field-input min-w-32"
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    aria-label="mg per unit"
                    className="field-input min-w-24"
                    value={r.mg}
                    onChange={(e) => update(r.id, { mg: e.target.value })}
                  />
                </td>
                <td className="num">{ok && sum > 0 ? `${fixed((mgs[i] / sum) * 100)}%` : DASH}</td>
                <td className="num">{ok ? fixed((mgs[i] * scale) / 1e6, 3) : DASH}</td>
                <td>
                  <button
                    type="button"
                    aria-label="Remove row"
                    onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                    className="rounded-md border border-line p-1.5 text-muted hover:border-warn hover:text-warn"
                  >
                    <X className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { id: Math.max(-1, ...prev.map((r) => r.id)) + 1, name: "", mg: "0" }])}
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-500 hover:text-molecule-700"
        >
          {bi("Add row", "افزودن ردیف")[locale]}
        </button>
      </div>
    </Panel>
  );
}

// ---------- bench ----------

const tabs = [
  { key: "hlb", Calc: Hlb },
  { key: "iso", Calc: Iso },
  { key: "dil", Calc: Dil },
  { key: "buf", Calc: Buf },
  { key: "sup", Calc: Sup },
  { key: "meq", Calc: Meq },
  { key: "vit", Calc: Vit },
  { key: "bat", Calc: Batch },
] as const;

const defaults: Values = {
  "h-pair": "0", "h-lo": "4.3", "h-hi": "15.0", "h-req": "10.5", "h-mass": "5",
  "i-c": "1", "i-e": "0.23", "i-v": "30", "i-agent": "0", "i-ea": "1",
  "d-hi": "70", "d-lo": "0", "d-t": "10", "d-q": "500",
  "b-sys": "0", "b-pka": "4.76", "b-ph": "5.0", "b-c": "50", "b-v": "1000",
  "s-cap": "2", "s-dose": "200", "s-dv": "1.5", "s-n": "12", "s-ov": "10",
  "m-salt": "0", "m-mw": "58.44", "m-val": "1", "m-amt": "900", "m-unit": "mg",
  "v-form": String(flatForms.findIndex((f) => f.name === "Cholecalciferol (D3)")), "v-amt": "1000", "v-unit": "IU",
  "x-units": "100000", "x-ov": "0",
};

export function Calculators({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<string>("hlb");
  const [values, setValues] = useState(defaults);
  const ctx: Ctx = { locale, v: values, set: (k, val) => setValues((prev) => ({ ...prev, [k]: val })) };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
      <div role="tablist" aria-orientation="vertical" className="flex flex-wrap gap-2 lg:flex-col">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setActive(t.key)}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-start text-sm font-medium text-ink transition hover:border-molecule-500 aria-selected:border-molecule-600 aria-selected:bg-molecule-600 aria-selected:text-white"
          >
            {calculation(t.key).label[locale]}
          </button>
        ))}
      </div>
      <div>
        {tabs.map(({ key, Calc }) => (
          // Panels stay mounted so each keeps its inputs when switching tabs.
          <div key={key} role="tabpanel" id={`panel-${key}`} aria-labelledby={`tab-${key}`} hidden={active !== key}>
            <Calc ctx={ctx} />
          </div>
        ))}
      </div>
    </div>
  );
}
