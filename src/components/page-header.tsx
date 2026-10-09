import type { Locale } from "@/i18n/config";
import type { Bi } from "@/i18n/bi";
import { copy } from "@/content/site";
import { getSection, type SectionSlug } from "@/content/sections";
import { href } from "@/lib/paths";
import { BackLink, BiTitle, Container, MoleculePattern } from "./ui";

type Props = { locale: Locale; section: SectionSlug; title: Bi; lead?: Bi; back?: { href: string; label: Bi } };

/** Dark header band for every section page: back link, section plate and icon, bilingual title, lead. */
export function PageHeader({ locale, section: slug, title, lead, back }: Props) {
  const section = getSection(slug);
  const Icon = section.icon;
  const backLink = back ?? { href: href(locale, "#sections"), label: copy.nav.allSections };
  return (
    <section className="relative isolate overflow-hidden bg-vault-900 text-white">
      <MoleculePattern className="text-white/[0.05]" />
      <div className="absolute -top-32 end-[-8%] -z-10 size-[28rem] rounded-full bg-molecule-500/15 blur-3xl" />
      <Container className="py-14 lg:py-18">
        <BackLink href={backLink.href} tone="light">
          {backLink.label[locale]}
        </BackLink>
        <div className="mt-6 flex items-start gap-5">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-molecule-500/15 text-molecule-400 sm:flex">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="rounded border border-white/20 px-2 py-0.5 font-mono text-xs tracking-widest text-vault-100/70" dir="ltr">
                {section.plate}
              </span>
              {section.title[locale] !== title[locale] && (
                <p className="text-sm font-semibold text-molecule-400">{section.title[locale]}</p>
              )}
            </div>
            <BiTitle
              as="h1"
              text={title}
              locale={locale}
              className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl"
              secondaryClassName="text-vault-100"
            />
            {lead && <p className="mt-5 text-lg leading-relaxed text-vault-100/80">{lead[locale]}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
