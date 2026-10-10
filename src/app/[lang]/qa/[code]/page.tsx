import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { sops } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

const page = pages.qa;

// Only one SOP is prerendered to keep the build short on the host; the others
// are rendered on first request and then served from the cache.
export function generateStaticParams() {
  const first = sops.items.find((s) => s.text);
  return first ? [{ code: first.code.toLowerCase() }] : [];
}

async function load(params: PageProps<"/[lang]/qa/[code]">["params"]) {
  const { code } = await params;
  const sop = sops.items.find((s) => s.code.toLowerCase() === code);
  if (!sop?.text) notFound();
  return { ...sop, text: sop.text };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/qa/[code]">): Promise<Metadata> {
  const sop = await load(params);
  return pageMetadata(
    { en: `${sop.code} ${sop.title.en}`, fa: `${sop.code} ${sop.title.fa}` },
    sop.covers,
    `qa/${sop.code.toLowerCase()}`,
  );
}

export default async function SopPage({ params }: PageProps<"/[lang]/qa/[code]">) {
  const [locale, sop] = await Promise.all([getLocale(), load(params)]);
  const { text } = sop;
  const dep = sops.departments[sop.dep];
  const heading = (n: number, title: string) => (
    <h2 className="mb-1 mt-6 text-base font-bold text-molecule-700">
      {n}. {title}
    </h2>
  );

  return (
    <>
      <PageHeader
        locale={locale}
        section="qa"
        title={{ en: `${sop.code} · ${sop.title.en}`, fa: `${sop.code} · ${sop.title.fa}` }}
        lead={sop.covers}
        back={{ href: href(locale, "qa"), label: page.backToList }}
      />
      <Container className="py-12">
        {locale === "en" && <p className="text-sm text-muted">{page.inPersian.en}</p>}

        <article
          id="sop-doc"
          dir="rtl"
          lang="fa"
          className="mt-4 max-w-3xl rounded-card border-2 border-molecule-400 bg-white p-6 text-right leading-loose sm:p-8"
          style={{ fontFamily: "var(--font-vazirmatn), sans-serif" }}
        >
          <header className="border-b border-line pb-4">
            <h2 className="text-xl font-bold text-vault-900 sm:text-2xl">{sop.title.fa}</h2>
            <p className="mt-1 text-sm text-muted" dir="ltr" lang="en" style={{ textAlign: "right" }}>
              {sop.title.en}
            </p>
            <p className="mt-2 text-sm text-muted">
              کد: <bdi>{sop.code}</bdi> · شماره بازنگری: 00 · واحد: {dep.fa}
            </p>
          </header>
          {heading(1, "هدف")}
          <p>{text.purpose}</p>
          {heading(2, "دامنه کاربرد")}
          <p>{text.scope}</p>
          {heading(3, "مسئولیت‌ها")}
          <p>{text.responsibilities}</p>
          {heading(4, "روش اجرا")}
          <ol className="list-decimal space-y-1 ps-6">
            {text.procedure.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {heading(5, "سوابق و فرم‌ها")}
          <p>{text.records}</p>
          {heading(6, "مراجع")}
          <p>{text.references}</p>
        </article>

        <div className="mt-6">
          <CopyButton targetId="sop-doc" label={page.copy[locale]} doneLabel={page.copied[locale]} />
        </div>
      </Container>
    </>
  );
}
