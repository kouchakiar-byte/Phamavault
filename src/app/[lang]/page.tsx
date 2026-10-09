import Link from "next/link";
import { Check, Mail } from "lucide-react";
import { BiTitle, ButtonLink, Container, MoleculePattern, SectionHead } from "@/components/ui";
import { sections } from "@/content/sections";
import { copy, siteConfig } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";

const sampleRecord = [
  ["CAS", "9004-34-6"],
  ["Function", "Tablet and capsule diluent, dry binder, disintegrant"],
  ["Typical use", "20–90% as binder/diluent · 5–15% as disintegrant"],
  ["Compendia", "USP-NF · Ph. Eur. · JP"],
  ["Incompatible", "Strong oxidizing agents"],
  ["Suppliers", "Linked from the Supplier Database"],
] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const { hero, sectionsIntro, plans, contact } = copy;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-vault-900 via-vault-800 to-molecule-700 text-white">
        <MoleculePattern className="text-white/[0.07]" />
        <Container className="grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="fade-in">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-molecule-100">
              {hero.eyebrow[locale]}
            </p>
            <BiTitle
              as="h1"
              text={hero.title}
              locale={locale}
              stacked
              className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              secondaryClassName="mt-2 text-molecule-100 opacity-80"
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {hero.departments.map((d) => (
                <li
                  key={d.en}
                  className="rounded-md border border-molecule-400/60 bg-white/10 px-3 py-1 text-sm font-medium text-white"
                >
                  {d[locale]}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-100 sm:text-lg">{hero.lead[locale]}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "#plans")} variant="light">
                {hero.seePlans[locale]}
              </ButtonLink>
              <ButtonLink href={href(locale, "#sections")} variant="outline-light">
                {hero.browse[locale]}
              </ButtonLink>
            </div>
          </div>

          <article
            aria-label="Sample excipient record"
            dir="ltr"
            className="fade-in rounded-2xl bg-white text-start text-ink shadow-2xl shadow-vault-950/30 [animation-delay:.1s]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 font-mono text-xs text-muted">
              <span>EX / monograph</span>
              <span
                className="rounded bg-molecule-50 px-2 py-0.5 font-sans font-semibold text-molecule-700"
                dir={locale === "fa" ? "rtl" : "ltr"}
              >
                {hero.sampleRecord[locale]}
              </span>
            </header>
            <div className="p-5">
              <h2 className="text-xl font-bold text-vault-900">Microcrystalline Cellulose</h2>
              <p className="mt-1 text-sm text-muted">MCC · Cellulose gel · E460(i)</p>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-[auto_1fr]">
                {sampleRecord.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="border-t border-line pt-2 font-mono text-xs text-muted sm:py-2.5 sm:pe-5">{k}</dt>
                    <dd className="pb-2 text-sm sm:border-t sm:border-line sm:py-2.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Container>
      </section>

      {/* Sections */}
      <section id="sections" className="scroll-mt-20 py-20 lg:py-24">
        <Container>
          <SectionHead
            eyebrow={sectionsIntro.eyebrow[locale]}
            title={sectionsIntro.title}
            locale={locale}
            lead={sectionsIntro.lead[locale]}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s, i) => (
              <Link
                key={s.slug}
                href={href(locale, s.href)}
                className="fade-in group flex flex-col gap-3 rounded-card border border-line bg-white p-5 transition hover:border-molecule-400 hover:shadow-lg hover:shadow-vault-900/5"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <svg
                  className="art"
                  viewBox="0 0 120 80"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: s.art }}
                />
                <span className="self-start rounded border border-line px-2 py-0.5 font-mono text-xs tracking-widest text-muted" dir="ltr">
                  {s.plate}
                </span>
                <BiTitle
                  as="h3"
                  text={s.title}
                  locale={locale}
                  stacked
                  className="text-lg font-bold text-vault-900 group-hover:text-molecule-700"
                  secondaryClassName="text-[0.75em]"
                />
                <p className="text-sm leading-relaxed text-muted">{s.description[locale]}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Plans */}
      <section id="plans" className="scroll-mt-20 border-y border-line bg-white py-20 lg:py-24">
        <Container>
          <SectionHead eyebrow={plans.eyebrow[locale]} title={plans.title} locale={locale} lead={plans.lead[locale]} />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.items.map((plan) => {
              const dark = plan.style === "dark";
              return (
                <div
                  key={plan.id}
                  id={plan.id}
                  className={`flex scroll-mt-24 flex-col gap-5 rounded-card border p-7 ${
                    dark ? "border-vault-800 bg-vault-900 text-white" : "border-line bg-paper"
                  } ${plan.style === "primary" ? "ring-2 ring-molecule-500" : ""}`}
                >
                  <div>
                    <BiTitle
                      as="h3"
                      text={plan.name}
                      locale={locale}
                      className={`text-2xl font-bold ${dark ? "text-white" : "text-vault-900"}`}
                    />
                    <p className={`mt-2 text-sm ${dark ? "text-vault-100" : "text-muted"}`}>{plan.who[locale]}</p>
                  </div>
                  <p
                    className={`border-y py-3 text-sm font-medium ${
                      dark ? "border-white/20 text-molecule-100" : "border-line text-vault-900"
                    }`}
                  >
                    {plan.price[locale]}
                  </p>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f.en} className={`flex gap-2.5 text-sm ${dark ? "text-vault-100" : "text-muted"}`}>
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${dark ? "text-molecule-400" : "text-molecule-600"}`}
                          aria-hidden="true"
                        />
                        {f[locale]}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={href(locale, "#contact")}
                    variant={dark ? "light" : plan.style === "primary" ? "primary" : "ghost"}
                  >
                    {plan.cta[locale]}
                  </ButtonLink>
                </div>
              );
            })}
          </div>

          <h3 className="mt-14 text-sm font-semibold text-muted">{plans.ordersTitle[locale]}</h3>
          <div className="mt-4 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
            {plans.orders.map((o) => (
              <div key={o.title.en} className="bg-paper p-6">
                <BiTitle as="h4" text={o.title} locale={locale} className="font-bold text-vault-900" />
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.text[locale]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 py-20 lg:py-24">
        <Container>
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-molecule-600 to-vault-800 px-6 py-14 text-center text-white sm:px-16">
            <MoleculePattern className="text-white/[0.07]" />
            <p className="text-sm font-semibold text-molecule-100">{contact.eyebrow[locale]}</p>
            <BiTitle
              as="h2"
              text={contact.title}
              locale={locale}
              stacked
              className="mt-3 items-center text-3xl font-bold sm:text-4xl"
              secondaryClassName="text-molecule-100"
            />
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{contact.lead[locale]}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-vault-900 transition hover:bg-molecule-50"
            >
              <Mail className="size-4" aria-hidden="true" />
              <span dir="ltr">{siteConfig.email}</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
