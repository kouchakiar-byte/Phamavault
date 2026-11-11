import Link from "next/link";
import { ArrowLeft, ArrowRight, FilePlus2 } from "lucide-react";
import { CoaReview } from "@/components/coa-review";
import { coaBuilderCopy } from "@/content/coa-builder";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { coaCopy as t } from "@/content/coa-review";
import { copy } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "coa-review");

export default async function CoaReviewPage() {
  const locale = await getLocale();
  return (
    <>
      <div className="no-print">
        <SimpleHeader locale={locale} title={t.title} lead={t.lead} back={{ href: href(locale), label: copy.nav.home }} />
      </div>
      <Container className="py-12">
        <Link
          href={href(locale, "coa-builder")}
          className="no-print group mb-8 flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">
            <FilePlus2 className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-vault-900">{coaBuilderCopy.title[locale]}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{coaBuilderCopy.lead[locale]}</span>
          </span>
          {locale === "fa" ? (
            <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
          )}
        </Link>
        <CoaReview locale={locale} />
      </Container>
    </>
  );
}
