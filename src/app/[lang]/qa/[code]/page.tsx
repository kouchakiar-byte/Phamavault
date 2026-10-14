import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";
import { SopCopyLock } from "@/components/sop-copy-lock";
import type { Locale } from "@/i18n/config";
import { getUser } from "@/lib/auth";
import { sectionsFor } from "@/lib/subscriptions";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { sops } from "@/data";
import { sopFull, type SopFull } from "@/data/sop-extended";
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


/** The full, sectioned SOP: header block, numbered sections, formulas, forms and signatures. */
function FullSop({ code, title, dep, full }: { code: string; title: { fa: string; en: string }; dep: string; full: SopFull }) {
  let n = 0;
  // Plain render helpers (not components), so the section numbers follow the order of the calls.
  const heading = (title: string) => (
    <h2 className="mb-2 mt-7 border-b border-molecule-400/40 pb-1 text-base font-bold text-molecule-700">
      {++n}. {title}
    </h2>
  );
  const list = (items: string[]) => (
    <ul className="list-disc space-y-1 ps-6">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
  const cell = "border border-line px-3 py-2 align-top";
  return (
    <>
      <header className="border-b-2 border-molecule-500 pb-4">
        <h2 className="text-xl font-bold text-vault-900 sm:text-2xl">{title.fa}</h2>
        <p className="mt-1 text-sm text-muted" dir="ltr" lang="en" style={{ textAlign: "right" }}>
          {title.en}
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <th className={`${cell} w-28 bg-vault-50 font-semibold`}>کد</th>
              <td className={cell}>
                <bdi>{code}</bdi>
              </td>
              <th className={`${cell} w-28 bg-vault-50 font-semibold`}>شماره بازنگری</th>
              <td className={cell}>00</td>
            </tr>
            <tr>
              <th className={`${cell} bg-vault-50 font-semibold`}>واحد</th>
              <td className={cell}>{dep}</td>
              <th className={`${cell} bg-vault-50 font-semibold`}>تاریخ اجرا</th>
              <td className={cell}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </header>
      {heading("هدف")}
      <p className="text-justify">{full.purpose}</p>
      {heading("دامنه کاربرد")}
      <p className="text-justify">{full.scope}</p>
      {heading("مسئولیت‌ها")}
      <table className="w-full border-collapse text-sm">
        <tbody>
          {full.responsibilities.map((r) => (
            <tr key={r.role}>
              <th className={`${cell} w-40 bg-vault-50 text-right font-semibold`}>{r.role}</th>
              <td className={cell}>{r.duty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {full.definitions.length > 0 && (
        <>
          {heading("تعاریف و اختصارات")}
          <dl className="space-y-1.5">
            {full.definitions.map((d) => (
              <div key={d.term}>
                <dt className="inline font-semibold text-vault-900">{d.term}: </dt>
                <dd className="inline">{d.def}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      {full.safety.length > 0 && (
        <>
          {heading("ایمنی و احتیاط‌ها")}
          {list(full.safety)}
        </>
      )}
      {full.materials.length > 0 && (
        <>
          {heading("تجهیزات، مواد و مستندات لازم")}
          {list(full.materials)}
        </>
      )}
      {heading("روش اجرا")}
      {full.procedure.map((p, i) => (
        <section key={p.title} className="mt-3">
          <h3 className="font-bold text-vault-900">
            {n}.{i + 1}. {p.title}
          </h3>
          <ol className="mt-1 list-decimal space-y-1 ps-6">
            {p.steps.map((s, j) => (
              <li key={j}>{s}</li>
            ))}
          </ol>
        </section>
      ))}
      {full.acceptance.length > 0 && (
        <>
          {heading("معیارهای پذیرش")}
          {list(full.acceptance)}
        </>
      )}
      {full.calculations.length > 0 && (
        <>
          {heading("محاسبات")}
          <div className="space-y-3">
            {full.calculations.map((c) => (
              <div key={c.name} className="rounded-lg border border-line bg-vault-50 px-4 py-3">
                <p className="font-semibold text-vault-900">{c.name}</p>
                <p className="mt-1 font-mono text-sm text-ink" dir="ltr" style={{ textAlign: "left" }}>
                  {c.formula}
                </p>
                {c.note && <p className="mt-1 text-sm text-muted">{c.note}</p>}
              </div>
            ))}
          </div>
        </>
      )}
      {full.deviations.length > 0 && (
        <>
          {heading("رسیدگی به انحراف و نتایج خارج از حدود")}
          {list(full.deviations)}
        </>
      )}
      {heading("سوابق و فرم‌ها")}
      {list(full.records)}
      {heading("مراجع")}
      <ul className="list-disc space-y-1 ps-6" dir="ltr" style={{ textAlign: "left" }}>
        {full.references.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {heading("تأیید")}
      <table className="w-full border-collapse text-center text-sm">
        <thead>
          <tr>
            {["تهیه‌کننده", "بازبینی‌کننده", "تأییدکننده (تضمین کیفیت)"].map((h) => (
              <th key={h} className={`${cell} bg-vault-50 font-semibold`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["نام و سمت", "امضا و تاریخ"].map((row) => (
            <tr key={row}>
              {[0, 1, 2].map((k) => (
                <td key={k} className={`${cell} h-12 text-xs text-muted`}>
                  {row}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}


const lockProps = (locale: Locale) => ({
  targetId: "sop-doc",
  buyHref: `${href(locale, "account/buy")}?s=qa`,
  plansHref: href(locale, "#plans"),
  labels: {
    copy: page.copy[locale],
    copied: page.copied[locale],
    title: page.copyLock.title[locale],
    text: page.copyLock.text[locale],
    buy: page.copyLock.buy[locale],
    plans: page.copyLock.plans[locale],
    close: page.copyLock.close[locale],
  },
});

/**
 * Copying the SOP text is for subscribers to the QA or QC section; everyone else, admins
 * included, can read only (an admin who needs to copy can grant themselves a subscription).
 */
async function CopyAccess({ locale, children }: { locale: Locale; children: ReactNode }) {
  await cookies(); // request-time check
  const user = await getUser().catch(() => null);
  let allowed = false;
  if (user) {
    const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
    allowed = sections.has("qa") || sections.has("qc");
  }
  return (
    <SopCopyLock locked={!allowed} {...lockProps(locale)}>
      {children}
    </SopCopyLock>
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

  const doc = (
        <article
          id="sop-doc"
          dir="rtl"
          lang="fa"
          className="mt-4 max-w-3xl rounded-card border-2 border-molecule-400 bg-white p-6 text-right leading-loose sm:p-8"
          style={{ fontFamily: "var(--font-vazirmatn), sans-serif" }}
        >
          {sopFull[sop.code] ? (
            <FullSop code={sop.code} title={sop.title} dep={dep.fa} full={sopFull[sop.code]} />
          ) : (
            <>
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
            </>
          )}
        </article>
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

        <Suspense fallback={<SopCopyLock locked {...lockProps(locale)}>{doc}</SopCopyLock>}>
          <CopyAccess locale={locale}>{doc}</CopyAccess>
        </Suspense>

      </Container>
    </>
  );
}
