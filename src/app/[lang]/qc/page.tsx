import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { TableWrap } from "@/components/filters";
import { PageHeader } from "@/components/page-header";
import { BiTitle, Container } from "@/components/ui";
import { qc } from "@/content/quality";
import { sops } from "@/data";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(qc.title, qc.lead, "qc");

const sopByCode = new Map(sops.items.map((s) => [s.code, s]));
const labSops = sops.items.filter((s) => s.dep === "qc" || s.dep === "mic");

function SubTitle({ text, locale, lead }: { text: Bi; locale: Locale; lead?: Bi }) {
  return (
    <div className="mb-5 mt-14 first:mt-0">
      <BiTitle as="h2" text={text} locale={locale} className="text-2xl font-bold text-vault-900" />
      {lead && <p className="mt-2 max-w-3xl text-sm text-muted">{lead[locale]}</p>}
    </div>
  );
}

function SopLink({ code, locale }: { code: string; locale: Locale }) {
  const sop = sopByCode.get(code);
  if (!sop) return null;
  return (
    <Link
      href={href(locale, `qa/${code.toLowerCase()}`)}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-0.5 text-xs text-vault-900 hover:border-molecule-400 hover:text-molecule-700"
      title={sop.title[locale]}
    >
      <span className="font-mono text-molecule-700" dir="ltr">
        {code}
      </span>
    </Link>
  );
}

export default async function QcPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="qc" title={qc.title} lead={qc.lead} />
      <Container className="py-12">
        <p className="mb-10 rounded-card border-2 border-dashed border-molecule-400 bg-molecule-50 px-5 py-3.5 text-sm text-molecule-700">
          {qc.growing[locale]}
        </p>

        <SubTitle text={qc.areasTitle} locale={locale} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qc.areas.map((a) => (
            <div key={a.title.en} className="rounded-card border border-line bg-white p-5">
              <p className="font-bold text-vault-900">{a.title[locale]}</p>
              <ul className="mt-3 space-y-1.5">
                {a.codes.map((code) => (
                  <li key={code} className="flex items-start gap-2 text-sm text-muted">
                    <SopLink code={code} locale={locale} />
                    <span>{sopByCode.get(code)?.title[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SubTitle text={qc.testsTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{qc.test[locale]}</th>
                <th>{qc.chapter[locale]}</th>
                <th>{qc.criteria[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {qc.tests.map((t) => (
                <tr key={t.test.en}>
                  <td className="font-medium text-vault-900">{t.test[locale]}</td>
                  <td className="num">{t.chapter}</td>
                  <td className="min-w-72 leading-relaxed">{t.criteria[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SubTitle text={qc.microTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{qc.route[locale]}</th>
                <th>{qc.tamc[locale]}</th>
                <th>{qc.tymc[locale]}</th>
                <th>{qc.specified[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {qc.micro.map((m) => (
                <tr key={m.route.en}>
                  <td className="font-medium text-vault-900">{m.route[locale]}</td>
                  <td className="num">{m.tamc}</td>
                  <td className="num">{m.tymc}</td>
                  <td className="italic" dir="ltr" style={{ textAlign: "start" }}>
                    {m.specified}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.microNote[locale]}</p>

        <SubTitle text={qc.waterTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{qc.parameter[locale]}</th>
                <th>{qc.pw[locale]}</th>
                <th>{qc.wfi[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {qc.water.map((w) => (
                <tr key={w.parameter.en}>
                  <td className="font-medium text-vault-900">{w.parameter[locale]}</td>
                  <td className="num whitespace-normal!">{w.pw}</td>
                  <td className="num whitespace-normal!">{w.wfi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SubTitle text={qc.validationTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{qc.characteristic[locale]}</th>
                {qc.procedures.map((p) => (
                  <th key={p.en} className="text-center">
                    {p[locale]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.validation.map((row) => (
                <tr key={row.name.en}>
                  <td className="font-medium text-vault-900">{row.name[locale]}</td>
                  {row.cells.map((c, i) => (
                    <td key={i} className="text-center">
                      {c ? (
                        <Check className="inline size-5 text-molecule-600" aria-label="✓" />
                      ) : (
                        <Minus className="inline size-4 text-line" aria-label="—" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.validationNote[locale]}</p>

        <SubTitle text={qc.oosTitle} locale={locale} />
        <ol className="grid gap-4 md:grid-cols-3">
          {qc.oos.map((step, i) => (
            <li key={step.title.en} className="rounded-card border border-line bg-white p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-vault-900 font-mono text-sm font-semibold text-molecule-400">
                {(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </span>
              <p className="mt-4 font-bold text-vault-900">{step.title[locale]}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text[locale]}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">{qc.oosRef[locale]}</p>

        <SubTitle text={qc.sopsTitle} locale={locale} />
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {labSops.map((s) => (
            <li key={s.code} className="flex items-start gap-2.5 text-sm">
              <SopLink code={s.code} locale={locale} />
              <Link href={href(locale, `qa/${s.code.toLowerCase()}`)} className="text-vault-900 hover:text-molecule-700">
                {s.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
