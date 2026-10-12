"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, bad, listNote, ltr, mean, num, parseList, sd, type Ctx, type Values } from "./ui";

/* Manufacturing and in-process control calculators. */

const valid = (xs: number[]) => xs.length > 0 && xs.every(Number.isFinite);

export const manufacturingDefaults: Values = {
  "wv-form": "tab",
  "wv-x": "252 249 255 247 251 250 253 248 246 254 251 249 252 250 256 247 250 253 249 251",
  "fr-w1": "6.512", "fr-w2": "6.487", "fr-m": "250",
  "mo-m": "120", "mo-x0": "18", "mo-xt": "2",
  "ma-pde": "0.01", "ma-std": "10", "ma-sf": "1000", "ma-mbs": "100", "ma-mdd": "500",
  "ma-area": "200000", "ma-swab": "100", "ma-vext": "10", "ma-rec": "80", "ma-rinse": "20",
};

// ---------- Uniformity of mass ----------

const forms = [
  { value: "tab", label: bi("Tablets, uncoated or film-coated", "قرص بدون روکش یا روکش فیلمی") },
  { value: "cap", label: bi("Capsules, single-dose granules or powders", "کپسول، گرانول یا پودر تک‌دوز") },
  { value: "par", label: bi("Powders for parenteral use (single-dose)", "پودر تزریقی (تک‌دوز)") },
  { value: "sup", label: bi("Suppositories and pessaries", "شیاف و شیاف واژینال") },
];

/** Ph. Eur. 2.9.5 percentage deviation for the average mass (mg); null if the table does not cover it. */
function tolerance(form: string, avg: number): number | null {
  if (form === "tab") return avg <= 80 ? 10 : avg < 250 ? 7.5 : 5;
  if (form === "cap") return avg < 300 ? 10 : 7.5;
  if (form === "par") return avg > 40 ? 10 : null;
  return 5;
}

export function Wv({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const xs = parseList(v["wv-x"]);
  const ok = valid(xs) && xs.length === 20 && xs.every((x) => x > 0);
  let avg = DASH, range = DASH, rsd = DASH, tol = DASH, out1 = DASH, out2 = DASH, verdict = DASH;
  let msg = ok ? "" : bi("Enter the masses of exactly 20 units.", "وزن دقیقاً ۲۰ واحد را وارد کنید.")[locale];
  if (ok) {
    const m = mean(xs);
    const devs = xs.map((x) => ((x - m) / m) * 100);
    const t = tolerance(v["wv-form"], m);
    avg = `${fixed(m, 2)} mg`;
    range = `${fixed(Math.min(...devs), 2)}% … +${fixed(Math.max(...devs), 2)}%`;
    rsd = `${fixed((sd(xs) / m) * 100, 2)}%`;
    if (t === null) msg = bi("Ph. Eur. 2.9.5 gives no limit for this average mass.", "فارماکوپه اروپا برای این میانگین وزن حدی تعیین نکرده است.")[locale];
    else {
      const n1 = devs.filter((d) => Math.abs(d) > t).length, n2 = devs.filter((d) => Math.abs(d) > 2 * t).length;
      tol = `±${t}%  ·  ±${2 * t}%`;
      out1 = String(n1);
      out2 = String(n2);
      verdict = (n1 <= 2 && n2 === 0 ? bi("Complies", "منطبق") : bi("Does not comply", "منطبق نیست"))[locale];
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("wv").title}
      form={
        <>
          <Choice ctx={ctx} id="wv-form" label={bi("Dosage form", "شکل دارویی")} options={forms} />
          <ListInput ctx={ctx} id="wv-x" rows={4} label={bi("Masses of 20 units (mg)", "وزن ۲۰ واحد (میلی‌گرم)")} />
        </>
      }
      results={[
        { label: bi("Average mass", "میانگین وزن"), value: avg },
        { label: bi("Deviation range", "محدوده انحراف"), value: range },
        { label: bi("RSD", "RSD"), value: rsd },
        { label: bi("Permitted deviation (1× · 2×)", "انحراف مجاز (یک‌برابر · دوبرابر)"), value: tol },
        { label: bi("Units outside 1× (max 2)", "واحدهای خارج از حد یک‌برابر (حداکثر ۲)"), value: out1 },
        { label: bi("Units outside 2× (none allowed)", "واحدهای خارج از حد دوبرابر (هیچ)"), value: out2 },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={msg}
      note={bi(
        "Ph. Eur. 2.9.5: weigh 20 units taken at random. Not more than 2 may deviate from the average mass by more than the percentage in the table, and none by more than twice that. Tablets: 10% up to 80 mg, 7.5% between 80 and 250 mg, 5% at 250 mg or more. Capsules, single-dose granules and powders: 10% below 300 mg, 7.5% at 300 mg or more. Powders for parenteral use: 10% above 40 mg. Suppositories and pessaries: 5%. " +
          listNote.en,
        `${ltr("Ph. Eur. 2.9.5")}: ۲۰ واحد را به‌طور تصادفی وزن کنید. حداکثر ۲ واحد می‌توانند بیش از درصد جدول از میانگین انحراف داشته باشند و هیچ واحدی نباید بیش از دو برابر آن انحراف داشته باشد. قرص: تا ۸۰ میلی‌گرم 10٪، بین ۸۰ و ۲۵۰ میلی‌گرم 7.5٪، ۲۵۰ میلی‌گرم و بیشتر 5٪. کپسول، گرانول و پودر تک‌دوز: کمتر از ۳۰۰ میلی‌گرم 10٪، ۳۰۰ میلی‌گرم و بیشتر 7.5٪. پودر تزریقی: بیش از ۴۰ میلی‌گرم 10٪. شیاف: 5٪. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Friability ----------

export function Fri({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const w1 = num(v["fr-w1"]), w2 = num(v["fr-w2"]), m = num(v["fr-m"]);
  const ok = w1 > 0 && w2 >= 0 && w2 <= w1;
  const loss = ok ? ((w1 - w2) / w1) * 100 : NaN;
  const sample = m > 0 ? (m <= 650 ? `${Math.round(6500 / m)} ${bi("tablets (≈ 6.5 g)", "قرص (حدود ۶٫۵ گرم)")[locale]}` : bi("10 tablets", "۱۰ قرص")[locale]) : DASH;
  return (
    <Panel
      ctx={ctx}
      title={calculation("fri").title}
      form={
        <>
          <NumberInput ctx={ctx} id="fr-m" label={bi("Mass of one tablet (mg)", "وزن یک قرص (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="fr-w1" label={bi("Dedusted sample mass before the test W₁ (g)", "وزن نمونه گردگیری‌شده پیش از آزمون W₁ (گرم)")} />
          <NumberInput ctx={ctx} id="fr-w2" label={bi("Dedusted sample mass after 100 rotations W₂ (g)", "وزن نمونه گردگیری‌شده پس از ۱۰۰ دور W₂ (گرم)")} />
        </>
      }
      results={[
        { label: bi("Sample to test", "نمونه آزمون"), value: sample },
        { label: bi("Mass loss", "کاهش وزن"), value: ok ? `${fixed(loss, 2)}%` : DASH },
        {
          label: bi("Conclusion (≤ 1.0%)", "نتیجه (≤ 1.0٪)"),
          value: ok ? (loss <= 1 ? bi("Acceptable", "قابل قبول") : bi("Above 1.0%: repeat twice and use the mean of three", "بیش از 1.0٪: دو بار تکرار و میانگین سه آزمون"))[locale] : DASH,
        },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "USP <1216> / Ph. Eur. 2.9.7: for tablets of 650 mg or less take whole tablets as near as possible to 6.5 g; above 650 mg take 10 tablets. Dedust, weigh, rotate 100 times (25 rpm, 4 min), dedust and weigh again. A maximum mean loss of not more than 1.0% is acceptable for most products; if the result is doubtful or above the target, repeat the test twice and use the mean of the three. No tablet may be cracked, cleaved or broken.",
        `${ltr("USP <1216>")} و ${ltr("Ph. Eur. 2.9.7")}: برای قرص‌های ۶۵۰ میلی‌گرم یا کمتر، قرص‌های کامل به وزن نزدیک ۶٫۵ گرم و برای قرص‌های سنگین‌تر ۱۰ قرص بردارید. گردگیری، توزین، ۱۰۰ دور چرخش (۲۵ دور در دقیقه، ۴ دقیقه)، گردگیری و توزین دوباره. حداکثر میانگین کاهش وزن 1.0٪ برای بیشتر فرآورده‌ها قابل قبول است؛ اگر نتیجه مشکوک یا بیشتر از هدف باشد، آزمون دو بار دیگر تکرار و میانگین سه آزمون محاسبه می‌شود. هیچ قرصی نباید ترک‌خورده، لایه‌لایه یا شکسته باشد.`,
      )}
    />
  );
}

// ---------- Moisture adjustment ----------

export function Moist({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const m = num(v["mo-m"]), x0 = num(v["mo-x0"]), xt = num(v["mo-xt"]);
  const ok = m > 0 && x0 >= 0 && x0 < 100 && xt >= 0 && xt < 100;
  const dry = ok ? m * (1 - x0 / 100) : NaN;
  const final = ok ? dry / (1 - xt / 100) : NaN;
  const delta = final - m;
  return (
    <Panel
      ctx={ctx}
      title={calculation("moist").title}
      form={
        <>
          <NumberInput ctx={ctx} id="mo-m" label={bi("Current mass of the wet material (kg)", "وزن فعلی ماده مرطوب (کیلوگرم)")} />
          <NumberInput ctx={ctx} id="mo-x0" label={bi("Current moisture, LOD wet basis (%)", "رطوبت فعلی، LOD بر پایه وزن مرطوب (%)")} />
          <NumberInput ctx={ctx} id="mo-xt" label={bi("Target moisture, LOD wet basis (%)", "رطوبت هدف، LOD بر پایه وزن مرطوب (%)")} />
        </>
      }
      results={[
        { label: bi("Dry solids", "ماده خشک"), value: ok ? `${fixed(dry, 3)} kg` : DASH },
        { label: bi("Mass at the target moisture", "وزن در رطوبت هدف"), value: ok ? `${fixed(final, 3)} kg` : DASH },
        {
          label: delta >= 0 ? bi("Water to add", "آب لازم برای افزودن") : bi("Water to remove by drying", "آبی که باید با خشک کردن حذف شود"),
          value: ok ? `${fixed(Math.abs(delta), 3)} kg` : DASH,
        },
        { label: bi("Moisture on dry basis: now → target", "رطوبت بر پایه وزن خشک: فعلی ← هدف"), value: ok ? `${fixed((x0 / (100 - x0)) * 100, 2)}% → ${fixed((xt / (100 - xt)) * 100, 2)}%` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "The dry solids stay constant: M_dry = M × (1 − x₀/100) and the mass at the target is M_dry ÷ (1 − x_t/100), with moisture as LOD on the wet basis (USP <731>, Ph. Eur. 2.2.32). Dry-basis moisture = x ÷ (100 − x) × 100. The result assumes all the loss is water; volatile granulating solvents also count in LOD.",
        `ماده خشک ثابت می‌ماند: ${ltr("M_dry = M × (1 − x₀/100)")} و وزن در رطوبت هدف ${ltr("M_dry ÷ (1 − x_t/100)")} است؛ رطوبت به‌صورت LOD بر پایه وزن مرطوب ${ltr("(USP <731>, Ph. Eur. 2.2.32)")}. رطوبت بر پایه وزن خشک ${ltr("= x ÷ (100 − x) × 100")}. فرض بر این است که همه افت وزن آب است؛ حلال‌های فرار گرانولاسیون هم در LOD حساب می‌شوند.`,
      )}
    />
  );
}

// ---------- Cleaning validation ----------

export function Maco({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const pde = num(v["ma-pde"]), std = num(v["ma-std"]), sf = num(v["ma-sf"]), mbs = num(v["ma-mbs"]), mdd = num(v["ma-mdd"]);
  const area = num(v["ma-area"]), swab = num(v["ma-swab"]), vext = num(v["ma-vext"]), rec = num(v["ma-rec"]), rinse = num(v["ma-rinse"]);
  const okB = mbs > 0 && mdd > 0;
  const mbsMg = mbs * 1e6;
  const hbel = okB && pde > 0 ? (pde * mbsMg) / mdd : NaN;
  const dose = okB && std > 0 && sf > 0 ? (std * mbsMg) / (sf * mdd) : NaN;
  const ppm = mbs > 0 ? 10 * mbs : NaN;
  const all = [hbel, dose, ppm].filter(Number.isFinite);
  const maco = all.length ? Math.min(...all) : NaN;
  const okS = Number.isFinite(maco) && area > 0 && swab > 0 && swab <= area;
  const perSwab = okS ? (maco * 1000 * swab) / area : NaN;
  const mg = (x: number) => (Number.isFinite(x) ? `${sig(x)} mg` : DASH);
  const which = maco === hbel ? "HBEL" : maco === dose ? bi("dose-based", "بر پایه دوز")[locale] : "10 ppm";
  return (
    <Panel
      ctx={ctx}
      title={calculation("maco").title}
      form={
        <>
          <NumberInput ctx={ctx} id="ma-pde" label={bi("Product A: PDE / ADE (mg/day)", "محصول A: PDE یا ADE (میلی‌گرم در روز)")} />
          <NumberInput ctx={ctx} id="ma-std" label={bi("Product A: smallest therapeutic daily dose (mg)", "محصول A: کمترین دوز درمانی روزانه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="ma-sf" label={bi("Safety factor for the dose criterion", "ضریب اطمینان معیار دوز")} />
          <NumberInput ctx={ctx} id="ma-mbs" label={bi("Product B: minimum batch size (kg)", "محصول B: کوچک‌ترین اندازه بچ (کیلوگرم)")} />
          <NumberInput ctx={ctx} id="ma-mdd" label={bi("Product B: maximum daily dose (mg of product)", "محصول B: حداکثر دوز روزانه (میلی‌گرم فرآورده)")} />
          <NumberInput ctx={ctx} id="ma-area" label={bi("Shared product-contact surface area (cm²)", "سطح مشترک در تماس با محصول (سانتی‌متر مربع)")} />
          <NumberInput ctx={ctx} id="ma-swab" label={bi("Swabbed area (cm²)", "سطح سواب‌شده (سانتی‌متر مربع)")} />
          <NumberInput ctx={ctx} id="ma-vext" label={bi("Swab extraction volume (mL)", "حجم استخراج سواب (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="ma-rec" label={bi("Swab recovery (%)", "بازیافت سواب (%)")} />
          <NumberInput ctx={ctx} id="ma-rinse" label={bi("Final rinse volume (L)", "حجم آبکشی نهایی (لیتر)")} />
        </>
      }
      results={[
        { label: bi("MACO, health-based (PDE)", "MACO بر پایه سلامت (PDE)"), value: mg(hbel) },
        { label: bi("MACO, 1/SF of the therapeutic dose", "MACO بر پایه کسری از دوز درمانی"), value: mg(dose) },
        { label: bi("MACO, 10 ppm in product B", "MACO بر پایه 10 ppm در محصول B"), value: mg(ppm) },
        { label: bi("MACO used (lowest)", "MACO مبنا (کمترین)"), value: Number.isFinite(maco) ? `${sig(maco)} mg  ·  ${which}` : DASH },
        { label: bi("Limit per swab", "حد هر سواب"), value: okS ? `${sig(perSwab)} µg` : DASH },
        { label: bi("Limit in the swab solution", "حد در محلول سواب"), value: okS && vext > 0 ? `${sig(perSwab / vext)} µg/mL` : DASH },
        { label: bi("Same, corrected for recovery", "همان، اصلاح‌شده برای بازیافت"), value: okS && vext > 0 && rec > 0 && rec <= 100 ? `${sig(((perSwab / vext) * rec) / 100)} µg/mL` : DASH },
        { label: bi("Limit in the final rinse", "حد در آب آبکشی نهایی"), value: Number.isFinite(maco) && rinse > 0 ? `${sig((maco * 1000) / (rinse * 1000))} µg/mL` : DASH },
      ]}
      message={okB ? "" : bad(ctx)}
      note={bi(
        "Maximum allowable carryover of product A into the next product B. Health-based (EMA guideline on HBEL, 2014; PIC/S): MACO = PDE × MBS ÷ MDD. Traditional criteria, still used as additional checks: 1/1000 of the smallest therapeutic dose (MACO = STD × MBS ÷ (SF × MDD)) and 10 ppm of A in B. The lowest value governs. Swab limit = MACO × swabbed area ÷ shared area; the measured swab result is compared with the limit multiplied by the recovery. Rinse limit assumes the residue is evenly distributed in the final rinse.",
        `حداکثر انتقال مجاز محصول A به محصول بعدی B. بر پایه سلامت (راهنمای HBEL آژانس دارویی اروپا، ۲۰۱۴؛ PIC/S): ${ltr("MACO = PDE × MBS ÷ MDD")}. معیارهای سنتی که هنوز به‌عنوان کنترل تکمیلی به کار می‌روند: یک‌هزارم کمترین دوز درمانی ${ltr("(MACO = STD × MBS ÷ (SF × MDD))")} و 10 ppm از A در B. کمترین مقدار ملاک است. حد سواب ${ltr("= MACO × swab area ÷ shared area")}؛ نتیجه اندازه‌گیری‌شده سواب با حد ضرب‌شده در بازیافت مقایسه می‌شود. حد آبکشی با فرض توزیع یکنواخت باقیمانده در آب آبکشی نهایی است.`,
      )}
    />
  );
}
