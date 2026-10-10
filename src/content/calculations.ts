import { bi } from "@/i18n/bi";

/** The calculators: tab label, full title and governing equation. */
export const calculations = [
  {
    key: "hlb",
    label: bi("HLB blending", "محاسبه HLB"),
    title: bi("HLB blending of an emulsifier pair", "محاسبه HLB مخلوط دو امولسی‌فایر"),
    equation: "HLB_mix = f_A·HLB_A + f_B·HLB_B",
  },
  {
    key: "iso",
    label: bi("Isotonicity (E-value)", "ایزوتونیسیته (روش E)"),
    title: bi("Isotonicity by the sodium chloride equivalent (E-value) method", "ایزوتونیسیته به روش معادل سدیم کلراید (E)"),
    equation: "W_agent = (0.009·V − Σ m_drug·E) / E_agent",
  },
  {
    key: "dil",
    label: bi("Dilution & alligation", "رقیق‌سازی و آلیگیشن"),
    title: bi("Dilution and alligation", "رقیق‌سازی و روش آلیگیشن"),
    equation: "C₁·V₁ = C₂·V₂",
  },
  {
    key: "buf",
    label: bi("Buffer design", "طراحی بافر"),
    title: bi("Buffer design and preparation (Henderson–Hasselbalch equation)", "طراحی و ساخت بافر (معادله هندرسون–هاسلباخ)"),
    equation: "pH = pKa + log([A⁻]/[HA])",
  },
  {
    key: "bcap",
    label: bi("Buffer capacity", "ظرفیت بافری"),
    title: bi("Buffer capacity (Van Slyke) and pH shift on acid or base addition", "ظرفیت بافری (معادله ون اسلایک) و تغییر pH با افزودن اسید یا باز"),
    equation: "β = 2.303·C·Ka·[H₃O⁺] / (Ka + [H₃O⁺])²",
  },
  {
    key: "sup",
    label: bi("Suppository displacement", "ضریب جابه‌جایی شیاف"),
    title: bi("Suppository base by displacement value", "محاسبه پایه شیاف با ضریب جابه‌جایی"),
    equation: "Base/unit = F − D/DV",
  },
  {
    key: "meq",
    label: bi("mg ⇄ mmol ⇄ mEq", "تبدیل mg، mmol و mEq"),
    title: bi("Conversion between mg, mmol and mEq", "تبدیل میلی‌گرم، میلی‌مول و میلی‌اکی‌والان"),
    equation: "mEq = (mg / MW) × valence",
  },
  {
    key: "vit",
    label: bi("Vitamin units (IU ⇄ mass)", "واحد ویتامین‌ها (IU ⇄ جرم)"),
    title: bi("Vitamin unit conversion (IU ⇄ mass)", "تبدیل واحد ویتامین‌ها (IU ⇄ جرم)"),
    equation: "IU = mass (mg) × IU/mg factor",
  },
  {
    key: "pot",
    label: bi("API potency adjustment", "محاسبه پوتنسی ماده مؤثره"),
    title: bi("API quantity by potency (assay, water content and salt factor)", "مقدار ماده مؤثره بر اساس پوتنسی (اسی، رطوبت و ضریب نمک)"),
    equation: "m = LC × SF × 100 / [Assay × (100 − W) / 100]",
  },
  {
    key: "bat",
    label: bi("Batch scale-up", "افزایش مقیاس بچ"),
    title: bi("Batch scale-up (unit formula → batch formula)", "افزایش مقیاس بچ (فرمول واحد ← فرمول بچ)"),
    equation: "kg = mg/unit × units × (1 + overage) / 10⁶",
  },
] as const;

export type CalculationKey = (typeof calculations)[number]["key"];

export const calculation = (key: CalculationKey) => calculations.find((c) => c.key === key)!;
