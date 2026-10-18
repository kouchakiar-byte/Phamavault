"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, bad, listNote, mean, num, parseList, sd, type Ctx, type Values } from "./ui";

/* GMP and process calculators: capability, sampling, detection limits, yield and cleanroom air. */

export const gmpDefaults: Values = {
  "ck-x": "99.1 100.4 98.8 100.9 99.6 101.2 100.1 99.4 100.7 99.9 100.3 98.9 100.6 99.7 100.2 101.0 99.5 100.0 99.8 100.5",
  "ck-lsl": "95", "ck-usl": "105",
  "sp-n": "40",
  "lq-x": "0.5 1 2 5 10", "lq-y": "1210 2380 4830 12050 24110", "lq-basis": "res",
  "yd-th": "200000", "yd-good": "194300", "yd-qc": "300", "yd-rej": "2600", "yd-loss": "1900", "yd-ymin": "95", "yd-rmin": "98", "yd-rmax": "101",
  "ac-l": "6", "ac-w": "4", "ac-h": "3", "ac-q": "2600", "ac-unit": "m3h",
};

// ---------- Normal distribution ----------

/** Abramowitz & Stegun 7.1.26; absolute error below 1.5 × 10⁻⁷. */
function erf(x: number) {
  const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

// ---------- Process capability ----------

export function Cpk({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const xs = parseList(v["ck-x"]);
  const lsl = num(v["ck-lsl"]), usl = num(v["ck-usl"]);
  const hasL = Number.isFinite(lsl), hasU = Number.isFinite(usl);
  const ok = xs.length >= 2 && xs.every(Number.isFinite) && (hasL || hasU) && (!(hasL && hasU) || usl > lsl);
  let m = DASH, s = DASH, cp = DASH, cpu = DASH, cpl = DASH, cpk = DASH, ppm = DASH, verdict = DASH;
  let msg = ok ? "" : bad(ctx);
  if (ok) {
    const x = mean(xs), sdv = sd(xs);
    m = sig(x);
    s = sig(sdv);
    if (!(sdv > 0)) msg = bi("All values are equal, so capability cannot be calculated.", "همه مقادیر برابرند و شاخص توانایی محاسبه‌پذیر نیست.")[locale];
    else {
      const u = hasU ? (usl - x) / (3 * sdv) : Infinity;
      const l = hasL ? (x - lsl) / (3 * sdv) : Infinity;
      const k = Math.min(u, l);
      if (hasL && hasU) cp = fixed((usl - lsl) / (6 * sdv), 2);
      if (hasU) cpu = fixed(u, 2);
      if (hasL) cpl = fixed(l, 2);
      cpk = fixed(k, 2);
      const out = (hasU ? 1 - phi((usl - x) / sdv) : 0) + (hasL ? phi((lsl - x) / sdv) : 0);
      ppm = out * 1e6 < 0.01 ? "< 0.01 ppm" : `${sig(out * 1e6)} ppm`;
      verdict = (k >= 1.33
        ? bi("Capable (Cpk ≥ 1.33)", "توانا (Cpk ≥ 1.33)")
        : k >= 1
          ? bi("Marginal (1.00 ≤ Cpk < 1.33): tighten control", "مرزی (1.00 ≤ Cpk < 1.33): کنترل فرایند را دقیق‌تر کنید")
          : bi("Not capable (Cpk < 1.00): investigate", "ناتوان (Cpk < 1.00): بررسی و اقدام اصلاحی لازم است"))[locale];
      if (xs.length < 25)
        msg = bi(
          "Fewer than 25 results give a wide confidence interval on Cpk; treat the value as an estimate.",
          "با کمتر از ۲۵ نتیجه، بازه اطمینان Cpk پهن است و عدد به‌دست‌آمده فقط تخمین است.",
        )[locale];
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("cpk").title}
      form={
        <>
          <ListInput ctx={ctx} id="ck-x" rows={4} label={bi("Results (e.g. assay % of batches)", "نتایج (مثلاً اسی بچ‌ها به درصد)")} />
          <NumberInput ctx={ctx} id="ck-lsl" label={bi("Lower specification limit (LSL; blank if none)", "حد پایین مشخصات (LSL؛ اگر ندارد خالی بگذارید)")} />
          <NumberInput ctx={ctx} id="ck-usl" label={bi("Upper specification limit (USL; blank if none)", "حد بالای مشخصات (USL؛ اگر ندارد خالی بگذارید)")} />
        </>
      }
      results={[
        { label: bi("Mean", "میانگین"), value: m },
        { label: bi("Standard deviation (n − 1)", "انحراف معیار (n − 1)"), value: s },
        { label: bi("Cp (spread only)", "Cp (فقط پراکندگی)"), value: cp },
        { label: bi("Cpu (upper)", "Cpu (سمت بالا)"), value: cpu },
        { label: bi("Cpl (lower)", "Cpl (سمت پایین)"), value: cpl },
        { label: bi("Cpk", "Cpk"), value: cpk },
        { label: bi("Expected out of specification", "پیش‌بینی خارج از مشخصات"), value: ppm },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={msg}
      note={bi(
        "Cp = (USL − LSL) ÷ 6s; Cpu = (USL − x̄) ÷ 3s; Cpl = (x̄ − LSL) ÷ 3s; Cpk = min(Cpu, Cpl). The overall sample SD is used, so strictly this is Ppk (process performance); it equals Cpk only for a stable process. Expected out-of-specification assumes a normal distribution. Common targets: Cpk ≥ 1.33 for continued process verification (CPV) and APQR trending. " + listNote.en,
        "Cp = (USL − LSL) ÷ 6s؛ Cpu = (USL − x̄) ÷ 3s؛ Cpl = (x̄ − LSL) ÷ 3s؛ Cpk = کمینه Cpu و Cpl. انحراف معیار کل نمونه به کار رفته است، پس دقیق‌تر Ppk (عملکرد فرایند) است و فقط برای فرایند پایدار با Cpk برابر است. پیش‌بینی خارج از مشخصات بر پایه توزیع نرمال است. هدف متداول در پایش مستمر فرایند (CPV) و بازنگری سالانه (APQR): Cpk ≥ 1.33. " + listNote.fa,
      )}
    />
  );
}

// ---------- Sampling plans for incoming materials ----------

export function Samp({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const n = Math.floor(num(v["sp-n"]));
  const ok = n >= 1;
  const cap = (x: number) => Math.min(n, Math.ceil(x));
  const r = Math.sqrt(n);
  return (
    <Panel
      ctx={ctx}
      title={calculation("samp").title}
      form={<NumberInput ctx={ctx} id="sp-n" label={bi("Number of containers in the consignment (N)", "تعداد ظروف محموله (N)")} />}
      results={[
        { label: bi("n plan: n = 1 + √N (the “√N + 1” rule)", "طرح n: n = 1 + √N (قاعده «√N + 1»)"), value: ok ? String(cap(1 + r)) : DASH },
        { label: bi("p plan: p = 0.4·√N (composite samples)", "طرح p: p = 0.4·√N (نمونه‌های مرکب)"), value: ok ? String(cap(0.4 * r)) : DASH },
        { label: bi("r plan: r = 1.5·√N (herbal and crude materials)", "طرح r: r = 1.5·√N (مواد گیاهی و خام)"), value: ok ? String(cap(1.5 * r)) : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Values are rounded up to the next whole container. n plan: for uniform material from a recognised, qualified supplier — samples from n containers are tested for identity. p plan: when the material is uniform and the aim is full testing — the containers are pooled into p composite samples. r plan: for non-uniform material or material from an unqualified source (e.g. crude herbal drugs) — samples from r containers are tested separately. Under EU GMP Annex 8, identity is normally tested on a sample from every container of a starting material; sampling only some containers needs a validated procedure.",
        "اعداد به عدد صحیح بالاتر گرد شده‌اند. طرح n: برای ماده یکنواخت از تأمین‌کننده شناخته‌شده و تأییدشده؛ نمونه n ظرف برای شناسایی آزمون می‌شود. طرح p: برای ماده یکنواخت وقتی آزمون کامل لازم است؛ ظروف در p نمونه مرکب ترکیب می‌شوند. طرح r: برای ماده غیریکنواخت یا از منبع تأییدنشده (مثلاً داروهای گیاهی خام)؛ نمونه r ظرف جداگانه آزمون می‌شود. طبق ضمیمه ۸ GMP اروپا، شناسایی معمولاً روی نمونه همه ظروف ماده اولیه انجام می‌شود و نمونه‌برداری از بخشی از ظروف به روش اعتبارسنجی‌شده نیاز دارد.",
      )}
    />
  );
}

// ---------- LOD and LOQ from a calibration line ----------

const sigmaBases = [
  { value: "res", label: bi("Residual SD of the regression line (s y/x)", "انحراف معیار باقیمانده‌های رگرسیون (s y/x)") },
  { value: "int", label: bi("SD of the y-intercept", "انحراف معیار عرض از مبدأ") },
];

export function Lodq({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const x = parseList(v["lq-x"]), y = parseList(v["lq-y"]);
  const ok = x.length >= 3 && x.length === y.length && [...x, ...y].every(Number.isFinite);
  let slope = DASH, icpt = DASH, sigma = DASH, lod = DASH, loq = DASH, r2 = DASH;
  let msg = ok ? "" : bi("Enter at least 3 concentrations and the same number of responses.", "حداقل ۳ غلظت و به همان تعداد پاسخ وارد کنید.")[locale];
  if (ok) {
    const n = x.length, mx = mean(x), my = mean(y);
    const sxx = x.reduce((a, xi) => a + (xi - mx) ** 2, 0);
    const sxy = x.reduce((a, xi, i) => a + (xi - mx) * (y[i] - my), 0);
    const syy = y.reduce((a, yi) => a + (yi - my) ** 2, 0);
    if (!(sxx > 0)) msg = bad(ctx);
    else {
      const b = sxy / sxx, a = my - b * mx;
      const ssr = y.reduce((acc, yi, i) => acc + (yi - (a + b * x[i])) ** 2, 0);
      const syx = Math.sqrt(ssr / (n - 2));
      const sa = syx * Math.sqrt(1 / n + mx ** 2 / sxx);
      const s = v["lq-basis"] === "int" ? sa : syx;
      slope = sig(b);
      icpt = sig(a);
      sigma = sig(s);
      r2 = syy > 0 ? fixed(1 - ssr / syy, 5) : DASH;
      if (b === 0) msg = bad(ctx);
      else {
        lod = sig((3.3 * s) / Math.abs(b));
        loq = sig((10 * s) / Math.abs(b));
        if ((10 * s) / Math.abs(b) > Math.min(...x) * 3)
          msg = bi(
            "The LOQ is far above the lowest standard; use a calibration range close to the expected limit.",
            "LOQ بسیار بالاتر از کمترین استاندارد است؛ منحنی کالیبراسیون را در محدوده نزدیک به حد موردانتظار تهیه کنید.",
          )[locale];
      }
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("lodq").title}
      form={
        <>
          <ListInput ctx={ctx} id="lq-x" label={bi("Concentrations (e.g. µg/mL)", "غلظت‌ها (مثلاً µg/mL)")} />
          <ListInput ctx={ctx} id="lq-y" label={bi("Responses (peak areas)", "پاسخ‌ها (سطح پیک)")} />
          <Choice ctx={ctx} id="lq-basis" label={bi("σ taken from", "مبنای σ")} options={sigmaBases} />
        </>
      }
      results={[
        { label: bi("Slope (S)", "شیب (S)"), value: slope },
        { label: bi("Intercept", "عرض از مبدأ"), value: icpt },
        { label: bi("σ", "σ"), value: sigma },
        { label: bi("r²", "r²"), value: r2 },
        { label: bi("LOD = 3.3σ ÷ S", "LOD = 3.3σ ÷ S"), value: lod },
        { label: bi("LOQ = 10σ ÷ S", "LOQ = 10σ ÷ S"), value: loq },
      ]}
      message={msg}
      note={bi(
        "ICH Q2(R2): detection and quantitation limits from the standard deviation of the response and the slope. Results are in the unit of the concentrations. Confirm the calculated LOQ experimentally by analysing samples at that level for precision and accuracy (or a signal-to-noise of about 10:1). " + listNote.en,
        "طبق ICH Q2(R2): حد تشخیص و حد اندازه‌گیری از انحراف معیار پاسخ و شیب منحنی. نتایج با واحد غلظت‌ها است. LOQ محاسبه‌شده را با آنالیز نمونه در همان سطح از نظر دقت و صحت (یا نسبت سیگنال به نویز حدود ۱۰ به ۱) تأیید تجربی کنید. " + listNote.fa,
      )}
    />
  );
}

// ---------- Batch yield and reconciliation ----------

export function Yld({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const th = num(v["yd-th"]), good = num(v["yd-good"]), qc = num(v["yd-qc"]), rej = num(v["yd-rej"]), loss = num(v["yd-loss"]);
  const ymin = num(v["yd-ymin"]), rmin = num(v["yd-rmin"]), rmax = num(v["yd-rmax"]);
  const ok = th > 0 && [good, qc, rej, loss].every((x) => x >= 0);
  let yld = DASH, rec = DASH, gap = DASH, verdict = DASH;
  if (ok) {
    const y = (good / th) * 100, r = ((good + qc + rej + loss) / th) * 100;
    yld = `${fixed(y, 2)}%`;
    rec = `${fixed(r, 2)}%`;
    gap = sig(th - (good + qc + rej + loss));
    const yOk = !Number.isFinite(ymin) || y >= ymin;
    const rOk = (!Number.isFinite(rmin) || r >= rmin) && (!Number.isFinite(rmax) || r <= rmax);
    verdict = (yOk && rOk
      ? bi("Within limits", "در محدوده مجاز")
      : bi("Outside limits: raise a deviation and investigate", "خارج از محدوده: انحراف ثبت و بررسی شود"))[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("yld").title}
      form={
        <>
          <NumberInput ctx={ctx} id="yd-th" label={bi("Theoretical quantity (units or kg)", "مقدار تئوری (تعداد یا کیلوگرم)")} />
          <NumberInput ctx={ctx} id="yd-good" label={bi("Good output released to the next step", "محصول قابل‌قبول تحویل‌شده")} />
          <NumberInput ctx={ctx} id="yd-qc" label={bi("QC and retention samples", "نمونه‌های کنترل کیفیت و نگهداری")} />
          <NumberInput ctx={ctx} id="yd-rej" label={bi("Rejects", "ضایعات مردودی")} />
          <NumberInput ctx={ctx} id="yd-loss" label={bi("Documented process losses (start-up, dust, line clearance)", "افت مستند فرایند (راه‌اندازی، گرد و غبار، ترخیص خط)")} />
          <NumberInput ctx={ctx} id="yd-ymin" label={bi("Minimum yield in the batch record (%)", "حداقل بازده در دستور ساخت (%)")} />
          <NumberInput ctx={ctx} id="yd-rmin" label={bi("Reconciliation lower limit (%)", "حد پایین تطبیق مقادیر (%)")} />
          <NumberInput ctx={ctx} id="yd-rmax" label={bi("Reconciliation upper limit (%)", "حد بالای تطبیق مقادیر (%)")} />
        </>
      }
      results={[
        { label: bi("Actual yield", "بازده واقعی"), value: yld },
        { label: bi("Reconciliation", "تطبیق مقادیر (Reconciliation)"), value: rec },
        { label: bi("Unaccounted quantity", "مقدار نامشخص"), value: gap },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Yield = good output ÷ theoretical × 100; reconciliation = (good + samples + rejects + documented losses) ÷ theoretical × 100. Use the same unit throughout. Limits come from the master batch record; a result outside them is a deviation to investigate before release. The same calculation applies to printed packaging materials, where any unexplained difference must be investigated.",
        "بازده = محصول قابل‌قبول ÷ مقدار تئوری × ۱۰۰؛ تطبیق مقادیر = (محصول قابل‌قبول + نمونه‌ها + مردودی + افت مستند) ÷ مقدار تئوری × ۱۰۰. همه مقادیر با یک واحد باشند. حدود از دستور ساخت اصلی (MBR) گرفته می‌شود و نتیجه خارج از آن انحرافی است که پیش از آزادسازی باید بررسی شود. همین محاسبه برای مواد بسته‌بندی چاپی هم به کار می‌رود و هر اختلاف توضیح‌داده‌نشده باید بررسی شود.",
      )}
    />
  );
}

// ---------- Cleanroom air changes ----------

const airUnits = [
  { value: "m3h", label: bi("m³/h", "m³/h") },
  { value: "cfm", label: bi("CFM (ft³/min)", "CFM (فوت مکعب بر دقیقه)") },
];

export function Ach({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const l = num(v["ac-l"]), w = num(v["ac-w"]), h = num(v["ac-h"]), q0 = num(v["ac-q"]);
  const q = v["ac-unit"] === "cfm" ? q0 * 1.69901 : q0;
  const ok = l > 0 && w > 0 && h > 0 && q > 0;
  const vol = l * w * h, ach = q / vol;
  return (
    <Panel
      ctx={ctx}
      title={calculation("ach").title}
      form={
        <>
          <NumberInput ctx={ctx} id="ac-l" label={bi("Room length (m)", "طول اتاق (متر)")} />
          <NumberInput ctx={ctx} id="ac-w" label={bi("Room width (m)", "عرض اتاق (متر)")} />
          <NumberInput ctx={ctx} id="ac-h" label={bi("Room height (m)", "ارتفاع اتاق (متر)")} />
          <NumberInput ctx={ctx} id="ac-q" label={bi("Supply air flow", "دبی هوای ورودی")} />
          <Choice ctx={ctx} id="ac-unit" label={bi("Air flow unit", "واحد دبی هوا")} options={airUnits} />
        </>
      }
      results={[
        { label: bi("Room volume", "حجم اتاق"), value: ok ? `${fixed(vol, 1)} m³` : DASH },
        { label: bi("Supply air flow", "دبی هوای ورودی"), value: ok ? `${fixed(q, 0)} m³/h` : DASH },
        { label: bi("Air changes per hour (ACH)", "تعداد تعویض هوا در ساعت (ACH)"), value: ok ? fixed(ach, 1) : DASH },
        { label: bi("Theoretical 100:1 recovery time", "زمان بازیابی نظری ۱۰۰ به ۱"), value: ok ? `${fixed((60 * Math.log(100)) / ach, 1)} min` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "ACH = supply air (m³/h) ÷ room volume (m³); 1 CFM = 1.699 m³/h. The recovery time assumes perfect mixing: t = 60·ln(100) ÷ ACH. EU GMP Annex 1 sets particle limits and a guidance clean-up time of 15–20 minutes, not a fixed ACH; air change rates are design values to be confirmed by the ISO 14644-3 recovery test.",
        "ACH = دبی هوای ورودی (m³/h) ÷ حجم اتاق (m³)؛ هر CFM برابر 1.699 m³/h. زمان بازیابی با فرض اختلاط کامل: t = 60·ln(100) ÷ ACH. ضمیمه ۱ GMP اروپا حدود ذرات و زمان راهنمای پاک‌سازی ۱۵ تا ۲۰ دقیقه را تعیین می‌کند نه عدد ثابت ACH؛ نرخ تعویض هوا مقدار طراحی است و باید با آزمون بازیابی ISO 14644-3 تأیید شود.",
      )}
    />
  );
}
