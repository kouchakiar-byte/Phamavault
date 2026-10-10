import { bi } from "@/i18n/bi";

export type CalculationGroup = "formulation" | "solutions" | "analysis";

/** Groups of calculators, in the order shown on the tools page. */
export const calculationGroups: { key: CalculationGroup; title: ReturnType<typeof bi> }[] = [
  { key: "formulation", title: bi("Formulation and manufacturing", "فرمولاسیون و تولید") },
  { key: "solutions", title: bi("Solutions, physical pharmacy and stability", "محلول‌ها، داروسازی فیزیکی و پایداری") },
  { key: "analysis", title: bi("Analysis and quality control", "آنالیز و کنترل کیفیت") },
];

/** The calculators: group, tab label, full title and governing equation. */
export const calculations = [
  {
    key: "pot",
    group: "formulation",
    label: bi("Potency calculation", "محاسبه پوتنسی (Potency)"),
    title: bi("Potency calculation: API quantity from assay, water, residual solvents and salt factor", "محاسبه پوتنسی: مقدار ماده مؤثره بر اساس اسی، رطوبت، حلال باقیمانده و ضریب نمک"),
    equation: "m = LC × SF × 100 / [Assay × (100 − W − RS) / 100]",
  },
  {
    key: "bat",
    group: "formulation",
    label: bi("Batch scale-up", "افزایش مقیاس بچ"),
    title: bi("Batch scale-up (unit formula → batch formula)", "افزایش مقیاس بچ (فرمول واحد ← فرمول بچ)"),
    equation: "kg = mg/unit × units × (1 + overage) / 10⁶",
  },
  {
    key: "hlb",
    group: "formulation",
    label: bi("HLB blending", "محاسبه HLB"),
    title: bi("HLB blending of an emulsifier pair", "محاسبه HLB مخلوط دو امولسی‌فایر"),
    equation: "HLB_mix = f_A·HLB_A + f_B·HLB_B",
  },
  {
    key: "flow",
    group: "formulation",
    label: bi("Powder flow (Carr, Hausner)", "جریان‌پذیری پودر (Carr و Hausner)"),
    title: bi("Powder flow: Carr index, Hausner ratio and angle of repose (USP <1174>)", "جریان‌پذیری پودر: شاخص Carr، نسبت Hausner و زاویه سکون \u2066(USP <1174>)\u2069"),
    equation: "CI = 100·(V₀ − V_f)/V₀ ;  HR = V₀/V_f",
  },
  {
    key: "caps",
    group: "formulation",
    label: bi("Capsule size and fill", "انتخاب سایز کپسول"),
    title: bi("Hard capsule size selection from fill weight and blend density", "انتخاب سایز کپسول سخت از وزن پرکردن و دانسیته مخلوط"),
    equation: "V = fill weight / ρ_tapped",
  },
  {
    key: "tab",
    group: "formulation",
    label: bi("Tablet tensile strength", "استحکام کششی قرص"),
    title: bi("Tablet tensile strength, solid fraction and porosity", "استحکام کششی، کسر جامد و تخلخل قرص"),
    equation: "σ = 2F / (π·D·t) ;  SF = ρ_app / ρ_true",
  },
  {
    key: "coat",
    group: "formulation",
    label: bi("Film coating", "روکش فیلمی"),
    title: bi("Film coating: weight gain, coating suspension and spray time", "روکش فیلمی: افزایش وزن، سوسپانسیون روکش و زمان اسپری"),
    equation: "Suspension = batch × WG ÷ (solids × efficiency)",
  },
  {
    key: "sup",
    group: "formulation",
    label: bi("Suppository displacement", "ضریب جابه‌جایی شیاف"),
    title: bi("Suppository base by displacement value", "محاسبه پایه شیاف با ضریب جابه‌جایی"),
    equation: "Base/unit = F − D/DV",
  },
  {
    key: "iso",
    group: "solutions",
    label: bi("Isotonicity (E-value)", "ایزوتونیسیته (روش E)"),
    title: bi("Isotonicity by the sodium chloride equivalent (E-value) method", "ایزوتونیسیته به روش معادل سدیم کلراید (E)"),
    equation: "W_agent = (0.009·V − Σ m_drug·E) / E_agent",
  },
  {
    key: "fpd",
    group: "solutions",
    label: bi("Isotonicity (freezing point)", "ایزوتونیسیته (نقطه انجماد)"),
    title: bi("Isotonicity by freezing-point depression", "ایزوتونیسیته به روش کاهش نقطه انجماد"),
    equation: "W = (0.52 − a) / b",
  },
  {
    key: "osm",
    group: "solutions",
    label: bi("Osmolarity", "اسمولاریته"),
    title: bi("Calculated osmolarity of a solution", "محاسبه اسمولاریته محلول"),
    equation: "mOsm/L = Σ (mg/mL ÷ MW) × n × 1000",
  },
  {
    key: "buf",
    group: "solutions",
    label: bi("Buffer design", "طراحی بافر"),
    title: bi("Buffer design and preparation (Henderson–Hasselbalch equation)", "طراحی و ساخت بافر (معادله هندرسون–هاسلباخ)"),
    equation: "pH = pKa + log([A⁻]/[HA])",
  },
  {
    key: "bcap",
    group: "solutions",
    label: bi("Buffer capacity", "ظرفیت بافری"),
    title: bi("Buffer capacity (Van Slyke) and pH shift on acid or base addition", "ظرفیت بافری (معادله ون اسلایک) و تغییر pH با افزودن اسید یا باز"),
    equation: "β = 2.303·C·Ka·[H₃O⁺] / (Ka + [H₃O⁺])²",
  },
  {
    key: "dil",
    group: "solutions",
    label: bi("Dilution & alligation", "رقیق‌سازی و آلیگیشن"),
    title: bi("Dilution and alligation", "رقیق‌سازی و روش آلیگیشن"),
    equation: "C₁·V₁ = C₂·V₂",
  },
  {
    key: "conc",
    group: "solutions",
    label: bi("Concentration units", "تبدیل واحد غلظت"),
    title: bi("Concentration conversion: % w/v, mg/mL, ppm, molarity and ratio strength", "تبدیل غلظت: درصد وزنی/حجمی، mg/mL، ppm، مولاریته و نسبت (1:x)"),
    equation: "1% w/v = 10 mg/mL ;  M = (mg/mL) / MW",
  },
  {
    key: "meq",
    group: "solutions",
    label: bi("mg ⇄ mmol ⇄ mEq", "تبدیل mg، mmol و mEq"),
    title: bi("Conversion between mg, mmol and mEq", "تبدیل میلی‌گرم، میلی‌مول و میلی‌اکی‌والان"),
    equation: "mEq = (mg / MW) × valence",
  },
  {
    key: "vit",
    group: "solutions",
    label: bi("Vitamin units (IU ⇄ mass)", "واحد ویتامین‌ها (IU ⇄ جرم)"),
    title: bi("Vitamin unit conversion (IU ⇄ mass)", "تبدیل واحد ویتامین‌ها (IU ⇄ جرم)"),
    equation: "IU = mass (mg) × IU/mg factor",
  },
  {
    key: "kin",
    group: "solutions",
    label: bi("Stability kinetics (t90)", "سینتیک پایداری (t90)"),
    title: bi("Stability kinetics: shelf life (t90) and Arrhenius extrapolation", "سینتیک پایداری: عمر قفسه‌ای (t90) و برون‌یابی آرنیوس"),
    equation: "t90 = 0.105 / k ;  k₂ = k₁·e^[−Ea/R·(1/T₂ − 1/T₁)]",
  },
  {
    key: "hplc",
    group: "analysis",
    label: bi("Assay (HPLC, external standard)", "تعیین مقدار (HPLC، استاندارد خارجی)"),
    title: bi("Assay by external standard (HPLC or UV)", "تعیین مقدار با استاندارد خارجی (HPLC یا UV)"),
    equation: "%LC = (A_u/A_s)·C_s·V_u·(W̄/W_u)/LC × 100",
  },
  {
    key: "imp",
    group: "analysis",
    label: bi("Related substances", "ناخالصی‌ها (Related substances)"),
    title: bi("Related substances by diluted standard and relative response factor", "ناخالصی‌ها با استاندارد رقیق‌شده و ضریب پاسخ نسبی (RRF)"),
    equation: "% = (A_i/A_s)·(C_s/C_u)·(1/RRF) × 100",
  },
  {
    key: "uv",
    group: "analysis",
    label: bi("UV assay (A 1%, 1 cm)", "تعیین مقدار UV \u2066(A 1%, 1 cm)\u2069"),
    title: bi("UV–visible assay by specific absorbance (Beer–Lambert law)", "تعیین مقدار UV–Visible با جذب ویژه (قانون بیر–لامبرت)"),
    equation: "c (g/100 mL) = A / (A¹%₁cm × b)",
  },
  {
    key: "tit",
    group: "analysis",
    label: bi("Titrimetric assay", "تعیین مقدار تیتراسیون"),
    title: bi("Titrimetric assay (direct or back titration)", "تعیین مقدار به روش تیتراسیون (مستقیم یا برگشتی)"),
    equation: "% = (V − V_b)·(M/M_nom)·E / W × 100",
  },
  {
    key: "kf",
    group: "analysis",
    label: bi("Water: Karl Fischer and LOD", "رطوبت: کارل فیشر و LOD"),
    title: bi("Water content by Karl Fischer titration and loss on drying", "مقدار آب به روش کارل فیشر و افت وزن در خشک کردن"),
    equation: "H₂O % = V·F / W × 100 ;  LOD % = (W₁ − W₂)/W₁ × 100",
  },
  {
    key: "sst",
    group: "analysis",
    label: bi("System suitability (USP <621>)", "انطباق سیستم \u2066(USP <621>)\u2069"),
    title: bi("Chromatographic system suitability: plates, resolution, tailing and %RSD", "انطباق سیستم کروماتوگرافی: تعداد بشقابک، تفکیک، دنباله‌دهی و %RSD"),
    equation: "N = 5.54·(t_R/W_h)² ;  R_s = 1.18·Δt_R/(W_h1 + W_h2) ;  T = W_0.05/2f",
  },
  {
    key: "lin",
    group: "analysis",
    label: bi("Linearity, LOD and LOQ", "خطی بودن، LOD و LOQ"),
    title: bi("Linearity by least squares, with LOD and LOQ (ICH Q2)", "خطی بودن با روش حداقل مربعات و محاسبه LOD و LOQ \u2066(ICH Q2)\u2069"),
    equation: "LOD = 3.3σ/S ;  LOQ = 10σ/S",
  },
  {
    key: "diss",
    group: "analysis",
    label: bi("Dissolution % released", "درصد انحلال"),
    title: bi("Dissolution: % released with correction for withdrawn samples", "انحلال: درصد آزادشده با اصلاح نمونه‌های برداشته‌شده"),
    equation: "Q_n = [C_n·V + v·Σ C_i(i<n)] / LC × 100",
  },
  {
    key: "f2",
    group: "analysis",
    label: bi("Similarity factor f2", "فاکتور تشابه f2"),
    title: bi("Dissolution profile comparison: similarity factor f2 and difference factor f1", "مقایسه پروفایل انحلال: فاکتور تشابه f2 و فاکتور تفاوت f1"),
    equation: "f2 = 50·log{[1 + (1/n)Σ(R_t − T_t)²]^−0.5 × 100}",
  },
  {
    key: "udu",
    group: "analysis",
    label: bi("Content uniformity (AV)", "یکنواختی محتوا (AV)"),
    title: bi("Uniformity of dosage units: acceptance value (USP <905>)", "یکنواختی واحدهای دارویی: مقدار پذیرش AV \u2066(USP <905>)\u2069"),
    equation: "AV = |M − X̄| + k·s",
  },
] as const;

export type CalculationKey = (typeof calculations)[number]["key"];

export const calculation = (key: CalculationKey) => calculations.find((c) => c.key === key)!;

/** Calculators featured on the home page. */
export const featuredCalculations: CalculationKey[] = ["pot", "hlb", "flow", "iso", "buf", "hplc", "f2", "udu"];
