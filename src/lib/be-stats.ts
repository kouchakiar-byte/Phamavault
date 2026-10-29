/*
 * Statistics for average bioequivalence in a 2×2×2 crossover: the 90%
 * confidence interval of the test/reference ratio and the sample size for the
 * two one-sided tests (TOST) procedure. Power uses the non-central t
 * distribution (the "nct" method of PowerTOST), which gives the same sample
 * sizes as the exact method in practice.
 */

const LN_SQRT_2PI = 0.5 * Math.log(2 * Math.PI);

/** ln Γ(x), Lanczos approximation. */
function lnGamma(x: number): number {
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return LN_SQRT_2PI + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Standard normal CDF (Cody-style erfc approximation, |error| < 1e-14 is not needed here; < 1e-7). */
export function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}

/** Regularised incomplete beta I_x(a, b), continued fraction (Numerical Recipes). */
function betaInc(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  const cf = (x: number, a: number, b: number) => {
    let c = 1;
    let d = 1 - ((a + b) * x) / (a + 1);
    if (Math.abs(d) < 1e-300) d = 1e-300;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      h *= d * c;
      aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-12) break;
    }
    return h;
  };
  return x < (a + 1) / (a + b + 2) ? (front * cf(x, a, b)) / a : 1 - (front * cf(1 - x, b, a)) / b;
}

/** Central t CDF. */
export function tCdf(t: number, df: number): number {
  const x = df / (df + t * t);
  const tail = 0.5 * betaInc(x, df / 2, 0.5);
  return t >= 0 ? 1 - tail : tail;
}

/** Central t quantile, by bisection. */
export function tQuantile(p: number, df: number): number {
  let lo = -100;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Non-central t CDF P(T ≤ t | df, δ): T = (Z + δ) / sqrt(χ²/df), integrated over
 * the χ distribution with Simpson's rule.
 */
export function nctCdf(t: number, df: number, delta: number): number {
  // density of U = sqrt(χ²_df / df)
  const lnConst = Math.log(2) + (df / 2) * Math.log(df / 2) - lnGamma(df / 2);
  const dens = (u: number) => (u <= 0 ? 0 : Math.exp(lnConst + (df - 1) * Math.log(u) - (df * u * u) / 2));
  const sd = Math.sqrt(1 / (2 * df));
  const lo = Math.max(0, 1 - 12 * sd);
  const hi = 1 + 12 * sd;
  const n = 2000;
  const h = (hi - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const u = lo + i * h;
    const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    sum += w * dens(u) * normCdf(t * u - delta);
  }
  return (sum * h) / 3;
}

/** ln(CV² + 1): the within-subject variance on the log scale. */
export const mseFromCv = (cv: number) => Math.log(cv * cv + 1);

/** 90% CI (as ratios) of the T/R geometric mean ratio in a balanced 2×2 crossover with n subjects. */
export function confidenceInterval(gmr: number, cv: number, n: number, alpha = 0.05): [number, number] {
  const se = Math.sqrt((2 * mseFromCv(cv)) / n);
  const t = tQuantile(1 - alpha, n - 2);
  return [Math.exp(Math.log(gmr) - t * se), Math.exp(Math.log(gmr) + t * se)];
}

/** Power of TOST in a 2×2 crossover (non-central t approximation). */
export function powerTost(gmr: number, cv: number, n: number, theta1 = 0.8, theta2 = 1.25, alpha = 0.05): number {
  const df = n - 2;
  const se = Math.sqrt((2 * mseFromCv(cv)) / n);
  const t = tQuantile(1 - alpha, df);
  const d1 = (Math.log(gmr) - Math.log(theta1)) / se;
  const d2 = (Math.log(gmr) - Math.log(theta2)) / se;
  return Math.max(0, nctCdf(-t, df, d2) - nctCdf(t, df, d1));
}

/** Smallest even total sample size (≥ 12) reaching the target power. */
export function sampleSize(gmr: number, cv: number, target = 0.8, theta1 = 0.8, theta2 = 1.25, alpha = 0.05): { n: number; power: number } | null {
  if (gmr <= theta1 || gmr >= theta2) return null;
  for (let n = 4; n <= 1000; n += 2) {
    const power = powerTost(gmr, cv, n, theta1, theta2, alpha);
    if (power >= target) return n < 12 ? { n: 12, power: powerTost(gmr, cv, 12, theta1, theta2, alpha) } : { n, power };
  }
  return null;
}

/** EMA average bioequivalence with expanding limits (Cmax, CVwR > 30%), capped at CVwR = 50%. */
export function abelLimits(cvwr: number): [number, number] {
  if (cvwr <= 0.3) return [0.8, 1.25];
  const swr = Math.sqrt(mseFromCv(Math.min(cvwr, 0.5)));
  return [Math.exp(-0.76 * swr), Math.exp(0.76 * swr)];
}
