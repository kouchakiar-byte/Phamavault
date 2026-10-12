"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, NumberInput, Panel, bad, ltr, num, type Ctx, type Values } from "./ui";

/* Dosing and pharmacokinetic calculators. */

export const clinicalDefaults: Values = {
  "bs-h": "170", "bs-w": "70", "bs-sex": "m",
  "cr-age": "65", "cr-w": "80", "cr-h": "170", "cr-sex": "m", "cr-scr": "1.2", "cr-unit": "mgdl", "cr-wt": "actual",
  "in-mode": "mgh", "in-amt": "250", "in-vol": "250", "in-rate": "50", "in-w": "70", "in-df": "20",
  "pk-c1": "12", "pk-t1": "2", "pk-c2": "6", "pk-t2": "8", "pk-vd": "40", "pk-f": "1", "pk-d": "500", "pk-tau": "12", "pk-ct": "10",
  "hd-sp": "rat", "hd-dose": "50", "hd-sf": "10", "hd-bw": "60",
};

const disclaimer = bi(
  " For education and checking; dosing decisions belong to the treating clinician.",
  " برای آموزش و کنترل محاسبات؛ تصمیم درباره دوز با پزشک معالج است.",
);

const sexes = [
  { value: "m", label: bi("Male", "مرد") },
  { value: "f", label: bi("Female", "زن") },
];

/** Devine ideal body weight (kg): 50 (men) or 45.5 (women) + 2.3 kg per inch over 5 feet. */
const ibw = (heightCm: number, sex: string) => (sex === "f" ? 45.5 : 50) + 2.3 * (heightCm / 2.54 - 60);
/** Adjusted body weight when actual weight is above 120% of ideal. */
const adjusted = (w: number, ideal: number) => (w > 1.2 * ideal ? ideal + 0.4 * (w - ideal) : w);

// ---------- BSA, BMI and body weight ----------

export function Bsa({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const h = num(v["bs-h"]), w = num(v["bs-w"]);
  const ok = h > 0 && w > 0;
  const bmi = ok ? w / (h / 100) ** 2 : NaN;
  const category = !ok
    ? DASH
    : (bmi < 18.5
        ? bi("underweight", "کم‌وزن")
        : bmi < 25
          ? bi("normal", "طبیعی")
          : bmi < 30
            ? bi("overweight", "اضافه‌وزن")
            : bi("obese", "چاق"))[locale];
  const ideal = ok ? ibw(h, v["bs-sex"]) : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("bsa").title}
      form={
        <>
          <NumberInput ctx={ctx} id="bs-h" label={bi("Height (cm)", "قد (سانتی‌متر)")} />
          <NumberInput ctx={ctx} id="bs-w" label={bi("Weight (kg)", "وزن (کیلوگرم)")} />
          <Choice ctx={ctx} id="bs-sex" label={bi("Sex", "جنس")} options={sexes} />
        </>
      }
      results={[
        { label: bi("BSA, Mosteller", "سطح بدن، موستلر"), value: ok ? `${fixed(Math.sqrt((h * w) / 3600), 2)} m²` : DASH },
        { label: bi("BSA, DuBois", "سطح بدن، دوبوآ"), value: ok ? `${fixed(0.007184 * w ** 0.425 * h ** 0.725, 2)} m²` : DASH },
        { label: bi("BSA, Haycock", "سطح بدن، هایکاک"), value: ok ? `${fixed(0.024265 * w ** 0.5378 * h ** 0.3964, 2)} m²` : DASH },
        { label: bi("BMI", "شاخص توده بدنی (BMI)"), value: ok ? `${fixed(bmi, 1)} kg/m²  ·  ${category}` : DASH },
        { label: bi("Ideal body weight (Devine)", "وزن ایده‌آل (دیواین)"), value: ok && ideal > 0 ? `${fixed(ideal, 1)} kg` : DASH },
        { label: bi("Adjusted body weight", "وزن اصلاح‌شده"), value: ok && ideal > 0 ? `${fixed(adjusted(w, ideal), 1)} kg` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Mosteller: BSA = √(height cm × weight kg ÷ 3600). DuBois: 0.007184 × W^0.425 × H^0.725. Haycock (also used in children): 0.024265 × W^0.5378 × H^0.3964. BMI = weight ÷ height² (WHO: <18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, ≥30 obese). Devine ideal body weight: 50 kg (men) or 45.5 kg (women) + 2.3 kg per inch above 5 feet (152.4 cm); adjusted weight = IBW + 0.4 × (actual − IBW) when actual weight exceeds 120% of IBW." +
          disclaimer.en,
        `موستلر: ${ltr("BSA = √(H × W ÷ 3600)")} (قد بر حسب سانتی‌متر و وزن بر حسب کیلوگرم). دوبوآ: ${ltr("0.007184 × W^0.425 × H^0.725")}. هایکاک (در کودکان هم به کار می‌رود): ${ltr("0.024265 × W^0.5378 × H^0.3964")}. ${ltr("BMI = W ÷ H²")} (سازمان جهانی بهداشت: کمتر از 18.5 کم‌وزن، 18.5 تا 24.9 طبیعی، 25 تا 29.9 اضافه‌وزن، 30 و بیشتر چاق). وزن ایده‌آل دیواین: ۵۰ کیلوگرم (مرد) یا ۴۵٫۵ کیلوگرم (زن) به‌اضافه ۲٫۳ کیلوگرم برای هر اینچ قد بالاتر از ۱۵۲٫۴ سانتی‌متر؛ وزن اصلاح‌شده ${ltr("= IBW + 0.4 × (W − IBW)")} وقتی وزن واقعی بیش از 120٪ وزن ایده‌آل باشد.` +
          disclaimer.fa,
      )}
    />
  );
}

// ---------- Renal function ----------

const scrUnits = [
  { value: "mgdl", label: bi("mg/dL", "mg/dL") },
  { value: "umol", label: bi("µmol/L", "µmol/L") },
];
const weightBases = [
  { value: "actual", label: bi("Actual body weight", "وزن واقعی") },
  { value: "ideal", label: bi("Ideal body weight", "وزن ایده‌آل") },
  { value: "adjusted", label: bi("Adjusted body weight", "وزن اصلاح‌شده") },
];

function gStage(egfr: number) {
  if (egfr >= 90) return "G1";
  if (egfr >= 60) return "G2";
  if (egfr >= 45) return "G3a";
  if (egfr >= 30) return "G3b";
  if (egfr >= 15) return "G4";
  return "G5";
}

export function Crcl({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const age = num(v["cr-age"]), w = num(v["cr-w"]), h = num(v["cr-h"]);
  const female = v["cr-sex"] === "f";
  const scrIn = num(v["cr-scr"]);
  const scr = v["cr-unit"] === "umol" ? scrIn / 88.4 : scrIn;
  const ok = age >= 18 && age < 140 && w > 0 && scr > 0;
  const ideal = h > 0 ? ibw(h, v["cr-sex"]) : NaN;
  const basis = v["cr-wt"];
  const weight = basis === "ideal" ? ideal : basis === "adjusted" ? adjusted(w, ideal) : w;
  const cg = ok && weight > 0 ? (((140 - age) * weight) / (72 * scr)) * (female ? 0.85 : 1) : NaN;
  const k = female ? 0.7 : 0.9, a = female ? -0.241 : -0.302;
  const egfr = ok ? 142 * Math.min(scr / k, 1) ** a * Math.max(scr / k, 1) ** -1.2 * 0.9938 ** age * (female ? 1.012 : 1) : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("crcl").title}
      form={
        <>
          <NumberInput ctx={ctx} id="cr-age" label={bi("Age (years, adults)", "سن (سال، بزرگسال)")} />
          <Choice ctx={ctx} id="cr-sex" label={bi("Sex", "جنس")} options={sexes} />
          <NumberInput ctx={ctx} id="cr-w" label={bi("Weight (kg)", "وزن (کیلوگرم)")} />
          <NumberInput ctx={ctx} id="cr-h" label={bi("Height (cm)", "قد (سانتی‌متر)")} />
          <NumberInput ctx={ctx} id="cr-scr" label={bi("Serum creatinine", "کراتینین سرم")} />
          <Choice ctx={ctx} id="cr-unit" label={bi("Creatinine unit", "واحد کراتینین")} options={scrUnits} />
          <Choice ctx={ctx} id="cr-wt" label={bi("Weight for Cockcroft–Gault", "وزن مبنای کاکرافت–گالت")} options={weightBases} />
        </>
      }
      results={[
        { label: bi("Serum creatinine", "کراتینین سرم"), value: scr > 0 ? `${fixed(scr, 2)} mg/dL  ·  ${fixed(scr * 88.4, 0)} µmol/L` : DASH },
        { label: bi("Weight used", "وزن به‌کاررفته"), value: weight > 0 ? `${fixed(weight, 1)} kg` : DASH },
        { label: bi("CrCl, Cockcroft–Gault", "کلیرانس کراتینین، کاکرافت–گالت"), value: Number.isFinite(cg) ? `${fixed(cg, 0)} mL/min` : DASH },
        { label: bi("eGFR, CKD-EPI 2021", "eGFR، CKD-EPI 2021"), value: Number.isFinite(egfr) ? `${fixed(egfr, 0)} mL/min/1.73 m²  ·  ${gStage(egfr)}` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Cockcroft–Gault (1976): CrCl (mL/min) = (140 − age) × weight ÷ (72 × SCr mg/dL), × 0.85 for women; most drug labels base renal dose adjustment on it. CKD-EPI 2021 (race-free): eGFR = 142 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^−1.200 × 0.9938^age × 1.012 (women), κ = 0.7/0.9 and α = −0.241/−0.302 for women/men. KDIGO stages: G1 ≥ 90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 < 15. 1 mg/dL creatinine = 88.4 µmol/L." +
          disclaimer.en,
        `کاکرافت–گالت (۱۹۷۶): ${ltr("CrCl = (140 − age) × W ÷ (72 × SCr)")} میلی‌لیتر در دقیقه با کراتینین بر حسب mg/dL، در زنان ضرب در 0.85؛ تنظیم دوز کلیوی در بیشتر بروشورهای دارویی بر پایه آن است. ${ltr("CKD-EPI 2021")} (بدون ضریب نژاد): ${ltr("eGFR = 142 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^−1.200 × 0.9938^age × 1.012 [F]")} که κ برای زن و مرد 0.7 و 0.9 و α برابر −0.241 و −0.302 است. مراحل KDIGO: ${ltr("G1 ≥ 90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 < 15")}. هر ${ltr("1 mg/dL")} کراتینین برابر ${ltr("88.4 µmol/L")} است.` +
          disclaimer.fa,
      )}
    />
  );
}

// ---------- IV infusion ----------

const infusionModes = [
  { value: "mgh", label: bi("Dose in mg/h", "دوز بر حسب mg/h") },
  { value: "mcgkgmin", label: bi("Dose in µg/kg/min", "دوز بر حسب µg/kg/min") },
  { value: "uh", label: bi("Dose in units/h", "دوز بر حسب واحد در ساعت") },
];
const dropFactors = ["10", "15", "20", "60"].map((d) => ({ value: d, label: bi(`${d} drops/mL`, `${d} قطره در میلی‌لیتر`) }));

export function Inf({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const mode = v["in-mode"];
  const amt = num(v["in-amt"]), vol = num(v["in-vol"]), rate = num(v["in-rate"]), w = num(v["in-w"]), df = num(v["in-df"]);
  const units = mode === "uh";
  const ok = amt > 0 && vol > 0 && rate > 0 && (mode !== "mcgkgmin" || w > 0);
  const conc = ok ? amt / vol : NaN; // mg/mL or units/mL
  const perHour = mode === "mcgkgmin" ? (rate * w * 60) / 1000 : rate; // mg/h or units/h
  const mlh = ok ? perHour / conc : NaN;
  const hours = ok ? vol / mlh : NaN;
  const hm = Number.isFinite(hours) ? `${Math.floor(hours)} h ${String(Math.round((hours % 1) * 60)).padStart(2, "0")} min` : DASH;
  const u = units ? "units" : "mg";
  return (
    <Panel
      ctx={ctx}
      title={calculation("inf").title}
      form={
        <>
          <Choice ctx={ctx} id="in-mode" label={bi("Ordered dose", "دوز دستورشده")} options={infusionModes} />
          <NumberInput ctx={ctx} id="in-amt" label={units ? bi("Drug in the bag (units)", "مقدار دارو در کیسه (واحد)") : bi("Drug in the bag (mg)", "مقدار دارو در کیسه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="in-vol" label={bi("Bag volume (mL)", "حجم کیسه (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="in-rate" label={bi("Ordered dose rate", "سرعت دوز دستورشده")} />
          {mode === "mcgkgmin" && <NumberInput ctx={ctx} id="in-w" label={bi("Patient weight (kg)", "وزن بیمار (کیلوگرم)")} />}
          <Choice ctx={ctx} id="in-df" label={bi("Giving-set drop factor", "ضریب قطره ست تزریق")} options={dropFactors} />
        </>
      }
      results={[
        { label: bi("Concentration", "غلظت"), value: ok ? (units ? `${sig(conc)} units/mL` : `${sig(conc)} mg/mL  ·  ${sig(conc * 1000)} µg/mL`) : DASH },
        { label: bi("Dose per hour", "دوز در ساعت"), value: ok ? `${sig(perHour)} ${u}/h` : DASH, hidden: mode !== "mcgkgmin" },
        { label: bi("Infusion rate", "سرعت انفوزیون"), value: ok ? `${fixed(mlh, 1)} mL/h` : DASH },
        { label: bi("Drip rate", "سرعت قطره"), value: ok && df > 0 ? `${fixed((mlh * df) / 60, 0)} drops/min` : DASH },
        { label: bi("Time to infuse the bag", "زمان تخلیه کیسه"), value: hm },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Concentration = drug in the bag ÷ volume; mL/h = dose per hour ÷ concentration; for weight-based orders, mg/h = µg/kg/min × kg × 60 ÷ 1000. Drops/min = mL/h × drop factor ÷ 60 (macro sets 10–20 drops/mL, micro sets 60). Use an infusion pump for high-alert drugs." +
          disclaimer.en,
        `غلظت = مقدار دارو در کیسه ÷ حجم؛ ${ltr("mL/h = dose per hour ÷ concentration")}؛ برای دستور بر پایه وزن ${ltr("mg/h = µg/kg/min × kg × 60 ÷ 1000")}. ${ltr("drops/min = mL/h × drop factor ÷ 60")} (ست‌های ماکرو ۱۰ تا ۲۰ قطره در میلی‌لیتر و ست میکرو ۶۰). برای داروهای پرخطر از پمپ انفوزیون استفاده کنید.` +
          disclaimer.fa,
      )}
    />
  );
}

// ---------- One-compartment pharmacokinetics ----------

export function Pk({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const c1 = num(v["pk-c1"]), t1 = num(v["pk-t1"]), c2 = num(v["pk-c2"]), t2 = num(v["pk-t2"]);
  const vd = num(v["pk-vd"]), f = num(v["pk-f"]), d = num(v["pk-d"]), tau = num(v["pk-tau"]), ct = num(v["pk-ct"]);
  const ok = c1 > c2 && c2 > 0 && t2 > t1;
  const k = ok ? Math.log(c1 / c2) / (t2 - t1) : NaN;
  const half = Math.LN2 / k;
  const okV = ok && vd > 0;
  const cl = okV ? k * vd : NaN;
  const okD = okV && f > 0 && f <= 1 && d > 0 && tau > 0;
  const okT = okV && f > 0 && f <= 1 && ct > 0;
  return (
    <Panel
      ctx={ctx}
      title={calculation("pk").title}
      form={
        <>
          <NumberInput ctx={ctx} id="pk-c1" label={bi("Concentration C₁ (mg/L)", "غلظت C₁ (میلی‌گرم در لیتر)")} />
          <NumberInput ctx={ctx} id="pk-t1" label={bi("Time of C₁ (h)", "زمان C₁ (ساعت)")} />
          <NumberInput ctx={ctx} id="pk-c2" label={bi("Concentration C₂ (mg/L)", "غلظت C₂ (میلی‌گرم در لیتر)")} />
          <NumberInput ctx={ctx} id="pk-t2" label={bi("Time of C₂ (h)", "زمان C₂ (ساعت)")} />
          <NumberInput ctx={ctx} id="pk-vd" label={bi("Volume of distribution Vd (L)", "حجم توزیع Vd (لیتر)")} />
          <NumberInput ctx={ctx} id="pk-f" label={bi("Bioavailability F (0–1)", "فراهمی زیستی F (۰ تا ۱)")} />
          <NumberInput ctx={ctx} id="pk-d" label={bi("Maintenance dose (mg)", "دوز نگهدارنده (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="pk-tau" label={bi("Dosing interval τ (h)", "فاصله دوز τ (ساعت)")} />
          <NumberInput ctx={ctx} id="pk-ct" label={bi("Target average steady-state concentration (mg/L)", "غلظت میانگین هدف در حالت پایدار (میلی‌گرم در لیتر)")} />
        </>
      }
      results={[
        { label: bi("Elimination rate constant k", "ثابت سرعت حذف k"), value: ok ? `${fixed(k, 4)} h⁻¹` : DASH },
        { label: bi("Half-life t½", "نیمه‌عمر t½"), value: ok ? `${fixed(half, 2)} h` : DASH },
        { label: bi("Clearance CL = k·Vd", "کلیرانس ⁦(CL = k·Vd)⁩"), value: okV ? `${fixed(cl, 2)} L/h` : DASH },
        { label: bi("Time to ~90% of steady state", "زمان رسیدن به حدود 90٪ حالت پایدار"), value: ok ? `${fixed(3.32 * half, 1)} h` : DASH },
        { label: bi("Accumulation factor R", "ضریب تجمع R"), value: ok && tau > 0 ? fixed(1 / (1 - Math.exp(-k * tau)), 2) : DASH },
        { label: bi("Average steady-state concentration", "غلظت میانگین حالت پایدار"), value: okD ? `${fixed((f * d) / (cl * tau), 2)} mg/L` : DASH },
        { label: bi("Loading dose for the target", "دوز بارگیری برای غلظت هدف"), value: okT ? `${sig((ct * vd) / f)} mg` : DASH },
        { label: bi("Maintenance dose for the target", "دوز نگهدارنده برای غلظت هدف"), value: okT && tau > 0 ? `${sig((ct * cl * tau) / f)} mg / ${sig(tau)} h` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "One-compartment model with first-order elimination; both samples in the elimination phase. k = ln(C₁/C₂) ÷ (t₂ − t₁), t½ = 0.693 ÷ k, CL = k × Vd. Accumulation R = 1 ÷ (1 − e^(−kτ)); C_ss,avg = F × dose ÷ (CL × τ); about 3.3 half-lives give 90% of steady state. Loading dose = C_target × Vd ÷ F; maintenance dose = C_target × CL × τ ÷ F." +
          disclaimer.en,
        `مدل تک‌بخشی با حذف درجه اول؛ هر دو نمونه در فاز حذف. ${ltr("k = ln(C₁/C₂) ÷ (t₂ − t₁)")}، ${ltr("t½ = 0.693 ÷ k")}، ${ltr("CL = k × Vd")}. ضریب تجمع ${ltr("R = 1 ÷ (1 − e^(−kτ))")}؛ ${ltr("C_ss,avg = F × dose ÷ (CL × τ)")}؛ حدود ۳٫۳ نیمه‌عمر برای رسیدن به 90٪ حالت پایدار لازم است. دوز بارگیری ${ltr("= C_target × Vd ÷ F")} و دوز نگهدارنده ${ltr("= C_target × CL × τ ÷ F")}.` +
          disclaimer.fa,
      )}
    />
  );
}

// ---------- Human equivalent dose ----------

/** FDA (2005) Table 1: Km = body weight (kg) ÷ body surface area (m²). */
const species = [
  ["mouse", "Mouse", "موش سوری", 3], ["hamster", "Hamster", "همستر", 5], ["rat", "Rat", "موش صحرایی", 6],
  ["ferret", "Ferret", "راسو (فرت)", 7], ["guinea", "Guinea pig", "خوکچه هندی", 8], ["rabbit", "Rabbit", "خرگوش", 12],
  ["dog", "Dog", "سگ", 20], ["monkey", "Monkey (rhesus)", "میمون (رزوس)", 12], ["marmoset", "Marmoset", "مارموست", 6],
  ["squirrel", "Squirrel monkey", "میمون سنجابی", 7], ["baboon", "Baboon", "بابون", 20], ["micropig", "Micro-pig", "میکروپیگ", 27],
  ["minipig", "Mini-pig", "مینی‌پیگ", 35],
] as const;
const speciesOptions = species.map(([value, en, fa, km]) => ({ value, label: bi(`${en} (Km = ${km})`, `${fa} (Km = ${km})`) }));
const HUMAN_KM = 37;

export function Hed({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const km = species.find((s) => s[0] === v["hd-sp"])?.[3] ?? NaN;
  const dose = num(v["hd-dose"]), sf = num(v["hd-sf"]), bw = num(v["hd-bw"]);
  const ok = km > 0 && dose > 0;
  const hed = ok ? (dose * km) / HUMAN_KM : NaN;
  const okS = ok && sf >= 1;
  return (
    <Panel
      ctx={ctx}
      title={calculation("hed").title}
      form={
        <>
          <Choice ctx={ctx} id="hd-sp" label={bi("Species", "گونه حیوان")} options={speciesOptions} />
          <NumberInput ctx={ctx} id="hd-dose" label={bi("Animal NOAEL (mg/kg)", "NOAEL حیوانی (میلی‌گرم بر کیلوگرم)")} />
          <NumberInput ctx={ctx} id="hd-sf" label={bi("Safety factor", "ضریب اطمینان")} />
          <NumberInput ctx={ctx} id="hd-bw" label={bi("Human body weight (kg)", "وزن انسان (کیلوگرم)")} />
        </>
      }
      results={[
        { label: bi("Divide the animal dose by", "دوز حیوانی تقسیم بر"), value: ok ? fixed(HUMAN_KM / km, 1) : DASH },
        { label: bi("HED", "دوز معادل انسانی (HED)"), value: ok ? `${sig(hed)} mg/kg${bw > 0 ? `  ·  ${sig(hed * bw)} mg` : ""}` : DASH },
        { label: bi("MRSD = HED ÷ safety factor", "MRSD (HED تقسیم بر ضریب اطمینان)"), value: okS ? `${sig(hed / sf)} mg/kg${bw > 0 ? `  ·  ${sig((hed / sf) * bw)} mg` : ""}` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "FDA guidance (2005), Estimating the Maximum Safe Starting Dose in Initial Clinical Trials for Therapeutics in Adult Healthy Volunteers: HED (mg/kg) = animal NOAEL × (animal Km ÷ human Km), with human Km = 37 (60 kg adult). The maximum recommended starting dose (MRSD) is the HED from the most appropriate species divided by a safety factor, by default 10. Body-surface-area scaling does not apply to every product (e.g. proteins given intravascularly)." +
          disclaimer.en,
        `راهنمای FDA (۲۰۰۵) درباره برآورد حداکثر دوز شروع ایمن در نخستین کارآزمایی‌های بالینی در داوطلبان سالم بزرگسال: ${ltr("HED (mg/kg) = NOAEL × (Km animal ÷ Km human)")} با Km انسان برابر ۳۷ (بزرگسال ۶۰ کیلوگرمی). حداکثر دوز شروع توصیه‌شده (MRSD) برابر HED مناسب‌ترین گونه تقسیم بر ضریب اطمینان (به‌طور پیش‌فرض ۱۰) است. مقیاس‌بندی بر پایه سطح بدن برای همه فرآورده‌ها کاربرد ندارد (مثلاً پروتئین‌هایی که داخل عروقی تجویز می‌شوند).` +
          disclaimer.fa,
      )}
    />
  );
}
