import { Suspense } from "react";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/site-search";
import { Container } from "@/components/ui";
import { searchCopy as t } from "@/content/search";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { lockedSections, siteSearch } from "@/lib/site-search";

export async function generateMetadata() {
  // Result pages change with every query: keep them out of the index, follow their links.
  return { ...(await pageMetadata(t.title, t.lead, "search")), robots: { index: false, follow: true } };
}

type Search = Record<string, string | string[] | undefined>;

async function Results({ locale, searchParams }: { locale: Locale; searchParams: Promise<Search> }) {
  const q = String((await searchParams).q ?? "").trim();
  const result = await siteSearch(q, locale, 30, await lockedSections());
  return (
    <>
      <SearchForm locale={locale} value={q} />
      <div className="mt-8">
        {q.length < 2 ? (
          <p className="text-muted">{t.empty[locale]}</p>
        ) : result.total === 0 ? (
          <p className="text-muted">{t.none[locale].replace("{q}", q)}</p>
        ) : (
          <>
            <p className="mb-5 text-sm text-muted">{t.count[locale].replace("{n}", result.total.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"))}</p>
            <SearchResults result={result} locale={locale} />
          </>
        )}
      </div>
    </>
  );
}

/** A plain GET form, so the search page works without JavaScript too. */
function SearchForm({ locale, value }: { locale: Locale; value: string }) {
  return (
    <form action={href(locale, "search")} role="search" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={value}
        placeholder={t.placeholder[locale]}
        aria-label={t.label[locale]}
        className="field-input min-w-0 flex-1 text-base"
      />
      <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-molecule-600 px-5 font-semibold text-white hover:bg-molecule-700">
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t.button[locale]}</span>
      </button>
    </form>
  );
}

export default async function SearchPage({ searchParams }: PageProps<"/[lang]/search">) {
  const locale = await getLocale();
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-vault-900">{t.title[locale]}</h1>
      <p className="mt-3 leading-relaxed text-muted">{t.lead[locale]}</p>
      <div className="mt-8">
        <Suspense fallback={<SearchForm locale={locale} value="" />}>
          <Results locale={locale} searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
