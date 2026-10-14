import { Suspense } from "react";
import { Search } from "lucide-react";
import { ScopePicker, SearchResults, SourceLinks } from "@/components/site-search";
import { Container } from "@/components/ui";
import { searchCopy as t } from "@/content/search";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { isSearchScope, lockedSections, siteSearch, type SearchScope } from "@/lib/site-search";

export async function generateMetadata() {
  // Result pages change with every query: keep them out of the index, follow their links.
  return { ...(await pageMetadata(t.title, t.lead, "search")), robots: { index: false, follow: true } };
}

type Search = Record<string, string | string[] | undefined>;

async function Results({ locale, searchParams }: { locale: Locale; searchParams: Promise<Search> }) {
  const params = await searchParams;
  const q = String(params.q ?? "").trim();
  const scopeParam = String(params.scope ?? "all");
  const scope: SearchScope = isSearchScope(scopeParam) ? scopeParam : "all";
  const result = await siteSearch(q, locale, 30, await lockedSections(), scope);
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  return (
    <>
      <SearchForm locale={locale} value={q} scope={scope} />
      {q.length < 2 ? (
        <p className="mt-8 text-muted">{t.empty[locale]}</p>
      ) : (
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <h2 className="mb-4 flex items-baseline justify-between gap-3 text-sm font-bold text-vault-900">
              {t.vault[locale]}
              {result.total > 0 && <span className="font-normal text-muted">{t.count[locale].replace("{n}", num(result.total))}</span>}
            </h2>
            {result.total === 0 ? <p className="text-muted">{t.none[locale].replace("{q}", q)}</p> : <SearchResults result={result} locale={locale} />}
          </div>
          {result.sourceQuery && (
            <aside className="lg:sticky lg:top-24">
              <SourceLinks locale={locale} scope={scope} query={result.sourceQuery} />
            </aside>
          )}
        </div>
      )}
    </>
  );
}

/** A plain GET form (query and scope), so the search page works without JavaScript too. */
function SearchForm({ locale, value, scope }: { locale: Locale; value: string; scope: SearchScope }) {
  return (
    <form action={href(locale, "search")} role="search" className="rounded-card border border-line bg-white p-4 shadow-sm sm:p-6">
      <div className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={value}
          placeholder={t.placeholder[locale]}
          aria-label={t.label[locale]}
          className="field-input min-w-0 flex-1 rounded-full px-5 text-base"
        />
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-molecule-600 px-5 font-semibold text-white hover:bg-molecule-700">
          <Search className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.button[locale]}</span>
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="shrink-0 text-sm font-semibold text-muted">{t.scopeLabel[locale]}:</span>
        <ScopePicker locale={locale} value={scope} />
      </div>
    </form>
  );
}

export default async function SearchPage({ searchParams }: PageProps<"/[lang]/search">) {
  const locale = await getLocale();
  return (
    <Container className="max-w-6xl py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-vault-900">{t.title[locale]}</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted">{t.lead[locale]}</p>
      <div className="mt-8">
        <Suspense fallback={<SearchForm locale={locale} value="" scope="all" />}>
          <Results locale={locale} searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
