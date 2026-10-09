import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleCheck, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Container } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, sections, siteConfig } from "@/lib/site";

/*
 * Generic page for every sitemap section that does not (yet) have its own
 * route folder. When a section needs a bespoke layout, add
 * `app/[lang]/<slug>/page.tsx` — static folders take precedence over this one.
 */

export function generateStaticParams() {
  return sections.filter((s) => s.slug !== "knowledge-base").map((s) => ({ section: s.slug }));
}

async function resolve(params: PageProps<"/[lang]/[section]">["params"]) {
  const { section: slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();
  return section;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]">): Promise<Metadata> {
  const [section, locale, t] = await Promise.all([resolve(params), getLocale(), getDictionary()]);
  const copy = t.sections[section.key];
  return {
    title: copy.title,
    description: copy.short,
    alternates: { canonical: href(locale, section.slug) },
  };
}

export default async function SectionPage({ params }: PageProps<"/[lang]/[section]">) {
  const [section, locale, t] = await Promise.all([resolve(params), getLocale(), getDictionary()]);
  const copy = t.sections[section.key];

  return (
    <>
      <PageHero
        title={copy.title}
        lead={copy.short}
        icon={section.icon}
        breadcrumb={{ href: href(locale), label: t.nav.home }}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-[2fr_1fr] lg:py-20">
        <div>
          <h2 className="text-2xl font-bold text-vault-900">{t.sectionPage.topicsTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {copy.topics.map((topic) => (
              <li key={topic} className="flex gap-3 rounded-card border border-line bg-white p-5">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-molecule-500" aria-hidden="true" />
                <span className="font-medium text-vault-900">{topic}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 rounded-card border border-dashed border-molecule-400 bg-molecule-50 p-5 text-sm text-molecule-700">
            {t.sectionPage.inDevelopment}
          </p>
        </div>
        <aside className="h-fit rounded-card bg-vault-900 p-7 text-white">
          <h2 className="text-xl font-bold">{t.cta.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-vault-100/80">{t.cta.lead}</p>
          {section.slug === "contact" ? (
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-molecule-400 hover:text-molecule-100"
            >
              <Mail className="size-5" aria-hidden="true" />
              <span dir="ltr">{siteConfig.email}</span>
            </a>
          ) : (
            <div className="mt-6">
              <ButtonLink href={href(locale, "contact")}>{t.cta.button}</ButtonLink>
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}
