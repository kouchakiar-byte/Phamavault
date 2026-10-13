import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { BudCalculator } from "@/components/pharmacy/bud-calculator";
import { Container } from "@/components/ui";
import { compounding, doseTables, pharmacyPage, substitution, type Ref } from "@/content/pharmacy";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(pharmacyPage.title, pharmacyPage.lead, "pharmacy");

function Refs({ refs, locale }: { refs: Ref[]; locale: Locale }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
      <span className="font-semibold text-vault-900">{pharmacyPage.refsLabel[locale]}:</span>
      {refs.map((r) =>
        r.url ? (
          <a
            key={r.label}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="rounded-lg border border-line bg-white px-2 py-0.5 text-molecule-700 hover:border-molecule-500 hover:underline"
          >
            {r.label} ↗
          </a>
        ) : (
          <bdi key={r.label} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
            {r.label}
          </bdi>
        ),
      )}
    </p>
  );
}

function LinkCards({ links, locale }: { links: { label: string; url: string; note: Bi }[]; locale: Locale }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-start gap-2 rounded-xl border border-line bg-white px-3 py-2.5 transition hover:border-molecule-500 hover:bg-molecule-50"
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
  );
}

const cell = (c: string | Bi, locale: Locale) => (typeof c === "string" ? c : c[locale]);

export default async function PharmacyPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="pharmacy" title={pharmacyPage.title} lead={pharmacyPage.lead} />
      <Container className="space-y-14 py-12">
        <div className="space-y-3">
          <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">
            {pharmacyPage.disclaimer[locale]} {pharmacyPage.reviewed[locale]}
          </p>
          <nav aria-label={pharmacyPage.toc[locale]} className="flex flex-wrap gap-2 text-sm">
            {[substitution, compounding].map((s) => (
              <a key={s.key} href={`#${s.key}`} className="rounded-full border border-line bg-white px-4 py-1.5 font-medium text-vault-900 hover:border-molecule-500">
                {s.title[locale]}
              </a>
            ))}
          </nav>
        </div>

        {/* 1. Therapeutic substitution */}
        <section id={substitution.key} className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vault-900">{substitution.title[locale]}</h2>
            <p className="mt-2 text-muted">{substitution.lead[locale]}</p>
          </div>
          <ol className="space-y-2.5">
            {substitution.steps.map((s, i) => (
              <li key={s.en} className="flex gap-3 leading-relaxed text-ink">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-vault-900 text-xs font-bold text-capsule-400">
                  {(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
                </span>
                <span>{s[locale]}</span>
              </li>
            ))}
          </ol>
          <LinkCards links={substitution.links} locale={locale} />

          {doseTables.map((tbl) => (
            <div key={tbl.key} id={tbl.key} className="scroll-mt-24 rounded-card border border-line bg-white p-5">
              <h3 className="text-lg font-bold text-vault-900">{tbl.title[locale]}</h3>
              <p className="mt-1 text-sm text-muted">{tbl.intro[locale]}</p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                <table className="db">
                  <thead>
                    <tr>
                      {tbl.columns.map((c) => (
                        <th key={c.en}>{c[locale]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.rows.map((row) => (
                      <tr key={String(row[0])}>
                        {row.map((c, i) => (
                          <td key={i} className={i === 0 ? "font-medium text-vault-900" : typeof c === "string" ? "num" : ""}>
                            {i === 0 ? <bdi>{cell(c, locale)}</bdi> : cell(c, locale)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">{tbl.note[locale]}</p>
              <Refs refs={tbl.refs} locale={locale} />
            </div>
          ))}
        </section>

        {/* 2. Compounding */}
        <section id={compounding.key} className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vault-900">{compounding.title[locale]}</h2>
            <p className="mt-2 text-muted">{compounding.lead[locale]}</p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold text-vault-900">{compounding.budTitle[locale]}</h3>
            <BudCalculator locale={locale} />
            <p className="mt-3 text-sm leading-relaxed text-ink">{compounding.budNote[locale]}</p>
            <Refs refs={compounding.refs} locale={locale} />
          </div>

          <div className="rounded-card border border-line bg-white p-5">
            <h3 className="text-lg font-bold text-vault-900">{compounding.recordTitle[locale]}</h3>
            <ul className="mt-3 list-disc space-y-1.5 ps-5 leading-relaxed text-ink">
              {compounding.record.map((r) => (
                <li key={r.en}>{r[locale]}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">{compounding.recordNote[locale]}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-vault-900">{compounding.formulasTitle[locale]}</h3>
            <LinkCards links={compounding.formulas} locale={locale} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-vault-900">{compounding.calcsTitle[locale]}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {compounding.calcs.map((c) => (
                <li key={c.key}>
                  <Link href={href(locale, "tools")} className="inline-block rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-molecule-700 hover:border-molecule-500">
                    {c.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}
