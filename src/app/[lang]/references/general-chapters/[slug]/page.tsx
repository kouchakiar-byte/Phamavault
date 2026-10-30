import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ExternalLink } from "lucide-react";
import { SheetHeader, SheetPage } from "@/components/excipient-sheet";
import { CopyUnlock, SopCopyLock } from "@/components/sop-copy-lock";
import { BackLink, Container } from "@/components/ui";
import { generalChaptersPage as page } from "@/content/general-chapters";
import { copy, siteConfig } from "@/content/site";
import { generalChapters, generalChapterSheets, type GeneralChapter, type SheetBlock } from "@/data";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { chapterSlug } from "@/lib/chapter-slug";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { sectionsFor } from "@/lib/subscriptions";

const t = page.sheet;
const key = (c: GeneralChapter) => `${c.ph} ${c.code}`;
const label = (c: GeneralChapter) => (c.ph === "USP" ? `USP ${c.code}` : `Ph. Eur. ${c.code}`);
const byKey = new Map(generalChapters.items.map((c) => [key(c), c]));

const REFS = {
  USP: "United States Pharmacopeia and National Formulary (USP–NF 2026). Rockville, MD: United States Pharmacopeial Convention.",
  EP: "European Pharmacopoeia, 12th ed. (Ph. Eur. 12). Strasbourg: EDQM, Council of Europe.",
  BP: "British Pharmacopoeia 2026. London: Medicines and Healthcare products Regulatory Agency.",
};

// One sheet is prerendered; the others render on first request and are then cached.
export function generateStaticParams() {
  return [{ slug: "usp-711" }];
}

async function load(params: PageProps<"/[lang]/references/general-chapters/[slug]">["params"]) {
  const { slug } = await params;
  const item = generalChapters.items.find((c) => chapterSlug(c.ph, c.code) === slug);
  if (!item) notFound();
  const entry = generalChapterSheets[key(item)];
  const same = entry && "same" in entry ? byKey.get(entry.same) : undefined;
  const sheet = entry && "same" in entry ? generalChapterSheets[entry.same] : entry;
  return { item, same, sheet: sheet && "blocks" in sheet ? sheet : undefined };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/references/general-chapters/[slug]">): Promise<Metadata> {
  const [locale, { item }] = await Promise.all([getLocale(), load(params)]);
  const title = { en: `${label(item)} ${item.en}`, fa: `${label(item)} ${item.fa}` };
  // Many summaries are one line; the chapter number and title make the snippet self-contained.
  const description = {
    en: `${label(item)} ${item.en}: ${item.s.en} Summary, key requirements and related chapters.`,
    fa: `${label(item)} – ${item.fa}: ${item.s.fa} خلاصه، الزامات کلیدی و فصل‌های مرتبط.`,
  };
  const meta = await pageMetadata(title, description, `references/general-chapters/${chapterSlug(item.ph, item.code)}`);
  return { ...meta, title: title[locale], openGraph: { ...meta.openGraph, title: title[locale] } };
}

/** Latin runs (codes, units, terms; "Ph. Eur. 2.9.3" as one run) inside Persian text keep their own order. */
const LATIN_RUN = /Ph\. Eur\.(?: \d+(?:\.\d+)*)?|[A-Za-z0-9≈±~<>≤≥+−-][A-Za-z0-9≈±~<>≤≥+−\-–.,:/×·°µμ%³²⁻¹⁰⁵⁶ ()]*[A-Za-z0-9°µμ%³²⁻¹⁰⁵⁶)>]|[A-Za-z0-9]/g;
const isolate = (text: string) => text.replace(LATIN_RUN, (m) => `⁦${m}⁩`);

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="mb-2 flex items-baseline gap-2 border-b border-molecule-500/30 pb-1 text-[0.98rem] font-bold text-vault-900">
        <span className="font-mono text-molecule-700">{n}</span>
        {title}
      </h2>
      <div className="space-y-2.5 leading-7 text-ink">{children}</div>
    </section>
  );
}

function Block({ b }: { b: SheetBlock }) {
  if (b.p) return <p className="text-justify">{isolate(b.p)}</p>;
  if (b.note)
    return <p className="rounded-lg border-s-4 border-capsule-400 bg-capsule-400/10 px-3 py-2 font-semibold text-vault-900">{isolate(b.note)}</p>;
  if (b.ul)
    return (
      <ul className="list-disc space-y-1 ps-5 marker:text-molecule-600">
        {b.ul.map((x) => (
          <li key={x}>{isolate(x)}</li>
        ))}
      </ul>
    );
  if (b.table)
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.8rem]">
          <thead>
            <tr>
              {b.table.head.map((h) => (
                <th key={h} className="border border-line bg-vault-900 px-2 py-1.5 text-start font-bold text-white">
                  {isolate(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r, i) => (
              <tr key={i} className="odd:bg-molecule-50/60">
                {r.map((c, j) => (
                  <td key={j} className={`border border-line px-2 py-1.5 align-top ${j === 0 ? "font-semibold text-vault-900" : ""}`}>
                    {isolate(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return null;
}

/** Groups the sheet into numbered sections at each heading. */
function sections(blocks: SheetBlock[]) {
  const out: { title: string; blocks: SheetBlock[] }[] = [];
  for (const b of blocks) {
    if (b.h) out.push({ title: b.h, blocks: [] });
    else out.at(-1)?.blocks.push(b);
  }
  return out;
}

/** Copying the sheet text is for subscribers to the References section. */
async function CopyAccess() {
  await cookies(); // request-time check
  const user = await getUser().catch(() => null);
  const allowed = user ? (await sectionsFor(user.mobile).catch(() => new Set<string>())).has("references") : false;
  return allowed ? <CopyUnlock targetId="gc-sheet" /> : null;
}

const lockProps = (locale: Locale) => {
  const l = t.copyLock;
  return {
    targetId: "gc-sheet",
    buyHref: `${href(locale, "account/buy")}?s=references`,
    plansHref: href(locale, "#plans"),
    labels: {
      copy: t.copy[locale],
      copied: t.copied[locale],
      title: l.title[locale],
      text: l.text[locale],
      buy: l.buy[locale],
      plans: l.plans[locale],
      close: l.close[locale],
    },
  };
};

export default async function GeneralChapterSheet({ params }: PageProps<"/[lang]/references/general-chapters/[slug]">) {
  const [locale, { item, same, sheet }] = await Promise.all([getLocale(), load(params)]);
  const fa = locale === "fa";
  const harmonised = /هماهنگ است|harmonised with/i.test(`${item.s.fa} ${item.s.en}`);
  const related = (sheet?.rel ?? []).map((k) => byKey.get(k)).filter((c): c is GeneralChapter => Boolean(c) && c !== item);
  const links = page.links[item.ph];

  const body = () => {
    let n = 0;
    return (
      <SheetPage locale={locale} printBlocked={t.printBlocked[locale]}>
        <SheetHeader docTitle={`${t.docTitle.en} · ${t.docTitle.fa}`} />
        <div id="gc-sheet" className="px-6 pb-8 pt-6 text-sm sm:px-10">
          <p className="font-mono text-3xl font-bold tracking-tight text-molecule-700 sm:text-4xl" dir="ltr" style={{ textAlign: fa ? "right" : "left" }}>
            {label(item)}
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-vault-900 sm:text-2xl" dir="ltr" style={{ textAlign: fa ? "right" : "left" }}>
            {item.en}
          </h1>
          {fa && <p className="mt-1 text-base font-semibold text-molecule-700">{isolate(item.fa)}</p>}
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-vault-50/80 px-4 py-2.5 text-xs">
            <div className="flex gap-1.5">
              <dt className="font-bold text-vault-900">{t.pharmacopoeia[locale]}:</dt>
              <dd dir="ltr">{page.ph[item.ph][locale]}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-bold text-vault-900">{t.subject[locale]}:</dt>
              <dd>{generalChapters.categories[item.cat][locale]}</dd>
            </div>
            {harmonised && <dd className="font-bold text-molecule-700">{t.harmonised[locale]}</dd>}
          </dl>

          {!sheet && <p className="mt-4 rounded-lg bg-capsule-400/10 px-3 py-2 text-xs text-vault-800">{t.pending[locale]}</p>}
          {same && (
            <p className="mt-4 rounded-lg bg-molecule-50 px-3 py-2 text-xs text-vault-800">
              {isolate(t.sameAs[locale].replace("{code}", label(same)))}
            </p>
          )}

          <Section n={++n} title={t.summary[locale]}>
            <p className="text-justify">{fa ? isolate(item.s.fa) : item.s.en}</p>
          </Section>

          {sheet && fa && sections(sheet.blocks).map((s) => (
            <Section key={s.title} n={++n} title={s.title}>
              {s.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
            </Section>
          ))}
          {sheet && !fa && (
            <p className="mt-4 text-xs text-muted">
              {t.faOnly.en}{" "}
              <Link className="font-semibold text-molecule-700 underline" href={href("fa", `references/general-chapters/${chapterSlug(item.ph, item.code)}`)}>
                {t.readFa.en}
              </Link>
            </p>
          )}

          {related.length > 0 && (
            <Section n={++n} title={t.related[locale]}>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {related.map((c) => (
                  <li key={key(c)}>
                    <Link
                      href={href(locale, `references/general-chapters/${chapterSlug(c.ph, c.code)}`)}
                      className="block rounded-lg border border-line bg-white/80 px-3 py-1.5 transition hover:border-molecule-500 hover:bg-molecule-50"
                    >
                      <span className="block font-mono text-xs font-bold text-molecule-700" dir="ltr" style={{ textAlign: fa ? "right" : "left" }}>
                        {label(c)}
                      </span>
                      <span className="block text-xs text-vault-900">{fa ? isolate(c.fa) : c.en}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section n={++n} title={t.official[locale]}>
            <ul className="flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-molecule-500/60 bg-white px-3 py-1.5 text-xs font-semibold text-molecule-700 transition hover:bg-molecule-50"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    <bdi>{l.label}</bdi>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <footer className="border-t-2 border-molecule-500 bg-paper/80 px-6 py-4 text-[0.72rem] leading-relaxed text-vault-800 sm:px-10">
          <p className="font-bold text-vault-900">{t.sources[locale]}</p>
          <ol className="mt-1 list-decimal space-y-0.5 ps-5" dir="ltr" style={{ textAlign: "left" }}>
            <li>{REFS[item.ph]}</li>
            {item.ph === "EP" && <li>{REFS.BP}</li>}
          </ol>
          <p className="mt-3 text-muted">{t.disclaimer[locale]}</p>
          <p className="mt-1.5 text-muted">© PharmaVault — {copy.rights[locale]}</p>
          <p className="mt-2 flex items-center justify-between gap-3 font-bold text-vault-900" dir="ltr">
            <span>PharmaVault · The Pharmaceutical Information Vault · گنجینه اطلاعات داروسازی</span>
            <span className="font-mono text-molecule-700">pharmavault.ir</span>
          </p>
        </footer>
      </SheetPage>
    );
  };

  return (
    <Container className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "PharmaVault", item: `${siteConfig.url}${href(locale)}` },
              { "@type": "ListItem", position: 2, name: page.short[locale], item: `${siteConfig.url}${href(locale, "references/general-chapters")}` },
              { "@type": "ListItem", position: 3, name: label(item), item: `${siteConfig.url}${href(locale, `references/general-chapters/${chapterSlug(item.ph, item.code)}`)}` },
            ],
          }),
        }}
      />
      <BackLink href={href(locale, "references/general-chapters")}>{t.back[locale]}</BackLink>
      <div className="mt-5">
        {/* The sheet is rendered once, locked; for subscribers CopyAccess streams in and unlocks it. */}
        <SopCopyLock locked {...lockProps(locale)}>
          {body()}
        </SopCopyLock>
        <Suspense fallback={null}>
          <CopyAccess />
        </Suspense>
      </div>
    </Container>
  );
}
