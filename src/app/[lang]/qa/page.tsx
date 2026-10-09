import { PageHeader } from "@/components/page-header";
import { SopTable, type SopRow } from "@/components/sop-table";
import { BiTitle, Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { sops } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.qa;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "qa");

// Only the list goes to the browser; full texts live on their own pages.
const rows: SopRow[] = sops.items.map(({ code, dep, title, covers, text }) => ({
  code,
  dep,
  title,
  covers,
  hasText: text !== null,
}));

export default async function QaPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="qa" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <p className="mb-6 rounded-card border-2 border-dashed border-molecule-400 bg-molecule-50 px-5 py-3.5 text-sm text-molecule-700">
          {page.ready[locale]}
        </p>
        <SopTable locale={locale} rows={rows} departments={sops.departments} />
        <p className="mt-4 text-sm text-muted">{page.codesNote[locale]}</p>

        <BiTitle as="h2" text={page.template} locale={locale} className="mt-14 text-2xl font-bold text-vault-900" />
        <p className="mt-3 max-w-3xl text-muted">{page.templateHead[locale]}</p>
        <ol className="mt-5 grid max-w-2xl list-decimal gap-x-10 gap-y-2 ps-6 marker:font-semibold marker:text-molecule-600 sm:grid-cols-2">
          {page.templateItems.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ol>
      </Container>
    </>
  );
}
