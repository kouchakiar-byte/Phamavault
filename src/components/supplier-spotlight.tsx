import Link from "next/link";
import { Search } from "lucide-react";
import suppliers from "@/data/suppliers.json";
import { pages } from "@/content/pages";
import { getSection } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import { BiTitle, ButtonLink, Container } from "./ui";

const companies = suppliers.companies;
const stats = {
  companies: companies.length,
  materials: companies.reduce((n, c) => n + c.p.length, 0),
  manufacturers: companies.filter((c) => c.t === "m").length,
  importers: companies.filter((c) => c.t === "t").length,
};
const categoryCounts = Object.fromEntries(
  Object.keys(pages.suppliers.categories)
    .filter((k) => k !== "all")
    .map((k) => [k, companies.filter((c) => c.c.includes(k)).length]),
);

/** The supplier bank, featured on the home page with a search box that works without JavaScript. */
export function SupplierSpotlight({ locale }: { locale: Locale }) {
  const section = getSection("suppliers");
  const t = copy.supplierSpotlight;
  const p = pages.suppliers;
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  const bankHref = href(locale, "suppliers");

  return (
    <section id="supplier-bank" className="scroll-mt-20 bg-white py-16 lg:py-20">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-molecule-400/40 bg-gradient-to-br from-molecule-50 via-white to-vault-50 shadow-xl shadow-vault-900/5">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-vault-900 text-molecule-400">
                  <section.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-capsule-500 px-3 py-1 text-xs font-bold text-vault-950">{t.badge[locale]}</span>
                <span className="rounded border border-line bg-white px-2 py-0.5 font-mono text-xs tracking-widest text-muted" dir="ltr">
                  {section.plate}
                </span>
              </div>
              <BiTitle
                as="h2"
                text={section.title}
                locale={locale}
                stacked
                className="mt-5 text-2xl font-bold leading-snug tracking-tight text-vault-900 sm:text-3xl"
                secondaryClassName="mt-1 text-[0.6em] font-medium"
              />
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{t.lead[locale]}</p>

              <form action={bankHref} method="get" role="search" className="mt-7 flex gap-2">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">{p.title[locale]}</span>
                  <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    name="q"
                    autoComplete="off"
                    placeholder={p.placeholder[locale]}
                    className="field-input rounded-full border-molecule-400/60 py-3.5 ps-12 text-base shadow-sm"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-molecule-500 px-6 text-sm font-semibold text-white shadow-sm shadow-molecule-700/20 transition hover:bg-molecule-600"
                >
                  {t.search[locale]}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-sm text-muted">{p.examples[locale]}</span>
                {p.exampleQueries.slice(0, 7).map((ex) => (
                  <Link
                    key={ex}
                    href={`${bankHref}?q=${encodeURIComponent(ex)}`}
                    className="rounded-full border border-line bg-white px-3 py-0.5 text-sm text-molecule-700 hover:border-molecule-400 hover:bg-molecule-50"
                  >
                    {ex}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <dl className="grid grid-cols-2 gap-3">
                {(Object.keys(stats) as (keyof typeof stats)[]).map((k) => (
                  <div key={k} className="flex flex-col-reverse rounded-2xl border border-line bg-white p-4">
                    <dt className="mt-1 text-sm text-muted">{t.stats[k][locale]}</dt>
                    <dd className="font-mono text-3xl font-medium tracking-tight text-vault-900">{num(stats[k])}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="text-sm font-semibold text-vault-900">{t.byCategory[locale]}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(categoryCounts).map(([k, n]) => (
                    <li key={k}>
                      <Link
                        href={`${bankHref}?cat=${k}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-vault-900 transition hover:border-molecule-400 hover:text-molecule-700"
                      >
                        {p.categories[k][locale]}
                        <span className="rounded bg-molecule-50 px-1.5 font-mono text-xs text-molecule-700">{num(n)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <ButtonLink href={bankHref} variant="ghost">
                  {t.open[locale]}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
