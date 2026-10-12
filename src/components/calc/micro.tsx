"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, bad, listNote, ltr, mean, num, parseList, type Ctx, type Values } from "./ui";

/* Microbiology, sterility and bacterial-endotoxin calculators. */

const valid = (xs: number[]) => xs.length > 0 && xs.every(Number.isFinite);

/** 1.2 × 10⁻⁶ style, for very small or large numbers. */
function sci(x: number) {
  if (!Number.isFinite(x)) return DASH;
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -2 && e <= 4) return sig(x);
  const m = x / 10 ** e;
  const sup = String(e).replace(/[-0-9]/g, (c) => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(c)]);
  return `${fixed(m, 2)} × 10${sup}`;
}

export const microDefaults: Values = {
  "el-route": "par", "el-k": "5", "el-unit": "mg", "el-dose": "700", "el-mass": "70", "el-v": "10", "el-c": "50", "el-lam": "0.125",
  "la-c": "5 0.5 0.05 0.005", "la-t": "671 1185 2120 3755", "la-ts": "2480", "la-tp": "1220", "la-sp": "0.5", "la-d": "20", "la-lim": "0",
  "ge-lam": "0.125", "ge-w": "0.125 0.25 0.125 0.125", "ge-p": "0.125 0.06 0.125 0.125", "ge-d": "40",
  "f0-t": "100 110 115 118 120 121 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 121.5 115 105 95",
  "f0-dt": "1", "f0-z": "10", "f0-ref": "121.1",
  "sa-n0": "1000000", "sa-n": "100", "sa-t": "8", "sa-d": "2", "sa-f": "20", "sa-b": "100",
  "cf-type": "tamc", "cf-counts": "23 27", "cf-dil": "10", "cf-vol": "1", "cf-lim": "3", "cf-unit": "g",
};

// ---------- Endotoxin limit and MVD ----------

const routes = [
  { value: "par", label: bi("Parenteral, any route except intrathecal (K = 5.0 EU/kg)", "تزریقی، همه راه‌ها به‌جز اینتراتکال (K = 5.0 EU/kg)") },
  { value: "it", label: bi("Intrathecal (K = 0.2 EU/kg)", "اینتراتکال (K = 0.2 EU/kg)") },
  { value: "rad", label: bi("Radiopharmaceutical, parenteral (175/V EU/mL)", "رادیوداروی تزریقی (175/V EU/mL)") },
  { value: "radit", label: bi("Radiopharmaceutical, intrathecal (14/V EU/mL)", "رادیوداروی اینتراتکال (14/V EU/mL)") },
  { value: "custom", label: bi("Other K (EU/kg)", "K دیگر (EU/kg)") },
];

const doseUnits = [
  { value: "mg", label: bi("mg", "میلی‌گرم (mg)") },
  { value: "mL", label: bi("mL", "میلی‌لیتر (mL)") },
  { value: "U", label: bi("Units (U or IU)", "واحد (U یا IU)") },
];

export function Eli({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const route = v["el-route"], unit = v["el-unit"];
  const radio = route === "rad" || route === "radit";
  const K = route === "par" ? 5 : route === "it" ? 0.2 : num(v["el-k"]);
  const dose = num(v["el-dose"]), mass = num(v["el-mass"]), V = num(v["el-v"]), lam = num(v["el-lam"]);
  // A liquid tested as it is has 1 mL per mL.
  const C = radio || unit === "mL" ? 1 : num(v["el-c"]);
  const u = radio ? "mL" : unit;

  let M = NaN, el = NaN, mvc = NaN;
  if (radio) {
    if (V > 0) el = (route === "rad" ? 175 : 14) / V;
  } else if (K > 0 && dose > 0 && mass > 0) {
    M = dose / mass;
    el = K / M;
  }
  if (Number.isFinite(el) && lam > 0) mvc = lam / el;
  const ok = Number.isFinite(el) && lam > 0 && C > 0;
  const mvd = ok ? (el * C) / lam : NaN;
  const twoFold = ok && mvd >= 1 ? 2 ** Math.floor(Math.log2(mvd)) : NaN;

  return (
    <Panel
      ctx={ctx}
      title={calculation("eli").title}
      form={
        <>
          <Choice ctx={ctx} id="el-route" label={bi("Route of administration", "راه تجویز")} options={routes} />
          {route === "custom" && <NumberInput ctx={ctx} id="el-k" label={bi("Threshold pyrogenic dose K (EU/kg)", "دوز آستانه تب‌زایی K (EU/kg)")} />}
          {radio ? (
            <NumberInput ctx={ctx} id="el-v" label={bi("Maximum recommended dose V (mL)", "حداکثر دوز توصیه‌شده V (میلی‌لیتر)")} />
          ) : (
            <>
              <Choice ctx={ctx} id="el-unit" label={bi("Dose expressed in", "واحد بیان دوز")} options={doseUnits} />
              <NumberInput ctx={ctx} id="el-dose" label={bi("Maximum dose given to one patient within one hour", "حداکثر دوزی که در یک ساعت به یک بیمار داده می‌شود")} />
              <NumberInput ctx={ctx} id="el-mass" label={bi("Body mass (kg)", "وزن بدن (کیلوگرم)")} />
              {unit !== "mL" && (
                <NumberInput ctx={ctx} id="el-c" label={bi("Concentration of the test solution (per mL)", "غلظت محلول آزمون (در هر میلی‌لیتر)")} />
              )}
            </>
          )}
          <NumberInput ctx={ctx} id="el-lam" label={bi("Lysate sensitivity λ (EU/mL)", "حساسیت لیزات λ (EU/mL)")} />
        </>
      }
      results={[
        { label: bi("K", "K"), value: radio ? DASH : K > 0 ? `${sig(K)} EU/kg` : DASH, hidden: radio },
        { label: bi("Maximum dose per kg per hour M", "حداکثر دوز به ازای هر کیلوگرم در ساعت M"), value: Number.isFinite(M) ? `${sig(M)} ${u}/kg/h` : DASH, hidden: radio },
        { label: bi("Endotoxin limit", "حد اندوتوکسین"), value: Number.isFinite(el) ? `${sig(el)} EU/${u}` : DASH },
        { label: bi("Maximum valid dilution (MVD)", "حداکثر رقت معتبر (MVD)"), value: ok ? `1 : ${Math.floor(mvd)}` : DASH },
        { label: bi("Largest two-fold dilution within the MVD", "بزرگ‌ترین رقت دوبرابری در محدوده MVD"), value: Number.isFinite(twoFold) ? `1 : ${twoFold}` : DASH },
        { label: bi("Minimum valid concentration (MVC)", "حداقل غلظت معتبر (MVC)"), value: Number.isFinite(mvc) ? `${sig(mvc)} ${u}/mL` : DASH },
      ]}
      message={
        Number.isFinite(el) && lam > 0 && C > 0
          ? mvd < 1
            ? bi("MVD below 1: the method is not sensitive enough; use a more sensitive lysate.", "MVD کمتر از ۱ است: روش به اندازه کافی حساس نیست؛ از لیزات حساس‌تر استفاده کنید.")[locale]
            : ""
          : bad(ctx)
      }
      note={bi(
        "USP <85> and Ph. Eur. 2.6.14 / 5.1.10: endotoxin limit = K/M, with K = 5.0 EU/kg (0.2 EU/kg intrathecal) and M the maximum dose per kg of body mass given within one hour (USP takes 70 kg for an average adult). Radiopharmaceuticals: 175/V EU/mL (14/V intrathecal). MVD = endotoxin limit × concentration of the test solution ÷ λ (concentration = 1 when the limit is per mL); MVC = λ × M ÷ K. The test may be run at any dilution up to the MVD; λ is the labelled gel-clot sensitivity or the lowest concentration of the photometric standard curve.",
        `${ltr("USP <85>")} و ${ltr("Ph. Eur. 2.6.14 / 5.1.10")}: حد اندوتوکسین ${ltr("= K/M")}؛ K برابر ${ltr("5.0 EU/kg")} (اینتراتکال ${ltr("0.2 EU/kg")}) و M حداکثر دوز به ازای هر کیلوگرم وزن بدن که در یک ساعت تجویز می‌شود (USP وزن بزرگسال متوسط را ۷۰ کیلوگرم می‌گیرد). رادیوداروها: ${ltr("175/V EU/mL")} (اینتراتکال ${ltr("14/V")}). ${ltr("MVD = EL × C ÷ λ")} (وقتی حد بر حسب میلی‌لیتر است ${ltr("C = 1")})؛ ${ltr("MVC = λ × M ÷ K")}. آزمون را می‌توان در هر رقتی تا MVD انجام داد؛ λ حساسیت برچسب لیزات در روش ژل‌کلات یا کمترین غلظت منحنی استاندارد در روش فوتومتریک است.`,
      )}
    />
  );
}

// ---------- Kinetic (photometric) LAL ----------

export function Lal({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const cs = parseList(v["la-c"]), ts = parseList(v["la-t"]);
  const tSample = num(v["la-ts"]), tSpiked = num(v["la-tp"]), spike = num(v["la-sp"]), d = num(v["la-d"]), lim = num(v["la-lim"]);
  const ok = valid(cs) && valid(ts) && cs.length === ts.length && cs.length >= 3 && cs.every((x) => x > 0) && ts.every((x) => x > 0);

  let slope = DASH, r = DASH, sample = DASH, product = DASH, rec = DASH, verdict = DASH;
  let msg = ok ? "" : bi("Enter at least three standard concentrations and the same number of reaction times.", "دست‌کم سه غلظت استاندارد و به همان تعداد زمان واکنش وارد کنید.")[locale];
  if (ok) {
    const xs = cs.map(Math.log10), ys = ts.map(Math.log10);
    const mx = mean(xs), my = mean(ys);
    const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
    if (!(sxx > 0 && syy > 0)) msg = bad(ctx);
    else {
      const b = sxy / sxx, a = my - b * mx, rr = sxy / Math.sqrt(sxx * syy);
      const conc = (t: number) => 10 ** ((Math.log10(t) - a) / b);
      slope = `${fixed(b, 4)}  ·  a = ${fixed(a, 4)}`;
      r = `${fixed(Math.abs(rr), 4)}  ${Math.abs(rr) >= 0.98 ? "✓" : "✗"}`;
      const low = Math.min(...cs);
      if (tSample > 0 && d > 0) {
        const c = conc(tSample);
        const below = c < low;
        sample = below ? `< ${sig(low)} EU/mL` : `${sig(c)} EU/mL`;
        product = below ? `< ${sig(low * d)} EU/mL` : `${sig(c * d)} EU/mL`;
        if (tSpiked > 0 && spike > 0) {
          // A sample below the curve counts as zero endotoxin in the recovery.
          const recovery = ((conc(tSpiked) - (below ? 0 : c)) / spike) * 100;
          rec = `${fixed(recovery, 0)}%  ${recovery >= 50 && recovery <= 200 ? "✓" : "✗"}`;
          const curveOk = Math.abs(rr) >= 0.98, recOk = recovery >= 50 && recovery <= 200;
          if (!curveOk || !recOk)
            verdict = bi("Test invalid: check the standard curve or interference", "آزمون نامعتبر: منحنی استاندارد یا تداخل را بررسی کنید")[locale];
          else if (lim > 0)
            verdict = (below || c * d <= lim
              ? bi("Complies with the limit", "منطبق با حد")
              : bi("Exceeds the limit", "بیش از حد مجاز"))[locale];
          else verdict = bi("Valid test", "آزمون معتبر")[locale];
        }
      } else msg = bad(ctx);
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("lal").title}
      form={
        <>
          <ListInput ctx={ctx} id="la-c" label={bi("Standard concentrations (EU/mL)", "غلظت‌های استاندارد (EU/mL)")} />
          <ListInput ctx={ctx} id="la-t" label={bi("Mean reaction (onset) times of the standards (s)", "میانگین زمان واکنش (شروع) استانداردها (ثانیه)")} />
          <NumberInput ctx={ctx} id="la-ts" label={bi("Sample: mean reaction time (s)", "نمونه: میانگین زمان واکنش (ثانیه)")} />
          <NumberInput ctx={ctx} id="la-tp" label={bi("Spiked sample (PPC): mean reaction time (s)", "نمونه اسپایک‌شده (PPC): میانگین زمان واکنش (ثانیه)")} />
          <NumberInput ctx={ctx} id="la-sp" label={bi("Endotoxin spike added (EU/mL)", "اندوتوکسین اسپایک‌شده (EU/mL)")} />
          <NumberInput ctx={ctx} id="la-d" label={bi("Dilution factor of the sample", "ضریب رقت نمونه")} />
          <NumberInput ctx={ctx} id="la-lim" label={bi("Endotoxin limit (EU/mL; 0 = not checked)", "حد اندوتوکسین (EU/mL؛ صفر = بدون مقایسه)")} />
        </>
      }
      results={[
        { label: bi("Slope b (log T vs log C)", "شیب b (log T در برابر log C)"), value: slope },
        { label: bi("|r| (≥ 0.980)", "ضریب همبستگی ⁦|r| ≥ 0.980⁩"), value: r },
        { label: bi("Endotoxin in the diluted sample", "اندوتوکسین در نمونه رقیق‌شده"), value: sample },
        { label: bi("Endotoxin in the product", "اندوتوکسین در فرآورده"), value: product },
        { label: bi("Spike recovery (50–200%)", "بازیافت اسپایک (50 تا 200٪)"), value: rec },
        { label: bi("Conclusion", "نتیجه"), value: verdict },
      ]}
      message={msg}
      note={bi(
        "USP <85> / Ph. Eur. 2.6.14, photometric methods (kinetic turbidimetric or chromogenic): the log–log regression of reaction time on endotoxin concentration must have |r| ≥ 0.980 over at least three standards; the endotoxin found in the positive product control (PPC), less that in the sample, must be 50–200% of the spike. Results below the lowest standard are reported as less than it. The limit is compared with the result corrected for dilution. " +
          listNote.en,
        `${ltr("USP <85>")} و ${ltr("Ph. Eur. 2.6.14")}، روش‌های فوتومتریک (کینتیک توربیدیمتریک یا کروموژنیک): رگرسیون لگاریتمی زمان واکنش بر غلظت اندوتوکسین با دست‌کم سه استاندارد باید ${ltr("|r| ≥ 0.980")} داشته باشد؛ اندوتوکسین کنترل مثبت فرآورده (PPC) منهای اندوتوکسین نمونه باید 50 تا 200٪ مقدار اسپایک باشد. نتیجه کمتر از پایین‌ترین استاندارد به‌صورت «کمتر از» گزارش می‌شود. حد با نتیجه اصلاح‌شده برای رقت مقایسه می‌شود. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Gel-clot ----------

const geoMean = (xs: number[]) => 10 ** mean(xs.map(Math.log10));

export function Gel({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const lam = num(v["ge-lam"]), d = num(v["ge-d"]);
  const w = parseList(v["ge-w"]), p = parseList(v["ge-p"]);
  const okW = lam > 0 && valid(w) && w.every((x) => x > 0);
  const okP = lam > 0 && valid(p) && p.every((x) => x > 0);
  const within = (g: number) => g >= 0.5 * lam && g <= 2 * lam;
  const gw = okW ? geoMean(w) : NaN, gp = okP ? geoMean(p) : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("gel").title}
      form={
        <>
          <NumberInput ctx={ctx} id="ge-lam" label={bi("Labelled lysate sensitivity λ (EU/mL)", "حساسیت برچسب لیزات λ (EU/mL)")} />
          <ListInput ctx={ctx} id="ge-w" label={bi("End-points of the series in water (EU/mL)", "نقطه‌های پایانی سری در آب (EU/mL)")} />
          <ListInput ctx={ctx} id="ge-p" label={bi("End-points of the series in the product, solution B (EU/mL; optional)", "نقطه‌های پایانی سری در فرآورده، محلول B (EU/mL؛ اختیاری)")} />
          <NumberInput ctx={ctx} id="ge-d" label={bi("Limit test: dilution of the sample tested", "آزمون حدی: رقت نمونه آزمون‌شده")} />
        </>
      }
      results={[
        { label: bi("Acceptable range (0.5λ–2λ)", "محدوده قابل قبول (0.5λ تا 2λ)"), value: lam > 0 ? `${sig(0.5 * lam)} – ${sig(2 * lam)} EU/mL` : DASH },
        { label: bi("Geometric mean end-point, water", "میانگین هندسی نقطه پایانی، آب"), value: okW ? `${sig(gw)} EU/mL` : DASH },
        {
          label: bi("Labelled sensitivity", "حساسیت برچسب"),
          value: okW ? (within(gw) ? bi("Confirmed", "تأیید شد") : bi("Not confirmed", "تأیید نشد"))[locale] : DASH,
        },
        { label: bi("Geometric mean end-point, product", "میانگین هندسی نقطه پایانی، فرآورده"), value: okP ? `${sig(gp)} EU/mL` : DASH, hidden: !okP },
        {
          label: bi("Interfering factors", "عوامل تداخل‌کننده"),
          value: okP ? (within(gp) ? bi("No interference at this dilution", "در این رقت تداخلی ندارد") : bi("Interferes: dilute further or treat", "تداخل دارد: بیشتر رقیق یا عمل‌آوری کنید"))[locale] : DASH,
          hidden: !okP,
        },
        { label: bi("Negative limit test means endotoxin below", "منفی بودن آزمون حدی یعنی اندوتوکسین کمتر از"), value: lam > 0 && d >= 1 ? `${sig(lam * d)} EU/mL` : DASH },
      ]}
      message={okW ? "" : bad(ctx)}
      note={bi(
        "USP <85> / Ph. Eur. 2.6.14, gel-clot method: the end-point is the lowest concentration in a series of decreasing endotoxin concentrations that gives a firm clot. Geometric mean end-point = antilog(Σ log eᵢ ÷ f) for f replicate series (four in the confirmation of λ). The labelled sensitivity is confirmed, and the product shows no interference, when the geometric mean lies between 0.5λ and 2λ. A negative limit test at dilution d shows less than d × λ EU/mL in the undiluted sample. " +
          listNote.en,
        `${ltr("USP <85>")} و ${ltr("Ph. Eur. 2.6.14")}، روش ژل‌کلات: نقطه پایانی کمترین غلظت در سری غلظت‌های نزولی اندوتوکسین است که لخته سفت می‌دهد. میانگین هندسی نقطه پایانی ${ltr("= antilog(Σ log eᵢ ÷ f)")} برای f سری تکراری (در تأیید λ چهار سری). اگر میانگین هندسی بین 0.5λ و 2λ باشد، حساسیت برچسب تأیید می‌شود و فرآورده تداخل ندارد. آزمون حدی منفی در رقت d یعنی اندوتوکسین نمونه رقیق‌نشده کمتر از ${ltr("d × λ EU/mL")} است. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- F0 ----------

export function F0({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const temps = parseList(v["f0-t"]);
  const dt = num(v["f0-dt"]), z = num(v["f0-z"]), ref = num(v["f0-ref"]);
  const ok = valid(temps) && dt > 0 && z > 0 && Number.isFinite(ref);
  const rates = ok ? temps.map((t) => 10 ** ((t - ref) / z)) : [];
  const rect = ok ? dt * rates.reduce((a, b) => a + b, 0) : NaN;
  const trap = ok && rates.length > 1 ? dt * rates.slice(1).reduce((a, l, i) => a + (l + rates[i]) / 2, 0) : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("f0").title}
      form={
        <>
          <ListInput ctx={ctx} id="f0-t" rows={4} label={bi("Product (cold-spot) temperatures, °C, at equal intervals", "دمای محصول (نقطه سرد)، درجه سانتی‌گراد، در فواصل زمانی برابر")} />
          <NumberInput ctx={ctx} id="f0-dt" label={bi("Interval between readings Δt (min)", "فاصله بین قرائت‌ها Δt (دقیقه)")} />
          <NumberInput ctx={ctx} id="f0-z" label={bi("z-value (°C)", "مقدار z (درجه سانتی‌گراد)")} />
          <NumberInput ctx={ctx} id="f0-ref" label={bi("Reference temperature (°C)", "دمای مرجع (درجه سانتی‌گراد)")} />
        </>
      }
      results={[
        { label: bi("Readings", "تعداد قرائت"), value: ok ? String(temps.length) : DASH },
        { label: bi("Maximum temperature", "حداکثر دما"), value: ok ? `${fixed(Math.max(...temps), 1)} °C` : DASH },
        { label: bi("F₀ (sum of lethal rates × Δt)", "F₀ (مجموع نرخ کشندگی × Δt)"), value: ok ? `${fixed(rect, 2)} min` : DASH },
        { label: bi("F₀ (trapezoidal rule)", "F₀ (قاعده ذوزنقه)"), value: Number.isFinite(trap) ? `${fixed(trap, 2)} min` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "F₀ is the equivalent time in minutes at 121 °C delivered to the product, with z = 10 °C for bacterial spores (Ph. Eur. 5.1.5): lethal rate L = 10^((T − T_ref)/z), F₀ = Δt × ΣL. 121.1 °C (250 °F) is also widely used as reference. The Ph. Eur. 5.1.1 reference cycle for aqueous preparations is at least 15 min at 121 °C. " +
          listNote.en,
        `F₀ زمان معادل (دقیقه) در دمای ۱۲۱ درجه است که به محصول می‌رسد، با ${ltr("z = 10 °C")} برای اسپورهای باکتریایی ${ltr("(Ph. Eur. 5.1.5)")}: نرخ کشندگی ${ltr("L = 10^((T − T_ref)/z)")} و ${ltr("F₀ = Δt × ΣL")}. دمای ${ltr("121.1 °C (250 °F)")} نیز به‌طور رایج مرجع قرار می‌گیرد. چرخه مرجع ${ltr("Ph. Eur. 5.1.1")} برای فرآورده‌های آبی دست‌کم ۱۵ دقیقه در ۱۲۱ درجه است. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- D-value, log reduction and SAL ----------

export function Sal({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const n0 = num(v["sa-n0"]), n = num(v["sa-n"]), t = num(v["sa-t"]);
  const D = num(v["sa-d"]), F = num(v["sa-f"]), b = num(v["sa-b"]);
  const okD = n0 > n && n > 0 && t > 0;
  const okS = D > 0 && F >= 0 && b > 0;
  const lr = okS ? F / D : NaN;
  const logNF = okS ? Math.log10(b) - lr : NaN;
  return (
    <Panel
      ctx={ctx}
      title={calculation("sal").title}
      form={
        <>
          <NumberInput ctx={ctx} id="sa-n0" label={bi("D-value test: initial count N₀", "تعیین D: تعداد اولیه N₀")} />
          <NumberInput ctx={ctx} id="sa-n" label={bi("D-value test: survivors N after exposure", "تعیین D: تعداد زنده‌مانده N پس از مواجهه")} />
          <NumberInput ctx={ctx} id="sa-t" label={bi("D-value test: exposure time (min)", "تعیین D: زمان مواجهه (دقیقه)")} />
          <NumberInput ctx={ctx} id="sa-d" label={bi("D-value used for the cycle (min)", "مقدار D برای چرخه (دقیقه)")} />
          <NumberInput ctx={ctx} id="sa-f" label={bi("Lethality delivered F (min at the D-value temperature)", "کشندگی چرخه F (دقیقه در دمای مقدار D)")} />
          <NumberInput ctx={ctx} id="sa-b" label={bi("Bioburden per unit before sterilisation", "بار میکروبی هر واحد پیش از استریلیزاسیون")} />
        </>
      }
      results={[
        { label: bi("D-value from the test", "مقدار D آزمون"), value: okD ? `${fixed(t / (Math.log10(n0) - Math.log10(n)), 2)} min` : DASH },
        { label: bi("Log reduction F/D", "کاهش لگاریتمی F/D"), value: okS ? fixed(lr, 2) : DASH },
        { label: bi("Probability of a non-sterile unit (SAL)", "احتمال واحد غیراستریل (SAL)"), value: okS ? sci(10 ** logNF) : DASH },
        {
          label: bi("SAL ≤ 10⁻⁶", "SAL ≤ 10⁻⁶"),
          value: okS ? (logNF <= -6 ? bi("Achieved", "حاصل شد") : bi("Not achieved", "حاصل نشد"))[locale] : DASH,
        },
        { label: bi("F needed for SAL 10⁻⁶", "F لازم برای SAL 10⁻⁶"), value: okS ? `${fixed(D * (Math.log10(b) + 6), 1)} min` : DASH },
      ]}
      message={okD || okS ? "" : bad(ctx)}
      note={bi(
        "First-order inactivation: D = t ÷ (log N₀ − log N) is the time for a 1-log (90%) reduction. After a lethality F the expected survivors per unit are N = N₀ × 10^(−F/D); a terminally sterilised product must reach a sterility assurance level of 10⁻⁶ or better (Ph. Eur. 5.1.1, USP <1229>). F and D must refer to the same temperature (for F₀, D at 121 °C).",
        `غیرفعال‌سازی درجه اول: ${ltr("D = t ÷ (log N₀ − log N)")} زمان لازم برای کاهش یک لگاریتم (90٪) است. پس از کشندگی F، تعداد زنده‌مانده مورد انتظار در هر واحد ${ltr("N = N₀ × 10^(−F/D)")} است؛ فرآورده‌ای که در ظرف نهایی استریل می‌شود باید به سطح اطمینان از استریلیتی ${ltr("10⁻⁶")} یا بهتر برسد ${ltr("(Ph. Eur. 5.1.1, USP <1229>)")}. F و D باید به یک دما مربوط باشند (برای F₀، مقدار D در ۱۲۱ درجه).`,
      )}
    />
  );
}

// ---------- Microbial count ----------

const countTypes = [
  { value: "tamc", label: bi("TAMC (total aerobic microbial count)", "TAMC (شمارش کل میکروب‌های هوازی)") },
  { value: "tymc", label: bi("TYMC (total combined yeasts/moulds count)", "TYMC (شمارش کل مخمرها و کپک‌ها)") },
];
const limits = [1, 2, 3, 4].map((e) => ({ value: String(e), label: bi(`10${"¹²³⁴"[e - 1]} cfu`, `10${"¹²³⁴"[e - 1]} cfu`) }));
const perUnit = [
  { value: "g", label: bi("per g", "در هر گرم") },
  { value: "mL", label: bi("per mL", "در هر میلی‌لیتر") },
];

export function Cfu({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const counts = parseList(v["cf-counts"]);
  const dil = num(v["cf-dil"]), vol = num(v["cf-vol"]), e = Number(v["cf-lim"]);
  const tamc = v["cf-type"] === "tamc";
  const ok = valid(counts) && counts.every((c) => c >= 0) && dil >= 1 && vol > 0;
  const cfu = ok ? (mean(counts) * dil) / vol : NaN;
  const max = 2 * 10 ** e;
  const cap = tamc ? 250 : 50;
  const over = ok && counts.some((c) => c > cap);
  return (
    <Panel
      ctx={ctx}
      title={calculation("cfu").title}
      form={
        <>
          <Choice ctx={ctx} id="cf-type" label={bi("Count", "نوع شمارش")} options={countTypes} />
          <ListInput ctx={ctx} id="cf-counts" label={bi("Colonies per plate (replicate plates)", "تعداد کلنی در هر پلیت (پلیت‌های تکراری)")} />
          <NumberInput ctx={ctx} id="cf-dil" label={bi("Dilution factor (10 for a 1:10 dilution)", "ضریب رقت (برای رقت 1:10 عدد 10)")} />
          <NumberInput ctx={ctx} id="cf-vol" label={bi("Volume plated (mL)", "حجم کشت‌داده‌شده (میلی‌لیتر)")} />
          <Choice ctx={ctx} id="cf-unit" label={bi("Result", "نتیجه")} options={perUnit} />
          <Choice ctx={ctx} id="cf-lim" label={bi("Acceptance criterion", "معیار پذیرش")} options={limits} />
        </>
      }
      results={[
        { label: bi("Mean colonies per plate", "میانگین کلنی در هر پلیت"), value: ok ? fixed(mean(counts), 1) : DASH },
        { label: bi("Count", "شمارش"), value: ok ? `${sig(cfu)} cfu/${v["cf-unit"]}` : DASH },
        { label: bi("Maximum acceptable count", "حداکثر شمارش قابل قبول"), value: `${max} cfu/${v["cf-unit"]}` },
        {
          label: bi("Conclusion", "نتیجه"),
          value: ok ? (cfu <= max ? bi("Complies", "منطبق") : bi("Does not comply", "منطبق نیست"))[locale] : DASH,
        },
      ]}
      message={
        !ok
          ? bad(ctx)
          : over
            ? bi(`A plate has more than ${cap} colonies: use a higher dilution.`, `پلیتی بیش از ${cap} کلنی دارد: از رقت بالاتر استفاده کنید.`)[locale]
            : ""
      }
      note={bi(
        "USP <61> / Ph. Eur. 2.6.12 plate count: cfu per g or mL = mean colonies × dilution factor ÷ volume plated. Use plates with not more than 250 colonies for TAMC and 50 for TYMC (9-cm plates). USP <1111> / Ph. Eur. 5.1.4: an acceptance criterion of 10¹ cfu allows up to 20, 10² up to 200, 10³ up to 2000, and so on. " +
          listNote.en,
        `شمارش پلیت ${ltr("USP <61>")} و ${ltr("Ph. Eur. 2.6.12")}: ${ltr("cfu = mean colonies × dilution ÷ volume")} در هر گرم یا میلی‌لیتر. پلیت‌هایی را بشمارید که حداکثر ۲۵۰ کلنی برای TAMC و ۵۰ کلنی برای TYMC دارند (پلیت ۹ سانتی‌متری). طبق ${ltr("USP <1111>")} و ${ltr("Ph. Eur. 5.1.4")}، معیار ${ltr("10¹ cfu")} تا ۲۰، ${ltr("10² cfu")} تا ۲۰۰ و ${ltr("10³ cfu")} تا ۲۰۰۰ را می‌پذیرد و به همین ترتیب. ${listNote.fa}`,
      )}
    />
  );
}
