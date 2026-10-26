import { chapter, table } from "../lib.mjs";

export default () => `
${chapter("پیوست الف", "جدول Troubleshooting سریع", "Appendix A — Quick troubleshooting matrix")}
${table(
  ["مشاهده", "علل محتمل", "آزمون تشخیصی", "اقدام"],
  [
    ["Plateau کمتر از 100%", "Coning؛ عدم Sink؛ تخریب در Medium؛ جذب روی فیلتر", "Infinity point؛ Solubility؛ پایداری؛ Filter adsorption", "75 rpm با توجیه؛ Surfactant؛ فیلتر مناسب"],
    ["جهش در Infinity point", "Coning یا Deaggregation ناقص", "مشاهده توده زیر Paddle", "اصلاح هیدرودینامیک؛ ارزیابی 75 rpm"],
    ["RSD بالا در نقاط اولیه", "Lag time متغیر؛ حباب؛ موقعیت قرص؛ Sinker", "مشاهده حین آزمون؛ Disintegration", "Degassing؛ استانداردسازی انداختن قرص؛ Sinker ثابت"],
    ["RSD بالا در همه نقاط", "ارتعاش؛ Centering و Wobble؛ هیدرودینامیک ناپایدار", "MQ؛ مقایسه Positionها", "اصلاح مکانیکی؛ جداسازی منبع ارتعاش"],
    ["یک Position همیشه متفاوت", "Centering؛ ارتفاع؛ Vessel معیوب؛ دمای Vessel", "MQ همان Position", "تعویض یا تنظیم Vessel یا Shaft"],
    ["حباب روی قرص یا توری", "Degassing ناکافی؛ تأخیر طولانی پس از Degassing", "اکسیژن محلول", "روش USP یا روش صحه‌گذاری‌شده؛ کاهش زمان انتظار"],
    ["شناور شدن کپسول", "عدم استفاده از Sinker یا Sinker نامناسب", "مشاهده", "Sinker مطابق روش"],
    ["Pellicle دور محتوای کپسول", "Cross-linking ژلاتین", "مشاهده؛ آزمون با آنزیم", "آزمون Two-tier طبق USP &lt;711&gt;؛ کنترل آلدئیدها"],
    ["نتایج بیش از 100%", "عبور ذرات از فیلتر؛ تداخل Excipient؛ خطای استاندارد؛ تبخیر Medium", "Filter efficiency؛ Placebo؛ Assay بچ؛ Vessel cover", "فیلتر یا Discard volume مناسب؛ HPLC؛ کنترل تبخیر"],
    ["نتایج پایین در دوز پایین", "جذب روی فیلتر یا ظروف", "مقایسه فیلترشده و سانتریفیوژشده", "تغییر فیلتر؛ افزایش Discard volume"],
    ["کدورت Medium حاوی SLS", "بافر Potassium؛ کیفیت SLS", "بررسی نوع نمک بافر", "بافر سدیمی؛ کنترل سری SLS"],
    ["افت انحلال پس از Scale-up", "Over-lubrication؛ Hardness؛ تغییر Granulation", "Batch record؛ Hardness؛ Disintegration", "پارامترهای بحرانی بر حسب تعداد دور و End point"],
    ["کندشدن تدریجی در Stability", "افزایش Hardness؛ جذب رطوبت؛ تغییر فرم جامد؛ Cross-linking", "Hardness، Disintegration، XRPD، آزمون آنزیمی", "بسته‌بندی؛ فرمولاسیون؛ کنترل Excipient"],
    ["آزادسازی در Acid stage (DR)", "روکش ناقص یا ترک‌خورده؛ Weight gain کم", "بازرسی چشمی؛ Weight gain", "Seal coat؛ کنترل Coating و Hardness هسته"],
    ["تفاوت نتایج بین دو آزمایشگاه", "Degassing، Sinker، حجم‌سنجی، فیلتر، دستگاه", "مقایسه گام‌به‌گام روش‌های اجرایی", "یکسان‌سازی جزئیات روش در پروتکل Transfer"],
    ["تغییر نتیجه با سری جدید Medium", "pH؛ وزن نمک‌ها؛ Surfactant", "pH پیش و پس از آزمون", "آماده‌سازی مجدد؛ کنترل pH متر"],
  ],
)}
`;
