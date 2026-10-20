import { BookOpen, CheckCircle2, ChevronDown } from "lucide-react";
import { pages } from "@/content/pages";
import type { Handbook } from "@/data";
import type { Locale } from "@/i18n/config";
import { handbookAnchor } from "@/lib/handbook-anchor";
import { BiTitle } from "./ui";

const t = pages.handbooks;
const anchor = handbookAnchor;

/** The handbooks: a contents list, then each title with its topics as expandable entries. */
export function HandbookLibrary({ handbooks, locale }: { handbooks: Handbook[]; locale: Locale }) {
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav aria-label={t.contents[locale]} className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-sm font-semibold text-muted">{t.contents[locale]}</p>
        <ol className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {handbooks.map((h) => (
            <li key={h.title.en}>
              <a
                href={`#${anchor(h)}`}
                className="block rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-vault-900 hover:border-molecule-400 hover:text-molecule-700 lg:border-transparent lg:bg-transparent"
              >
                {h.title[locale]}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 space-y-12">
        {handbooks.map((h) => (
          <section key={h.title.en} id={anchor(h)} className="scroll-mt-24">
            <div className="flex items-start gap-4">
              <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-molecule-50 text-molecule-600 sm:flex">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div>
                <BiTitle as="h2" text={h.title} locale={locale} className="text-2xl font-bold text-vault-900" />
                <p className="mt-1 text-xs font-semibold text-molecule-700">{t.topics[locale].replace("{n}", num(h.topics.length))}</p>
                <p className="mt-3 leading-relaxed text-muted">{h.intro[locale]}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {h.topics.map((topic) => (
                <details key={topic.title.en} className="group rounded-card border border-line bg-white open:border-molecule-400 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <BiTitle
                      text={topic.title}
                      locale={locale}
                      className="font-bold text-vault-900 group-open:text-molecule-700"
                      secondaryClassName="text-[0.8em]"
                    />
                    <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="border-t border-line px-5 pb-6 pt-4">
                    <p className="leading-loose text-ink">{topic.summary[locale]}</p>
                    <p className="mt-5 text-sm font-semibold text-vault-900">{t.keyPoints[locale]}</p>
                    <ul className="mt-2 space-y-2.5">
                      {topic.points.map((point) => (
                        <li key={point.en} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-molecule-500" aria-hidden="true" />
                          <span>{point[locale]}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted">{t.references[locale]}:</span>
                      {topic.refs.map((ref) => (
                        <span key={ref} dir="ltr" className="rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-xs text-vault-800">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
