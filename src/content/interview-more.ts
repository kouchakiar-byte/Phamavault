import { bi, type Bi } from "@/i18n/bi";
import type { InterviewLevel, InterviewQuestion } from "./interview";

/*
 * Interview questions for R&D, regulatory affairs, production (operator level) and general
 * questions every candidate meets. PharmaVault's own wording. General questions have no single
 * right answer, so they carry what the interviewer is looking for, a short generic sample and
 * what to avoid, instead of a reference.
 */

const rnd = (id: string, level: InterviewLevel, q: Bi, a: Bi, refs?: string): InterviewQuestion => ({ id, area: "rnd", level, q, a, refs });
const ra = (id: string, level: InterviewLevel, q: Bi, a: Bi, refs?: string): InterviewQuestion => ({ id, area: "ra", level, q, a, refs });
const prod = (id: string, q: Bi, a: Bi, refs?: string): InterviewQuestion => ({ id, area: "prod", level: "basic", q, a, refs });
const gen = (id: string, q: Bi, aim: Bi, a: Bi, avoid: Bi): InterviewQuestion => ({ id, area: "gen", level: "basic", q, a, aim, avoid });

export const moreInterviewQuestions: InterviewQuestion[] = [
  // ---------------- R&D ----------------
  rnd(
    "preformulation",
    "basic",
    bi("What do you study in pre-formulation?", "در Pre-formulation چه چیزهایی بررسی می‌شود؟"),
    bi(
      "The properties of the API that decide the formulation: solubility over the pH range, pKa and log P, solid form (polymorphs, salts, hydrates), particle size and shape, flow and compressibility, hygroscopicity, and stability to heat, humidity, light and oxidation. Compatibility with the planned excipients is checked early too.",
      "ویژگی‌هایی از API که فرمولاسیون را تعیین می‌کنند: حلالیت در محدوده pH، pKa و log P، شکل جامد (Polymorph، نمک و Hydrate)، اندازه و شکل ذره، جریان‌پذیری و تراکم‌پذیری، Hygroscopicity، و پایداری در برابر گرما، رطوبت، نور و اکسیداسیون. سازگاری با Excipientهای پیش‌بینی‌شده هم از همان ابتدا بررسی می‌شود.",
    ),
    "ICH Q8(R2)",
  ),
  rnd(
    "qbd",
    "mid",
    bi("Explain QTPP, CQA, CPP and design space.", "QTPP، CQA، CPP و Design space را توضیح دهید."),
    bi(
      "The QTPP is the quality profile the product must reach (dosage form, strength, release, stability). CQAs are the product properties that must stay within limits to meet it, such as assay, dissolution or impurities. CPPs are the process parameters that affect a CQA. The design space is the proven combination of inputs and parameters within which quality is assured; working inside it is not a change.",
      "QTPP پروفایل کیفی هدف محصول است (شکل دارویی، قدرت، آزادسازی و پایداری). CQAها ویژگی‌هایی از محصول‌اند که برای رسیدن به آن باید در حدود معین بمانند؛ مثل Assay، انحلال یا ناخالصی‌ها. CPPها پارامترهای فرایندی‌اند که بر یک CQA اثر دارند. Design space ترکیب اثبات‌شده‌ای از ورودی‌ها و پارامترهاست که کیفیت در آن تضمین می‌شود و کار در داخل آن تغییر محسوب نمی‌شود.",
    ),
    "ICH Q8(R2)",
  ),
  rnd(
    "compatibility",
    "basic",
    bi("How do you run a drug–excipient compatibility study?", "مطالعه سازگاری دارو و Excipient را چگونه انجام می‌دهید؟"),
    bi(
      "Binary mixtures of the API with each excipient (often 1:1, or at the planned ratio), with and without added water, are stored under stress, for example 40 °C/75% RH, and tested at set times by HPLC for assay and impurities, with appearance and sometimes DSC as screening tools. Known risks are checked first, such as lactose with primary amines or peroxides in povidone.",
      "مخلوط‌های دوتایی API با هر Excipient (اغلب 1:1 یا با نسبت فرمول)، با و بدون آب افزوده، در شرایط Stress مثل 40 °C/75% RH نگهداری و در زمان‌های تعیین‌شده با HPLC از نظر Assay و ناخالصی آزمایش می‌شوند. ظاهر و گاهی DSC هم برای غربالگری به کار می‌رود. ریسک‌های شناخته‌شده اول بررسی می‌شوند؛ مثل لاکتوز با آمین‌های نوع اول یا Peroxide در Povidone.",
    ),
    "ICH Q8(R2)",
  ),
  rnd(
    "bcs",
    "mid",
    bi("What is the BCS and why does it matter in development?", "BCS چیست و چرا در توسعه اهمیت دارد؟"),
    bi(
      "The Biopharmaceutics Classification System groups drugs by solubility and permeability: Class I high/high, II low solubility, III low permeability, IV both low. It tells you what limits absorption, which formulation strategy fits, and whether an in-vivo bioequivalence study can be waived (possible for Class I and III under conditions).",
      "Biopharmaceutics Classification System داروها را بر اساس حلالیت و نفوذپذیری دسته‌بندی می‌کند: Class I هر دو بالا، Class II حلالیت کم، Class III نفوذپذیری کم و Class IV هر دو کم. این طبقه‌بندی نشان می‌دهد چه عاملی جذب را محدود می‌کند، کدام راهبرد فرمولاسیون مناسب است، و آیا می‌توان از مطالعه BE در بدن صرف‌نظر کرد (برای Class I و III با شرایط مشخص).",
    ),
    "ICH M9",
  ),
  rnd(
    "granulation-choice",
    "basic",
    bi("How do you choose between direct compression, dry and wet granulation?", "بین Direct compression، Dry granulation و Wet granulation چگونه انتخاب می‌کنید؟"),
    bi(
      "Direct compression is simplest when the API dose is low or moderate and the blend flows and compresses well. Dry granulation (roller compaction) suits moisture- or heat-sensitive APIs that need densifying. Wet granulation is chosen for poorly flowing or poorly compressible APIs, high doses and low-dose uniformity, when the API tolerates water and drying.",
      "Direct compression ساده‌ترین روش است وقتی دوز API کم یا متوسط باشد و مخلوط جریان و تراکم‌پذیری خوبی داشته باشد. Dry granulation (Roller compaction) برای APIهای حساس به رطوبت یا گرما که باید متراکم شوند مناسب است. Wet granulation برای APIهای با جریان یا تراکم‌پذیری ضعیف، دوزهای بالا و یکنواختی دوزهای کم انتخاب می‌شود، به شرط آنکه API آب و خشک کردن را تحمل کند.",
    ),
  ),
  rnd(
    "superdisintegrants",
    "basic",
    bi("Which superdisintegrants do you know and where do you add them?", "چه Superdisintegrantهایی می‌شناسید و کجا اضافه می‌شوند؟"),
    bi(
      "Croscarmellose sodium, crospovidone and sodium starch glycolate, usually at a few percent. In wet granulation they are often split between intra-granular (to break granules apart) and extra-granular (to break the tablet into granules). The level and position are optimised against disintegration and dissolution, not by habit.",
      "Croscarmellose sodium، Crospovidone و Sodium starch glycolate، معمولاً در حد چند درصد. در Wet granulation اغلب بین Intra-granular (برای شکستن گرانول) و Extra-granular (برای شکستن قرص به گرانول) تقسیم می‌شوند. مقدار و محل افزودن بر اساس Disintegration و انحلال بهینه می‌شود، نه از روی عادت.",
    ),
  ),
  rnd(
    "lubricant-overblending",
    "mid",
    bi("What happens if magnesium stearate is over-blended?", "اگر Magnesium stearate بیش از حد مخلوط شود چه اتفاقی می‌افتد؟"),
    bi(
      "It forms a hydrophobic film over the particles: tablets become softer and dissolution can slow down. That is why the lubricant is added last, with a short, validated blending time, and the blending time is a parameter studied during scale-up.",
      "یک لایه آب‌گریز روی ذرات تشکیل می‌دهد: قرص‌ها نرم‌تر می‌شوند و انحلال ممکن است کند شود. به همین دلیل Lubricant در آخر و با زمان اختلاط کوتاه و صحه‌گذاری‌شده اضافه می‌شود، و زمان اختلاط از پارامترهایی است که در Scale-up بررسی می‌شود.",
    ),
  ),
  rnd(
    "scale-up",
    "mid",
    bi("What do you watch when scaling a process up from the lab?", "در Scale-up فرایند از آزمایشگاه به تولید به چه نکاتی توجه می‌کنید؟"),
    bi(
      "Equipment geometry and principle change, so the same time or speed does not give the same result: granulation end point, shear, drying and blending must be matched by the right measure (for example power or tip speed, product temperature, LOD), not copied. Critical attributes are compared batch by batch, and changes in scale or equipment are classified for their regulatory impact.",
      "هندسه و اصل کار تجهیزات تغییر می‌کند؛ پس زمان یا سرعت یکسان نتیجه یکسان نمی‌دهد. End point گرانولاسیون، Shear، خشک کردن و اختلاط باید با معیار درست (مثلاً Power یا Tip speed، دمای محصول و LOD) هماهنگ شوند، نه کپی. ویژگی‌های بحرانی بچ به بچ مقایسه می‌شوند و تغییر مقیاس یا تجهیز از نظر اثر نظارتی طبقه‌بندی می‌شود.",
    ),
    "FDA SUPAC-IR (1995)",
  ),
  rnd(
    "polymorphism",
    "mid",
    bi("Why does polymorphism matter?", "چرا Polymorphism اهمیت دارد؟"),
    bi(
      "Different crystal forms of the same API can differ in solubility, dissolution rate, stability and processability. A change of form during manufacture or storage can change bioavailability. The form is identified (XRPD, DSC), and controlled in the specification when it affects performance.",
      "شکل‌های بلوری متفاوت یک API می‌توانند حلالیت، سرعت انحلال، پایداری و فرایندپذیری متفاوتی داشته باشند. تغییر شکل در ساخت یا نگهداری ممکن است فراهمی زیستی را تغییر دهد. شکل بلوری شناسایی می‌شود (XRPD و DSC) و اگر بر عملکرد اثر داشته باشد، در Specification کنترل می‌شود.",
    ),
    "ICH Q6A",
  ),
  rnd(
    "generic-rld",
    "mid",
    bi("How do you start developing a generic?", "توسعه یک فرآورده ژنریک را از کجا شروع می‌کنید؟"),
    bi(
      "By studying the reference product: label and patents, composition from the leaflet, physical tests (weight, hardness, coating), dissolution profiles in several media, impurity profile, and the API's properties. A target profile is set from it, and the formulation aims at similar dissolution and, finally, bioequivalence.",
      "با مطالعه فرآورده مرجع: برچسب و پتنت‌ها، ترکیب از روی بروشور، آزمون‌های فیزیکی (وزن، سختی و روکش)، پروفایل انحلال در چند Medium، پروفایل ناخالصی و ویژگی‌های API. بر این اساس پروفایل هدف تعیین می‌شود و فرمولاسیون به سمت انحلال مشابه و در نهایت Bioequivalence می‌رود.",
    ),
  ),
  rnd(
    "discriminating",
    "advanced",
    bi("What makes a dissolution method discriminating?", "چه چیزی یک روش انحلال را Discriminating می‌کند؟"),
    bi(
      "It detects changes in the formulation or process that matter for performance, such as a different particle size, lubricant level or hardness. It is shown by testing deliberately changed batches and seeing a clear difference, while the method stays robust to normal variation.",
      "روش تغییرات مهم فرمولاسیون یا فرایند را تشخیص می‌دهد؛ مثل تغییر اندازه ذره، مقدار Lubricant یا سختی. این ویژگی با آزمون بچ‌هایی که عمداً تغییر داده شده‌اند و دیدن تفاوت آشکار نشان داده می‌شود، در حالی که روش در برابر تغییرات عادی Robust می‌ماند.",
    ),
    "USP <1092>",
  ),
  rnd(
    "doe",
    "mid",
    bi("Why use design of experiments instead of one factor at a time?", "چرا به‌جای تغییر یک عامل در هر بار، از DoE استفاده می‌شود؟"),
    bi(
      "DoE changes several factors together in a planned way, so it finds interactions between them and needs fewer runs. Screening designs pick out the important factors; response-surface designs then optimise them and can define a design space.",
      "DoE چند عامل را به‌طور برنامه‌ریزی‌شده با هم تغییر می‌دهد؛ بنابراین برهم‌کنش بین عوامل را پیدا می‌کند و به آزمایش کمتری نیاز دارد. طرح‌های Screening عوامل مهم را مشخص می‌کنند و طرح‌های Response surface آن‌ها را بهینه می‌کنند و می‌توانند Design space را تعریف کنند.",
    ),
    "ICH Q8(R2)",
  ),
  rnd(
    "stability-batches",
    "mid",
    bi("Which batches go on stability for a registration?", "برای ثبت، کدام بچ‌ها وارد مطالعه پایداری می‌شوند؟"),
    bi(
      "At least three primary batches, of which at least two are pilot scale, made by a process that simulates the commercial one, in the packaging proposed for marketing. At the time of submission at least 12 months of long-term and 6 months of accelerated data are expected.",
      "دست‌کم سه بچ اصلی که دست‌کم دو تای آن‌ها در مقیاس Pilot باشند، با فرایندی شبیه فرایند تجاری و در بسته‌بندی پیشنهادی برای عرضه. در زمان ارسال پرونده، دست‌کم 12 ماه داده Long-term و 6 ماه داده Accelerated انتظار می‌رود.",
    ),
    "ICH Q1A(R2)",
  ),
  rnd(
    "coating",
    "basic",
    bi("What is the difference between a functional and a non-functional film coat?", "تفاوت روکش فیلمی عملکردی و غیرعملکردی چیست؟"),
    bi(
      "A non-functional coat improves appearance, taste masking, swallowing or protection from light and moisture, without changing release. A functional coat controls release: enteric coats (for example methacrylic acid copolymers) dissolve only above a certain pH, and modified-release coats control the rate.",
      "روکش غیرعملکردی ظاهر، پوشاندن طعم، راحتی بلع یا محافظت در برابر نور و رطوبت را بهتر می‌کند، بدون اینکه آزادسازی را تغییر دهد. روکش عملکردی آزادسازی را کنترل می‌کند: روکش Enteric (مثل Methacrylic acid copolymer) فقط بالاتر از pH معینی حل می‌شود و روکش Modified-release سرعت آزادسازی را کنترل می‌کند.",
    ),
  ),
  rnd(
    "solubility",
    "mid",
    bi("How can you improve the solubility of a poorly soluble API?", "حلالیت یک API کم‌محلول را چگونه می‌توان بهبود داد؟"),
    bi(
      "Salt formation, particle size reduction (micronisation, nanosizing), amorphous solid dispersions, complexation with cyclodextrins, surfactants and lipid-based systems. The choice depends on the API's chemistry, dose and stability, and the gain must hold up on storage.",
      "تشکیل نمک، کاهش اندازه ذره (Micronization و Nanosizing)، Amorphous solid dispersion، کمپلکس با Cyclodextrin، Surfactantها و سیستم‌های لیپیدی. انتخاب به شیمی API، دوز و پایداری بستگی دارد و بهبود حاصل باید در طول نگهداری حفظ شود.",
    ),
  ),
  rnd(
    "photostability",
    "mid",
    bi("How is photostability tested?", "پایداری نوری چگونه آزمایش می‌شود؟"),
    bi(
      "The API and then the product are exposed to a defined light dose (not less than 1.2 million lux hours of visible light and 200 watt hours per square metre of near-UV), with dark controls. If the product changes, testing continues in the immediate pack and then the marketing pack to show the packaging protects it.",
      "API و سپس فرآورده در معرض دوز نوری مشخص قرار می‌گیرند (دست‌کم 1.2 میلیون lux·h نور مرئی و 200 W·h/m² نور UV نزدیک)، همراه با نمونه‌های کنترل تاریک. اگر فرآورده تغییر کند، آزمون در بسته‌بندی اولیه و سپس بسته‌بندی نهایی ادامه می‌یابد تا محافظت بسته‌بندی نشان داده شود.",
    ),
    "ICH Q1B",
  ),
  rnd(
    "tech-transfer",
    "mid",
    bi("What does a technology transfer to production include?", "انتقال فناوری به تولید شامل چه چیزهایی است؟"),
    bi(
      "The development report and the knowledge behind the process: formula, process description, CPPs and their ranges, IPCs, specifications and methods, risk assessments, equipment comparison, and the batches used. Responsibilities, acceptance criteria and the transfer protocol are agreed in advance, and analytical methods are transferred formally too.",
      "گزارش توسعه و دانشی که پشت فرایند است: فرمول، شرح فرایند، CPPها و محدوده آن‌ها، IPCها، Specificationها و روش‌های آنالیز، ارزیابی‌های ریسک، مقایسه تجهیزات و بچ‌های استفاده‌شده. مسئولیت‌ها، معیارهای پذیرش و پروتکل انتقال از قبل توافق می‌شوند و روش‌های آنالیز هم به‌طور رسمی منتقل می‌شوند.",
    ),
    "WHO TRS 961 Annex 7, ICH Q10",
  ),
  rnd(
    "moisture-sensitive",
    "mid",
    bi("Your API is sensitive to moisture. What do you change?", "API شما به رطوبت حساس است. چه چیزی را تغییر می‌دهید؟"),
    bi(
      "Avoid wet granulation (direct compression or roller compaction), choose excipients with low water content or activity, control room humidity during manufacture, and use protective packaging such as Alu-Alu blisters or bottles with a desiccant, confirmed by stability data.",
      "از Wet granulation پرهیز می‌کنم (Direct compression یا Roller compaction)، Excipientهای با رطوبت یا Water activity کم انتخاب می‌کنم، رطوبت اتاق را در ساخت کنترل می‌کنم و از بسته‌بندی محافظ مثل بلیستر Alu-Alu یا بطری همراه Desiccant استفاده می‌کنم که با داده‌های پایداری تأیید شود.",
    ),
  ),
  rnd(
    "pat",
    "advanced",
    bi("How can blend uniformity be checked without thief sampling?", "یکنواختی مخلوط را بدون Thief sampling چگونه می‌توان بررسی کرد؟"),
    bi(
      "Sampling thieves can disturb the blend and give biased results. Process analytical technology, for example an NIR probe on the blender, follows the blend in real time and shows when it reaches a steady state. The model is calibrated and validated, and stratified sampling of the dosage units supports it.",
      "Thief sampling ممکن است مخلوط را به هم بزند و نتیجه جانب‌دار بدهد. فناوری PAT، مثلاً پروب NIR روی Blender، مخلوط را به‌صورت لحظه‌ای دنبال می‌کند و نشان می‌دهد کی به حالت پایدار رسیده است. مدل آن کالیبره و صحه‌گذاری می‌شود و نمونه‌برداری لایه‌ای از واحدهای دارویی آن را پشتیبانی می‌کند.",
    ),
    "FDA PAT Guidance (2004)",
  ),
  rnd(
    "hardness-friability",
    "basic",
    bi("How are hardness, friability and disintegration related?", "سختی، Friability و Disintegration چه ارتباطی با هم دارند؟"),
    bi(
      "Higher compression force usually gives harder tablets with lower friability but slower disintegration and sometimes slower dissolution. The target is a range where tablets survive coating and packaging and still release the drug as intended; a compaction profile (force against hardness) helps choose it.",
      "نیروی پرس بیشتر معمولاً قرص سخت‌تر با Friability کمتر می‌دهد، ولی Disintegration و گاهی انحلال را کند می‌کند. هدف محدوده‌ای است که قرص روکش‌دهی و بسته‌بندی را تحمل کند و دارو را همان‌طور که باید آزاد کند. Compaction profile (نیرو در برابر سختی) به انتخاب آن کمک می‌کند.",
    ),
    "USP <1216>, USP <701>",
  ),

  // ---------------- Regulatory affairs ----------------
  ra(
    "ctd-modules",
    "basic",
    bi("What are the five modules of the CTD?", "پنج ماژول CTD کدام‌اند؟"),
    bi(
      "Module 1: regional administrative information (not part of the harmonised CTD). Module 2: summaries, including the Quality Overall Summary. Module 3: quality. Module 4: non-clinical study reports. Module 5: clinical study reports, including bioequivalence for generics.",
      "ماژول 1: اطلاعات اداری منطقه‌ای (جزء CTD هماهنگ‌شده نیست). ماژول 2: خلاصه‌ها، از جمله Quality Overall Summary. ماژول 3: کیفیت. ماژول 4: گزارش‌های مطالعات غیربالینی. ماژول 5: گزارش‌های مطالعات بالینی، از جمله Bioequivalence برای ژنریک‌ها.",
    ),
    "ICH M4",
  ),
  ra(
    "module3",
    "mid",
    bi("What is in Module 3 for the drug substance and the drug product?", "ماژول 3 برای ماده مؤثره و فرآورده شامل چیست؟"),
    bi(
      "3.2.S covers the drug substance: general information, manufacture, characterisation, control (specification, methods, validation, batch analyses), reference standards, container closure and stability. 3.2.P covers the product the same way, plus description and composition, pharmaceutical development and excipients.",
      "3.2.S ماده مؤثره را پوشش می‌دهد: اطلاعات عمومی، ساخت، شناسایی ساختار، کنترل (Specification، روش‌ها، صحه‌گذاری و آنالیز بچ‌ها)، Reference standardها، Container closure و پایداری. 3.2.P فرآورده را به همین ترتیب پوشش می‌دهد، به‌علاوه توصیف و ترکیب، Pharmaceutical development و Excipientها.",
    ),
    "ICH M4Q",
  ),
  ra(
    "qos",
    "basic",
    bi("What is the Quality Overall Summary?", "Quality Overall Summary چیست؟"),
    bi(
      "Module 2.3: a summary of Module 3 that follows its structure and lets the assessor see the key quality information and its justification without reading every report. It should not add data that is not in Module 3.",
      "ماژول 2.3: خلاصه ماژول 3 که از همان ساختار پیروی می‌کند و به ارزیاب اجازه می‌دهد اطلاعات کلیدی کیفیت و توجیه آن را بدون خواندن همه گزارش‌ها ببیند. نباید داده‌ای بیاورد که در ماژول 3 نیست.",
    ),
    "ICH M4Q",
  ),
  ra(
    "variations",
    "mid",
    bi("How are post-approval changes classified?", "تغییرات پس از تأیید چگونه طبقه‌بندی می‌شوند؟"),
    bi(
      "By their potential impact on quality, safety and efficacy. In the EU: Type IA (notify after), Type IB (notify before implementing) and Type II (approval needed). In the US: annual report, CBE-0, CBE-30 and prior approval supplement. National authorities use similar tiers; the classification decides the documents and timing.",
      "بر اساس اثر بالقوه بر کیفیت، ایمنی و اثربخشی. در اتحادیه اروپا: Type IA (اطلاع پس از اجرا)، Type IB (اطلاع پیش از اجرا) و Type II (نیاز به تأیید). در آمریکا: Annual report، CBE-0، CBE-30 و Prior approval supplement. مراجع ملی سطوح مشابهی دارند و طبقه‌بندی، مدارک و زمان‌بندی را تعیین می‌کند.",
    ),
    "EU Variations Guideline, ICH Q12",
  ),
  ra(
    "asmf",
    "mid",
    bi("What is an ASMF or DMF and why is it split?", "ASMF یا DMF چیست و چرا دو بخش دارد؟"),
    bi(
      "A file in which the API manufacturer gives the authority detailed information on the drug substance. The applicant's (open) part goes to the product applicant; the restricted part, with confidential manufacturing details, goes only to the authority. This protects the API maker's know-how while the dossier stays complete.",
      "پرونده‌ای که سازنده API اطلاعات تفصیلی ماده مؤثره را به مرجع می‌دهد. بخش Applicant (باز) به متقاضی فرآورده داده می‌شود و بخش Restricted، با جزئیات محرمانه ساخت، فقط به مرجع می‌رسد. به این ترتیب دانش فنی سازنده API محفوظ می‌ماند و پرونده هم کامل است.",
    ),
    "EMA ASMF Guideline",
  ),
  ra(
    "cep",
    "basic",
    bi("What is a CEP?", "CEP چیست؟"),
    bi(
      "A Certificate of Suitability issued by the EDQM confirming that the Ph. Eur. monograph can control the quality of a substance from a given manufacturer. It can replace much of the drug substance data in a dossier, though the applicant still owns the decision to use the supplier.",
      "گواهی Suitability که EDQM صادر می‌کند و تأیید می‌کند مونوگراف Ph. Eur. می‌تواند کیفیت یک ماده از سازنده مشخص را کنترل کند. این گواهی می‌تواند جای بخش بزرگی از داده‌های ماده مؤثره در پرونده را بگیرد، هرچند تصمیم به استفاده از آن تأمین‌کننده همچنان با متقاضی است.",
    ),
    "EDQM",
  ),
  ra(
    "be-limits",
    "mid",
    bi("What are the usual bioequivalence acceptance limits?", "حدود معمول پذیرش Bioequivalence چیست؟"),
    bi(
      "The 90% confidence interval of the test/reference ratio for AUC and Cmax must lie within 80.00–125.00%. Narrower limits apply to narrow-therapeutic-index drugs, and widened Cmax limits can be justified for highly variable drugs under defined conditions.",
      "فاصله اطمینان 90% نسبت Test به Reference برای AUC و Cmax باید در محدوده 80.00–125.00% باشد. برای داروهای با شاخص درمانی باریک حدود تنگ‌تر به کار می‌رود و برای داروهای با تغییرپذیری زیاد، گسترش حد Cmax با شرایط مشخص قابل توجیه است.",
    ),
    "EMA BE Guideline (2010)",
  ),
  ra(
    "biowaiver",
    "advanced",
    bi("When can a bioequivalence study be waived?", "چه زمانی می‌توان از مطالعه BE صرف‌نظر کرد؟"),
    bi(
      "For immediate-release products with a BCS Class I or III drug substance, when the excipients are suitable (for Class III, qualitatively the same and quantitatively very similar) and the dissolution is very rapid (Class III) or rapid (Class I) and similar to the reference across pH 1.2, 4.5 and 6.8. Additional strengths can also be waived under conditions.",
      "برای فرآورده‌های Immediate-release با ماده مؤثره BCS Class I یا III، وقتی Excipientها مناسب باشند (برای Class III از نظر کیفی یکسان و از نظر کمّی بسیار نزدیک) و انحلال در pH 1.2، 4.5 و 6.8 بسیار سریع (Class III) یا سریع (Class I) و مشابه مرجع باشد. برای قدرت‌های دیگر یک فرآورده هم با شرایطی Biowaiver ممکن است.",
    ),
    "ICH M9",
  ),
  ra(
    "q6a",
    "mid",
    bi("How do you justify a specification?", "Specification را چگونه توجیه می‌کنید؟"),
    bi(
      "Each test and limit is linked to safety and efficacy and to what the process can achieve: batch data from development, clinical or bioequivalence batches, stability trends, pharmacopoeial requirements and impurity thresholds. Limits are not set only from the capability of a few batches, and tests that add nothing can be justified out.",
      "هر آزمون و حد به ایمنی و اثربخشی و به توانایی فرایند ربط داده می‌شود: داده‌های بچ‌های توسعه، بالینی یا BE، روند پایداری، الزامات فارماکوپه و حدود ناخالصی. حدود فقط از توانایی چند بچ تعیین نمی‌شوند و آزمونی که ارزشی اضافه نمی‌کند، با توجیه حذف‌شدنی است.",
    ),
    "ICH Q6A",
  ),
  ra(
    "labelling",
    "basic",
    bi("What is the difference between the SmPC and the patient leaflet?", "تفاوت SmPC و بروشور بیمار چیست؟"),
    bi(
      "The SmPC is the product information for healthcare professionals: indications, posology, contraindications, interactions, pharmacology. The patient leaflet is written from it in plain language for patients and, in the EU, is tested for readability. Both must stay consistent with each other and with the approved data.",
      "SmPC اطلاعات فرآورده برای کادر درمان است: موارد مصرف، مقدار مصرف، موارد منع مصرف، تداخلات و فارماکولوژی. بروشور بیمار بر پایه آن و به زبان ساده برای بیمار نوشته می‌شود و در اتحادیه اروپا از نظر خوانایی آزمایش می‌شود. هر دو باید با هم و با داده‌های تأییدشده هم‌خوان باشند.",
    ),
    "EU SmPC Guideline",
  ),
  ra(
    "ectd",
    "basic",
    bi("What is the difference between CTD and eCTD?", "تفاوت CTD و eCTD چیست؟"),
    bi(
      "The CTD is the agreed structure and content of the dossier. The eCTD is its electronic format: files placed in a defined folder structure with an XML backbone, so the dossier can be updated across its lifecycle by sequences that replace, add or delete documents.",
      "CTD ساختار و محتوای توافق‌شده پرونده است. eCTD شکل الکترونیکی آن است: فایل‌ها در ساختار پوشه مشخص با یک XML backbone قرار می‌گیرند تا پرونده در طول چرخه عمر با Sequenceهایی که سندی را جایگزین، اضافه یا حذف می‌کنند به‌روز شود.",
    ),
    "ICH M8",
  ),
  ra(
    "deficiency",
    "mid",
    bi("How do you answer a deficiency letter from the authority?", "به نامه نقص پرونده از مرجع چگونه پاسخ می‌دهید؟"),
    bi(
      "Read each question for what the assessor actually needs, answer it point by point with data rather than argument, update the relevant dossier sections as well as the response, and keep to the deadline. When new studies are needed, say what is planned and when, rather than leaving a question open.",
      "هر سؤال را برای فهمیدن نیاز واقعی ارزیاب می‌خوانم، بند به بند با داده و نه با استدلال صرف پاسخ می‌دهم، علاوه بر نامه پاسخ، بخش‌های مربوط پرونده را هم به‌روز می‌کنم و موعد را رعایت می‌کنم. اگر مطالعه جدیدی لازم باشد، برنامه و زمان آن را می‌گویم، نه اینکه سؤال را باز بگذارم.",
    ),
  ),
  ra(
    "pbrer",
    "mid",
    bi("What safety reporting continues after approval?", "پس از تأیید، چه گزارش‌های ایمنی ادامه دارد؟"),
    bi(
      "Pharmacovigilance: collection and reporting of adverse reactions within set timelines, periodic benefit–risk evaluation reports (PBRER/PSUR), signal management and, where required, a risk management plan. RA keeps the label updated when the safety information changes.",
      "Pharmacovigilance: جمع‌آوری و گزارش عوارض ناخواسته در مهلت‌های تعیین‌شده، گزارش‌های دوره‌ای ارزیابی فایده و خطر (PBRER یا PSUR)، مدیریت سیگنال و در صورت الزام، Risk management plan. واحد رگولاتوری با تغییر اطلاعات ایمنی، برچسب و بروشور را به‌روز نگه می‌دارد.",
    ),
    "ICH E2C(R2)",
  ),
  ra(
    "q12",
    "advanced",
    bi("What are established conditions in ICH Q12?", "Established conditions در ICH Q12 چیست؟"),
    bi(
      "The elements of the registered information that are considered necessary to assure quality, so that changing them needs a regulatory submission. Defining them clearly, together with a post-approval change management protocol, lets the company manage other changes within its own quality system.",
      "عناصری از اطلاعات ثبت‌شده که برای تضمین کیفیت لازم شمرده می‌شوند، به‌طوری که تغییر آن‌ها به ارسال به مرجع نیاز دارد. تعریف روشن آن‌ها، همراه با Post-approval change management protocol، به شرکت اجازه می‌دهد سایر تغییرات را در سیستم کیفیت خود مدیریت کند.",
    ),
    "ICH Q12",
  ),
  ra(
    "generic-dossier",
    "basic",
    bi("How does a generic dossier differ from an innovator's?", "پرونده ژنریک با پرونده فرآورده نوآور چه تفاوتی دارد؟"),
    bi(
      "Module 3 (quality) is complete in both. For a generic, most non-clinical and clinical data (Modules 4 and 5) are replaced by reference to the innovator's data and literature, and the key clinical evidence is bioequivalence with the reference product.",
      "ماژول 3 (کیفیت) در هر دو کامل است. در ژنریک، بیشتر داده‌های غیربالینی و بالینی (ماژول 4 و 5) با ارجاع به داده‌های فرآورده نوآور و منابع علمی جایگزین می‌شود و شاهد بالینی اصلی، Bioequivalence با فرآورده مرجع است.",
    ),
  ),
  ra(
    "q1e",
    "advanced",
    bi("Can a shelf life be longer than the real-time data?", "آیا عمر قفسه‌ای می‌تواند بیشتر از داده‌های Real-time باشد؟"),
    bi(
      "Yes, to a limited extent: extrapolation beyond the long-term data is allowed when the data show little change and low variability, supported by accelerated data and, where appropriate, statistical analysis. The proposed shelf life is then confirmed with the ongoing long-term study.",
      "بله، به‌طور محدود: اگر داده‌ها تغییر و تغییرپذیری کمی نشان دهند و داده‌های Accelerated و در صورت لزوم تحلیل آماری آن را پشتیبانی کند، فراتر بردن از داده‌های Long-term مجاز است. عمر قفسه‌ای پیشنهادی سپس با ادامه مطالعه Long-term تأیید می‌شود.",
    ),
    "ICH Q1E",
  ),
  ra(
    "intelligence",
    "basic",
    bi("How do you keep up with regulatory changes?", "تغییرات نظارتی را چگونه دنبال می‌کنید؟"),
    bi(
      "Regularly following the authorities' own sites (national authority, EMA, FDA, ICH, WHO), pharmacopoeia updates and newsletters, recording what changed and assessing its impact on our products and dossiers, so that changes are planned rather than discovered at the next submission.",
      "پیگیری منظم سایت خود مراجع (مرجع ملی، EMA، FDA، ICH و WHO)، به‌روزرسانی‌های فارماکوپه و خبرنامه‌ها، ثبت تغییرات و ارزیابی اثر آن‌ها بر محصولات و پرونده‌های خودمان؛ تا تغییرات برنامه‌ریزی شوند، نه اینکه هنگام ارسال بعدی کشف شوند.",
    ),
  ),
  ra(
    "smf",
    "basic",
    bi("What is a Site Master File?", "Site Master File چیست؟"),
    bi(
      "A document prepared by the manufacturer describing its GMP activities at a site: the quality system, personnel, premises and equipment, documentation, production, quality control, distribution and self-inspection. Inspectors use it to prepare, and it is kept up to date.",
      "سندی که سازنده درباره فعالیت‌های GMP یک کارخانه تهیه می‌کند: سیستم کیفیت، پرسنل، تأسیسات و تجهیزات، مستندات، تولید، کنترل کیفیت، توزیع و Self-inspection. بازرسان برای آماده شدن از آن استفاده می‌کنند و باید به‌روز نگه داشته شود.",
    ),
    "PIC/S PE 008",
  ),

  ra(
    "exclusivity",
    "advanced",
    bi("When can a generic be filed and launched in relation to data exclusivity?", "زمان ارسال و عرضه ژنریک با توجه به Data exclusivity چگونه تعیین می‌شود؟"),
    bi(
      "Patents protect the invention; data exclusivity protects the innovator's dossier. In the EU a generic can be filed after 8 years of data exclusivity and marketed after 10 (up to 11 with a new indication). In the US a new chemical entity has 5 years of exclusivity, and patent challenges follow the Paragraph IV route. National rules differ, so both patents and exclusivity are checked before planning.",
      "پتنت از اختراع محافظت می‌کند و Data exclusivity از پرونده فرآورده نوآور. در اتحادیه اروپا ژنریک پس از 8 سال Data exclusivity قابل ارسال و پس از 10 سال (تا 11 سال با اندیکاسیون جدید) قابل عرضه است. در آمریکا ماده شیمیایی جدید 5 سال انحصار دارد و چالش پتنت از مسیر Paragraph IV انجام می‌شود. قوانین ملی متفاوت است؛ پس پیش از برنامه‌ریزی، هم پتنت‌ها و هم دوره‌های انحصار بررسی می‌شوند.",
    ),
    "Directive 2001/83/EC, 21 CFR 314.108",
  ),
  ra(
    "artwork",
    "basic",
    bi("What does RA check on packaging artwork?", "واحد رگولاتوری در طرح بسته‌بندی چه چیزهایی را بررسی می‌کند؟"),
    bi(
      "That every text matches the approved product information: name, strength and form, composition, posology and route, warnings, storage conditions, marketing authorisation holder and manufacturer, and space for batch number and expiry date, plus any national requirements such as language or codes. Each new version is approved under change control before printing.",
      "اینکه همه متن‌ها با اطلاعات تأییدشده فرآورده یکی باشند: نام، قدرت و شکل دارویی، ترکیب، مقدار و راه مصرف، هشدارها، شرایط نگهداری، دارنده مجوز و سازنده، و جای شماره بچ و تاریخ انقضا؛ به‌علاوه الزامات ملی مثل زبان یا کدها. هر نسخه جدید پیش از چاپ در Change control تأیید می‌شود.",
    ),
    "Directive 2001/83/EC Title V",
  ),

  // ---------------- Production (operator level) ----------------
  prod(
    "gmp-simple",
    bi("In simple words, what is GMP?", "به زبان ساده، GMP یعنی چه؟"),
    bi(
      "Good Manufacturing Practice: making every batch the same way, by the written procedure, clean and without mix-ups, and writing down what you did at the time you did it. The aim is that the medicine is safe and works, every time.",
      "Good Manufacturing Practice: یعنی هر بچ را به همان روش، طبق دستورالعمل مکتوب، تمیز و بدون اشتباه گرفتن مواد بسازیم و هر کاری را همان لحظه که انجام دادیم بنویسیم. هدف این است که دارو هر بار سالم و مؤثر باشد.",
    ),
    "EU GMP Chapter 1",
  ),
  prod(
    "entering",
    bi("What do you do before entering the production area?", "پیش از ورود به سالن تولید چه کارهایی انجام می‌دهید؟"),
    bi(
      "Take off jewellery, watch and make-up, change into the area's clothes and shoes in the right order, cover hair (and beard), wash and dry hands, and wear gloves and a mask where required. Food, drink and phones stay outside.",
      "زیورآلات، ساعت و آرایش را برمی‌دارم، لباس و کفش مخصوص همان ناحیه را به ترتیب درست می‌پوشم، مو (و ریش) را می‌پوشانم، دست‌ها را می‌شویم و خشک می‌کنم و در صورت لزوم دستکش و ماسک می‌زنم. خوراکی، نوشیدنی و تلفن همراه بیرون می‌ماند.",
    ),
    "EU GMP Chapter 2",
  ),
  prod(
    "prod-line-clearance",
    bi("What is line clearance?", "Line clearance یعنی چه؟"),
    bi(
      "Before starting a new batch, you check that nothing from the previous batch is left: no tablets, materials, labels or papers, on the machine, the floor or the bins. A second person checks too, and both sign the record.",
      "پیش از شروع بچ جدید بررسی می‌کنم که هیچ چیزی از بچ قبلی نمانده باشد: نه قرص، نه ماده، نه برچسب و نه کاغذ؛ روی دستگاه، کف اتاق یا سطل‌ها. نفر دوم هم بررسی می‌کند و هر دو سند را امضا می‌کنیم.",
    ),
    "EU GMP Chapter 5",
  ),
  prod(
    "batch-record",
    bi("How do you fill in the batch record?", "Batch record را چگونه پر می‌کنید؟"),
    bi(
      "At the same moment I do each step, never before or later from memory; clearly, with a pen that cannot be erased; with the real numbers I read, the time, and my signature. If a step is not done, I do not leave the box empty without a note.",
      "دقیقاً همان لحظه‌ای که هر مرحله را انجام می‌دهم؛ نه از قبل و نه بعداً از حافظه. خوانا، با خودکاری که پاک نمی‌شود، با عدد واقعی که خوانده‌ام، ساعت و امضای خودم. اگر مرحله‌ای انجام نشده باشد، خانه آن را بدون توضیح خالی نمی‌گذارم.",
    ),
    "EU GMP Chapter 4",
  ),
  prod(
    "mistake-record",
    bi("You wrote a wrong number in the record. What do you do?", "در سند عدد اشتباهی نوشته‌اید. چه می‌کنید؟"),
    bi(
      "I draw one line through it so it can still be read, write the correct number next to it, and add my signature, the date and, if needed, the reason. I never use correction fluid, scratch it out or tear out the page.",
      "روی آن یک خط می‌کشم تا هنوز خوانا باشد، عدد درست را کنارش می‌نویسم و امضا، تاریخ و در صورت لزوم دلیل را اضافه می‌کنم. هرگز از لاک غلط‌گیر استفاده نمی‌کنم، آن را خط‌خطی نمی‌کنم و صفحه را پاره نمی‌کنم.",
    ),
    "EU GMP Chapter 4",
  ),
  prod(
    "status-labels",
    bi("What do the status labels on a machine mean?", "برچسب‌های وضعیت روی دستگاه چه معنایی دارند؟"),
    bi(
      "They show whether the machine is clean and ready, dirty and waiting to be cleaned, in use (with the product and batch number), or out of order. You only start work on a machine labelled clean, and you change the label when its state changes.",
      "نشان می‌دهند دستگاه تمیز و آماده است، کثیف و منتظر نظافت است، در حال کار است (با نام محصول و شماره بچ) یا خراب است. فقط روی دستگاهی کار را شروع می‌کنم که برچسب تمیز دارد و با تغییر وضعیت، برچسب را عوض می‌کنم.",
    ),
    "EU GMP Chapter 5",
  ),
  prod(
    "weighing",
    bi("What do you check when weighing materials?", "هنگام توزین مواد چه چیزهایی را بررسی می‌کنید؟"),
    bi(
      "That the balance was checked that day and is level and clean; that the material's name, code and batch number match the batch record and its label says released; the correct quantity; and that each weighed material is labelled and checked by a second person.",
      "اینکه ترازو همان روز چک شده، تراز و تمیز است؛ نام، کد و شماره بچ ماده با Batch record یکی است و برچسب آن «آزادشده» است؛ مقدار درست است؛ و هر ماده توزین‌شده برچسب دارد و نفر دوم آن را کنترل می‌کند.",
    ),
  ),
  prod(
    "machine-fault",
    bi("The machine stops or behaves strangely during the batch. What do you do?", "وسط بچ دستگاه متوقف می‌شود یا رفتار غیرعادی دارد. چه می‌کنید؟"),
    bi(
      "Stop it safely, do not try to fix it myself unless I am trained for it, tell my supervisor at once, and write down what happened and when. Product made during the fault is kept apart until it is checked.",
      "دستگاه را به‌طور ایمن متوقف می‌کنم، اگر آموزشش را ندیده‌ام خودم تعمیرش نمی‌کنم، فوراً به سرپرست اطلاع می‌دهم و می‌نویسم چه اتفاقی و چه زمانی افتاد. محصولی که در زمان اشکال تولید شده جدا نگه داشته می‌شود تا بررسی شود.",
    ),
  ),
  prod(
    "deviation-simple",
    bi("You see something was not done as the procedure says. What do you do?", "می‌بینید کاری طبق دستورالعمل انجام نشده است. چه می‌کنید؟"),
    bi(
      "I report it straight away to my supervisor, even if it was my own mistake, and do not hide or fix it quietly. It is recorded as a deviation so the cause can be found and the batch assessed. Reporting is always better than hiding.",
      "فوراً به سرپرست گزارش می‌دهم، حتی اگر اشتباه خودم بوده باشد، و آن را پنهان یا بی‌صدا درست نمی‌کنم. موضوع به‌عنوان Deviation ثبت می‌شود تا علت پیدا و بچ ارزیابی شود. گزارش دادن همیشه بهتر از پنهان کردن است.",
    ),
    "EU GMP Chapter 1",
  ),
  prod(
    "sop",
    bi("What is an SOP and why must you follow it?", "SOP چیست و چرا باید از آن پیروی کرد؟"),
    bi(
      "A standard operating procedure: the written, approved instructions for a task. Following it means everyone does the task the same, correct way. If the SOP cannot be followed or seems wrong, I tell my supervisor instead of doing it my own way.",
      "Standard operating procedure: دستورالعمل مکتوب و تأییدشده برای یک کار. پیروی از آن یعنی همه آن کار را به یک روش یکسان و درست انجام دهند. اگر نتوان طبق SOP کار کرد یا اشتباه به نظر برسد، به‌جای اینکه به روش خودم کار کنم، به سرپرست می‌گویم.",
    ),
    "EU GMP Chapter 4",
  ),
  prod(
    "cross-contamination",
    bi("How do you prevent one product mixing into another?", "چگونه از ورود یک محصول به محصول دیگر جلوگیری می‌کنید؟"),
    bi(
      "Only one product and batch in a room at a time, line clearance before each batch, clean equipment with a clean label, closed containers, the right clothes for the room, and keeping doors and pressure differences as they should be.",
      "در هر اتاق در یک زمان فقط یک محصول و یک بچ، Line clearance پیش از هر بچ، تجهیزات تمیز با برچسب تمیز، ظرف‌های دربسته، لباس مناسب همان اتاق، و رعایت بسته بودن درها و اختلاف فشار اتاق‌ها همان‌طور که باید باشد.",
    ),
    "EU GMP Chapter 5",
  ),
  prod(
    "cleaning-simple",
    bi("How do you clean a machine after a batch?", "پس از پایان بچ، دستگاه را چگونه نظافت می‌کنید؟"),
    bi(
      "Exactly by its cleaning SOP: take apart the parts it lists, use the approved cleaning agent and water, rinse and dry, check that it is visibly clean, fill in the cleaning record and put on the clean label. If the machine waits too long dirty, I tell my supervisor, because there is a time limit.",
      "دقیقاً طبق SOP نظافت همان دستگاه: قطعاتی را که گفته شده باز می‌کنم، از شوینده تأییدشده و آب استفاده می‌کنم، آبکشی و خشک می‌کنم، بررسی می‌کنم که از نظر ظاهری تمیز باشد، سند نظافت را پر می‌کنم و برچسب تمیز می‌زنم. اگر دستگاه بیش از حد کثیف بماند، به سرپرست می‌گویم، چون محدودیت زمانی دارد.",
    ),
  ),
  prod(
    "defects",
    bi("You see chipped or spotted tablets on the line. What do you do?", "روی خط قرص لب‌پریده یا لکه‌دار می‌بینید. چه می‌کنید؟"),
    bi(
      "Tell the supervisor and the IPC person, keep the defective tablets and the tablets made at that time apart, and do not just throw them away. The cause is found and the machine set up again before continuing.",
      "به سرپرست و مسئول IPC اطلاع می‌دهم، قرص‌های معیوب و قرص‌هایی را که در همان زمان تولید شده‌اند جدا نگه می‌دارم و آن‌ها را دور نمی‌ریزم. پیش از ادامه کار، علت پیدا و دستگاه دوباره تنظیم می‌شود.",
    ),
  ),
  prod(
    "ipc",
    bi("Which in-process checks are done during tablet compression?", "در حین پرس قرص چه کنترل‌هایی انجام می‌شود؟"),
    bi(
      "At the times the batch record says: weight of single tablets and of a group, hardness, thickness and appearance, and sometimes friability and disintegration. Every result is written down; a result out of the limit is reported and the machine adjusted before going on.",
      "در زمان‌هایی که Batch record مشخص کرده: وزن تک‌قرص و وزن گروهی، سختی، ضخامت و ظاهر، و گاهی Friability و Disintegration. هر نتیجه ثبت می‌شود و نتیجه خارج از حد گزارش و پیش از ادامه، دستگاه تنظیم می‌شود.",
    ),
  ),
  prod(
    "safety",
    bi("What protects you from dust and machines at work?", "در محیط کار، چه چیزهایی شما را در برابر گرد و غبار و دستگاه‌ها محافظت می‌کند؟"),
    bi(
      "The personal protective equipment the area requires: mask or respirator, gloves, goggles and ear protection; dust extraction kept on; machine guards never removed; and switching the machine off and locking it before cleaning or touching moving parts.",
      "تجهیزات حفاظت فردی که همان ناحیه لازم دارد: ماسک یا رسپیراتور، دستکش، عینک و گوشی؛ روشن نگه داشتن مکنده گرد و غبار؛ هرگز برنداشتن حفاظ دستگاه؛ و خاموش و قفل کردن دستگاه پیش از نظافت یا دست زدن به قطعات متحرک.",
    ),
  ),
  prod(
    "illness",
    bi("You have a cold or a cut on your hand. What do you do?", "سرماخورده‌اید یا دستتان زخم شده است. چه می‌کنید؟"),
    bi(
      "Tell my supervisor before starting work. Someone who is ill or has an open wound may be moved away from open product until it is safe, so that the medicine is not contaminated.",
      "پیش از شروع کار به سرپرست اطلاع می‌دهم. کسی که بیمار است یا زخم باز دارد ممکن است تا زمان ایمن شدن، از کار با محصول باز دور شود تا دارو آلوده نشود.",
    ),
    "EU GMP Chapter 2",
  ),
  prod(
    "material-status",
    bi("What is the difference between quarantine, released and rejected materials?", "تفاوت مواد قرنطینه، آزادشده و مردود چیست؟"),
    bi(
      "Quarantine: waiting for QC results, not to be used yet. Released: approved by QA and can be used. Rejected: must not be used, kept apart until it is disposed of. You only take released materials, and the status label shows which is which.",
      "قرنطینه: منتظر نتیجه QC است و هنوز نباید مصرف شود. آزادشده: QA تأیید کرده و قابل مصرف است. مردود: نباید مصرف شود و تا معدوم شدن جدا نگه داشته می‌شود. فقط مواد آزادشده را برمی‌دارم و برچسب وضعیت نشان می‌دهد کدام است.",
    ),
    "EU GMP Chapter 5",
  ),
  prod(
    "reconciliation",
    bi("What is reconciliation in packaging?", "Reconciliation در بسته‌بندی یعنی چه؟"),
    bi(
      "Counting at the end what was received, what was used, what was damaged and what is returned, for products and printed materials such as labels and leaflets. The numbers must add up within the limit; if they do not, it is reported, because a missing label could end up on the wrong product.",
      "در پایان کار شمارش می‌کنیم چه مقدار تحویل گرفته شد، چه مقدار مصرف شد، چه مقدار خراب شد و چه مقدار برگشت داده می‌شود؛ هم برای محصول و هم برای مواد چاپی مثل برچسب و بروشور. اعداد باید در حد مجاز با هم بخوانند؛ اگر نخوانند گزارش می‌شود، چون برچسب گم‌شده ممکن است روی محصول اشتباه برود.",
    ),
    "EU GMP Chapter 5",
  ),
  prod(
    "prod-training",
    bi("Why is training needed before doing a new task?", "چرا پیش از انجام یک کار جدید آموزش لازم است؟"),
    bi(
      "So that the task is done the right way from the first time and I know its risks. I do not do a task I have not been trained and signed off for, even if a colleague asks; I ask for the training first.",
      "تا کار از همان بار اول درست انجام شود و خطرهای آن را بشناسم. کاری را که آموزشش را ندیده‌ام و تأیید نگرفته‌ام انجام نمی‌دهم، حتی اگر همکاری بخواهد؛ اول آموزش آن را درخواست می‌کنم.",
    ),
    "EU GMP Chapter 2",
  ),
  prod(
    "handover",
    bi("What do you hand over at the end of your shift?", "در پایان شیفت چه چیزهایی را تحویل می‌دهید؟"),
    bi(
      "The state of the batch and the step it is at, the records filled up to that point, any problem or deviation that happened, the machines' status and the materials in the room, both in person and in the shift log, so the next shift starts without guessing.",
      "وضعیت بچ و مرحله‌ای که در آن است، سوابقی که تا همان لحظه پر شده، هر مشکل یا Deviationی که پیش آمده، وضعیت دستگاه‌ها و مواد موجود در اتاق؛ هم حضوری و هم در دفتر شیفت، تا شیفت بعد بدون حدس زدن کار را شروع کند.",
    ),
  ),

  // ---------------- General ----------------
  gen(
    "intro",
    bi("Tell us about yourself.", "خودتان را معرفی کنید."),
    bi("A short, relevant picture of you: background, experience and why you fit this post, not your life story.", "تصویری کوتاه و مرتبط از شما: تحصیلات، تجربه و اینکه چرا برای این شغل مناسب هستید؛ نه شرح کامل زندگی."),
    bi(
      "“I hold a Pharm.D. and have three years of experience in quality control, mainly HPLC analysis and dissolution testing. In my previous role I was responsible for drafting and executing method transfer protocols, and I set that process up from the start. I now want to build deeper expertise in method validation, which is why this position fits my career path.”",
      "«دانش‌آموخته دکتری عمومی داروسازی هستم و سه سال سابقه کار در واحد کنترل کیفیت (QC) دارم؛ عمده تجربه من در آنالیز با HPLC و آزمون Dissolution بوده است. در سازمان قبلی، مسئولیت تدوین و اجرای پروتکل‌های Method transfer با من بود و این فرایند را از ابتدا راه‌اندازی کردم. اکنون به دنبال فرصتی هستم که تخصصم را در حوزه Method validation عمیق‌تر کنم و به همین دلیل، این موقعیت را با مسیر حرفه‌ای خود هم‌راستا می‌دانم.»",
    ),
    bi("Reciting your CV line by line, personal details that do not matter for the job, or talking for more than about two minutes.", "خواندن خط‌به‌خط رزومه، جزئیات شخصی بی‌ربط به شغل، یا صحبت طولانی‌تر از حدود دو دقیقه."),
  ),
  gen(
    "challenge",
    bi("What is the biggest challenge you have faced at work?", "بزرگ‌ترین چالش کاری شما تا امروز چه بوده است؟"),
    bi("How you handle a hard problem. Answer with the STAR structure: Situation, Task, Action, Result.", "اینکه با یک مشکل سخت چگونه برخورد می‌کنید. با ساختار STAR پاسخ دهید: موقعیت، وظیفه، اقدام و نتیجه."),
    bi(
      "“A product kept failing dissolution at 6 months (situation). I had to find the cause before the next submission (task). I compared batches, found a change in the lubricant supplier, and ran a small study (action). We changed the blending time and the next batches passed; the change was handled under change control (result).”",
      "«یک فرآورده مدام در انحلال ماه ششم رد می‌شد (موقعیت). باید پیش از ارسال بعدی علت را پیدا می‌کردم (وظیفه). بچ‌ها را مقایسه کردم، تغییر تأمین‌کننده Lubricant را پیدا کردم و یک مطالعه کوچک انجام دادم (اقدام). زمان اختلاط را تغییر دادیم و بچ‌های بعدی قبول شدند و تغییر در Change control ثبت شد (نتیجه).»",
    ),
    bi("A challenge that was really someone else's fault, a problem with no result, or a story that shows you broke a procedure.", "چالشی که در واقع تقصیر دیگری بوده، مشکلی بدون نتیجه، یا داستانی که نشان دهد از روش اجرایی تخطی کرده‌اید."),
  ),
  gen(
    "achievement",
    bi("What is your biggest professional achievement?", "بزرگ‌ترین دستاورد کاری شما چیست؟"),
    bi("Something concrete you did, with a measurable result, that relates to this job.", "کاری مشخص که خودتان انجام داده‌اید، با نتیجه قابل اندازه‌گیری و مرتبط با همین شغل."),
    bi(
      "“I reorganised the stability sample schedule: missed pulls went from several a month to none in a year, and the audit found no stability observations.”",
      "«برنامه نمونه‌برداری پایداری را بازنویسی کردم: نمونه‌برداری‌های جاافتاده از چند مورد در ماه به صفر در یک سال رسید و در ممیزی هیچ یافته‌ای درباره پایداری نداشتیم.»",
    ),
    bi("A team result you present as only yours, a vague answer with no number, or an achievement unrelated to the work.", "نتیجه کار تیمی که فقط به نام خودتان بگویید، پاسخ کلی بدون عدد، یا دستاوردی که به این کار ربطی ندارد."),
  ),
  gen(
    "leaving",
    bi("Why did you leave (or want to leave) your previous company?", "چرا از شرکت قبلی خارج شدید (یا می‌خواهید خارج شوید)؟"),
    bi("Whether you leave for a positive reason and will speak about this company the same way one day.", "اینکه به دلیلی مثبت جدا می‌شوید و روزی درباره همین شرکت هم با همین احترام صحبت خواهید کرد."),
    bi(
      "“I learned a lot there, but the role had no room left to grow into validation work. This post offers that, and it is the direction I want to go.”",
      "«در آن شرکت تجربه‌های ارزشمندی به دست آوردم، اما آن نقش دیگر فرصتی برای رشد در حوزه صحه‌گذاری نداشت. این موقعیت چنین فرصتی دارد و همان مسیری است که می‌خواهم.»",
    ),
    bi("Criticising your former manager or colleagues, complaining, or making salary the only reason.", "انتقاد از مدیر یا همکاران قبلی، گلایه کردن، یا اینکه حقوق را تنها دلیل بگویید."),
  ),
  gen(
    "thesis",
    bi("What was your thesis about?", "موضوع پایان‌نامه شما چه بود؟"),
    bi("That you can explain technical work simply, know your own project and can link it to the job.", "اینکه می‌توانید کار تخصصی را ساده توضیح دهید، پروژه خودتان را می‌شناسید و می‌توانید آن را به این شغل ربط دهید."),
    bi(
      "“I developed and validated an HPLC method for two impurities in a cream. Beyond the method, it taught me how to plan experiments and document them, which is daily work in QC.”",
      "«یک روش HPLC برای دو ناخالصی در یک کرم توسعه دادم و صحه‌گذاری کردم. فراتر از خود روش، یاد گرفتم آزمایش‌ها را برنامه‌ریزی و مستند کنم؛ کاری که در QC هر روز انجام می‌شود.»",
    ),
    bi("Explaining it with jargon for minutes, or not being able to say what you yourself did and what you found.", "توضیح طولانی با اصطلاحات پیچیده، یا اینکه نتوانید بگویید خودتان چه کاری کردید و به چه نتیجه‌ای رسیدید."),
  ),
  gen(
    "teamwork",
    bi("How good are you at teamwork?", "در کار تیمی چقدر توانا هستید؟"),
    bi("A real example of working with others, not just the word “teamwork”.", "یک مثال واقعی از کار با دیگران، نه فقط تکرار کلمه «کار تیمی»."),
    bi(
      "“During a product transfer I worked with production, QA and R&D. I kept a shared list of open points and we met briefly every morning; the first batches went through without a deviation.”",
      "«در انتقال یک محصول با تولید، QA و تحقیق و توسعه کار کردم. یک فهرست مشترک از موارد باز نگه داشتم و هر صبح جلسه کوتاهی داشتیم؛ بچ‌های اول بدون Deviation انجام شدند.»",
    ),
    bi("Saying you prefer to work alone, or claiming you never disagree with anyone.", "گفتن اینکه ترجیح می‌دهید تنها کار کنید، یا ادعای اینکه هرگز با کسی اختلاف‌نظر ندارید."),
  ),
  gen(
    "conflict",
    bi("If a problem comes up with a colleague, what is the best way to handle it?", "اگر با همکاری مشکلی پیش بیاید، بهترین راه برخورد چیست؟"),
    bi("That you deal with conflict directly, calmly and with the work in mind, and escalate only when needed.", "اینکه با اختلاف مستقیم، آرام و با تمرکز بر کار برخورد می‌کنید و فقط در صورت نیاز آن را به سطح بالاتر می‌برید."),
    bi(
      "“I talk to the person privately first, listen to their view and focus on the work, not the person. Usually we agree on a way forward. If it affects quality or safety and we cannot agree, I take it to our supervisor together.”",
      "«اول خصوصی با همان فرد صحبت می‌کنم، دیدگاهش را می‌شنوم و روی کار تمرکز می‌کنم، نه روی شخص. معمولاً به راهی مشترک می‌رسیم. اگر موضوع به کیفیت یا ایمنی مربوط باشد و به توافق نرسیم، با هم آن را با سرپرست مطرح می‌کنیم.»",
    ),
    bi("Saying you go straight to the manager, avoid the person, or that conflicts never happen to you.", "گفتن اینکه مستقیم پیش مدیر می‌روید، از آن فرد دوری می‌کنید، یا اینکه هرگز برایتان اختلافی پیش نمی‌آید."),
  ),
  gen(
    "why-us",
    bi("Why did you choose our company?", "چرا شرکت ما را برای کار انتخاب کردید؟"),
    bi("That you know the company and have reasons that match what it offers.", "اینکه شرکت را می‌شناسید و دلایلتان با آنچه شرکت ارائه می‌دهد جور است."),
    bi(
      "“You make sterile products, which is where I want to build my experience, and your recent GMP certification shows a strong quality system to learn from.”",
      "«شما فرآورده‌های استریل می‌سازید که همان حوزه‌ای است که می‌خواهم در آن تجربه کسب کنم، و گواهی GMP اخیرتان نشان می‌دهد سیستم کیفیت قوی‌ای دارید که می‌توان از آن یاد گرفت.»",
    ),
    bi("A general answer that fits any company, or only mentioning salary and distance from home.", "پاسخ کلی که برای هر شرکتی صدق کند، یا اشاره فقط به حقوق و نزدیکی به خانه."),
  ),
  gen(
    "strengths",
    bi("What are your strengths?", "نقاط قوت شما چیست؟"),
    bi("Two or three strengths that matter for the job, each backed by an example.", "دو یا سه نقطه قوت مرتبط با شغل، هر کدام همراه با یک مثال."),
    bi(
      "“I am careful with documentation: in two audits my records had no findings. And I learn instruments quickly: I was the first in our lab trained on the new dissolution system.”",
      "«در مستندسازی دقیق هستم: در دو ممیزی، سوابق من هیچ یافته‌ای نداشت. و دستگاه‌ها را سریع یاد می‌گیرم: اولین نفر آزمایشگاه بودم که روی سیستم انحلال جدید آموزش دید.»",
    ),
    bi("A long list of adjectives with no example, or strengths unrelated to the post.", "فهرست طولانی صفت‌ها بدون مثال، یا نقاط قوت بی‌ربط به شغل."),
  ),
  gen(
    "weakness",
    bi("What is your weakness?", "نقطه ضعف شما چیست؟"),
    bi("Self-awareness and what you are doing to improve.", "خودشناسی و کاری که برای بهتر شدن انجام می‌دهید."),
    bi(
      "“I used to find it hard to say no and took on too much. Now I list my tasks with their deadlines and agree priorities with my supervisor when new work comes in.”",
      "«پیش‌تر برایم دشوار بود درخواستی را رد کنم و مسئولیت‌های بیش از حد می‌پذیرفتم. اکنون کارهایم را با موعدشان فهرست می‌کنم و هنگام دریافت کار جدید، اولویت‌ها را با سرپرست هماهنگ می‌کنم.»",
    ),
    bi("“I am a perfectionist” as a disguised strength, or a weakness central to the job, such as being careless with records.", "پاسخ «من کمال‌گرا هستم» که نقطه قوت پنهان است، یا ضعفی که در قلب همین شغل است؛ مثل بی‌دقتی در ثبت سوابق."),
  ),
  gen(
    "five-years",
    bi("Where do you see yourself in five years?", "پنج سال دیگر خودتان را کجا می‌بینید؟"),
    bi("Whether your plans fit what the company can offer and whether you are likely to stay.", "اینکه برنامه‌هایتان با آنچه شرکت می‌تواند ارائه دهد جور است و احتمال ماندنتان زیاد است یا نه."),
    bi(
      "“Leading a small validation team, having learned the main techniques here and taken part in a few registrations.”",
      "«سرپرستی یک تیم کوچک صحه‌گذاری، پس از اینکه تکنیک‌های اصلی را اینجا یاد گرفته‌ام و در چند پرونده ثبت مشارکت داشته‌ام.»",
    ),
    bi("Saying you plan to leave the country or the field, or that you want the interviewer's own job.", "گفتن اینکه قصد مهاجرت یا تغییر رشته دارید، یا اینکه می‌خواهید جای خود مصاحبه‌کننده را بگیرید."),
  ),
  gen(
    "salary",
    bi("What salary do you expect?", "چه حقوقی انتظار دارید؟"),
    bi("Whether your expectation is realistic and you can discuss it professionally.", "اینکه انتظارتان واقع‌بینانه است و می‌توانید حرفه‌ای درباره آن صحبت کنید."),
    bi(
      "“From what I know of the market for this post and my experience, I would expect a range of about … ; I am also interested in the training and benefits that come with it.”",
      "«با شناختی که از بازار این شغل و تجربه خودم دارم، انتظار محدوده‌ای حدود … را دارم؛ آموزش و مزایایی که همراه آن است هم برایم مهم است.»",
    ),
    bi("Refusing to give any figure, naming a number far from the market, or making it the first thing you ask about.", "خودداری از گفتن هر عددی، گفتن عددی دور از بازار، یا اینکه اولین سؤالتان حقوق باشد."),
  ),
  gen(
    "pressure",
    bi("How do you work under pressure and deadlines?", "زیر فشار کاری و با موعد تنگ چگونه کار می‌کنید؟"),
    bi("That you stay organised and do not cut corners on quality.", "اینکه منظم می‌مانید و کیفیت را فدای سرعت نمی‌کنید."),
    bi(
      "“I break the work into steps, start with what blocks others, and tell my supervisor early if the deadline is at risk. I do not skip a check to save time.”",
      "«کار را به مراحل تقسیم می‌کنم، از کاری شروع می‌کنم که کار دیگران به آن وابسته است، و اگر موعد در خطر باشد زود به سرپرست می‌گویم. برای صرفه‌جویی در وقت، کنترلی را حذف نمی‌کنم.»",
    ),
    bi("Saying you work best at the last minute, or that you would skip steps to meet a deadline.", "گفتن اینکه در لحظه آخر بهتر کار می‌کنید، یا اینکه برای رسیدن به موعد مراحلی را حذف می‌کنید."),
  ),
  gen(
    "mistake",
    bi("Tell us about a mistake you made and what you learned.", "از اشتباهی که کرده‌اید و درسی که گرفتید بگویید."),
    bi("Honesty, ownership and what changed afterwards.", "صداقت، پذیرفتن مسئولیت و اینکه بعد از آن چه چیزی تغییر کرد."),
    bi(
      "“I once prepared a standard from the wrong lot. I reported it as soon as I noticed, we repeated the analysis, and since then I check the lot number against the record before weighing; I also suggested adding that check to the SOP.”",
      "«یک بار Standard را از Lot اشتباه آماده کردم. به محض متوجه شدن گزارش دادم، آنالیز را تکرار کردیم و از آن به بعد پیش از توزین، شماره Lot را با سند مقایسه می‌کنم؛ پیشنهاد اضافه شدن این کنترل به SOP را هم دادم.»",
    ),
    bi("Saying you have never made a mistake, or choosing one you hid or that harmed a patient.", "گفتن اینکه هرگز اشتباه نکرده‌اید، یا انتخاب اشتباهی که پنهان کردید یا به بیمار آسیب زد."),
  ),
  gen(
    "why-hire",
    bi("Why should we hire you?", "چرا باید شما را استخدام کنیم؟"),
    bi("A short summary linking your skills to what the job needs.", "خلاصه‌ای کوتاه که مهارت‌های شما را به نیازهای شغل ربط دهد."),
    bi(
      "“You need someone who can run HPLC and dissolution independently and keep records audit-ready. I have done both for three years, and I learn new systems quickly.”",
      "«شما کسی را لازم دارید که HPLC و انحلال را مستقل انجام دهد و سوابق را آماده ممیزی نگه دارد. من سه سال هر دو کار را انجام داده‌ام و سیستم‌های جدید را سریع یاد می‌گیرم.»",
    ),
    bi("Comparing yourself with other candidates, or listing things the job does not need.", "مقایسه خودتان با سایر داوطلبان، یا برشمردن چیزهایی که شغل به آن نیاز ندارد."),
  ),
  gen(
    "know-company",
    bi("What do you know about our company?", "درباره شرکت ما چه می‌دانید؟"),
    bi("That you prepared: products, sites, recent news, and the department you would join.", "اینکه آماده شده‌اید: محصولات، کارخانه‌ها، خبرهای اخیر و واحدی که در آن کار خواهید کرد."),
    bi(
      "“You make mainly oral solids and some creams, export to neighbouring countries, and opened a new line last year. I read that you are expanding the QC lab, which is why I applied.”",
      "«بیشتر اشکال جامد خوراکی و چند کرم می‌سازید، به کشورهای همسایه صادرات دارید و سال گذشته خط جدیدی راه انداختید. خواندم که در حال گسترش آزمایشگاه QC هستید و به همین دلیل درخواست دادم.»",
    ),
    bi("Saying you know nothing, or getting basic facts wrong; check the company's site and catalogue before the interview.", "گفتن اینکه چیزی نمی‌دانید، یا اشتباه در اطلاعات پایه؛ پیش از مصاحبه سایت و کاتالوگ شرکت را ببینید."),
  ),
  gen(
    "shifts",
    bi("Can you work shifts or overtime when needed?", "در صورت نیاز می‌توانید شیفتی یا اضافه‌کار کار کنید؟"),
    bi("A clear, honest answer about your availability.", "پاسخی روشن و صادقانه درباره امکان حضورتان."),
    bi(
      "“Yes, I have worked in two shifts before. I would just like to know in advance how the schedule is planned.”",
      "«بله، قبلاً دو شیفته کار کرده‌ام. فقط دوست دارم از قبل بدانم برنامه شیفت‌ها چگونه تنظیم می‌شود.»",
    ),
    bi("Saying yes to everything when it is not true for you; an honest limit is better than a promise you cannot keep.", "بله گفتن به همه چیز وقتی برایتان ممکن نیست؛ یک محدودیت صادقانه بهتر از قولی است که نمی‌توانید پایش بمانید."),
  ),
  gen(
    "up-to-date",
    bi("How do you keep your knowledge up to date?", "دانش خود را چگونه به‌روز نگه می‌دارید؟"),
    bi("Real habits of learning that fit the field.", "عادت‌های واقعی یادگیری که با این رشته جور باشد."),
    bi(
      "“I follow pharmacopoeia and ICH updates, read the guidance that affects my work, and take short courses; recently I studied the revised Annex 1 for our sterile area.”",
      "«به‌روزرسانی‌های فارماکوپه و ICH را دنبال می‌کنم، رهنمودهایی را که به کارم مربوط است می‌خوانم و دوره‌های کوتاه می‌گذرانم؛ اخیراً Annex 1 بازنگری‌شده را برای ناحیه استریل مطالعه کردم.»",
    ),
    bi("A vague “I read a lot”, or naming sources you cannot talk about if asked.", "پاسخ کلی «زیاد مطالعه می‌کنم»، یا نام بردن منابعی که اگر پرسیده شود نمی‌توانید درباره‌شان صحبت کنید."),
  ),
  gen(
    "disagree-manager",
    bi("What do you do if you disagree with your manager?", "اگر با مدیرتان مخالف باشید چه می‌کنید؟"),
    bi("That you can raise a concern respectfully with facts, and accept the decision unless it breaks GMP or safety.", "اینکه می‌توانید نگرانی را محترمانه و با داده مطرح کنید و تصمیم را بپذیرید، مگر اینکه خلاف GMP یا ایمنی باشد."),
    bi(
      "“I explain my view privately with the data behind it and listen to theirs. If it is a matter of approach, I follow the decision. If it would break GMP or put patients at risk, I raise it through the quality system.”",
      "«دیدگاهم را خصوصی و با داده‌ای که پشت آن است توضیح می‌دهم و نظر او را هم می‌شنوم. اگر موضوع فقط سلیقه کاری باشد، از تصمیم پیروی می‌کنم. اگر خلاف GMP باشد یا بیمار را در خطر بگذارد، آن را از مسیر سیستم کیفیت مطرح می‌کنم.»",
    ),
    bi("Saying you would just do what you think is right, or that you would never question a manager.", "گفتن اینکه به هر حال کاری را که خودتان درست می‌دانید انجام می‌دهید، یا اینکه هرگز با مدیر مخالفت نمی‌کنید."),
  ),
  gen(
    "questions",
    bi("Do you have any questions for us?", "سؤالی از ما دارید؟"),
    bi("Interest in the job; this is your chance to learn whether it suits you.", "علاقه به شغل؛ این فرصت شماست تا بفهمید این کار برایتان مناسب است یا نه."),
    bi(
      "“What would my first three months look like? How is training organised? What are the main challenges of the team right now?”",
      "«سه ماه اول کار من چگونه خواهد بود؟ آموزش چگونه برنامه‌ریزی می‌شود؟ چالش‌های اصلی تیم در حال حاضر چیست؟»",
    ),
    bi("Saying you have no questions, or asking only about leave and salary.", "گفتن اینکه سؤالی ندارید، یا پرسیدن فقط درباره مرخصی و حقوق."),
  ),
];
