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

export const toolsCopy = {
  title: bi("Counter tools", "ابزارهای پیشخوان داروخانه"),
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
    "This leaflet does not replace the leaflet in the medicine pack or the instructions of your doctor or pharmacist. Where they differ, follow the doctor and the pack leaflet.",
    "این راهنما جایگزین بروشور داخل جعبه دارو و دستور پزشک یا داروساز نیست. در صورت هرگونه تفاوت، دستور پزشک و بروشور همان دارو ملاک است.",
  ),
  list: bi("Leaflets", "بروشورها"),
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

const ashp: Ref = { label: "ASHP — SafeMedication.com" };
const medline = (name: string, path: string): Ref => ({ label: `MedlinePlus — ${name}`, url: `https://medlineplus.gov/${path}` });

leaflets.push(
  {
    key: "insulin-pen",
    title: bi("How to inject insulin with a pen", `روش تزریق انسولین با قلم (${ltr("Pen")})`),
    intro: bi(
      "The right technique gives the full dose every time and keeps the injection sites healthy.",
      "روش صحیح تزریق باعث می‌شود هر بار دوز کامل دریافت شود و محل‌های تزریق سالم بمانند.",
    ),
    stepsTitle: bi("Each injection", "هر بار تزریق"),
    steps: [
      bi("Wash your hands. Check the insulin name and the expiry date on the pen.", "دست‌ها را بشویید. نام انسولین و تاریخ انقضا را روی قلم بررسی کنید."),
      bi(
        "If the insulin is cloudy (for example NPH or a mixed insulin), mix it gently as the pack leaflet shows, by rolling and tipping the pen; do not shake it hard.",
        "اگر انسولین کدر است (مانند NPH یا انسولین‌های مخلوط)، آن را طبق بروشور با غلتاندن و بالا و پایین کردن آرام قلم یکنواخت کنید؛ تکان شدید ندهید.",
      ),
      bi("Fit a new needle.", "یک سرسوزن نو روی قلم ببندید."),
      bi(
        "Dial 2 units, hold the pen needle-up, tap it and press the button until a drop of insulin appears at the tip (priming). If none appears, repeat.",
        "2 واحد انتخاب کنید، قلم را رو به بالا نگه دارید، چند ضربه آرام بزنید و دکمه را فشار دهید تا قطره انسولین در نوک سوزن دیده شود (هواگیری). اگر قطره دیده نشد، تکرار کنید.",
      ),
      bi("Dial the prescribed dose.", "دوز تجویزشده را انتخاب کنید."),
      bi(
        "Choose a site you were taught (abdomen, thigh or upper arm) and move a few centimetres from the last injection each time.",
        "محل تزریق را طبق آموزش (شکم، ران یا بازو) انتخاب کنید و هر بار چند سانتی‌متر از محل تزریق قبلی فاصله بگیرید.",
      ),
      bi(
        "Insert the needle as you were taught, press the button all the way and keep the needle in the skin for at least 10 seconds, then pull it out.",
        "سوزن را طبق آموزش وارد کنید، دکمه را تا انتها فشار دهید و سوزن را دست‌کم 10 ثانیه در پوست نگه دارید؛ سپس خارج کنید.",
      ),
      bi("Remove the needle and put it in a hard container with a lid (for example a plastic bottle).", "سرسوزن را جدا کنید و در یک ظرف سخت درب‌دار (مانند بطری پلاستیکی) بیندازید."),
    ],
    after: [
      bi("Keep unopened pens in the fridge (2–8 °C); never freeze insulin.", `قلم‌های باز نشده در یخچال (${ltr("2–8 °C")}) نگهداری شوند؛ انسولین هرگز نباید یخ بزند.`),
      bi(
        "The pen in use is usually kept at room temperature; how long it can be used after first use is in that insulin's leaflet.",
        "قلم در حال مصرف معمولاً در دمای اتاق نگهداری می‌شود؛ مدت مجاز مصرف پس از اولین استفاده را از بروشور همان انسولین ببینید.",
      ),
      bi("Never share a pen with anyone, even with a new needle.", "قلم را با هیچ‌کس مشترک استفاده نکنید، حتی با سرسوزن نو."),
      bi("Never inject a double dose to make up for a missed one.", "هرگز برای جبران نوبت فراموش‌شده، دوز دو برابر تزریق نکنید."),
    ],
    warn: [
      bi(
        "Signs of low blood sugar (shaking, sweating, hunger, confusion): take sugar or a sugary drink at once and tell your doctor.",
        "در صورت علائم افت قند خون (لرزش، تعریق، گرسنگی، گیجی) فوراً قند یا نوشیدنی شیرین مصرف کنید و به پزشک اطلاع دهید.",
      ),
    ],
    refs: [
      { label: "NHS — How and when to take long-acting insulin", url: "https://www.nhs.uk/medicines/insulin/long-acting-insulin/how-and-when-to-take-long-acting-insulin/" },
      { label: "NHS (MKUH) — Insulin via pen device", url: "https://www.mkuh.nhs.uk/patient-information-leaflet/administration-of-insulin-via-pen-device" },
      { label: "HealthLink BC — How to use an insulin pen", url: "https://www.healthlinkbc.ca/how-use-insulin-pen" },
    ],
  },
  {
    key: "eye-drops",
    title: bi("How to use eye drops", "روش صحیح استفاده از قطره چشمی"),
    intro: bi(
      "A drop placed correctly stays in the eye and works; a dropper that touches the eye can contaminate the whole bottle.",
      "قطره‌ای که درست چکانده شود در چشم می‌ماند و اثر می‌کند؛ اگر نوک قطره‌چکان به چشم بخورد، ممکن است کل شیشه آلوده شود.",
    ),
    stepsTitle: bi("Each time you use it", "هر بار مصرف"),
    steps: [
      bi("Wash your hands. Check the expiry date and the date you opened the bottle.", "دست‌ها را بشویید. تاریخ انقضا و تاریخ باز کردن شیشه را بررسی کنید."),
      bi("Take out contact lenses unless the leaflet says they can stay in.", "اگر لنز تماسی دارید، آن را خارج کنید، مگر اینکه بروشور دارو اجازه داده باشد."),
      bi("Tilt your head back and gently pull the lower eyelid down to make a small pocket.", "سر را کمی به عقب خم کنید و پلک پایین را آرام پایین بکشید تا یک فضای کوچک ایجاد شود."),
      bi(
        "Look up and squeeze one drop into the pocket. The tip must not touch the eye, the eyelashes or your fingers.",
        "به بالا نگاه کنید و یک قطره داخل این فضا بچکانید. نوک قطره‌چکان نباید به چشم، مژه یا انگشت برخورد کند.",
      ),
      bi("Close the eye gently for about 1–2 minutes without blinking hard.", "چشم را حدود 1 تا 2 دقیقه به‌آرامی ببندید و پلک محکم نزنید."),
      bi("Wipe away any extra liquid with a clean tissue and close the bottle at once.", "مایع اضافی را با دستمال تمیز پاک کنید و درِ شیشه را بلافاصله ببندید."),
    ],
    after: [
      bi(
        "Using more than one kind of drop: wait at least 5 minutes between them. Use drops before any eye ointment.",
        "اگر چند نوع قطره مصرف می‌کنید، بین آن‌ها دست‌کم 5 دقیقه فاصله بگذارید. قطره را پیش از پماد چشمی مصرف کنید.",
      ),
      bi(
        "Write the opening date on the bottle. Many drops must be thrown away 4 weeks after opening; check the leaflet of your product.",
        "تاریخ باز کردن را روی شیشه بنویسید. بسیاری از قطره‌ها باید 4 هفته پس از باز شدن دور ریخته شوند؛ مدت دقیق را از بروشور همان فرآورده ببینید.",
      ),
      bi("Do not share eye drops with anyone.", "قطره چشمی را با دیگران مشترک استفاده نکنید."),
    ],
    warn: [
      bi(
        "Eye pain, a change in vision or redness that gets worse: stop the drops and see a doctor straight away.",
        "در صورت درد چشم، تغییر بینایی یا قرمزی رو به افزایش، مصرف را قطع کنید و فوراً به پزشک مراجعه کنید.",
      ),
    ],
    refs: [
      { label: "NHS — How to use carmellose eye drops", url: "https://www.nhs.uk/medicines/carmellose-sodium/how-and-when-to-use-carmellose-sodium-eye-drops/" },
      { label: "Gloucestershire Hospitals NHS — Eye drops", url: "https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/eye-drops-ghpi0067/" },
      { label: "Sandwell and West Birmingham NHS — Your eye drops", url: "https://www.swbh.nhs.uk/wp-content/uploads/2012/07/Your-eye-drops-ML4782.pdf" },
    ],
  },
  {
    key: "suppository",
    title: bi("How to use a rectal suppository", "روش صحیح استفاده از شیاف مقعدی"),
    intro: bi("A suppository is used in the rectum, not by mouth.", "شیاف برای استفاده از راه مقعد است و نباید بلعیده شود."),
    stepsTitle: bi("Each time you use it", "هر بار مصرف"),
    steps: [
      bi("If possible, empty your bowels first. Wash your hands.", "در صورت امکان ابتدا روده را خالی کنید. دست‌ها را بشویید."),
      bi(
        "If the suppository is soft, put it in the fridge for a few minutes or hold it under cold water, still in its wrapper.",
        "اگر شیاف نرم شده است، چند دقیقه در یخچال بگذارید یا در همان بسته‌بندی زیر آب سرد بگیرید.",
      ),
      bi("Take off the wrapper. You may wet the tip with a little water; do not use petroleum jelly.", "بسته‌بندی را جدا کنید. می‌توانید نوک شیاف را با کمی آب مرطوب کنید؛ از وازلین استفاده نکنید."),
      bi("Lie on your side with the lower leg straight and the upper knee bent towards your stomach.", "به پهلو دراز بکشید؛ پای پایینی صاف و زانوی پای بالایی به سمت شکم خم باشد."),
      bi(
        "Gently push the suppository, pointed end first, past the muscle of the anus: about 2.5 cm in adults, less in children.",
        "شیاف را از سمت نوک تیز به‌آرامی وارد کنید تا از عضله حلقوی مقعد عبور کند؛ در بزرگسالان حدود 2.5 سانتی‌متر و در کودکان کمتر.",
      ),
      bi("Stay lying down for about 15 minutes so that it does not come out. Wash your hands.", "حدود 15 دقیقه دراز بکشید تا شیاف خارج نشود. سپس دست‌ها را بشویید."),
    ],
    after: [
      bi("Store suppositories in a cool place, or in the fridge if the label says so.", "شیاف را در جای خنک یا، اگر روی برچسب نوشته شده، در یخچال نگهداری کنید."),
    ],
    warn: [
      bi("Pain or bleeding: stop and ask your doctor.", "در صورت درد یا خونریزی، مصرف را متوقف کنید و با پزشک مشورت کنید."),
    ],
    refs: [medline("Rectal suppositories", "druginfo/meds/a601174.html"), ashp],
  },
  {
    key: "antibiotic-suspension",
    title: bi("Antibiotic suspensions for children: preparing, giving and storing", "سوسپانسیون آنتی‌بیوتیک کودکان: آماده‌سازی، مصرف و نگهداری"),
    intro: bi(
      "The powder must be mixed with exactly the right amount of water, and the course must be finished even when the child feels better.",
      "پودر باید دقیقاً با مقدار آب مشخص‌شده مخلوط شود و دوره درمان حتی پس از بهبود حال کودک باید کامل شود.",
    ),
    before: {
      title: bi("Preparing the bottle", "آماده‌سازی شیشه"),
      text: bi(
        "Best done by the pharmacist. At home: tap the bottle to loosen the powder, add boiled and cooled water up to the line in two parts and shake well after each.",
        "بهتر است داروساز آن را آماده کند. در منزل: با ضربه آرام پودر را از ته شیشه جدا کنید، آب جوشیده سردشده را در دو مرحله تا خط نشانه اضافه کنید و پس از هر مرحله خوب تکان دهید.",
      ),
    },
    stepsTitle: bi("Each dose", "هر نوبت"),
    steps: [
      bi("Shake the bottle well before every dose.", "پیش از هر نوبت، شیشه را خوب تکان دهید."),
      bi("Measure the dose with the oral syringe or measuring cup, not a kitchen spoon.", "دوز را با سرنگ خوراکی یا پیمانه مدرج اندازه بگیرید، نه قاشق آشپزخانه."),
      bi("Give the doses at evenly spaced times, as prescribed.", "نوبت‌ها را در فاصله‌های مساوی و طبق دستور پزشک بدهید."),
      bi("Finish the whole course, even if the child is better.", "دوره درمان را کامل کنید، حتی اگر حال کودک بهتر شده باشد."),
      bi("Rinse the syringe or cup with water after each use.", "سرنگ یا پیمانه را پس از هر بار مصرف با آب بشویید."),
    ],
    after: [
      bi(
        "Store as the label says: some suspensions (for example amoxicillin-clavulanate) must be kept in the fridge. Do not freeze.",
        "طبق برچسب نگهداری کنید: برخی سوسپانسیون‌ها (مانند کوآموکسی‌کلاو) باید در یخچال نگهداری شوند. یخ نزند.",
      ),
      bi(
        "Write the date of preparation on the bottle and throw away what is left after the time on the label (often 7 to 14 days).",
        "تاریخ آماده‌سازی را روی شیشه بنویسید و باقی‌مانده را پس از مدت ذکرشده روی برچسب (اغلب 7 تا 14 روز) دور بریزید.",
      ),
    ],
    warn: [
      bi(
        "Rash, hives, swelling of the face or difficulty breathing: stop and get emergency help. Severe or bloody diarrhoea: see a doctor.",
        "در صورت بثورات پوستی، کهیر، تورم صورت یا تنگی نفس، مصرف را قطع کنید و فوراً به اورژانس مراجعه کنید. در اسهال شدید یا خونی به پزشک مراجعه کنید.",
      ),
    ],
    refs: [
      medline("Amoxicillin and clavulanic acid", "druginfo/meds/a685024.html"),
      { label: "Augmentin — FDA prescribing information", url: "https://medlibrary.org/lib/rx/meds/augmentin-3/page/6/" },
    ],
  },
  {
    key: "missed-dose",
    title: bi("If you forget a dose", "اگر نوبت مصرف دارو را فراموش کردید"),
    intro: bi(
      "The pack leaflet comes first: many medicines say exactly what to do. If it does not, this general rule applies.",
      "ابتدا بروشور دارو را بخوانید؛ برای بسیاری از داروها دستور مشخصی آمده است. اگر چیزی ذکر نشده، این قاعده کلی را رعایت کنید.",
    ),
    stepsTitle: bi("General rule", "قاعده کلی"),
    steps: [
      bi("If the next dose is still several hours away, take the missed dose as soon as you remember.", "اگر تا نوبت بعدی چند ساعت مانده است، نوبت فراموش‌شده را به محض یادآوری مصرف کنید."),
      bi("If it is almost time for the next dose, skip the missed one.", "اگر زمان نوبت بعدی نزدیک است، نوبت فراموش‌شده را رها کنید."),
      bi("Then carry on at the usual times.", "سپس مصرف را در زمان‌های معمول ادامه دهید."),
      bi("Never take a double dose to make up for a missed one.", "هرگز برای جبران، دو نوبت را با هم مصرف نکنید."),
    ],
    after: [
      bi(
        "Ask your pharmacist or doctor for these medicines: contraceptive pills, warfarin and other anticoagulants, insulin and diabetes medicines, epilepsy medicines, transplant and cancer medicines.",
        "برای این داروها حتماً از داروساز یا پزشک بپرسید: قرص‌های ضدبارداری، وارفارین و سایر ضدانعقادها، انسولین و داروهای دیابت، داروهای صرع، و داروهای پیوند و شیمی‌درمانی.",
      ),
      bi("A phone alarm or a weekly pill box helps you not to forget.", "یادآور گوشی یا جعبه قرص هفتگی به فراموش نکردن کمک می‌کند."),
    ],
    warn: [
      bi("Missed several doses, or feel unwell: contact your doctor.", "اگر چند نوبت را فراموش کرده‌اید یا احساس ناخوشی دارید، با پزشک تماس بگیرید."),
    ],
    refs: [
      { label: "NHS SPS — What should people do if they miss a dose", url: "https://www.sps.nhs.uk/articles/what-should-people-do-if-they-miss-a-dose-of-their-medicine/" },
      { label: "NHS SPS — Advising on missed or delayed doses", url: "https://www.sps.nhs.uk/articles/advising-on-missed-or-delayed-doses-of-medicines/" },
    ],
  },
  {
    key: "storage",
    title: bi("Storing medicines at home", "نگهداری صحیح دارو در منزل"),
    intro: bi(
      "Heat, light and damp can make a medicine weaker or spoil it before its expiry date.",
      "گرما، نور و رطوبت می‌توانند اثر دارو را کم کنند یا آن را پیش از تاریخ انقضا خراب کنند.",
    ),
    stepsTitle: bi("Where and how", "کجا و چگونه"),
    steps: [
      bi("Keep medicines in a cool, dry place away from sunlight; the bathroom and the area near the stove are not suitable.", "دارو را در جای خنک و خشک و دور از نور خورشید نگهداری کنید؛ حمام و کنار اجاق گاز مناسب نیستند."),
      bi("Keep each medicine in its original pack with its leaflet.", "هر دارو را در بسته‌بندی اصلی و همراه بروشور خودش نگه دارید."),
      bi("Keep medicines out of the reach and sight of children, ideally locked away.", "دارو را دور از دسترس و دید کودکان، و ترجیحاً در کمد قفل‌دار، نگهداری کنید."),
      bi("Medicines labelled for the fridge: 2–8 °C, not in the freezer.", `داروهای یخچالی را در دمای ${ltr("2–8 °C")} نگهداری کنید، نه در فریزر.`),
      bi("Do not leave medicines in a car.", "دارو را در خودرو رها نکنید."),
      bi(
        "Check expiry dates. Write the opening date on drops and syrups that must be used within a set time after opening.",
        "تاریخ انقضا را بررسی کنید. روی قطره‌ها و شربت‌هایی که پس از باز شدن مهلت محدود دارند، تاریخ باز کردن را بنویسید.",
      ),
    ],
    after: [
      bi("If a medicine has changed colour, smell or texture, do not use it.", "اگر رنگ، بو یا ظاهر دارو تغییر کرده است، آن را مصرف نکنید."),
      bi("Ask your pharmacist how to get rid of unused or expired medicines safely.", "درباره روش صحیح دور ریختن داروهای مصرف‌نشده یا تاریخ‌گذشته از داروساز بپرسید."),
    ],
    warn: [
      bi(
        "If a child swallows a medicine by accident, get emergency help at once, even if the child seems well.",
        "اگر کودک به‌طور اتفاقی دارو خورد، حتی اگر حالش خوب به نظر می‌رسد، فوراً با اورژانس تماس بگیرید.",
      ),
    ],
    refs: [
      medline("Storing your medicines", "ency/patientinstructions/000534.htm"),
      { label: "FDA — Disposal of unused medicines", url: "https://www.fda.gov/drugs/safe-disposal-medicines/disposal-unused-medicines-what-you-should-know" },
    ],
  },
);

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
