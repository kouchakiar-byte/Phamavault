"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCopy, Printer, XCircle } from "lucide-react";
import { coaCopy as t, docItems, redFlags, testItems, type CoaItem, type MaterialType } from "@/content/coa-review";
import type { Locale } from "@/i18n/config";

function Check({ item, on, toggle, locale }: { item: CoaItem; on: boolean; toggle: () => void; locale: Locale }) {
  return (
    <label className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 transition ${on ? "border-molecule-500 bg-molecule-50/70" : "border-line bg-white hover:border-molecule-400"}`}>
      <input type="checkbox" checked={on} onChange={toggle} className="mt-1.5 size-4 shrink-0 accent-molecule-600" />
      <span>
        <span className="block font-semibold text-vault-900">{item.label[locale]}</span>
        <span className="block text-xs leading-6 text-muted">{item.why[locale]}</span>
      </span>
    </label>
  );
}

export function CoaReview({ locale }: { locale: Locale }) {
  const [type, setType] = useState<MaterialType>("api");
  const [have, setHave] = useState<Set<string>>(new Set());
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [product, setProduct] = useState("");
  const [batch, setBatch] = useState("");
  const [supplier, setSupplier] = useState("");
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => [...docItems.map((i) => ({ ...i, key: `doc:${i.id}` })), ...testItems[type].map((i) => ({ ...i, key: `${type}:${i.id}` }))], [type]);
  const missing = items.filter((i) => !have.has(i.key));
  const score = Math.round(((items.length - missing.length) / items.length) * 100);
  const verdict = flags.size ? "stop" : missing.length ? "gaps" : "ok";

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const email = [
    `Dear ${supplier || "Sir or Madam"},`,
    "",
    `Re: Certificate of Analysis — ${product || "[product]"}, batch ${batch || "[batch]"}`,
    "",
    "Thank you for the Certificate of Analysis. To complete our review for use in GMP manufacture, please send us:",
    "",
    ...(missing.length ? missing.map((m) => `- ${m.ask[0].toUpperCase()}${m.ask.slice(1)};`) : ["- [no missing items]"]),
    "",
    "We would also appreciate a copy of the specification against which the batch was released.",
    "",
    "Kind regards,",
  ].join("\n");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const field = "field-input mt-1";
  const label = "block text-xs font-medium text-muted";
  return (
    <div className="space-y-8">
      <style>{`@media print {
  html, body, main { min-height: 0 !important; height: auto !important; display: block !important; background: #fff !important; }
  body > *:not(main), .no-print { display: none !important; }
}`}</style>
      <div className="grid gap-4 rounded-card border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className={label}>
          {t.type[locale]}
          <select
            className={field}
            value={type}
            onChange={(e) => {
              setType(e.target.value as MaterialType);
              setHave((s) => new Set([...s].filter((k) => k.startsWith("doc:"))));
            }}
          >
            {(Object.keys(t.types) as MaterialType[]).map((k) => (
              <option key={k} value={k}>
                {t.types[k][locale]}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          {t.product[locale]}
          <input className={field} dir="ltr" value={product} onChange={(e) => setProduct(e.target.value)} />
        </label>
        <label className={label}>
          {t.batch[locale]}
          <input className={field} dir="ltr" value={batch} onChange={(e) => setBatch(e.target.value)} />
        </label>
        <label className={label}>
          {t.supplier[locale]}
          <input className={field} dir="ltr" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-vault-900">{t.docTitle[locale]}</h2>
          {docItems.map((i) => (
            <Check key={i.id} item={i} on={have.has(`doc:${i.id}`)} toggle={() => toggle(have, setHave, `doc:${i.id}`)} locale={locale} />
          ))}
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-vault-900">
            {t.testsTitle[locale]} · <span className="text-molecule-700">{t.types[type][locale]}</span>
          </h2>
          {testItems[type].map((i) => (
            <Check key={i.id} item={i} on={have.has(`${type}:${i.id}`)} toggle={() => toggle(have, setHave, `${type}:${i.id}`)} locale={locale} />
          ))}
        </section>
      </div>

      <section className="rounded-card border border-red-200 bg-red-50/50 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-red-800">
          <AlertTriangle className="size-5" aria-hidden="true" />
          {t.flagsTitle[locale]}
        </h2>
        <p className="mb-3 text-sm text-muted">{t.flagsLead[locale]}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {redFlags.map((f) => (
            <label key={f.id} className="flex cursor-pointer items-start gap-3 rounded-lg bg-white px-3 py-2 text-sm">
              <input type="checkbox" checked={flags.has(f.id)} onChange={() => toggle(flags, setFlags, f.id)} className="mt-1 size-4 shrink-0 accent-red-600" />
              <span>{f.label[locale]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-card border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-vault-900">{t.verdictTitle[locale]}</h2>
          <p className="text-sm text-muted">
            {t.score[locale]}: <b className="text-2xl text-vault-900" dir="ltr">{score}%</b>
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper">
          <div className={`h-full ${verdict === "stop" ? "bg-red-600" : verdict === "gaps" ? "bg-capsule-500" : "bg-molecule-600"}`} style={{ width: `${score}%` }} />
        </div>
        <p
          className={`flex items-start gap-2 rounded-xl px-4 py-3 font-semibold ${
            verdict === "stop" ? "bg-red-50 text-red-800" : verdict === "gaps" ? "bg-capsule-400/15 text-vault-900" : "bg-molecule-50 text-molecule-700"
          }`}
        >
          {verdict === "ok" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <XCircle className="mt-0.5 size-5 shrink-0" />}
          {t.verdict[verdict][locale]}
        </p>
        <div>
          <h3 className="mb-2 font-bold text-vault-900">{t.missing[locale]}</h3>
          {missing.length === 0 ? (
            <p className="text-sm text-muted">{t.none[locale]}</p>
          ) : (
            <ul className="list-disc space-y-1 ps-5 text-sm leading-7 text-ink">
              {missing.map((m) => (
                <li key={m.key}>{m.label[locale]}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="mb-2 font-bold text-vault-900">{t.emailTitle[locale]}</h3>
          <pre dir="ltr" data-copy-ok className="whitespace-pre-wrap rounded-xl border border-line bg-paper p-4 text-left font-sans text-sm leading-6 text-ink">
            {email}
          </pre>
          <div className="no-print mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={copyEmail} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800">
              <ClipboardCopy className="size-4" aria-hidden="true" />
              {copied ? t.copied[locale] : t.copy[locale]}
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-vault-900 hover:bg-paper">
              <Printer className="size-4" aria-hidden="true" />
              {t.print[locale]}
            </button>
          </div>
        </div>
      </section>
      <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">{t.disclaimer[locale]}</p>
      <p className="flex flex-wrap gap-2 text-xs text-muted">
        {t.refs.map((r) => (
          <bdi key={r} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
            {r}
          </bdi>
        ))}
      </p>
    </div>
  );
}
