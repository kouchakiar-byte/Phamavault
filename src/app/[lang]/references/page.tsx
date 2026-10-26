import Link from "next/link";
import { BookMarked, BookOpenText, ExternalLink, Search } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { sectionPhotos } from "@/components/page-header";
import { OrangeBookSearch } from "@/components/pharmacy/orange-book-search";
import { generalChaptersPage } from "@/content/general-chapters";
import {
  referenceLabels,
  referenceSections,
  referencesOrangeBook,
  referencesPage,
  referencesPaid,
  referencesReviewedOn,
} from "@/content/references";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { withReviewedMonth } from "@/lib/data-dates";
import { href } from "@/lib/paths";

/** Pharmacopoeia cards that link to their part of the general chapters bank. */
const chapterBank: Record<string, "USP" | "EP"> = { usp: "USP", bp: "EP", ep: "EP" };

export const generateMetadata = () => pageMetadata(referencesPage.title, referencesPage.lead, "references");

export default async function ReferencesPage() {
  const locale = await getLocale();
  return (
    <LegalPage page={referencesPage} locale={locale} photo={sectionPhotos.references}>
      <p className="rounded-xl border border-line bg-vault-50 px-4 py-3 text-sm text-muted">
        {withReviewedMonth(referencesReviewedOn[locale], "references", locale)} {referencesPaid[locale]}
      </p>
      {/* Our searchable Orange Book comes first, before the pharmacopoeias */}
      <section id="orange-book-search" className="scroll-mt-24 rounded-card border-2 border-molecule-500/60 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-molecule-600 text-white">
            <Search className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-snug text-vault-900">{referencesOrangeBook.title[locale]}</h2>
            <p className="mt-2 leading-loose text-ink">{referencesOrangeBook.lead[locale]}</p>
          </div>
        </div>
        <div className="mt-4">
          <OrangeBookSearch locale={locale} iran={false} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{referencesOrangeBook.note[locale]}</p>
      </section>
      <ol className="space-y-6">
        {referenceSections.map((s) => (
          <li key={s.key} id={s.key} className="scroll-mt-24 rounded-card border border-line bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-vault-900 text-capsule-400">
                <BookMarked className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-snug text-vault-900">{s.title[locale]}</h2>
                <p className="mt-0.5 font-mono text-sm text-molecule-700" dir="ltr">
                  {s.abbr}
                </p>
              </div>
            </div>
            {s.editions && (
              <dl className="mt-4 space-y-2 rounded-xl bg-vault-50 p-4 text-sm">
                {s.editions.map((e) => (
                  <div key={e.label.en + e.value.en} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="shrink-0 font-bold text-vault-900 sm:w-40">{e.label[locale]}</dt>
                    <dd className="leading-relaxed text-ink">{e.value[locale]}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-4 leading-loose text-ink">{s.text[locale]}</p>
            {chapterBank[s.key] && (
              <Link
                href={`${href(locale, "references/general-chapters")}?ph=${chapterBank[s.key]}`}
                className="mt-4 flex items-start gap-2.5 rounded-xl bg-vault-900 px-3.5 py-2.5 text-white transition hover:bg-vault-800"
              >
                <BookOpenText className="mt-0.5 size-5 shrink-0 text-capsule-400" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{generalChaptersPage.open[locale]}</span>
                  <span className="block text-xs leading-relaxed text-vault-100/75">{generalChaptersPage.openNote[locale]}</span>
                </span>
              </Link>
            )}
            <h3 className="mt-4 text-sm font-bold text-muted">{referenceLabels.links[locale]}</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {s.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full items-start gap-2 rounded-xl border border-line px-3 py-2.5 transition hover:border-molecule-500 hover:bg-molecule-50"
                  >
                    <ExternalLink className="mt-0.5 size-4 shrink-0 text-molecule-500" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-bold text-vault-900">
                        <bdi>{l.label}</bdi>
                      </span>
                      <span className="block text-xs leading-relaxed text-muted">{l.note[locale]}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </LegalPage>
  );
}
