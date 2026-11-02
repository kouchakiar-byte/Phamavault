import { bi, type Bi } from "@/i18n/bi";
import type { Ref } from "./pharmacy";

/*
 * Pharmacy counter tools: patient leaflets, children's oral doses by weight and
 * supplement / herbal–drug interactions. Every figure and rule names its source;
 * written by the PharmaVault team, Aban 1405 (November 2026).
 */

const ltr = (s: string) => `⁦${s}⁩`;

/* ------------------------------------------------------------------ leaflets */

export type Leaflet = {
  key: string;
  title: Bi;
  intro: Bi;
  before?: { title: Bi; text: Bi };
  stepsTitle: Bi;
  steps: Bi[];
  after: Bi[];
  warn: Bi[];
  refs: Ref[];
};

export const leafletsCopy = {
  title: bi("Patient leaflets", "بروشور آموزش بیمار"),
  lead: bi(
    "Plain-language instructions to print with your pharmacy's name and phone and hand to the patient with the medicine.",
    "راهنمای ساده و قابل چاپ برای بیمار؛ نام و تلفن داروخانه را وارد کنید، چاپ کنید و همراه دارو به بیمار بدهید.",
  ),
  pharmacyName: bi("Pharmacy name", "نام داروخانه"),
  pharmacyPhone: bi("Pharmacy phone", "تلفن داروخانه"),
  pharmacyHint: bi("Saved on this device only.", "فقط روی همین دستگاه ذخیره می‌شود."),
  print: bi("Print the leaflet", "چاپ بروشور"),
  questions: bi("Questions? Ask your pharmacist:", "سؤال دارید؟ از داروساز بپرسید:"),
  notice: bi(
    "This leaflet does not replace your doctor's instructions or the leaflet in the pack.",
    "این راهنما جایگزین دستور پزشک و بروشور داخل جعبه دارو نیست.",
  ),
  open: bi("Open", "مشاهده"),
};

export const leaflets: Leaflet[] = [
  {
    key: "mdi",
    title: bi("How to use a metered-dose inhaler (MDI)", `روش صحیح استفاده از اسپری استنشاقی (${ltr("MDI")})`),
    intro: bi(
      "An inhaler takes the medicine straight to the lungs. Used the wrong way, most of the dose stays in the mouth and throat and the treatment works less well.",
      "اسپری استنشاقی دارو را مستقیم به ریه می‌رساند. اگر روش استفاده درست نباشد، بیشتر دارو در دهان و گلو می‌ماند و اثر درمان کم می‌شود.",
    ),
    before: {
      title: bi("Before the first use", "پیش از اولین استفاده"),
      text: bi(
        "If the inhaler is new or has not been used for several days, spray it into the air as the pack leaflet says, so that it gives a full dose.",
        "اگر اسپری نو است یا چند روز از آن استفاده نشده، طبق بروشور داخل جعبه یک یا چند پاف در هوا بزنید تا دوز کامل بدهد.",
      ),
    },
    stepsTitle: bi("Each time you use it", "هر بار مصرف"),
    steps: [
      bi("Take the cap off the mouthpiece and check that it is clean.", "درپوش دهانه را بردارید و از تمیز بودن دهانه مطمئن شوید."),
      bi("Shake the inhaler well for a few seconds.", "اسپری را چند ثانیه خوب تکان دهید."),
      bi("Sit or stand up straight and breathe out fully, away from the inhaler.", "صاف بنشینید یا بایستید و نفس خود را کامل بیرون دهید؛ دور از اسپری."),
      bi("Put the mouthpiece between your teeth and close your lips around it.", "دهانه را بین دندان‌ها بگذارید و لب‌ها را دور آن ببندید."),
      bi(
        "Start breathing in slowly and deeply, and at the same moment press the canister once. Keep breathing in.",
        "هم‌زمان با شروع یک دم آرام و عمیق، مخزن را یک بار فشار دهید و دم را آرام و عمیق ادامه دهید.",
      ),
      bi(
        "Take the inhaler out of your mouth and hold your breath for about 10 seconds, or as long as is comfortable, then breathe out slowly.",
        "اسپری را از دهان خارج کنید و نفس خود را حدود 10 ثانیه (یا تا جایی که راحت هستید) نگه دارید؛ سپس آرام بازدم کنید.",
      ),
      bi(
        "If a second puff is prescribed, wait about 30 to 60 seconds, shake again and repeat steps 3 to 6.",
        "اگر پاف دوم تجویز شده است، حدود 30 تا 60 ثانیه صبر کنید، دوباره اسپری را تکان دهید و مراحل 3 تا 6 را تکرار کنید.",
      ),
      bi("Put the cap back on.", "درپوش را دوباره روی دهانه بگذارید."),
    ],
    after: [
      bi(
        "If the inhaler contains a corticosteroid (for example beclometasone, budesonide or fluticasone), rinse your mouth with water and spit it out after each use.",
        "اگر اسپری حاوی کورتون است (مانند بکلومتازون، بودزوناید یا فلوتیکازون)، پس از هر بار مصرف دهان را با آب بشویید و آب را بیرون بریزید.",
      ),
      bi(
        "A spacer helps children and anyone who finds it hard to press and breathe in at the same time.",
        `برای کودکان و کسانی که هماهنگی فشار دادن و دم برایشان دشوار است، استفاده از محفظه (${ltr("Spacer")}) توصیه می‌شود.`,
      ),
      bi(
        "Clean the plastic mouthpiece once a week as the pack leaflet says and let it dry in the air; do not put the metal canister in water.",
        "دهانه پلاستیکی را هفته‌ای یک بار طبق بروشور بشویید و بگذارید در هوا خشک شود؛ مخزن فلزی را در آب نگذارید.",
      ),
    ],
    warn: [
      bi(
        "If your breathing does not get better after using the inhaler, or you need it more often than usual, see a doctor straight away.",
        "اگر تنگی نفس با اسپری بهتر نشد یا بیش از معمول به اسپری نیاز دارید، فوراً به پزشک مراجعه کنید.",
      ),
    ],
    refs: [
      { label: "NHS — Beclometasone inhalers", url: "https://www.nhs.uk/medicines/beclometasone-inhalers/how-and-when-to-use-beclometasone-inhalers/" },
      { label: "MedlinePlus — Metered-dose inhaler", url: "https://medlineplus.gov/ency/presentations/100200_4.htm" },
      { label: "Minnesota Department of Health — Inhaler", url: "https://www.health.state.mn.us/diseases/asthma/professionals/inhaleradult.pdf" },
    ],
  },
];

/* ------------------------------------------------------- children's doses */

export type PedDrug = {
  key: "paracetamol" | "ibuprofen";
  name: Bi;
  /** mg/kg per dose: usual and highest. */
  perDose: [number, number];
  maxPerDoseMg: number;
  interval: Bi;
  maxDoses: number;
  maxPerKgDay: number;
  minMonths: number;
  minKg: number;
  forms: { label: Bi; mg: number; ml: number }[];
  cautions: Bi[];
  refs: Ref[];
};

export const pedDoseCopy = {
  title: bi("Children's oral doses by weight", "محاسبه دوز خوراکی کودکان بر اساس وزن"),
  lead: bi(
    "Paracetamol and ibuprofen for fever and pain: the dose in mg and in mL of the chosen product, the interval and the 24-hour limit.",
    `استامینوفن و ایبوپروفن برای تب و درد: دوز بر حسب ${ltr("mg")} و ${ltr("mL")} فرآورده انتخاب‌شده، فاصله مصرف و سقف 24 ساعته.`,
  ),
  drug: bi("Medicine", "دارو"),
  weight: bi("Weight (kg)", `وزن (${ltr("kg")})`),
  age: bi("Age (months)", "سن (ماه)"),
  form: bi("Product (check the strength on the label)", "فرآورده (غلظت را روی برچسب بررسی کنید)"),
  custom: bi("Other strength", "غلظت دیگر"),
  customMg: bi("mg in", `${ltr("mg")} در`),
  customMl: bi("mL", ltr("mL")),
  dose: bi("Each dose", "هر نوبت"),
  range: bi("Usual range", "محدوده معمول"),
  every: bi("Interval", "فاصله مصرف"),
  max24: bi("No more than", "حداکثر"),
  doses: bi("doses in 24 hours", "نوبت در 24 ساعت"),
  dayMax: bi("Total in 24 hours at most", "سقف کل 24 ساعت"),
  tooYoung: bi(
    "Under {m} months or under {kg} kg: only on a doctor's advice.",
    "کمتر از {m} ماه یا کمتر از {kg} کیلوگرم: فقط با تجویز پزشک.",
  ),
  enter: bi("Enter the weight and age.", "وزن و سن کودک را وارد کنید."),
  rounding: bi(
    "mL is rounded down to the nearest 0.5 mL; measure with the syringe or cup that comes with the product, not a kitchen spoon.",
    `حجم به نزدیک‌ترین ${ltr("0.5 mL")} پایین‌تر گرد شده است؛ با سرنگ یا پیمانه همراه فرآورده اندازه بگیرید، نه قاشق آشپزخانه.`,
  ),
  disclaimer: bi(
    "For pharmacists and doctors. A doctor's prescription takes precedence; doses are for children of normal weight without liver or kidney disease. Do not give two paracetamol-containing products together.",
    "ویژه داروساز و پزشک. دستور پزشک مقدم است. دوزها برای کودک با وزن طبیعی و بدون بیماری کبدی یا کلیوی است. دو فرآورده حاوی استامینوفن را هم‌زمان مصرف نکنید.",
  ),
};

export const pedDrugs: PedDrug[] = [
  {
    key: "paracetamol",
    name: bi("Paracetamol (acetaminophen)", "استامینوفن (پاراستامول)"),
    perDose: [10, 15],
    maxPerDoseMg: 1000,
    interval: bi("every 4–6 hours", "هر 4 تا 6 ساعت"),
    maxDoses: 4,
    maxPerKgDay: 60,
    minMonths: 3,
    minKg: 5,
    forms: [
      { label: bi("Syrup 120 mg / 5 mL", `شربت ${ltr("120 mg / 5 mL")}`), mg: 120, ml: 5 },
      { label: bi("Syrup 250 mg / 5 mL", `شربت ${ltr("250 mg / 5 mL")}`), mg: 250, ml: 5 },
      { label: bi("Drops 100 mg / mL", `قطره ${ltr("100 mg / mL")}`), mg: 100, ml: 1 },
    ],
    cautions: [
      bi(
        "Count paracetamol in cold and flu products too; an overdose damages the liver.",
        "استامینوفن موجود در داروهای سرماخوردگی را هم حساب کنید؛ مصرف بیش از حد به کبد آسیب می‌زند.",
      ),
      bi(
        "Malnourished or dehydrated children and children with liver disease: lower doses, on a doctor's advice.",
        "در کودکان دچار سوءتغذیه، کم‌آبی یا بیماری کبدی: دوز کمتر و با نظر پزشک.",
      ),
    ],
    refs: [
      { label: "WHO — Pharmacological treatment of persisting pain in children (2012)" },
      { label: "BNF for Children — Paracetamol", url: "https://bnfc.nice.org.uk/drugs/paracetamol/" },
    ],
  },
  {
    key: "ibuprofen",
    name: bi("Ibuprofen", "ایبوپروفن"),
    perDose: [5, 10],
    maxPerDoseMg: 400,
    interval: bi("every 6–8 hours", "هر 6 تا 8 ساعت"),
    maxDoses: 4,
    maxPerKgDay: 30,
    minMonths: 3,
    minKg: 5,
    forms: [
      { label: bi("Suspension 100 mg / 5 mL", `سوسپانسیون ${ltr("100 mg / 5 mL")}`), mg: 100, ml: 5 },
      { label: bi("Suspension 200 mg / 5 mL", `سوسپانسیون ${ltr("200 mg / 5 mL")}`), mg: 200, ml: 5 },
    ],
    cautions: [
      bi("Give with food or milk.", "همراه غذا یا شیر داده شود."),
      bi(
        "Not for a child who is dehydrated (vomiting, diarrhoea, drinking little) or has chickenpox; caution in asthma and kidney disease.",
        "در کودک دچار کم‌آبی (استفراغ، اسهال، کم‌نوشیدن) یا آبله‌مرغان مصرف نشود؛ در آسم و بیماری کلیه با احتیاط.",
      ),
    ],
    refs: [
      { label: "MSF Essential Drugs — Ibuprofen oral", url: "https://medicalguidelines.msf.org/en/viewport/EssDr/english/ibuprofen-oral-16683877.html" },
      { label: "BNF for Children — Ibuprofen", url: "https://bnfc.nice.org.uk/drugs/ibuprofen/" },
    ],
  },
];

/* ------------------------------------------- supplement–drug interactions */

export type SupplementRule = {
  id: string;
  supplement: Bi;
  drugs: Bi;
  severity: "major" | "moderate" | "minor";
  effect: Bi;
  action: Bi;
  refs: Ref[];
};

export const supplementsCopy = {
  title: bi("Supplement and herbal interactions", "تداخل مکمل‌ها و داروهای گیاهی با دارو"),
  lead: bi(
    "Common supplements and herbal products that change the effect of medicines, with what to tell the patient.",
    "مکمل‌ها و فرآورده‌های گیاهی رایجی که اثر داروها را تغییر می‌دهند، همراه با توصیه لازم به بیمار.",
  ),
  search: bi("Search a supplement or a medicine", "جستجوی مکمل یا دارو"),
  placeholder: bi("e.g. warfarin, licorice, iron", "مثلاً: وارفارین، شیرین‌بیان، آهن"),
  with: bi("With", "با"),
  effect: bi("Effect", "اثر"),
  action: bi("What to do", "توصیه"),
  none: bi("Nothing found.", "موردی یافت نشد."),
  severity: {
    major: bi("Major", "شدید"),
    moderate: bi("Moderate", "متوسط"),
    minor: bi("Minor", "خفیف"),
  },
  note: bi(
    "Ask every patient about supplements and herbal products; many do not count them as medicines.",
    "از هر بیمار درباره مصرف مکمل و داروی گیاهی بپرسید؛ بسیاری آن‌ها را دارو به حساب نمی‌آورند.",
  ),
};

const nccih = (name: string, path: string): Ref => ({ label: `NCCIH — ${name}`, url: `https://www.nccih.nih.gov/health/${path}` });
const ods = (name: string, path: string): Ref => ({ label: `NIH ODS — ${name}`, url: `https://ods.od.nih.gov/factsheets/${path}-HealthProfessional/` });

export const supplementRules: SupplementRule[] = [
  {
    id: "sjw-induction",
    supplement: bi("St John's wort (Hypericum)", `گل راعی (${ltr("St John's wort")})`),
    drugs: bi(
      "Oral contraceptives, warfarin, ciclosporin, tacrolimus, digoxin, HIV protease inhibitors",
      "قرص‌های ضدبارداری خوراکی، وارفارین، سیکلوسپورین، تاکرولیموس، دیگوکسین، داروهای ضد HIV از گروه مهارکننده‌های پروتئاز",
    ),
    severity: "major",
    effect: bi(
      "Induces CYP3A4 and P-glycoprotein and lowers the blood levels of these drugs: contraceptive failure, clots, transplant rejection.",
      `با القای ${ltr("CYP3A4")} و ${ltr("P-glycoprotein")} سطح خونی این داروها را کم می‌کند: شکست پیشگیری از بارداری، لخته، رد پیوند.`,
    ),
    action: bi("Do not take together; tell the doctor before stopping St John's wort, as levels then rise.", "هم‌زمان مصرف نشود. قطع گل راعی هم باید با اطلاع پزشک باشد، چون پس از قطع، سطح دارو بالا می‌رود."),
    refs: [nccih("St. John's Wort", "st-johns-wort")],
  },
  {
    id: "sjw-serotonin",
    supplement: bi("St John's wort (Hypericum)", `گل راعی (${ltr("St John's wort")})`),
    drugs: bi("SSRIs, SNRIs, triptans, tramadol", `داروهای ضدافسردگی ${ltr("SSRI")} و ${ltr("SNRI")}، تریپتان‌ها، ترامادول`),
    severity: "major",
    effect: bi("Risk of serotonin syndrome (agitation, tremor, fever, fast heartbeat).", "خطر سندرم سروتونین (بی‌قراری، لرزش، تب، تپش قلب)."),
    action: bi("Do not take together.", "هم‌زمان مصرف نشود."),
    refs: [nccih("St. John's Wort", "st-johns-wort")],
  },
  {
    id: "ginkgo-bleeding",
    supplement: bi("Ginkgo", "جینکو"),
    drugs: bi("Warfarin, aspirin, clopidogrel, NSAIDs", `وارفارین، آسپرین، کلوپیدوگرل، داروهای ${ltr("NSAID")}`),
    severity: "moderate",
    effect: bi("Possible additive bleeding risk; bleeding has been reported.", "احتمال افزایش خطر خونریزی؛ موارد خونریزی گزارش شده است."),
    action: bi("Avoid together; stop ginkgo before surgery as the surgeon advises.", "از مصرف هم‌زمان پرهیز شود؛ پیش از جراحی طبق نظر پزشک قطع شود."),
    refs: [nccih("Ginkgo", "ginkgo")],
  },
  {
    id: "garlic",
    supplement: bi("Garlic supplements", "مکمل سیر"),
    drugs: bi("Warfarin; saquinavir", "وارفارین؛ ساکویناویر"),
    severity: "moderate",
    effect: bi("May raise bleeding risk with warfarin; lowers saquinavir levels.", "ممکن است خطر خونریزی را با وارفارین بیشتر کند؛ سطح ساکویناویر را کاهش می‌دهد."),
    action: bi("Avoid the supplement (garlic as food is fine); monitor INR.", `از مکمل پرهیز شود (سیر در حد غذا مشکلی ندارد)؛ ${ltr("INR")} پایش شود.`),
    refs: [nccih("Garlic", "garlic")],
  },
  {
    id: "licorice",
    supplement: bi("Licorice root (glycyrrhizin)", "شیرین‌بیان (حاوی گلیسیریزین)"),
    drugs: bi("Thiazide and loop diuretics, digoxin, corticosteroids, antihypertensives", "دیورتیک‌های تیازیدی و لوپ، دیگوکسین، کورتیکواستروئیدها، داروهای ضدفشار خون"),
    severity: "moderate",
    effect: bi(
      "Large or long use lowers potassium and raises blood pressure: digoxin toxicity, weaker blood-pressure control.",
      "مصرف زیاد یا طولانی پتاسیم خون را کاهش و فشار خون را افزایش می‌دهد: خطر مسمومیت با دیگوکسین و کنترل ضعیف‌تر فشار خون.",
    ),
    action: bi("Avoid regular use with these drugs; deglycyrrhizinated products do not have this effect.", `مصرف منظم همراه این داروها توصیه نمی‌شود؛ فرآورده‌های بدون گلیسیریزین (${ltr("DGL")}) این اثر را ندارند.`),
    refs: [nccih("Licorice Root", "licorice-root")],
  },
  {
    id: "valerian",
    supplement: bi("Valerian", "سنبل‌الطیب"),
    drugs: bi("Benzodiazepines, sleeping tablets, sedating antihistamines, opioids, alcohol", "بنزودیازپین‌ها، داروهای خواب‌آور، آنتی‌هیستامین‌های خواب‌آور، اپیوئیدها، الکل"),
    severity: "moderate",
    effect: bi("Added drowsiness.", "تشدید خواب‌آلودگی و کاهش هوشیاری."),
    action: bi("Avoid together; do not drive if drowsy.", "از مصرف هم‌زمان پرهیز شود؛ در صورت خواب‌آلودگی رانندگی نکنید."),
    refs: [nccih("Valerian", "valerian")],
  },
  {
    id: "vitk-warfarin",
    supplement: bi("Vitamin K (and multivitamins that contain it)", "ویتامین K (و مولتی‌ویتامین‌های حاوی آن)"),
    drugs: bi("Warfarin", "وارفارین"),
    severity: "moderate",
    effect: bi("Lowers the effect of warfarin (INR falls).", `اثر وارفارین را کم می‌کند (کاهش ${ltr("INR")}).`),
    action: bi("Keep the vitamin K intake steady; tell the doctor before starting or stopping.", "مقدار دریافت ویتامین K ثابت بماند؛ شروع یا قطع مکمل با اطلاع پزشک باشد."),
    refs: [ods("Vitamin K", "VitaminK")],
  },
  {
    id: "cations-levothyroxine",
    supplement: bi("Calcium, iron, magnesium and zinc supplements", "مکمل‌های کلسیم، آهن، منیزیم و روی"),
    drugs: bi("Levothyroxine", "لووتیروکسین"),
    severity: "moderate",
    effect: bi("Lower the absorption of levothyroxine.", "جذب لووتیروکسین را کاهش می‌دهند."),
    action: bi("Take levothyroxine at least 4 hours apart from these supplements.", "لووتیروکسین دست‌کم 4 ساعت جدا از این مکمل‌ها مصرف شود."),
    refs: [ods("Calcium", "Calcium"), ods("Iron", "Iron")],
  },
  {
    id: "cations-quinolones",
    supplement: bi("Calcium, iron, magnesium and zinc supplements, antacids", "مکمل‌های کلسیم، آهن، منیزیم و روی، آنتی‌اسیدها"),
    drugs: bi("Fluoroquinolones (ciprofloxacin, levofloxacin), tetracyclines (doxycycline)", "فلوروکینولون‌ها (سیپروفلوکساسین، لووفلوکساسین)، تتراسایکلین‌ها (داکسی‌سایکلین)"),
    severity: "moderate",
    effect: bi("Bind the antibiotic in the gut and sharply lower its absorption, so the infection may not respond.", "با آنتی‌بیوتیک در روده کمپلکس می‌سازند و جذب آن را به‌شدت کم می‌کنند؛ درمان عفونت ممکن است شکست بخورد."),
    action: bi(
      "Take ciprofloxacin at least 2 hours before or 6 hours after the supplement; follow each antibiotic's label for the gap.",
      "سیپروفلوکساسین دست‌کم 2 ساعت قبل یا 6 ساعت بعد از مکمل مصرف شود؛ برای سایر آنتی‌بیوتیک‌ها فاصله طبق بروشور همان دارو رعایت شود.",
    ),
    refs: [ods("Magnesium", "Magnesium"), ods("Zinc", "Zinc")],
  },
  {
    id: "ginseng-warfarin",
    supplement: bi("Asian ginseng", "جینسنگ آسیایی"),
    drugs: bi("Warfarin", "وارفارین"),
    severity: "moderate",
    effect: bi("Has been reported to lower the effect of warfarin.", "کاهش اثر وارفارین گزارش شده است."),
    action: bi("Avoid together, or monitor INR closely.", `از مصرف هم‌زمان پرهیز شود یا ${ltr("INR")} به‌دقت پایش شود.`),
    refs: [nccih("Asian Ginseng", "asian-ginseng")],
  },
  {
    id: "greentea-nadolol",
    supplement: bi("Green tea extract", "عصاره چای سبز"),
    drugs: bi("Nadolol", "نادولول"),
    severity: "moderate",
    effect: bi("Lowers nadolol levels and may weaken blood-pressure control.", "سطح نادولول را کاهش می‌دهد و ممکن است کنترل فشار خون را ضعیف کند."),
    action: bi("Avoid green tea extract with nadolol.", "عصاره چای سبز همراه نادولول مصرف نشود."),
    refs: [nccih("Green Tea", "green-tea")],
  },
  {
    id: "omega3",
    supplement: bi("Omega-3 fish oil (high dose)", "امگا 3 (روغن ماهی با دوز بالا)"),
    drugs: bi("Warfarin and other anticoagulants or antiplatelets", "وارفارین و سایر ضدانعقادها یا ضدپلاکت‌ها"),
    severity: "minor",
    effect: bi("High doses may slightly add to bleeding tendency.", "دوزهای بالا ممکن است تمایل به خونریزی را اندکی افزایش دهند."),
    action: bi("Tell the doctor; watch for bruising or bleeding.", "به پزشک اطلاع داده شود؛ به کبودی یا خونریزی توجه شود."),
    refs: [ods("Omega-3 Fatty Acids", "Omega3FattyAcids")],
  },
  {
    id: "potassium",
    supplement: bi("Potassium supplements and potassium salt substitutes", "مکمل پتاسیم و نمک‌های جایگزین حاوی پتاسیم"),
    drugs: bi("ACE inhibitors, ARBs, spironolactone, amiloride", `مهارکننده‌های ${ltr("ACE")}، داروهای ${ltr("ARB")}، اسپیرونولاکتون، آمیلوراید`),
    severity: "major",
    effect: bi("Risk of high blood potassium, which can cause dangerous heart rhythms.", "خطر افزایش پتاسیم خون که می‌تواند به آریتمی خطرناک قلبی منجر شود."),
    action: bi("Only on a doctor's advice, with potassium checks.", "فقط با تجویز پزشک و پایش پتاسیم خون."),
    refs: [ods("Potassium", "Potassium")],
  },
];
