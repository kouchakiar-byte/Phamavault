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
  ShieldCheck,
  TestTubes,
  Truck,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { SupplierSpotlight } from "@/components/supplier-spotlight";
import { BiTitle, ButtonLink, Container, MoleculePattern, SectionHead } from "@/components/ui";
import { calculations } from "@/content/calculations";
import { sections } from "@/content/sections";
import { copy, siteConfig } from "@/content/site";
import { excipients, formulation, handbooks, rawMaterials, regulatory, sops } from "@/data";
import suppliers from "@/data/suppliers.json";
import { bi, type Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";

const supplierMaterials = suppliers.companies.reduce((n, c) => n + c.p.length, 0);

/** Live counts from the reference data — never hand-typed numbers. */
const databaseStats = [
  { slug: "excipients", count: excipients.items.length, unit: copy.databases.units.excipients },
  { slug: "suppliers", count: suppliers.companies.length, unit: copy.databases.units.suppliers },
  { slug: "materials", count: rawMaterials.items.length, unit: copy.databases.units.materials },
  { slug: "qa", count: sops.items.length, unit: copy.databases.units.qa },
] as const;

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
function sectionHighlight(slug: string, n: (x: number) => string): Bi | null {
  const chapters = handbooks.reduce((sum, h) => sum + h.items.length, 0);
  switch (slug) {
    case "suppliers":
      return bi(
        `${n(suppliers.companies.length)} companies · ${n(supplierMaterials)} materials`,
        `${n(suppliers.companies.length)} شرکت · ${n(supplierMaterials)} قلم ماده`,
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
        `${n(rawMaterials.items.length)} materials · ${n(Object.keys(rawMaterials.groups).length)} classes`,
        `${n(rawMaterials.items.length)} ماده · ${n(Object.keys(rawMaterials.groups).length)} رده`,
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
  const { hero, departments, sectionsIntro, databases, toolsShowcase, howItWorks, plans, faq, contact } = copy;
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  const enterprise = plans.items.find((p) => p.id === "enterprise")!;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-vault-900 text-white">
        <MoleculePattern className="text-white/[0.05]" />
        <div className="absolute -top-40 end-[-10%] -z-10 size-[36rem] rounded-full bg-molecule-500/20 blur-3xl" />
        <Container className="grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div className="fade-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-molecule-400">
              {hero.eyebrow[locale]}
            </p>
            <h1 className="mt-6">
              <span
                className="block text-5xl font-bold tracking-tight sm:text-6xl"
                dir="ltr"
                style={{ fontFamily: "var(--font-plex-sans)", textAlign: "start" }}
              >
                Pharma<span className="text-molecule-400">Vault</span>
              </span>
              <BiTitle
                text={copy.platform}
                locale={locale}
                stacked
                className="mt-4 text-xl font-semibold text-vault-100 sm:text-2xl"
                secondaryClassName="text-[0.7em] font-normal"
              />
            </h1>
            <p className="mt-3 text-lg font-medium text-capsule-400">{copy.slogan[locale]}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-100/80 sm:text-lg">{hero.lead[locale]}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "suppliers")}>{hero.supplierSearch[locale]}</ButtonLink>
              <ButtonLink href={href(locale, "#plans")} variant="outline-light">
                {hero.seePlans[locale]}
              </ButtonLink>
            </div>
            <div className="mt-10">
              <p className="text-xs font-medium text-vault-100/50">{hero.referencesLabel[locale]}</p>
              <ul className="mt-3 flex flex-wrap gap-2" dir="ltr" style={{ justifyContent: locale === "fa" ? "flex-end" : "flex-start" }}>
                {hero.references.map((r) => (
                  <li key={r} className="rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-vault-100/80">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The "vault" panel: every section one click away */}
          <div className="fade-in [animation-delay:.1s]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <LogoMark className="size-10" />
                <div>
                  <p className="text-sm font-semibold">{copy.nav.sections[locale]}</p>
                  <p className="text-xs text-vault-100/60">{copy.platform[locale]}</p>
                </div>
              </div>
              <ul className="mt-3 grid gap-0.5">
                {sections.map(({ slug, href: path, icon: Icon, title }) => (
                  <li key={slug}>
                    <Link
                      href={href(locale, path)}
                      className="group flex items-center gap-3.5 rounded-xl px-2.5 py-2 transition hover:bg-white/[0.06]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-molecule-500/15 text-molecule-400">
                        <Icon className="size-[1.1rem]" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm font-medium">{title[locale]}</span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-vault-100/40 transition group-hover:text-molecule-400 rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>

        <div className="border-t border-white/10 bg-vault-950/40">
          <Container className="grid gap-6 py-8 sm:grid-cols-3">
            {hero.pillars.map((p) => (
              <div key={p.title.en} className="border-s-2 border-molecule-500 ps-4">
                <p className="font-semibold">{p.title[locale]}</p>
                <p className="mt-1 text-sm leading-relaxed text-vault-100/70">{p.text[locale]}</p>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* Featured: the supplier bank */}
      <SupplierSpotlight locale={locale} />

      {/* By department */}
      <section className="border-y border-line bg-paper py-20 lg:py-24">
        <Container>
          <SectionHead eyebrow={departments.eyebrow[locale]} title={departments.title} locale={locale} lead={departments.lead[locale]} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {departments.items.map((d) => {
              const Icon = departmentIcons[d.key];
              return (
                <article key={d.key} className="rounded-card border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-molecule-50 text-molecule-600">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-bold text-vault-900">{d.title[locale]}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {d.points.map((pt) => (
                      <li key={pt.en} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-molecule-600" aria-hidden="true" />
                        {pt[locale]}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Sections */}
      <section id="sections" className="scroll-mt-20 py-20 lg:py-28">
        <Container>
          <SectionHead eyebrow={sectionsIntro.eyebrow[locale]} title={sectionsIntro.title} locale={locale} lead={sectionsIntro.lead[locale]} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ slug, href: path, plate, icon: Icon, title, description }) => {
              const highlight = sectionHighlight(slug, num);
              return (
                <article
                  key={slug}
                  className="group relative flex flex-col rounded-card border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:border-molecule-400 hover:shadow-lg hover:shadow-vault-900/5"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-vault-900 text-molecule-400 transition group-hover:bg-molecule-500 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="rounded border border-line px-2 py-0.5 font-mono text-xs tracking-widest text-muted" dir="ltr">
                      {plate}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-vault-900">
                    <Link href={href(locale, path)} className="after:absolute after:inset-0">
                      <BiTitle text={title} locale={locale} stacked secondaryClassName="mt-0.5 text-[0.72em] font-medium" />
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{description[locale]}</p>
                  {highlight && (
                    <p className="mt-4 self-start rounded-md bg-molecule-50 px-2.5 py-1 text-xs font-semibold text-molecule-700">
                      {highlight[locale]}
                    </p>
                  )}
                  <span className="mt-auto pt-6 text-sm font-semibold text-molecule-700">{sectionsIntro.open[locale]}</span>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Databases */}
      <section className="border-y border-line bg-white py-20 lg:py-28">
        <Container>
          <SectionHead eyebrow={databases.eyebrow[locale]} title={databases.title} locale={locale} lead={databases.lead[locale]} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {databaseStats.map(({ slug, count, unit }) => {
              const section = sections.find((s) => s.slug === slug)!;
              return (
                <Link
                  key={slug}
                  href={href(locale, section.href)}
                  className="group flex flex-col rounded-card border border-line bg-paper p-6 transition hover:-translate-y-0.5 hover:border-molecule-400 hover:bg-white hover:shadow-lg hover:shadow-vault-900/5"
                >
                  <section.icon className="size-6 text-molecule-500" aria-hidden="true" />
                  <p className="mt-5 font-mono text-4xl font-medium tracking-tight text-vault-900">{num(count)}</p>
                  <p className="mt-1 text-sm text-muted">{unit[locale].replace("{p}", num(supplierMaterials))}</p>
                  <p className="mt-auto pt-5 text-sm font-semibold text-vault-900 group-hover:text-molecule-700">
                    {section.title[locale]}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Calculations */}
      <section className="relative isolate overflow-hidden bg-vault-950 py-20 text-white lg:py-28">
        <MoleculePattern className="text-white/[0.03]" />
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-wide text-molecule-400">{toolsShowcase.eyebrow[locale]}</p>
              <BiTitle
                as="h2"
                text={toolsShowcase.title}
                locale={locale}
                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                secondaryClassName="text-vault-100"
              />
              <p className="mt-4 text-lg text-vault-100/80">{toolsShowcase.lead[locale]}</p>
            </div>
            <ButtonLink href={href(locale, "tools")} variant="outline-light">
              {toolsShowcase.open[locale]}
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {calculations.map((c) => (
              <div key={c.key} className="bg-vault-950 p-6">
                <h3 className="font-semibold">{c.title[locale]}</h3>
                <p className="mt-3 font-mono text-xs leading-relaxed text-molecule-400" dir="ltr" style={{ textAlign: "start" }}>
                  {c.equation}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How to get access */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHead eyebrow={howItWorks.eyebrow[locale]} title={howItWorks.title} locale={locale} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title.en} className="relative rounded-card border border-line bg-white p-7">
                <span className="flex size-10 items-center justify-center rounded-full bg-vault-900 font-mono text-sm font-semibold text-molecule-400">
                  {num(i + 1)}
                </span>
                <h3 className="mt-5 text-lg font-bold text-vault-900">{step.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text[locale]}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Plans */}
      <section id="plans" className="scroll-mt-20 border-t border-line bg-white py-20 lg:py-28">
        <Container>
          <SectionHead eyebrow={plans.eyebrow[locale]} title={plans.title} locale={locale} lead={plans.lead[locale]} />
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {plans.items.map((plan) => {
              const dark = plan.style === "dark";
              const featured = plan.style === "primary";
              const badge = "badge" in plan ? plan.badge : undefined;
              return (
                <div
                  key={plan.id}
                  id={plan.id}
                  className={`relative flex scroll-mt-24 flex-col gap-5 rounded-card border p-7 ${
                    dark
                      ? "border-vault-800 bg-vault-900 text-white"
                      : featured
                        ? "border-molecule-500 bg-white shadow-xl shadow-molecule-700/10 ring-2 ring-molecule-500 lg:-translate-y-3"
                        : "border-line bg-paper"
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-3.5 start-7 rounded-full bg-molecule-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {badge[locale]}
                    </span>
                  )}
                  <div>
                    <BiTitle as="h3" text={plan.name} locale={locale} className={`text-2xl font-bold ${dark ? "text-white" : "text-vault-900"}`} />
                    <p className={`mt-2 text-sm ${dark ? "text-vault-100/80" : "text-muted"}`}>{plan.who[locale]}</p>
                  </div>
                  <p className={`border-y py-3 text-sm font-medium ${dark ? "border-white/15 text-capsule-400" : "border-line text-vault-900"}`}>
                    {plan.price[locale]}
                  </p>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f.en} className={`flex gap-2.5 text-sm ${dark ? "text-vault-100/85" : "text-muted"}`}>
                        <Check className={`mt-0.5 size-4 shrink-0 ${dark ? "text-molecule-400" : "text-molecule-600"}`} aria-hidden="true" />
                        {f[locale]}
                      </li>
                    ))}
                  </ul>
                  <RequestButton href={requestMailto(locale, plan.name)} variant={dark ? "light" : featured ? "primary" : "ghost"}>
                    {plan.cta[locale]}
                  </RequestButton>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <BiTitle as="h3" text={plans.compareTitle} locale={locale} className="mt-20 text-2xl font-bold text-vault-900" />
          <div className="mt-6 overflow-x-auto rounded-card border border-line">
            <table className="db" style={{ minWidth: 0 }}>
              <thead>
                <tr>
                  <th className="w-2/5" />
                  {plans.items.map((p) => (
                    <th key={p.id} className="px-1.5! text-center text-xs sm:px-3! sm:text-sm">
                      {p.name[locale]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.compare.map((row) => (
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

          <h3 className="mt-14 text-sm font-semibold text-muted">{plans.ordersTitle[locale]}</h3>
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

      {/* FAQ */}
      <section className="border-t border-line bg-paper pb-4 pt-20 lg:pt-24">
        <Container className="max-w-4xl">
          <SectionHead eyebrow={faq.eyebrow[locale]} title={faq.title} locale={locale} />
          <div className="mt-10 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
            {faq.items.map((item) => (
              <details key={item.q.en} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-vault-900 hover:bg-vault-50 [&::-webkit-details-marker]:hidden">
                  {item.q[locale]}
                  <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-6 pb-6 text-sm leading-loose text-muted">{item.a[locale]}</p>
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
              <RequestButton href={requestMailto(locale, plans.items[1].name)} variant="primary">
                {contact.access[locale]}
              </RequestButton>
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
