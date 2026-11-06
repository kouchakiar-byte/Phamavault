import { bi, type Bi } from "@/i18n/bi";

/*
 * Job-interview questions for QC and QA posts in the pharmaceutical industry, with model
 * answers. PharmaVault's own wording; each answer names the guideline it rests on.
 * The first FREE_PER_AREA questions of each area are open to everyone.
 */

export type InterviewArea = "qc" | "qa";
export type InterviewLevel = "basic" | "mid" | "advanced";

export type InterviewQuestion = { id: string; area: InterviewArea; level: InterviewLevel; q: Bi; a: Bi; refs?: string };

export const FREE_PER_AREA = 3;

export const interviewCopy = {
  title: bi("QC and QA interview questions", "سؤال‌های مصاحبه استخدامی QC و QA"),
  lead: bi(
    "60 questions that come up in interviews for quality control and quality assurance posts, with model answers and the guideline behind each. 6 are open to everyone.",
    "60 سؤال پرتکرار مصاحبه‌های استخدامی واحدهای کنترل کیفیت و تضمین کیفیت، با پاسخ نمونه و رهنمودی که هر پاسخ بر آن استوار است. 6 سؤال برای همه باز است.",
  ),
  areas: { qc: bi("Quality control (QC)", "کنترل کیفیت (QC)"), qa: bi("Quality assurance (QA)", "تضمین کیفیت (QA)") } satisfies Record<InterviewArea, Bi>,
  levels: { basic: bi("Basic", "پایه"), mid: bi("Intermediate", "متوسط"), advanced: bi("Advanced", "پیشرفته") } satisfies Record<InterviewLevel, Bi>,
  free: bi("Free", "رایگان"),
  /** The header link and the menu banner. */
  navShort: bi("Interview questions", "سؤال‌های مصاحبه"),
  navTiny: bi("Interviews", "مصاحبه"),
  navBanner: bi("60 interview questions for QC and QA posts, with model answers", "60 سؤال مصاحبه استخدامی QC و QA با پاسخ نمونه"),
  navBadge: bi("6 free", "6 سؤال رایگان"),
  answer: bi("Model answer", "پاسخ نمونه"),
  refs: bi("Based on", "مرجع"),
  lockedTitle: bi("The other 54 answers are for subscribers", "54 پاسخ دیگر ویژه مشترکین است"),
  lockedText: bi(
    "Every question is listed; the model answers open with a subscription, or on your 2 free days each month after signing up.",
    "همه سؤال‌ها فهرست شده‌اند؛ پاسخ‌های نمونه با اشتراک، یا پس از ثبت‌نام در 2 روز رایگان هر ماه، باز می‌شوند.",
  ),
  lockedAnswer: bi("Answer for subscribers", "پاسخ ویژه مشترکین"),
  tip: bi(
    "In an interview, give the principle first, then one example from your own work, then the guideline it comes from.",
    "در مصاحبه، اول اصل موضوع را بگویید، بعد یک مثال از تجربه کاری خودتان، و در پایان رهنمودی که موضوع از آن آمده است.",
  ),
};

const qc = (id: string, level: InterviewLevel, q: Bi, a: Bi, refs?: string): InterviewQuestion => ({ id, area: "qc", level, q, a, refs });
const qa = (id: string, level: InterviewLevel, q: Bi, a: Bi, refs?: string): InterviewQuestion => ({ id, area: "qa", level, q, a, refs });

export const interviewQuestions: InterviewQuestion[] = [
  // ---------------- QC ----------------
  qc(
    "sst",
    "basic",
    bi("What is HPLC system suitability and which parameters does it check?", "System suitability در HPLC چیست و چه پارامترهایی را بررسی می‌کند؟"),
    bi(
      "It shows, before and during the analysis, that the whole system (instrument, column, mobile phase and analyst) performs well enough for this method on this day. Typical parameters are the %RSD of replicate standard injections, resolution between critical peaks, tailing factor and plate count; their limits come from the method and the pharmacopoeia. If system suitability fails, no sample result from that run is reported.",
      "System suitability نشان می‌دهد کل سیستم، شامل دستگاه، ستون، فاز متحرک و آنالیست، در همان روز برای این Method به اندازه کافی خوب کار می‌کند. پارامترهای معمول عبارت‌اند از %RSD تزریق‌های تکراری Standard، Resolution بین پیک‌های بحرانی، Tailing factor و Plate count. حدود آن‌ها را Method و فارماکوپه تعیین می‌کنند. اگر System suitability رد شود، هیچ نتیجه‌ای از آن Run گزارش نمی‌شود.",
    ),
    "USP <621>, Ph. Eur. 2.2.46",
  ),
  qc(
    "specificity",
    "basic",
    bi("What does specificity mean in method validation, and how do you show it?", "Specificity در صحه‌گذاری روش یعنی چه و چگونه نشان داده می‌شود؟"),
    bi(
      "Specificity is the ability to measure the analyte unequivocally in the presence of what may be there: impurities, degradants, excipients and the matrix. For an assay it is shown with placebo and spiked samples and with forced-degradation samples, proving there is no interference at the analyte peak; peak purity or a second detection technique supports it.",
      "Specificity یعنی توانایی اندازه‌گیری قطعی آنالیت در حضور هر چیزی که ممکن است در نمونه باشد: ناخالصی‌ها، محصولات تخریب، Excipientها و Matrix. برای Assay با Placebo، نمونه‌های Spike‌شده و نمونه‌های Forced degradation نشان داده می‌شود که در محل پیک آنالیت تداخلی وجود ندارد. Peak purity یا یک روش Detection دوم هم آن را تأیید می‌کند.",
    ),
    "ICH Q2(R2)",
  ),
  qc(
    "oos-first",
    "basic",
    bi("You get an OOS result. What do you do first?", "یک نتیجه OOS به دست آمده است. اولین کار شما چیست؟"),
    bi(
      "Report it to the supervisor at once and keep everything: solutions, standards, vials and raw data. Then the Phase I laboratory investigation checks calculations, the standard, instrument and system suitability, and the analyst's steps for an assignable cause. A retest or re-sampling is allowed only within the investigation's procedure; testing again until a passing result appears is not acceptable.",
      "فوراً به سرپرست گزارش می‌دهم و همه چیز را نگه می‌دارم: محلول‌ها، Standardها، ویال‌ها و داده‌های خام. سپس در تحقیق مرحله اول آزمایشگاهی، محاسبات، Standard، دستگاه و System suitability، و مراحل کار آنالیست برای یافتن علت قابل‌انتساب بررسی می‌شوند. آزمون مجدد یا نمونه‌برداری مجدد فقط طبق روش تحقیق مجاز است؛ تکرار آزمون تا رسیدن به نتیجه قبول پذیرفته نیست.",
    ),
    "FDA Guidance: Investigating OOS Test Results (2022)",
  ),
  qc(
    "accuracy-precision",
    "basic",
    bi("What is the difference between accuracy and precision?", "تفاوت Accuracy و Precision چیست؟"),
    bi(
      "Accuracy is how close the result is to the true value, usually shown as recovery of known amounts. Precision is how close repeated results are to each other: repeatability (same conditions, short time), intermediate precision (other days, analysts or instruments in the same lab) and reproducibility (between laboratories). A method can be precise and still inaccurate if it has a bias.",
      "Accuracy میزان نزدیکی نتیجه به مقدار واقعی است و معمولاً با Recovery مقادیر معلوم نشان داده می‌شود. Precision میزان نزدیکی نتایج تکراری به یکدیگر است: Repeatability در شرایط یکسان و زمان کوتاه، Intermediate precision در روزها، آنالیست‌ها یا دستگاه‌های دیگر در همان آزمایشگاه، و Reproducibility بین آزمایشگاه‌ها. یک روش می‌تواند Precise باشد ولی به دلیل Bias دقیق (Accurate) نباشد.",
    ),
    "ICH Q2(R2)",
  ),
  qc(
    "lod-loq",
    "mid",
    bi("How are LOD and LOQ determined?", "LOD و LOQ چگونه تعیین می‌شوند؟"),
    bi(
      "Common approaches are the signal-to-noise ratio (about 3:1 for LOD and 10:1 for LOQ) and the standard deviation of the response with the slope of the calibration line (3.3σ/S and 10σ/S). The LOQ must then be confirmed with samples at that level that meet acceptable precision and accuracy.",
      "روش‌های رایج، نسبت Signal-to-noise (حدود 3:1 برای LOD و 10:1 برای LOQ) و انحراف معیار پاسخ همراه با شیب منحنی کالیبراسیون (3.3σ/S و 10σ/S) هستند. سپس LOQ باید با نمونه‌هایی در همان سطح تأیید شود که Precision و Accuracy قابل‌قبول دارند.",
    ),
    "ICH Q2(R2)",
  ),
  qc(
    "range",
    "mid",
    bi("What range do you validate for an assay, content uniformity and dissolution?", "برای Assay، یکنواختی محتوا و انحلال چه Rangeی صحه‌گذاری می‌شود؟"),
    bi(
      "For an assay of the drug product, typically 80 to 120% of the test concentration; for content uniformity, 70 to 130%; for dissolution, ±20% over the specified range, for example from 20% below the lowest to 20% above the highest specification point. The range must show acceptable linearity, accuracy and precision.",
      "برای Assay فرآورده، معمولاً 80 تا 120% غلظت آزمون؛ برای یکنواختی محتوا، 70 تا 130%؛ و برای انحلال، 20%± روی محدوده Specification، مثلاً از 20% کمتر از پایین‌ترین تا 20% بیشتر از بالاترین حد. در کل Range باید Linearity، Accuracy و Precision قابل‌قبول نشان داده شود.",
    ),
    "ICH Q2(R1/R2)",
  ),
  qc(
    "rrf",
    "mid",
    bi("Why is a relative response factor used for impurities?", "چرا برای ناخالصی‌ها از Relative response factor استفاده می‌شود؟"),
    bi(
      "An impurity often gives a different detector response from the API at the same concentration. When the impurity is quantified against the API standard, the RRF corrects for that difference; without it the impurity is under- or over-estimated. The RRF is established during development and validated, and it belongs to the method.",
      "ناخالصی اغلب در غلظت یکسان، پاسخ Detector متفاوتی نسبت به API دارد. وقتی ناخالصی با Standard ماده مؤثر اندازه‌گیری می‌شود، RRF این اختلاف را اصلاح می‌کند؛ بدون آن، مقدار ناخالصی کمتر یا بیشتر از واقع گزارش می‌شود. RRF در مرحله توسعه تعیین و صحه‌گذاری می‌شود و جزء Method است.",
    ),
    "ICH Q2(R2), Ph. Eur. 2.2.46",
  ),
  qc(
    "robustness",
    "mid",
    bi("What is robustness and when is it studied?", "Robustness چیست و چه زمانی بررسی می‌شود؟"),
    bi(
      "Robustness is the method's ability to stay unaffected by small, deliberate changes in its parameters, such as mobile-phase pH, column temperature, flow rate or organic proportion. It is studied during development, before the validation protocol, and its results set the system suitability limits and the allowed operating ranges.",
      "Robustness توانایی روش در تأثیر نپذیرفتن از تغییرات کوچک و عمدی پارامترهاست؛ مانند pH فاز متحرک، دمای ستون، Flow rate یا درصد جزء آلی. این بررسی در مرحله توسعه و پیش از پروتکل صحه‌گذاری انجام می‌شود و نتایج آن، حدود System suitability و محدوده‌های مجاز کار را تعیین می‌کند.",
    ),
    "ICH Q2(R2), ICH Q14",
  ),
  qc(
    "apparatus",
    "basic",
    bi("When do you use dissolution Apparatus 1 and when Apparatus 2?", "چه زمانی از Apparatus 1 و چه زمانی از Apparatus 2 انحلال استفاده می‌شود؟"),
    bi(
      "Apparatus 2 (Paddle) is the usual choice for tablets. Apparatus 1 (Basket) suits capsules and dosage forms that float or tend to settle into a cone under the Paddle. The choice must be justified by discriminating power, and a change between them needs data and, for a registered product, regulatory approval.",
      "Apparatus 2 (Paddle) انتخاب معمول برای قرص‌هاست. Apparatus 1 (Basket) برای کپسول‌ها و اشکالی مناسب است که شناور می‌شوند یا زیر Paddle دچار Coning می‌شوند. انتخاب باید با قدرت Discriminating توجیه شود و تغییر بین آن‌ها به داده و، برای فرآورده ثبت‌شده، به تأیید مرجع نظارتی نیاز دارد.",
    ),
    "USP <711>, USP <1092>",
  ),
  qc(
    "sink",
    "mid",
    bi("What are sink conditions in dissolution?", "Sink condition در انحلال چیست؟"),
    bi(
      "Sink conditions mean the Medium volume is at least about three times the volume needed to saturate it with the dose, so the concentration reached does not slow dissolution. Without sink conditions, the test measures solubility rather than release; surfactants or a larger volume are used, with justification, when needed.",
      "Sink condition یعنی حجم Medium دست‌کم حدود سه برابر حجمی باشد که برای اشباع شدن با کل دوز لازم است، تا غلظت ایجادشده سرعت انحلال را کم نکند. بدون Sink condition، آزمون به‌جای آزادسازی، حلالیت را اندازه می‌گیرد. در صورت نیاز، با توجیه از Surfactant یا حجم بیشتر استفاده می‌شود.",
    ),
    "USP <1092>",
  ),
  qc(
    "stages",
    "mid",
    bi("Explain the S1, S2 and S3 stages of dissolution for immediate-release products.", "مراحل S1، S2 و S3 انحلال برای فرآورده‌های Immediate-release را توضیح دهید."),
    bi(
      "S1: 6 units, each not less than Q + 5%. S2: 6 more units; the average of 12 is at least Q and no unit is below Q − 15%. S3: 12 more units; the average of 24 is at least Q, not more than 2 units are below Q − 15% and none below Q − 25%. Q is the amount dissolved stated in the monograph, as a percentage of the label claim.",
      "S1: 6 واحد که هر کدام دست‌کم Q + 5% باشند. S2: 6 واحد دیگر؛ میانگین 12 واحد دست‌کم Q و هیچ واحدی کمتر از Q − 15% نباشد. S3: 12 واحد دیگر؛ میانگین 24 واحد دست‌کم Q، حداکثر 2 واحد کمتر از Q − 15% و هیچ واحدی کمتر از Q − 25% نباشد. Q مقدار حل‌شده‌ای است که مونوگراف به‌صورت درصد مقدار اسمی تعیین می‌کند.",
    ),
    "USP <711>",
  ),
  qc(
    "f2",
    "advanced",
    bi("When is the f2 similarity factor valid, and what value shows similarity?", "f2 در چه شرایطی معتبر است و چه مقداری تشابه را نشان می‌دهد؟"),
    bi(
      "f2 between 50 and 100 means the profiles are similar. It is valid with at least 12 units per product, the same time points, no more than one point after 85% dissolved for both, and low variability (CV not more than 20% at the early points and 10% at the others). If both release at least 85% in 15 minutes, the profiles are considered similar without f2.",
      "مقدار f2 بین 50 تا 100 یعنی پروفایل‌ها مشابه‌اند. محاسبه با دست‌کم 12 واحد از هر فرآورده معتبر است، با زمان‌های یکسان، حداکثر یک نقطه پس از 85% انحلال برای هر دو، و تغییرپذیری کم (CV حداکثر 20% در نقاط اولیه و 10% در سایر نقاط). اگر هر دو فرآورده در 15 دقیقه دست‌کم 85% آزاد کنند، بدون محاسبه f2 مشابه تلقی می‌شوند.",
    ),
    "FDA Guidance (1997), EMA BE Guideline",
  ),
  qc(
    "cu-wv",
    "mid",
    bi("When can weight variation replace content uniformity?", "چه زمانی Weight variation می‌تواند جایگزین Content uniformity شود؟"),
    bi(
      "For tablets and capsules where the dose and the proportion of drug are high enough, typically 25 mg or more and 25% or more of the unit by weight; otherwise content uniformity by assay of individual units is required. The chapter's table gives the cases; coated tablets other than film-coated always need content uniformity.",
      "برای قرص‌ها و کپسول‌هایی که دوز و سهم ماده مؤثر به اندازه کافی بالاست؛ معمولاً 25 mg یا بیشتر و 25% یا بیشتر از وزن واحد. در غیر این صورت، Content uniformity با Assay تک‌تک واحدها لازم است. جدول همان فصل حالت‌ها را مشخص می‌کند؛ قرص‌های روکش‌دار، به‌جز روکش فیلمی، همیشه Content uniformity لازم دارند.",
    ),
    "USP <905>",
  ),
  qc(
    "kf",
    "basic",
    bi("Volumetric or coulometric Karl Fischer: how do you choose?", "Karl Fischer حجمی یا کولومتری؛ چگونه انتخاب می‌کنید؟"),
    bi(
      "Coulometric titration generates iodine electrically and suits trace water, roughly ppm levels up to about 1%. Volumetric titration with a titrant of known titer suits higher water contents. Samples that do not dissolve or react with the reagent are tested with a KF oven or with special reagents.",
      "تیتراسیون کولومتری ید را به‌صورت الکتریکی تولید می‌کند و برای آب در مقادیر کم، تقریباً از حد ppm تا حدود 1%، مناسب است. تیتراسیون حجمی با Titrant دارای Titer معلوم برای مقادیر بالاتر آب به کار می‌رود. نمونه‌هایی که حل نمی‌شوند یا با معرف واکنش می‌دهند، با KF oven یا معرف‌های مخصوص آزمایش می‌شوند.",
    ),
    "USP <921>, Ph. Eur. 2.5.12, 2.5.32",
  ),
  qc(
    "standards",
    "basic",
    bi("What is the difference between a primary and a working standard?", "تفاوت Primary standard و Working standard چیست؟"),
    bi(
      "A primary standard is a pharmacopoeial or otherwise officially established reference substance accepted without further comparison. A working (secondary) standard is an in-house batch qualified against the primary one, with a defined assay, retest date and storage, used for routine work to save the primary standard.",
      "Primary standard ماده مرجع فارماکوپه‌ای یا رسمی است که بدون مقایسه بیشتر پذیرفته می‌شود. Working standard (Secondary) یک بچ داخلی است که در برابر Primary standard Qualify شده و Assay، تاریخ Retest و شرایط نگهداری مشخص دارد و برای کار روزمره استفاده می‌شود تا Primary standard حفظ شود.",
    ),
    "USP <11>, WHO TRS 943 Annex 3",
  ),
  qc(
    "forced-deg",
    "mid",
    bi("What is forced degradation for, and how much degradation do you aim for?", "Forced degradation برای چیست و چه میزان تخریب هدف است؟"),
    bi(
      "Stress conditions (acid, base, oxidation, heat, light) reveal the likely degradation pathways and show that the method separates the degradants from the API, which makes it stability-indicating. In practice about 5 to 20% degradation is usually aimed for: enough to see the products, not so much that secondary degradation hides the real pathway.",
      "شرایط Stress (اسید، باز، اکسیداسیون، حرارت و نور) مسیرهای احتمالی تخریب را نشان می‌دهد و ثابت می‌کند روش، محصولات تخریب را از API جدا می‌کند؛ یعنی روش Stability-indicating است. در عمل معمولاً حدود 5 تا 20% تخریب هدف قرار می‌گیرد: به اندازه‌ای که محصولات دیده شوند، ولی نه آن‌قدر که تخریب ثانویه مسیر واقعی را بپوشاند.",
    ),
    "ICH Q1A(R2), ICH Q1B, ICH Q2(R2)",
  ),
  qc(
    "stability-indicating",
    "mid",
    bi("What makes a method stability-indicating?", "چه چیزی یک روش را Stability-indicating می‌کند؟"),
    bi(
      "It must measure the API accurately in the presence of its degradation products and separate and quantify those products. This is shown with forced-degradation samples, resolution between the API and every degradant, peak purity and mass balance between the loss of API and the degradants formed.",
      "روش باید API را در حضور محصولات تخریب به‌درستی اندازه بگیرد و آن محصولات را هم جدا و اندازه‌گیری کند. این موضوع با نمونه‌های Forced degradation، Resolution بین API و همه محصولات تخریب، Peak purity و Mass balance بین کاهش API و محصولات تشکیل‌شده نشان داده می‌شود.",
    ),
    "ICH Q2(R2), ICH Q1A(R2)",
  ),
  qc(
    "peak-purity",
    "advanced",
    bi("What are the limits of PDA peak purity?", "محدودیت‌های Peak purity با PDA چیست؟"),
    bi(
      "PDA purity compares spectra across the peak, so it cannot see a co-eluting compound with a very similar UV spectrum, one present at a very low level, or one with little UV absorbance. A pass therefore supports specificity but does not prove it; mass spectrometry or an orthogonal separation is stronger evidence.",
      "Peak purity با PDA طیف‌ها را در طول پیک مقایسه می‌کند؛ بنابراین ترکیب هم‌خروجی با طیف UV بسیار مشابه، ترکیبی در مقدار بسیار کم یا ترکیبی با جذب UV ناچیز را تشخیص نمی‌دهد. پس قبول شدن آن Specificity را پشتیبانی می‌کند ولی اثبات نمی‌کند؛ Mass spectrometry یا یک روش جداسازی Orthogonal شاهد قوی‌تری است.",
    ),
    "ICH Q2(R2)",
  ),
  qc(
    "oot",
    "mid",
    bi("What is the difference between OOT and OOS?", "تفاوت OOT و OOS چیست؟"),
    bi(
      "OOS is a result outside the specification. OOT is a result still within specification but not in line with the expected trend, for example from earlier time points or other batches. OOT is an early warning; it is evaluated by a defined statistical approach and investigated before it becomes OOS.",
      "OOS نتیجه‌ای خارج از Specification است. OOT نتیجه‌ای است که هنوز در Specification قرار دارد ولی با روند مورد انتظار، مثلاً نقاط زمانی قبلی یا بچ‌های دیگر، هم‌خوانی ندارد. OOT هشدار زودهنگام است؛ با روش آماری تعریف‌شده ارزیابی و پیش از تبدیل شدن به OOS بررسی می‌شود.",
    ),
    "ICH Q1E",
  ),
  qc(
    "water",
    "mid",
    bi("Which tests show that Purified Water and Water for Injection are fit for use?", "کدام آزمون‌ها مناسب بودن Purified water و Water for injection را نشان می‌دهند؟"),
    bi(
      "Both are tested for conductivity and total organic carbon, and microbiologically. WFI is also tested for bacterial endotoxins (not more than 0.25 EU/mL) and has a stricter microbial action level than Purified Water. Results are trended across the sampling points of the loop, not judged one by one.",
      "هر دو از نظر Conductivity، TOC و میکروبی آزمایش می‌شوند. WFI علاوه بر این از نظر Bacterial endotoxin (حداکثر 0.25 EU/mL) آزمایش می‌شود و حد اقدام میکروبی سخت‌گیرانه‌تری نسبت به Purified water دارد. نتایج در طول نقاط نمونه‌برداری Loop روندیابی می‌شوند، نه اینکه تک‌تک قضاوت شوند.",
    ),
    "USP <645>, <643>, <1231>",
  ),
  qc(
    "bet",
    "mid",
    bi("Which methods are used for the bacterial endotoxins test?", "برای Bacterial endotoxin test از چه روش‌هایی استفاده می‌شود؟"),
    bi(
      "The LAL reagent is used in three techniques: gel-clot (a limit test), turbidimetric and chromogenic (both quantitative, kinetic or end-point). Before routine testing, the product is checked for interference (inhibition or enhancement) at a valid dilution that does not exceed the maximum valid dilution.",
      "معرف LAL در سه تکنیک به کار می‌رود: Gel-clot که آزمون حدی است، و Turbidimetric و Chromogenic که هر دو کمّی‌اند و به‌صورت Kinetic یا End-point انجام می‌شوند. پیش از آزمون روزمره، فرآورده از نظر Interference (مهار یا تقویت) در رقتی معتبر که از Maximum valid dilution بیشتر نیست، بررسی می‌شود.",
    ),
    "USP <85>, Ph. Eur. 2.6.14",
  ),
  qc(
    "sterility",
    "mid",
    bi("Describe the sterility test.", "آزمون استریلیتی را توضیح دهید."),
    bi(
      "The preferred technique is membrane filtration; direct inoculation is used when filtration is not possible. Two media are used, fluid thioglycollate and soybean–casein digest, incubated for at least 14 days. The test is done in an aseptic environment with negative controls, and the method suitability test shows the product does not inhibit growth.",
      "روش ترجیحی Membrane filtration است و وقتی فیلتراسیون ممکن نباشد، Direct inoculation به کار می‌رود. دو محیط کشت Fluid thioglycollate و Soybean-casein digest استفاده و دست‌کم 14 روز گرمخانه‌گذاری می‌شوند. آزمون در محیط آسپتیک با کنترل منفی انجام می‌شود و Method suitability نشان می‌دهد فرآورده رشد را مهار نمی‌کند.",
    ),
    "USP <71>, Ph. Eur. 2.6.1",
  ),
  qc(
    "microbial-limits",
    "basic",
    bi("What do TAMC and TYMC mean in microbial limit testing?", "TAMC و TYMC در آزمون حدود میکروبی یعنی چه؟"),
    bi(
      "TAMC is the total aerobic microbial count and TYMC the total combined yeasts and moulds count, expressed in CFU per g or mL. Acceptance criteria depend on the dosage form and route; tests for specified organisms, such as the absence of Escherichia coli in oral products, are done alongside them.",
      "TAMC شمارش کل میکروارگانیسم‌های هوازی و TYMC شمارش کل مخمرها و کپک‌هاست که برحسب CFU در هر g یا mL بیان می‌شوند. معیارهای پذیرش به شکل دارویی و راه مصرف بستگی دارد و آزمون ارگانیسم‌های مشخص، مثل عدم وجود Escherichia coli در فرآورده‌های خوراکی، همراه آن‌ها انجام می‌شود.",
    ),
    "USP <61>, <62>, <1111>",
  ),
  qc(
    "calibration",
    "basic",
    bi("What is the difference between calibration and qualification?", "تفاوت کالیبراسیون و Qualification چیست؟"),
    bi(
      "Calibration compares an instrument's readings with traceable standards over its working range and adjusts or documents the error. Qualification (IQ, OQ, PQ) shows that the equipment is installed correctly, operates to its specification and performs as intended in actual use. Calibration is a recurring part of keeping equipment in its qualified state.",
      "کالیبراسیون خوانش دستگاه را با Standardهای قابل‌ردیابی در محدوده کاری مقایسه و خطا را اصلاح یا ثبت می‌کند. Qualification (IQ، OQ و PQ) نشان می‌دهد تجهیز درست نصب شده، طبق مشخصات کار می‌کند و در استفاده واقعی عملکرد مورد انتظار را دارد. کالیبراسیون بخشی تکرارشونده از حفظ وضعیت Qualifyشده تجهیز است.",
    ),
    "USP <1058>, EU GMP Annex 15",
  ),
  qc(
    "alcoa",
    "basic",
    bi("What does ALCOA+ mean?", "ALCOA+ یعنی چه؟"),
    bi(
      "Data must be Attributable, Legible, Contemporaneous, Original and Accurate; the plus adds Complete, Consistent, Enduring and Available. In a laboratory it means, for example, recording results at the time of work, keeping the original electronic data and audit trail, and never discarding a result without a documented reason.",
      "داده باید Attributable، Legible، Contemporaneous، Original و Accurate باشد؛ علامت + ویژگی‌های Complete، Consistent، Enduring و Available را اضافه می‌کند. در آزمایشگاه یعنی، برای نمونه، ثبت نتیجه در همان زمان انجام کار، حفظ داده الکترونیکی اصلی و Audit trail، و هرگز کنار نگذاشتن نتیجه بدون دلیل مستند.",
    ),
    "MHRA GxP Data Integrity Guidance (2018), PIC/S PI 041",
  ),
  qc(
    "audit-trail",
    "advanced",
    bi("What do you look for when reviewing a chromatography audit trail?", "در بررسی Audit trail سیستم کروماتوگرافی دنبال چه هستید؟"),
    bi(
      "Changes to processing methods and manual integration, injections that were aborted, deleted or not reported, sequences run before the official one (trial injections), changes to dates or user accounts, and whether every change has a reason. The review is risk-based, part of the result review before release, and documented.",
      "تغییر در Processing method و Integration دستی، تزریق‌های متوقف‌شده، حذف‌شده یا گزارش‌نشده، Sequenceهایی که پیش از Sequence رسمی اجرا شده‌اند (Trial injection)، تغییر تاریخ یا حساب کاربری، و اینکه آیا هر تغییر دلیل ثبت‌شده دارد. این بررسی مبتنی بر ریسک، بخشی از بازبینی نتایج پیش از آزادسازی و مستند است.",
    ),
    "FDA Data Integrity Guidance (2018), EU GMP Annex 11",
  ),
  qc(
    "q3c",
    "mid",
    bi("How are residual solvents classified?", "حلال‌های باقیمانده چگونه طبقه‌بندی می‌شوند؟"),
    bi(
      "Class 1 solvents (for example benzene) should be avoided. Class 2 solvents are limited by a permitted daily exposure, expressed as a concentration limit in ppm. Class 3 solvents have low toxic potential; up to 5000 ppm (0.5%) is acceptable without justification. Limits are tested by GC, usually headspace.",
      "حلال‌های Class 1 (مثل بنزن) باید کنار گذاشته شوند. حلال‌های Class 2 با یک PDE محدود می‌شوند که به‌صورت حد غلظت برحسب ppm بیان می‌شود. حلال‌های Class 3 پتانسیل سمیت کمی دارند و تا 5000 ppm (0.5%) بدون توجیه پذیرفته‌اند. آزمون معمولاً با GC و به روش Headspace انجام می‌شود.",
    ),
    "ICH Q3C(R9), USP <467>",
  ),
  qc(
    "q3d",
    "advanced",
    bi("How is the elemental impurities risk assessed?", "ریسک ناخالصی‌های عنصری چگونه ارزیابی می‌شود؟"),
    bi(
      "Each potential source is reviewed: API, excipients, water, equipment and container closure. The expected level of each element is compared with its PDE for the route of administration; Class 1 elements (As, Cd, Hg, Pb) are always considered. If the level stays below 30% of the PDE (the control threshold), routine testing is usually not needed.",
      "همه منابع احتمالی بررسی می‌شوند: API، Excipientها، آب، تجهیزات و Container closure. مقدار مورد انتظار هر عنصر با PDE آن برای راه مصرف مقایسه می‌شود و عناصر Class 1 (As، Cd، Hg و Pb) همیشه در نظر گرفته می‌شوند. اگر مقدار زیر 30% PDE (Control threshold) بماند، معمولاً آزمون روزمره لازم نیست.",
    ),
    "ICH Q3D(R2), USP <232>",
  ),
  qc(
    "nitrosamines",
    "advanced",
    bi("Why are nitrosamines a concern and how are they controlled?", "چرا نیتروزامین‌ها نگران‌کننده‌اند و چگونه کنترل می‌شوند؟"),
    bi(
      "Many N-nitrosamines are probable human carcinogens even at very low levels. A risk assessment looks for secondary or tertiary amines meeting nitrosating agents (such as nitrites in excipients or water) in the API route, the process and storage; where a risk exists, confirmatory testing with a sensitive method (often LC-MS/MS) is done against the acceptable intake set by the authority.",
      "بسیاری از N-nitrosamineها حتی در مقادیر بسیار کم، احتمالاً برای انسان سرطان‌زا هستند. در ارزیابی ریسک، برخورد آمین‌های ثانویه یا نوع سوم با عوامل Nitrosating (مثل نیتریت در Excipientها یا آب) در مسیر سنتز API، فرایند و نگهداری بررسی می‌شود. در صورت وجود ریسک، آزمون تأییدی با روشی حساس (اغلب LC-MS/MS) در برابر Acceptable intake تعیین‌شده توسط مرجع انجام می‌شود.",
    ),
    "EMA Q&A on nitrosamines, FDA Guidance (2024)",
  ),
  qc(
    "q3b",
    "advanced",
    bi("What are the reporting, identification and qualification thresholds for degradation products?", "حدود Reporting، Identification و Qualification برای محصولات تخریب چیست؟"),
    bi(
      "They depend on the maximum daily dose. Above the reporting threshold a degradant is reported; above the identification threshold its structure must be identified; above the qualification threshold its safety must be established. For example, for a maximum daily dose up to 1 g, the reporting threshold is 0.1%.",
      "این حدود به Maximum daily dose بستگی دارند. بالاتر از Reporting threshold محصول تخریب گزارش می‌شود؛ بالاتر از Identification threshold ساختار آن باید شناسایی شود؛ و بالاتر از Qualification threshold ایمنی آن باید اثبات شود. برای مثال، برای Maximum daily dose تا 1 g، Reporting threshold برابر 0.1% است.",
    ),
    "ICH Q3B(R2)",
  ),

  // ---------------- QA ----------------
  qa(
    "qa-qc",
    "basic",
    bi("What is the difference between QA and QC?", "تفاوت QA و QC چیست؟"),
    bi(
      "QC tests materials, intermediates and products against specifications and decides whether a result complies. QA is the system that makes sure the product is made right every time: procedures, training, validation, deviation and change management, audits and batch release. QC is one part of the quality system that QA oversees.",
      "QC مواد، محصولات میانی و فرآورده نهایی را در برابر Specification آزمایش می‌کند و درباره انطباق نتیجه تصمیم می‌گیرد. QA سیستمی است که اطمینان می‌دهد محصول هر بار درست ساخته شود: روش‌های اجرایی، آموزش، صحه‌گذاری، مدیریت Deviation و Change، ممیزی‌ها و آزادسازی بچ. QC بخشی از سیستم کیفیت است که QA بر آن نظارت دارد.",
    ),
    "ICH Q10, EU GMP Chapter 1",
  ),
  qa(
    "deviation-change",
    "basic",
    bi("What is the difference between a deviation and a change control?", "تفاوت Deviation و Change control چیست؟"),
    bi(
      "A deviation is an unplanned departure from an approved procedure or specification, found after it happened; it is investigated for root cause and impact on product. A change control is a planned change, assessed and approved before it is made, including its regulatory impact. A deviation must never be used to make a permanent change.",
      "Deviation انحراف برنامه‌ریزی‌نشده از روش یا Specification تأییدشده است که پس از وقوع کشف می‌شود و علت ریشه‌ای و اثر آن بر محصول بررسی می‌شود. Change control تغییری برنامه‌ریزی‌شده است که پیش از اجرا، همراه با اثر نظارتی آن، ارزیابی و تأیید می‌شود. هرگز نباید از Deviation برای ایجاد یک تغییر دائمی استفاده کرد.",
    ),
    "EU GMP Chapter 1, ICH Q10",
  ),
  qa(
    "capa",
    "basic",
    bi("What is CAPA and how do you find a root cause?", "CAPA چیست و علت ریشه‌ای را چگونه پیدا می‌کنید؟"),
    bi(
      "Corrective action removes the cause of a problem that happened; preventive action removes the cause of a potential one. The root cause is found with structured tools such as 5 Whys, the Ishikawa (fishbone) diagram or fault-tree analysis. Every CAPA has an owner and a due date, and its effectiveness is checked against a measurable criterion.",
      "Corrective action علت مشکلی را که رخ داده برطرف می‌کند و Preventive action علت مشکل بالقوه را. علت ریشه‌ای با ابزارهای ساختاریافته مثل 5 Whys، نمودار Ishikawa (استخوان ماهی) یا Fault-tree analysis پیدا می‌شود. هر CAPA مسئول و موعد مشخص دارد و اثربخشی آن با معیاری قابل‌اندازه‌گیری بررسی می‌شود.",
    ),
    "ICH Q10, ICH Q9(R1)",
  ),
  qa(
    "release",
    "mid",
    bi("What does QA check before releasing a batch?", "QA پیش از آزادسازی بچ چه چیزهایی را بررسی می‌کند؟"),
    bi(
      "The complete batch manufacturing and packaging records, in-process results, QC test results and their compliance with the specification, deviations and changes related to the batch and whether they are closed or assessed, environmental and utility data where relevant, and the status of starting materials. Release is certified by the authorised person.",
      "سوابق کامل ساخت و بسته‌بندی بچ، نتایج کنترل‌های حین فرایند، نتایج آزمون‌های QC و انطباق آن‌ها با Specification، Deviationها و Changeهای مرتبط با بچ و بسته یا ارزیابی‌شده بودن آن‌ها، داده‌های محیطی و سیستم‌های پشتیبان در صورت لزوم، و وضعیت مواد اولیه. آزادسازی توسط فرد مجاز (مسئول فنی یا QP) تأیید می‌شود.",
    ),
    "EU GMP Annex 16, EU GMP Chapter 6",
  ),
  qa(
    "pv-stages",
    "mid",
    bi("Describe the three stages of process validation.", "سه مرحله صحه‌گذاری فرایند را توضیح دهید."),
    bi(
      "Stage 1, process design: the commercial process is defined from development knowledge and risk. Stage 2, process qualification: facilities and equipment are qualified and process performance qualification shows the process gives consistent batches. Stage 3, continued process verification: routine data are monitored to show the process stays in a state of control.",
      "مرحله 1، Process design: فرایند تجاری بر پایه دانش توسعه و ارزیابی ریسک تعریف می‌شود. مرحله 2، Process qualification: تأسیسات و تجهیزات Qualify می‌شوند و PPQ نشان می‌دهد فرایند بچ‌های یکنواخت تولید می‌کند. مرحله 3، Continued process verification: داده‌های روزمره پایش می‌شوند تا نشان داده شود فرایند در حالت کنترل باقی مانده است.",
    ),
    "FDA Process Validation Guidance (2011), EU GMP Annex 15",
  ),
  qa(
    "cleaning",
    "mid",
    bi("How are cleaning validation limits set today?", "حدود صحه‌گذاری نظافت امروزه چگونه تعیین می‌شوند؟"),
    bi(
      "From health-based exposure limits: the permitted daily exposure (PDE) of the previous product is used to calculate the maximum allowable carryover into the next one, and from it the swab and rinse limits per surface area. Equipment must also be visually clean, and worst-case products and hard-to-clean locations are chosen with a documented rationale.",
      "بر پایه حدود مواجهه مبتنی بر سلامت: PDE محصول قبلی برای محاسبه حداکثر انتقال مجاز (MACO) به محصول بعدی به کار می‌رود و از آن، حدود Swab و Rinse برحسب سطح محاسبه می‌شود. تجهیز باید از نظر چشمی هم تمیز باشد و محصولات و نقاط Worst-case با دلیل مستند انتخاب می‌شوند.",
    ),
    "EMA HBEL Guideline, EU GMP Annex 15, PIC/S PI 046",
  ),
  qa(
    "pqr",
    "mid",
    bi("What goes into the annual product quality review?", "در بازنگری سالانه کیفیت محصول (PQR) چه چیزهایی بررسی می‌شود؟"),
    bi(
      "A review of the year's batches: starting materials, critical in-process controls and finished-product results with trends, failed batches, deviations, changes, OOS results, stability, returns, complaints and recalls, CAPA status and the adequacy of equipment and utilities. The conclusion states whether the process is still consistent and what must be done.",
      "مرور بچ‌های یک سال: مواد اولیه، کنترل‌های حیاتی حین فرایند و نتایج فرآورده نهایی همراه با روند، بچ‌های رد‌شده، Deviationها، Changeها، نتایج OOS، پایداری، مرجوعی‌ها، شکایات و فراخوان‌ها، وضعیت CAPAها و کفایت تجهیزات و سیستم‌های پشتیبان. نتیجه‌گیری می‌گوید فرایند همچنان یکنواخت است یا نه و چه اقداماتی لازم است.",
    ),
    "EU GMP Chapter 1 (1.10)",
  ),
  qa(
    "qrm",
    "mid",
    bi("Which quality risk management tools do you know?", "چه ابزارهایی برای مدیریت ریسک کیفیت می‌شناسید؟"),
    bi(
      "FMEA scores severity, occurrence and detectability of each failure mode; HACCP focuses on critical control points; fault-tree analysis works back from an undesired event; simple risk ranking and filtering compares many risks. The level of effort and documentation should match the level of risk, and subjectivity in scoring is controlled.",
      "FMEA شدت، احتمال وقوع و قابلیت کشف هر حالت خرابی را امتیاز می‌دهد؛ HACCP بر نقاط کنترل بحرانی تمرکز دارد؛ Fault-tree analysis از رویداد نامطلوب به عقب برمی‌گردد؛ و Risk ranking and filtering ریسک‌های متعدد را مقایسه می‌کند. میزان تلاش و مستندسازی باید متناسب با سطح ریسک باشد و ذهنی بودن امتیازدهی کنترل شود.",
    ),
    "ICH Q9(R1)",
  ),
  qa(
    "q10",
    "advanced",
    bi("What are the elements of the pharmaceutical quality system in ICH Q10?", "اجزای سیستم کیفیت دارویی در ICH Q10 چیست؟"),
    bi(
      "Four elements: process performance and product quality monitoring, the CAPA system, the change management system, and management review of process performance and product quality. Two enablers support them: knowledge management and quality risk management, across the whole product lifecycle.",
      "چهار جزء: پایش عملکرد فرایند و کیفیت محصول، سیستم CAPA، سیستم مدیریت تغییر، و بازنگری مدیریت بر عملکرد فرایند و کیفیت محصول. دو عامل توانمندساز آن‌ها را پشتیبانی می‌کنند: مدیریت دانش و مدیریت ریسک کیفیت، در کل چرخه عمر محصول.",
    ),
    "ICH Q10",
  ),
  qa(
    "supplier",
    "mid",
    bi("How do you qualify a raw material supplier?", "تأمین‌کننده ماده اولیه را چگونه Qualify می‌کنید؟"),
    bi(
      "Collect the supplier's documents (manufacturer details, GMP status, specifications, CoAs), test samples from several batches against our specification, assess risk, and audit the manufacturer where the risk calls for it, especially for APIs. A quality agreement sets responsibilities, and approved suppliers are re-evaluated periodically.",
      "مدارک تأمین‌کننده (اطلاعات سازنده، وضعیت GMP، Specification و CoA) جمع‌آوری می‌شود، نمونه‌های چند بچ در برابر Specification خودمان آزمایش می‌شوند، ریسک ارزیابی می‌شود و در صورت نیاز، به‌ویژه برای API، از سازنده ممیزی انجام می‌شود. Quality agreement مسئولیت‌ها را تعیین می‌کند و تأمین‌کنندگان تأییدشده به‌صورت دوره‌ای بازارزیابی می‌شوند.",
    ),
    "EU GMP Chapter 5, ICH Q7",
  ),
  qa(
    "self-inspection",
    "basic",
    bi("What is self-inspection for?", "Self-inspection برای چیست؟"),
    bi(
      "Self-inspections are planned internal audits of every GMP area to find gaps before regulators or customers do. They follow a programme, are done by trained people independent of the area, and their findings are recorded and closed with CAPA.",
      "Self-inspection ممیزی داخلی برنامه‌ریزی‌شده همه حوزه‌های GMP است تا نقص‌ها پیش از بازرسان یا مشتریان پیدا شوند. طبق برنامه و توسط افراد آموزش‌دیده و مستقل از همان حوزه انجام می‌شود و یافته‌های آن ثبت و با CAPA بسته می‌شوند.",
    ),
    "EU GMP Chapter 9",
  ),
  qa(
    "complaints",
    "mid",
    bi("How is a product complaint handled?", "شکایت از محصول چگونه رسیدگی می‌شود؟"),
    bi(
      "It is logged, classified by risk, and investigated with the retained samples and batch records; other batches are checked if the cause may affect them. The outcome may be CAPA, a report to the authority or a recall. The customer gets an answer, and complaint trends feed the product quality review.",
      "شکایت ثبت، بر اساس ریسک طبقه‌بندی و با نمونه‌های شاهد و سوابق بچ بررسی می‌شود؛ اگر علت ممکن است بچ‌های دیگر را هم درگیر کند، آن‌ها هم بررسی می‌شوند. نتیجه ممکن است CAPA، گزارش به مرجع نظارتی یا فراخوان باشد. به شاکی پاسخ داده می‌شود و روند شکایات وارد PQR می‌شود.",
    ),
    "EU GMP Chapter 8",
  ),
  qa(
    "change-regulatory",
    "advanced",
    bi("How do you assess the regulatory impact of a change?", "اثر نظارتی یک تغییر را چگونه ارزیابی می‌کنید؟"),
    bi(
      "Compare the change with the registered dossier: if it touches registered information (manufacturing site, process, specification, method, packaging), it is classified by the authority's variation categories and filed before or after implementation as required. Changes not in the dossier are still assessed and documented under change control.",
      "تغییر با پرونده ثبت‌شده مقایسه می‌شود: اگر به اطلاعات ثبت‌شده (محل ساخت، فرایند، Specification، روش آنالیز یا بسته‌بندی) مربوط باشد، طبق دسته‌بندی Variation مرجع نظارتی طبقه‌بندی و، بسته به الزام، پیش یا پس از اجرا ارسال می‌شود. تغییراتی که در پرونده نیستند هم در Change control ارزیابی و مستند می‌شوند.",
    ),
    "ICH Q12, EU Variations Guideline",
  ),
  qa(
    "vmp",
    "basic",
    bi("What is a validation master plan?", "Validation master plan چیست؟"),
    bi(
      "A high-level document that sets the site's validation policy and approach: what is validated (facilities, equipment, utilities, processes, cleaning, methods, computerised systems), responsibilities, the order of work and the current status. It keeps validation planned and complete rather than piecemeal.",
      "سندی سطح بالا که سیاست و رویکرد صحه‌گذاری کارخانه را تعیین می‌کند: چه چیزهایی صحه‌گذاری می‌شوند (تأسیسات، تجهیزات، سیستم‌های پشتیبان، فرایندها، نظافت، روش‌ها و سیستم‌های کامپیوتری)، مسئولیت‌ها، ترتیب کار و وضعیت فعلی. این سند صحه‌گذاری را برنامه‌ریزی‌شده و کامل نگه می‌دارد، نه پراکنده.",
    ),
    "EU GMP Annex 15, PIC/S PI 006",
  ),
  qa(
    "dq-pq",
    "mid",
    bi("Explain DQ, IQ, OQ and PQ.", "DQ، IQ، OQ و PQ را توضیح دهید."),
    bi(
      "DQ shows the design meets the user requirements (URS). IQ shows the equipment is installed as designed. OQ shows it operates as intended across its operating ranges. PQ shows it performs consistently in actual use, with the real product or a representative material. Each stage is completed before the next begins.",
      "DQ نشان می‌دهد طراحی، الزامات کاربر (URS) را برآورده می‌کند. IQ نشان می‌دهد تجهیز طبق طراحی نصب شده است. OQ نشان می‌دهد در محدوده‌های کاری همان‌طور که انتظار می‌رود کار می‌کند. PQ نشان می‌دهد در استفاده واقعی، با محصول اصلی یا ماده نماینده، عملکرد یکنواخت دارد. هر مرحله پیش از شروع مرحله بعد تکمیل می‌شود.",
    ),
    "EU GMP Annex 15",
  ),
  qa(
    "csv",
    "advanced",
    bi("How are computerised systems validated?", "سیستم‌های کامپیوتری چگونه صحه‌گذاری می‌شوند؟"),
    bi(
      "With a risk-based lifecycle approach: user requirements, supplier assessment, configuration and testing scaled to the system's GxP impact and complexity, and controls for access, audit trail, backup and electronic signatures. Validation continues in operation through change control, periodic review and data integrity checks.",
      "با رویکرد چرخه عمر مبتنی بر ریسک: الزامات کاربر، ارزیابی تأمین‌کننده، پیکربندی و آزمون متناسب با اثر GxP و پیچیدگی سیستم، و کنترل‌های دسترسی، Audit trail، پشتیبان‌گیری و امضای الکترونیکی. صحه‌گذاری در دوره بهره‌برداری با Change control، بازنگری دوره‌ای و بررسی Data integrity ادامه پیدا می‌کند.",
    ),
    "GAMP 5 (2nd ed.), EU GMP Annex 11, 21 CFR Part 11",
  ),
  qa(
    "training",
    "basic",
    bi("How do you show training was effective?", "اثربخشی آموزش را چگونه نشان می‌دهید؟"),
    bi(
      "Not only by a signed attendance sheet: by an assessment (test, observed practical demonstration) and by results afterwards, such as fewer deviations of that type. Training is planned per role, done before the person works independently on the task, and repeated when a procedure changes.",
      "نه فقط با برگه حضور امضاشده؛ بلکه با ارزیابی (آزمون یا اجرای عملی زیر نظر) و با نتایج بعدی، مثل کاهش Deviationهای همان نوع. آموزش برای هر نقش برنامه‌ریزی می‌شود، پیش از کار مستقل فرد روی آن وظیفه انجام می‌گیرد و با تغییر روش اجرایی تکرار می‌شود.",
    ),
    "EU GMP Chapter 2",
  ),
  qa(
    "gdp",
    "basic",
    bi("How is an error in a GMP record corrected?", "اشتباه در یک سند GMP چگونه اصلاح می‌شود؟"),
    bi(
      "Strike it through with a single line so the original stays legible, write the correct entry, and add initials, date and, where needed, the reason. Correction fluid, overwriting, erasing or recopying a page are not allowed. Records are filled in at the time of the activity, in indelible ink.",
      "روی آن یک خط می‌کشم تا نوشته اصلی خوانا بماند، مقدار درست را می‌نویسم و امضای کوتاه، تاریخ و در صورت نیاز دلیل را اضافه می‌کنم. استفاده از لاک غلط‌گیر، نوشتن روی نوشته قبلی، پاک کردن یا بازنویسی صفحه مجاز نیست. سوابق در زمان انجام کار و با جوهر پاک‌نشدنی تکمیل می‌شوند.",
    ),
    "EU GMP Chapter 4",
  ),
  qa(
    "documents",
    "basic",
    bi("What is the document hierarchy of a quality system?", "سلسله‌مراتب مستندات سیستم کیفیت چیست؟"),
    bi(
      "At the top, the quality manual or site master file; then policies; then procedures (SOPs) that say who does what; then work instructions for detailed steps; and finally records and forms that prove what was done. Each level is controlled: approved, versioned, distributed and reviewed periodically.",
      "در بالاترین سطح، Quality manual یا Site master file؛ سپس سیاست‌ها؛ سپس روش‌های اجرایی (SOP) که می‌گویند چه کسی چه کاری انجام دهد؛ سپس دستورالعمل‌های کاری برای جزئیات مراحل؛ و در پایان سوابق و فرم‌هایی که انجام کار را اثبات می‌کنند. هر سطح کنترل‌شده است: تأیید، نسخه‌گذاری، توزیع و بازنگری دوره‌ای.",
    ),
    "EU GMP Chapter 4",
  ),
  qa(
    "stability-program",
    "mid",
    bi("What are the standard ICH stability conditions?", "شرایط استاندارد پایداری ICH چیست؟"),
    bi(
      "Long-term storage at the condition of the climatic zone where the product is marketed (for example 25 °C/60% RH or 30 °C/65% or 75% RH), intermediate 30 °C/65% RH when needed, and accelerated 40 °C/75% RH for 6 months. A significant change at accelerated conditions triggers the intermediate study. The shelf life is set from the long-term data.",
      "نگهداری Long-term در شرایط منطقه اقلیمی محل عرضه محصول (مثلاً 25 °C/60% RH یا 30 °C/65% یا 75% RH)، Intermediate در 30 °C/65% RH در صورت نیاز، و Accelerated در 40 °C/75% RH به مدت 6 ماه. تغییر قابل‌توجه در شرایط Accelerated، مطالعه Intermediate را لازم می‌کند. عمر قفسه‌ای از داده‌های Long-term تعیین می‌شود.",
    ),
    "ICH Q1A(R2), WHO TRS 1010 Annex 10",
  ),
  qa(
    "hold-time",
    "mid",
    bi("What is a hold-time study?", "مطالعه Hold time چیست؟"),
    bi(
      "It shows how long intermediates, bulk product or equipment can wait between steps without affecting quality: for example blend before compression, coating suspension, or dirty and clean equipment before cleaning or use. The validated times are written into the batch record and the cleaning procedure.",
      "این مطالعه نشان می‌دهد محصولات میانی، فرآورده Bulk یا تجهیزات تا چه مدت می‌توانند بین مراحل منتظر بمانند بدون اینکه کیفیت تحت تأثیر قرار گیرد؛ مثلاً مخلوط پیش از پرس، سوسپانسیون روکش، یا تجهیز کثیف و تمیز پیش از نظافت یا استفاده. زمان‌های صحه‌گذاری‌شده در Batch record و روش نظافت درج می‌شوند.",
    ),
    "EU GMP Annex 15, WHO TRS 992 Annex 4",
  ),
  qa(
    "cleanroom",
    "mid",
    bi("What are cleanroom grades A to D?", "گریدهای A تا D اتاق تمیز چیست؟"),
    bi(
      "Grade A is the zone for high-risk operations such as aseptic filling, usually under unidirectional airflow; Grade B is the background for Grade A in aseptic preparation; Grades C and D are for less critical steps. Each grade has limits for airborne particles and viable organisms, at rest and in operation, monitored by a programme based on risk.",
      "Grade A ناحیه عملیات پرخطر مانند پرکردن آسپتیک است و معمولاً زیر جریان هوای Unidirectional قرار دارد؛ Grade B محیط پس‌زمینه Grade A در آماده‌سازی آسپتیک است؛ و Gradeهای C و D برای مراحل کم‌اهمیت‌ترند. هر گرید، حدودی برای ذرات معلق و میکروارگانیسم‌های زنده در حالت At rest و In operation دارد که با برنامه‌ای مبتنی بر ریسک پایش می‌شود.",
    ),
    "EU GMP Annex 1 (2022)",
  ),
  qa(
    "media-fill",
    "advanced",
    bi("What is a media fill and how often is it done?", "Media fill چیست و هر چند وقت یک بار انجام می‌شود؟"),
    bi(
      "An aseptic process simulation: a growth medium is processed exactly as the product would be, including worst-case interventions, then incubated and inspected for growth. Three consecutive successful runs qualify a new process or line, and each line is then requalified at least twice a year. Any contaminated unit is investigated.",
      "شبیه‌سازی فرایند آسپتیک: محیط کشت دقیقاً مانند محصول فرایند می‌شود، همراه با مداخلات Worst-case، سپس گرمخانه‌گذاری و از نظر رشد بازرسی می‌شود. سه Run موفق پیاپی، فرایند یا خط جدید را Qualify می‌کند و پس از آن هر خط دست‌کم دو بار در سال دوباره Qualify می‌شود. هر واحد آلوده بررسی و تحقیق می‌شود.",
    ),
    "EU GMP Annex 1 (2022)",
  ),
  qa(
    "release-shelf",
    "mid",
    bi("Why can release and shelf-life specifications differ?", "چرا Specification آزادسازی و عمر قفسه‌ای می‌توانند متفاوت باشند؟"),
    bi(
      "Some attributes change during storage, for example the assay falls or a degradant grows. Release limits are then set tighter than shelf-life limits so that a batch released at the edge still complies until its expiry. The difference must be justified with stability data.",
      "برخی ویژگی‌ها در طول نگهداری تغییر می‌کنند؛ مثلاً Assay کاهش می‌یابد یا یک محصول تخریب افزایش پیدا می‌کند. در این حالت، حدود آزادسازی سخت‌گیرانه‌تر از حدود عمر قفسه‌ای تعیین می‌شوند تا بچی که در مرز آزاد شده، تا تاریخ انقضا منطبق بماند. این اختلاف باید با داده‌های پایداری توجیه شود.",
    ),
    "ICH Q6A, ICH Q1E",
  ),
  qa(
    "recall",
    "mid",
    bi("What is a mock recall?", "Mock recall چیست؟"),
    bi(
      "A test of the recall procedure on a real batch without actually withdrawing it: it checks how fast and how completely the distribution records identify every customer and quantity. It shows whether the site could carry out a real recall in the time required.",
      "آزمون روش فراخوان روی یک بچ واقعی بدون جمع‌آوری واقعی آن: بررسی می‌کند سوابق توزیع با چه سرعت و چه کاملی همه مشتریان و مقادیر را مشخص می‌کنند. این آزمون نشان می‌دهد کارخانه می‌تواند یک فراخوان واقعی را در زمان لازم انجام دهد یا نه.",
    ),
    "EU GMP Chapter 8",
  ),
  qa(
    "ccs",
    "advanced",
    bi("What is a contamination control strategy?", "Contamination control strategy چیست؟"),
    bi(
      "A documented, site-wide plan that brings together every measure against microbial, particulate and pyrogen contamination: facility and equipment design, utilities, personnel and gowning, cleaning and disinfection, environmental monitoring, process controls and their review. Annex 1 requires it for sterile products and expects it to be kept current.",
      "برنامه‌ای مستند و در سطح کل کارخانه که همه اقدامات در برابر آلودگی میکروبی، ذره‌ای و پیروژنی را کنار هم قرار می‌دهد: طراحی تأسیسات و تجهیزات، سیستم‌های پشتیبان، پرسنل و لباس‌پوشی، نظافت و ضدعفونی، پایش محیطی، کنترل‌های فرایند و بازنگری آن‌ها. Annex 1 آن را برای فرآورده‌های استریل الزامی و به‌روز نگه داشتن آن را مورد انتظار می‌داند.",
    ),
    "EU GMP Annex 1 (2022)",
  ),
  qa(
    "line-clearance",
    "basic",
    bi("What is line clearance and why does it matter?", "Line clearance چیست و چرا اهمیت دارد؟"),
    bi(
      "Before a new batch or product starts, the line and room are checked and documented as free of materials, labels, documents and product from the previous run. It prevents mix-ups, one of the most frequent causes of recalls, and it is verified by a second person.",
      "پیش از شروع بچ یا محصول جدید، خط و اتاق بررسی و مستند می‌شوند که هیچ ماده، برچسب، سند یا محصولی از Run قبلی در آن نمانده است. این کار از Mix-up، یکی از شایع‌ترین علت‌های فراخوان، جلوگیری می‌کند و توسط نفر دوم تأیید می‌شود.",
    ),
    "EU GMP Chapter 5",
  ),
  qa(
    "quality-agreement",
    "mid",
    bi("What belongs in a quality agreement with a contract manufacturer?", "در Quality agreement با پیمانکار تولید چه مواردی می‌آید؟"),
    bi(
      "Who is responsible for each GMP activity: materials, manufacturing, testing, release, deviations and changes, complaints and recalls, stability, records and their retention, audits and subcontracting. The contract giver stays responsible for the product, so the agreement must allow it to audit and to approve changes.",
      "اینکه مسئولیت هر فعالیت GMP با کیست: مواد، ساخت، آزمون، آزادسازی، Deviationها و Changeها، شکایات و فراخوان‌ها، پایداری، سوابق و مدت نگهداری آن‌ها، ممیزی‌ها و واگذاری به پیمانکار دیگر. مسئولیت محصول با سفارش‌دهنده باقی می‌ماند؛ بنابراین قرارداد باید حق ممیزی و تأیید تغییرات را برای او حفظ کند.",
    ),
    "EU GMP Chapter 7, FDA Guidance: Contract Manufacturing Quality Agreements (2016)",
  ),
  qa(
    "status",
    "basic",
    bi("How is the status of materials and batches controlled?", "وضعیت مواد و بچ‌ها چگونه کنترل می‌شود؟"),
    bi(
      "Every material and batch has a clear status: quarantine, released or rejected, shown by labels or a validated computer system and by physical segregation where needed. Only QA changes the status, and only released materials may be used or shipped.",
      "هر ماده و بچ وضعیت مشخصی دارد: قرنطینه، آزادشده یا مردود، که با برچسب یا سیستم کامپیوتری صحه‌گذاری‌شده و در صورت لزوم با جداسازی فیزیکی نشان داده می‌شود. فقط QA وضعیت را تغییر می‌دهد و فقط مواد آزادشده مصرف یا ارسال می‌شوند.",
    ),
    "EU GMP Chapter 5",
  ),
  qa(
    "data-governance",
    "advanced",
    bi("How does QA build data integrity into a site?", "QA چگونه Data integrity را در کارخانه نهادینه می‌کند؟"),
    bi(
      "Through governance rather than one-off checks: a culture where errors can be reported, risk assessment of each data flow, systems configured to prevent deletion and shared logins, routine audit-trail review, controlled blank forms, and audits that look for data integrity specifically. Management supports it with resources and by not rewarding results at any cost.",
      "با حاکمیت داده، نه بررسی‌های یک‌باره: فرهنگی که در آن گزارش خطا ممکن باشد، ارزیابی ریسک هر جریان داده، پیکربندی سیستم‌ها برای جلوگیری از حذف داده و حساب کاربری مشترک، بازبینی روزمره Audit trail، کنترل فرم‌های خام، و ممیزی‌هایی که به‌طور خاص Data integrity را بررسی می‌کنند. مدیریت با تأمین منابع و پاداش ندادن به «نتیجه به هر قیمت» از آن پشتیبانی می‌کند.",
    ),
    "PIC/S PI 041, MHRA GxP Data Integrity Guidance (2018)",
  ),
];

/** Free questions: the first FREE_PER_AREA of each area. */
export const isFreeQuestion = (q: InterviewQuestion): boolean =>
  interviewQuestions.filter((x) => x.area === q.area).indexOf(q) < FREE_PER_AREA;
