import { bi } from "@/i18n/bi";

/*
 * The nine sections of the vault, in the order shown on the home page.
 * `href` is relative to the locale root; `art` is the inline SVG body of the
 * card illustration (animated by the `.art` rules in globals.css).
 */
export const sections = [
  {
    slug: "handbooks",
    href: "handbooks",
    plate: "HB",
    title: bi("Handbooks", "هندبوک‌ها"),
    description: bi(
      "Working references by dosage form: solid, semi-solid, liquid, sterile and biological.",
      "مراجع کاربردی به تفکیک شکل دارویی: جامد، نیمه‌جامد، مایع، استریل و بیولوژیک.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path d=\"M60 24C50 18 36 18 26 22V58C36 54 50 54 60 60C70 54 84 54 94 58V22C84 18 70 18 60 24Z\"/><path d=\"M60 24V60\"/><path class=\"draw s\" d=\"M32 30H52\"/><path class=\"draw s\" style=\"animation-delay:.3s\" d=\"M32 38H52\"/><path class=\"draw s\" style=\"animation-delay:.6s\" d=\"M32 46H52\"/><path class=\"draw s\" style=\"animation-delay:.9s\" d=\"M68 30H88\"/><path class=\"draw s\" style=\"animation-delay:1.2s\" d=\"M68 38H88\"/><path class=\"draw s\" style=\"animation-delay:1.5s\" d=\"M68 46H88\"/>",
  },
  {
    slug: "suppliers",
    href: "suppliers",
    plate: "SP",
    title: bi("Supplier Database", "بانک تأمین‌کنندگان"),
    description: bi(
      "Iranian manufacturers and suppliers of pharmaceutical, vitamin, mineral and cosmetic raw materials, searchable by material.",
      "تولیدکنندگان و تأمین‌کنندگان ایرانی مواد اولیه دارویی، ویتامینی، معدنی و آرایشی، قابل جستجو بر اساس ماده.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path class=\"flow s\" d=\"M24 56L52 24L92 30L98 60L60 54L24 56M52 24L60 54M92 30L60 54\"/><circle class=\"f\" cx=\"24\" cy=\"56\" r=\"4\"/><circle class=\"f\" cx=\"52\" cy=\"24\" r=\"4\"/><circle class=\"f\" cx=\"92\" cy=\"30\" r=\"4\"/><circle class=\"f\" cx=\"98\" cy=\"60\" r=\"4\"/><circle class=\"f pulse\" cx=\"60\" cy=\"54\" r=\"5.5\"/>",
  },
  {
    slug: "excipients",
    href: "excipients",
    plate: "EX",
    title: bi("Excipient Database", "بانک اکسیپیان"),
    description: bi(
      "Functional category, use levels, incompatibilities and compendial status for each excipient.",
      "نقش عملکردی، محدوده مصرف، ناسازگاری‌ها و وضعیت فارماکوپه‌ای هر ماده جانبی.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path d=\"M60 18L79 29V51L60 62L41 51V29Z\"/><path class=\"s\" d=\"M60 24L74 32M74 48L60 56M46 48V32\"/><path d=\"M79 29L95 20M41 51L25 60M60 62V73\"/><circle class=\"f pulse\" cx=\"95\" cy=\"20\" r=\"3.5\"/><circle class=\"f pulse\" style=\"animation-delay:.8s\" cx=\"25\" cy=\"60\" r=\"3.5\"/><circle class=\"f pulse\" style=\"animation-delay:1.6s\" cx=\"60\" cy=\"73\" r=\"3\"/>",
  },
  {
    slug: "materials",
    href: "materials",
    plate: "RM",
    title: bi("Raw Material Database", "بانک مواد اولیه"),
    description: bi(
      "APIs, vitamins, minerals and cosmetic raw materials with grades and specifications.",
      "مواد مؤثره، ویتامین‌ها، مواد معدنی و مواد اولیه آرایشی با گرید و مشخصات.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path d=\"M52 14H68M55 14V32L38 62A4 4 0 0 0 41.5 68H78.5A4 4 0 0 0 82 62L65 32V14\"/><path class=\"f liq\" d=\"M46 50H74L82 62A4 4 0 0 1 78.5 68H41.5A4 4 0 0 1 38 62Z\"/><circle class=\"f rise\" cx=\"54\" cy=\"62\" r=\"2\"/><circle class=\"f rise\" style=\"animation-delay:1s\" cx=\"62\" cy=\"60\" r=\"2.5\"/><circle class=\"f rise\" style=\"animation-delay:2s\" cx=\"69\" cy=\"63\" r=\"1.8\"/>",
  },
  {
    slug: "tools",
    href: "tools",
    plate: "CA",
    title: bi("Pharmaceutical Calculators", "ماشین‌حساب‌های دارویی"),
    description: bi(
      "HLB, isotonicity, dilution, buffers, unit conversion and batch calculations.",
      "HLB، ایزوتونیسیته، رقیق‌سازی، بافر، تبدیل واحد و محاسبات بچ.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path d=\"M60 22V64M46 64H74\"/><circle class=\"f\" cx=\"60\" cy=\"24\" r=\"2.5\"/><g class=\"tilt\"><path d=\"M32 24H88\"/><path class=\"s\" d=\"M32 24L24 42M32 24L40 42M88 24L80 42M88 24L96 42\"/><path d=\"M22 42Q32 52 42 42ZM78 42Q88 52 98 42Z\"/></g>",
  },
  {
    slug: "formulation",
    href: "formulation",
    plate: "FT",
    title: bi("Formulation Tools", "ابزار فرمولاسیون"),
    description: bi(
      "Excipient selection, compatibility checks and starting formulas for each dosage form.",
      "انتخاب اکسیپیان، بررسی سازگاری و ساخت فرمول پایه برای هر شکل دارویی.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><g class=\"float\"><g transform=\"rotate(-28 60 40)\"><rect x=\"32\" y=\"27\" width=\"56\" height=\"26\" rx=\"13\"/><path d=\"M60 27V53\"/><path class=\"f liq\" d=\"M45 27H60V53H45A13 13 0 0 1 45 27Z\"/><path class=\"s\" d=\"M40 34H52\"/></g></g><circle class=\"f pulse\" cx=\"24\" cy=\"22\" r=\"2\"/><circle class=\"f pulse\" style=\"animation-delay:.7s\" cx=\"98\" cy=\"60\" r=\"2.5\"/><circle class=\"f pulse\" style=\"animation-delay:1.4s\" cx=\"92\" cy=\"18\" r=\"1.8\"/><circle class=\"f pulse\" style=\"animation-delay:2s\" cx=\"28\" cy=\"64\" r=\"1.8\"/>",
  },
  {
    slug: "regulatory",
    href: "regulatory",
    plate: "RG",
    title: bi("Regulatory Resources", "منابع رگولاتوری"),
    description: bi(
      "CTD and DMF structure, ICH guidelines and registration requirements, as checklists and templates.",
      "ساختار CTD و DMF، راهنماهای ICH و الزامات ثبت، به‌صورت چک‌لیست و الگو.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><rect x=\"38\" y=\"10\" width=\"44\" height=\"60\" rx=\"3\"/><path class=\"s\" d=\"M60 24H75M60 40H75M60 56H75\"/><path class=\"draw\" d=\"M45 24l3.5 3.5l6.5-8\"/><path class=\"draw\" style=\"animation-delay:.6s\" d=\"M45 40l3.5 3.5l6.5-8\"/><path class=\"draw\" style=\"animation-delay:1.2s\" d=\"M45 56l3.5 3.5l6.5-8\"/>",
  },
  {
    slug: "qa",
    href: "qa",
    plate: "QA",
    title: bi("Quality Assurance", "تضمین کیفیت"),
    description: bi(
      "The master list of SOPs a site needs, from laboratory to production and R&D, with a standard SOP template.",
      "فهرست جامع SOPهای لازم از آزمایشگاه تا تولید و تحقیق و توسعه، به‌همراه قالب استاندارد SOP.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><path d=\"M60 10L86 20V40C86 55 75 66 60 71C45 66 34 55 34 40V20Z\"/><path class=\"s\" d=\"M60 17L79 24V40C79 51 71 59 60 63\"/><g class=\"pulse\"><path d=\"M48 40l9 9l16-18\"/></g>",
  },
  {
    slug: "enterprise",
    href: "#enterprise",
    plate: "EN",
    title: bi("Enterprise Solutions", "راهکار سازمانی"),
    description: bi(
      "Multi-user access, custom handbooks and software built for one company.",
      "دسترسی چندکاربره، هندبوک اختصاصی و نرم‌افزار ویژه هر شرکت.",
    ),
    art: "<circle class=\"blob\" cx=\"60\" cy=\"40\" r=\"33\"/><rect x=\"28\" y=\"10\" width=\"64\" height=\"60\" rx=\"4\"/><path class=\"s\" d=\"M28 22H22V30H28M28 50H22V58H28\"/><circle cx=\"60\" cy=\"40\" r=\"19\"/><g class=\"spin\"><circle cx=\"60\" cy=\"40\" r=\"6\"/><path d=\"M60 34V25M60 46V55M54 40H45M66 40H75\"/></g>",
  },
] as const;

export type SectionSlug = (typeof sections)[number]["slug"];

export function getSection(slug: SectionSlug) {
  const section = sections.find((s) => s.slug === slug);
  if (!section) throw new Error(`Unknown section: ${slug}`);
  return section;
}
