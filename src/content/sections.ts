import type { LucideIcon } from "lucide-react";
import { Atom, BookOpen, Briefcase, Calculator, Factory, FileCheck, FlaskConical, Layers, ShieldCheck, TestTubes } from "lucide-react";
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

/** The sections of the platform, in the order shown on the home page. */
export const sections = [
  {
    slug: "suppliers",
    href: "suppliers",
    plate: "SP",
    icon: Factory,
    group: "databases",
    title: bi(
      "Suppliers & Manufacturers of Pharmaceutical, Supplement and Cosmetic Raw Materials",
      "بانک تأمین‌کنندگان و تولیدکنندگان مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی",
    ),
    description: bi(
      "Iranian manufacturers and importers of APIs, excipients, vitamins, mineral salts, supplement and cosmetic raw materials, with contact details, searchable by material.",
      "تولیدکنندگان و واردکنندگان ایرانی مواد مؤثره، مواد جانبی، ویتامین‌ها، املاح معدنی و مواد اولیه مکمل و آرایشی‌بهداشتی، همراه با اطلاعات تماس و قابل جستجو بر اساس ماده.",
    ),
  },
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
      "Formulation, physical pharmacy and analytical calculations: potency, HLB, powder flow, capsule fill, coating, isotonicity, osmolarity, buffers, stability kinetics, HPLC and UV assay, system suitability, linearity, dissolution and f2, content uniformity, Karl Fischer and titration.",
      "محاسبات فرمولاسیون، داروسازی فیزیکی و آنالیز: پوتنسی، HLB، جریان‌پذیری پودر، پرکردن کپسول، روکش‌دهی، ایزوتونیسیته، اسمولاریته، بافر، سینتیک پایداری، تعیین مقدار HPLC و UV، انطباق سیستم، خطی بودن، انحلال و f2، یکنواختی محتوا، کارل فیشر و تیتراسیون.",
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
    slug: "qc",
    href: "qc",
    plate: "QC",
    icon: TestTubes,
    group: "knowledge",
    title: bi("Quality Control (QC)", "کنترل کیفیت (QC)"),
    description: bi(
      "Pharmacopoeial tests and acceptance criteria, microbial limits for non-sterile products, pharmaceutical water, ICH Q2 method validation and OOS investigation.",
      "آزمون‌ها و معیارهای پذیرش فارماکوپه‌ای، حدود میکروبی فرآورده‌های غیراستریل، آب دارویی، اعتبارسنجی روش طبق ICH Q2 و بررسی نتایج OOS.",
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
      "The pharmaceutical quality system (ICH Q10), quality risk management tools and a GMP-aligned SOP library for every department, with full text.",
      "سیستم کیفیت دارویی (ICH Q10)، ابزارهای مدیریت ریسک کیفیت و کتابخانه دستورالعمل‌های منطبق بر GMP برای همه واحدها، همراه با متن کامل.",
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

/** Short name of the supplier bank for menus and buttons. */
export const supplierBankShort = bi("Supplier & Manufacturer Bank", "بانک تأمین‌کنندگان و تولیدکنندگان");

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
