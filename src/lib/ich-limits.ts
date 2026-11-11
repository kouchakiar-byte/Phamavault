/*
 * Public limits from the ICH quality guidelines, shared by the calculators and
 * the CoA builder. ICH guidelines may be reproduced with acknowledgement.
 */

/** ICH Q3C(R9) Table 2 (class 2) PDE in mg/day, and the class 3 default of 50 mg/day: [English, Persian, PDE]. */
export const q3cSolvents: [string, string, number][] = [
  ["Methanol", "متانول", 30.0], ["Acetonitrile", "استونیتریل", 4.1], ["Dichloromethane", "دی‌کلرومتان", 6.0],
  ["Toluene", "تولوئن", 8.9], ["Hexane", "هگزان", 2.9], ["Tetrahydrofuran", "تتراهیدروفوران", 7.2],
  ["N,N-Dimethylformamide", "دی‌متیل‌فرمامید", 8.8], ["N,N-Dimethylacetamide", "دی‌متیل‌استامید", 10.9],
  ["N-Methylpyrrolidone", "ان‌متیل‌پیرولیدون", 5.3], ["Chloroform", "کلروفرم", 0.6], ["Cyclohexane", "سیکلوهگزان", 38.8],
  ["Methylcyclohexane", "متیل‌سیکلوهگزان", 11.8], ["1,4-Dioxane", "1،4-دی‌اکسان", 3.8], ["Pyridine", "پیریدین", 2.0],
  ["Xylene", "زایلن", 21.7], ["Chlorobenzene", "کلروبنزن", 3.6], ["Cumene", "کیومن", 0.7], ["Ethylene glycol", "اتیلن گلیکول", 6.2],
  ["Formamide", "فرمامید", 2.2], ["2-Methoxyethanol", "2-متوکسی‌اتانول", 0.5], ["2-Ethoxyethanol", "2-اتوکسی‌اتانول", 1.6],
  ["1,2-Dimethoxyethane", "1،2-دی‌متوکسی‌اتان", 1.0], ["1,2-Dichloroethene", "1،2-دی‌کلرواتن", 18.7], ["Trichloroethylene", "تری‌کلرواتیلن", 0.8],
  ["Methylbutyl ketone", "متیل بوتیل کتون", 0.5], ["Nitromethane", "نیترومتان", 0.5], ["Sulfolane", "سولفولان", 1.6], ["Tetralin", "تترالین", 1.0],
  ["Class 3 solvent (e.g. ethanol, acetone, ethyl acetate, 2-propanol)", "حلال کلاس 3 (مانند اتانول، استون، اتیل استات، ایزوپروپانول)", 50],
];

/** ICH Q3D(R2) Table A.2.1: [symbol, English, Persian, oral, parenteral, inhalation PDE in µg/day]. */
export const q3dElements: [string, string, string, number, number, number][] = [
  ["Cd", "Cadmium", "کادمیم", 5, 2, 3], ["Pb", "Lead", "سرب", 5, 5, 5], ["As", "Arsenic", "آرسنیک", 15, 15, 2], ["Hg", "Mercury", "جیوه", 30, 3, 1],
  ["Co", "Cobalt", "کبالت", 50, 5, 3], ["V", "Vanadium", "وانادیم", 100, 10, 1], ["Ni", "Nickel", "نیکل", 200, 20, 6],
  ["Tl", "Thallium", "تالیم", 8, 8, 8], ["Au", "Gold", "طلا", 300, 300, 3], ["Pd", "Palladium", "پالادیم", 100, 10, 1],
  ["Ir", "Iridium", "ایریدیم", 100, 10, 1], ["Os", "Osmium", "اسمیم", 100, 10, 1], ["Rh", "Rhodium", "رودیم", 100, 10, 1],
  ["Ru", "Ruthenium", "روتنیم", 100, 10, 1], ["Se", "Selenium", "سلنیم", 150, 80, 130], ["Ag", "Silver", "نقره", 150, 15, 7],
  ["Pt", "Platinum", "پلاتین", 100, 10, 1], ["Li", "Lithium", "لیتیم", 550, 250, 25], ["Sb", "Antimony", "آنتیموان", 1200, 90, 20],
  ["Ba", "Barium", "باریم", 1400, 700, 300], ["Mo", "Molybdenum", "مولیبدن", 3000, 1500, 10], ["Cu", "Copper", "مس", 3000, 300, 30],
  ["Sn", "Tin", "قلع", 6000, 600, 60], ["Cr", "Chromium", "کروم", 11000, 1100, 3],
];

/** ICH Q3D element classes. */
export const q3dClass: Record<string, string> = {
  Cd: "1", Pb: "1", As: "1", Hg: "1", Co: "2A", V: "2A", Ni: "2A",
  Tl: "2B", Au: "2B", Pd: "2B", Ir: "2B", Os: "2B", Rh: "2B", Ru: "2B", Se: "2B", Ag: "2B", Pt: "2B",
  Li: "3", Sb: "3", Ba: "3", Mo: "3", Cu: "3", Sn: "3", Cr: "3",
};

/** ICH Q3C option 1 concentration limit (ppm), for a daily dose of 10 g. */
export const q3cOption1Ppm = (pdeMgPerDay: number) => Math.round(pdeMgPerDay * 100);

/** ICH Q3D option 1 concentration (µg/g), for a daily dose of 10 g. */
export const q3dOption1 = (pdeUgPerDay: number) => pdeUgPerDay / 10;
