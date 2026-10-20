import { BookMarked, ExternalLink, Search } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { OrangeBookSearch } from "@/components/pharmacy/orange-book-search";
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

export const generateMetadata = () => pageMetadata(referencesPage.title, referencesPage.lead, "references");

export default async function ReferencesPage() {
  const locale = await getLocale();
  return (
    <LegalPage page={referencesPage} locale={locale}>
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
                    <dt className="shrink-0 font-semibold text-vault-900 sm:w-40">{e.label[locale]}</dt>
                    <dd className="leading-relaxed text-ink">{e.value[locale]}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-4 leading-loose text-ink">{s.text[locale]}</p>
            <h3 className="mt-4 text-sm font-semibold text-muted">{referenceLabels.links[locale]}</h3>
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
                      <span className="block font-semibold text-vault-900">
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
