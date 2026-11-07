import type { StaticImageData } from "next/image";
import { HeaderPhoto } from "./page-header";
import type { ReactNode } from "react";
import { BackLink, BiTitle, Container, MoleculePattern } from "@/components/ui";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";

/** Dark page header for pages outside the ten sections (tools and articles open to everyone). */
export function SimpleHeader({
  locale,
  title,
  lead,
  eyebrow,
  back,
  photo,
  children,
}: {
  locale: Locale;
  title: Bi;
  lead?: Bi;
  eyebrow?: Bi;
  back: { href: string; label: Bi };
  /** A photo behind the band, as on the section pages. */
  photo?: StaticImageData;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-vault-900 text-white">
      {photo && <HeaderPhoto photo={photo} />}
      <MoleculePattern className="text-white/[0.05]" />
      <div className="absolute -top-32 end-[-8%] -z-10 size-[28rem] rounded-full bg-molecule-500/15 blur-3xl" />
      <Container className="py-12 lg:py-16">
        <BackLink href={back.href} tone="light">
          {back.label[locale]}
        </BackLink>
        <div className="mt-6 max-w-3xl">
          {eyebrow && <p className="text-sm font-bold text-capsule-400">{eyebrow[locale]}</p>}
          <BiTitle
            as="h1"
            text={title}
            locale={locale}
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
            primaryClassName="pv-gold-text font-extrabold leading-snug"
            secondaryClassName="text-vault-100"
          />
          {lead && <p className="mt-4 text-lg leading-relaxed text-vault-100">{lead[locale]}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}
