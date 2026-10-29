import { bi, type Bi } from "@/i18n/bi";

/*
 * Bioequivalence (BE) reference page under Regulatory Affairs. Criteria are
 * taken from ICH M13A, ICH M9, the EMA bioequivalence guideline, FDA
 * guidances and WHO TRS 1003; the explanations are PharmaVault's own.
 * Persian strings are plain text: the page isolates Latin and numeric runs.
 */

type Card = { k: string; v: Bi; f?: string };

export const be = {
  title: bi("Bioequivalence (BE)", "مطالعات Bioequivalence (هم‌ارزی زیستی)"),
  lead: bi(
    "Study design, pharmacokinetic parameters, statistical analysis and acceptance limits for generic medicines; highly variable and narrow therapeutic index drugs, BCS-based biowaivers and additional strengths, with sample-size and confidence-interval calculators.",
    "طراحی مطالعه، پارامترهای فارماکوکینتیک، تحلیل آماری و حدود پذیرش برای داروهای ژنریک؛ داروهای با تغییرپذیری بالا و شاخص درمانی باریک، Biowaiver بر پایه BCS و قدرت‌های اضافی، همراه با ماشین‌حساب حجم نمونه و فاصله اطمینان.",
  ),
  back: bi("Regulatory Affairs", "امور رگولاتوری"),
  note: bi(
    "Summarised from ICH M13A (2024), ICH M9 (2019), the EMA Guideline on the Investigation of Bioequivalence, FDA guidances and WHO TRS 1003. For products registered in Iran, follow the current Iran FDA bioequivalence requirements and its list of reference products.",
    "خلاصه‌شده از ICH M13A (2024)، ICH M9 (2019)، راهنمای EMA درباره بررسی Bioequivalence، راهنماهای FDA و WHO TRS 1003. برای فرآورده‌هایی که در ایران ثبت می‌شوند، الزامات جاری سازمان غذا و دارو درباره مطالعات BE و فهرست فرآورده‌های مرجع آن ملاک است.",
  ),

  // ---------- Concepts ----------
  conceptsTitle: bi("Key concepts", "مفاهیم پایه"),
  concepts: [
    { k: "Bioavailability (BA)", v: bi("The rate and extent to which the active substance is absorbed from a dosage form and becomes available at the site of action, measured in practice in the systemic circulation.", "سرعت و میزان جذب ماده مؤثره از شکل دارویی و در دسترس قرار گرفتن آن در محل اثر؛ در عمل در گردش خون سیستمیک اندازه‌گیری می‌شود.") },
    { k: "Bioequivalence (BE)", v: bi("Two pharmaceutically equivalent or alternative products whose rate and extent of absorption, after administration of the same molar dose under similar conditions, lie within predefined limits, so their efficacy and safety can be assumed to be essentially the same.", "دو فرآورده Pharmaceutical equivalent یا Pharmaceutical alternative که سرعت و میزان جذب آن‌ها پس از تجویز دوز مولی یکسان در شرایط مشابه، در حدود از پیش تعیین‌شده قرار دارد؛ بنابراین اثربخشی و ایمنی آن‌ها اساساً یکسان فرض می‌شود.") },
    { k: "Pharmaceutical equivalence", v: bi("Same amount of the same active substance in the same dosage form, meeting the same or comparable standards. Excipients and manufacturing may differ.", "مقدار یکسان از همان ماده مؤثره در همان شکل دارویی، با استانداردهای یکسان یا قابل مقایسه. Excipientها و روش ساخت ممکن است متفاوت باشند.") },
    { k: "Reference product", v: bi("The innovator (comparator) product authorised on the basis of a full dossier, against which the generic is compared; the reference must be sourced as the authority specifies.", "فرآورده Innovator یا مقایسه‌گر که با پرونده کامل مجوز گرفته و ژنریک با آن مقایسه می‌شود؛ منبع تهیه فرآورده مرجع باید مطابق تعیین مرجع رگولاتوری باشد.") },
    { k: "Therapeutic equivalence", v: bi("Pharmaceutical equivalence plus bioequivalence: the products can be substituted (e.g. an \"AB\" rating in the FDA Orange Book).", "Pharmaceutical equivalence به‌علاوه Bioequivalence: فرآورده‌ها قابل جایگزینی هستند (مانند کد AB در Orange Book سازمان FDA).") },
    { k: "Biowaiver", v: bi("Approval of bioequivalence without an in vivo study, based on BCS class, comparative dissolution and composition (ICH M9), or for additional strengths.", "پذیرش Bioequivalence بدون مطالعه In vivo، بر پایه طبقه BCS، انحلال مقایسه‌ای و ترکیب فرمولاسیون (ICH M9)، یا برای قدرت‌های اضافی.") },
  ] as Card[],

  // ---------- Design ----------
  designTitle: bi("Study design (ICH M13A)", "طراحی مطالعه (ICH M13A)"),
  design: [
    bi("Standard design: randomised, single-dose, two-period, two-sequence (2×2) crossover in healthy volunteers, with test (T) and reference (R) given in random order.", "طرح استاندارد: Crossover تصادفی، تک‌دوز، دو دوره‌ای و دو توالی (2×2) در داوطلبان سالم؛ فرآورده آزمون (T) و مرجع (R) به ترتیب تصادفی تجویز می‌شوند."),
    bi("Washout between periods of at least 5 elimination half-lives. A subject whose pre-dose concentration exceeds 5% of their Cmax in that period is excluded from the analysis.", "Washout میان دو دوره دست‌کم 5 برابر نیمه‌عمر حذف. داوطلبی که غلظت پیش از دوز او در یک دوره بیش از 5% Cmax همان دوره باشد، از تحلیل حذف می‌شود."),
    bi("At least 12 evaluable subjects; the number is set from a sample-size calculation with the expected within-subject CV and T/R ratio, plus allowance for dropouts.", "دست‌کم 12 داوطلب قابل ارزیابی؛ تعداد با محاسبه حجم نمونه بر پایه CV درون‌فردی و نسبت T/R مورد انتظار، به‌علاوه درصدی برای ریزش، تعیین می‌شود."),
    bi("Fasting conditions as standard. A fed study is also needed when the label recommends intake with food; for modified-release products both fasting and fed studies are generally required.", "شرایط ناشتا حالت استاندارد است. اگر برچسب مصرف همراه غذا را توصیه کند، مطالعه Fed نیز لازم است؛ برای فرآورده‌های Modified-release معمولاً هر دو مطالعه ناشتا و Fed لازم است."),
    bi("Parallel design for drugs with a very long half-life, where a crossover is impractical; sampling may then be truncated at 72 h.", "طرح Parallel برای داروهایی با نیمه‌عمر بسیار طولانی که Crossover برای آن‌ها عملی نیست؛ در این حالت نمونه‌برداری می‌تواند در 72 h قطع شود (AUC0–72h)."),
    bi("Replicate designs (partial: TRR/RTR/RRT, or full: TRTR/RTRT) when the reference variability must be estimated, for highly variable drugs or NTI drugs under FDA.", "طرح Replicate (Partial مانند TRR/RTR/RRT یا Full مانند TRTR/RTRT) وقتی تغییرپذیری فرآورده مرجع باید برآورد شود؛ برای داروهای HVD یا NTI طبق FDA."),
    bi("Usually the highest strength is studied; the parent compound is the analyte of choice, and the bioanalytical method is validated per ICH M10.", "معمولاً بالاترین قدرت مطالعه می‌شود؛ آنالیت ترجیحی ترکیب مادر (Parent drug) است و روش Bioanalytical طبق ICH M10 Validate می‌شود."),
    bi("Sampling dense around the expected Tmax so Cmax is captured, with at least 3–4 samples in the terminal log-linear phase; AUC0–t should cover at least 80% of AUC0–∞.", "نمونه‌برداری متراکم در اطراف Tmax مورد انتظار برای ثبت درست Cmax، و دست‌کم 3 تا 4 نمونه در فاز انتهایی Log-linear؛ AUC0–t باید دست‌کم 80% AUC0–∞ را پوشش دهد."),
  ],

  // ---------- PK parameters ----------
  pkTitle: bi("Pharmacokinetic parameters", "پارامترهای فارماکوکینتیک"),
  pkCols: [bi("Parameter", "پارامتر"), bi("Meaning", "مفهوم"), bi("Role in the BE decision", "نقش در تصمیم BE")],
  pk: [
    ["AUC0–t", bi("Area under the concentration–time curve to the last measurable concentration (linear-up/log-down trapezoidal rule).", "سطح زیر منحنی غلظت-زمان تا آخرین غلظت قابل اندازه‌گیری (قاعده Trapezoidal، Linear-up/Log-down)."), bi("Primary: extent of absorption.", "اصلی: میزان جذب.")],
    ["AUC0–∞", bi("AUC0–t plus the extrapolated area Clast/λz.", "AUC0–t به‌علاوه سطح برون‌یابی‌شده Clast/λz."), bi("Supportive; extrapolated part should be ≤ 20%.", "پشتیبان؛ سهم برون‌یابی بهتر است ≤ 20% باشد.")],
    ["Cmax", bi("Highest observed concentration.", "بیشترین غلظت مشاهده‌شده."), bi("Primary: rate of absorption.", "اصلی: سرعت جذب.")],
    ["Tmax", bi("Time of Cmax.", "زمان رسیدن به Cmax."), bi("Descriptive; tested non-parametrically only when clinically relevant (e.g. rapid onset).", "توصیفی؛ فقط وقتی از نظر بالینی مهم است (مانند شروع اثر سریع) با روش Non-parametric مقایسه می‌شود.")],
    ["λz · t½", bi("Terminal elimination rate constant from log-linear regression; t½ = ln 2 / λz.", "ثابت سرعت حذف انتهایی از رگرسیون Log-linear؛ t½ = ln 2 / λz."), bi("Needed for AUC0–∞ and to plan the washout.", "برای محاسبه AUC0–∞ و برنامه‌ریزی Washout لازم است.")],
    ["Cmax,ss · AUCτ", bi("Steady-state parameters in multiple-dose studies.", "پارامترهای حالت پایدار در مطالعات چنددوزی."), bi("Only when a steady-state study is justified.", "فقط وقتی مطالعه حالت پایدار توجیه داشته باشد.")],
  ] as [string, Bi, Bi][],

  // ---------- Statistics ----------
  statsTitle: bi("Statistical analysis: average bioequivalence", "تحلیل آماری: Average bioequivalence"),
  stats: [
    { title: bi("Log-transform", "تبدیل لگاریتمی"), text: bi("AUC and Cmax are log-transformed (natural log) because PK parameters are log-normally distributed and the effects are multiplicative.", "AUC و Cmax با لگاریتم طبیعی تبدیل می‌شوند، چون پارامترهای PK توزیع Log-normal دارند و اثرها ضربی‌اند.") },
    { title: bi("ANOVA", "ANOVA"), text: bi("Model with sequence, subject (nested in sequence), period and formulation as factors; the residual mean square (MSE) gives the within-subject variability.", "مدل با عوامل Sequence، Subject (درون Sequence)، Period و Formulation؛ میانگین مربعات باقیمانده (MSE) تغییرپذیری درون‌فردی را می‌دهد.") },
    { title: bi("90% CI of T/R", "فاصله اطمینان 90% نسبت T/R"), text: bi("The difference of least-squares means and its 90% CI are back-transformed to the geometric mean ratio (GMR) and its CI, in percent.", "تفاوت میانگین‌های Least-squares و فاصله اطمینان 90% آن به نسبت میانگین هندسی (GMR) و فاصله اطمینان آن، بر حسب درصد، برگردانده می‌شود.") },
    { title: bi("TOST decision", "تصمیم با TOST"), text: bi("A 90% CI fully inside the limits is equivalent to two one-sided tests at α = 0.05 each. Standard limits: 80.00–125.00% for AUC and Cmax, with the CI rounded to two decimals.", "قرار گرفتن کامل فاصله اطمینان 90% در حدود، معادل دو آزمون یک‌طرفه با α = 0.05 برای هر طرف است. حدود استاندارد: 80.00 تا 125.00% برای AUC و Cmax، با گرد کردن حدود فاصله اطمینان تا دو رقم اعشار.") },
  ],
  formulas: [
    { k: "Within-subject CV", f: "CVw = √(e^MSE − 1)", v: bi("MSE = residual mean square of the ANOVA on log-transformed data.", "MSE میانگین مربعات باقیمانده ANOVA روی داده‌های لگاریتمی است.") },
    { k: "90% CI (2×2, n subjects)", f: "exp[ln(GMR) ± t(0.95, n−2) × √(2·MSE / n)]", v: bi("For a balanced 2×2 crossover; with unequal sequences the standard error uses (1/n1 + 1/n2)·MSE/2.", "برای Crossover متعادل 2×2؛ با توالی‌های نابرابر، خطای استاندارد از (1/n1 + 1/n2)·MSE/2 به دست می‌آید.") },
    { k: "Acceptance limits", f: "ln(0.80) = −0.2231 · ln(1.25) = +0.2231", v: bi("The limits are symmetric on the log scale, which is why the upper limit is 125% and not 120%.", "حدود در مقیاس لگاریتمی متقارن‌اند؛ به همین دلیل حد بالا 125% است و نه 120%.") },
  ] as Card[],

  // ---------- Acceptance by case ----------
  accTitle: bi("Acceptance limits by case", "حدود پذیرش در حالت‌های مختلف"),
  accCols: [bi("Case", "حالت"), bi("Authority", "مرجع"), bi("Acceptance criterion", "معیار پذیرش")],
  acc: [
    [bi("Standard drugs", "داروهای معمول"), "ICH M13A · EMA · FDA · WHO", bi("90% CI of GMR for AUC and Cmax within 80.00–125.00%.", "فاصله اطمینان 90% GMR برای AUC و Cmax در محدوده 80.00 تا 125.00%.")],
    [bi("Narrow therapeutic index (NTI)", "شاخص درمانی باریک (NTI)"), "EMA", bi("AUC within 90.00–111.11%; also Cmax where it is of particular importance for safety, efficacy or monitoring (case by case).", "AUC در محدوده 90.00 تا 111.11%؛ Cmax نیز وقتی برای ایمنی، اثربخشی یا پایش دارو اهمیت ویژه دارد (موردی).")],
    [bi("Narrow therapeutic index (NTI)", "شاخص درمانی باریک (NTI)"), "FDA", bi("Fully replicated 4-period design; reference-scaled limits that tighten with σWR, plus the unscaled 80.00–125.00% limits, and the upper 90% bound of σWT/σWR ≤ 2.5 (e.g. warfarin, levothyroxine product-specific guidances).", "طرح Full replicate چهار دوره‌ای؛ حدود Reference-scaled که با σWR تنگ‌تر می‌شوند، همراه با حدود 80.00 تا 125.00% و حد بالای 90% نسبت σWT/σWR ≤ 2.5 (مانند راهنماهای اختصاصی Warfarin و Levothyroxine).")],
    [bi("Highly variable drug (CVwR > 30%)", "داروی با تغییرپذیری بالا (CVwR > 30%)"), "EMA · WHO", bi("ABEL for Cmax only: limits widened to exp(±0.760·sWR), at most 69.84–143.19% (CVwR = 50%); GMR within 80.00–125.00%; replicate design and clinical justification required.", "روش ABEL فقط برای Cmax: گسترش حدود تا exp(±0.760·sWR)، حداکثر 69.84 تا 143.19% (در CVwR = 50%)؛ GMR در محدوده 80.00 تا 125.00%؛ طرح Replicate و توجیه بالینی لازم است.")],
    [bi("Highly variable drug (sWR ≥ 0.294)", "داروی با تغییرپذیری بالا (sWR ≥ 0.294)"), "FDA", bi("RSABE for AUC and Cmax: (μT − μR)² − θ·s²WR ≤ 0, θ = (ln 1.25 / 0.25)²; point estimate within 80.00–125.00%; replicate design.", "روش RSABE برای AUC و Cmax: (μT − μR)² − θ·s²WR ≤ 0 با θ = (ln 1.25 / 0.25)²؛ برآورد نقطه‌ای در محدوده 80.00 تا 125.00%؛ طرح Replicate.")],
    [bi("Long half-life (> 72 h)", "نیمه‌عمر طولانی (بیش از 72 h)"), "ICH M13A · EMA", bi("Crossover or parallel design with AUC truncated at 72 h; Cmax and AUC0–72h within 80.00–125.00%.", "طرح Crossover یا Parallel با AUC قطع‌شده در 72 h؛ Cmax و AUC0–72h در محدوده 80.00 تا 125.00%.")],
    [bi("Endogenous substances", "مواد درون‌زا"), "EMA · FDA", bi("Baseline correction of concentrations (subtracting the pre-dose level) defined in the protocol.", "تصحیح Baseline غلظت‌ها (کسر سطح پیش از دوز) طبق روشی که در پروتکل تعریف شده است.")],
  ] as [Bi, string, Bi][],

  // ---------- Biowaiver ----------
  bcsTitle: bi("BCS-based biowaiver (ICH M9)", "Biowaiver بر پایه BCS (ICH M9)"),
  bcsCols: [bi("BCS class", "طبقه BCS"), bi("Solubility · permeability", "انحلال‌پذیری · نفوذپذیری"), bi("Biowaiver condition", "شرط Biowaiver")],
  bcs: [
    ["Class I", bi("High · high", "بالا · بالا"), bi("Very rapid (≥ 85% in 15 min) or rapid (≥ 85% in 30 min) dissolution of test and reference at pH 1.2, 4.5 and 6.8; when rapid, profiles similar by f2 ≥ 50.", "انحلال بسیار سریع (≥ 85% در 15 min) یا سریع (≥ 85% در 30 min) آزمون و مرجع در pH 1.2، 4.5 و 6.8؛ در حالت سریع، شباهت پروفایل با f2 ≥ 50.")],
    ["Class III", bi("High · low", "بالا · پایین"), bi("Very rapid dissolution (≥ 85% in 15 min) of both products in all three media; excipients qualitatively the same and quantitatively very similar.", "انحلال بسیار سریع (≥ 85% در 15 min) هر دو فرآورده در هر سه محیط؛ Excipientها از نظر کیفی یکسان و از نظر کمی بسیار مشابه.")],
    ["Class II · IV", bi("Low solubility", "انحلال‌پذیری پایین"), bi("Not eligible for a BCS-based biowaiver; an in vivo BE study is required.", "واجد شرایط Biowaiver بر پایه BCS نیستند؛ مطالعه BE در بدن لازم است.")],
  ] as [string, Bi, Bi][],
  bcsNotes: [
    bi("High solubility: the highest single therapeutic dose dissolves in 250 mL or less of aqueous media over pH 1.2–6.8 at 37 ± 1 °C.", "انحلال‌پذیری بالا: بیشترین دوز درمانی منفرد در 250 mL یا کمتر از محیط آبی در محدوده pH 1.2 تا 6.8 و دمای 37 ± 1 °C حل شود."),
    bi("High permeability: absolute bioavailability ≥ 85%, or ≥ 85% of the dose recovered in urine as parent and metabolites (mass balance); validated Caco-2 data can support it.", "نفوذپذیری بالا: Absolute bioavailability ≥ 85% یا بازیابی ≥ 85% دوز در ادرار به‌صورت ترکیب مادر و متابولیت‌ها (Mass balance)؛ داده Caco-2 معتبر می‌تواند پشتیبان باشد."),
    bi("Dissolution test: Paddle at 50 rpm or Basket at 100 rpm, 900 mL or less, 37 ± 1 °C, at least 12 units of each product, no surfactant in the media.", "آزمون انحلال: Paddle با 50 rpm یا Basket با 100 rpm، حجم 900 mL یا کمتر، 37 ± 1 °C، دست‌کم 12 واحد از هر فرآورده، بدون Surfactant در محیط."),
    bi("Excluded: NTI drugs, products for absorption in the oral cavity (sublingual, buccal), and excipients that may affect absorption (e.g. sorbitol, mannitol, surfactants) unless their amounts are justified.", "مستثنی: داروهای NTI، فرآورده‌های جذب در حفره دهان (Sublingual و Buccal)، و Excipientهایی که ممکن است بر جذب اثر بگذارند (مانند Sorbitol، Mannitol و Surfactantها) مگر با توجیه مقدار."),
    bi("Fixed-dose combinations qualify only when every active substance meets the BCS criteria.", "ترکیب‌های ثابت (FDC) فقط وقتی واجد شرایط‌اند که همه مواد مؤثره معیارهای BCS را داشته باشند."),
  ],

  strengthsTitle: bi("Waiver for additional strengths", "Waiver برای قدرت‌های اضافی"),
  strengths: [
    bi("Same manufacturer and manufacturing process for all strengths.", "تولیدکننده و فرایند ساخت یکسان برای همه قدرت‌ها."),
    bi("Qualitatively the same composition; quantitatively proportional (or justified small differences in coating, capsule shell, colour or flavour).", "ترکیب کیفی یکسان و از نظر کمی متناسب (یا تفاوت‌های جزئی توجیه‌شده در پوشش، پوسته کپسول، رنگ یا طعم)."),
    bi("Linear pharmacokinetics over the strength range; when not linear, the strength most sensitive to differences is studied.", "فارماکوکینتیک خطی در محدوده قدرت‌ها؛ در غیر این صورت، قدرتی که به تفاوت‌ها حساس‌تر است مطالعه می‌شود."),
    bi("Comparative dissolution profiles of each additional strength against the biobatch strength are similar (f2 ≥ 50, or ≥ 85% in 15 min).", "پروفایل انحلال مقایسه‌ای هر قدرت اضافی با قدرت Biobatch مشابه است (f2 ≥ 50 یا ≥ 85% در 15 min)."),
  ],

  // ---------- Sample size ----------
  sizeTitle: bi("Sample size for a 2×2 crossover", "حجم نمونه در طرح Crossover 2×2"),
  sizeLead: bi(
    "Total number of subjects (excluding dropouts) for TOST at α = 0.05 and limits 80.00–125.00%, by within-subject CV and expected T/R ratio. Computed with the non-central t method; the minimum of 12 subjects applies.",
    "تعداد کل داوطلبان (بدون احتساب ریزش) برای TOST با α = 0.05 و حدود 80.00 تا 125.00%، بر حسب CV درون‌فردی و نسبت T/R مورد انتظار. محاسبه با روش Non-central t؛ حداقل 12 داوطلب رعایت شده است.",
  ),
  sizeCv: bi("CVw", "CVw"),
  sizePower: bi("Power", "توان آزمون"),

  calcTitle: bi("BE calculators", "ماشین‌حساب‌های BE"),
  calc: {
    ciTitle: bi("90% confidence interval", "فاصله اطمینان 90%"),
    ciLead: bi("From the GMR, within-subject CV and number of subjects of a balanced 2×2 crossover.", "از GMR، CV درون‌فردی و تعداد داوطلبان یک Crossover متعادل 2×2."),
    nTitle: bi("Sample size", "حجم نمونه"),
    nLead: bi("Smallest even total n reaching the target power (TOST, α = 0.05).", "کوچک‌ترین n زوج که به توان هدف می‌رسد (TOST، α = 0.05)."),
    gmr: bi("T/R ratio (GMR, %)", "نسبت T/R (GMR، %)"),
    cv: bi("Within-subject CV (%)", "CV درون‌فردی (%)"),
    n: bi("Subjects (n)", "تعداد داوطلبان (n)"),
    power: bi("Target power (%)", "توان هدف (%)"),
    dropout: bi("Expected dropouts (%)", "ریزش مورد انتظار (%)"),
    ci: bi("90% CI", "فاصله اطمینان 90%"),
    pass: bi("Within 80.00–125.00%", "در محدوده 80.00 تا 125.00%"),
    fail: bi("Outside 80.00–125.00%", "خارج از محدوده 80.00 تا 125.00%"),
    result: bi("Subjects to complete", "داوطلبان لازم برای تکمیل مطالعه"),
    enrol: bi("Subjects to enrol", "داوطلبان برای ثبت‌نام"),
    achieved: bi("Achieved power", "توان به‌دست‌آمده"),
    invalid: bi("The ratio must lie inside 80–125%.", "نسبت باید داخل محدوده 80 تا 125% باشد."),
    abel: bi("EMA widened limits for Cmax (ABEL)", "حدود گسترده‌شده EMA برای Cmax (ABEL)"),
    abelLead: bi("For a highly variable reference (CVwR from a replicate study).", "برای فرآورده مرجع با تغییرپذیری بالا (CVwR از مطالعه Replicate)."),
    cvwr: bi("CVwR (%)", "CVwR (%)"),
    limits: bi("Acceptance limits", "حدود پذیرش"),
    disclaimer: bi(
      "For planning and education. Final sample size and analysis must come from validated software (e.g. PowerTOST, Phoenix WinNonlin, SAS) and the approved protocol.",
      "برای برنامه‌ریزی و آموزش. حجم نمونه و تحلیل نهایی باید با نرم‌افزار Validate‌شده (مانند PowerTOST، Phoenix WinNonlin یا SAS) و طبق پروتکل تأییدشده انجام شود.",
    ),
  },

  // ---------- Checklist ----------
  checklistTitle: bi("Protocol and report checklist", "چک‌لیست پروتکل و گزارش"),
  checklist: [
    bi("Justification of the reference product, its batch, origin and assay (test and reference assay should not differ by more than 5%).", "توجیه فرآورده مرجع، شماره بچ، منبع تهیه و Assay آن (تفاوت Assay آزمون و مرجع بهتر است بیش از 5% نباشد)."),
    bi("Test batch at least 1/10 of production scale or 100,000 units, whichever is greater, made by the commercial process (EMA).", "بچ آزمون دست‌کم 1/10 مقیاس تولید یا 100000 واحد (هر کدام بیشتر)، ساخته‌شده با فرایند تجاری (EMA)."),
    bi("Ethics committee approval, informed consent, GCP (ICH E6) and inclusion/exclusion criteria.", "تأیید کمیته اخلاق، رضایت آگاهانه، رعایت GCP (ICH E6) و معیارهای ورود و خروج."),
    bi("Sample-size calculation, randomisation, washout, sampling schedule and standardised meals, fluid intake and posture.", "محاسبه حجم نمونه، تصادفی‌سازی، Washout، برنامه نمونه‌برداری و استانداردسازی وعده‌ها، مصرف مایعات و وضعیت بدن."),
    bi("Bioanalytical method validation and incurred sample reanalysis (ISR) per ICH M10.", "Validation روش Bioanalytical و Incurred sample reanalysis (ISR) طبق ICH M10."),
    bi("Statistical analysis plan fixed before unblinding: model, handling of outliers and dropouts, and no post-hoc exclusion for PK reasons alone.", "طرح تحلیل آماری پیش از بازگشایی کور تعیین شود: مدل، نحوه برخورد با داده‌های پرت و ریزش، و عدم حذف پسینی داوطلب فقط به دلایل PK."),
    bi("Retention samples of test and reference kept as the authority requires.", "نگهداری نمونه‌های نگهداری آزمون و مرجع طبق الزام مرجع رگولاتوری."),
    bi("Report with individual concentrations, PK parameters, ANOVA, 90% CIs, protocol deviations and adverse events; filed in CTD 5.3.1.2.", "گزارش شامل غلظت‌های فردی، پارامترهای PK، ANOVA، فاصله‌های اطمینان 90%، انحراف‌های پروتکل و عوارض ناخواسته؛ در CTD 5.3.1.2 ارائه می‌شود."),
  ],

  // ---------- Glossary ----------
  glossaryTitle: bi("Glossary", "واژه‌نامه"),
  glossary: [
    { k: "GMR", v: bi("Geometric mean ratio of test to reference.", "نسبت میانگین هندسی آزمون به مرجع.") },
    { k: "TOST", v: bi("Two one-sided tests; equivalent to a 90% CI inside the limits.", "دو آزمون یک‌طرفه؛ معادل قرار گرفتن فاصله اطمینان 90% در حدود.") },
    { k: "CVw · CVwR", v: bi("Within-subject coefficient of variation; CVwR is that of the reference, from a replicate design.", "ضریب تغییرات درون‌فردی؛ CVwR مربوط به فرآورده مرجع و از طرح Replicate است.") },
    { k: "ABEL", v: bi("Average bioequivalence with expanding limits (EMA, WHO).", "Average bioequivalence با حدود گسترده‌شونده (EMA و WHO).") },
    { k: "RSABE", v: bi("Reference-scaled average bioequivalence (FDA).", "Average bioequivalence با مقیاس فرآورده مرجع (FDA).") },
    { k: "Carry-over", v: bi("Residual effect of the first period in the second; prevented by an adequate washout.", "اثر باقیمانده دوره اول در دوره دوم؛ با Washout کافی پیشگیری می‌شود.") },
    { k: "Biobatch", v: bi("The test batch used in the pivotal BE study.", "بچ آزمونی که در مطالعه BE اصلی استفاده شده است.") },
    { k: "ISR", v: bi("Incurred sample reanalysis: repeat analysis of study samples to confirm reproducibility.", "تکرار آنالیز نمونه‌های واقعی مطالعه برای تأیید تکرارپذیری روش.") },
  ] as Card[],

  refsTitle: bi("References", "مراجع"),
  refs: [
    "ICH M13A: Bioequivalence for Immediate-Release Solid Oral Dosage Forms (2024).",
    "ICH M9: Biopharmaceutics Classification System-Based Biowaivers (2019).",
    "ICH M10: Bioanalytical Method Validation and Study Sample Analysis (2022).",
    "EMA CPMP/EWP/QWP/1401/98 Rev. 1/Corr**: Guideline on the Investigation of Bioequivalence (2010).",
    "EMA/CPMP/EWP/280/96 Corr1: Guideline on the pharmacokinetic and clinical evaluation of modified release dosage forms (2014).",
    "FDA Guidance: Statistical Approaches to Establishing Bioequivalence (2001; revised draft 2022).",
    "FDA Guidance: Bioequivalence Studies With Pharmacokinetic Endpoints for Drugs Submitted Under an ANDA (draft 2021).",
    "FDA Draft Guidance on Warfarin Sodium (product-specific, NTI approach).",
    "WHO TRS 1003, Annex 6: Multisource (generic) pharmaceutical products: guidelines on registration requirements to establish interchangeability (2017).",
    "Schütz H. et al. PowerTOST: Power and Sample Size for (Bio)Equivalence Studies, R package.",
  ],
};
