"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ClipboardPaste, Download, Info, Lock, Plus, Printer, Trash2, X, XCircle } from "lucide-react";
import { coaBuilderCopy, pharmacopoeias, type Pharmacopoeia } from "@/content/coa-builder";
import { coaCheckCopy as t } from "@/content/coa-check";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { readCertificate, reviewCertificate, type CheckReport, type CheckRow, type Level, type RefRow, type RowReport } from "@/lib/coa-check";
import type { CoaRow } from "@/lib/coa-doc";
import { listCoaSpecs, type SavedSpec } from "@/lib/coa-spec-actions";
import { printHtml, saveBlob } from "@/lib/doc-export";
import { buildDocx, type DocBlock, type DocModel } from "@/lib/docx";
import { documentHtml } from "@/lib/form-doc";
import { importMonograph } from "@/lib/monograph-import";

const inputClass = "field-input w-full text-sm";
const cell = "w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13px] outline-none transition hover:border-line focus:border-molecule-500 focus:bg-white";

const tone: Record<Level, string> = {
  ok: "border-molecule-400/60 bg-molecule-50 text-molecule-800",
  info: "border-line bg-vault-50 text-vault-800",
  warn: "border-capsule-400/70 bg-capsule-50 text-vault-900",
  fail: "border-red-300 bg-red-50 text-red-900",
};
const Icon = ({ level }: { level: Level }) => {
  const c = "mt-0.5 size-4 shrink-0";
  if (level === "fail") return <XCircle className={`${c} text-red-700`} aria-hidden="true" />;
  if (level === "warn") return <AlertTriangle className={`${c} text-capsule-700`} aria-hidden="true" />;
  if (level === "ok") return <CheckCircle2 className={`${c} text-molecule-600`} aria-hidden="true" />;
  return <Info className={`${c} text-vault-500`} aria-hidden="true" />;
};

const worst = (r: RowReport): Level => (r.findings.some((f) => f.level === "fail") ? "fail" : r.findings.some((f) => f.level === "warn") ? "warn" : r.result === "ok" ? "ok" : "info");

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-5">
      <h2 className="flex items-center gap-2.5 font-bold text-vault-900">
        <span className="flex size-6 items-center justify-center rounded-full bg-vault-900 text-xs text-capsule-400">{n}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function CoaCheck({ locale, allowed, signedIn, buyHref }: { locale: Locale; allowed: boolean; signedIn: boolean; buyHref: string }) {
  const L = (b: Bi) => b[locale];
  const [ph, setPh] = useState<Pharmacopoeia>("usp");
  const [material, setMaterial] = useState("");
  const [specs, setSpecs] = useState<SavedSpec[] | null>(null);
  const [specId, setSpecId] = useState("");
  const [mono, setMono] = useState("");
  const [paste, setPaste] = useState("");
  const [rows, setRows] = useState<CheckRow[]>([]);
  const [readMsg, setReadMsg] = useState("");
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    listCoaSpecs().then((r) => live && r.ok && setSpecs(r.specs));
    return () => {
      live = false;
    };
  }, [signedIn]);

  const refs = useMemo<RefRow[]>(() => {
    const out: RefRow[] = [];
    const sp = specs?.find((s) => s.id === specId);
    const data = sp?.data as { rows?: CoaRow[] } | undefined;
    for (const r of data?.rows ?? []) if (r.spec?.trim()) out.push({ name: r.name, method: r.method, spec: r.spec, from: "lib" });
    if (mono.trim()) for (const r of importMonograph(mono, ph).rows) out.push({ ...r, from: "mono" });
    return out;
  }, [specs, specId, mono, ph]);

  const report = useMemo<CheckReport | null>(() => (rows.length ? reviewCertificate(rows, refs, ph, paste) : null), [rows, refs, ph, paste]);

  const read = () => {
    const found = readCertificate(paste);
    setRows(found);
    setReadMsg(found.length ? L(t.readFound).replace("{n}", String(found.length)) : L(t.readNone));
    const name = paste.match(/\b(?:product(?: name)?|material|name of (?:the )?(?:product|material))\s*[:：]\s*([^\n]{2,80})/i)?.[1]?.trim();
    if (name && !material) setMaterial(name.replace(/\s{2,}.*$/, ""));
  };
  const setRow = (i: number, patch: Partial<CheckRow>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const batch = paste.match(/\b(?:batch|lot)\s*(?:no\.?|number|#)?\s*[:：]?\s*([A-Z0-9][A-Z0-9/-]{2,})/i)?.[1] ?? "";
  const doc = useMemo(() => (report ? reportDocument(report, { locale, material, batch, ph }) : null), [report, locale, material, batch, ph]);
  const guard = (action: () => void) => () => (allowed ? action() : setNotice(true));
  const fileName = `CoA-review-${(material || "material").replace(/[^\w.-]+/g, "_")}`;
  const downloadWord = guard(() => doc && saveBlob(buildDocx(doc), `${fileName}.docx`));
  const print = guard(() => doc && printHtml(documentHtml(doc), fileName));

  const specLabel: Record<RowReport["spec"], Bi> = { same: t.specSame, stricter: t.specStricter, looser: t.specLooser, manual: t.specManual, noref: t.specNoRef };
  const resultLabel: Record<RowReport["result"], Bi> = { ok: t.resOk, fail: t.resFail, open: t.resOpen };
  const verdict = report ? (report.counts.fail ? t.verdictFail : report.counts.warn ? t.verdictWarn : t.verdictOk) : null;

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">{L(t.lead)}</p>

      <Section n={1} title={L(t.step1)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(coaBuilderCopy.pharmacopoeia)}</span>
            <select value={ph} onChange={(e) => setPh(e.target.value as Pharmacopoeia)} className={inputClass}>
              {pharmacopoeias.map((p) => (
                <option key={p.value} value={p.value}>
                  {L(p.label)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.material)}</span>
            <input dir="auto" value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.refLib)}</span>
            {!signedIn ? (
              <span className="block text-sm text-muted">{L(t.refLibSignIn)}</span>
            ) : specs && specs.length === 0 ? (
              <span className="block text-sm text-muted">{L(t.refLibEmpty)}</span>
            ) : (
              <select value={specId} onChange={(e) => setSpecId(e.target.value)} className={inputClass}>
                <option value="">{L(t.refLibNone)}</option>
                {(specs ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.material && s.material !== s.name ? ` — ${s.material}` : ""}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.refMono)}</span>
            <span className="mb-1.5 block text-xs text-muted">{L(t.refMonoHint)}</span>
            <textarea dir="ltr" rows={4} value={mono} onChange={(e) => setMono(e.target.value)} className={`${inputClass} font-mono text-xs`} />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">{refs.length ? isolateText(L(t.refCount).replace("{n}", String(refs.length))) : L(t.refGeneralOnly)}</p>
      </Section>

      <Section n={2} title={L(t.step2)}>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.paste)}</span>
          <span className="mb-1.5 block text-xs text-muted">{L(t.pasteHint)}</span>
          <textarea dir="ltr" rows={8} value={paste} onChange={(e) => setPaste(e.target.value)} className={`${inputClass} font-mono text-xs`} />
        </label>
        <button type="button" onClick={read} disabled={!paste.trim()} className="mt-3 inline-flex items-center gap-2 rounded-full bg-molecule-600 px-4 py-2 text-sm font-bold text-white hover:bg-molecule-700 disabled:opacity-50">
          <ClipboardPaste className="size-4" aria-hidden="true" />
          {L(t.read)}
        </button>
        {readMsg && <p className="mt-2 text-xs text-molecule-700" aria-live="polite">{isolateText(readMsg)}</p>}
        {(rows.length > 0 || readMsg) && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-sm" dir="ltr">
              <thead className="bg-vault-50 text-xs text-vault-900">
                <tr>
                  <th className="w-8 px-2 py-2 text-left">#</th>
                  <th className="px-2 py-2 text-left">Test</th>
                  <th className="px-2 py-2 text-left">Method</th>
                  <th className="px-2 py-2 text-left">Specification</th>
                  <th className="px-2 py-2 text-left">Result</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-2 text-xs text-muted">{i + 1}</td>
                    <td className="px-1"><input value={r.name} onChange={(e) => setRow(i, { name: e.target.value })} className={cell} /></td>
                    <td className="px-1"><input value={r.method} onChange={(e) => setRow(i, { method: e.target.value })} className={cell} /></td>
                    <td className="px-1"><input value={r.spec} onChange={(e) => setRow(i, { spec: e.target.value })} className={cell} /></td>
                    <td className="px-1"><input value={r.result} onChange={(e) => setRow(i, { result: e.target.value })} className={cell} /></td>
                    <td className="px-1">
                      <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label={L(t.remove)} className="rounded-full p-1.5 text-muted hover:text-red-700">
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-line p-2" dir={locale === "fa" ? "rtl" : "ltr"}>
              <button type="button" onClick={() => setRows((rs) => [...rs, { name: "", method: "", spec: "", result: "" }])} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs hover:border-molecule-400">
                <Plus className="size-3.5" aria-hidden="true" />
                {L(t.addRow)}
              </button>
            </div>
          </div>
        )}
      </Section>

      {report && (
        <Section n={3} title={L(t.step3)}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-vault-900">
              {isolateText(L(t.summary).replace("{ok}", String(report.counts.ok)).replace("{warn}", String(report.counts.warn)).replace("{fail}", String(report.counts.fail)))}
            </span>
            <span className="ms-auto flex flex-wrap gap-2">
              <button type="button" onClick={downloadWord} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-4 py-2 text-xs font-bold text-capsule-400 hover:bg-vault-800">
                {allowed ? <Download className="size-3.5" aria-hidden="true" /> : <Lock className="size-3.5" aria-hidden="true" />}
                {L(t.word)}
              </button>
              <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-vault-900 hover:border-molecule-400">
                {allowed ? <Printer className="size-3.5" aria-hidden="true" /> : <Lock className="size-3.5" aria-hidden="true" />}
                {L(t.print)}
              </button>
            </span>
          </div>
          {notice && (
            <div role="alert" className="relative mt-3 rounded-2xl border border-capsule-400/70 bg-capsule-50 p-4 pe-10 text-sm text-vault-900">
              <button type="button" onClick={() => setNotice(false)} aria-label={L(t.remove)} className="absolute end-3 top-3 rounded-full p-1 text-muted hover:text-vault-900">
                <X className="size-4" aria-hidden="true" />
              </button>
              <p className="flex items-center gap-2 font-bold">
                <Lock className="size-4 text-capsule-700" aria-hidden="true" />
                {L(coaBuilderCopy.exportLocked)}
              </p>
              <Link href={buyHref} className="mt-3 inline-block rounded-full bg-vault-900 px-4 py-1.5 text-xs font-bold text-capsule-400">
                {L(coaBuilderCopy.buy)}
              </Link>
            </div>
          )}
          {verdict && (
            <p className={`mt-4 flex gap-2 rounded-xl border p-3 text-sm font-semibold ${tone[report.counts.fail ? "fail" : report.counts.warn ? "warn" : "ok"]}`}>
              <Icon level={report.counts.fail ? "fail" : report.counts.warn ? "warn" : "ok"} />
              {L(verdict)}
            </p>
          )}

          <ul className="mt-4 space-y-3">
            {report.rows.map((r, i) => {
              const w = worst(r);
              return (
                <li key={i} className={`rounded-xl border p-4 ${w === "fail" ? "border-red-300" : w === "warn" ? "border-capsule-400/70" : "border-line"}`}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5">
                      <Icon level={w} />
                      <bdi dir="ltr" className="font-bold text-vault-900">{r.row.name || "—"}</bdi>
                    </span>
                    <span className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      <span className={`rounded-full px-2 py-0.5 ${r.spec === "looser" ? "bg-red-100 text-red-800" : r.spec === "noref" || r.spec === "manual" ? "bg-vault-50 text-muted" : "bg-molecule-100 text-molecule-700"}`}>{L(specLabel[r.spec])}</span>
                      <span className={`rounded-full px-2 py-0.5 ${r.result === "fail" ? "bg-red-100 text-red-800" : r.result === "ok" ? "bg-molecule-100 text-molecule-700" : "bg-vault-50 text-muted"}`}>{L(resultLabel[r.result])}</span>
                    </span>
                  </div>
                  <dl className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-3" dir="ltr">
                    <div><dt className="inline text-muted">Spec: </dt><dd className="inline text-ink">{r.row.spec || "—"}</dd></div>
                    <div><dt className="inline text-muted">Result: </dt><dd className="inline text-ink">{r.row.result || "—"}</dd></div>
                    {r.ref && <div><dt className="inline text-muted">Reference: </dt><dd className="inline text-ink">{r.ref.spec}</dd></div>}
                  </dl>
                  {r.findings.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {r.findings.map((f, j) => (
                        <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink">
                          <Icon level={f.level} />
                          <span>{isolateText(L(f.text))}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {report.missing.length > 0 && (
            <div className="mt-6">
              <h3 className="flex items-center gap-2 font-bold text-vault-900">
                <AlertTriangle className="size-4 text-capsule-700" aria-hidden="true" />
                {L(t.missingTitle)}
              </h3>
              <ul className="mt-2 space-y-1 text-sm" dir="ltr">
                {report.missing.map((m, i) => (
                  <li key={i} className="rounded-lg border border-capsule-400/50 bg-capsule-50/50 px-3 py-1.5">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-muted"> — {m.spec}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">{L(t.missingNote)}</p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-bold text-vault-900">{L(t.docTitle)}</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {report.doc.map((d) => (
                <li key={d.id} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${tone[d.level]}`}>
                  <Icon level={d.level} />
                  <span>
                    <span className="font-semibold">{isolateText(L(d.label))}</span>
                    <span className="text-xs"> · {d.found ? L(t.found) : d.note ? isolateText(L(d.note)) : L(t.notFound)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted">{L(t.disclaimer)}</p>
        </Section>
      )}
    </div>
  );
}

/** The review as a document, in the page's language; test names, limits and results stay as the certificate gives them. */
function reportDocument(report: CheckReport, m: { locale: Locale; material: string; batch: string; ph: Pharmacopoeia }): DocModel {
  const L = (b: Bi) => b[m.locale];
  const fa = m.locale === "fa";
  const iso = (x: string) => (fa ? isolateText(x) : x);
  const mark: Record<Level, string> = { ok: "✓", info: "i", warn: "!", fail: "✗" };
  const blocks: DocBlock[] = [];
  const verdict = report.counts.fail ? t.verdictFail : report.counts.warn ? t.verdictWarn : t.verdictOk;
  blocks.push({ kind: "para", text: L(t.summary).replace("{ok}", String(report.counts.ok)).replace("{warn}", String(report.counts.warn)).replace("{fail}", String(report.counts.fail)) });
  blocks.push({ kind: "para", text: iso(L(verdict)), boxed: true });
  blocks.push({ kind: "heading", text: L(t.findings) });
  blocks.push({
    kind: "table",
    columns: ["#", L(t.colTest), L(t.colSpec), L(t.colResult), L(t.reference), L(t.findings)],
    rows: report.rows.map((r, i) => [
      String(i + 1),
      r.row.name,
      r.row.spec,
      r.row.result,
      r.ref?.spec ?? L(t.none),
      r.findings.map((f) => `${mark[f.level]} ${iso(L(f.text))}`).join("\n") || mark[worst(r)],
    ]),
    widths: [0.35, 1.6, 1.3, 1.1, 1.2, 3.2],
  });
  if (report.missing.length) {
    blocks.push({ kind: "heading", text: L(t.missingTitle) });
    blocks.push({ kind: "para", text: report.missing.map((r) => `• ${r.name}: ${r.spec}`).join("\n") });
    blocks.push({ kind: "para", text: iso(L(t.missingNote)) });
  }
  blocks.push({ kind: "heading", text: L(t.docTitle) });
  blocks.push({
    kind: "table",
    rows: report.doc.map((d) => [`${mark[d.level]} ${iso(L(d.label))}`, d.found ? L(t.found) : d.note ? iso(L(d.note)) : L(t.notFound)]),
    widths: [2.4, 4.6],
    labelColumn: true,
  });
  blocks.push({ kind: "para", text: iso(L(t.disclaimer)) });
  return {
    rtl: fa,
    header: {
      company: m.material,
      title: L(t.reportTitle),
      meta: [
        [L(t.batch), m.batch],
        [L(t.pharmacopoeia), pharmacopoeias.find((p) => p.value === m.ph)?.label[m.locale] ?? ""],
        [L(t.date), new Date().toISOString().slice(0, 10)],
      ],
    },
    blocks,
  };
}
