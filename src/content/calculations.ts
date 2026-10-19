import { bi } from "@/i18n/bi";

export type CalculationGroup = "formulation" | "solutions" | "analysis" | "micro" | "clinical";

/** Groups of calculators, in the order shown on the tools page. */
export const calculationGroups: { key: CalculationGroup; title: ReturnType<typeof bi> }[] = [
  { key: "formulation", title: bi("Formulation and manufacturing", "فرمولاسیون و تولید") },
  { key: "solutions", title: bi("Solutions, physical pharmacy and stability", "محلول‌ها، فیزیکال فارماسی و پایداری") },
  { key: "analysis", title: bi("Analysis and quality control", "آنالیز و کنترل کیفیت") },
  { key: "micro", title: bi("Microbiology, sterility and endotoxins", "میکروبیولوژی، استریلیتی و اندوتوکسین") },
  { key: "clinical", title: bi("Dosing and pharmacokinetics", "دوزبندی و فارماکوکینتیک") },
];

/** The calculators: group, tab label, full title and governing equation. */
export const calculations = [
  {
    key: "pot",
    group: "formulation",
    label: bi("Potency calculation", "محاسبه پوتنسی (Potency)"),
    title: bi("Potency calculation: API quantity from assay, water, residual solvents and salt factor", "محاسبه پوتنسی: مقدار ماده مؤثره بر اساس Assay، رطوبت، حلال باقیمانده و ضریب نمک"),
    equation: "m = LC × SF × 100 / [Assay × (100 − W − RS) / 100]",
  },
  {
    key: "asy",
    group: "formulation",
    label: bi("Assay correction factor", "محاسبه Assay در فرمولاسیون"),
    title: bi(
      "Assay correction in formulation: salt factor × assay factor × water/LOD factor",
      "محاسبه Assay در فرمولاسیون: ضریب نمک × ضریب Assay × ضریب رطوبت (LOD/Water)",
    ),
    equation: "F = (MW salt ÷ MW base) × (100 ÷ Assay) × [100 ÷ (100 − LOD)]",
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
    title: bi("HLB blending of an emulsifier pair", "محاسبه HLB مخلوط دو امولسیون‌کننده"),
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
    label: bi("Capsule size and fill", "انتخاب اندازه کپسول"),
    title: bi("Hard capsule size selection from fill weight and blend density", "انتخاب اندازه کپسول سخت از وزن پرکردن و دانسیته مخلوط"),
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
    key: "wv",
    group: "formulation",
    label: bi("Uniformity of mass", "یکنواختی وزن"),
    title: bi("Uniformity of mass of single-dose preparations (Ph. Eur. 2.9.5)", "یکنواختی وزن فرآورده‌های تک‌دوز \u2066(Ph. Eur. 2.9.5)\u2069"),
    equation: "deviation % = (w_i − w̄) / w̄ × 100",
  },
  {
    key: "fri",
    group: "formulation",
    label: bi("Tablet friability", "فرسایش‌پذیری قرص"),
    title: bi("Friability of uncoated tablets (USP <1216>, Ph. Eur. 2.9.7)", "فرسایش‌پذیری قرص‌های بدون روکش \u2066(USP <1216>, Ph. Eur. 2.9.7)\u2069"),
    equation: "loss % = (W₁ − W₂) / W₁ × 100",
  },
  {
    key: "moist",
    group: "formulation",
    label: bi("Granulation water and drying", "آب گرانولاسیون و خشک کردن"),
    title: bi("Moisture adjustment: water to add or remove to reach a target LOD", "تنظیم رطوبت: آب لازم برای افزودن یا حذف تا رسیدن به LOD هدف"),
    equation: "Δm = M_dry × [x_t/(100 − x_t) − x_0/(100 − x_0)]",
  },
  {
    key: "maco",
    group: "formulation",
    label: bi("Cleaning validation (MACO)", "اعتبارسنجی تمیزکاری (MACO)"),
    title: bi("Cleaning validation: maximum allowable carryover and swab/rinse limits", "اعتبارسنجی تمیزکاری: حداکثر انتقال مجاز (MACO) و حدود نمونه‌برداری Swab و Rinse"),
    equation: "MACO = PDE × MBS / MDD ;  swab limit = MACO × A_swab / A_shared",
  },
  {
    key: "yld",
    group: "formulation",
    label: bi("Batch yield and reconciliation", "بازده و تطبیق مقادیر بچ"),
    title: bi("Batch yield and reconciliation against the master batch record limits", "بازده بچ و تطبیق مقادیر (Reconciliation) با حدود دستور ساخت"),
    equation: "Yield % = good ÷ theoretical × 100 ;  Reconciliation % = (good + samples + rejects + losses) ÷ theoretical × 100",
  },
  {
    key: "samp",
    group: "formulation",
    label: bi("Sampling plan (√N + 1)", "طرح نمونه‌برداری (√N + 1)"),
    title: bi("Sampling of incoming materials: WHO n, p and r plans", "نمونه‌برداری از مواد ورودی: طرح‌های n، p و r سازمان جهانی بهداشت"),
    equation: "n = 1 + √N ;  p = 0.4·√N ;  r = 1.5·√N",
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
    key: "mkt",
    group: "solutions",
    label: bi("Mean kinetic temperature", "دمای سینتیکی میانگین (MKT)"),
    title: bi("Mean kinetic temperature of a storage period (USP <1079.2>)", "دمای سینتیکی میانگین دوره نگهداری \u2066(USP <1079.2>)\u2069"),
    equation: "MKT = (ΔH/R) / −ln[(1/n)·Σ e^(−ΔH/RT_i)]",
  },
  {
    key: "q1e",
    group: "solutions",
    label: bi("Shelf life by regression (ICH Q1E)", "تعیین تاریخ انقضا با رگرسیون \u2066(ICH Q1E)\u2069"),
    title: bi("Shelf-life estimation from stability data: 95% one-sided confidence limit (ICH Q1E)", "برآورد عمر قفسه‌ای از داده‌های پایداری: حد اطمینان یک‌طرفه ۹۵٪ \u2066(ICH Q1E)\u2069"),
    equation: "ŷ(t) − t₀.₉₅,ₙ₋₂ · s·√[1/n + (t − t̄)²/Sxx] = spec",
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
    label: bi("Titrimetric assay", "تعیین مقدار تیتریمتری"),
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
    title: bi("Linearity by least squares, with LOD and LOQ (ICH Q2(R2))", "خطی بودن با روش حداقل مربعات و محاسبه LOD و LOQ \u2066(ICH Q2(R2))\u2069"),
    equation: "LOD = 3.3σ/S ;  LOQ = 10σ/S",
  },
  {
    key: "std",
    group: "analysis",
    label: bi("Volumetric solution standardisation", "استانداردسازی محلول حجمی"),
    title: bi("Standardisation of a volumetric solution against a primary standard", "استانداردسازی محلول حجمی با استاندارد اولیه"),
    equation: "M = m / (V × E) ;  factor f = M / M_nominal",
  },
  {
    key: "rot",
    group: "analysis",
    label: bi("Specific optical rotation", "چرخش نوری ویژه"),
    title: bi("Specific optical rotation (USP <781>, Ph. Eur. 2.2.7)", "چرخش نوری ویژه \u2066(USP <781>, Ph. Eur. 2.2.7)\u2069"),
    equation: "[α] = 100·α / (l·c)",
  },
  {
    key: "q3c",
    group: "analysis",
    label: bi("Residual solvents (ICH Q3C)", "حلال‌های باقیمانده \u2066(ICH Q3C)\u2069"),
    title: bi("Residual solvents: concentration limit from PDE (ICH Q3C options 1 and 2)", "حلال‌های باقیمانده: حد غلظت از PDE \u2066(ICH Q3C, options 1 & 2)\u2069"),
    equation: "limit (ppm) = 1000 × PDE (mg/day) / dose (g/day)",
  },
  {
    key: "q3d",
    group: "analysis",
    label: bi("Elemental impurities (ICH Q3D)", "ناخالصی‌های عنصری \u2066(ICH Q3D)\u2069"),
    title: bi("Elemental impurities: permitted concentration and control threshold (ICH Q3D)", "ناخالصی‌های عنصری: غلظت مجاز و آستانه کنترل \u2066(ICH Q3D)\u2069"),
    equation: "C (µg/g) = PDE (µg/day) / daily dose (g/day)",
  },
  {
    key: "nitro",
    group: "analysis",
    label: bi("Nitrosamine limit", "حد نیتروزآمین‌ها"),
    title: bi("Nitrosamine impurities: limit from the acceptable intake (AI)", "ناخالصی‌های نیتروزآمین: حد مجاز بر اساس دریافت قابل قبول (AI)"),
    equation: "limit (ppm) = AI (ng/day) / MDD (mg/day)",
  },
  {
    key: "lodq",
    group: "analysis",
    label: bi("LOD and LOQ (ICH Q2)", "حد تشخیص و حد اندازه‌گیری (LOD و LOQ)"),
    title: bi("Detection and quantitation limits from a calibration line (ICH Q2(R2))", "حد تشخیص و حد اندازه‌گیری از منحنی کالیبراسیون ⁦(ICH Q2(R2))⁩"),
    equation: "LOD = 3.3σ ÷ S ;  LOQ = 10σ ÷ S",
  },
  {
    key: "cpk",
    group: "analysis",
    label: bi("Process capability (Cp, Cpk)", "توانایی فرایند (Cp و Cpk)"),
    title: bi("Process capability: Cp, Cpk and expected out-of-specification rate", "توانایی فرایند: Cp، Cpk و درصد پیش‌بینی خارج از مشخصات"),
    equation: "Cp = (USL − LSL) ÷ 6s ;  Cpk = min(USL − x̄, x̄ − LSL) ÷ 3s",
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
  {
    key: "eli",
    group: "micro",
    label: bi("Endotoxin limit and MVD", "حد اندوتوکسین و MVD"),
    title: bi("Bacterial endotoxins: endotoxin limit, maximum valid dilution and MVC (USP <85>, Ph. Eur. 2.6.14)", "اندوتوکسین باکتریایی: حد اندوتوکسین، حداکثر رقت معتبر (MVD) و MVC \u2066(USP <85>, Ph. Eur. 2.6.14)\u2069"),
    equation: "EL = K / M ;  MVD = EL × C / λ",
  },
  {
    key: "lal",
    group: "micro",
    label: bi("Endotoxin: kinetic LAL", "اندوتوکسین: روش کینتیک LAL"),
    title: bi("Photometric (kinetic) LAL: standard curve, sample result and spike recovery", "روش فوتومتریک (کینتیک) LAL: منحنی استاندارد، نتیجه نمونه و بازیافت اسپایک"),
    equation: "log T = a + b·log C ;  recovery = (C_spiked − C_sample) / C_spike × 100",
  },
  {
    key: "gel",
    group: "micro",
    label: bi("Endotoxin: gel-clot", "اندوتوکسین: روش ژل‌کلات"),
    title: bi("Gel-clot method: geometric mean end-point and confirmation of labelled sensitivity λ", "روش ژل‌کلات: میانگین هندسی نقطه پایانی و تأیید حساسیت برچسب λ"),
    equation: "end-point = antilog[Σ log e_i / f]",
  },
  {
    key: "f0",
    group: "micro",
    label: bi("Sterilisation F0 value", "مقدار F0 استریلیزاسیون"),
    title: bi("Lethality of a moist-heat cycle: F0 from temperature readings", "کشندگی چرخه حرارت مرطوب: محاسبه F0 از دماهای ثبت‌شده"),
    equation: "F₀ = Δt · Σ 10^((T − 121.1)/z)",
  },
  {
    key: "sal",
    group: "micro",
    label: bi("D-value, log reduction and SAL", "مقدار D، کاهش لگاریتمی و SAL"),
    title: bi("D-value, log reduction and sterility assurance level", "مقدار D، کاهش لگاریتمی و سطح اطمینان از استریلیتی (SAL)"),
    equation: "D = t / (log N₀ − log N) ;  log N_F = log N₀ − F/D",
  },
  {
    key: "ach",
    group: "micro",
    label: bi("Cleanroom air changes (ACH)", "تعویض هوای اتاق تمیز (ACH)"),
    title: bi("Cleanroom air changes per hour and theoretical recovery time", "تعداد تعویض هوا در ساعت اتاق تمیز و زمان بازیابی نظری"),
    equation: "ACH = Q ÷ V ;  t₁₀₀:₁ = 60·ln(100) ÷ ACH",
  },
  {
    key: "cfu",
    group: "micro",
    label: bi("Microbial count (TAMC/TYMC)", "شمارش میکروبی \u2066(TAMC/TYMC)\u2069"),
    title: bi("Microbial enumeration: cfu per g or mL and acceptance (USP <61>, <1111>)", "شمارش میکروبی: cfu در هر گرم یا میلی‌لیتر و پذیرش \u2066(USP <61>, <1111>)\u2069"),
    equation: "cfu/g = mean colonies × dilution factor / volume plated",
  },
  {
    key: "bsa",
    group: "clinical",
    label: bi("BSA, BMI and body weight", "سطح بدن، BMI و وزن بدن"),
    title: bi("Body surface area, BMI, ideal and adjusted body weight", "سطح بدن (BSA)، شاخص توده بدنی، وزن ایده‌آل و وزن اصلاح‌شده"),
    equation: "BSA = √(height × weight / 3600)",
  },
  {
    key: "crcl",
    group: "clinical",
    label: bi("Renal function (CrCl, eGFR)", "عملکرد کلیه (CrCl و eGFR)"),
    title: bi("Creatinine clearance (Cockcroft–Gault) and eGFR (CKD-EPI 2021)", "کلیرانس کراتینین (کاکرافت–گالت) و eGFR \u2066(CKD-EPI 2021)\u2069"),
    equation: "CrCl = (140 − age) × weight / (72 × SCr) [× 0.85 F]",
  },
  {
    key: "inf",
    group: "clinical",
    label: bi("IV infusion rate", "سرعت انفوزیون وریدی"),
    title: bi("Intravenous infusion: dose rate, mL/h and drops per minute", "انفوزیون وریدی: سرعت دوز، میلی‌لیتر در ساعت و قطره در دقیقه"),
    equation: "mL/h = dose rate (mg/h) / concentration (mg/mL)",
  },
  {
    key: "pk",
    group: "clinical",
    label: bi("Half-life and dosing (1-compartment)", "نیمه‌عمر و دوزبندی (تک‌بخشی)"),
    title: bi("One-compartment pharmacokinetics: k, half-life, clearance, accumulation and doses", "فارماکوکینتیک تک‌بخشی: ثابت حذف، نیمه‌عمر، کلیرانس، تجمع و دوزها"),
    equation: "k = ln(C₁/C₂)/Δt ;  t½ = 0.693/k ;  C_ss,avg = F·D/(CL·τ)",
  },
  {
    key: "hed",
    group: "clinical",
    label: bi("Human equivalent dose (HED)", "دوز معادل انسانی (HED)"),
    title: bi("Human equivalent dose and maximum recommended starting dose (FDA 2005, body surface area)", "دوز معادل انسانی و حداکثر دوز شروع توصیه‌شده (FDA 2005، بر پایه سطح بدن)"),
    equation: "HED (mg/kg) = animal dose × (Km animal / Km human)",
  },
] as const;

export type CalculationKey = (typeof calculations)[number]["key"];

export const calculation = (key: CalculationKey) => calculations.find((c) => c.key === key)!;

/** Calculators featured on the home page. */
export const featuredCalculations: CalculationKey[] = ["pot", "hlb", "flow", "iso", "buf", "hplc", "f2", "udu"];

/*
 * Current editions of the references behind each calculator, reviewed October 2026
 * (Mehr 1405): USP–NF 2026, Ph. Eur. 12th Edition (12.3, in force 1 July 2026) and
 * the latest Step 4 versions of the ICH guidelines.
 */
const USP = "USP–NF 2026";
const EP = "Ph. Eur. 12.3";
const REMINGTON = "Remington, 23rd ed. (2020)";

const BP = "BP 2026";

/** BP 2026 reproduces every Ph. Eur. text, so it is cited wherever Ph. Eur. is. */
const withBp = (refs: Record<CalculationKey, string[]>): Record<CalculationKey, string[]> =>
  Object.fromEntries(
    Object.entries(refs).map(([k, r]) => [k, r.some((x) => x.startsWith(EP)) ? [...r, `${BP} (incl. Ph. Eur. texts)`] : r]),
  ) as Record<CalculationKey, string[]>;

export const calculationRefs: Record<CalculationKey, string[]> = withBp({
  pot: [`${USP}, General Notices`, `${EP}, General Notices`],
  asy: [`${USP}, General Notices`, `${EP}, General Notices`],
  bat: [REMINGTON],
  hlb: [REMINGTON, "Pharmaceutical Excipients (MedicinesComplete; online edition of the Handbook of Pharmaceutical Excipients)"],
  flow: [`${USP} <1174>`, `${EP} 2.9.36`],
  caps: [REMINGTON],
  tab: [`${USP} <1217>`, `${EP} 2.9.8`],
  coat: [REMINGTON],
  sup: [REMINGTON],
  iso: [REMINGTON],
  fpd: [REMINGTON],
  osm: [`${USP} <785>`, `${EP} 2.2.35`],
  buf: [REMINGTON],
  bcap: [REMINGTON],
  dil: [`${USP} <1160>`],
  conc: [`${USP} <1160>`],
  meq: [`${USP} <1160>`],
  vit: [`${USP}, vitamin monographs`],
  kin: ["ICH Q1A(R2) (2003)", REMINGTON],
  hplc: [`${USP} <621>`, `${EP} 2.2.46`],
  imp: ["ICH Q3A(R2) (2006)", "ICH Q3B(R2) (2006)"],
  uv: [`${USP} <857>`, `${EP} 2.2.25`],
  tit: [`${USP} <541>`],
  kf: [`${USP} <921>`, `${USP} <731>`, `${EP} 2.5.12`],
  sst: [`${USP} <621>`, `${EP} 2.2.46`],
  lin: ["ICH Q2(R2) (2023)"],
  diss: [`${USP} <711>`, `${EP} 2.9.3`],
  f2: ["FDA, Dissolution Testing of IR Solid Oral Dosage Forms (1997)", "EMA, Guideline on the Investigation of Bioequivalence, Rev. 1 (2010)"],
  udu: [`${USP} <905>`, `${EP} 2.9.40`],
  wv: [`${EP} 2.9.5`],
  fri: [`${USP} <1216>`, `${EP} 2.9.7`],
  moist: [`${USP} <731>`, `${EP} 2.2.32`],
  maco: ["EMA, Guideline on setting health-based exposure limits (HBEL), EMA/CHMP/CVMP/SWP/169430/2012"],
  mkt: [`${USP} <1079.2>`, `${USP} <659>`],
  q1e: ["ICH Q1E (2003)"],
  std: [`${USP} <541>`, `${EP} 4.2.2`],
  rot: [`${USP} <781>`, `${EP} 2.2.7`],
  q3c: ["ICH Q3C(R9) (2024)", `${USP} <467>`],
  q3d: ["ICH Q3D(R2) (2022)", `${USP} <232>`],
  nitro: ["FDA, Control of Nitrosamine Impurities in Human Drugs, Rev. 2 (2024)", "EMA, Q&A on nitrosamine impurities (EMA/409815/2020, current revision)"],
  eli: [`${USP} <85>`, `${EP} 2.6.14`, `${EP} 5.1.10`],
  lal: [`${USP} <85>`, `${EP} 2.6.14`],
  gel: [`${USP} <85>`, `${EP} 2.6.14`],
  f0: [`${EP} 5.1.1`, `${EP} 5.1.5`, `${USP} <1229>`],
  sal: [`${EP} 5.1.1`, `${USP} <1229>`, "ISO 11138-1:2017"],
  cfu: [`${USP} <61>`, `${USP} <1111>`, `${EP} 2.6.12`, `${EP} 5.1.4`],
  bsa: ["Mosteller, NEJM 1987", "DuBois & DuBois, 1916", "Haycock, J Pediatr 1978", "WHO BMI classification"],
  crcl: ["Cockcroft & Gault, Nephron 1976", "Inker et al., NEJM 2021 (CKD-EPI 2021)", "KDIGO CKD guideline (2024)"],
  inf: [`${USP} <1160>`],
  pk: ["Rowland & Tozer, Clinical Pharmacokinetics and Pharmacodynamics, 5th ed. (2019)"],
  hed: ["FDA, Estimating the Maximum Safe Starting Dose in Initial Clinical Trials (2005)"],
  yld: ["21 CFR 211.103 (calculation of yield)", "EU GMP Part I, Chapter 5 (Production)"],
  samp: ["WHO TRS 929, Annex 4: Guidelines for sampling of pharmaceutical products (2005)", "EU GMP Annex 8 (Sampling of starting and packaging materials)"],
  lodq: ["ICH Q2(R2) (2023)"],
  cpk: ["ISO 22514-2:2017", "FDA, Process Validation: General Principles and Practices (2011)"],
  ach: ["EU GMP Annex 1 (2022)", "ISO 14644-3:2019"],
});

/** The references of the calculator with this title (Panel only knows the title). */
export const refsForTitle = (title: unknown): string[] => {
  const c = calculations.find((x) => x.title === title);
  return c ? calculationRefs[c.key] : [];
};

/** Official pages behind the references (USP–NF and Ph. Eur. need a subscription). */
const refLinks: [prefix: string, url: string][] = [
  [USP, "https://www.uspnf.com/"],
  [EP, "https://go.edqm.eu/PhEurOnline"],
  [BP, "https://www.pharmacopoeia.com/"],
  ["ICH ", "https://www.ich.org/page/quality-guidelines"],
  ["FDA, Control of Nitrosamine", "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/control-nitrosamine-impurities-human-drugs"],
  ["FDA, Estimating the Maximum Safe Starting Dose", "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/estimating-maximum-safe-starting-dose-initial-clinical-trials-therapeutics-adult-healthy-volunteers"],
  ["FDA, Dissolution Testing", "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/dissolution-testing-immediate-release-solid-oral-dosage-forms"],
  ["EMA, Guideline on the Investigation of Bioequivalence", "https://www.ema.europa.eu/en/investigation-bioequivalence"],
  ["EMA, Guideline on setting health-based", "https://www.ema.europa.eu/en/setting-health-based-exposure-limits-use-risk-identification-manufacture-different-medicinal-products-shared-facilities-scientific-guideline"],
  ["EMA, Q&A on nitrosamine", "https://www.ema.europa.eu/en/nitrosamine-impurities-guidance-marketing-authorisation-holders"],
  ["ISO 11138-1", "https://www.iso.org/standard/66442.html"],
  ["21 CFR 211.103", "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-F/section-211.103"],
  ["EU GMP", "https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en"],
  ["FDA, Process Validation", "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/process-validation-general-principles-and-practices"],
  ["Pharmaceutical Excipients", "https://www.pharmaceuticalpress.com/content/pharmaceutical-excipients/"],
  ["Mosteller", "https://doi.org/10.1056/NEJM198710223171717"],
  ["DuBois", "https://doi.org/10.1001/archinte.1916.00080130010002"],
  ["Haycock", "https://doi.org/10.1016/S0022-3476(78)80601-5"],
  ["WHO BMI", "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"],
  ["Cockcroft & Gault", "https://doi.org/10.1159/000180580"],
  ["Inker et al.", "https://doi.org/10.1056/NEJMoa2102953"],
  ["KDIGO", "https://doi.org/10.1016/j.kint.2023.10.018"],
];

/** Link to the official page of a reference, when there is one (books have none). */
export const refUrl = (ref: string): string | undefined => refLinks.find(([prefix]) => ref.startsWith(prefix))?.[1];

export const referencesAccess = bi(
  "Each reference links to its official page; USP–NF, BP and Ph. Eur. texts need a subscription.",
  "هر مرجع به صفحه رسمی آن لینک شده است؛ متن کامل USP–NF، BP و فارماکوپه اروپا نیاز به اشتراک دارد.",
);
