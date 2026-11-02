import { chapter, p, table } from "../lib.mjs";

export default () => `
${chapter("پیوست ب", "جدول سریع طراحی و معیارهای متداول", "Appendix B — Quick reference: designs and typical criteria")}
${p("معیارهای این جدول عرف رایج صنعت و منابع آموزشی‌اند و الزام رسمی نیستند؛ معیار نهایی بر اساس هدف روش و Specification در پروتکل تعیین می‌شود.")}
${table(
  ["ویژگی", "طراحی متداول", "Assay (فرآورده)", "Impurities"],
  [
    ["Specificity", "Blank، Placebo، ناخالصی‌ها، Forced degradation، Peak purity", "بدون تداخل؛ Rs ≥ 1.5 تا 2.0", "بدون تداخل؛ Rs ≥ 1.5؛ Mass balance قابل قبول"],
    ["Response", "≥ 5 سطح در گستره", "r ≥ 0.999؛ عرض از مبدأ ≤ 2%", "r ≥ 0.99؛ از QL تا 120% Spec"],
    ["Range", "از Response، Accuracy و Precision", "80 تا 120%", "Reporting threshold تا 120% Spec"],
    ["Accuracy", "3 سطح × 3 تکرار", "98.0 تا 102.0%", "80 تا 120% (در QL گسترده‌تر)"],
    ["Repeatability", "6 آماده‌سازی در 100% یا 9 تعیین", "RSD ≤ 2.0%", "RSD ≤ 5 تا 10%"],
    ["Intermediate precision", "روز، تحلیل‌گر، دستگاه یا ستون دیگر", "RSD کل ≤ 2.0 تا 3.0%", "RSD ≤ 10 تا 15%"],
    ["QL", "<span class='mono'>S/N ≈ 10</span> یا <span class='mono'>10σ/S</span>؛ تأیید با 6 آماده‌سازی", "—", "≤ Reporting threshold؛ RSD ≤ 10 تا 20%"],
    ["DL", "<span class='mono'>S/N ≈ 3</span> یا <span class='mono'>3.3σ/S</span>", "—", "برای آزمون‌های حدی"],
    ["Robustness", "تغییر عمدی پارامترها، ترجیحاً با DoE", "SST برآورده شود", "Resolution جفت بحرانی حفظ شود"],
    ["Solution stability", "زمان‌های مختلف در شرایط نگهداری", "تغییر ≤ 2.0%", "ناخالصی جدید ظاهر نشود"],
    ["Filter study", "فیلترشده در برابر سانتریفیوژشده", "اختلاف ≤ 2.0%", "اختلاف قابل قبول در سطح Spec"],
  ],
  { cap: "<b>جدول ب-1.</b> خلاصه طراحی و معیارهای متداول صحه‌گذاری روش HPLC." },
)}
`;
