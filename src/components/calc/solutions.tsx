"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, NumberInput, Panel, PresetSelect, bad, isLocked, ltr, num, type Ctx, type Preset } from "./ui";

/* Solutions, physical pharmacy and stability calculators. */

// ---------- Isotonicity by freezing-point depression ----------

const fpdAgents: Preset[] = [
  { label: bi("Sodium chloride (ΔTf of 1% = 0.576 °C)", "سدیم کلراید (ΔTf محلول 1٪ = 0.576)"), values: ["0.576"] },
  { label: bi("Boric acid (ΔTf of 1% = 0.288 °C)", "بوریک اسید (ΔTf محلول 1٪ = 0.288)"), values: ["0.288"] },
];

export function Fpd({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const c = num(v["fp-c"]), d1 = num(v["fp-d1"]), vol = num(v["fp-v"]), b = num(v["fp-b"]);
  let a = DASH, pct = DASH, grams = DASH, msg = "";
  if (!(c >= 0) || !(d1 >= 0) || !(vol > 0) || !(b > 0)) msg = bad(ctx);
  else {
    const dep = c * d1, w = (0.52 - dep) / b;
    a = `${fixed(dep, 3)} °C`;
    if (w <= 0) {
      pct = "0%";
      grams = "0 g";
      msg = bi("The drug alone depresses the freezing point by 0.52 °C or more: the solution is isotonic or hypertonic.", "دارو به‌تنهایی نقطه انجماد را 0.52 درجه یا بیشتر پایین می‌آورد: محلول ایزوتونیک یا هیپرتونیک است.")[locale];
    } else {
      pct = `${fixed(w, 3)}% w/v`;
      grams = `${fixed((w * vol) / 100, 3)} g`;
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("fpd").title}
      form={
        <>
          <NumberInput ctx={ctx} id="fp-c" label={bi("Drug concentration (% w/v)", "غلظت دارو (% وزنی/حجمی)")} />
          <NumberInput ctx={ctx} id="fp-d1" label={bi("Freezing-point depression of a 1% drug solution (°C)", "کاهش نقطه انجماد محلول 1٪ دارو (درجه سانتی‌گراد)")} />
          <NumberInput ctx={ctx} id="fp-v" label={bi("Volume to prepare (mL)", "حجم ساخت (میلی‌لیتر)")} />
          <PresetSelect ctx={ctx} id="fp-agent" label={bi("Tonicity agent", "ماده تنظیم‌کننده تونیسیته")} presets={fpdAgents} targets={["fp-b"]} />
          <NumberInput ctx={ctx} id="fp-b" label={bi("ΔTf of a 1% solution of the agent (°C)", "ΔTf محلول 1٪ ماده تنظیم‌کننده (درجه)")} readOnly={isLocked(ctx, "fp-agent")} />
        </>
      }
      results={[
        { label: bi("Depression caused by the drug (a)", "کاهش نقطه انجماد ناشی از دارو (a)"), value: a },
        { label: bi("Agent concentration needed", "غلظت لازم ماده تنظیم‌کننده"), value: pct },
        { label: bi("Agent to add", "مقدار ماده تنظیم‌کننده"), value: grams },
      ]}
      message={msg}
      note={bi(
        "Blood and tears freeze at −0.52 °C. W (% w/v) = (0.52 − a) ÷ b, where a is the depression produced by the drug and b that of a 1% solution of the tonicity agent. ΔTf of a 1% solution ≈ 0.576 × E (sodium chloride equivalent).",
        `خون و اشک در دمای ${ltr("−0.52 °C")} منجمد می‌شوند. ${ltr("W (% w/v) = (0.52 − a) ÷ b")} که a کاهش نقطه انجماد ناشی از دارو و b کاهش ناشی از محلول 1٪ ماده تنظیم‌کننده است. ΔTf محلول 1٪ تقریباً برابر ${ltr("0.576 × E")} (معادل سدیم کلراید) است.`,
      )}
    />
  );
}

// ---------- Osmolarity ----------

/** Name, molecular weight and number of particles on ideal dissociation. */
const solutes: { name: string; mw: number; n: number }[] = [
  { name: "—", mw: 0, n: 0 },
  { name: "Sodium chloride, NaCl", mw: 58.44, n: 2 },
  { name: "Potassium chloride, KCl", mw: 74.55, n: 2 },
  { name: "Calcium chloride dihydrate, CaCl₂·2H₂O", mw: 147.01, n: 3 },
  { name: "Magnesium sulfate heptahydrate, MgSO₄·7H₂O", mw: 246.47, n: 2 },
  { name: "Sodium bicarbonate, NaHCO₃", mw: 84.01, n: 2 },
  { name: "Sodium acetate trihydrate", mw: 136.08, n: 2 },
  { name: "Sodium lactate", mw: 112.06, n: 2 },
  { name: "Potassium dihydrogen phosphate, KH₂PO₄", mw: 136.09, n: 2 },
  { name: "Dextrose monohydrate", mw: 198.17, n: 1 },
  { name: "Dextrose, anhydrous", mw: 180.16, n: 1 },
  { name: "Mannitol", mw: 182.17, n: 1 },
  { name: "Glycerol", mw: 92.09, n: 1 },
];
const soluteOptions = solutes.map((s, i) => ({ value: String(i), label: bi(s.name, s.name) }));
const osmRows = [1, 2, 3, 4];

export function Osm({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const parts = osmRows.map((r) => {
    const s = solutes[Number(v[`os-s${r}`])] ?? solutes[0];
    const c = num(v[`os-c${r}`]);
    return s.mw > 0 && c >= 0 ? (c / s.mw) * s.n * 1000 : s.mw > 0 ? NaN : 0;
  });
  const ok = parts.every(Number.isFinite);
  const total = parts.reduce((a, b) => a + b, 0);
  return (
    <Panel
      ctx={ctx}
      title={calculation("osm").title}
      form={
        <>
          {osmRows.map((r) => (
            <div key={r} className="grid grid-cols-[1fr_7rem] items-end gap-2">
              <Choice ctx={ctx} id={`os-s${r}`} label={bi(`Solute ${r}`, `ماده ${r}`)} options={soluteOptions} />
              <NumberInput ctx={ctx} id={`os-c${r}`} label={bi("mg/mL", "mg/mL")} />
            </div>
          ))}
        </>
      }
      results={[
        ...osmRows.map((r, i) => ({
          label: bi(`Solute ${r}`, `ماده ${r}`),
          value: ok ? `${fixed(parts[i], 1)} mOsm/L` : DASH,
          hidden: !(Number(v[`os-s${r}`]) > 0),
        })),
        { label: bi("Total osmolarity (calculated)", "اسمولاریته کل (محاسبه‌ای)"), value: ok ? `${fixed(total, 1)} mOsm/L` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "mOsm/L = (mg/mL ÷ MW) × number of particles × 1000, assuming complete dissociation. Measured osmolality is lower: 0.9% NaCl calculates to 308 mOsm/L but measures about 286 mOsm/kg. Plasma osmolality is about 285–295 mOsm/kg; peripheral intravenous solutions are usually kept below about 900 mOsm/L. The example is Ringer's injection.",
        `${ltr("mOsm/L = (mg/mL ÷ MW) × n × 1000")} با فرض تفکیک کامل، که n تعداد ذرات حاصل از هر مولکول است. اسمولالیته اندازه‌گیری‌شده کمتر است: NaCl 0.9٪ از راه محاسبه 308 ولی در اندازه‌گیری حدود 286 میلی‌اسمول بر کیلوگرم است. اسمولالیته پلاسما حدود 285 تا 295 میلی‌اسمول بر کیلوگرم است و محلول‌های تزریق وریدی محیطی معمولاً زیر حدود 900 میلی‌اسمول بر لیتر نگه داشته می‌شوند. مثال پیش‌فرض، محلول رینگر است.`,
      )}
    />
  );
}

// ---------- Concentration units ----------

const concUnits = [
  { value: "pct", label: bi("% w/v (g/100 mL)", "% w/v (گرم در 100 میلی‌لیتر)") },
  { value: "mgml", label: bi("mg/mL", "mg/mL") },
  { value: "ugml", label: bi("µg/mL", "µg/mL") },
  { value: "ppm", label: bi("ppm (mg/L)", "ppm (mg/L)") },
  { value: "molar", label: bi("mol/L (M)", "mol/L (M)") },
  { value: "mm", label: bi("mmol/L (mM)", "mmol/L (mM)") },
  { value: "ratio", label: bi("Ratio strength 1 : x (g/mL)", "نسبت 1 : x (گرم در میلی‌لیتر)") },
];

export function Conc({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const x = num(v["cn-x"]), mw = num(v["cn-mw"]), unit = v["cn-unit"];
  const needsMw = unit === "molar" || unit === "mm";
  let mgml = NaN;
  if (x > 0) {
    if (unit === "pct") mgml = x * 10;
    else if (unit === "mgml") mgml = x;
    else if (unit === "ugml" || unit === "ppm") mgml = x / 1000;
    else if (unit === "molar" && mw > 0) mgml = x * mw;
    else if (unit === "mm" && mw > 0) mgml = (x * mw) / 1000;
    else if (unit === "ratio") mgml = 1000 / x;
  }
  const ok = Number.isFinite(mgml);
  const show = (f: (m: number) => string) => (ok ? f(mgml) : DASH);
  return (
    <Panel
      ctx={ctx}
      title={calculation("conc").title}
      form={
        <>
          <NumberInput ctx={ctx} id="cn-x" label={bi("Concentration", "غلظت")} />
          <Choice ctx={ctx} id="cn-unit" label={bi("Unit", "واحد")} options={concUnits} />
          <NumberInput ctx={ctx} id="cn-mw" label={bi("Molecular weight (g/mol), for molar units", "وزن مولکولی (g/mol)، برای واحدهای مولار")} />
        </>
      }
      results={[
        { label: bi("% w/v", "% w/v"), value: show((m) => `${sig(m / 10)} %`) },
        { label: bi("mg/mL", "mg/mL"), value: show((m) => sig(m)) },
        { label: bi("µg/mL = ppm (w/v)", "µg/mL = ppm (w/v)"), value: show((m) => sig(m * 1000)) },
        { label: bi("mmol/L", "mmol/L"), value: mw > 0 ? show((m) => sig((m / mw) * 1000)) : DASH },
        { label: bi("Ratio strength", "نسبت قدرت"), value: show((m) => `1 : ${sig(1000 / m)}`) },
      ]}
      message={x > 0 && (!needsMw || mw > 0) ? "" : bad(ctx)}
      note={bi(
        "1% w/v = 1 g/100 mL = 10 mg/mL; 1 ppm (w/v) = 1 mg/L = 1 µg/mL; ratio strength 1:1000 = 1 g in 1000 mL = 0.1% w/v. The example is adrenaline 1 mg/mL (MW 183.20).",
        "هر 1٪ وزنی/حجمی برابر 1 گرم در 100 میلی‌لیتر یا 10 میلی‌گرم در میلی‌لیتر است؛ هر ppm (وزنی/حجمی) برابر 1 میلی‌گرم در لیتر یا 1 میکروگرم در میلی‌لیتر؛ نسبت 1:1000 یعنی 1 گرم در 1000 میلی‌لیتر یا 0.1٪. مثال پیش‌فرض، آدرنالین 1 میلی‌گرم در میلی‌لیتر (وزن مولکولی 183.20) است.",
      )}
    />
  );
}

// ---------- Stability kinetics ----------

const orders = [
  { value: "1", label: bi("First order (k in day⁻¹)", "مرتبه اول (k بر حسب day⁻¹)") },
  { value: "0", label: bi("Zero order (k in % per day)", "مرتبه صفر (k بر حسب درصد در روز)") },
];

export function Kin({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const first = v["kn-ord"] !== "0";
  const k1 = num(v["kn-k"]), t1 = num(v["kn-t1"]), ea = num(v["kn-ea"]), t2 = num(v["kn-t2"]), c0 = num(v["kn-c0"]), lim = num(v["kn-lim"]);
  let k2s = DASH, life1 = DASH, life2 = DASH, half = DASH, msg = "";
  if (!(k1 > 0) || !(ea > 0) || !Number.isFinite(t1) || !Number.isFinite(t2) || !(c0 > lim) || !(lim > 0)) msg = bad(ctx);
  else {
    const T1 = t1 + 273.15, T2 = t2 + 273.15;
    const k2 = k1 * Math.exp(((ea * 1000) / 8.314) * (1 / T1 - 1 / T2));
    const life = (k: number) => (first ? Math.log(c0 / lim) / k : (c0 - lim) / k);
    const fmt = (d: number) => `${fixed(d, 1)} ${bi("days", "روز")[locale]}  ·  ${fixed(d / 30.44, 1)} ${bi("months", "ماه")[locale]}`;
    k2s = `${sig(k2)} ${first ? "day⁻¹" : "%/day"}`;
    life1 = fmt(life(k1));
    life2 = fmt(life(k2));
    if (first) half = fmt(Math.LN2 / k2);
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("kin").title}
      form={
        <>
          <Choice ctx={ctx} id="kn-ord" label={bi("Reaction order", "مرتبه واکنش")} options={orders} />
          <NumberInput ctx={ctx} id="kn-k" label={bi("Rate constant k₁ at T₁", "ثابت سرعت k₁ در دمای T₁")} />
          <NumberInput ctx={ctx} id="kn-t1" label={bi("T₁, where k₁ was measured (°C)", "T₁، دمای اندازه‌گیری k₁ (درجه سانتی‌گراد)")} />
          <NumberInput ctx={ctx} id="kn-ea" label={bi("Activation energy Ea (kJ/mol)", "انرژی فعال‌سازی Ea (کیلوژول بر مول)")} />
          <NumberInput ctx={ctx} id="kn-t2" label={bi("T₂, storage temperature (°C)", "T₂، دمای نگهداری (درجه سانتی‌گراد)")} />
          <NumberInput ctx={ctx} id="kn-c0" label={bi("Initial content (% of label)", "مقدار اولیه (% ادعای برچسب)")} />
          <NumberInput ctx={ctx} id="kn-lim" label={bi("Lower specification limit (% of label)", "حد پایین مشخصات (% ادعای برچسب)")} />
        </>
      }
      results={[
        { label: bi("Rate constant at T₂", "ثابت سرعت در T₂"), value: k2s },
        { label: bi("Time to the limit at T₁", "زمان رسیدن به حد در T₁"), value: life1 },
        { label: bi("Time to the limit at T₂ (estimated shelf life)", "زمان رسیدن به حد در T₂ (عمر قفسه‌ای تخمینی)"), value: life2 },
        { label: bi("Half-life at T₂", "نیمه‌عمر در T₂"), value: half, hidden: !first },
      ]}
      message={msg}
      note={bi(
        "First order: t = ln(C₀/C) ÷ k, so t90 = 0.105 ÷ k and t½ = 0.693 ÷ k; zero order: t = (C₀ − C) ÷ k. Arrhenius: k₂ = k₁·exp[(Ea/R)(1/T₁ − 1/T₂)], R = 8.314 J/(mol·K); Ea of most drug degradations lies between about 50 and 100 kJ/mol. This is an estimate: shelf life is assigned from real-time data per ICH Q1A(R2) and Q1E.",
        `مرتبه اول: ${ltr("t = ln(C₀/C) ÷ k")}، بنابراین ${ltr("t90 = 0.105 ÷ k")} و ${ltr("t½ = 0.693 ÷ k")}؛ مرتبه صفر: ${ltr("t = (C₀ − C) ÷ k")}. معادله آرنیوس: ${ltr("k₂ = k₁·exp[(Ea/R)(1/T₁ − 1/T₂)]")} با ${ltr("R = 8.314 J/(mol·K)")}؛ انرژی فعال‌سازی بیشتر واکنش‌های تخریب دارو حدود 50 تا 100 کیلوژول بر مول است. این عدد تخمینی است و عمر قفسه‌ای بر پایه داده‌های زمان واقعی طبق ICH Q1A(R2) و Q1E تعیین می‌شود.`,
      )}
    />
  );
}
