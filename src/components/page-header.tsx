import type { Locale } from "@/i18n/config";
import type { Bi } from "@/i18n/bi";
import { copy } from "@/content/site";
import { href } from "@/lib/paths";
import { BackLink, BiTitle, Container, Eyebrow, MoleculePattern } from "./ui";

type Props = { locale: Locale; eyebrow: Bi; title: Bi; lead?: Bi; plate?: string };

/** Header band for every section page: back link, bilingual title and lead. */
export function PageHeader({ locale, eyebrow, title, lead, plate }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-gradient-to-b from-molecule-50 to-white">
      <MoleculePattern className="text-molecule-500/[0.07]" />
      <Container className="py-12 lg:py-16">
        <BackLink href={href(locale, "#sections")}>{copy.nav.allSections[locale]}</BackLink>
        <div className="mt-6 flex items-center gap-3">
          {plate && (
            <span className="rounded border border-line bg-white px-2 py-0.5 font-mono text-xs tracking-widest text-muted" dir="ltr">
              {plate}
            </span>
          )}
          <Eyebrow>{eyebrow[locale]}</Eyebrow>
        </div>
        <BiTitle
          as="h1"
          text={title}
          locale={locale}
          className="mt-3 text-3xl font-bold tracking-tight text-vault-900 sm:text-5xl"
        />
        {lead && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{lead[locale]}</p>}
      </Container>
    </section>
  );
}
