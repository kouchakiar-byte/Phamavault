import { bi, type Bi } from "@/i18n/bi";

/*
 * API–excipient compatibility checker: the reactive groups of common APIs,
 * the reactive properties and impurities of common excipients, and the
 * interaction rules that join them, each with its literature source.
 * Persian strings are plain text: the page isolates Latin and numeric runs.
 */

export type ApiGroup =
  | "amine1"
  | "amine2"
  | "amine3"
  | "ester"
  | "betalactam"
  | "sulfur"
  | "phenol"
  | "oxidizable"
  | "acid"
  | "acidLabile"
  | "chelator"
  | "moisture";

export type ExcipientTrait = "reducing" | "peroxide" | "aldehyde" | "nitrite" | "alkaline" | "divalent" | "acidic" | "water" | "anionic" | "polyol";

export const apiGroups: Record<ApiGroup, Bi> = {
  amine1: bi("Primary amine", "آمین نوع اول (Primary amine)"),
  amine2: bi("Secondary amine", "آمین نوع دوم (Secondary amine)"),
  amine3: bi("Tertiary amine", "آمین نوع سوم (Tertiary amine)"),
  ester: bi("Ester or lactone", "Ester یا Lactone"),
  betalactam: bi("β-Lactam ring", "حلقه β-Lactam"),
  sulfur: bi("Thiol or thioether", "Thiol یا Thioether"),
  phenol: bi("Phenol or catechol", "Phenol یا Catechol"),
  oxidizable: bi("Other oxidation-prone group (diene, thiophene…)", "گروه مستعد اکسیداسیون دیگر (Diene، Thiophene و …)"),
  acid: bi("Carboxylic acid", "Carboxylic acid"),
  acidLabile: bi("Acid-labile molecule", "مولکول ناپایدار در محیط اسیدی"),
  chelator: bi("Metal chelator (tetracycline, fluoroquinolone)", "Chelator فلزات (Tetracycline، Fluoroquinolone)"),
  moisture: bi("Hydrolysis- or moisture-sensitive", "حساس به رطوبت و Hydrolysis"),
};

export const excipientTraits: Record<ExcipientTrait, Bi> = {
  reducing: bi("Reducing sugar", "قند احیاکننده (Reducing sugar)"),
  peroxide: bi("Hydroperoxide impurities", "ناخالصی Hydroperoxide"),
  aldehyde: bi("Formaldehyde / formic acid impurities", "ناخالصی Formaldehyde و Formic acid"),
  nitrite: bi("Trace nitrite", "مقادیر جزئی Nitrite"),
  alkaline: bi("Alkaline microenvironment", "ریزمحیط قلیایی"),
  divalent: bi("Divalent cations (Ca²⁺, Mg²⁺, Zn²⁺)", "کاتیون‌های دوظرفیتی (Ca²⁺، Mg²⁺، Zn²⁺)"),
  acidic: bi("Acidic microenvironment", "ریزمحیط اسیدی"),
  water: bi("Hygroscopic or high water content", "جاذب رطوبت یا دارای آب زیاد"),
  anionic: bi("Anionic polymer or surfactant", "پلیمر یا Surfactant آنیونی"),
  polyol: bi("Polyol (hydroxyl groups)", "Polyol (دارای گروه‌های Hydroxyl)"),
};

/** Common APIs and their reactive groups (from their structures). */
export const apiCatalogue: { name: string; groups: ApiGroup[] }[] = [
  { name: "Acetylsalicylic acid", groups: ["ester", "acid", "moisture"] },
  { name: "Amlodipine besilate", groups: ["amine1", "ester"] },
  { name: "Amoxicillin trihydrate", groups: ["amine1", "betalactam", "phenol", "acid", "moisture"] },
  { name: "Atenolol", groups: ["amine2"] },
  { name: "Atorvastatin calcium trihydrate", groups: ["acid", "acidLabile"] },
  { name: "Captopril", groups: ["sulfur", "acid"] },
  { name: "Carvedilol", groups: ["amine2"] },
  { name: "Cefalexin monohydrate", groups: ["amine1", "betalactam", "acid", "moisture"] },
  { name: "Cetirizine dihydrochloride", groups: ["amine3", "acid"] },
  { name: "Ciprofloxacin hydrochloride", groups: ["amine2", "acid", "chelator"] },
  { name: "Clopidogrel hydrogen sulfate", groups: ["ester", "amine3", "oxidizable"] },
  { name: "Diclofenac sodium", groups: ["acid"] },
  { name: "Doxycycline hyclate", groups: ["chelator", "phenol", "amine3"] },
  { name: "Duloxetine hydrochloride", groups: ["amine2", "acidLabile"] },
  { name: "Enalapril maleate", groups: ["amine2", "ester", "acid", "moisture"] },
  { name: "Esomeprazole magnesium trihydrate", groups: ["acidLabile"] },
  { name: "Ezetimibe", groups: ["phenol"] },
  { name: "Fluoxetine hydrochloride", groups: ["amine2"] },
  { name: "Furosemide", groups: ["amine2", "acid", "acidLabile"] },
  { name: "Gabapentin", groups: ["amine1", "acid"] },
  { name: "Hydrochlorothiazide", groups: ["moisture"] },
  { name: "Ibuprofen", groups: ["acid"] },
  { name: "Lansoprazole", groups: ["acidLabile"] },
  { name: "Levodopa", groups: ["amine1", "phenol", "acid"] },
  { name: "Levofloxacin hemihydrate", groups: ["amine3", "acid", "chelator"] },
  { name: "Levothyroxine sodium", groups: ["amine1", "phenol", "acid", "moisture"] },
  { name: "Lisinopril dihydrate", groups: ["amine1", "amine2", "acid"] },
  { name: "Memantine hydrochloride", groups: ["amine1"] },
  { name: "Methyldopa", groups: ["amine1", "phenol", "acid"] },
  { name: "Metoclopramide hydrochloride monohydrate", groups: ["amine1", "amine3"] },
  { name: "Metoprolol tartrate", groups: ["amine2"] },
  { name: "Montelukast sodium", groups: ["sulfur", "acid", "oxidizable"] },
  { name: "Nifedipine", groups: ["ester"] },
  { name: "Olanzapine", groups: ["amine3", "oxidizable"] },
  { name: "Omeprazole", groups: ["acidLabile"] },
  { name: "Oseltamivir phosphate", groups: ["amine1", "ester"] },
  { name: "Pantoprazole sodium sesquihydrate", groups: ["acidLabile"] },
  { name: "Paracetamol", groups: ["phenol"] },
  { name: "Paroxetine hydrochloride hemihydrate", groups: ["amine2"] },
  { name: "Pregabalin", groups: ["amine1", "acid"] },
  { name: "Propranolol hydrochloride", groups: ["amine2"] },
  { name: "Quetiapine fumarate", groups: ["amine3", "sulfur"] },
  { name: "Raloxifene hydrochloride", groups: ["phenol", "amine3"] },
  { name: "Ramipril", groups: ["amine2", "ester", "acid", "moisture"] },
  { name: "Ranitidine hydrochloride", groups: ["amine2", "amine3", "sulfur"] },
  { name: "Rosuvastatin calcium", groups: ["acid", "acidLabile"] },
  { name: "Salbutamol sulfate", groups: ["amine2", "phenol"] },
  { name: "Sertraline hydrochloride", groups: ["amine2"] },
  { name: "Sildenafil citrate", groups: ["amine3"] },
  { name: "Simvastatin", groups: ["ester", "oxidizable"] },
  { name: "Sitagliptin phosphate monohydrate", groups: ["amine1"] },
  { name: "Tetracycline hydrochloride", groups: ["chelator", "phenol", "amine3"] },
  { name: "Tramadol hydrochloride", groups: ["amine3"] },
  { name: "Valaciclovir hydrochloride", groups: ["amine1", "ester"] },
  { name: "Valsartan", groups: ["acid"] },
  { name: "Varenicline tartrate", groups: ["amine2"] },
  { name: "Venlafaxine hydrochloride", groups: ["amine3"] },
  { name: "Vildagliptin", groups: ["amine2"] },
];

/** Common excipients (names as in the excipient database) and their reactive traits. */
export const excipientCatalogue: { name: string; traits: ExcipientTrait[] }[] = [
  { name: "Lactose monohydrate", traits: ["reducing"] },
  { name: "Lactose, anhydrous", traits: ["reducing"] },
  { name: "Lactose, spray-dried", traits: ["reducing"] },
  { name: "Dextrose", traits: ["reducing"] },
  { name: "Maltose", traits: ["reducing"] },
  { name: "Maltodextrin", traits: ["reducing"] },
  { name: "Fructose", traits: ["reducing"] },
  { name: "Dextrates", traits: ["reducing"] },
  { name: "Microcrystalline cellulose", traits: ["nitrite", "water"] },
  { name: "Cellulose, silicified microcrystalline", traits: ["nitrite"] },
  { name: "Mannitol", traits: ["polyol"] },
  { name: "Sorbitol", traits: ["polyol", "water"] },
  { name: "Sucrose", traits: [] },
  { name: "Dibasic calcium phosphate dihydrate", traits: ["divalent", "water"] },
  { name: "Calcium phosphate, dibasic anhydrous", traits: ["divalent"] },
  { name: "Calcium carbonate", traits: ["divalent", "alkaline"] },
  { name: "Starch, maize", traits: ["water", "nitrite"] },
  { name: "Pregelatinized starch", traits: ["water", "nitrite"] },
  { name: "Povidone K30", traits: ["peroxide", "aldehyde", "water"] },
  { name: "Copovidone", traits: ["peroxide"] },
  { name: "Hydroxypropyl cellulose", traits: ["peroxide"] },
  { name: "Hypromellose (HPMC)", traits: [] },
  { name: "Crospovidone", traits: ["peroxide", "aldehyde", "nitrite", "water"] },
  { name: "Croscarmellose sodium", traits: ["anionic", "water", "nitrite"] },
  { name: "Sodium starch glycolate", traits: ["anionic", "water", "nitrite"] },
  { name: "Magnesium stearate", traits: ["alkaline", "divalent"] },
  { name: "Calcium stearate", traits: ["alkaline", "divalent"] },
  { name: "Zinc stearate", traits: ["alkaline", "divalent"] },
  { name: "Sodium stearyl fumarate", traits: [] },
  { name: "Stearic acid", traits: ["acidic"] },
  { name: "Talc", traits: [] },
  { name: "Colloidal silicon dioxide", traits: [] },
  { name: "Sodium lauryl sulfate", traits: ["anionic"] },
  { name: "Polysorbate 80", traits: ["peroxide", "aldehyde", "polyol"] },
  { name: "Poloxamer", traits: ["peroxide", "aldehyde"] },
  { name: "Macrogol 400 (PEG 400)", traits: ["peroxide", "aldehyde", "polyol"] },
  { name: "Macrogols, solid grades", traits: ["peroxide", "aldehyde", "polyol"] },
  { name: "Polyethylene oxide", traits: ["peroxide", "aldehyde"] },
  { name: "Glycerin", traits: ["polyol"] },
  { name: "Propylene glycol", traits: ["polyol"] },
  { name: "Citric acid", traits: ["acidic"] },
  { name: "Tartaric acid", traits: ["acidic"] },
  { name: "Fumaric acid", traits: ["acidic"] },
  { name: "Ascorbic acid", traits: ["acidic"] },
  { name: "Magnesium oxide", traits: ["alkaline", "divalent"] },
  { name: "Magnesium carbonate", traits: ["alkaline", "divalent"] },
  { name: "Sodium bicarbonate", traits: ["alkaline"] },
  { name: "Sodium carbonate", traits: ["alkaline"] },
  { name: "Meglumine", traits: ["alkaline"] },
];

export type Rule = {
  id: string;
  level: "high" | "moderate" | "low";
  groups: ApiGroup[];
  traits: ExcipientTrait[];
  title: Bi;
  mechanism: Bi;
  consequence: Bi;
  examples: Bi;
  mitigation: Bi;
  refs: string[];
};

export const rules: Rule[] = [
  {
    id: "maillard",
    level: "high",
    groups: ["amine1", "amine2"],
    traits: ["reducing"],
    title: bi("Maillard reaction", "واکنش Maillard"),
    mechanism: bi(
      "The amine condenses with the open-chain aldehyde of the reducing sugar to a glycosylamine, which rearranges (Amadori) and goes on to brown products. Moisture, heat and basic pH speed it up; primary amines react fastest, secondary amines also react.",
      "آمین با گروه Aldehyde قند احیاکننده در شکل زنجیر باز متراکم می‌شود و Glycosylamine می‌سازد که با بازآرایی Amadori به محصولات قهوه‌ای تبدیل می‌شود. رطوبت، حرارت و pH قلیایی سرعت آن را زیاد می‌کنند؛ آمین‌های نوع اول سریع‌ترند و آمین‌های نوع دوم هم واکنش می‌دهند.",
    ),
    consequence: bi("Browning, loss of assay and new degradation products during stability.", "قهوه‌ای شدن، کاهش Assay و ایجاد محصولات تخریب جدید در مطالعات پایداری."),
    examples: bi("Fluoxetine HCl with lactose (documented); amlodipine, gabapentin and other amine drugs with lactose.", "Fluoxetine HCl با Lactose (مستند)؛ Amlodipine، Gabapentin و سایر داروهای آمینی با Lactose."),
    mitigation: bi(
      "Use a non-reducing filler (microcrystalline cellulose, mannitol, dibasic calcium phosphate); keep water activity low; screen binary mixtures at 40 °C / 75% RH and 50 °C.",
      "استفاده از Filler غیراحیاکننده (Microcrystalline cellulose، Mannitol، Dibasic calcium phosphate)؛ پایین نگه داشتن Water activity؛ غربالگری مخلوط دوتایی در 40 °C / 75% RH و 50 °C.",
    ),
    refs: ["Wirth DD et al. J Pharm Sci 1998;87(1):31–39.", "Bharate SS et al. J Excipients Food Chem 2010;1(3):3–26."],
  },
  {
    id: "peroxide",
    level: "high",
    groups: ["sulfur", "phenol", "amine3", "oxidizable"],
    traits: ["peroxide"],
    title: bi("Oxidation by excipient hydroperoxides", "اکسیداسیون با Hydroperoxide موجود در Excipient"),
    mechanism: bi(
      "Povidone, crospovidone, copovidone, PEG, polysorbates, poloxamers and HPC carry hydroperoxides from manufacture and autoxidation; levels differ between grades, suppliers and lots and rise on storage.",
      "Povidone، Crospovidone، Copovidone، PEG، Polysorbateها، Poloxamerها و HPC از فرایند تولید و اکسیداسیون خودبه‌خودی Hydroperoxide دارند؛ مقدار آن بین گریدها، تأمین‌کنندگان و لات‌ها متفاوت است و با نگهداری افزایش می‌یابد.",
    ),
    consequence: bi("N-oxides of tertiary amines, sulfoxides of thioethers, quinones of phenols; assay loss and new impurities.", "تشکیل N-oxide از آمین نوع سوم، Sulfoxide از Thioether و Quinone از Phenol؛ کاهش Assay و ناخالصی‌های جدید."),
    examples: bi("Raloxifene N-oxide formation with povidone and crospovidone (documented).", "تشکیل N-oxide رالوکسیفن (Raloxifene) با Povidone و Crospovidone (مستند)."),
    mitigation: bi(
      "Specify low-peroxide grades and a peroxide limit with the supplier; add an antioxidant (BHT, BHA, propyl gallate) where justified; protect from oxygen (nitrogen, packaging); store excipients closed.",
      "انتخاب گرید Low-peroxide و تعیین حد Peroxide در قرارداد با تأمین‌کننده؛ افزودن Antioxidant (BHT، BHA، Propyl gallate) با توجیه؛ محافظت از اکسیژن (نیتروژن، بسته‌بندی)؛ نگهداری Excipient در ظرف بسته.",
    ),
    refs: ["Wasylaschuk WR et al. J Pharm Sci 2007;96(1):106–116.", "Hartauer KJ et al. Pharm Dev Technol 2000;5(3):303–310."],
  },
  {
    id: "formyl",
    level: "moderate",
    groups: ["amine1", "amine2"],
    traits: ["aldehyde"],
    title: bi("N-formylation and N-methylation", "N-formylation و N-methylation"),
    mechanism: bi(
      "Formaldehyde and formic acid formed by oxidative degradation of PEG, polysorbates, poloxamers and povidone react with amines (Eschweiler–Clarke type pathways).",
      "Formaldehyde و Formic acid حاصل از تخریب اکسیداتیو PEG، Polysorbateها، Poloxamerها و Povidone با آمین‌ها واکنش می‌دهند (مسیرهای شبیه Eschweiler–Clarke).",
    ),
    consequence: bi("N-formyl and N-methyl impurities that need identification and qualification (ICH Q3B).", "ناخالصی‌های N-formyl و N-methyl که شناسایی و Qualification آن‌ها طبق ICH Q3B لازم است."),
    examples: bi("Varenicline N-formyl and N-methyl impurities in a PEG-containing osmotic tablet (documented).", "ناخالصی‌های N-formyl و N-methyl وارنیکلین (Varenicline) در قرص اسموتیک دارای PEG (مستند)."),
    mitigation: bi("Low-aldehyde excipient grades, antioxidants, low process temperatures and controlled storage of PEG.", "گریدهای کم‌Aldehyde، Antioxidant، دمای فرایند پایین و نگهداری کنترل‌شده PEG."),
    refs: ["Waterman KC et al. J Pharm Sci 2008;97(4):1499–1507.", "Wu Y et al. AAPS PharmSciTech 2011;12(4):1248–1263."],
  },
  {
    id: "nitrosamine",
    level: "high",
    groups: ["amine2", "amine3"],
    traits: ["nitrite"],
    title: bi("Nitrosamine formation (NDSRI risk)", "تشکیل نیتروزآمین (ریسک NDSRI)"),
    mechanism: bi(
      "Trace nitrite in excipients forms nitrosating agents under acidic, moist conditions and nitrosates secondary (and some tertiary) amines during manufacture and storage.",
      "مقادیر جزئی Nitrite در Excipientها در شرایط اسیدی و مرطوب به عامل نیتروزه‌کننده تبدیل می‌شود و آمین‌های نوع دوم (و برخی آمین‌های نوع سوم) را در ساخت و نگهداری نیتروزه می‌کند.",
    ),
    consequence: bi("N-nitrosamine drug substance-related impurities with very low acceptable intakes (ng/day).", "ناخالصی‌های نیتروزآمین مرتبط با ماده مؤثره با Acceptable intake بسیار پایین (ng/day)."),
    examples: bi("Secondary-amine APIs in tablets with crospovidone, croscarmellose, starches or MCC; levels vary widely by supplier and lot.", "APIهای دارای آمین نوع دوم در قرص همراه Crospovidone، Croscarmellose، نشاسته‌ها یا MCC؛ مقدار Nitrite بسته به تأمین‌کننده و لات بسیار متفاوت است."),
    mitigation: bi(
      "Risk assessment per EMA and FDA, low-nitrite excipient lots, nitrite scavengers (ascorbic acid, α-tocopherol), neutral to basic microenvironment, low moisture, confirmatory testing with a sensitive method (LC-MS/MS).",
      "ارزیابی ریسک طبق EMA و FDA، لات‌های Excipient کم‌Nitrite، Nitrite scavenger (Ascorbic acid، α-Tocopherol)، ریزمحیط خنثی تا قلیایی، رطوبت کم و آزمون تأییدی با روش حساس (LC-MS/MS).",
    ),
    refs: ["Boetzel R et al. J Pharm Sci 2023;112(6):1615–1624.", "EMA/409815/2020 Questions and answers on nitrosamine impurities.", "FDA Guidance: Control of Nitrosamine Impurities in Human Drugs (Rev. 2, 2024)."],
  },
  {
    id: "alkaline",
    level: "high",
    groups: ["ester", "betalactam"],
    traits: ["alkaline"],
    title: bi("Base-catalysed hydrolysis", "Hydrolysis با کاتالیز قلیایی"),
    mechanism: bi(
      "Magnesium, calcium and zinc stearates and basic salts raise the microenvironmental pH and catalyse hydrolysis of esters, lactones and β-lactams, especially with moisture.",
      "Stearateهای منیزیم، کلسیم و روی و نمک‌های قلیایی pH ریزمحیط را بالا می‌برند و Hydrolysis استرها، Lactoneها و β-Lactamها را، به‌ویژه در حضور رطوبت، کاتالیز می‌کنند.",
    ),
    consequence: bi("Hydrolysis products (e.g. salicylic acid from acetylsalicylic acid) and assay loss.", "محصولات Hydrolysis (مانند Salicylic acid از Acetylsalicylic acid) و کاهش Assay."),
    examples: bi("Acetylsalicylic acid with magnesium stearate (classic incompatibility).", "Acetylsalicylic acid با Magnesium stearate (ناسازگاری کلاسیک)."),
    mitigation: bi("Use stearic acid, hydrogenated vegetable oil or the lowest effective Mg stearate level; keep moisture low; check sodium stearyl fumarate case by case.", "استفاده از Stearic acid، Hydrogenated vegetable oil یا کمترین مقدار مؤثر Magnesium stearate؛ پایین نگه داشتن رطوبت؛ بررسی موردی Sodium stearyl fumarate."),
    refs: ["Narang AS et al. Pharm Res 2012;29(10):2660–2683.", "Bharate SS et al. J Excipients Food Chem 2010;1(3):3–26."],
  },
  {
    id: "acidic",
    level: "high",
    groups: ["acidLabile"],
    traits: ["acidic"],
    title: bi("Acid-catalysed degradation", "تخریب با کاتالیز اسیدی"),
    mechanism: bi(
      "Acidic excipients lower the microenvironmental pH. Benzimidazole proton-pump inhibitors degrade rapidly in acid; statin hydroxy acids cyclise to lactones; some drugs hydrolyse.",
      "Excipientهای اسیدی pH ریزمحیط را کاهش می‌دهند. مهارکننده‌های پمپ پروتون از خانواده Benzimidazole در محیط اسیدی به‌سرعت تخریب می‌شوند؛ Hydroxy acid استاتین‌ها به Lactone تبدیل می‌شود؛ برخی داروها Hydrolysis می‌شوند.",
    ),
    consequence: bi("Discolouration and rapid assay loss (PPIs); lactone impurity (atorvastatin, rosuvastatin).", "تغییر رنگ و کاهش سریع Assay (PPIها)؛ ناخالصی Lactone (Atorvastatin، Rosuvastatin)."),
    examples: bi("Omeprazole, esomeprazole, lansoprazole and pantoprazole with citric or tartaric acid.", "Omeprazole، Esomeprazole، Lansoprazole و Pantoprazole با Citric acid یا Tartaric acid."),
    mitigation: bi("Avoid acidic excipients; add an alkaline stabiliser (magnesium oxide or carbonate, sodium carbonate, meglumine); for PPIs use an inert sub-coat under the enteric coat.", "پرهیز از Excipientهای اسیدی؛ افزودن Stabilizer قلیایی (Magnesium oxide یا Carbonate، Sodium carbonate، Meglumine)؛ برای PPIها استفاده از Sub-coat بی‌اثر زیر پوشش Enteric."),
    refs: ["Bharate SS et al. J Excipients Food Chem 2010;1(3):3–26.", "Narang AS et al. Pharm Res 2012;29(10):2660–2683."],
  },
  {
    id: "chelation",
    level: "moderate",
    groups: ["chelator"],
    traits: ["divalent"],
    title: bi("Metal complexation", "تشکیل کمپلکس با فلزات"),
    mechanism: bi("Tetracyclines and fluoroquinolones form poorly soluble chelates with calcium, magnesium and zinc from excipients.", "Tetracyclineها و Fluoroquinoloneها با کلسیم، منیزیم و روی موجود در Excipientها کمپلکس کم‌محلول تشکیل می‌دهند."),
    consequence: bi("Slower dissolution and possibly reduced bioavailability.", "کاهش سرعت انحلال و احتمال کاهش Bioavailability."),
    examples: bi("Tetracycline with dibasic calcium phosphate or calcium carbonate.", "Tetracycline با Dibasic calcium phosphate یا Calcium carbonate."),
    mitigation: bi("Choose calcium- and magnesium-free fillers and lubricants (MCC, sodium stearyl fumarate); confirm with comparative dissolution.", "انتخاب Filler و Lubricant بدون کلسیم و منیزیم (MCC، Sodium stearyl fumarate)؛ تأیید با انحلال مقایسه‌ای."),
    refs: ["Bharate SS et al. J Excipients Food Chem 2010;1(3):3–26."],
  },
  {
    id: "moisture",
    level: "moderate",
    groups: ["ester", "betalactam", "moisture"],
    traits: ["water"],
    title: bi("Moisture-mediated hydrolysis", "Hydrolysis ناشی از رطوبت"),
    mechanism: bi("Hygroscopic excipients bring or attract water that becomes available to the API, particularly when the water is loosely bound; dibasic calcium phosphate dihydrate can release water on heating.", "Excipientهای جاذب رطوبت آب را با خود می‌آورند یا جذب می‌کنند و این آب، به‌ویژه وقتی سست‌پیوند باشد، در دسترس API قرار می‌گیرد؛ Dibasic calcium phosphate dihydrate با حرارت آب آزاد می‌کند."),
    consequence: bi("Hydrolysis products, faster degradation at accelerated conditions.", "محصولات Hydrolysis و تخریب سریع‌تر در شرایط تسریع‌شده."),
    examples: bi("Esters, β-lactams, ACE inhibitors and levothyroxine with starch, povidone or high-moisture MCC grades.", "استرها، β-Lactamها، مهارکننده‌های ACE و Levothyroxine با نشاسته، Povidone یا گریدهای پررطوبت MCC."),
    mitigation: bi("Low-moisture grades, dry granulation or direct compression, protective packaging (Alu-Alu, desiccant), water-activity control.", "گریدهای کم‌رطوبت، گرانولاسیون خشک یا پرس مستقیم، بسته‌بندی محافظ (Alu-Alu، Desiccant) و کنترل Water activity."),
    refs: ["Narang AS et al. Pharm Res 2012;29(10):2660–2683."],
  },
  {
    id: "ionic",
    level: "low",
    groups: ["amine1", "amine2", "amine3"],
    traits: ["anionic"],
    title: bi("Ionic binding of basic drugs", "اتصال یونی داروهای بازی"),
    mechanism: bi("Protonated amines bind to carboxylate groups of croscarmellose and sodium starch glycolate, or form ion pairs with sodium lauryl sulfate.", "آمین‌های پروتونه به گروه‌های Carboxylate در Croscarmellose و Sodium starch glycolate متصل می‌شوند یا با Sodium lauryl sulfate جفت یونی تشکیل می‌دهند."),
    consequence: bi("Incomplete or slower release, most visible with low-dose drugs and in low-ionic-strength media.", "رهش ناقص یا کندتر، به‌ویژه در داروهای کم‌دوز و محیط‌های با قدرت یونی پایین."),
    examples: bi("Low-dose cationic drugs with croscarmellose sodium; cationic drugs with SLS in dissolution media.", "داروهای کاتیونی کم‌دوز با Croscarmellose sodium؛ داروهای کاتیونی با SLS در محیط انحلال."),
    mitigation: bi("Consider crospovidone (non-ionic); check recovery and dissolution in media of different ionic strength.", "بررسی Crospovidone (غیریونی)؛ کنترل بازیابی و انحلال در محیط‌هایی با قدرت یونی متفاوت."),
    refs: ["Narang AS et al. Pharm Res 2012;29(10):2660–2683.", "Bharate SS et al. J Excipients Food Chem 2010;1(3):3–26."],
  },
  {
    id: "esterification",
    level: "low",
    groups: ["acid"],
    traits: ["polyol"],
    title: bi("Esterification with polyols", "Esterification با Polyolها"),
    mechanism: bi("Carboxylic acid drugs can form esters with PEG, polysorbates, glycerin, propylene glycol or sugar alcohols, mainly in liquid or semi-solid products and at elevated temperature.", "داروهای دارای Carboxylic acid می‌توانند با PEG، Polysorbateها، Glycerin، Propylene glycol یا قندالکل‌ها استر تشکیل دهند؛ عمدتاً در فرآورده‌های مایع یا نیمه‌جامد و در دمای بالا."),
    consequence: bi("Ester impurities that grow on stability.", "ناخالصی‌های استری که در طول پایداری افزایش می‌یابند."),
    examples: bi("Cetirizine esters with polyols in oral solutions (documented).", "استرهای Cetirizine با Polyolها در محلول‌های خوراکی (مستند)."),
    mitigation: bi("Control pH and temperature, limit polyol content, monitor ester impurities in stability.", "کنترل pH و دما، محدود کردن مقدار Polyol و پایش ناخالصی‌های استری در پایداری."),
    refs: ["Yu H et al. J Pharm Biomed Anal 2010;53(3):745–750.", "Wu Y et al. AAPS PharmSciTech 2011;12(4):1248–1263."],
  },
];

export const compat = {
  title: bi("API–excipient compatibility checker", "بررسی سازگاری API و Excipient"),
  lead: bi(
    "Choose the active substance and the excipients of your formulation: the checker flags the known chemical and physical interactions between the API's reactive groups and the excipients' properties and impurities, with the mechanism, examples, mitigation and literature.",
    "ماده مؤثره و Excipientهای فرمولاسیون را انتخاب کنید: ناسازگاری‌های شیمیایی و فیزیکی شناخته‌شده بین گروه‌های واکنش‌پذیر API و ویژگی‌ها و ناخالصی‌های Excipientها، همراه با مکانیسم، مثال، راه‌حل و رفرنس نمایش داده می‌شود.",
  ),
  back: bi("Formulation", "فرمولاسیون"),
  api: bi("Active substance", "ماده مؤثره"),
  apiPlaceholder: bi("Search an API, e.g. Fluoxetine", "جستجوی ماده مؤثره، مثلاً Fluoxetine"),
  groups: bi("Reactive groups of the API", "گروه‌های واکنش‌پذیر ماده مؤثره"),
  groupsHint: bi(
    "Filled in for the APIs in the list; check or correct them from the structure for any other API.",
    "برای داروهای فهرست به‌طور خودکار پر می‌شود؛ برای داروهای دیگر، بر اساس ساختار مولکول انتخاب یا اصلاح کنید.",
  ),
  excipients: bi("Excipients of the formulation", "Excipientهای فرمولاسیون"),
  results: bi("Possible interactions", "ناسازگاری‌های محتمل"),
  none: bi(
    "No known interaction between the selected groups and excipients. This does not prove compatibility: confirm with a compatibility study.",
    "ناسازگاری شناخته‌شده‌ای بین گروه‌ها و Excipientهای انتخاب‌شده یافت نشد. این به معنای اثبات سازگاری نیست و باید با مطالعه سازگاری تأیید شود.",
  ),
  empty: bi("Select an API (or its groups) and at least one excipient.", "یک ماده مؤثره (یا گروه‌های آن) و دست‌کم یک Excipient انتخاب کنید."),
  level: { high: bi("High risk", "ریسک زیاد"), moderate: bi("Moderate risk", "ریسک متوسط"), low: bi("Low risk", "ریسک کم") },
  involved: bi("Involved", "اجزای درگیر"),
  mechanism: bi("Mechanism", "مکانیسم"),
  consequence: bi("Consequence", "پیامد"),
  examples: bi("Examples", "مثال"),
  mitigation: bi("Mitigation", "راه‌حل"),
  refs: bi("Literature", "رفرنس"),
  sheet: bi("Excipient sheet", "برگه Excipient"),
  studyTitle: bi("Designing a compatibility study", "طراحی مطالعه سازگاری"),
  study: [
    bi("Binary mixtures of API and each excipient, usually 1:1 and at the ratio of the formulation, plus the API alone as control.", "مخلوط‌های دوتایی API با هر Excipient، معمولاً به نسبت 1:1 و به نسبت فرمولاسیون، به‌علاوه API تنها به‌عنوان کنترل."),
    bi("Store open and closed at 40 °C / 75% RH and at 50–60 °C, with and without added water (e.g. 5–20%), for 2–4 weeks.", "نگهداری در ظرف باز و بسته در 40 °C / 75% RH و در 50 تا 60 °C، با و بدون افزودن آب (مثلاً 5 تا 20%)، به مدت 2 تا 4 هفته."),
    bi("Analyse appearance, assay and degradation products by a stability-indicating HPLC method; DSC and FT-IR or XRPD as screening (DSC alone can give false positives).", "ارزیابی ظاهر، Assay و محصولات تخریب با روش HPLC از نوع Stability-indicating؛ DSC و FT-IR یا XRPD برای غربالگری (DSC به‌تنهایی ممکن است نتیجه مثبت کاذب دهد)."),
    bi("Ask suppliers for reactive-impurity data (peroxides, aldehydes, nitrite, metals) and confirm critical ones on incoming lots.", "دریافت داده ناخالصی‌های واکنش‌پذیر (Peroxide، Aldehyde، Nitrite، فلزات) از تأمین‌کننده و تأیید موارد بحرانی روی لات‌های ورودی."),
    bi("Report the outcome in pharmaceutical development (CTD 3.2.P.2.1.2) as part of the excipient selection rationale.", "گزارش نتیجه در بخش Pharmaceutical development (CTD 3.2.P.2.1.2) به‌عنوان بخشی از توجیه انتخاب Excipientها."),
  ],
  disclaimer: bi(
    "A screening aid based on known reaction pathways and the literature; it does not replace experimental compatibility and stability data.",
    "ابزار غربالگری بر پایه مسیرهای واکنش شناخته‌شده و منابع علمی؛ جایگزین داده‌های تجربی سازگاری و پایداری نیست.",
  ),
  refsTitle: bi("References", "مراجع"),
  references: [
    "Bharate SS, Bharate SB, Bajaj AN. Interactions and incompatibilities of pharmaceutical excipients with active pharmaceutical ingredients: a comprehensive review. J Excipients Food Chem 2010;1(3):3–26.",
    "Narang AS, Desai D, Badawy S. Impact of excipient interactions on solid dosage form stability. Pharm Res 2012;29(10):2660–2683.",
    "Wu Y, Levons J, Narang AS, Raghavan K, Rao VM. Reactive impurities in excipients: profiling, identification and mitigation of drug–excipient incompatibility. AAPS PharmSciTech 2011;12(4):1248–1263.",
    "Wirth DD et al. Maillard reaction of lactose and fluoxetine hydrochloride, a secondary amine. J Pharm Sci 1998;87(1):31–39.",
    "Wasylaschuk WR et al. Evaluation of hydroperoxides in common pharmaceutical excipients. J Pharm Sci 2007;96(1):106–116.",
    "Hartauer KJ et al. Influence of peroxide impurities in povidone and crospovidone on the stability of raloxifene hydrochloride in tablets. Pharm Dev Technol 2000;5(3):303–310.",
    "Waterman KC et al. N-methylation and N-formylation of a secondary amine drug (varenicline) in an osmotic tablet. J Pharm Sci 2008;97(4):1499–1507.",
    "Boetzel R et al. A nitrite excipient database: a useful tool to support N-nitrosamine risk assessments for drug products. J Pharm Sci 2023;112(6):1615–1624.",
    "Yu H, Cornett C, Larsen J, Hansen SH. Reaction between drug substances and pharmaceutical excipients: formation of esters between cetirizine and polyols. J Pharm Biomed Anal 2010;53(3):745–750.",
    "ICH Q8(R2) Pharmaceutical Development.",
  ],
};
