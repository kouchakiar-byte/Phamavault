import { chapter, h2, p, box, table } from "../lib.mjs";

export default () => `
${chapter("پیشگفتار", "درباره این هندبوک", "About this handbook", "پیشگفتار — درباره این هندبوک")}
${p(
  "کروماتوگرافی گازی (GC) پس از HPLC پرکاربردترین روش دستگاهی آزمایشگاه کنترل کیفیت داروسازی است. هر ماده مؤثره، Excipient و محصولی که در ساخت آن از حلال آلی استفاده شده باشد، باید از نظر Residual solvents کنترل شود و روش مرجع این آزمون در فارماکوپه‌ها Headspace-GC است. علاوه بر آن، GC روش انتخابی برای آزمون Diethylene glycol و Ethylene glycol در گلیسرین و پروپیلن گلیکول، ترکیب اسیدهای چرب روغن‌ها، Ethylene oxide در Excipientهای اتوکسیله، تعیین مقدار الکل و ناخالصی‌های فرار و ژنوتوکسیک است.",
  "با وجود این گستردگی، GC در بسیاری از آزمایشگاه‌ها کمتر از HPLC شناخته شده است: یک Liner آلوده، نشتی کوچک در Septum یا انتخاب نادرست دمای Headspace کافی است تا Repeatability از دست برود یا یک حلال کلاس 1 گزارش نشود. این هندبوک برای کارشناسانی تدوین شده که با دستگاه GC کار می‌کنند، روش Residual solvents را راه‌اندازی یا صحه‌گذاری می‌کنند، نتیجه را بازبینی می‌کنند یا باید مشکل دستگاه را پیدا کنند.",
)}
${p(
  "ساختار هندبوک همان ساختار هندبوک HPLC (شماره 1) است تا دو هندبوک کنار هم خوانده شوند: فصل 1 مبانی جداسازی؛ فصل 2 اجزای دستگاه (گاز حامل، Inlet و آون)؛ فصل 3 ستون‌ها و فازهای ساکن؛ فصل 4 دتکتورها؛ فصل 5 Static headspace؛ فصل 6 الزامات فارماکوپه و System suitability؛ فصل 7 Residual solvents طبق ICH Q3C و USP &lt;467&gt;؛ فصل 8 سایر کاربردهای GC در صنعت دارو؛ فصل 9 صحه‌گذاری، عملیات روزمره و یکپارچگی داده؛ فصل 10 عیب‌یابی سیستماتیک؛ فصل 11 مطالعات موردی؛ فصل 12 مسائل محاسباتی حل‌شده. پیوست‌ها شامل جدول عیب‌یابی سریع، پرسش‌های ارزیابی، واژه‌نامه و منابع است.",
)}
${box(
  "ref",
  "کادرهای طلایی",
  p("کادرهای طلایی‌رنگ خلاصه بازنویسی‌شده مفاهیم کلیدی فارماکوپه‌ها و گایدلاین‌هاست و منبع هر کادر در انتهای آن آمده است. این کادرها نقل‌قول مستقیم نیستند. اعداد جدول‌های ICH Q3C از متن رسمی ICH Q3C(R9) و تنظیمات مجاز از متن هماهنگ‌شده USP &lt;621&gt; (رسمی از 1 December 2022) برداشته شده است."),
)}
${box(
  "key",
  "متن رسمی فارماکوپه ملاک است",
  p("شرایط روش‌های فارماکوپه‌ای در این هندبوک برای آموزش و درک منطق روش خلاصه شده است. پیش از اجرای آزمون، شرایط کامل را از <b>نسخه جاری</b> USP، Ph. Eur. یا BP و مونوگراف مربوط بخوانید؛ فارماکوپه‌ها به‌روز می‌شوند و مونوگراف بر فصل عمومی مقدم است."),
)}
${h2("اختصارها")}
${table(
  ["اختصار", "عبارت کامل", "اختصار", "عبارت کامل"],
  [
    ["GC", "Gas chromatography", "HS", "Static headspace"],
    ["FID", "Flame ionization detector", "TCD", "Thermal conductivity detector"],
    ["ECD", "Electron capture detector", "NPD", "Nitrogen–phosphorus detector"],
    ["MS / MS-MS", "Mass spectrometry / tandem MS", "SIM / MRM", "Selected ion / multiple reaction monitoring"],
    ["EPC", "Electronic pneumatic control", "PTV", "Programmed temperature vaporization"],
    ["WCOT / PLOT", "Wall-coated / porous-layer open tubular", "β", "Phase ratio of column or headspace vial"],
    ["PDE", "Permitted daily exposure", "DEG / EG", "Diethylene glycol / Ethylene glycol"],
    ["DMSO / DMF / DMI", "Dimethyl sulfoxide / Dimethylformamide / 1,3-Dimethyl-2-imidazolidinone", "SST", "System suitability test"],
    ["LOD / LOQ", "Limit of detection / quantitation", "RRF", "Relative response factor"],
  ],
  { ltr: [1, 3] },
)}
`;
