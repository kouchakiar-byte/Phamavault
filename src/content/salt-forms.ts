import { bi } from "@/i18n/bi";

/** The stand-alone salt forms page in the API database section. */
export const saltForms = {
  title: bi("Salt forms and salt ↔ base conversion", "فرم‌های نمکی و تبدیل نمک به Base و برعکس"),
  lead: bi(
    "More than 1,000 salt and hydrate forms of active ingredients from the FDA Orange Book and NDC directory, each checked against PubChem, with formula, molecular weights, stoichiometry and salt factor; and a calculator for the salt to weigh for a dose of the active moiety, and back, with assay, water and overage.",
    "بیش از 1,000 فرم نمکی و هیدراتی مواد مؤثره از FDA Orange Book و فهرست NDC، که هر ردیف با PubChem کنترل شده است، همراه با فرمول، وزن مولکولی، استوکیومتری و ضریب نمک؛ و ماشین‌حساب مقدار نمک برای دوز معین از Base و برعکس، با اعمال Assay، رطوبت و Overage.",
  ),
  back: bi("API and raw material database", "پایگاه داده مواد مؤثره و مواد اولیه"),
  /** Badge on an API database row whose name is in the salt table. */
  factor: bi("Salt factor", "ضریب نمک"),
};
