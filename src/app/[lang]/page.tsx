import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  ClipboardCheck,
  Database,
  Factory,
  FileText,
  Library,
  Pill,
  Timer,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { LogoMark } from "@/components/logo";
import { ButtonLink, Container, MoleculePattern, SectionHeader } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getArticles } from "@/lib/articles";
import { expertiseSections, href } from "@/lib/site";

const resourceIcons = [Library, Calculator, Database, FileText];
const projectIcons = [Pill, Timer, ClipboardCheck, Factory];

export default async function HomePage() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const articles = (await getArticles(locale)).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-vault-900 text-white">
        <MoleculePattern className="text-white/[0.05]" />
        <div className="absolute -top-40 end-[-10%] -z-10 size-[36rem] rounded-full bg-molecule-500/20 blur-3xl" />
        <Container className="grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-molecule-400">
              {t.hero.eyebrow}
            </p>
            <h1 className="mt-6">
              <span className="block text-5xl font-bold tracking-tight sm:text-6xl" dir="ltr" style={{ fontFamily: "var(--font-plex-sans)", textAlign: "start" }}>
                Pharma<span className="text-molecule-400">Vault</span>
              </span>
              <span className="mt-4 block text-xl font-semibold text-vault-100 sm:text-2xl">{t.brand.tagline}</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-capsule-400">{t.brand.slogan}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-100/80 sm:text-lg">{t.hero.lead}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href={href(locale, "knowledge-base")}>{t.hero.ctaPrimary}</ButtonLink>
              <ButtonLink href="#expertise" variant="secondary">
                {t.hero.ctaSecondary}
              </ButtonLink>
            </div>
          </div>

          {/* Expertise "vault" panel */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <LogoMark className="size-10" />
                <div>
                  <p className="text-sm font-semibold">{t.nav.expertise}</p>
                  <p className="text-xs text-vault-100/60">{t.brand.tagline}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {expertiseSections.map(({ slug, key, icon: Icon }) => (
                  <li key={slug}>
                    <Link
                      href={href(locale, slug)}
                      className="group flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[0.06]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-molecule-500/15 text-molecule-400">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm font-medium">{t.sections[key].title}</span>
                      <ArrowUpRight
                        className="size-4 text-vault-100/40 transition group-hover:text-molecule-400 rtl:-scale-x-100"
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
            {t.hero.pillars.map((p) => (
              <div key={p.title} className="border-s-2 border-molecule-500 ps-4">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-vault-100/70">{p.text}</p>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* Audience */}
      <section className="border-b border-line bg-white">
        <Container className="flex flex-col items-center gap-6 py-10 lg:flex-row lg:justify-between">
          <h2 className="text-center text-base font-semibold text-vault-900 lg:text-start">{t.audience.title}</h2>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {t.audience.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-medium text-vault-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Services / Expertise */}
      <section id="expertise" className="scroll-mt-20 py-20 lg:py-28">
        <Container>
          <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} lead={t.services.lead} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertiseSections.map(({ slug, key, icon: Icon }) => (
              <article
                key={slug}
                className="group relative flex flex-col rounded-card border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:border-molecule-400 hover:shadow-lg hover:shadow-vault-900/5"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-vault-900 text-molecule-400 transition group-hover:bg-molecule-500 group-hover:text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-vault-900">
                  <Link href={href(locale, slug)} className="after:absolute after:inset-0">
                    {t.sections[key].title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.sections[key].short}</p>
                <span className="mt-auto pt-6 text-sm font-semibold text-molecule-700">{t.services.learnMore}</span>
              </article>
            ))}
            <div className="flex flex-col justify-between rounded-card bg-gradient-to-br from-molecule-600 to-vault-800 p-7 text-white">
              <div>
                <h3 className="text-xl font-bold">{t.cta.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{t.cta.lead}</p>
              </div>
              <div className="mt-8">
                <ButtonLink href={href(locale, "contact")} variant="secondary">
                  {t.cta.button}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Knowledge Base */}
      <section className="border-y border-line bg-white py-20 lg:py-28">
        <Container>
          <SectionHeader
            eyebrow={t.knowledge.eyebrow}
            title={t.knowledge.title}
            lead={t.knowledge.lead}
            action={
              <ButtonLink href={href(locale, "knowledge-base")} variant="ghost">
                {t.knowledge.viewAll}
              </ButtonLink>
            }
          />
          {articles.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  locale={locale}
                  minRead={t.knowledge.minRead}
                  readMore={t.knowledge.readMore}
                />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-muted">{t.knowledge.empty}</p>
          )}
        </Container>
      </section>

      {/* Resources */}
      <section className="relative isolate overflow-hidden bg-vault-950 py-20 text-white lg:py-28">
        <MoleculePattern className="text-white/[0.03]" />
        <Container>
          <SectionHeader
            inverted
            eyebrow={t.resources.eyebrow}
            title={t.resources.title}
            lead={t.resources.lead}
            action={
              <ButtonLink href={href(locale, "resources")} variant="secondary">
                {t.sections.resources.title}
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {t.resources.items.map((item, i) => {
              const Icon = resourceIcons[i % resourceIcons.length];
              return (
                <div key={item.title} className="bg-vault-950 p-7">
                  <Icon className="size-7 text-molecule-400" aria-hidden="true" />
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-vault-100/70">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Projects */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeader
            eyebrow={t.projects.eyebrow}
            title={t.projects.title}
            lead={t.projects.lead}
            action={
              <ButtonLink href={href(locale, "projects")} variant="ghost">
                {t.sections.projects.title}
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {t.projects.items.map((item, i) => {
              const Icon = projectIcons[i % projectIcons.length];
              return (
                <div key={item.title} className="flex gap-5 rounded-card border border-line bg-white p-7">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-capsule-500/10 text-capsule-500">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-vault-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20 lg:pb-28">
        <Container>
          <div className="relative isolate overflow-hidden rounded-3xl bg-vault-900 px-8 py-14 text-center sm:px-16">
            <MoleculePattern className="text-white/[0.05]" />
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-vault-100/80">{t.cta.lead}</p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href={href(locale, "contact")}>{t.cta.button}</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
