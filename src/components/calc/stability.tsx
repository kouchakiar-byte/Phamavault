"use client";

import { bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed, sig } from "../calc-format";
import { Choice, DASH, ListInput, NumberInput, Panel, bad, listNote, ltr, mean, num, parseList, type Ctx, type Values } from "./ui";

/* Stability calculators: mean kinetic temperature and ICH Q1E shelf life. */

const valid = (xs: number[]) => xs.length > 0 && xs.every(Number.isFinite);

export const stabilityDefaults: Values = {
  "mk-t": "20 22 25 27 30 28 24 21 19 18 20 23",
  "mk-h": "83.144",
  "q1-t": "0 3 6 9 12 18",
  "q1-y": "100.4 99.6 99.1 98.7 98.0 97.1",
  "q1-dir": "down",
  "q1-spec": "95",
};

// ---------- Mean kinetic temperature ----------

const R = 8.3144; // J/(mol·K)

export function Mkt({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const ts = parseList(v["mk-t"]);
  const dH = num(v["mk-h"]) * 1000;
  const ok = valid(ts) && dH > 0 && ts.every((t) => t > -273.15);
  let mkt = NaN;
  if (ok) {
    const k = dH / R;
    const avg = mean(ts.map((t) => Math.exp(-k / (t + 273.15))));
    mkt = k / -Math.log(avg) - 273.15;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("mkt").title}
      form={
        <>
          <ListInput ctx={ctx} id="mk-t" rows={3} label={bi("Temperatures over equal time intervals (°C)", "دماها در فواصل زمانی برابر (درجه سانتی‌گراد)")} />
          <NumberInput ctx={ctx} id="mk-h" label={bi("Activation energy ΔH (kJ/mol)", "انرژی فعال‌سازی ΔH (کیلوژول بر مول)")} />
        </>
      }
      results={[
        { label: bi("Readings", "تعداد قرائت"), value: ok ? String(ts.length) : DASH },
        { label: bi("Arithmetic mean", "میانگین حسابی"), value: ok ? `${fixed(mean(ts), 2)} °C` : DASH },
        { label: bi("Highest reading", "بیشترین دما"), value: ok ? `${fixed(Math.max(...ts), 1)} °C` : DASH },
        { label: bi("Mean kinetic temperature", "دمای سینتیکی میانگین"), value: ok ? `${fixed(mkt, 2)} °C` : DASH },
      ]}
      message={ok ? "" : bad(ctx)}
      note={bi(
        "USP <1079.2> (Haynes): MKT = (ΔH/R) ÷ −ln[(e^(−ΔH/RT₁) + … + e^(−ΔH/RTₙ)) ÷ n], T in kelvin, R = 8.3144 J/(mol·K). The default ΔH = 83.144 kJ/mol (ΔH/R = 10 000 K) is the conventional value. MKT weighs warm periods more than the arithmetic mean does; USP <659> defines controlled room temperature with an MKT not above 25 °C. " +
          listNote.en,
        `${ltr("USP <1079.2>")} (روش هینز): ${ltr("MKT = (ΔH/R) ÷ −ln[(Σ e^(−ΔH/RTᵢ)) ÷ n]")}؛ T بر حسب کلوین و ${ltr("R = 8.3144 J/(mol·K)")}. مقدار پیش‌فرض ${ltr("ΔH = 83.144 kJ/mol")} (یعنی ${ltr("ΔH/R = 10 000 K")}) مقدار قراردادی است. MKT دوره‌های گرم را بیشتر از میانگین حسابی وزن می‌دهد؛ ${ltr("USP <659>")} دمای کنترل‌شده اتاق را با MKT حداکثر 25 درجه تعریف می‌کند. ${listNote.fa}`,
      )}
    />
  );
}

// ---------- Student t quantile ----------

/** ln Γ(x), Lanczos approximation. */
function lnGamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const t = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let s = 1.000000000190015;
  for (const ci of c) s += ci / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}

/** Continued fraction for the regularised incomplete beta function. */
function betacf(a: number, b: number, x: number): number {
  let c = 1, d = 1 - ((a + b) * x) / (a + 1);
  d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
  let h = d;
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d);
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}

function incBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** P(T ≤ t) for Student's t with df degrees of freedom. */
function tCdf(t: number, df: number): number {
  const p = 0.5 * incBeta(df / 2, 0.5, df / (df + t * t));
  return t >= 0 ? 1 - p : p;
}

/** One-sided quantile t(p, df) by bisection. */
export function tQuantile(p: number, df: number): number {
  let lo = 0, hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- ICH Q1E shelf life ----------

const directions = [
  { value: "down", label: bi("Decreasing attribute (e.g. assay): lower limit", "ویژگی کاهشی (مثلاً مقدار ماده مؤثره): حد پایین") },
  { value: "up", label: bi("Increasing attribute (e.g. degradant): upper limit", "ویژگی افزایشی (مثلاً محصول تخریب): حد بالا") },
];

export function Q1e({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const xs = parseList(v["q1-t"]), ys = parseList(v["q1-y"]);
  const spec = num(v["q1-spec"]);
  const down = v["q1-dir"] !== "up";
  const ok = valid(xs) && valid(ys) && xs.length === ys.length && xs.length >= 3 && xs.every((x) => x >= 0) && Number.isFinite(spec);
  let line = DASH, r2 = DASH, tval = DASH, at0 = DASH, life = DASH, cap = DASH;
  let msg = ok ? "" : bi("Enter at least three time points and the same number of results, and the acceptance limit.", "دست‌کم سه نقطه زمانی، به همان تعداد نتیجه و حد پذیرش را وارد کنید.")[locale];
  if (ok) {
    const n = xs.length, mx = mean(xs), my = mean(ys);
    const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
    if (!(sxx > 0)) msg = bad(ctx);
    else {
      const b = sxy / sxx, a = my - b * mx;
      const s = Math.sqrt(ys.reduce((acc, y, i) => acc + (y - (a + b * xs[i])) ** 2, 0) / (n - 2));
      const t = tQuantile(0.95, n - 2);
      const bound = (x: number) => a + b * x + (down ? -1 : 1) * t * s * Math.sqrt(1 / n + (x - mx) ** 2 / sxx);
      const fails = (x: number) => (down ? bound(x) < spec : bound(x) > spec);
      const X = Math.max(...xs);
      const horizon = Math.max(60, 5 * X);
      line = `y = ${sig(a)} ${b < 0 ? "−" : "+"} ${sig(Math.abs(b))}·t`;
      r2 = syy > 0 ? fixed((sxy * sxy) / (sxx * syy), 4) : DASH;
      tval = `${fixed(t, 3)}  (df = ${n - 2})`;
      at0 = fixed(bound(0), 2);
      if (fails(0)) life = bi("Limit crossed at time zero", "حد در زمان صفر رد شده است")[locale];
      else {
        let x = 0;
        while (x < horizon && !fails(x + 0.01)) x += 0.01;
        life = x >= horizon ? `> ${horizon} ${bi("months", "ماه")[locale]}` : `${fixed(x, 1)} ${bi("months", "ماه")[locale]}`;
      }
      cap = `${sig(Math.min(2 * X, X + 12))} ${bi("months", "ماه")[locale]}`;
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("q1e").title}
      form={
        <>
          <ListInput ctx={ctx} id="q1-t" label={bi("Time points (months)", "نقاط زمانی (ماه)")} />
          <ListInput ctx={ctx} id="q1-y" label={bi("Results at each time point (e.g. % of label claim)", "نتیجه هر نقطه زمانی (مثلاً % ادعای برچسب)")} />
          <Choice ctx={ctx} id="q1-dir" label={bi("Attribute", "نوع ویژگی")} options={directions} />
          <NumberInput ctx={ctx} id="q1-spec" label={bi("Acceptance criterion", "معیار پذیرش")} />
        </>
      }
      results={[
        { label: bi("Regression line", "خط رگرسیون"), value: line },
        { label: bi("r²", "r²"), value: r2 },
        { label: bi("t (one-sided 95%)", "t (یک‌طرفه 95%)"), value: tval },
        { label: bi("Confidence limit at time zero", "حد اطمینان در زمان صفر"), value: at0 },
        { label: bi("Shelf life supported by the data", "عمر قفسه‌ای پشتیبانی‌شده با داده‌ها"), value: life },
        { label: bi("Extrapolation ceiling: min(2X, X + 12)", "سقف برون‌یابی: min(2X, X + 12)"), value: cap },
      ]}
      message={msg}
      note={bi(
        "ICH Q1E: the shelf life is the time at which the one-sided 95% confidence limit of the mean regression line meets the acceptance criterion (lower limit for a decreasing attribute, upper limit for an increasing one); limit = ŷ ∓ t₀.₉₅,ₙ₋₂ · s · √(1/n + (t − t̄)²/Sxx). For one batch at room-temperature storage with statistical analysis and no significant change at the accelerated condition, the proposed shelf life may be extrapolated up to twice the long-term period X but not more than 12 months beyond it; with several batches, test poolability first (p > 0.25). " +
          listNote.en,
        `${ltr("ICH Q1E")}: عمر قفسه‌ای زمانی است که حد اطمینان یک‌طرفه 95% خط رگرسیون میانگین به معیار پذیرش می‌رسد (حد پایین برای ویژگی کاهشی و حد بالا برای ویژگی افزایشی)؛ ${ltr("limit = ŷ ∓ t₀.₉₅,ₙ₋₂ · s · √(1/n + (t − t̄)²/Sxx)")}. برای نگهداری در دمای اتاق، با تحلیل آماری و بدون تغییر معنی‌دار در شرایط تسریع‌شده، عمر قفسه‌ای پیشنهادی را می‌توان تا دو برابر دوره داده‌های بلندمدت X برون‌یابی کرد، ولی حداکثر 12 ماه بیشتر از X؛ برای چند بچ ابتدا قابلیت ادغام داده‌ها را بسنجید ${ltr("(p > 0.25)")}. ${listNote.fa}`,
      )}
    />
  );
}
