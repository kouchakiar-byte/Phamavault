"use client";

import { bi, type Bi } from "@/i18n/bi";
import { calculation } from "@/content/calculations";
import { fixed } from "../calc-format";
import { DASH, NumberInput, Panel, bad, ltr, num, type Ctx } from "./ui";

/* Formulation and manufacturing calculators: powder flow, capsule size, tablet strength, film coating. */

// ---------- Powder flow (USP <1174>) ----------

const flowClasses: Bi[] = [
  bi("Excellent", "عالی"),
  bi("Good", "خوب"),
  bi("Fair", "متوسط"),
  bi("Passable", "قابل قبول"),
  bi("Poor", "ضعیف"),
  bi("Very poor", "خیلی ضعیف"),
  bi("Very, very poor", "بسیار بسیار ضعیف"),
];

/** Upper bounds of each USP <1174> class. */
const carrBounds = [10, 15, 20, 25, 31, 37];
const reposeBounds = [30, 35, 40, 45, 55, 65];
const classOf = (x: number, bounds: number[]) => {
  const i = bounds.findIndex((b) => x <= b);
  return flowClasses[i === -1 ? bounds.length : i];
};

export function Flow({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const m = num(v["fl-m"]), v0 = num(v["fl-v0"]), vf = num(v["fl-vf"]), h = num(v["fl-h"]), r = num(v["fl-r"]);
  let bulk = DASH, tapped = DASH, ci = DASH, hr = DASH, angle = DASH, msg = "";
  if (!(m > 0) || !(v0 > 0) || !(vf > 0) || vf > v0) msg = bad(ctx);
  else {
    const c = (100 * (v0 - vf)) / v0;
    bulk = `${fixed(m / v0, 3)} g/mL`;
    tapped = `${fixed(m / vf, 3)} g/mL`;
    ci = `${fixed(c, 1)}%  ·  ${classOf(c, carrBounds)[locale]}`;
    hr = fixed(v0 / vf, 2);
  }
  if (h > 0 && r > 0) {
    const deg = (Math.atan(h / r) * 180) / Math.PI;
    angle = `${fixed(deg, 1)}°  ·  ${classOf(deg, reposeBounds)[locale]}`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("flow").title}
      form={
        <>
          <NumberInput ctx={ctx} id="fl-m" label={bi("Powder mass (g)", "جرم پودر (گرم)")} />
          <NumberInput ctx={ctx} id="fl-v0" label={bi("Bulk (unsettled) volume V₀ (mL)", "حجم توده (اولیه) V₀ (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="fl-vf" label={bi("Tapped volume V_f (mL)", "حجم پس از ضربه V_f (میلی‌لیتر)")} />
          <NumberInput ctx={ctx} id="fl-h" label={bi("Angle of repose: cone height (cm)", "زاویه سکون: ارتفاع مخروط (سانتی‌متر)")} />
          <NumberInput ctx={ctx} id="fl-r" label={bi("Angle of repose: cone base radius (cm)", "زاویه سکون: شعاع قاعده مخروط (سانتی‌متر)")} />
        </>
      }
      results={[
        { label: bi("Bulk density", "دانسیته توده"), value: bulk },
        { label: bi("Tapped density", "دانسیته پس از ضربه"), value: tapped },
        { label: bi("Carr (compressibility) index", "شاخص Carr (تراکم‌پذیری)"), value: ci },
        { label: bi("Hausner ratio", "نسبت Hausner"), value: hr },
        { label: bi("Angle of repose", "زاویه سکون"), value: angle },
      ]}
      message={msg}
      note={bi(
        "USP <1174> scale. Carr index ≤ 10 excellent, 11–15 good, 16–20 fair, 21–25 passable, 26–31 poor, 32–37 very poor, ≥ 38 very, very poor; the matching Hausner ratios are 1.00–1.11, 1.12–1.18, 1.19–1.25, 1.26–1.34, 1.35–1.45, 1.46–1.59 and ≥ 1.60. Angle of repose 25–30° excellent up to > 66° very, very poor. Bulk and tapped volumes are measured per USP <616>.",
        `مقیاس ${ltr("USP <1174>")}. شاخص Carr تا 10 عالی، 11 تا 15 خوب، 16 تا 20 متوسط، 21 تا 25 قابل قبول، 26 تا 31 ضعیف، 32 تا 37 خیلی ضعیف و از 38 به بالا بسیار بسیار ضعیف است؛ نسبت‌های Hausner متناظر 1.00–1.11، 1.12–1.18، 1.19–1.25، 1.26–1.34، 1.35–1.45، 1.46–1.59 و بالای 1.60 است. زاویه سکون 25 تا 30 درجه عالی و بیش از 66 درجه بسیار بسیار ضعیف است. حجم توده و حجم پس از ضربه طبق ${ltr("USP <616>")} اندازه‌گیری می‌شود.`,
      )}
    />
  );
}

// ---------- Capsule size ----------

/** Nominal body volumes of hard capsules (mL), largest first. */
const capsuleSizes: [string, number][] = [
  ["000", 1.37],
  ["00el", 1.02],
  ["00", 0.91],
  ["0el", 0.78],
  ["0", 0.68],
  ["1", 0.5],
  ["2", 0.37],
  ["3", 0.3],
  ["4", 0.21],
  ["5", 0.13],
];

export function Caps({ ctx }: { ctx: Ctx }) {
  const { v, locale } = ctx;
  const fill = num(v["cp-fill"]), rho = num(v["cp-rho"]);
  const ok = fill > 0 && rho > 0;
  const need = ok ? fill / 1000 / rho : NaN;
  const fits = capsuleSizes.filter(([, vol]) => vol >= need);
  const best = fits[fits.length - 1];
  let msg = ok ? "" : bad(ctx);
  if (ok && !best)
    msg = bi("The fill volume exceeds size 000; increase the density (e.g. by granulation) or split the dose.", "حجم پرکردن از سایز 000 بیشتر است؛ دانسیته را افزایش دهید (مثلاً با گرانوله کردن) یا دوز را تقسیم کنید.")[locale];
  return (
    <Panel
      ctx={ctx}
      title={calculation("caps").title}
      form={
        <>
          <NumberInput ctx={ctx} id="cp-fill" label={bi("Fill weight per capsule (mg)", "وزن پرکردن هر کپسول (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="cp-rho" label={bi("Blend density in the capsule (g/mL); tapped density as a first estimate", "دانسیته مخلوط در کپسول (g/mL)؛ در برآورد اول دانسیته پس از ضربه")} />
        </>
      }
      results={[
        { label: bi("Fill volume needed", "حجم موردنیاز"), value: ok ? `${fixed(need, 3)} mL` : DASH },
        { label: bi("Smallest suitable size", "کوچک‌ترین سایز مناسب"), value: best ? best[0] : DASH },
        { label: bi("Body volume filled", "درصد پر شدن بدنه"), value: best ? `${fixed((need / best[1]) * 100, 1)}%` : DASH },
      ]}
      message={msg}
      note={bi(
        "Nominal body volumes from capsule manufacturers' data; confirm with your supplier. A fill above about 90% of the body volume leaves little margin for density variation.",
        "حجم‌های اسمی بدنه از داده‌های سازندگان کپسول است و باید با تأمین‌کننده تأیید شود. پر شدن بیش از حدود 90٪ حجم بدنه، حاشیه کمی برای تغییرات دانسیته باقی می‌گذارد.",
      )}
    >
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="db">
          <thead>
            <tr>
              <th>{bi("Size", "سایز")[locale]}</th>
              <th>{bi("Body volume (mL)", "حجم بدنه (mL)")[locale]}</th>
              <th>{bi("Maximum fill at this density (mg)", "حداکثر وزن پرکردن با این دانسیته (mg)")[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {capsuleSizes.map(([size, vol]) => (
              <tr key={size} className={best?.[0] === size ? "bg-molecule-50 font-semibold" : ""}>
                <td className="num">{size}</td>
                <td className="num">{vol.toFixed(2)}</td>
                <td className="num">{rho > 0 ? fixed(vol * rho * 1000, 0) : DASH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ---------- Tablet tensile strength ----------

export function Tab({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const f = num(v["tb-f"]), d = num(v["tb-d"]), t = num(v["tb-t"]), w = num(v["tb-w"]), rho = num(v["tb-rho"]);
  let sigma = DASH, app = DASH, sf = DASH, por = DASH, msg = "";
  if (!(f > 0) || !(d > 0) || !(t > 0)) msg = bad(ctx);
  else {
    sigma = `${fixed((2 * f) / (Math.PI * d * t), 2)} MPa`;
    if (w > 0 && rho > 0) {
      const volCm3 = (Math.PI * (d / 2) ** 2 * t) / 1000;
      const a = w / 1000 / volCm3;
      app = `${fixed(a, 3)} g/cm³`;
      sf = fixed(a / rho, 3);
      por = `${fixed((1 - a / rho) * 100, 1)}%`;
    }
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("tab").title}
      form={
        <>
          <NumberInput ctx={ctx} id="tb-f" label={bi("Breaking force F (N)", "نیروی شکست F (نیوتن)")} />
          <NumberInput ctx={ctx} id="tb-d" label={bi("Diameter D (mm)", "قطر D (میلی‌متر)")} />
          <NumberInput ctx={ctx} id="tb-t" label={bi("Thickness t (mm)", "ضخامت t (میلی‌متر)")} />
          <NumberInput ctx={ctx} id="tb-w" label={bi("Tablet weight (mg)", "وزن قرص (میلی‌گرم)")} />
          <NumberInput ctx={ctx} id="tb-rho" label={bi("True density of the blend (g/cm³)", "دانسیته حقیقی مخلوط (g/cm³)")} />
        </>
      }
      results={[
        { label: bi("Tensile strength", "استحکام کششی"), value: sigma },
        { label: bi("Apparent density", "دانسیته ظاهری"), value: app },
        { label: bi("Solid fraction", "کسر جامد"), value: sf },
        { label: bi("Porosity", "تخلخل"), value: por },
      ]}
      message={msg}
      note={bi(
        "Diametral compression of flat-faced round tablets (Fell and Newton): σ = 2F ÷ (π·D·t); for convex tablets use the Pitt equation. 1 kp = 9.807 N. A tensile strength of about 1.7 MPa or more is generally regarded as sufficient for coating and handling, and immediate-release tablets are commonly compressed to a solid fraction of about 0.80–0.90.",
        `فشار قطری قرص‌های گرد با سطح تخت (Fell و Newton): ${ltr("σ = 2F ÷ (π·D·t)")}؛ برای قرص‌های محدب از معادله Pitt استفاده کنید. هر کیلوپاند برابر 9.807 نیوتن است. استحکام کششی حدود 1.7 مگاپاسکال یا بیشتر معمولاً برای روکش‌دهی و جابه‌جایی کافی است و قرص‌های رهش فوری معمولاً تا کسر جامد حدود 0.80 تا 0.90 فشرده می‌شوند.`,
      )}
    />
  );
}

// ---------- Film coating ----------

export function Coat({ ctx }: { ctx: Ctx }) {
  const { v } = ctx;
  const b = num(v["co-b"]), wg = num(v["co-wg"]), sol = num(v["co-sol"]), eff = num(v["co-eff"]), rate = num(v["co-rate"]);
  let applied = DASH, sprayed = DASH, susp = DASH, solvent = DASH, coated = DASH, time = DASH, msg = "";
  if (!(b > 0) || !(wg >= 0) || !(sol > 0 && sol <= 100) || !(eff > 0 && eff <= 100)) msg = bad(ctx);
  else {
    const a = (b * wg) / 100, s = a / (eff / 100), total = s / (sol / 100);
    applied = `${fixed(a, 3)} kg`;
    sprayed = `${fixed(s, 3)} kg`;
    susp = `${fixed(total, 2)} kg`;
    solvent = `${fixed(total - s, 2)} kg`;
    coated = `${fixed(b + a, 2)} kg`;
    if (rate > 0) time = `${fixed((total * 1000) / rate, 0)} min`;
  }
  return (
    <Panel
      ctx={ctx}
      title={calculation("coat").title}
      form={
        <>
          <NumberInput ctx={ctx} id="co-b" label={bi("Core batch weight (kg)", "وزن هسته‌ها در بچ (کیلوگرم)")} />
          <NumberInput ctx={ctx} id="co-wg" label={bi("Target weight gain (%)", "افزایش وزن هدف (%)")} />
          <NumberInput ctx={ctx} id="co-sol" label={bi("Solids content of the suspension (% w/w)", "درصد جامد سوسپانسیون (% وزنی/وزنی)")} />
          <NumberInput ctx={ctx} id="co-eff" label={bi("Coating efficiency (%)", "راندمان روکش‌دهی (%)")} />
          <NumberInput ctx={ctx} id="co-rate" label={bi("Spray rate (g/min)", "سرعت اسپری (گرم در دقیقه)")} />
        </>
      }
      results={[
        { label: bi("Dry coating on the tablets", "روکش خشک روی قرص‌ها"), value: applied },
        { label: bi("Solids to spray", "جامد موردنیاز برای اسپری"), value: sprayed },
        { label: bi("Coating suspension to prepare", "سوسپانسیون موردنیاز"), value: susp },
        { label: bi("Of which water or solvent", "سهم آب یا حلال"), value: solvent },
        { label: bi("Coated batch weight", "وزن بچ روکش‌شده"), value: coated },
        { label: bi("Spray time", "زمان اسپری"), value: time },
      ]}
      message={msg}
      note={bi(
        "Solids applied = core weight × weight gain; solids to spray = applied ÷ efficiency; suspension = solids to spray ÷ solids fraction. Prepare a working excess (often 10–20%) for line priming and losses.",
        "جامد روی قرص = وزن هسته × افزایش وزن؛ جامد اسپری = جامد روی قرص ÷ راندمان؛ سوسپانسیون = جامد اسپری ÷ کسر جامد. برای پر کردن خطوط و اتلاف، مقداری اضافه (معمولاً 10 تا 20٪) آماده کنید.",
      )}
    />
  );
}
