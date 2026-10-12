"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, PresetSelect, bad, isLocked, listNote, ltr, mean, num, parseList, sd, type Ctx, type Preset, type Values } from "./ui";

/* Quality-control calculators: volumetric solutions, optical rotation and ICH impurity limits. */

const valid = (xs: number[]) => xs.length > 0 && xs.every(Number.isFinite);

export const qualityDefaults: Values = {
  "sd-sys": "0", "sd-e": "204.22", "sd-nom": "0.1", "sd-w": "510.6", "sd-p": "99.95", "sd-v": "24.95", "sd-b": "0.02", "sd-rep": "",
  "ro-mode": "sol", "ro-a": "6.68", "ro-ab": "0.02", "ro-l": "1", "ro-w": "2.5", "ro-vol": "25", "ro-lod": "0", "ro-rho": "0.85", "ro-min": "66.3", "ro-max": "67.0",
  "rs-sol": "0", "rs-pde": "30", "rs-dose": "2", "rs-m": "", "rs-ppm": "",
  "q3-el": "Pb", "q3-route": "oral", "q3-dose": "10", "q3-c": "0.12",
  "ni-sub": "0", "ni-ai": "96", "ni-mdd": "320", "ni-c": "0.05",
};

// ---------- Volumetric solution standardisation ----------

/** values: [mg of standard per mL of 1 M titrant, nominal molarity] */
const vsSystems: Preset[] = [
  { label: bi("NaOH vs potassium hydrogen phthalate", "سدیم هیدروکسید با پتاسیم هیدروژن فتالات"), values: ["204.22", "0.1"] },
  { label: bi("HCl vs sodium carbonate (anhydrous)", "هیدروکلریک اسید با سدیم کربنات بی‌آب"), values: ["52.99", "0.1"] },
  { label: bi("H₂SO₄ vs sodium carbonate (anhydrous)", "سولفوریک اسید با سدیم کربنات بی‌آب"), values: ["105.99", "0.05"] },
  { label: bi("Perchloric acid (non-aqueous) vs potassium hydrogen phthalate", "پرکلریک اسید (غیرآبی) با پتاسیم هیدروژن فتالات"), values: ["204.22", "0.1"] },
  { label: bi("Sodium thiosulfate vs potassium iodate", "سدیم تیوسولفات با پتاسیم یدات"), values: ["35.67", "0.1"] },
  { label: bi("Sodium thiosulfate vs potassium dichromate", "سدیم تیوسولفات با پتاسیم دی‌کرومات"), values: ["49.03", "0.1"] },
  { label: bi("Potassium permanganate vs sodium oxalate", "پتاسیم پرمنگنات با سدیم اگزالات"), values: ["335.0", "0.02"] },
  { label: bi("Sodium edetate vs zinc", "سدیم ادتات با فلز روی"), values: ["65.38", "0.1"] },
  { label: bi("Sodium edetate vs calcium carbonate", "سدیم ادتات با کلسیم کربنات"), values: ["100.09", "0.1"] },
  { label: bi("Silver nitrate vs sodium chloride", "نقره نیترات با سدیم کلرید"), values: ["58.44", "0.1"] },
];

export function Std({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const e = num(v["sd-e"]), nom = num(v["sd-nom"]), w = num(v["sd-w"]), p = num(v["sd-p"]), vol = num(v["sd-v"]), blank = num(v["sd-b"]);
  const ok = e > 0 && nom > 0 && w > 0 && p > 0 && p <= 100 && vol > blank && blank >= 0;
  const M = ok ? (w * (p / 100)) / ((vol - blank) * e) : NaN;
  const reps = parseList(v["sd-rep"]);
  const okR = valid(reps) && reps.length >= 2 && reps.every((x) => x > 0);
  const locked = isLocked(ctx, "sd-sys");
  return (
    <Panel
      ctx={ctx}
      title={calculation("std").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="sd-sys" label={bi("Titrant and primary standard", "تیترانت و استاندارد اولیه")} presets={vsSystems} targets={["sd-e", "sd-nom"]} />
          <NumberInput ctx={ctx} id="sd-e" label={bi("mg of standard per mL of 1 M titrant", "میلی‌گرم استاندارد به ازای هر میلی‌لیتر تیترانت ۱ مولار")} readOnly={locked} />
          <NumberInput ctx={ctx} id="sd-nom" label={bi("Nominal molarity (M)", "مولاریته اسمی (M)")} />
          <NumberInput ctx={ctx} id="sd-w" label={bi("Mass of primary standard (mg)", "وزن استاندارد اولیه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="sd-p" label={bi("Purity of the standard (%)", "خلوص استاندارد (%)")} />
          <NumberInput ctx={ctx} id="sd-v" label={bi("Titrant volume at the end-point (mL)", "حجم تیترانت در نقطه پایانی (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="sd-b" label={bi("Blank (mL)", "بلانک (میلی‌لیتر)")} />
          <ListInput ctx={ctx} id="sd-rep" label={bi("Replicate molarities for mean and RSD (optional)", "مولاریته‌های تکراری برای میانگین و RSD (اختیاری)")} />
        </>
      }
      results={[
        { label: bi("Molarity", "مولاریته"), value: ok ? `${fixed(M, 5)} M` : DASH },
        { label: bi("Factor f = M / M nominal", "ضریب f (نسبت M به M اسمی)"), value: ok ? fixed(M / nom, 4) : DASH },
        { label: bi("Replicates: mean", "تکرارها: میانگین"), value: okR ? `${fixed(mean(reps), 5)} M` : DASH, hidden: !okR },
        { label: bi("Replicates: RSD", "تکرارها: RSD"), value: okR ? `${fixed((sd(reps) / mean(reps)) * 100, 3)}%` : DASH, hidden: !okR },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "M = m × purity ÷ ((V − V_blank) × E), where E is the mass (mg) of primary standard that reacts with 1 mL of 1 M titrant: KHP 204.22 (1:1); Na₂CO₃ 52.99 for HCl (2 H⁺ per carbonate) and 105.99 for H₂SO₄; KIO₃ 35.67 and K₂Cr₂O₇ 49.03 for thiosulfate (6 S₂O₃²⁻ each); Na₂C₂O₄ 335.0 for KMnO₄ (5 oxalate : 2 permanganate); Zn 65.38 and CaCO₃ 100.09 for edetate; NaCl 58.44 for AgNO₃. Dry the standard as its monograph directs. Factor f is used in assays as M_actual ÷ M_nominal.",
        `${ltr("M = m × purity ÷ ((V − V_blank) × E)")} که E وزن (میلی‌گرم) استاندارد اولیه‌ای است که با ۱ میلی‌لیتر تیترانت ۱ مولار واکنش می‌دهد: پتاسیم هیدروژن فتالات 204.22 (۱:۱)؛ سدیم کربنات برای HCl برابر 52.99 (دو پروتون به ازای هر کربنات) و برای سولفوریک اسید 105.99؛ پتاسیم یدات 35.67 و پتاسیم دی‌کرومات 49.03 برای تیوسولفات (هر کدام معادل ۶ تیوسولفات)؛ سدیم اگزالات 335.0 برای پرمنگنات (۵ اگزالات : ۲ پرمنگنات)؛ روی 65.38 و کلسیم کربنات 100.09 برای ادتات؛ سدیم کلرید 58.44 برای نقره نیترات. استاندارد را طبق مونوگراف خشک کنید. ضریب f در تعیین مقدار به‌صورت ${ltr("M_actual ÷ M_nominal")} به کار می‌رود.`,
      )}
    />
  );
}

// ---------- Specific optical rotation ----------

const rotationModes = [
  { value: "sol", label: bi("Solution", "محلول") },
  { value: "neat", label: bi("Neat liquid", "مایع خالص") },
];

export function Rot({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const neat = v["ro-mode"] === "neat";
  const a = num(v["ro-a"]) - (num(v["ro-ab"]) || 0), l = num(v["ro-l"]);
  const w = num(v["ro-w"]), vol = num(v["ro-vol"]), lod = num(v["ro-lod"]) || 0, rho = num(v["ro-rho"]);
  const lo = num(v["ro-min"]), hi = num(v["ro-max"]);
  const c = !neat && w > 0 && vol > 0 && lod >= 0 && lod < 100 ? (w * (1 - lod / 100) * 100) / vol : NaN;
  const ok = Number.isFinite(a) && l > 0 && (neat ? rho > 0 : c > 0);
  const spec = ok ? (neat ? a / (l * rho) : (100 * a) / (l * c)) : NaN;
  const hasRange = Number.isFinite(lo) && Number.isFinite(hi) && hi >= lo;
  return (
    <Panel
      ctx={ctx}
      title={calculation("rot").title}
      form={
        <>
          <Choice ctx={ctx} id="ro-mode" label={bi("Sample", "نمونه")} options={rotationModes} />
          <NumberInput ctx={ctx} id="ro-a" label={bi("Observed angle α (°)", "زاویه مشاهده‌شده α (درجه)")} />
          <NumberInput ctx={ctx} id="ro-ab" label={bi("Blank reading (°)", "قرائت بلانک (درجه)")} />
          <NumberInput ctx={ctx} id="ro-l" label={bi("Path length l (dm)", "طول مسیر l (دسی‌متر)")} />
          {neat ? (
            <NumberInput ctx={ctx} id="ro-rho" label={bi("Density at the test temperature (g/mL)", "چگالی در دمای آزمون (گرم بر میلی‌لیتر)")} />
          ) : (
            <>
              <NumberInput ctx={ctx} id="ro-w" label={bi("Sample mass (g)", "وزن نمونه (گرم)")} />
              <NumberInput ctx={ctx} id="ro-vol" label={bi("Volume of solution (mL)", "حجم محلول (میلی‌لیتر)")} />
              <NumberInput ctx={ctx} id="ro-lod" label={bi("Water or LOD to correct for (%; 0 = as is)", "آب یا LOD برای اصلاح (%؛ صفر = بدون اصلاح)")} />
            </>
          )}
          <NumberInput ctx={ctx} id="ro-min" label={bi("Monograph range: lower limit", "محدوده مونوگراف: حد پایین")} />
          <NumberInput ctx={ctx} id="ro-max" label={bi("Monograph range: upper limit", "محدوده مونوگراف: حد بالا")} />
        </>
      }
      results={[
        { label: bi("Concentration c (g/100 mL)", "غلظت c (گرم در ۱۰۰ میلی‌لیتر)"), value: Number.isFinite(c) ? fixed(c, 4) : DASH, hidden: neat },
        { label: bi("Specific optical rotation [α]", "چرخش نوری ویژه [α]"), value: ok ? `${spec >= 0 ? "+" : "−"}${fixed(Math.abs(spec), 2)}°` : DASH },
        {
          label: bi("Conclusion", "نتیجه"),
          value: ok && hasRange ? (spec >= lo && spec <= hi ? bi("Within the range", "در محدوده") : bi("Outside the range", "خارج از محدوده"))[locale] : DASH,
        },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "USP <781> / Ph. Eur. 2.2.7: for a solution [α] = 100·α ÷ (l·c), with l in dm and c in g per 100 mL (on the dried or anhydrous basis when the monograph says so); for a neat liquid [α] = α ÷ (l·ρ). Measured at the sodium D line (589.3 nm) and 20 °C (Ph. Eur.) or 25 °C (USP) unless the monograph states otherwise. Dextrorotation is positive.",
        `${ltr("USP <781>")} و ${ltr("Ph. Eur. 2.2.7")}: برای محلول ${ltr("[α] = 100·α ÷ (l·c)")} که l بر حسب دسی‌متر و c گرم در ۱۰۰ میلی‌لیتر است (در صورت ذکر مونوگراف، بر پایه ماده خشک یا بی‌آب)؛ برای مایع خالص ${ltr("[α] = α ÷ (l·ρ)")}. اندازه‌گیری در خط D سدیم ${ltr("(589.3 nm)")} و دمای ۲۰ درجه (فارماکوپه اروپا) یا ۲۵ درجه (USP)، مگر مونوگراف چیز دیگری بگوید. چرخش راست‌گرد مثبت است.`,
      )}
    />
  );
}

// ---------- Residual solvents (ICH Q3C) ----------

/** values: [PDE mg/day] — ICH Q3C(R8) Table 2 (class 2) and the class 3 default. */
const solvents: Preset[] = [
  ["Methanol", "متانول", "30.0"], ["Acetonitrile", "استونیتریل", "4.1"], ["Dichloromethane", "دی‌کلرومتان", "6.0"],
  ["Toluene", "تولوئن", "8.9"], ["Hexane", "هگزان", "2.9"], ["Tetrahydrofuran", "تتراهیدروفوران", "7.2"],
  ["N,N-Dimethylformamide", "دی‌متیل‌فرمامید", "8.8"], ["N,N-Dimethylacetamide", "دی‌متیل‌استامید", "10.9"],
  ["N-Methylpyrrolidone", "ان‌متیل‌پیرولیدون", "5.3"], ["Chloroform", "کلروفرم", "0.6"], ["Cyclohexane", "سیکلوهگزان", "38.8"],
  ["Methylcyclohexane", "متیل‌سیکلوهگزان", "11.8"], ["1,4-Dioxane", "۱،۴-دی‌اکسان", "3.8"], ["Pyridine", "پیریدین", "2.0"],
  ["Xylene", "زایلن", "21.7"], ["Chlorobenzene", "کلروبنزن", "3.6"], ["Cumene", "کیومن", "0.7"], ["Ethylene glycol", "اتیلن گلیکول", "6.2"],
  ["Formamide", "فرمامید", "2.2"], ["2-Methoxyethanol", "۲-متوکسی‌اتانول", "0.5"], ["2-Ethoxyethanol", "۲-اتوکسی‌اتانول", "1.6"],
  ["1,2-Dimethoxyethane", "۱،۲-دی‌متوکسی‌اتان", "1.0"], ["1,2-Dichloroethene", "۱،۲-دی‌کلرواتن", "18.7"], ["Trichloroethylene", "تری‌کلرواتیلن", "0.8"],
  ["Methylbutyl ketone", "متیل بوتیل کتون", "0.5"], ["Nitromethane", "نیترومتان", "0.5"], ["Sulfolane", "سولفولان", "1.6"], ["Tetralin", "تترالین", "1.0"],
  ["Class 3 solvent (e.g. ethanol, acetone, ethyl acetate, 2-propanol)", "حلال کلاس ۳ (مثل اتانول، استون، اتیل استات، ایزوپروپانول)", "50"],
].map(([en, fa, pde]) => ({ label: bi(en, fa), values: [pde] }));

export function Q3c({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const pde = num(v["rs-pde"]), dose = num(v["rs-dose"]);
  const masses = parseList(v["rs-m"]), ppms = parseList(v["rs-ppm"]);
  const ok = pde > 0;
  const okC = valid(masses) && valid(ppms) && masses.length === ppms.length;
  const total = okC ? masses.reduce((a, m, i) => a + (m * ppms[i]) / 1000, 0) : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("q3c").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="rs-sol" label={bi("Solvent", "حلال")} presets={solvents} targets={["rs-pde"]} />
          <NumberInput ctx={ctx} id="rs-pde" label={bi("PDE (mg/day)", "PDE (میلی‌گرم در روز)")} readOnly={isLocked(ctx, "rs-sol")} />
          <NumberInput ctx={ctx} id="rs-dose" label={bi("Daily dose of the drug product (g/day)", "دوز روزانه فرآورده (گرم در روز)")} />
          <ListInput ctx={ctx} id="rs-m" label={bi("Option 2: daily mass of each component (g/day; optional)", "روش ۲: مقدار روزانه هر جزء (گرم در روز؛ اختیاری)")} />
          <ListInput ctx={ctx} id="rs-ppm" label={bi("Option 2: solvent found in each component (ppm)", "روش ۲: حلال اندازه‌گیری‌شده در هر جزء (ppm)")} />
        </>
      }
      results={[
        { label: bi("Option 1 limit (10 g/day)", "حد روش ۱ (۱۰ گرم در روز)"), value: ok ? `${sig(pde * 100)} ppm` : DASH },
        { label: bi("Limit for this daily dose", "حد برای این دوز روزانه"), value: ok && dose > 0 ? `${sig((1000 * pde) / dose)} ppm` : DASH },
        { label: bi("Option 2: total daily intake", "روش ۲: دریافت روزانه کل"), value: okC ? `${sig(total)} mg/day` : DASH, hidden: !okC },
        {
          label: bi("Option 2: conclusion", "روش ۲: نتیجه"),
          value: okC && ok ? (total <= pde ? bi("Within the PDE", "در محدوده PDE") : bi("Exceeds the PDE", "بیش از PDE"))[locale] : DASH,
          hidden: !okC,
        },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "ICH Q3C(R8): concentration limit (ppm) = 1000 × PDE (mg/day) ÷ daily dose (g/day). Option 1 assumes 10 g/day, so the limit is PDE × 100 and applies to every component without further calculation. Option 2 sums the solvent from all components of the daily dose and compares it with the PDE. Class 3 solvents: 50 mg/day (0.5%) without justification. " +
          listNote.en,
        `${ltr("ICH Q3C(R8)")}: حد غلظت ${ltr("(ppm) = 1000 × PDE (mg/day) ÷ dose (g/day)")}. روش ۱ دوز روزانه را ۱۰ گرم فرض می‌کند، پس حد ${ltr("PDE × 100")} است و برای همه اجزا بدون محاسبه دیگر معتبر است. روش ۲ حلال همه اجزای دوز روزانه را جمع و با PDE مقایسه می‌کند. حلال‌های کلاس ۳: ۵۰ میلی‌گرم در روز (0.5٪) بدون نیاز به توجیه. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Elemental impurities (ICH Q3D) ----------

/** ICH Q3D(R2) Table A.2.1: class and PDE (µg/day) for oral, parenteral and inhalation use. */
const elements: [string, string, string, number, number, number][] = [
  ["Cd", "Cadmium", "کادمیم", 5, 2, 3], ["Pb", "Lead", "سرب", 5, 5, 5], ["As", "Arsenic", "آرسنیک", 15, 15, 2], ["Hg", "Mercury", "جیوه", 30, 3, 1],
  ["Co", "Cobalt", "کبالت", 50, 5, 3], ["V", "Vanadium", "وانادیم", 100, 10, 1], ["Ni", "Nickel", "نیکل", 200, 20, 6],
  ["Tl", "Thallium", "تالیم", 8, 8, 8], ["Au", "Gold", "طلا", 300, 300, 3], ["Pd", "Palladium", "پالادیم", 100, 10, 1],
  ["Ir", "Iridium", "ایریدیم", 100, 10, 1], ["Os", "Osmium", "اسمیم", 100, 10, 1], ["Rh", "Rhodium", "رودیم", 100, 10, 1],
  ["Ru", "Ruthenium", "روتنیم", 100, 10, 1], ["Se", "Selenium", "سلنیم", 150, 80, 130], ["Ag", "Silver", "نقره", 150, 15, 7],
  ["Pt", "Platinum", "پلاتین", 100, 10, 1], ["Li", "Lithium", "لیتیم", 550, 250, 25], ["Sb", "Antimony", "آنتیموان", 1200, 90, 20],
  ["Ba", "Barium", "باریم", 1400, 700, 300], ["Mo", "Molybdenum", "مولیبدن", 3000, 1500, 10], ["Cu", "Copper", "مس", 3000, 300, 30],
  ["Sn", "Tin", "قلع", 6000, 600, 60], ["Cr", "Chromium", "کروم", 11000, 1100, 3],
];
const classOf: Record<string, string> = {
  Cd: "1", Pb: "1", As: "1", Hg: "1", Co: "2A", V: "2A", Ni: "2A",
  Tl: "2B", Au: "2B", Pd: "2B", Ir: "2B", Os: "2B", Rh: "2B", Ru: "2B", Se: "2B", Ag: "2B", Pt: "2B",
  Li: "3", Sb: "3", Ba: "3", Mo: "3", Cu: "3", Sn: "3", Cr: "3",
};
const elementOptions = elements.map(([s, en, fa]) => ({ value: s, label: bi(`${en} (${s}) · class ${classOf[s]}`, `${fa} (${s}) · کلاس ${classOf[s]}`) }));
const routesQ3d = [
  { value: "oral", label: bi("Oral", "خوراکی") },
  { value: "par", label: bi("Parenteral", "تزریقی") },
  { value: "inh", label: bi("Inhalation", "استنشاقی") },
];

export function Q3d({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const row = elements.find((e) => e[0] === v["q3-el"]);
  const pde = row ? row[v["q3-route"] === "par" ? 4 : v["q3-route"] === "inh" ? 5 : 3] : NaN;
  const dose = num(v["q3-dose"]), c = num(v["q3-c"]);
  const ok = pde > 0 && dose > 0;
  const limit = ok ? pde / dose : NaN;
  const hasC = ok && c >= 0;
  const share = hasC ? ((c * dose) / pde) * 100 : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("q3d").title}
      form={
        <>
          <Choice ctx={ctx} id="q3-el" label={bi("Element", "عنصر")} options={elementOptions} />
          <Choice ctx={ctx} id="q3-route" label={bi("Route", "راه تجویز")} options={routesQ3d} />
          <NumberInput ctx={ctx} id="q3-dose" label={bi("Maximum daily dose of the drug product (g/day)", "حداکثر دوز روزانه فرآورده (گرم در روز)")} />
          <NumberInput ctx={ctx} id="q3-c" label={bi("Measured or predicted concentration (µg/g)", "غلظت اندازه‌گیری یا پیش‌بینی‌شده (میکروگرم بر گرم)")} />
        </>
      }
      results={[
        { label: bi("PDE", "PDE"), value: ok ? `${pde} µg/day` : DASH },
        { label: bi("Permitted concentration", "غلظت مجاز"), value: ok ? `${sig(limit)} µg/g` : DASH },
        { label: bi("Control threshold (30% of PDE)", "آستانه کنترل (30٪ PDE)"), value: ok ? `${sig(0.3 * limit)} µg/g` : DASH },
        { label: bi("Daily intake", "دریافت روزانه"), value: hasC ? `${sig(c * dose)} µg/day  ·  ${fixed(share, 1)}% PDE` : DASH },
        {
          label: bi("Conclusion", "نتیجه"),
          value: hasC
            ? (share <= 30
                ? bi("Below the control threshold", "کمتر از آستانه کنترل")
                : share <= 100
                  ? bi("Within the PDE: additional controls needed", "در محدوده PDE: کنترل بیشتر لازم است")
                  : bi("Exceeds the PDE", "بیش از PDE"))[locale]
            : DASH,
        },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "ICH Q3D(R2): permitted concentration (µg/g) = PDE (µg/day) ÷ maximum daily dose (g/day); with Option 1 the dose is taken as 10 g/day. When the expected level is consistently below 30% of the PDE (the control threshold), no additional controls are needed. Class 1 and 2A elements must always be assessed; class 2B and 3 only when intentionally added or, for class 3, for parenteral and inhalation products. PDEs from Table A.2.1, including the 2022 corrections for gold, silver and nickel.",
        `${ltr("ICH Q3D(R2)")}: غلظت مجاز ${ltr("(µg/g) = PDE (µg/day) ÷ dose (g/day)")}؛ در روش ۱ دوز روزانه ۱۰ گرم فرض می‌شود. اگر سطح مورد انتظار همواره کمتر از 30٪ PDE (آستانه کنترل) باشد، کنترل بیشتری لازم نیست. عناصر کلاس ۱ و 2A همیشه ارزیابی می‌شوند؛ کلاس 2B و ۳ فقط اگر عمداً افزوده شوند یا، برای کلاس ۳، در فرآورده‌های تزریقی و استنشاقی. مقادیر PDE از جدول ${ltr("A.2.1")} با اصلاحیه ۲۰۲۲ برای طلا، نقره و نیکل.`,
      )}
    />
  );
}

// ---------- Nitrosamines ----------

/** values: [acceptable intake, ng/day] */
const nitrosamines: Preset[] = [
  ["NDMA (N-nitrosodimethylamine)", "NDMA (ان-نیتروزودی‌متیل‌آمین)", "96"],
  ["NDEA (N-nitrosodiethylamine)", "NDEA (ان-نیتروزودی‌اتیل‌آمین)", "26.5"],
  ["NMBA (N-nitroso-N-methyl-4-aminobutyric acid)", "NMBA (ان-نیتروزو-ان-متیل-۴-آمینوبوتیریک اسید)", "96"],
  ["NEIPA (N-nitrosoethylisopropylamine)", "NEIPA (ان-نیتروزواتیل‌ایزوپروپیل‌آمین)", "26.5"],
  ["NDIPA (N-nitrosodiisopropylamine)", "NDIPA (ان-نیتروزودی‌ایزوپروپیل‌آمین)", "26.5"],
  ["NMPA (N-nitrosomethylphenylamine)", "NMPA (ان-نیتروزومتیل‌فنیل‌آمین)", "26.5"],
  ["NDSRI, CPCA potency category 1", "ناخالصی NDSRI، رده توان CPCA ۱", "26.5"],
  ["NDSRI, CPCA potency category 2", "ناخالصی NDSRI، رده توان CPCA ۲", "100"],
  ["NDSRI, CPCA potency category 3", "ناخالصی NDSRI، رده توان CPCA ۳", "400"],
  ["NDSRI, CPCA potency category 4", "ناخالصی NDSRI، رده توان CPCA ۴", "1500"],
  ["NDSRI, CPCA potency category 5", "ناخالصی NDSRI، رده توان CPCA ۵", "1500"],
].map(([en, fa, ai]) => ({ label: bi(en, fa), values: [ai] }));

export function Nitro({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const ai = num(v["ni-ai"]), mdd = num(v["ni-mdd"]), c = num(v["ni-c"]);
  const ok = ai > 0 && mdd > 0;
  const limit = ok ? ai / mdd : NaN;
  const hasC = ok && c >= 0;
  const intake = hasC ? c * mdd : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("nitro").title}
      form={
        <>
          <PresetSelect ctx={ctx} id="ni-sub" label={bi("Nitrosamine", "نیتروزآمین")} presets={nitrosamines} targets={["ni-ai"]} />
          <NumberInput ctx={ctx} id="ni-ai" label={bi("Acceptable intake AI (ng/day)", "دریافت قابل قبول AI (نانوگرم در روز)")} readOnly={isLocked(ctx, "ni-sub")} />
          <NumberInput ctx={ctx} id="ni-mdd" label={bi("Maximum daily dose of the drug substance (mg/day)", "حداکثر دوز روزانه ماده مؤثره (میلی‌گرم در روز)")} />
          <NumberInput ctx={ctx} id="ni-c" label={bi("Measured level (ppm)", "مقدار اندازه‌گیری‌شده (ppm)")} />
        </>
      }
      results={[
        { label: bi("Limit", "حد مجاز"), value: ok ? `${sig(limit)} ppm  ·  ${sig(limit * 1000)} ppb` : DASH },
        { label: bi("Daily intake at the measured level", "دریافت روزانه در مقدار اندازه‌گیری‌شده"), value: hasC ? `${sig(intake)} ng/day  ·  ${fixed((intake / ai) * 100, 1)}% AI` : DASH },
        {
          label: bi("Conclusion", "نتیجه"),
          value: hasC ? (intake <= ai ? bi("Within the AI", "در محدوده AI") : bi("Exceeds the AI", "بیش از AI"))[locale] : DASH,
        },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Limit (ppm) = AI (ng/day) ÷ maximum daily dose (mg/day), since 1 ng/mg = 1 ppm. AIs as published by FDA (Control of Nitrosamine Impurities in Human Drugs) and EMA; for nitrosamine drug-substance-related impurities (NDSRIs) without compound-specific data, the Carcinogenic Potency Categorization Approach (CPCA) assigns 26.5, 100, 400 or 1500 ng/day. When several nitrosamines are present, the sum of each intake divided by its AI should not exceed 1. Check the current agency list for the specific nitrosamine.",
        `حد ${ltr("(ppm) = AI (ng/day) ÷ MDD (mg/day)")}، زیرا ${ltr("1 ng/mg = 1 ppm")}. مقادیر AI طبق فهرست منتشرشده FDA (کنترل ناخالصی‌های نیتروزآمین در داروهای انسانی) و آژانس دارویی اروپا؛ برای ناخالصی‌های نیتروزآمین مرتبط با ماده مؤثره (NDSRI) بدون داده اختصاصی، رویکرد رده‌بندی توان سرطان‌زایی (CPCA) مقدار 26.5، 100، 400 یا 1500 نانوگرم در روز تعیین می‌کند. اگر چند نیتروزآمین وجود داشته باشد، مجموع نسبت دریافت هر کدام به AI آن نباید از ۱ بیشتر شود. فهرست به‌روز مرجع را برای نیتروزآمین موردنظر بررسی کنید.`,
      )}
    />
  );
}
