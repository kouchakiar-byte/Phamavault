import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { LegalPage as LegalPageData } from "@/content/legal";
import type { Locale } from "@/i18n/config";
import { withBrand } from "./brand";
import { BiTitle, Container, MoleculePattern } from "./ui";

/** Plain text page (about, contact, terms, privacy) with a dark title band. */
export function LegalPage({ page, locale, children }: { page: LegalPageData; locale: Locale; children?: ReactNode }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-vault-900 text-white">
        <MoleculePattern className="text-white/[0.05]" />
        <Container className="py-14">
          <BiTitle
            as="h1"
            text={page.title}
            locale={locale}
            className="text-3xl font-bold tracking-tight text-capsule-400 sm:text-4xl"
            secondaryClassName="text-vault-100"
          />
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-vault-100/80">{withBrand(page.lead[locale])}</p>
        </Container>
      </section>
      <Container className="max-w-3xl space-y-10 py-12">
        {children}
        {page.sections.map((section) => (
          <section key={section.title.en}>
            <h2 className="text-xl font-bold text-vault-900">{section.title[locale]}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p.en} className="mt-3 leading-loose text-ink">
                {withBrand(p[locale])}
              </p>
            ))}
            {section.items && (
              <ul className="mt-3 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.en} className="flex gap-2.5 leading-relaxed text-ink">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-molecule-500" aria-hidden="true" />
                    <span>{withBrand(item[locale])}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </Container>
    </>
  );
}
