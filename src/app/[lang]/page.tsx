import { CtdRequest } from "@/components/ctd-request";
import { EnamadSeal } from "@/components/enamad-seal";
import { FreeHandbookFeature } from "@/components/free-handbook-feature";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Factory,
  FileCheck,
  FlaskConical,
  BookOpenText,
  Pill,
  Mail,
  Minus,
  Search,
  ShieldCheck,
  TestTubes,
  Truck,
} from "lucide-react";
import { goldWord, VaultWord, withBrand } from "@/components/brand";
import { LogoMark } from "@/components/logo";
import { PriceEstimator } from "@/components/price-estimator";
import { SupplierSpotlight } from "@/components/supplier-spotlight";
import { WeeklyCase } from "@/components/weekly-case";
import { BiTitle, ButtonLink, Container, MoleculePattern, SectionHead } from "@/components/ui";
import { calculation, calculations, featuredCalculations } from "@/content/calculations";
import { referenceSections } from "@/content/references";
import { searchCopy } from "@/content/search";
import { sections } from "@/content/sections";
import { DnaHelix } from "@/components/dna-helix";
import { HeroStats } from "@/components/hero-stats";
import ctdPhoto from "@/assets/photos/ctd-dossier.webp";
import flaskPhoto from "@/assets/photos/flask.webp";

// The platform's sections, CTD compilation included; enterprise solutions are a plan, not a section.
const platformSections = sections.filter((s) => s.slug !== "enterprise");
import { copy, siteConfig } from "@/content/site";
import { excipients, formulation, handbooks, rawMaterials, regulatory, sops } from "@/data";
import suppliers from "@/data/suppliers.json";
import { freeHandbooks } from "@/content/free-handbooks";
import { bi, type Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { listPrice, monthlyPrice, type PlanId } from "@/lib/pricing";

/** Counts shown on the prerendered home page, from the base data. */
type Counts = { suppliers: number; supplierMaterials: number; materials: number };

const departmentIcons: Record<string, LucideIcon> = {
  rnd: FlaskConical,
  qc: TestTubes,
  qa: ShieldCheck,
  prd: Factory,
  reg: FileCheck,
  sup: Truck,
  stu: BookOpenText,
  pha: Pill,
};

/** One line of real figures under each section card. */
function sectionHighlight(slug: string, n: (x: number) => string, c: Counts): Bi | null {
  const chapters = handbooks.reduce((sum, h) => sum + h.topics.length, 0);
  switch (slug) {
    case "suppliers":
      return bi(
        `${n(c.suppliers)} companies · ${n(c.supplierMaterials)} materials`,
        `${n(c.suppliers)} شرکت · ${n(c.supplierMaterials)} قلم ماده و تجهیزات`,
      );
    case "handbooks":
      return bi(`${n(handbooks.length)} titles · ${n(chapters)} chapters`, `${n(handbooks.length)} عنوان · ${n(chapters)} فصل`);
    case "excipients":
      return bi(
        `${n(excipients.items.length)} excipients · ${n(Object.keys(excipients.functions).length)} functional categories`,
        `${n(excipients.items.length)} ماده جانبی · ${n(Object.keys(excipients.functions).length)} طبقه عملکردی`,
      );
    case "materials":
      return bi(
        `${n(c.materials)} materials · ${n(Object.keys(rawMaterials.groups).length)} classes`,
        `${n(c.materials)} ماده · ${n(Object.keys(rawMaterials.groups).length)} رده`,
      );
    case "tools":
      return bi(`${n(calculations.length)} calculators`, `${n(calculations.length)} ماشین‌حساب`);
    case "formulation":
      return bi(`${n(formulation.templates.length)} dosage forms`, `${n(formulation.templates.length)} شکل دارویی`);
    case "regulatory":
      return bi(
        `${n(regulatory.ctd.length)} CTD sections · ${n(regulatory.ich.length)} ICH guidelines`,
        `${n(regulatory.ctd.length)} بخش CTD · ${n(regulatory.ich.length)} راهنمای ICH`,
      );
    case "qc": {
      const lab = sops.items.filter((s) => s.dep === "qc").length;
      const mic = sops.items.filter((s) => s.dep === "mic").length;
      return bi(`${n(lab)} laboratory SOPs · ${n(mic)} microbiology SOPs`, `${n(lab)} دستورالعمل آزمایشگاهی · ${n(mic)} دستورالعمل میکروبیولوژی`);
    }
    case "qa":
      return bi(
        `${n(sops.items.length)} SOPs · ${n(Object.keys(sops.departments).length)} departments`,
        `${n(sops.items.length)} دستورالعمل · ${n(Object.keys(sops.departments).length)} واحد`,
      );
    case "references":
      return bi(`${n(referenceSections.length)} references · Orange Book search`, `${n(referenceSections.length)} رفرنس · جستجوی Orange Book`);
    default:
      return null;
  }
}

/** A mailto link pre-filled with the plan name and the details we need. */
function requestMailto(locale: Locale, planName: Bi): string {
  const subject = copy.requestEmail.subject[locale].replace("{plan}", planName[locale]);
  const body = copy.requestEmail.body[locale];
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function RequestButton({ href: link, variant, children }: { href: string; variant: "primary" | "ghost" | "light"; children: React.ReactNode }) {
  const styles = {
    primary: "bg-molecule-500 text-white shadow-sm shadow-molecule-700/20 hover:bg-molecule-600",
    ghost: "border border-line bg-white text-vault-900 hover:border-molecule-500 hover:text-molecule-700",
    light: "bg-white text-vault-900 hover:bg-molecule-50",
  };
  return (
    <a
      href={link}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${styles[variant]}`}
    >
      <Mail className="size-4" aria-hidden="true" />
      {children}
    </a>
  );
}

export default async function HomePage() {
  const locale = await getLocale();
  const counts: Counts = {
    suppliers: suppliers.companies.length,
    // Every listing in the bank: raw materials, reference standards and laboratory equipment.
    supplierMaterials: suppliers.companies.reduce((n, c) => n + c.p.length, 0),
    materials: rawMaterials.items.length,
  };
  const { hero, departments, sectionsIntro, ctdService, toolsShowcase, howItWorks, plans, faq, contact } = copy;
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");
  const enterprise = plans.items.find((p) => p.id === "enterprise")!;
  const { pricing } = plans;
  /** Fill {section}, {full}, {team} and {extraUser} with formatted prices. */
  const priceText = (s: string) =>
    s.replace(/\{(full|team|extraUser|pharmacy)\}/g, (_, k: "full" | "team" | "extraUser" | "pharmacy") => num(pricing[k]));
  const both = (b: { en: string; fa: string }) => ({ en: priceText(b.en), fa: priceText(b.fa) });
  const rows = plans.compareRows;
  const priceRows: { label: { en: string; fa: string }; values: ({ en: string; fa: string } | boolean)[] }[] = [
    { label: rows.users, values: rows.usersValues },
    { label: rows.price, values: [both(rows.priceIndividual), both(rows.priceTeam), both(rows.pricePharmacy)] },
    { label: rows.extraUsers, values: [false, both(rows.extraUsersValue), false] },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-vault-900 text-white">
        <MoleculePattern className="text-white/[0.05]" />
        <div className="absolute -top-40 end-[-10%] -z-10 size-[36rem] rounded-full bg-molecule-500/20 blur-3xl" />
        {/* Phone: brand, search and counts (the sections follow below the hero). Desktop: the sections panel beside them, which sit centred against its height. */}
        <Container className="grid grid-cols-1 items-start gap-10 pb-16 pt-8 sm:pt-10 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-14 lg:gap-y-0 lg:pb-20 lg:pt-12">
          <div className="fade-in lg:col-start-1 lg:row-start-2">
            {/* e-Namad requires its seal at the top of the home page */}
            <EnamadSeal locale={locale} compact className="mb-5" />
            {/* Brand: the vault mark beside the name, as tall as the name and slogan together */}
            <h1 className="flex max-w-full items-center gap-3 sm:gap-5" dir="ltr">
              <LogoMark tight className="h-[6.25rem] w-auto shrink-0 sm:h-[8.9rem]" />
              <span className="flex min-w-0 flex-col justify-center">
                <span
                  className="block text-[2.2rem] font-bold leading-none tracking-tight text-white sm:text-6xl"
                  style={{ fontFamily: "var(--font-plex-sans)" }}
                >
                  Pharma
                  <VaultWord />
                </span>
                {(locale === "fa" ? (["fa", "en"] as const) : (["en", "fa"] as const)).map((lang, i) => (
                  <span
                    key={lang}
                    lang={lang}
                    dir={lang === "fa" ? "rtl" : "ltr"}
                    className={`block font-bold ${i === 0 ? "mt-2.5 text-xl sm:mt-3 sm:text-3xl" : "mt-1.5 whitespace-nowrap text-[0.7rem] tracking-tight sm:text-lg sm:tracking-normal"} ${
                      lang === "fa" ? "text-molecule-400" : "text-white"
                    }`}
                    style={{ textAlign: lang === "fa" && locale === "en" ? "left" : "start", ...(lang === "en" ? { fontFamily: "var(--font-plex-sans)" } : {}) }}
                  >
                    {lang === "fa" ? goldWord(copy.slogan.fa, "گنجینه") : goldWord(copy.slogan.en, "Vault")}
                  </span>
                ))}
              </span>
            </h1>
            {/* A DNA strand under the name, over the hero's benzene-ring pattern */}
            <DnaHelix orientation="horizontal" rungs={26} className="mt-5 hidden h-14 w-full max-w-lg sm:block" />
            <p className="mt-5 max-w-2xl text-2xl font-bold leading-relaxed text-white sm:text-3xl">{hero.headline[locale]}</p>
            <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-molecule-400">{hero.audience[locale]}</p>
            {/* The site-wide search, first and large: a plain GET form to /search */}
            <form action={href(locale, "search")} role="search" className="mt-7 flex max-w-2xl gap-2 rounded-2xl border border-white/20 bg-white p-2 shadow-2xl shadow-black/30 transition focus-within:ring-4 focus-within:ring-molecule-400/40">
              <Search className="ms-2 size-6 shrink-0 self-center text-molecule-600" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder={searchCopy.placeholder[locale]}
                aria-label={searchCopy.label[locale]}
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-vault-900 outline-none placeholder:text-muted/70 pv-bare-input sm:text-lg"
              />
              <button type="submit" className="rounded-xl bg-molecule-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-molecule-600 sm:px-7 sm:text-base">
                {searchCopy.button[locale]}
              </button>
            </form>
            <div className="mt-4 flex max-w-2xl flex-wrap items-center gap-2 text-sm">
              <span className="text-vault-100/60">{hero.popular[locale]}</span>
              {hero.popularQueries.map((q) => (
                <Link
                  key={q}
                  href={`${href(locale, "search")}?q=${encodeURIComponent(q)}`}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-vault-100/90 transition hover:border-capsule-400 hover:bg-capsule-400 hover:text-vault-950"
                >
                  {q}
                </Link>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-capsule-400">
              <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
              {hero.trustLine[locale].replace("{s}", num(counts.suppliers)).replace("{p}", num(counts.supplierMaterials))}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "suppliers")}>{hero.supplierSearch[locale]}</ButtonLink>
              <ButtonLink href={href(locale, "#plans")} variant="outline-light">
                {hero.seePlans[locale]}
              </ButtonLink>
            </div>
          </div>

          {/* The "vault" panel: every section one click away */}
          <div className="fade-in hidden [animation-delay:.1s] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:block">
            <p className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 whitespace-nowrap px-4 py-1.5 text-xs font-bold tracking-wide text-molecule-400 sm:text-sm">
              {copy.platform[locale]}
              <span className="text-molecule-400/60" aria-hidden="true">·</span>
              <span dir={locale === "fa" ? "ltr" : "rtl"}>{copy.platform[locale === "fa" ? "en" : "fa"]}</span>
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <LogoMark className="size-10" />
                <div>
                  <p className="text-base font-bold">{copy.nav.sections[locale]}</p>
                  <p className="text-xs font-semibold text-vault-100/70">{copy.platform[locale]}</p>
                </div>
              </div>
              <ul className="mt-4 grid gap-1.5">
                {platformSections.map(({ slug, href: path, icon: Icon, title }) => (
                  <li key={slug}>
                    <Link
                      href={href(locale, path)}
                      className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.07] px-2.5 py-2 transition duration-300 ease-out hover:scale-[0.97] hover:border-capsule-400 hover:bg-capsule-400 hover:bg-gradient-to-l hover:from-capsule-400 hover:to-capsule-500 hover:text-vault-950 hover:shadow-lg hover:shadow-capsule-500/30 focus-visible:scale-[0.97] motion-reduce:transform-none"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-molecule-500/15 text-molecule-400 transition group-hover:bg-vault-950/90 group-hover:text-capsule-400">
                        <Icon className="size-[1.1rem]" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm font-bold sm:text-[0.95rem]">{title[locale]}</span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-vault-100/40 transition group-hover:text-vault-950 rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="fade-in lg:col-start-1 lg:row-start-3">
            {/* The vault at a glance: live counts */}
            <HeroStats
              locale={locale}
              stats={[
                { value: counts.suppliers, label: hero.stats.suppliers },
                { value: counts.supplierMaterials, label: hero.stats.products },
                { value: counts.materials, label: hero.stats.materials },
                { value: platformSections.length, label: hero.stats.sections },
              ]}
            />
          </div>
        </Container>

        <div className="hidden border-t border-white/10 bg-vault-950/40 sm:block">
          <Container className="grid gap-6 py-8 sm:grid-cols-3">
            {hero.pillars.map((p) => (
              <div key={p.title.en} className="border-s-2 border-molecule-500 ps-4">
                <p className="font-bold">{p.title[locale]}</p>
                <p className="mt-1 text-sm leading-relaxed text-vault-100/70">{p.text[locale]}</p>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* Sources the content rests on, as plain names (no logos) */}
      <div className="border-b border-line bg-vault-950 text-white">
        <Container className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-sm">
          <span className="font-semibold text-vault-100/70">{copy.sourcesStrip.label[locale]}</span>
          {copy.sourcesStrip.names.map((n) => (
            <span key={n} className="font-bold tracking-wide text-white/90" dir="ltr" style={{ fontFamily: "var(--font-plex-sans)" }}>
              {n}
            </span>
          ))}
        </Container>
      </div>

      {/* Sections */}
      <section id="sections" className="scroll-mt-20 bg-paper py-14 lg:py-24">
        <Container>
          <SectionHead eyebrow={sectionsIntro.eyebrow[locale]} title={sectionsIntro.title} locale={locale} lead={sectionsIntro.lead[locale]} />
          {/* Who it is for, as one row instead of a grid of its own */}
          <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label={departments.eyebrow[locale]}>
            <li className="text-sm font-semibold text-muted">{departments.eyebrow[locale]}:</li>
            {departments.items.map((d) => {
              const Icon = departmentIcons[d.key];
              return (
                <li key={d.key} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-vault-900">
                  <Icon className="size-4 text-molecule-600" aria-hidden="true" />
                  {d.title[locale]}
                </li>
              );
            })}
          </ul>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-3">
            {platformSections.map(({ slug, href: path, plate, icon: Icon, title, description }) => {
              const highlight = sectionHighlight(slug, num, counts);
              return (
                <article
                  key={slug}
                  className="group relative flex flex-col rounded-card border border-vault-100 bg-vault-50 p-4 shadow-sm sm:p-7 shadow-vault-900/5 transition duration-300 ease-out hover:scale-[0.97] hover:border-capsule-400 hover:bg-capsule-50 hover:bg-gradient-to-br hover:from-capsule-50 hover:to-capsule-100 hover:shadow-xl hover:shadow-capsule-500/25 focus-within:scale-[0.97] focus-within:border-capsule-400 motion-reduce:transform-none"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-vault-900 text-molecule-400 transition sm:size-12 duration-300 group-hover:bg-gradient-to-br group-hover:bg-capsule-400 group-hover:from-capsule-400 group-hover:to-capsule-600 group-hover:text-vault-950">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="hidden rounded border border-line bg-white/60 px-2 py-0.5 font-mono text-xs tracking-widest text-muted transition group-hover:border-capsule-400 group-hover:text-capsule-700 sm:inline" dir="ltr">
                      {plate}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-bold leading-snug text-vault-900 sm:mt-6 sm:text-lg">
                    <Link href={href(locale, path)} className="after:absolute after:inset-0">
                      <BiTitle text={title} locale={locale} stacked secondaryClassName="mt-0.5 hidden text-[0.72em] font-medium sm:block" />
                    </Link>
                  </h3>
                  <p className="mt-3 hidden text-sm leading-relaxed text-muted line-clamp-2 lg:block">{description[locale]}</p>
                  {highlight && (
                    <p className="mt-3 self-start rounded-md bg-molecule-50 px-2.5 py-1 text-xs font-bold text-molecule-700 transition group-hover:bg-white/70 group-hover:text-capsule-700">
                      {highlight[locale]}
                    </p>
                  )}
                  <span className="mt-auto hidden pt-6 text-sm font-bold text-molecule-700 transition group-hover:text-capsule-700 sm:block">{sectionsIntro.open[locale]}</span>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* This week's free handbook */}
      <section id="free-handbook" className="scroll-mt-20 bg-white pt-16 lg:pt-20">
        <Container>
          <FreeHandbookFeature handbook={freeHandbooks[0]} locale={locale} />
        </Container>
      </section>

      {/* Case of the week */}
      <section id="case" className="scroll-mt-20 bg-white pt-12 lg:pt-16">
        <Container>
          <WeeklyCase locale={locale} />
        </Container>
      </section>

      {/* Featured: the supplier bank */}
      <SupplierSpotlight locale={locale} />

      {/* Plans */}
      <section id="plans" className="scroll-mt-20 border-t border-line bg-white py-20 lg:py-28">
        <Container>
          <SectionHead eyebrow={plans.eyebrow[locale]} title={plans.title} locale={locale} lead={plans.lead[locale]} />
          {/* How to get access, in three short steps */}
          <ol className="mt-8 grid gap-3 sm:grid-cols-3" aria-label={howItWorks.title[locale]}>
            {howItWorks.steps.map((step, i) => (
              <li key={step.title.en} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-vault-900 font-mono text-sm font-semibold text-molecule-400">{num(i + 1)}</span>
                <span className="text-sm font-bold text-vault-900">{step.title[locale]}</span>
              </li>
            ))}
          </ol>
          {/* Phones: the plans side by side, swiped one at a time; desktop: three columns */}
          <div className="-mx-4 mt-10 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-4 pt-4 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {plans.items.map((plan) => {
              const featured = plan.style === "primary";
              const badge = "badge" in plan ? plan.badge : undefined;
              const planId = (plan.id === "enterprise" ? "team" : plan.id) as PlanId;
              const price = monthlyPrice({ plan: planId, seats: pricing.teamUsers });
              const was = listPrice({ plan: planId, seats: pricing.teamUsers });
              return (
                <div
                  key={plan.id}
                  id={plan.id}
                  className={`relative flex w-[85%] shrink-0 snap-center scroll-mt-24 flex-col gap-5 rounded-card border p-7 sm:w-[60%] lg:w-auto ${
                    featured ? "border-molecule-500 bg-white shadow-xl shadow-molecule-700/10 ring-2 ring-molecule-500" : "border-line bg-paper"
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-3.5 start-7 rounded-full bg-molecule-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {badge[locale]}
                    </span>
                  )}
                  <div>
                    <BiTitle as="h3" text={plan.name} locale={locale} className="text-2xl font-bold text-vault-900" />
                    <p className="mt-2 text-sm text-muted">{plan.who[locale]}</p>
                  </div>
                  <div className="border-y border-line py-4">
                    <p className="text-sm text-muted">{plan.priceFor[locale]}</p>
                    {/* Full price struck through, the discount, then the price actually paid */}
                    <p className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-semibold text-muted line-through decoration-red-500/80 decoration-2">{num(was)}</span>
                      <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-sm">{plan.saving[locale]}</span>
                    </p>
                    <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-4xl font-bold text-molecule-700">{num(price)}</span>
                      <span className="text-sm text-muted">
                        {plans.currency[locale]} {plans.perMonth[locale]}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{plan.savingNote[locale]}</p>
                    <p className="mt-3 text-sm font-medium text-molecule-700">{priceText(plan.extra[locale])}</p>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f, i) => (
                      <li key={f.en} className={`${i > 3 ? "hidden sm:flex" : "flex"} gap-2.5 text-sm text-muted`}>
                        <Check className="mt-0.5 size-4 shrink-0 text-molecule-600" aria-hidden="true" />
                        {f[locale]}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={`${href(locale, "account/buy")}${planId === "individual" ? "" : `?plan=${planId}`}`}
                    variant={featured ? "primary" : "ghost"}
                  >
                    {plan.cta[locale]}
                  </ButtonLink>
                </div>
              );
            })}
          </div>

          {/* The estimator is a desktop tool; phones go straight to the order page */}
          <div className="hidden sm:block">
            <PriceEstimator locale={locale} />
          </div>

          <div className="mt-10 flex justify-center">
            <EnamadSeal locale={locale} className="w-full max-w-md" />
          </div>

          {/* Comparison table */}
          <details className="group/cmp mt-16 lg:mt-20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-card border border-line bg-paper px-5 py-4 transition hover:border-molecule-400 [&::-webkit-details-marker]:hidden">
              <BiTitle as="h3" text={plans.compareTitle} locale={locale} className="text-lg font-bold text-vault-900 sm:text-2xl" />
              <ChevronDown className="size-5 shrink-0 text-molecule-600 transition group-open/cmp:rotate-180" aria-hidden="true" />
            </summary>
          <div className="mt-4 overflow-x-auto rounded-card border border-line">
            <table className="db" style={{ minWidth: 0 }}>
              <thead>
                <tr>
                  <th className="w-1/3" />
                  {plans.items.map((p) => (
                    <th key={p.id} className="px-1.5! text-center text-xs sm:px-3! sm:text-sm">
                      {p.name[locale]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...priceRows, ...plans.compare].map((row) => (
                  <tr key={row.label.en}>
                    <td className="px-2! text-xs font-medium text-vault-900 sm:px-3! sm:text-sm">{row.label[locale]}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-1.5! text-center sm:px-3!">
                        {v === true ? (
                          <Check className="inline size-5 text-molecule-600" aria-label="✓" />
                        ) : v === false ? (
                          <Minus className="inline size-4 text-line" aria-label="—" />
                        ) : (
                          <span className="text-xs text-vault-900 sm:text-sm">{v[locale]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </details>

          <h3 className="mt-14 text-sm font-bold text-muted">{plans.ordersTitle[locale]}</h3>
          <div className="mt-4 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
            {plans.orders.map((o) => (
              <div key={o.title.en} className="bg-white p-6">
                <BiTitle as="h4" text={o.title} locale={locale} className="font-bold text-vault-900" />
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.text[locale]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* CTD compilation service */}
      <section id="ctd" className="scroll-mt-20 pb-20 lg:pb-28">
        <Container>
          <div className="relative isolate grid gap-10 overflow-hidden rounded-3xl bg-vault-900 px-6 py-12 text-white shadow-2xl shadow-vault-900/20 sm:px-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-16">
            {/* A dossier being reviewed: behind the whole card on phones, the end half on desktop, fading into the navy */}
            <div className="absolute inset-0 -z-20 lg:start-auto lg:w-[48%]" aria-hidden="true">
              <Image src={ctdPhoto} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" placeholder="blur" className="object-cover object-[45%_55%]" />
              <div className="absolute inset-0 bg-vault-900/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-vault-900 lg:via-vault-900/45 lg:to-vault-900/5 lg:rtl:bg-gradient-to-l" />
            </div>
            <MoleculePattern className="-z-10 text-white/[0.05]" />
            <div className="absolute -top-32 end-[-6rem] -z-10 size-[26rem] rounded-full bg-capsule-500/15 blur-3xl" />
            <div>
              <p className="text-sm font-semibold text-capsule-400">{ctdService.eyebrow[locale]}</p>
              <BiTitle
                as="h2"
                text={ctdService.title}
                locale={locale}
                className="mt-3 text-3xl font-bold sm:text-4xl"
                primaryClassName="pv-gold-text font-extrabold leading-snug drop-shadow-[0_2px_10px_rgba(220,189,109,0.35)]"
                secondaryClassName="text-vault-100"
              />
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-vault-100/85">{ctdService.lead[locale]}</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {ctdService.points.map((pt) => (
                  <li key={pt.en} className="flex gap-2.5 text-sm leading-relaxed text-vault-100/90">
                    <Check className="mt-0.5 size-4 shrink-0 text-capsule-400" aria-hidden="true" />
                    {pt[locale]}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtdRequest locale={locale} />
              </div>
            </div>
            <div className="mx-auto flex size-48 flex-col items-center justify-center rounded-full border-4 border-capsule-400/80 bg-vault-950/55 text-center shadow-2xl shadow-black/40 ring-8 ring-white/10 backdrop-blur-md sm:size-56">
              <span className="pv-gold-text text-7xl font-bold leading-none sm:text-8xl">{num(5)}</span>
              <span className="mt-2 text-base font-semibold text-capsule-400">{ctdService.days[locale]}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Calculations */}
      <section className="relative isolate overflow-hidden border-y border-line bg-gradient-to-br from-molecule-50 via-white to-vault-50 py-20 lg:py-28">
        <MoleculePattern className="-z-20 text-vault-900/[0.04]" />
        {/* The flask photo on the end side, fading softly into the light background */}
        <div
          className="absolute inset-y-0 end-0 -z-10 hidden w-[52%] [mask-image:linear-gradient(to_left,#000_55%,transparent)] md:block rtl:[mask-image:linear-gradient(to_right,#000_55%,transparent)]"
          aria-hidden="true"
        >
          <Image src={flaskPhoto} alt="" fill sizes="52vw" placeholder="blur" className="object-cover object-[30%_50%]" />
        </div>
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold tracking-wide text-molecule-700">{toolsShowcase.eyebrow[locale]}</p>
              <BiTitle
                as="h2"
                text={bi(
                  toolsShowcase.title.en.replace("{n}", String(calculations.length)),
                  toolsShowcase.title.fa.replace("{n}", calculations.length.toLocaleString("fa-IR-u-nu-latn")),
                )}
                locale={locale}
                className="mt-3 text-3xl font-bold tracking-tight text-vault-900 sm:text-4xl"
                secondaryClassName="text-muted"
              />
              <p className="mt-4 text-lg leading-relaxed text-ink/80">{toolsShowcase.lead[locale]}</p>
            </div>
            <ButtonLink href={href(locale, "tools")}>
              {toolsShowcase.open[locale]}
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {featuredCalculations.map(calculation).map((c, i) => (
              <div
                key={c.key}
                className={`${i > 3 ? "hidden sm:block" : ""} rounded-card border border-white/80 bg-white/80 p-6 shadow-lg shadow-vault-900/5 ring-1 ring-vault-900/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-molecule-400 hover:shadow-molecule-500/10`}
              >
                <h3 className="font-bold text-vault-900">{c.title[locale]}</h3>
                <p className="mt-3 font-mono text-xs leading-relaxed text-molecule-700" dir="ltr" style={{ textAlign: "start" }}>
                  {c.equation}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-paper pb-4 pt-20 lg:pt-24">
        <Container className="max-w-4xl">
          <SectionHead eyebrow={faq.eyebrow[locale]} title={faq.title} locale={locale} />
          <div className="mt-10 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
            {faq.items.map((item) => (
              <details key={item.q.en} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-vault-900 hover:bg-vault-50 [&::-webkit-details-marker]:hidden">
                  {item.q[locale]}
                  <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-6 pb-6 text-sm leading-loose text-muted">{withBrand(item.a[locale])}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-paper pb-20 pt-12 lg:pb-28">
        <Container>
          <div className="relative isolate overflow-hidden rounded-3xl bg-vault-900 px-6 py-14 text-center sm:px-16">
            <MoleculePattern className="text-white/[0.05]" />
            <div className="absolute -bottom-32 start-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-molecule-500/20 blur-3xl" />
            <p className="text-sm font-semibold text-molecule-400">{contact.eyebrow[locale]}</p>
            <BiTitle
              as="h2"
              text={contact.title}
              locale={locale}
              stacked
              className="mt-3 items-center text-3xl font-bold text-white sm:text-4xl"
              secondaryClassName="text-vault-100"
            />
            <p className="mx-auto mt-5 max-w-2xl text-lg text-vault-100/80">{contact.lead[locale]}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink href={href(locale, "account/buy")}>{contact.access[locale]}</ButtonLink>
              <RequestButton href={requestMailto(locale, enterprise.name)} variant="light">
                {contact.quote[locale]}
              </RequestButton>
            </div>
            <a href={`mailto:${siteConfig.email}`} className="mt-6 inline-block text-sm text-vault-100/70 hover:text-molecule-400" dir="ltr">
              {siteConfig.email}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
