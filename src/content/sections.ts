import type { LucideIcon } from "lucide-react";
import { Atom, BookOpen, Briefcase, Calculator, Factory, FileCheck, FlaskConical, Layers, ShieldCheck } from "lucide-react";
import { bi, type Bi } from "@/i18n/bi";

export type SectionGroup = "knowledge" | "databases" | "tools" | "company";

type Section = {
  slug: string;
  /** Relative to the locale root; "#…" points at the home page. */
  href: string;
  plate: string;
  icon: LucideIcon;
  group: SectionGroup;
  title: Bi;
  description: Bi;
};

/** The nine sections of the platform, in the order shown on the home page. */
export const sections = [
  {
    slug: "handbooks",
    href: "handbooks",
    plate: "HB",
    icon: BookOpen,
    group: "knowledge",
    title: bi("Technical Handbooks", "هندبوک‌های تخصصی"),
    description: bi(
      "Dosage-form references for solid, semi-solid, liquid, sterile and biological products, from formulation design to scale-up.",
      "مرجع کاربردی اشکال دارویی جامد، نیمه‌جامد، مایع، استریل و بیولوژیک؛ از طراحی فرمولاسیون تا افزایش مقیاس.",
    ),
  },
  {
    slug: "suppliers",
    href: "suppliers",
    plate: "SP",
    icon: Factory,
    group: "databases",
    title: bi("Raw Material Supplier Directory", "پایگاه داده تأمین‌کنندگان مواد اولیه"),
    description: bi(
      "Iranian manufacturers and importers of APIs, vitamins, mineral salts, excipients and cosmetic ingredients, searchable by material.",
      "تولیدکنندگان و واردکنندگان ایرانی مواد مؤثره، ویتامین‌ها، املاح معدنی، مواد جانبی و مواد اولیه آرایشی، قابل جستجو بر اساس ماده.",
    ),
  },
  {
    slug: "excipients",
    href: "excipients",
    plate: "EX",
    icon: Layers,
    group: "databases",
    title: bi("Pharmaceutical Excipients Database", "پایگاه داده مواد جانبی دارویی (اکسیپیان‌ها)"),
    description: bi(
      "Functional category, typical concentration range, dosage-form applicability and CAS number for each excipient.",
      "طبقه‌بندی عملکردی، محدوده غلظت متداول، کاربرد در اشکال دارویی و شماره CAS هر ماده جانبی.",
    ),
  },
  {
    slug: "materials",
    href: "materials",
    plate: "RM",
    icon: Atom,
    group: "databases",
    title: bi("API & Raw Material Database", "پایگاه داده مواد مؤثره و مواد اولیه"),
    description: bi(
      "Active pharmaceutical ingredients, vitamins and mineral salts with CAS number, molecular weight and a key physicochemical or stability note.",
      "مواد مؤثره دارویی، ویتامین‌ها و املاح معدنی با شماره CAS، وزن مولکولی و نکته کلیدی فیزیکوشیمیایی یا پایداری.",
    ),
  },
  {
    slug: "tools",
    href: "tools",
    plate: "CA",
    icon: Calculator,
    group: "tools",
    title: bi("Pharmaceutical Calculations", "محاسبات داروسازی"),
    description: bi(
      "HLB blending, isotonicity (NaCl equivalent), alligation, Henderson–Hasselbalch buffers, suppository displacement, mEq conversion and batch scale-up.",
      "محاسبه HLB، ایزوتونیسیته (روش معادل NaCl)، آلیگیشن، بافر هندرسون–هاسلباخ، ضریب جابه‌جایی شیاف، تبدیل mEq و افزایش مقیاس بچ.",
    ),
  },
  {
    slug: "formulation",
    href: "formulation",
    plate: "FT",
    icon: FlaskConical,
    group: "tools",
    title: bi("Formulation Design Tools", "ابزارهای طراحی فرمولاسیون"),
    description: bi(
      "Starting compositions by dosage form with the functional role of each component, q.s. balancing and batch quantities.",
      "ترکیب پایه هر شکل دارویی با نقش عملکردی اجزا، محاسبه جزء q.s. و مقادیر بچ.",
    ),
  },
  {
    slug: "regulatory",
    href: "regulatory",
    plate: "RG",
    icon: FileCheck,
    group: "knowledge",
    title: bi("Regulatory Affairs: CTD & ICH", "امور رگولاتوری: CTD و ICH"),
    description: bi(
      "CTD module structure, the core ICH quality guidelines and ICH Q1A(R2) stability storage conditions.",
      "ساختار ماژول‌های CTD، راهنماهای کلیدی کیفیت ICH و شرایط نگهداری مطالعات پایداری ICH Q1A(R2).",
    ),
  },
  {
    slug: "qa",
    href: "qa",
    plate: "QA",
    icon: ShieldCheck,
    group: "knowledge",
    title: bi("Quality Assurance & SOPs", "تضمین کیفیت و دستورالعمل‌های استاندارد (SOP)"),
    description: bi(
      "A GMP-aligned master list of standard operating procedures for QA, QC, microbiology, production, warehouse, engineering and R&D, with full text.",
      "فهرست جامع دستورالعمل‌های استاندارد منطبق بر GMP برای تضمین کیفیت، کنترل کیفیت، میکروبیولوژی، تولید، انبار، فنی و تحقیق و توسعه، همراه با متن کامل.",
    ),
  },
  {
    slug: "enterprise",
    href: "#enterprise",
    plate: "EN",
    icon: Briefcase,
    group: "company",
    title: bi("Enterprise Solutions", "راهکارهای سازمانی"),
    description: bi(
      "Organisation-wide access, role-based permissions, company-specific handbooks and bespoke software.",
      "دسترسی سازمانی چندکاربره، سطوح دسترسی مبتنی بر نقش، هندبوک‌های اختصاصی و نرم‌افزار سفارشی.",
    ),
  },
] as const satisfies readonly Section[];

export type SectionSlug = (typeof sections)[number]["slug"];

export function getSection(slug: SectionSlug): Section {
  const section = sections.find((s) => s.slug === slug);
  if (!section) throw new Error(`Unknown section: ${slug}`);
  return section;
}

export const sectionGroups: { key: SectionGroup; title: Bi }[] = [
  { key: "databases", title: bi("Databases", "پایگاه‌های داده") },
  { key: "tools", title: bi("Tools", "ابزارها") },
  { key: "knowledge", title: bi("Knowledge & compliance", "دانش و انطباق") },
];
