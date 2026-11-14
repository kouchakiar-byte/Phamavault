/*
 * The standard plan of a generic oral solid R&D project, from the day the request reaches the project
 * manager to the first commercial batches: 12 phases and their activities. Each activity has the unit
 * that owns it, a typical duration in calendar days, the activities that must finish first, and what it
 * delivers. Durations are planning defaults to be adjusted per project, not norms.
 *
 * Written from the seat of each owner: the project manager (scope, gates, budget), formulation
 * (preformulation, trials, scale-up), the analytical laboratory and QC (methods, validation, stability),
 * QA (risk, protocols, specifications, validation), purchasing (materials, standards, packaging),
 * regulatory (RLD, patents, dossier, BE) and production (pilot, exhibit and validation batches).
 * References: ICH Q8(R2), Q9(R1), Q10, Q1A(R2), Q1B, Q1E, Q2(R2), Q3A–Q3C, M4 (CTD), M9.
 */
import type { Unit } from "./model";

export type ActivityTpl = { code: string; t: string; unit: Unit; d: number; deps?: string[]; out?: string; gate?: boolean };
export type PhaseTpl = { key: string; title: string; w: number; items: ActivityTpl[] };

const A = (code: string, t: string, unit: Unit, d: number, deps: string[] = [], out?: string): ActivityTpl => ({ code, t, unit, d, deps, ...(out ? { out } : {}) });
const G = (code: string, t: string, deps: string[], out = "صورت‌جلسه Gate و تصمیم Go / Hold / No-go"): ActivityTpl => ({ code, t, unit: "pm", d: 1, deps, out, gate: true });

export const TEMPLATE: PhaseTpl[] = [
  { key: "p0", title: "اعلام پروژه و Brief", w: 3, items: [
    A("0.1", "دریافت درخواست رسمی توسعه محصول از مدیریت یا بازاریابی", "pm", 2, [], "فرم درخواست محصول"),
    A("0.2", "ثبت پروژه و تعیین کد پروژه", "pm", 1, ["0.1"]),
    A("0.3", "تعریف اولیه محصول: شکل دارویی، قدرت، بسته‌بندی و بازار هدف", "pm", 5, ["0.2"], "Product brief"),
    A("0.4", "بررسی بازار، رقبا و فرآورده‌های مشابه ثبت‌شده", "pm", 7, ["0.2"], "گزارش بازار"),
    A("0.5", "تعیین مدیر پروژه و تیم چندواحدی (Cross-functional team)", "pm", 2, ["0.2"], "فهرست تیم و نقش‌ها"),
    A("0.6", "جلسه شروع پروژه (Kick-off)", "pm", 1, ["0.3", "0.5"], "صورت‌جلسه Kick-off"),
    A("0.7", "ثبت فرضیات، محدودیت‌ها و ریسک‌های اولیه پروژه", "pm", 2, ["0.6"], "Risk register اولیه"),
    G("0.8", "Gate 0: تصویب Brief، برنامه زمانی اولیه و بودجه", ["0.4", "0.7"]),
  ] },
  { key: "p1", title: "امکان‌سنجی، QTPP و برنامه‌ریزی", w: 6, items: [
    A("1.1", "بررسی محصول مرجع (RLD): ترکیب، Excipientها، بسته‌بندی و Shelf life", "reg", 7, ["0.8"], "خلاصه محصول مرجع"),
    A("1.2", "بررسی Patent و انحصار داده (Data exclusivity)", "reg", 10, ["0.8"], "گزارش Patent"),
    A("1.3", "بررسی الزامات ثبت سازمان غذا و دارو و Guidelineهای مرتبط", "reg", 7, ["0.8"]),
    A("1.4", "تعیین مونوگراف‌های فارماکوپه‌ای (USP، BP، Ph. Eur.) برای API و محصول", "anal", 5, ["0.8"], "فهرست مونوگراف‌ها"),
    A("1.5", "تعریف QTPP (ICH Q8)", "form", 5, ["1.1"], "سند QTPP"),
    A("1.6", "تعیین CQAهای اولیه محصول", "form", 3, ["1.5"], "فهرست CQAها"),
    A("1.7", "ارزیابی ریسک اولیه محصول و فرایند (ICH Q9)", "qa", 5, ["1.6"], "گزارش ارزیابی ریسک اولیه"),
    A("1.8", "امکان‌سنجی فنی: تجهیزات، فرایند و ظرفیت کارخانه", "prod", 7, ["1.5"], "گزارش امکان‌سنجی فنی"),
    A("1.9", "برآورد هزینه، منابع و زمان‌بندی تفصیلی پروژه", "pm", 3, ["1.7", "1.8"], "بودجه و برنامه تفصیلی"),
    G("1.10", "Gate 1: تصمیم ادامه توسعه", ["1.2", "1.3", "1.4", "1.9"]),
  ] },
  { key: "p2", title: "انتخاب و تأمین مواد اولیه", w: 9, items: [
    A("2.1", "شناسایی تأمین‌کنندگان API و مقایسه مدارک (DMF، CEP، گواهی GMP)", "purch", 10, ["1.10"], "جدول مقایسه تأمین‌کنندگان"),
    A("2.2", "درخواست نمونه API و CoA از تأمین‌کنندگان منتخب", "purch", 3, ["2.1"]),
    A("2.3", "ارزیابی و تأیید صلاحیت تأمین‌کننده API (Supplier qualification)", "qa", 10, ["2.1"], "گزارش ارزیابی تأمین‌کننده"),
    A("2.4", "تهیه فهرست Excipientها با گرید فارماکوپه‌ای", "form", 3, ["1.10"], "فهرست مواد"),
    A("2.5", "درخواست خرید Excipientها", "form", 2, ["2.4"], "درخواست خرید (PR)"),
    A("2.6", "خرید استانداردهای مرجع (Reference standard) و ناخالصی‌ها", "purch", 30, ["1.4"]),
    A("2.7", "تهیه نمونه محصول مرجع (RLD) برای مقایسه", "purch", 30, ["1.10"]),
    A("2.8", "ورود مواد، قرنطینه و نمونه‌برداری", "purch", 2, ["2.2", "2.5"]),
    A("2.9", "آنالیز API طبق مونوگراف و مقایسه با CoA تأمین‌کننده", "anal", 10, ["2.8", "2.6"], "نتایج آنالیز API"),
    A("2.10", "آنالیز Excipientها", "anal", 7, ["2.8"]),
    A("2.11", "تأیید QC مواد و آزادسازی برای توسعه", "qa", 2, ["2.9", "2.10"]),
    A("2.12", "انتخاب تأمین‌کننده نهایی API", "pm", 2, ["2.3", "2.11"]),
    A("2.13", "خرید API و Excipientها برای Scale-up و بچ‌های پایداری", "purch", 30, ["2.12"]),
  ] },
  { key: "p3", title: "پیش‌فرمولاسیون (Preformulation)", w: 7, items: [
    A("3.1", "جمع‌بندی ویژگی‌های API از منابع (حلالیت، pKa، BCS، پایداری)", "form", 5, ["1.10"]),
    A("3.2", "تعیین حلالیت API در محدوده pH 1.2 تا 6.8", "anal", 7, ["2.11"]),
    A("3.3", "بررسی Polymorphism با XRD و DSC", "anal", 10, ["2.11"]),
    A("3.4", "توزیع اندازه ذرات (PSD) و مورفولوژی API", "anal", 5, ["2.11"]),
    A("3.5", "جریان‌پذیری و تراکم‌پذیری (Bulk و Tapped density، Carr index)", "form", 3, ["2.11"]),
    A("3.6", "مطالعه سازگاری API با Excipientها (Compatibility)", "form", 30, ["2.11"], "گزارش سازگاری"),
    A("3.7", "مطالعه Forced degradation روی API", "anal", 14, ["2.11"]),
    A("3.8", "گزارش پیش‌فرمولاسیون و انتخاب فرایند (Direct compression، Wet یا Dry granulation)", "form", 3, ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"], "گزارش پیش‌فرمولاسیون"),
  ] },
  { key: "p4", title: "توسعه فرمولاسیون", w: 15, items: [
    A("4.1", "طراحی فرمول‌های اولیه و انتخاب Excipientها و درصد آن‌ها", "form", 5, ["3.8"]),
    A("4.2", "طراحی آزمایش (DoE) برای متغیرهای بحرانی فرمول", "form", 3, ["4.1"], "طرح DoE"),
    A("4.3", "ساخت بچ‌های آزمایشگاهی (Lab trials)", "form", 21, ["4.2"], "سوابق Trialها"),
    A("4.4", "آزمون‌های In-process: سختی، Friability، DT و یکنواختی وزن", "form", 7, ["4.3"]),
    A("4.5", "Dissolution profile مقایسه‌ای با محصول مرجع در سه pH (f2)", "anal", 10, ["4.3", "5.2", "2.7"]),
    A("4.6", "آنالیز Assay و Related substances بچ‌های آزمایشی", "anal", 10, ["4.3", "5.1"]),
    A("4.7", "بهینه‌سازی فرمول بر اساس نتایج", "form", 14, ["4.4", "4.5", "4.6"]),
    A("4.8", "روکش‌دهی و بهینه‌سازی آن (در صورت نیاز)", "form", 10, ["4.7"]),
    A("4.9", "پایداری اولیه فرمول‌های منتخب (Stress و Accelerated کوتاه‌مدت)", "anal", 30, ["4.7"]),
    A("4.10", "انتخاب فرمول نهایی و صدور Formula card", "form", 2, ["4.8", "4.9"], "Formula card"),
    A("4.11", "گزارش توسعه فرمولاسیون و سوابق Trialها", "form", 5, ["4.10"], "گزارش توسعه فرمولاسیون"),
    G("4.12", "Gate 2: تأیید فرمول برای Scale-up", ["4.10"]),
  ] },
  { key: "p5", title: "توسعه و Validation روش‌های آنالیز", w: 10, items: [
    A("5.1", "توسعه روش Assay و Related substances با HPLC", "anal", 21, ["2.11"]),
    A("5.2", "توسعه روش Dissolution (Medium، Apparatus و rpm)", "anal", 14, ["2.11"]),
    A("5.3", "روش‌های Identification، Water content و Content uniformity", "anal", 10, ["2.11"]),
    A("5.4", "روش Residual solvents در صورت نیاز (ICH Q3C)", "anal", 10, ["2.11"]),
    A("5.5", "روش Microbial limit (USP <61> و <62>)", "anal", 7, ["2.11"]),
    A("5.6", "Forced degradation محصول و اثبات Stability-indicating بودن روش", "anal", 14, ["5.1", "4.10"]),
    A("5.7", "پروتکل Validation روش‌ها", "qa", 5, ["5.6", "5.2"], "پروتکل AMV"),
    A("5.8", "Validation روش‌ها (ICH Q2(R2))", "anal", 21, ["5.7", "5.3"]),
    A("5.9", "گزارش Validation روش‌ها", "anal", 5, ["5.8"], "گزارش AMV"),
    A("5.10", "تدوین Specification محصول برای آزادسازی و Shelf life", "qa", 5, ["5.9"], "Specification"),
    A("5.11", "تدوین روش‌های آزمون (STP) و انتقال روش به آزمایشگاه QC", "anal", 7, ["5.10"], "STP"),
  ] },
  { key: "p6", title: "توسعه بسته‌بندی", w: 4, items: [
    A("6.1", "تعیین نوع و جنس بسته‌بندی اولیه (Blister، بطری)", "form", 5, ["4.10"]),
    A("6.2", "ارزیابی و تأمین مواد بسته‌بندی", "purch", 14, ["6.1"]),
    A("6.3", "آزمون‌های بسته‌بندی (WVTR، سازگاری، Leak test)", "anal", 14, ["6.2"]),
    A("6.4", "طراحی بروشور، لیبل و جعبه", "reg", 14, ["6.1"], "طرح بسته‌بندی و بروشور"),
    A("6.5", "تأیید بسته‌بندی نهایی", "qa", 2, ["6.3", "6.4"]),
  ] },
  { key: "p7", title: "Pilot، Scale-up و توسعه فرایند", w: 10, items: [
    A("7.1", "تدوین Master formula و دستورالعمل ساخت بچ Pilot", "prod", 5, ["4.12"]),
    A("7.2", "ارزیابی ریسک فرایند و تعیین CPPها (ICH Q8 و Q9)", "form", 5, ["4.12"], "فهرست CPPها"),
    A("7.3", "ساخت بچ Pilot", "prod", 5, ["7.1", "7.2", "2.13"]),
    A("7.4", "آنالیز کامل بچ Pilot", "anal", 10, ["7.3", "5.11"]),
    A("7.5", "مقایسه بچ Pilot با بچ‌های آزمایشگاهی و محصول مرجع", "form", 3, ["7.4"]),
    A("7.6", "بهینه‌سازی پارامترهای فرایند و تعیین Design space", "form", 10, ["7.5"]),
    A("7.7", "تعیین In-process controlها و حدود آن‌ها", "form", 3, ["7.6"]),
    A("7.8", "ساخت 3 بچ پایداری (دست‌کم 2 بچ در مقیاس Pilot، ICH Q1A(R2))", "prod", 10, ["7.7", "6.5"]),
    A("7.9", "آنالیز آزادسازی بچ‌های پایداری", "anal", 10, ["7.8"]),
    A("7.10", "گزارش Scale-up و توسعه فرایند", "form", 5, ["7.9"], "گزارش Scale-up"),
  ] },
  { key: "p8", title: "مطالعه پایداری", w: 14, items: [
    A("8.1", "تدوین پروتکل پایداری: شرایط، نقاط زمانی و آزمون‌ها", "qa", 5, ["5.10"], "پروتکل پایداری"),
    A("8.2", "شروع مطالعه Accelerated (40 °C / 75% RH، 6 ماه)", "anal", 1, ["8.1", "7.9"]),
    A("8.3", "شروع مطالعه Long-term در شرایط منطقه اقلیمی بازار هدف", "anal", 1, ["8.1", "7.9"]),
    A("8.4", "Photostability (ICH Q1B)", "anal", 14, ["7.9"]),
    A("8.5", "نمونه‌برداری و آنالیز نقاط 1، 2 و 3 ماه Accelerated", "anal", 90, ["8.2"]),
    A("8.6", "نمونه‌برداری و آنالیز نقطه 6 ماه Accelerated", "anal", 90, ["8.5"]),
    A("8.7", "ارزیابی نتایج و شروع Intermediate در صورت تغییر معنی‌دار", "qa", 7, ["8.6"]),
    A("8.8", "گزارش پایداری و پیشنهاد Shelf life (ICH Q1E)", "qa", 7, ["8.7"], "گزارش پایداری"),
  ] },
  { key: "p9", title: "BE یا Biowaiver و پرونده ثبت", w: 12, items: [
    A("9.1", "تصمیم BE یا Biowaiver بر اساس BCS (ICH M9)", "reg", 5, ["4.12"]),
    A("9.2", "انتخاب مرکز BE و تهیه پروتکل مطالعه", "reg", 14, ["9.1"], "پروتکل BE"),
    A("9.3", "اخذ مجوز کمیته اخلاق و ارسال بچ به مرکز BE", "reg", 21, ["9.2", "7.9"]),
    A("9.4", "اجرای مطالعه BE و دریافت گزارش نهایی", "reg", 60, ["9.3"], "گزارش BE"),
    A("9.5", "گزارش توسعه دارویی (3.2.P.2)", "form", 14, ["7.10"], "Pharmaceutical development"),
    A("9.6", "تدوین Module 3 (کیفیت) پرونده CTD", "reg", 21, ["9.5", "5.11", "8.8"], "Module 3"),
    A("9.7", "تکمیل Module 1، 2 و 5", "reg", 14, ["9.6", "9.4"]),
    A("9.8", "بازبینی کامل پرونده توسط QA", "qa", 5, ["9.7"]),
    A("9.9", "ارسال پرونده به سازمان غذا و دارو", "reg", 1, ["9.8"]),
    A("9.10", "ارسال نمونه به آزمایشگاه کنترل در صورت درخواست", "reg", 14, ["9.9"]),
    A("9.11", "پاسخ به سؤالات بازبینی و اخذ پروانه", "reg", 90, ["9.9"], "پروانه ساخت"),
    G("9.12", "Gate 3: تأیید انتقال به تولید تجاری", ["9.11", "9.10"]),
  ] },
  { key: "p10", title: "انتقال تکنولوژی و Process validation", w: 10, items: [
    A("10.1", "پروتکل انتقال تکنولوژی (Technology transfer)", "qa", 7, ["7.10"], "پروتکل TT"),
    A("10.2", "تهیه Master batch record تجاری", "prod", 7, ["10.1"], "MBR"),
    A("10.3", "Qualification تجهیزات خط تولید در صورت نیاز (IQ، OQ، PQ)", "prod", 21, ["10.1"]),
    A("10.4", "Cleaning validation", "qa", 21, ["10.3"]),
    A("10.5", "آموزش کارکنان تولید و QC", "prod", 5, ["10.2"]),
    A("10.6", "پروتکل Process validation", "qa", 7, ["10.2"], "پروتکل PV"),
    A("10.7", "ساخت 3 بچ Process validation", "prod", 14, ["10.6", "10.3", "10.5", "9.12"]),
    A("10.8", "آنالیز بچ‌های Process validation", "anal", 14, ["10.7"]),
    A("10.9", "گزارش Process validation", "qa", 7, ["10.8"], "گزارش PV"),
    A("10.10", "گزارش نهایی انتقال تکنولوژی", "form", 5, ["10.9"], "گزارش TT"),
  ] },
  { key: "p11", title: "شروع تولید تجاری و بستن پروژه", w: 3, items: [
    A("11.1", "آزادسازی اولین بچ‌های تجاری", "qa", 3, ["10.9"]),
    A("11.2", "قرار دادن بچ‌های تجاری در پایداری مستمر (Ongoing stability)", "anal", 7, ["11.1"]),
    A("11.3", "جلسه پایان پروژه و درس‌آموخته‌ها (Lessons learned)", "pm", 2, ["11.1"], "گزارش درس‌آموخته‌ها"),
    A("11.4", "بستن پروژه و بایگانی اسناد", "pm", 3, ["11.3", "11.2"]),
  ] },
];

export const TEMPLATE_COUNT = TEMPLATE.reduce((a, p) => a + p.items.length, 0);
