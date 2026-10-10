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
 * The pharmaceutical calculators. Formulas and presets follow the approved
 * design; every result recomputes on each keystroke.
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

/** A select with bilingual option labels. */
function Choice({ ctx, id, label, options }: { ctx: Ctx; id: string; label: Bi; options: { value: string; label: Bi }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select id={id} className="field-input" value={ctx.v[id]} onChange={(e) => ctx.set(id, e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label[ctx.locale]}
          </option>
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

// ---------- 4. Buffer design and preparation ----------

/** pKa (25 °C), charge of the acid form, MW of the acid form, MW of the base form. */
const bufferSystems: Preset[] = [
  {
    label: bi("Acetate: acetic acid / sodium acetate trihydrate (pKa 4.76)", "استات: استیک اسید / سدیم استات تری‌هیدرات (pKa 4.76)"),
    values: ["4.76", "0", "60.05", "136.08"],
  },
  {
    label: bi("Phosphate: NaH₂PO₄·2H₂O / Na₂HPO₄·2H₂O (pKa₂ 7.21)", "فسفات: NaH₂PO₄·2H₂O / Na₂HPO₄·2H₂O (pKa₂ 7.21)"),
    values: ["7.21", "-1", "156.01", "177.99"],
  },
  {
    label: bi("Citrate: disodium hydrogen citrate 1.5H₂O / trisodium citrate 2H₂O (pKa₃ 6.40)", "سیترات: دی‌سدیم هیدروژن سیترات 1.5H₂O / تری‌سدیم سیترات 2H₂O (pKa₃ 6.40)"),
    values: ["6.40", "-2", "263.11", "294.10"],
  },
  {
    label: bi("Tris: Tris hydrochloride / Tris base (pKa 8.07)", "تریس: تریس هیدروکلراید / تریس باز (pKa 8.07)"),
    values: ["8.07", "1", "157.60", "121.14"],
  },
  {
    label: bi("Carbonate: NaHCO₃ / Na₂CO₃ (pKa₂ 10.33)", "کربنات: NaHCO₃ / Na₂CO₃ (pKa₂ 10.33)"),
    values: ["10.33", "-1", "84.01", "105.99"],
  },
];

/** Ionic strength (mM) of an acid/base pair with monovalent counter-ions; the base form carries one charge less. */
function ionicStrength(acid: number, base: number, zAcid: number) {
  const zBase = zAcid - 1;
  return 0.5 * (acid * (zAcid ** 2 + Math.abs(zAcid)) + base * (zBase ** 2 + Math.abs(zBase)));
}

function Buf({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const pk = num(v["b-pka"]), ph = num(v["b-ph"]), c = num(v["b-c"]), vol = num(v["b-v"]);
  const za = num(v["b-za"]), mwa = num(v["b-mwa"]), mwb = num(v["b-mwb"]);
  let ratio = DASH, base = DASH, acid = DASH, gBase = DASH, gAcid = DASH, ionic = DASH, msg = "";
  if (![pk, ph, za].every(Number.isFinite) || !(c >= 0) || !(vol >= 0) || !(mwa > 0) || !(mwb > 0)) msg = bad(ctx);
  else {
    const r = Math.pow(10, ph - pk), b = (c * r) / (1 + r), a = c / (1 + r);
    const mmolB = (b * vol) / 1000, mmolA = (a * vol) / 1000;
    ratio = `${fixed(r, 3)} : 1`;
    base = `${fixed(b)} mM  ·  ${fixed(mmolB)} mmol`;
    acid = `${fixed(a)} mM  ·  ${fixed(mmolA)} mmol`;
    gBase = `${fixed((mmolB * mwb) / 1000, 3)} g`;
    gAcid = `${fixed((mmolA * mwa) / 1000, 3)} g`;
    ionic = `${fixed(ionicStrength(a, b, za))} mM`;
    if (Math.abs(ph - pk) > 1)
      msg = bi(
        "Target pH is more than 1 unit from the pKa, so buffer capacity will be weak.",
        "pH هدف بیش از 1 واحد با pKa فاصله دارد و ظرفیت بافری ضعیف خواهد بود.",
      )[locale];
  }
  const locked = isLocked(ctx, "b-sys");
  return (
    <Panel
      ctx={ctx}
      title={calculation("buf").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="b-sys" label={bi("Buffer system", "سیستم بافری")} presets={bufferSystems} targets={["b-pka", "b-za", "b-mwa", "b-mwb"]} />
          <NumberInput ctx={ctx} id="b-pka" label={bi("pKa", "pKa")} readOnly={locked} />
          <NumberInput ctx={ctx} id="b-ph" label={bi("Target pH", "pH هدف")} />
          <NumberInput ctx={ctx} id="b-c" label={bi("Total buffer concentration (mM)", "غلظت کل بافر (میلی‌مولار)")} />
          <NumberInput ctx={ctx} id="b-v" label={bi("Volume (mL)", "حجم (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="b-mwa" label={bi("MW of the acid form as weighed (g/mol)", "وزن مولکولی فرم اسیدی توزین‌شده (g/mol)")} readOnly={locked} />
          <NumberInput ctx={ctx} id="b-mwb" label={bi("MW of the base form as weighed (g/mol)", "وزن مولکولی فرم بازی توزین‌شده (g/mol)")} readOnly={locked} />
          <NumberInput ctx={ctx} id="b-za" label={bi("Charge of the acid form (z)", "بار الکتریکی فرم اسیدی (z)")} readOnly={locked} />
        </>
      }
      results={[
        { label: bi("Base : acid ratio", "نسبت باز به اسید"), value: ratio },
        { label: bi("Conjugate base (salt form)", "باز مزدوج (فرم نمکی)"), value: base },
        { label: bi("Acid form", "فرم اسیدی"), value: acid },
        { label: bi("Base form to weigh", "مقدار توزین فرم بازی"), value: gBase },
        { label: bi("Acid form to weigh", "مقدار توزین فرم اسیدی"), value: gAcid },
        { label: bi("Ionic strength", "قدرت یونی"), value: ionic },
      ]}
      message={msg}
      note={bi(
        "pH = pKa + log([base] ÷ [acid]); thermodynamic pKa values at 25 °C. Ionic strength I = ½ Σ cᵢzᵢ², counting monovalent counter-ions. Activity effects lower the apparent pKa (phosphate pKa₂ is about 6.8–6.9 at I ≈ 0.1 M), so adjust the final pH with a calibrated pH meter. Glacial acetic acid is a liquid: volume (mL) = mass ÷ 1.049.",
        "\u2066pH = pKa + log([A⁻] ÷ [HA])\u2069؛ مقادیر pKa ترمودینامیکی در 25 درجه سانتی‌گراد. قدرت یونی \u2066I = ½ Σ cᵢzᵢ²\u2069 با احتساب یون‌های مخالف تک‌ظرفیتی. اثر فعالیت یونی، pKa ظاهری را پایین می‌آورد (pKa₂ فسفات در \u2066I ≈ 0.1 M\u2069 حدود 6.8 تا 6.9 است)؛ بنابراین pH نهایی را با pH‌متر کالیبره‌شده تنظیم کنید. استیک اسید گلاسیال مایع است: حجم (میلی‌لیتر) = جرم ÷ 1.049.",
      )}
    />
  );
}

// ---------- 4b. Buffer capacity ----------

function BufCap({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const pk = num(v["c-pka"]), ph = num(v["c-ph"]), c = num(v["c-c"]), vol = num(v["c-v"]);
  const addB = num(v["c-base"]), addA = num(v["c-acid"]);
  let beta = DASH, betaMax = DASH, rel = DASH, newPh = DASH, shift = DASH, msg = "";
  if (![pk, ph].every(Number.isFinite) || !(c > 0) || !(vol > 0) || !(addB >= 0) || !(addA >= 0)) msg = bad(ctx);
  else {
    const ka = Math.pow(10, -pk), h = Math.pow(10, -ph);
    const b = (2.303 * c * ka * h) / (ka + h) ** 2;
    beta = `${fixed(b, 2)} mM/pH`;
    betaMax = `${fixed(0.576 * c, 2)} mM/pH`;
    rel = `${fixed((b / (0.576 * c)) * 100, 1)}%`;
    const r = Math.pow(10, ph - pk);
    const total = (c * vol) / 1000;
    const base = (total * r) / (1 + r) + addB - addA;
    const acid = total / (1 + r) - addB + addA;
    if (base <= 0 || acid <= 0)
      msg = bi(
        "The added acid or base exceeds the buffer: one form is used up and the pH is no longer buffered.",
        "اسید یا باز افزوده‌شده از ظرفیت بافر بیشتر است: یکی از دو فرم تمام شده و pH دیگر بافری نیست.",
      )[locale];
    else {
      const p = pk + Math.log10(base / acid);
      newPh = fixed(p, 2);
      shift = `${p - ph >= 0 ? "+" : ""}${fixed(p - ph, 2)}`;
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("bcap").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="c-sys" label={bi("Buffer system", "سیستم بافری")} presets={bufferSystems} targets={["c-pka"]} />
          <NumberInput ctx={ctx} id="c-pka" label={bi("pKa", "pKa")} readOnly={isLocked(ctx, "c-sys")} />
          <NumberInput ctx={ctx} id="c-ph" label={bi("Buffer pH", "pH بافر")} />
          <NumberInput ctx={ctx} id="c-c" label={bi("Total buffer concentration (mM)", "غلظت کل بافر (میلی‌مولار)")} />
          <NumberInput ctx={ctx} id="c-v" label={bi("Volume (mL)", "حجم (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="c-base" label={bi("Strong base added, e.g. NaOH (mmol)", "باز قوی افزوده‌شده، مثلاً NaOH (میلی‌مول)")} />
          <NumberInput ctx={ctx} id="c-acid" label={bi("Strong acid added, e.g. HCl (mmol)", "اسید قوی افزوده‌شده، مثلاً HCl (میلی‌مول)")} />
        </>
      }
      results={[
        { label: bi("Buffer capacity β at this pH", "ظرفیت بافری β در این pH"), value: beta },
        { label: bi("Maximum capacity (pH = pKa)", "حداکثر ظرفیت (pH = pKa)"), value: betaMax },
        { label: bi("Share of maximum", "درصد از حداکثر"), value: rel },
        { label: bi("pH after the addition", "pH پس از افزودن"), value: newPh },
        { label: bi("pH change", "تغییر pH"), value: shift },
      ]}
      message={msg}
      note={bi(
        "Van Slyke equation for a single acid/base pair: β = 2.303·C·Ka·[H₃O⁺] ÷ (Ka + [H₃O⁺])²; β is greatest at pH = pKa, where β = 0.576·C. The capacity of water itself (significant below pH 3 and above pH 11) and activity effects are ignored.",
        "معادله ون اسلایک برای یک زوج اسید و باز: \u2066β = 2.303·C·Ka·[H₃O⁺] ÷ (Ka + [H₃O⁺])²\u2069؛ بیشترین ظرفیت در \u2066pH = pKa\u2069 است که در آن \u2066β = 0.576·C\u2069. سهم خود آب (که زیر pH 3 و بالای pH 11 قابل‌توجه است) و اثر فعالیت یونی در نظر گرفته نشده است.",
      )}
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

// ---------- 7b. API potency adjustment ----------

/** MW of the material as weighed and MW of the form the label claim is expressed as. */
const saltForms: Preset[] = [
  { label: bi("Claim on the same form (SF = 1)", "ادعای برچسب بر همان فرم (SF = 1)"), values: ["1", "1"] },
  { label: bi("Amlodipine besylate → amlodipine", "آملودیپین بزیلات ← آملودیپین"), values: ["567.05", "408.88"] },
  { label: bi("Atorvastatin calcium trihydrate → atorvastatin", "آتورواستاتین کلسیم تری‌هیدرات ← آتورواستاتین"), values: ["604.70", "558.64"] },
  { label: bi("Ciprofloxacin HCl monohydrate → ciprofloxacin", "سیپروفلوکساسین HCl مونوهیدرات ← سیپروفلوکساسین"), values: ["385.82", "331.34"] },
  { label: bi("Sertraline HCl → sertraline", "سرترالین HCl ← سرترالین"), values: ["342.69", "306.23"] },
];

const potencyModes = [
  { value: "pct", label: bi("Assay in % (chemical APIs)", "اسی به درصد (مواد مؤثره شیمیایی)") },
  { value: "ugmg", label: bi("Potency in µg of active per mg (antibiotics)", "پوتنسی به میکروگرم ماده فعال در هر میلی‌گرم (آنتی‌بیوتیک‌ها)") },
  { value: "iumg", label: bi("Potency in IU per mg (biologics, some antibiotics)", "پوتنسی به واحد بین‌المللی در هر میلی‌گرم (بیولوژیک‌ها و برخی آنتی‌بیوتیک‌ها)") },
];

const potencyBases = [
  { value: "dried", label: bi("Anhydrous / dried basis (correct for water or LOD)", "بر پایه ماده خشک یا بدون آب (اصلاح با رطوبت یا LOD)") },
  { value: "asis", label: bi("As-is basis (no correction)", "بر پایه نمونه همان‌گونه که هست (بدون اصلاح)") },
];

function Pot({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const mode = v["p-mode"], dried = v["p-basis"] === "dried";
  const lc = num(v["p-lc"]), pot = num(v["p-pot"]), w = num(v["p-w"]), units = num(v["p-units"]);
  const mws = num(v["p-mws"]), mwb = num(v["p-mwb"]);
  const unit = mode === "pct" ? "%" : mode === "ugmg" ? "µg/mg" : "IU/mg";
  let sf = DASH, asIs = DASH, perUnit = DASH, batch = DASH, comp = DASH, msg = "";
  const ok = lc >= 0 && pot > 0 && units >= 0 && (!dried || (w >= 0 && w < 100)) && (mode !== "pct" || (mws > 0 && mwb > 0));
  if (!ok) msg = bad(ctx);
  else {
    const p = dried ? (pot * (100 - w)) / 100 : pot;
    const factor = mode === "pct" ? mws / mwb : 1;
    const mg = mode === "pct" ? (lc * factor * 100) / p : mode === "ugmg" ? (lc * 1000) / p : lc / p;
    sf = fixed(factor, 4);
    asIs = `${sig(p)} ${unit}`;
    perUnit = `${fixed(mg, 3)} mg`;
    batch = `${fixed((mg * units) / 1e6, 3)} kg`;
    if (mode !== "iumg") comp = `${fixed(mg - lc * factor, 3)} mg`;
    if (mode === "pct" && pot > 102)
      msg = bi("An assay above 102% is unusual; check the certificate of analysis.", "اسی بالای 102% غیرمعمول است؛ برگه آنالیز را بررسی کنید.")[locale];
  }
  const lcLabel =
    mode === "iumg"
      ? bi("Label claim per unit (IU)", "ادعای برچسب در هر واحد (IU)")
      : mode === "ugmg"
        ? bi("Label claim per unit (mg of active moiety)", "ادعای برچسب در هر واحد (میلی‌گرم ماده فعال)")
        : bi("Label claim per unit (mg, as the declared form)", "ادعای برچسب در هر واحد (میلی‌گرم، بر حسب فرم اعلام‌شده)");
  return (
    <Panel
      ctx={ctx}
      title={calculation("pot").title}
      form={
        <>
          <Choice ctx={ctx} id="p-mode" label={bi("How potency is reported", "نحوه گزارش پوتنسی")} options={potencyModes} />
          <NumberInput ctx={ctx} id="p-lc" label={lcLabel} />
          <NumberInput ctx={ctx} id="p-pot" label={bi(`Assay / potency on the CoA (${unit})`, `اسی یا پوتنسی در برگه آنالیز (${unit})`)} />
          <Choice ctx={ctx} id="p-basis" label={bi("Basis of the assay", "مبنای گزارش اسی")} options={potencyBases} />
          {dried && <NumberInput ctx={ctx} id="p-w" label={bi("Water content or loss on drying (%)", "مقدار آب یا افت وزن در خشک کردن (%)")} />}
          {mode === "pct" && (
            <>
              <PresetSelect ctx={ctx} id="p-salt" label={bi("Salt / hydrate form", "فرم نمکی یا هیدرات")} presets={saltForms} targets={["p-mws", "p-mwb"]} />
              <NumberInput ctx={ctx} id="p-mws" label={bi("MW of the material weighed (g/mol)", "وزن مولکولی ماده توزین‌شده (g/mol)")} readOnly={isLocked(ctx, "p-salt")} />
              <NumberInput ctx={ctx} id="p-mwb" label={bi("MW of the form in the label claim (g/mol)", "وزن مولکولی فرم ادعای برچسب (g/mol)")} readOnly={isLocked(ctx, "p-salt")} />
            </>
          )}
          <NumberInput ctx={ctx} id="p-units" label={bi("Batch size (units)", "اندازه بچ (تعداد واحد)")} />
        </>
      }
      results={[
        { label: bi("Salt factor (SF)", "ضریب نمک (SF)"), value: sf, hidden: mode !== "pct" },
        { label: bi("As-is potency", "پوتنسی نمونه همان‌گونه که هست"), value: asIs },
        { label: bi("Quantity to dispense per unit", "مقدار توزین در هر واحد"), value: perUnit },
        { label: bi("Quantity per batch", "مقدار در هر بچ"), value: batch },
        { label: bi("Reduce the diluent per unit by", "کاهش پرکننده در هر واحد"), value: comp, hidden: mode === "iumg" },
      ]}
      message={msg}
      note={bi(
        "% assay: m = LC × SF × 100 ÷ P; µg/mg: m = LC × 1000 ÷ P; IU/mg: m = LC ÷ P, where P is the as-is potency. On a dried or anhydrous basis, P = assay × (100 − W) ÷ 100, with W the water content or LOD (%). Take assay and water from the certificate of analysis of the lot in use, and lower the q.s. diluent by the compensation amount so the unit weight stays constant. Example: amoxicillin trihydrate is specified as 900–1050 µg of amoxicillin per mg on the anhydrous basis.",
        "اسی درصدی: \u2066m = LC × SF × 100 ÷ P\u2069؛ میکروگرم بر میلی‌گرم: \u2066m = LC × 1000 ÷ P\u2069؛ واحد بر میلی‌گرم: \u2066m = LC ÷ P\u2069؛ که P پوتنسی نمونه همان‌گونه که هست (as is) است. اگر اسی بر پایه ماده خشک یا بدون آب گزارش شده باشد: \u2066P = Assay × (100 − W) ÷ 100\u2069 که W درصد آب یا LOD است. اسی و رطوبت را از برگه آنالیز همان سری ماده بردارید و مقدار پرکننده q.s. را به اندازه جبران کاهش دهید تا وزن واحد ثابت بماند. مثال: آموکسی‌سیلین تری‌هیدرات با پوتنسی 900 تا 1050 میکروگرم آموکسی‌سیلین در هر میلی‌گرم بر پایه بدون آب مشخص می‌شود.",
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
  { key: "bcap", Calc: BufCap },
  { key: "sup", Calc: Sup },
  { key: "meq", Calc: Meq },
  { key: "vit", Calc: Vit },
  { key: "pot", Calc: Pot },
  { key: "bat", Calc: Batch },
] as const;

const defaults: Values = {
  "h-pair": "0", "h-lo": "4.3", "h-hi": "15.0", "h-req": "10.5", "h-mass": "5",
  "i-c": "1", "i-e": "0.23", "i-v": "30", "i-agent": "0", "i-ea": "1",
  "d-hi": "70", "d-lo": "0", "d-t": "10", "d-q": "500",
  "b-sys": "0", "b-pka": "4.76", "b-za": "0", "b-mwa": "60.05", "b-mwb": "136.08", "b-ph": "5.0", "b-c": "50", "b-v": "1000",
  "c-sys": "1", "c-pka": "7.21", "c-ph": "7.4", "c-c": "50", "c-v": "100", "c-base": "0", "c-acid": "1",
  "s-cap": "2", "s-dose": "200", "s-dv": "1.5", "s-n": "12", "s-ov": "10",
  "m-salt": "0", "m-mw": "58.44", "m-val": "1", "m-amt": "900", "m-unit": "mg",
  "v-form": String(flatForms.findIndex((f) => f.name === "Cholecalciferol (D3)")), "v-amt": "1000", "v-unit": "IU",
  "x-units": "100000", "x-ov": "0",
  "p-mode": "pct", "p-lc": "10", "p-pot": "99.5", "p-basis": "dried", "p-w": "0.5", "p-salt": "1", "p-mws": "567.05", "p-mwb": "408.88", "p-units": "100000",
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
