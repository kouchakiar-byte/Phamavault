"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, bad, listNote, ltr, mean, num, parseList, sd, type Ctx } from "./ui";

/* Analytical and quality-control calculators. */

const valid = (xs: number[]) => xs.length > 0 && xs.every(Number.isFinite);

// ---------- Assay by external standard ----------

export function Hplc({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const au = num(v["hp-au"]), as = num(v["hp-as"]), ws = num(v["hp-ws"]), vs = num(v["hp-vs"]), p = num(v["hp-p"]);
  const wu = num(v["hp-wu"]), vu = num(v["hp-vu"]), avg = num(v["hp-avg"]), lc = num(v["hp-lc"]);
  let cs = DASH, cu = DASH, perUnit = DASH, pct = DASH, msg = "";
  if (![au, as, ws, vs, p, wu, vu, avg, lc].every((x) => x > 0)) msg = bad(ctx);
  else {
    const cStd = (ws * p) / 100 / vs, cSmp = (au / as) * cStd, mg = ((cSmp * vu) / wu) * avg;
    cs = `${sig(cStd)} mg/mL`;
    cu = `${sig(cSmp)} mg/mL`;
    perUnit = `${fixed(mg, 2)} mg`;
    pct = `${fixed((mg / lc) * 100, 1)}%`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("hplc").title}
      form={
        <>
          <NumberInput ctx={ctx} id="hp-au" label={bi("Mean peak area (or absorbance) of the sample", "میانگین سطح پیک (یا جذب) نمونه")} />
          <NumberInput ctx={ctx} id="hp-as" label={bi("Mean peak area (or absorbance) of the standard", "میانگین سطح پیک (یا جذب) استاندارد")} />
          <NumberInput ctx={ctx} id="hp-ws" label={bi("Standard weighed (mg)", "وزن استاندارد (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="hp-vs" label={bi("Standard: total dilution volume (mL)", "استاندارد: حجم کل رقت (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="hp-p" label={bi("Standard potency, as is (%)", "خلوص استاندارد، as is (%)")} />
          <NumberInput ctx={ctx} id="hp-wu" label={bi("Sample powder weighed (mg)", "وزن پودر نمونه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="hp-vu" label={bi("Sample: total dilution volume (mL)", "نمونه: حجم کل رقت (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="hp-avg" label={bi("Average unit weight (mg)", "میانگین وزن هر واحد (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="hp-lc" label={bi("Label claim (mg per unit)", "ادعای برچسب (میلی‌گرم در هر واحد)")} />
        </>
      }
      results={[
        { label: bi("Standard concentration", "غلظت استاندارد"), value: cs },
        { label: bi("Sample concentration found", "غلظت یافت‌شده نمونه"), value: cu },
        { label: bi("Content per unit", "مقدار در هر واحد"), value: perUnit },
        { label: bi("Assay (% of label claim)", "تعیین مقدار (% ادعای برچسب)"), value: pct },
      ]}
      message={msg}
      note={bi(
        "C_std = W_std × P ÷ V_std; C_sample = (A_u ÷ A_s) × C_std; content per unit = C_sample × V_u ÷ W_u × average weight. The total dilution volume is the final volume multiplied by every dilution factor (e.g. 100 mL, then 5 → 50 mL gives 1000 mL).",
        `${ltr("C_std = W_std × P ÷ V_std")}؛ ${ltr("C_sample = (A_u ÷ A_s) × C_std")}؛ مقدار در هر واحد = ${ltr("C_sample × V_u ÷ W_u × W̄")}. حجم کل رقت یعنی حجم نهایی ضرب در همه ضرایب رقت (مثلاً 100 میلی‌لیتر و سپس رقت 5 به 50، معادل 1000 میلی‌لیتر است).`,
      )}
    />
  );
}

// ---------- Related substances ----------

export function Imp({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const ai = num(v["im-ai"]), as = num(v["im-as"]), cs = num(v["im-cs"]), cu = num(v["im-cu"]), rrf = num(v["im-rrf"]), lim = num(v["im-lim"]);
  let pct = DASH, verdict = DASH, msg = "";
  if (!(ai >= 0) || ![as, cs, cu, rrf].every((x) => x > 0)) msg = bad(ctx);
  else {
    const x = (ai / as) * (cs / cu) * (1 / rrf) * 100;
    pct = `${fixed(x, 3)}%`;
    if (lim > 0) verdict = (x <= lim ? bi("Within the limit", "در محدوده حد") : bi("Exceeds the limit", "بیش از حد"))[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("imp").title}
      form={
        <>
          <NumberInput ctx={ctx} id="im-ai" label={bi("Impurity peak area", "سطح پیک ناخالصی")} />
          <NumberInput ctx={ctx} id="im-as" label={bi("Peak area of the diluted standard", "سطح پیک استاندارد رقیق‌شده")} />
          <NumberInput ctx={ctx} id="im-cs" label={bi("Diluted standard concentration (mg/mL)", "غلظت استاندارد رقیق‌شده (mg/mL)")} />
          <NumberInput ctx={ctx} id="im-cu" label={bi("Sample concentration (mg/mL)", "غلظت نمونه (mg/mL)")} />
          <NumberInput ctx={ctx} id="im-rrf" label={bi("Relative response factor (RRF)", "ضریب پاسخ نسبی (RRF)")} />
          <NumberInput ctx={ctx} id="im-lim" label={bi("Specification limit (%)", "حد مشخصات (%)")} />
        </>
      }
      results={[
        { label: bi("Impurity (% of the active)", "ناخالصی (% نسبت به ماده مؤثره)"), value: pct },
        { label: bi("Against the limit", "مقایسه با حد"), value: verdict },
      ]}
      message={msg}
      note={bi(
        "RRF = response of the impurity ÷ response of the active at equal concentration; when the RRF is unknown, 1.0 is assumed. Reporting, identification and qualification thresholds are given in ICH Q3A(R2) and Q3B(R2).",
        `${ltr("RRF")} = پاسخ ناخالصی ÷ پاسخ ماده مؤثره در غلظت برابر؛ اگر RRF معلوم نباشد 1.0 فرض می‌شود. آستانه‌های گزارش، شناسایی و تأیید ایمنی در ${ltr("ICH Q3A(R2)")} و ${ltr("Q3B(R2)")} آمده است.`,
      )}
    />
  );
}

// ---------- UV assay by specific absorbance ----------

export function Uv({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const a = num(v["uv-a"]), a1 = num(v["uv-a1"]), b = num(v["uv-b"]), vol = num(v["uv-v"]), exp = num(v["uv-exp"]), mw = num(v["uv-mw"]);
  let c = DASH, found = DASH, pct = DASH, eps = DASH, msg = "";
  if (!(a >= 0) || !(a1 > 0) || !(b > 0)) msg = bad(ctx);
  else {
    const mgml = (a / (a1 * b)) * 10;
    c = `${sig(mgml * 1000)} µg/mL`;
    if (vol > 0) {
      found = `${fixed(mgml * vol, 2)} mg`;
      if (exp > 0) pct = `${fixed(((mgml * vol) / exp) * 100, 1)}%`;
    }
    if (mw > 0) eps = `${fixed((a1 * mw) / 10, 0)} L·mol⁻¹·cm⁻¹`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("uv").title}
      form={
        <>
          <NumberInput ctx={ctx} id="uv-a" label={bi("Measured absorbance A", "جذب اندازه‌گیری‌شده A")} />
          <NumberInput ctx={ctx} id="uv-a1" label={bi("Specific absorbance A(1%, 1 cm)", "جذب ویژه A(1%, 1 cm)")} />
          <NumberInput ctx={ctx} id="uv-b" label={bi("Path length (cm)", "طول مسیر نور (سانتی‌متر)")} />
          <NumberInput ctx={ctx} id="uv-v" label={bi("Total dilution volume of the sample (mL)", "حجم کل رقت نمونه (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="uv-exp" label={bi("Expected amount of analyte in the sample (mg)", "مقدار مورد انتظار آنالیت در نمونه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="uv-mw" label={bi("Molecular weight, for ε (g/mol)", "وزن مولکولی، برای ε (g/mol)")} />
        </>
      }
      results={[
        { label: bi("Concentration in the cell", "غلظت در سل"), value: c },
        { label: bi("Amount found", "مقدار یافت‌شده"), value: found },
        { label: bi("% of expected", "درصد از مقدار مورد انتظار"), value: pct },
        { label: bi("Molar absorptivity ε", "ضریب جذب مولی ε"), value: eps },
      ]}
      message={msg}
      note={bi(
        "c (g/100 mL) = A ÷ (A¹%₁cm × b); ε = A¹%₁cm × MW ÷ 10. Keep absorbance within the linear range of the instrument (typically 0.2–0.8). The example is paracetamol at 257 nm in 0.1 M NaOH, A(1%, 1 cm) = 715.",
        `${ltr("c (g/100 mL) = A ÷ (A¹%₁cm × b)")}؛ ${ltr("ε = A¹%₁cm × MW ÷ 10")}. جذب را در محدوده خطی دستگاه (معمولاً 0.2 تا 0.8) نگه دارید. مثال پیش‌فرض، پاراستامول در طول موج 257 نانومتر در NaOH 0.1 مولار با A(1%, 1 cm) برابر 715 است.`,
      )}
    />
  );
}

// ---------- Titrimetric assay ----------

const titModes = [
  { value: "direct", label: bi("Direct titration: V_sample − V_blank", "تیتراسیون مستقیم: V نمونه − V بلانک") },
  { value: "back", label: bi("Back (residual) titration: V_blank − V_sample", "تیتراسیون برگشتی: V بلانک − V نمونه") },
];

export function Tit({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const back = v["ti-mode"] === "back";
  const w = num(v["ti-w"]), vs = num(v["ti-v"]), vb = num(v["ti-vb"]), m = num(v["ti-m"]), mn = num(v["ti-mn"]), e = num(v["ti-e"]), lod = num(v["ti-lod"]);
  let net = DASH, asIs = DASH, dried = DASH, msg = "";
  if (!(w > 0) || !(vs >= 0) || !(vb >= 0) || !(m > 0) || !(mn > 0) || !(e > 0) || !(lod >= 0 && lod < 100)) msg = bad(ctx);
  else {
    const vn = back ? vb - vs : vs - vb;
    const x = ((vn * (m / mn) * e) / w) * 100;
    net = `${fixed(vn, 2)} mL`;
    asIs = `${fixed(x, 2)}%`;
    if (lod > 0) dried = `${fixed(x / (1 - lod / 100), 2)}%`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("tit").title}
      form={
        <>
          <Choice ctx={ctx} id="ti-mode" label={bi("Type of titration", "نوع تیتراسیون")} options={titModes} />
          <NumberInput ctx={ctx} id="ti-w" label={bi("Sample weight (mg)", "وزن نمونه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="ti-v" label={bi("Titrant volume for the sample (mL)", "حجم تیترانت مصرفی برای نمونه (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="ti-vb" label={bi("Titrant volume for the blank (mL)", "حجم تیترانت مصرفی برای بلانک (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="ti-m" label={bi("Actual molarity of the titrant (M)", "مولاریته واقعی تیترانت (M)")} />
          <NumberInput ctx={ctx} id="ti-mn" label={bi("Nominal molarity in the monograph (M)", "مولاریته اسمی در مونوگراف (M)")} />
          <NumberInput ctx={ctx} id="ti-e" label={bi("Equivalence: mg of analyte per mL of nominal titrant", "هم‌ارزی: میلی‌گرم آنالیت به ازای هر میلی‌لیتر تیترانت اسمی")} />
          <NumberInput ctx={ctx} id="ti-lod" label={bi("Water or LOD for the dried basis (%; 0 if not needed)", "رطوبت یا LOD برای محاسبه بر پایه خشک (%؛ در صورت عدم نیاز 0)")} />
        </>
      }
      results={[
        { label: bi("Net titrant volume", "حجم خالص تیترانت"), value: net },
        { label: bi("Assay, as is", "تعیین مقدار، as is"), value: asIs },
        { label: bi("Assay, dried basis", "تعیین مقدار، بر پایه خشک"), value: dried, hidden: !(lod > 0) },
      ]}
      message={msg}
      note={bi(
        "Assay (%) = net volume × (actual ÷ nominal molarity) × E ÷ sample weight × 100, where E is the monograph statement \"each mL of titrant is equivalent to … mg\". The example is ascorbic acid with 0.05 M iodine (1 mL ≡ 8.806 mg).",
        `${ltr("Assay (%) = V_net × (M ÷ M_nom) × E ÷ W × 100")} که E عبارت مونوگراف «هر میلی‌لیتر تیترانت معادل … میلی‌گرم» است. مثال پیش‌فرض، آسکوربیک اسید با ید 0.05 مولار است (هر میلی‌لیتر معادل 8.806 میلی‌گرم).`,
      )}
    />
  );
}

// ---------- Water: Karl Fischer and LOD ----------

export function Kf({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const sw = num(v["kf-sw"]), sv = num(v["kf-sv"]), w = num(v["kf-w"]), vol = num(v["kf-v"]), w1 = num(v["kf-w1"]), w2 = num(v["kf-w2"]);
  const okKf = sw > 0 && sv > 0 && w > 0 && vol >= 0;
  const f = okKf ? sw / sv : NaN;
  const okLod = w1 > 0 && w2 >= 0 && w2 <= w1;
  return (
    <Panel
      ctx={ctx}
      title={calculation("kf").title}
      form={
        <>
          <NumberInput ctx={ctx} id="kf-sw" label={bi("KF standardisation: water in the standard (mg)", "استانداردسازی KF: مقدار آب در استاندارد (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="kf-sv" label={bi("KF standardisation: reagent consumed (mL)", "استانداردسازی KF: معرف مصرفی (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="kf-w" label={bi("Sample weight (mg)", "وزن نمونه (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="kf-v" label={bi("Reagent consumed by the sample, blank-corrected (mL)", "معرف مصرفی نمونه پس از کسر بلانک (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="kf-w1" label={bi("LOD: sample weight before drying (g)", "LOD: وزن نمونه پیش از خشک کردن (گرم)")} />
          <NumberInput ctx={ctx} id="kf-w2" label={bi("LOD: sample weight after drying (g)", "LOD: وزن نمونه پس از خشک کردن (گرم)")} />
        </>
      }
      results={[
        { label: bi("Water equivalence factor F", "ضریب هم‌ارزی آب F"), value: okKf ? `${fixed(f, 3)} mg/mL` : DASH },
        { label: bi("Water content (KF)", "مقدار آب (KF)"), value: okKf ? `${fixed(((vol * f) / w) * 100, 2)}%` : DASH },
        { label: bi("Loss on drying", "افت وزن در خشک کردن"), value: okLod ? `${fixed(((w1 - w2) / w1) * 100, 2)}%` : DASH },
      ]}
      message={okKf || okLod ? "" : bad(ctx)}
      note={bi(
        "Volumetric KF (USP <921>, Ph. Eur. 2.5.12): F = water in standard ÷ volume; water % = V × F ÷ sample weight × 100. Sodium tartrate dihydrate contains 15.66% water. LOD (USP <731>) also counts volatile solvents.",
        `کارل فیشر حجمی ${ltr("(USP <921>, Ph. Eur. 2.5.12)")}: ${ltr("F = water (mg) ÷ V (mL)")}؛ ${ltr("H₂O % = V × F ÷ W × 100")}. سدیم تارتارات دی‌هیدرات 15.66٪ آب دارد. LOD ${ltr("(USP <731>)")} حلال‌های فرار را هم شامل می‌شود.`,
      )}
    />
  );
}

// ---------- System suitability ----------

export function Sst({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const t1 = num(v["ss-t1"]), t2 = num(v["ss-t2"]), w1 = num(v["ss-w1"]), w2 = num(v["ss-w2"]), w05 = num(v["ss-w05"]), f = num(v["ss-f"]);
  const areas = parseList(v["ss-areas"]);
  const okPeaks = t1 > 0 && t2 > t1 && w1 > 0 && w2 > 0;
  const okAreas = valid(areas) && areas.length >= 2;
  return (
    <Panel
      ctx={ctx}
      title={calculation("sst").title}
      form={
        <>
          <NumberInput ctx={ctx} id="ss-t1" label={bi("Retention time, peak 1 (min)", "زمان بازداری پیک 1 (دقیقه)")} />
          <NumberInput ctx={ctx} id="ss-t2" label={bi("Retention time, peak 2 (min)", "زمان بازداری پیک 2 (دقیقه)")} />
          <NumberInput ctx={ctx} id="ss-w1" label={bi("Width at half height, peak 1 (min)", "پهنای پیک 1 در نصف ارتفاع (دقیقه)")} />
          <NumberInput ctx={ctx} id="ss-w2" label={bi("Width at half height, peak 2 (min)", "پهنای پیک 2 در نصف ارتفاع (دقیقه)")} />
          <NumberInput ctx={ctx} id="ss-w05" label={bi("Peak 2 width at 5% height, W₀.₀₅ (min)", "پهنای پیک 2 در 5٪ ارتفاع، W₀.₀₅ (دقیقه)")} />
          <NumberInput ctx={ctx} id="ss-f" label={bi("Front half-width at 5% height, f (min)", "نیم‌پهنای جلویی در 5٪ ارتفاع، f (دقیقه)")} />
          <ListInput ctx={ctx} id="ss-areas" label={bi("Peak areas of replicate injections", "سطح پیک تزریق‌های تکراری")} />
        </>
      }
      results={[
        { label: bi("Plate count N (peak 2)", "تعداد بشقابک N (پیک 2)"), value: okPeaks ? fixed(5.54 * (t2 / w2) ** 2, 0) : DASH },
        { label: bi("Resolution Rs", "تفکیک Rs"), value: okPeaks ? fixed((1.18 * (t2 - t1)) / (w1 + w2), 2) : DASH },
        { label: bi("Tailing (symmetry) factor T", "فاکتور دنباله‌دهی T"), value: w05 > 0 && f > 0 ? fixed(w05 / (2 * f), 2) : DASH },
        { label: bi("Mean area", "میانگین سطح"), value: okAreas ? fixed(mean(areas), 0) : DASH },
        { label: bi("%RSD of areas", "%RSD سطح‌ها"), value: okAreas ? `${fixed((sd(areas) / mean(areas)) * 100, 2)}%  (n = ${areas.length})` : DASH },
      ]}
      message={okPeaks || okAreas ? "" : bad(ctx)}
      note={bi(
        "USP <621>: N = 5.54 (t_R ÷ W_h)²; Rs = 1.18 (t_R2 − t_R1) ÷ (W_h1 + W_h2); T = W₀.₀₅ ÷ 2f. The monograph sets the acceptance criteria; common in-house values are %RSD ≤ 2.0% for five or six injections, T ≤ 2.0 and Rs ≥ 2.0. " +
          listNote.en,
        `${ltr("USP <621>")}: ${ltr("N = 5.54 (t_R ÷ W_h)²")}؛ ${ltr("Rs = 1.18 (t_R2 − t_R1) ÷ (W_h1 + W_h2)")}؛ ${ltr("T = W₀.₀₅ ÷ 2f")}. معیار پذیرش را مونوگراف تعیین می‌کند؛ مقادیر متداول داخلی: ${ltr("%RSD ≤ 2.0%")} برای پنج یا شش تزریق، ${ltr("T ≤ 2.0")} و ${ltr("Rs ≥ 2.0")}. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Linearity, LOD, LOQ ----------

export function Lin({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const xs = parseList(v["ln-x"]), ys = parseList(v["ln-y"]);
  const ok = valid(xs) && valid(ys) && xs.length === ys.length && xs.length >= 3;
  let slope = DASH, icpt = DASH, r = DASH, r2 = DASH, sres = DASH, lod = DASH, loq = DASH;
  let msg = ok ? "" : bi("Enter at least three x values and the same number of y values.", "دست‌کم سه مقدار x و به همان تعداد مقدار y وارد کنید.")[locale];
  if (ok) {
    const mx = mean(xs), my = mean(ys);
    const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
    if (!(sxx > 0)) msg = bad(ctx);
    else {
      const b = sxy / sxx, a = my - b * mx;
      const s = Math.sqrt(ys.reduce((acc, y, i) => acc + (y - (a + b * xs[i])) ** 2, 0) / (xs.length - 2));
      const rr = sxy / Math.sqrt(sxx * syy);
      slope = sig(b);
      icpt = sig(a);
      r = rr.toFixed(6);
      r2 = (rr * rr).toFixed(6);
      sres = sig(s);
      lod = sig((3.3 * s) / b);
      loq = sig((10 * s) / b);
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("lin").title}
      form={
        <>
          <ListInput ctx={ctx} id="ln-x" label={bi("Concentrations (x)", "غلظت‌ها (x)")} />
          <ListInput ctx={ctx} id="ln-y" label={bi("Responses (y)", "پاسخ‌ها (y)")} />
        </>
      }
      results={[
        { label: bi("Slope S", "شیب S"), value: slope },
        { label: bi("y-intercept", "عرض از مبدأ"), value: icpt },
        { label: bi("Correlation coefficient r", "ضریب همبستگی r"), value: r },
        { label: bi("r²", "r²"), value: r2 },
        { label: bi("Residual standard deviation σ", "انحراف معیار باقیمانده σ"), value: sres },
        { label: bi("LOD (x units)", "LOD (واحد x)"), value: lod },
        { label: bi("LOQ (x units)", "LOQ (واحد x)"), value: loq },
      ]}
      message={msg}
      note={bi(
        "Least-squares line y = S·x + a. ICH Q2: LOD = 3.3σ ÷ S and LOQ = 10σ ÷ S, here with σ the residual standard deviation of the regression; confirm LOD and LOQ experimentally. " + listNote.en,
        `خط حداقل مربعات ${ltr("y = S·x + a")}. طبق ICH Q2: ${ltr("LOD = 3.3σ ÷ S")} و ${ltr("LOQ = 10σ ÷ S")} که σ در اینجا انحراف معیار باقیمانده رگرسیون است؛ LOD و LOQ را به‌صورت تجربی هم تأیید کنید. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Dissolution % released ----------

const replaceModes = [
  { value: "yes", label: bi("Withdrawn volume replaced with fresh medium", "حجم برداشته‌شده با محیط تازه جایگزین می‌شود") },
  { value: "no", label: bi("Withdrawn volume not replaced", "حجم برداشته‌شده جایگزین نمی‌شود") },
];

export function Diss({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const lc = num(v["ds-lc"]), vol = num(v["ds-v"]), s = num(v["ds-s"]), replaced = v["ds-rep"] !== "no";
  const times = parseList(v["ds-t"]), cs = parseList(v["ds-c"]);
  const ok = lc > 0 && vol > 0 && s >= 0 && valid(cs) && (times.length === 0 || (valid(times) && times.length === cs.length));
  const released = ok
    ? cs.map((c, n) => {
        const removed = s * cs.slice(0, n).reduce((a, b) => a + b, 0);
        const volume = replaced ? vol : vol - n * s;
        return ((c * volume + removed) / lc) * 100;
      })
    : [];
  return (
    <Panel
      ctx={ctx}
      title={calculation("diss").title}
      form={
        <>
          <NumberInput ctx={ctx} id="ds-lc" label={bi("Label claim (mg per unit)", "ادعای برچسب (میلی‌گرم در هر واحد)")} />
          <NumberInput ctx={ctx} id="ds-v" label={bi("Medium volume (mL)", "حجم محیط انحلال (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="ds-s" label={bi("Sample volume withdrawn each time (mL)", "حجم نمونه برداشته‌شده در هر بار (میلی‌لیتر)")} />
          <Choice ctx={ctx} id="ds-rep" label={bi("Medium replacement", "جایگزینی محیط")} options={replaceModes} />
          <ListInput ctx={ctx} id="ds-t" label={bi("Time points (min)", "زمان‌های نمونه‌برداری (دقیقه)")} />
          <ListInput ctx={ctx} id="ds-c" label={bi("Concentration at each time point (mg/mL)", "غلظت در هر زمان (mg/mL)")} />
        </>
      }
      results={[
        { label: bi("Time points", "تعداد زمان‌ها"), value: ok ? String(cs.length) : DASH },
        { label: bi("Last time point released", "آزادشده در آخرین زمان"), value: ok ? `${fixed(released[released.length - 1], 1)}%` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "Amount at point n = Cₙ × medium volume + v × Σ C of earlier points; without replacement the medium volume falls by v at each sampling. " + listNote.en,
        `مقدار در زمان n برابر ${ltr("Cₙ × V + v × Σ C(i<n)")} است؛ اگر محیط جایگزین نشود، حجم محیط در هر نمونه‌برداری به اندازه v کم می‌شود. ${listNote.fa}`,
      )}
    >
      {ok && (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="db">
            <thead>
              <tr>
                <th>{bi("Time (min)", "زمان (دقیقه)")[locale]}</th>
                <th>{bi("Concentration (mg/mL)", "غلظت (mg/mL)")[locale]}</th>
                <th>{bi("% released", "درصد آزادشده")[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {cs.map((c, i) => (
                <tr key={i}>
                  <td className="num">{times[i] ?? i + 1}</td>
                  <td className="num">{c}</td>
                  <td className="num">{fixed(released[i], 1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

// ---------- Similarity factor f2 ----------

export function F2({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const r = parseList(v["f2-r"]), t = parseList(v["f2-t"]);
  const ok = valid(r) && valid(t) && r.length === t.length && r.length >= 3;
  let f2 = DASH, f1 = DASH, verdict = DASH;
  if (ok) {
    const n = r.length;
    const sum2 = r.reduce((a, x, i) => a + (x - t[i]) ** 2, 0);
    const val = 50 * Math.log10(100 / Math.sqrt(1 + sum2 / n));
    const sumAbs = r.reduce((a, x, i) => a + Math.abs(x - t[i]), 0);
    f2 = fixed(val, 1);
    f1 = fixed((sumAbs / r.reduce((a, b) => a + b, 0)) * 100, 1);
    verdict = (val >= 50 ? bi("Similar (f2 ≥ 50)", "مشابه (f2 ≥ 50)") : bi("Not similar (f2 < 50)", "غیرمشابه (f2 < 50)"))[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("f2").title}
      form={
        <>
          <ListInput ctx={ctx} id="f2-r" label={bi("Reference: mean % dissolved at each time point", "مرجع: میانگین درصد انحلال در هر زمان")} />
          <ListInput ctx={ctx} id="f2-t" label={bi("Test: mean % dissolved at the same time points", "آزمون: میانگین درصد انحلال در همان زمان‌ها")} />
        </>
      }
      results={[
        { label: bi("Similarity factor f2", "فاکتور تشابه f2"), value: f2 },
        { label: bi("Difference factor f1", "فاکتور تفاوت f1"), value: f1 },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={ok ? "" : bi("Enter at least three paired time points.", "دست‌کم سه زمان جفت‌شده وارد کنید.")[locale]}
      note={bi(
        "f2 of 50–100 means similar profiles (f1 0–15). Conditions: at least 12 units per product, identical time points, no more than one point above 85% dissolved for either product, and a coefficient of variation of no more than 20% at early points and 10% at later points. If both products release ≥ 85% within 15 minutes, the profiles are similar without f2. " +
          listNote.en,
        `f2 بین 50 تا 100 یعنی پروفایل‌ها مشابه‌اند (f1 بین 0 تا 15). شرایط: دست‌کم 12 واحد از هر فرآورده، زمان‌های یکسان، حداکثر یک نقطه بالای 85٪ انحلال برای هر فرآورده، و ضریب تغییرات حداکثر 20٪ در نقاط اولیه و 10٪ در سایر نقاط. اگر هر دو فرآورده در 15 دقیقه دست‌کم 85٪ آزاد کنند، بدون محاسبه f2 مشابه تلقی می‌شوند. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Uniformity of dosage units: acceptance value ----------

export function Udu({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const xs = parseList(v["ud-x"]);
  const n = xs.length;
  const ok = valid(xs) && (n === 10 || n === 30);
  let mx = DASH, s = DASH, mRef = DASH, av = DASH, verdict = DASH;
  if (ok) {
    const m = mean(xs), sdev = sd(xs);
    const M = m < 98.5 ? 98.5 : m > 101.5 ? 101.5 : m;
    const k = n === 10 ? 2.4 : 2.0;
    const value = Math.abs(M - m) + k * sdev;
    const l2ok = n === 10 || xs.every((x) => x >= 0.75 * M && x <= 1.25 * M);
    mx = `${fixed(m, 2)}%`;
    s = fixed(sdev, 2);
    mRef = `${fixed(M, 1)}%  ·  k = ${k}`;
    av = fixed(value, 1);
    verdict = (value <= 15 && l2ok
      ? bi("Complies (AV ≤ L1 = 15.0)", "منطبق (AV ≤ L1 = 15.0)")
      : n === 10
        ? bi("Not met at stage 1: test 20 more units", "مرحله اول قبول نشد: ۲۰ واحد دیگر آزمون شود")
        : bi("Does not comply", "منطبق نیست"))[locale];
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("udu").title}
      form={<ListInput ctx={ctx} id="ud-x" rows={4} label={bi("Individual contents, % of label claim (10 or 30 units)", "مقدار تک‌تک واحدها، % ادعای برچسب (۱۰ یا ۳۰ واحد)")} />}
      results={[
        { label: bi("Mean X̄", "میانگین X̄"), value: mx },
        { label: bi("Standard deviation s", "انحراف معیار s"), value: s },
        { label: bi("Reference value M", "مقدار مرجع M"), value: mRef },
        { label: bi("Acceptance value AV", "مقدار پذیرش AV"), value: av },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={ok ? "" : bi("Enter the results of exactly 10 or 30 units.", "نتیجه دقیقاً ۱۰ یا ۳۰ واحد را وارد کنید.")[locale]}
      note={bi(
        "USP <905> / Ph. Eur. 2.9.40, for a target content T ≤ 101.5%: M = X̄ when 98.5 ≤ X̄ ≤ 101.5, otherwise 98.5 or 101.5; k = 2.4 for 10 units and 2.0 for 30. With 30 units, no unit may lie outside 0.75M–1.25M (L2 = 25.0). " +
          listNote.en,
        `${ltr("USP <905>")} و ${ltr("Ph. Eur. 2.9.40")} برای مقدار هدف ${ltr("T ≤ 101.5%")}: اگر ${ltr("98.5 ≤ X̄ ≤ 101.5")} باشد M = X̄، در غیر این صورت 98.5 یا 101.5؛ k برای ۱۰ واحد 2.4 و برای ۳۰ واحد 2.0. با ۳۰ واحد، هیچ واحدی نباید خارج از ${ltr("0.75M–1.25M")} باشد (L2 = 25.0). ${listNote.fa}`,
      )}
    />
  );
}
