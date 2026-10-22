import Image, { type StaticImageData } from "next/image";
import type { Locale } from "@/i18n/config";
import type { Bi } from "@/i18n/bi";
import { copy } from "@/content/site";
import { getSection, type SectionSlug } from "@/content/sections";
import { href } from "@/lib/paths";
import { BackLink, BiTitle, Container, MoleculePattern } from "./ui";
import excipients from "@/assets/photos/sections/excipients.webp";
import formulation from "@/assets/photos/sections/formulation.webp";
import handbooks from "@/assets/photos/sections/handbooks.webp";
import materials from "@/assets/photos/sections/materials.webp";
import pharmacy from "@/assets/photos/sections/pharmacy.webp";
import qa from "@/assets/photos/sections/qa.webp";
import qc from "@/assets/photos/sections/qc.webp";
import references from "@/assets/photos/sections/references.webp";
import regulatory from "@/assets/photos/sections/regulatory.webp";
import suppliers from "@/assets/photos/sections/suppliers.webp";
import tools from "@/assets/photos/sections/tools.webp";

/** A photo for each section's header (Pexels, free licence). */
export const sectionPhotos: Partial<Record<SectionSlug, StaticImageData>> = {
  suppliers,
  excipients,
  materials,
  handbooks,
  tools,
  formulation,
  regulatory,
  qc,
  qa,
  references,
  pharmacy,
};

/** Photos whose licence asks for the author's name (CC BY). */
export const photoCredits: Partial<Record<SectionSlug, { text: string; href: string }>> = {
  qa: {
    text: "Photo: Shixart1985, CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg",
  },
};

/** A header band's photo: behind the whole band on phones, the end half on desktop, fading into the navy. */
export function HeaderPhoto({ photo, credit }: { photo: StaticImageData; credit?: { text: string; href: string } }) {
  return (
    <>
      <div className="absolute inset-0 -z-20 lg:start-auto lg:w-[58%]" aria-hidden="true">
        <Image src={photo} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" placeholder="blur" fetchPriority="high" className="object-cover" />
        <div className="absolute inset-0 bg-vault-900/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-vault-900 lg:via-vault-900/60 lg:to-vault-900/15 lg:rtl:bg-gradient-to-l" />
      </div>
      {credit && (
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="absolute bottom-2 end-3 z-10 text-[10px] text-white/45 hover:text-white/80"
        >
          {credit.text}
        </a>
      )}
    </>
  );
}

type Props = { locale: Locale; section: SectionSlug; title: Bi; lead?: Bi; back?: { href: string; label: Bi } };

/** Dark header band for every section page: the section's photo, back link, section plate and icon, bilingual title, lead. */
export function PageHeader({ locale, section: slug, title, lead, back }: Props) {
  const section = getSection(slug);
  const Icon = section.icon;
  const photo = sectionPhotos[slug];
  const backLink = back ?? { href: href(locale, "#sections"), label: copy.nav.allSections };
  return (
    <section className="relative isolate overflow-hidden bg-vault-900 text-white">
      {photo && <HeaderPhoto photo={photo} credit={photoCredits[slug]} />}
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
              className="mt-3 text-3xl font-bold tracking-tight text-capsule-400 sm:text-5xl"
              secondaryClassName="text-vault-100"
            />
            {lead && <p className="mt-5 text-lg leading-relaxed text-vault-100/80">{lead[locale]}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
