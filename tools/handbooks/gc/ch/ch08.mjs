import { chapter, h2, h3, p, ul, box, table } from "../lib.mjs";

export default () => `
${chapter("فصل 8", "سایر کاربردهای GC در صنعت دارو", "Chapter 8 — Other GC applications in pharmaceutical QC")}
${p("کاربرد GC در کنترل کیفیت دارویی به Residual solvents محدود نیست. این فصل مهم‌ترین کاربردهای دیگر را با منطق روش و نکات عملی مرور می‌کند؛ شرایط دقیق هر آزمون را از مونوگراف یا فصل عمومی مربوط بخوانید.")}
${h2("Diethylene glycol و Ethylene glycol")}
${p(
  "آلودگی گلیسرین، پروپیلن گلیکول و سایر اجزای پرخطر با DEG و EG بارها در جهان به مسمومیت‌های کشنده، عمدتاً در کودکان، منجر شده است. FDA در May 2023 راهنمای «Testing of Glycerin, Propylene Glycol, Maltitol Solution, Hydrogenated Starch Hydrolysate, Sorbitol Solution, and other High-Risk Drug Components for Diethylene Glycol and Ethylene Glycol» را منتشر کرد که جایگزین راهنمای سال 2007 است.",
)}
${ul([
  "<b>حد ایمنی</b>: DEG و EG هر کدام حداکثر 0.10 درصد، همان حدی که در بخش Identification مونوگراف‌های USP-NF این اجزا آمده است.",
  "<b>نمونه‌برداری</b>: FDA توصیه می‌کند از <b>هر ظرف هر بچ</b> جزء پرخطر نمونه گرفته و آزمون شود، پیش از مصرف در ساخت.",
  "<b>اجزای دیگر</b>: علاوه بر اجزای نام‌برده در عنوان، اجزایی مانند Sorbitol sorbitan solution، Noncrystallizing sorbitol solution، Polyethylene glycol و Diethylene glycol stearates نیز پرخطر شمرده شده‌اند و سازنده باید به آزمون DEG و EG در مونوگراف جاری آن‌ها مراجعه کند.",
  "<b>روش</b>: آزمون با GC و FID بر اساس مونوگراف USP-NF، با محلول استاندارد DEG و EG در حد 0.10 درصد. تکیه فقط بر گواهی آنالیز تأمین‌کننده کافی نیست.",
])}
${box(
  "lab",
  "",
  p("در آزمون DEG و EG، SST معمولاً شامل Resolution بین پیک‌های EG، DEG و ماده اصلی است. پیک بزرگ گلیسرین یا پروپیلن گلیکول دنباله‌دار است و می‌تواند پیک کوچک DEG را بپوشاند؛ Liner تمیز، ستون سالم و تزریق حجم کم برای حفظ Resolution ضروری است. محلول استاندارد را در همان ماتریکس (ماده بدون DEG و EG) تهیه کنید تا اثر ماتریکس در زمان ماند و پاسخ ارزیابی شود."),
)}
${h2("ترکیب اسیدهای چرب (FAME)")}
${p(
  "روغن‌های گیاهی، چربی‌ها و Excipientهای چرب (مانند روغن سویا، روغن زیتون و پلی‌سوربات‌ها) با تعیین ترکیب اسیدهای چرب شناسایی و کنترل می‌شوند. اسیدهای چرب ابتدا به استرهای متیل (Fatty acid methyl esters) تبدیل می‌شوند تا فرار شوند، سپس روی ستون قطبی (معمولاً PEG یا سیانوپروپیل) جدا می‌شوند. Ph. Eur. 2.4.22 (Composition of fatty acids by gas chromatography) روش‌های مشتق‌سازی و شرایط را شرح می‌دهد و کمی‌سازی معمولاً به روش نرمال‌سازی سطح است.",
)}
${ul([
  "واکنش متیلاسیون باید کامل باشد؛ متیلاسیون ناقص ترکیب گزارش‌شده را تغییر می‌دهد.",
  "شناسایی پیک‌ها با مخلوط مرجع FAME با ترکیب معلوم؛ ترتیب خروج روی فاز قطبی به طول زنجیره و تعداد پیوند دوگانه بستگی دارد.",
  "اسیدهای چرب چند غیراشباعی به اکسیداسیون حساس‌اند؛ نمونه و استاندارد را دور از نور و هوا نگه دارید.",
])}
${h2("Ethylene oxide و 1,4-Dioxane")}
${p(
  "Ethylene oxide ماده اولیه Excipientهای اتوکسیله (Macrogolها، پلی‌سوربات‌ها، Poloxamerها و Polyoxyl castor oil) است و 1,4-Dioxane محصول جانبی واکنش آن است. Ph. Eur. 2.4.25 (Ethylene oxide and dioxan) آزمون را با Headspace-GC و روش افزایش استاندارد شرح می‌دهد؛ حد هر ماده در مونوگراف Excipient تعیین شده است. Ethylene oxide بسیار فرار و سمی است؛ تهیه محلول استاندارد آن باید با احتیاط و در شرایط سرد و دربسته انجام شود. در USP &lt;467&gt; آزمون Ethylene oxide فقط در مواردی انجام می‌شود که مونوگراف آن را مشخص کرده باشد.",
)}
${h2("تعیین مقدار الکل")}
${p(
  "تعیین مقدار Ethanol در فرآورده‌های مایع (شربت‌ها، الگزیرها، تنتورها و محلول‌های خوراکی) در USP &lt;611&gt; (Alcohol determination) شرح داده شده است. روش GC این فصل از استاندارد داخلی استفاده می‌کند تا اثر حجم تزریق و ماتریکس جبران شود. در مونوگراف مواد اولیه مانند Ethanol نیز ناخالصی‌های فرار (مانند Methanol و Acetaldehyde) با GC کنترل می‌شوند.",
)}
${h2("Nitrosamineها")}
${p(
  "N-nitrosamineها ناخالصی‌های جهش‌زای «Cohort of concern» هستند. FDA برای آن‌ها حد پذیرفتنی مصرف روزانه (Acceptable intake) تعیین کرده است؛ برای مثال NDMA برابر 96 ng/day و NDEA برابر 26.5 ng/day. نیترزامین‌های کوچک و فرار (مانند NDMA، NDEA، NDIPA، NEIPA و NDBA) با GC-MS/MS در حالت MRM در سطح ng/g قابل اندازه‌گیری‌اند.",
)}
${box(
  "warn",
  "تشکیل Nitrosamine در Inlet داغ",
  p("در برخی ماتریکس‌ها، حرارت Inlet یا Headspace می‌تواند خود Nitrosamine تولید کند و نتیجه را بیش از مقدار واقعی نشان دهد. نمونه شناخته‌شده آن Ranitidine است که FDA در سال 2019 اعلام کرد روش‌های GC با حرارت بالا در این ماده NDMA ایجاد می‌کنند و روش LC-MS را برای آن توصیه کرد. پیش از انتخاب GC برای یک ماده، پایداری حرارتی ماتریکس را ارزیابی کنید و Spike recovery و نمونه کنترل را در صحه‌گذاری بگنجانید."),
)}
${h2("ناخالصی‌های ژنوتوکسیک فرار (ICH M7)")}
${p(
  "ICH M7 کنترل ناخالصی‌های DNA-reactive را بر اساس آستانه نگرانی سم‌شناختی (TTC) برابر 1.5 µg/day برای مصرف مادام‌العمر تعریف می‌کند. بسیاری از این ناخالصی‌ها کوچک و فرارند و GC روش مناسب آن‌هاست:",
)}
${table(
  ["گروه", "مثال", "روش رایج"],
  [
    ["Alkyl halides", "Methyl chloride، Ethyl bromide، 1,2-Dichloroethane", "Headspace-GC-MS"],
    ["Sulfonate esters", "Methyl methanesulfonate، Ethyl methanesulfonate، Alkyl tosylates", "GC-MS (تزریق مایع) یا LC-MS"],
    ["Epoxides و آلدهیدها", "Ethylene oxide، Epichlorohydrin", "Headspace-GC-MS"],
    ["Hydrazines", "Hydrazine (پس از مشتق‌سازی)", "GC-MS یا LC-MS پس از مشتق‌سازی"],
  ],
  { cap: "<b>جدول 8-1.</b> نمونه‌هایی از ناخالصی‌های ژنوتوکسیک فرار و روش‌های رایج. حد هر ناخالصی از TTC یا حد اختصاصی آن و دوز روزانه دارو به دست می‌آید.", ltr: [0] },
)}
${h3("محاسبه حد")}
${p(
  "حد غلظت از تقسیم مصرف مجاز روزانه بر دوز روزانه دارو به دست می‌آید. برای دارویی با حداکثر دوز روزانه 500 mg، حد TTC معادل 1.5 µg ÷ 0.5 g = 3 ppm است. در این سطوح، حساسیت FID معمولاً کافی نیست و MS در حالت SIM یا MRM لازم است؛ LOQ روش باید به‌طور معنادار پایین‌تر از حد باشد تا نتایج نزدیک به حد با اطمینان گزارش شوند.",
)}
${box(
  "ref",
  "منابع این فصل",
  p("FDA, Testing of Glycerin, Propylene Glycol, Maltitol Solution, Hydrogenated Starch Hydrolysate, Sorbitol Solution, and other High-Risk Drug Components for DEG and EG, May 2023؛ Ph. Eur. 2.4.22 و 2.4.25؛ USP &lt;611&gt;؛ FDA, Control of Nitrosamine Impurities in Human Drugs؛ ICH M7(R2)."),
)}
`;
