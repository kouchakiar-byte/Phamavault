import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Container, MoleculePattern } from "./ui";

type Props = {
  title: string;
  lead?: string;
  icon?: LucideIcon;
  breadcrumb: { href: string; label: string };
};

export function PageHero({ title, lead, icon: Icon, breadcrumb }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-vault-900 text-white">
      <MoleculePattern className="text-white/[0.05]" />
      <Container className="py-16 lg:py-20">
        <Link
          href={breadcrumb.href}
          className="inline-flex items-center gap-1.5 text-sm text-vault-100/70 hover:text-molecule-400"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          {breadcrumb.label}
        </Link>
        <div className="mt-6 flex items-start gap-5">
          {Icon && (
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-molecule-500/15 text-molecule-400 sm:flex">
              <Icon className="size-7" aria-hidden="true" />
            </span>
          )}
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            {lead && <p className="mt-5 text-lg leading-relaxed text-vault-100/80">{lead}</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
