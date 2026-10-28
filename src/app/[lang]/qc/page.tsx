import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { TableWrap } from "@/components/filters";
import { PageHeader } from "@/components/page-header";
import { Bullets, Cards, DataTable, JumpNav, Steps, SubTitle } from "@/components/quality-blocks";
import { Container } from "@/components/ui";
import { qc } from "@/content/quality";
import { qcMore as m } from "@/content/quality-more";
import { sops } from "@/data";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(qc.title, qc.lead, "qc");

const sopByCode = new Map(sops.items.map((s) => [s.code, s]));
const labSops = sops.items.filter((s) => s.dep === "qc" || s.dep === "mic");

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

        <JumpNav
          locale={locale}
          label={qc.title[locale]}
          items={[
            { id: "tests", label: qc.testsTitle },
            { id: "spec", label: m.specTitle },
            { id: "micro", label: qc.microTitle },
            { id: "water", label: qc.waterTitle },
            { id: "validation", label: qc.validationTitle },
            { id: "oos", label: qc.oosTitle },
            { id: "oot", label: m.ootTitle },
            { id: "imp", label: qc.impTitle },
            { id: "solvents", label: qc.solventsTitle },
            { id: "elements", label: qc.elementsTitle },
            { id: "m7", label: m.m7Title },
            { id: "nitro", label: m.nitroTitle },
            { id: "sst", label: qc.sstTitle },
            { id: "disso", label: qc.dissoTitle },
            { id: "stab", label: qc.stabTitle },
            { id: "conditions", label: m.condTitle },
            { id: "sterility", label: qc.sterilityTitle },
            { id: "bet", label: qc.betTitle },
            { id: "particles", label: m.partTitle },
            { id: "em", label: qc.emTitle },
            { id: "techniques", label: m.techTitle },
            { id: "standards", label: m.stdTitle },
            { id: "di", label: qc.diTitle },
            { id: "sops", label: qc.sopsTitle },
          ]}
        />

        <SubTitle id="areas" text={qc.areasTitle} locale={locale} />
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

        <SubTitle id="tests" text={qc.testsTitle} locale={locale} />
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

        <SubTitle id="spec" text={m.specTitle} locale={locale} lead={m.specLead} />
        <DataTable cols={m.specCols} rows={m.spec} locale={locale} />

        <SubTitle id="micro" text={qc.microTitle} locale={locale} />
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

        <SubTitle id="water" text={qc.waterTitle} locale={locale} />
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

        <SubTitle id="validation" text={qc.validationTitle} locale={locale} />
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

        <SubTitle id="oos" text={qc.oosTitle} locale={locale} />
        <Steps items={qc.oos} locale={locale} />
        <p className="mt-3 text-sm text-muted">{qc.oosRef[locale]}</p>

        <SubTitle id="oot" text={m.ootTitle} locale={locale} />
        <Bullets items={m.oot} locale={locale} />

        <SubTitle id="imp" text={qc.impTitle} locale={locale} lead={qc.impLead} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.impCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.impurities.map((row) => (
                <tr key={row.scope.en + row.mdd}>
                  <td className="font-medium text-vault-900">{row.scope[locale]}</td>
                  <td className="num">{row.mdd}</td>
                  <td className="num">{row.reporting}</td>
                  <td className="num">{row.identification}</td>
                  <td className="num">{row.qualification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.impNote[locale]}</p>

        <SubTitle id="solvents" text={qc.solventsTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.solventCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.solvents.map((row) => (
                <tr key={row.cls}>
                  <td className="num font-bold text-vault-900">{row.cls}</td>
                  <td className="min-w-56">{row.meaning[locale]}</td>
                  <td className="min-w-72 leading-relaxed" dir="ltr" style={{ textAlign: "start" }}>
                    {row.examples}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.solventsNote[locale]}</p>

        <SubTitle id="elements" text={qc.elementsTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.elementCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.elements.map((row) => (
                <tr key={row.element}>
                  <td className="font-bold text-vault-900" dir="ltr" style={{ textAlign: "start" }}>
                    {row.element}
                  </td>
                  <td className="num">{row.cls}</td>
                  <td className="num">{row.oral}</td>
                  <td className="num">{row.parenteral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.elementsNote[locale]}</p>

        <SubTitle id="m7" text={m.m7Title} locale={locale} />
        <Cards items={m.m7} locale={locale} />
        <p className="mb-3 mt-6 font-bold text-vault-900">{m.ltlTitle[locale]}</p>
        <DataTable cols={m.ltlCols} rows={m.ltl} locale={locale} mono={[1]} />

        <SubTitle id="nitro" text={m.nitroTitle} locale={locale} lead={m.nitroLead} />
        <DataTable cols={m.nitroCols} rows={m.nitro} locale={locale} mono={[1]} />
        <p className="mt-3 inline-block rounded-lg bg-vault-50 px-3 py-1.5 font-mono text-sm text-molecule-700" dir="ltr">
          {m.nitroFormula}
        </p>
        <p className="mt-3 text-sm text-muted">{m.nitroNote[locale]}</p>

        <SubTitle id="sst" text={qc.sstTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.sstCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.sst.map((row) => (
                <tr key={row.parameter.en}>
                  <td className="font-medium text-vault-900">{row.parameter[locale]}</td>
                  <td>{row.what[locale]}</td>
                  <td className="min-w-64 leading-relaxed">{row.typical[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.sstNote[locale]}</p>

        <SubTitle id="disso" text={qc.dissoTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.dissoCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.disso.map((row) => (
                <tr key={row.app.en}>
                  <td className="font-medium text-vault-900">{row.app[locale]}</td>
                  <td>{row.use[locale]}</td>
                  <td className="num">{row.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-3 text-sm text-muted">{qc.dissoNote[locale]}</p>

        <SubTitle id="sterility" text={qc.sterilityTitle} locale={locale} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qc.sterility.map((step) => (
            <div key={step.title.en} className="rounded-card border border-line bg-white p-5">
              <p className="font-bold text-vault-900">{step.title[locale]}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text[locale]}</p>
            </div>
          ))}
        </div>

        <SubTitle id="dissoacc" text={qc.dissoAccTitle} locale={locale} lead={qc.dissoAccNote} />
        <DataTable cols={Object.values(qc.dissoAccCols)} rows={qc.dissoAcc.map((r) => [r.stage, r.n, r.criteria])} locale={locale} mono={[1]} />

        <SubTitle id="f2" text={qc.f2Title} locale={locale} />
        <Bullets items={qc.f2} locale={locale} />
        <p className="mt-3 text-sm text-muted">{qc.f2Ref[locale]}</p>

        <SubTitle id="stab" text={qc.stabTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.stabCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.stabFreq.map((r) => (
                <tr key={r.study.en}>
                  <td className="font-medium text-vault-900">{r.study[locale]}</td>
                  <td className="leading-relaxed">{r.when[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <p className="mb-3 mt-6 font-bold text-vault-900">{qc.sigTitle[locale]}</p>
        <Bullets items={qc.sig} locale={locale} />
        <p className="mt-3 text-sm text-muted">{qc.photo[locale]}</p>

        <SubTitle id="conditions" text={m.condTitle} locale={locale} />
        <DataTable cols={m.condCols} rows={m.cond} locale={locale} mono={[1, 2]} />
        <p className="mb-3 mt-6 font-bold text-vault-900">{m.zonesTitle[locale]}</p>
        <DataTable cols={m.zonesCols} rows={m.zones} locale={locale} mono={[2]} />
        <p className="mt-3 text-sm text-muted">{m.condNote[locale]}</p>

        <SubTitle id="bet" text={qc.betTitle} locale={locale} />
        <Cards items={qc.bet.map((b) => ({ k: b.title[locale], v: b.text, f: b.formula }))} locale={locale} />

        <SubTitle id="particles" text={m.partTitle} locale={locale} />
        <DataTable cols={m.partCols} rows={m.part} locale={locale} mono={[1, 2, 3]} />
        <p className="mt-3 text-sm text-muted">{m.partNote[locale]}</p>

        <SubTitle id="strains" text={qc.strainsTitle} locale={locale} lead={qc.strainsNote} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                {Object.values(qc.strainsCols).map((c) => (
                  <th key={c.en}>{c[locale]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qc.strains.map((r) => (
                <tr key={r.organism}>
                  <td className="italic text-vault-900" dir="ltr" style={{ textAlign: "start" }}>
                    {r.organism}
                  </td>
                  <td className="num">{r.strain}</td>
                  <td>{r.use[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SubTitle id="em" text={qc.emTitle} locale={locale} />
        <DataTable cols={Object.values(qc.emCols)} rows={qc.em.map((r) => [r.grade, r.restSmall, r.restLarge, r.opSmall, r.opLarge, r.air, r.settle, r.contact])} locale={locale} mono={[1, 2, 3, 4, 5, 6, 7]} />
        <p className="mt-3 text-sm text-muted">{qc.emNote[locale]}</p>

        <SubTitle id="sampling" text={qc.samplingTitle} locale={locale} lead={qc.samplingNote} />
        <DataTable cols={Object.values(qc.samplingCols)} rows={qc.sampling.map((r) => [r.plan, r.formula, r.use])} locale={locale} mono={[1]} />

        <SubTitle id="aiq" text={qc.aiqTitle} locale={locale} />
        <Cards items={qc.aiqStages.map((a) => ({ k: a.stage, v: a.text }))} locale={locale} />
        <div className="mt-4">
          <Cards items={qc.aiqGroups.map((g) => ({ k: `Group ${g.group}`, v: g.text }))} locale={locale} />
        </div>

        <SubTitle id="balance" text={qc.balanceTitle} locale={locale} />
        <Bullets items={qc.balance} locale={locale} />

        <SubTitle id="lifecycle" text={qc.lifecycleTitle} locale={locale} />
        <Cards items={qc.lifecycle} locale={locale} />

        <SubTitle id="techniques" text={m.techTitle} locale={locale} />
        <DataTable cols={m.techCols} rows={m.tech} locale={locale} mono={[2, 3]} />

        <SubTitle id="standards" text={m.stdTitle} locale={locale} />
        <Cards items={m.std} locale={locale} />

        <SubTitle id="di" text={qc.diTitle} locale={locale} />
        <Cards items={qc.di} locale={locale} />
        <p className="mt-3 text-sm text-muted">{qc.diNote[locale]}</p>

        <SubTitle id="ret" text={qc.retTitle} locale={locale} />
        <Bullets items={qc.ret} locale={locale} />

        <SubTitle id="sops" text={qc.sopsTitle} locale={locale} />
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
