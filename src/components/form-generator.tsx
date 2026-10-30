"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Download, FileText, ImagePlus, Lock, Plus, Printer, RotateCcw, X } from "lucide-react";
import { formsCopy as t, qaForms, type FormField } from "@/content/qa-forms";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { buildDocx } from "@/lib/docx";
import { documentHtml, formDocument, type CheckValue, type FormMeta, type FormValues } from "@/lib/form-doc";

type Logo = NonNullable<FormMeta["logo"]>;
type StoredMeta = { company: string; rev: string; effective: string; logo?: { dataUrl: string; width: number; height: number } };

const read = <T,>(key: string): T | null => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: the form still works, it just is not kept
  }
};

const pngBytes = (dataUrl: string) => Uint8Array.from(atob(dataUrl.split(",")[1] ?? ""), (c) => c.charCodeAt(0));

/** Reads an image file, scales it to at most 60 px high and returns it as PNG. */
function loadLogo(file: File): Promise<StoredMeta["logo"]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, 60 / img.height, 160 / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        // drawn at 4× for print sharpness, shown at w × h
        const canvas = document.createElement("canvas");
        canvas.width = w * 4;
        canvas.height = h * 4;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ dataUrl: canvas.toDataURL("image/png"), width: w, height: h });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const inputClass = "field-input w-full text-sm";

function Field({ field, value, onChange, locale }: { field: FormField; value: FormValues[string] | undefined; onChange: (v: FormValues[string]) => void; locale: Locale }) {
  const tx = (b: { en: string; fa: string }) => (locale === "fa" ? isolateText(b.fa) : b.en);
  const label = <span className="mb-1 block text-xs font-semibold text-vault-900">{tx(field.label)}</span>;
  switch (field.type) {
    case "text":
    case "date":
      return (
        <label className="block">
          {label}
          <input type="text" dir="auto" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        </label>
      );
    case "textarea":
      return (
        <label className="block sm:col-span-2">
          {label}
          <textarea dir="auto" rows={3} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={`${inputClass} min-h-20`} />
        </label>
      );
    case "select":
      return (
        <label className="block">
          {label}
          <select value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            <option value="">—</option>
            {field.options.map((o) => (
              <option key={o.en} value={o[locale]}>
                {o[locale]}
              </option>
            ))}
          </select>
        </label>
      );
    case "multi": {
      const chosen = Array.isArray(value) ? (value as string[]) : [];
      return (
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-xs font-semibold text-vault-900">{tx(field.label)}</legend>
          <div className="flex flex-wrap gap-2">
            {field.options.map((o) => {
              const on = chosen.includes(o.en);
              return (
                <button
                  key={o.en}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange(on ? chosen.filter((x) => x !== o.en) : [...chosen, o.en])}
                  className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-molecule-500 bg-molecule-600 font-semibold text-white" : "border-line bg-white text-vault-800 hover:border-molecule-400"}`}
                >
                  {tx(o)}
                </button>
              );
            })}
          </div>
        </fieldset>
      );
    }
    case "check": {
      const answers = (value && !Array.isArray(value) && typeof value === "object" ? value : {}) as Record<string, CheckValue>;
      const opts: [CheckValue, { en: string; fa: string }][] = [
        ["yes", t.yes],
        ["no", t.no],
        ["na", t.na],
      ];
      return (
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-xs font-semibold text-vault-900">{tx(field.label)}</legend>
          <ol className="divide-y divide-line rounded-xl border border-line">
            {field.items.map((item, i) => (
              <li key={item.en} className="flex flex-col gap-2 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-ink">
                  <span className="me-1.5 font-mono text-xs text-muted">{i + 1}.</span>
                  {tx(item)}
                </span>
                <span className="flex shrink-0 gap-1">
                  {opts.map(([v, l]) => {
                    const on = answers[String(i)] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange({ ...answers, [String(i)]: v })}
                        className={`rounded-md border px-2.5 py-0.5 text-xs ${on ? (v === "no" ? "border-red-400 bg-red-50 font-bold text-red-700" : "border-molecule-500 bg-molecule-50 font-bold text-molecule-700") : "border-line text-muted hover:border-vault-400"}`}
                      >
                        {l[locale]}
                      </button>
                    );
                  })}
                </span>
              </li>
            ))}
          </ol>
        </fieldset>
      );
    }
    case "table": {
      const grid = Array.isArray(value) && Array.isArray(value[0]) ? (value as string[][]) : [];
      const n = Math.max(field.rows, grid.length);
      const set = (r: number, c: number, v: string) => {
        const next = Array.from({ length: n }, (_, i) => [...(grid[i] ?? field.columns.map(() => ""))]);
        next[r][c] = v;
        onChange(next);
      };
      return (
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-xs font-semibold text-vault-900">{tx(field.label)}</legend>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr>
                  {field.columns.map((c) => (
                    <th key={c.en} className="border border-line bg-vault-50 px-2 py-1 text-start text-xs font-semibold">
                      {tx(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: n }, (_, r) => (
                  <tr key={r}>
                    {field.columns.map((c, ci) => (
                      <td key={c.en} className="border border-line p-0">
                        <input dir="auto" value={grid[r]?.[ci] ?? ""} onChange={(e) => set(r, ci, e.target.value)} className="w-full bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-molecule-50" aria-label={`${c[locale]} ${r + 1}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => onChange([...Array.from({ length: n }, (_, i) => grid[i] ?? field.columns.map(() => "")), field.columns.map(() => "")])} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-molecule-700 hover:underline">
            <Plus className="size-3.5" aria-hidden="true" />
            {t.addRow[locale]}
          </button>
        </fieldset>
      );
    }
  }
}

const noSubscribe = () => () => {};

/** Fills a GMP form, previews it as a document, and exports Word (.docx) or prints it (subscribers). */
export function FormGenerator(props: { locale: Locale; allowed: boolean; buyHref: string }) {
  // Drafts live in this browser's storage, so the generator renders in the browser only.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  return mounted ? <Generator {...props} /> : <div className="min-h-[60vh]" aria-busy="true" />;
}

function Generator({ locale, allowed, buyHref }: { locale: Locale; allowed: boolean; buyHref: string }) {
  const tx = (b: { en: string; fa: string }) => (locale === "fa" ? isolateText(b.fa) : b.en);
  const draftKey = (c: string) => `pv-form:${c}:${locale}`;
  const [code, setCode] = useState(qaForms[0].code);
  const form = qaForms.find((f) => f.code === code) ?? qaForms[0];
  const [values, setValues] = useState<FormValues>(() => read<FormValues>(draftKey(qaForms[0].code)) ?? {});
  const [meta, setMeta] = useState<StoredMeta>(() => read<StoredMeta>("pv-form-meta") ?? { company: "", rev: "00", effective: "" });
  const [notice, setNotice] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const choose = (c: string) => {
    setCode(c);
    setValues(read<FormValues>(draftKey(c)) ?? {});
  };
  useEffect(() => write(`pv-form:${code}:${locale}`, values), [values, code, locale]);
  useEffect(() => write("pv-form-meta", meta), [meta]);

  const docMeta: FormMeta = useMemo(
    () => ({
      company: meta.company,
      code: form.code,
      rev: meta.rev,
      effective: meta.effective,
      logo: meta.logo ? ({ ...meta.logo, png: pngBytes(meta.logo.dataUrl) } satisfies Logo) : undefined,
    }),
    [meta, form.code],
  );
  const doc = useMemo(() => formDocument(form, values, docMeta, locale), [form, values, docMeta, locale]);
  const html = useMemo(() => documentHtml(doc, meta.logo?.dataUrl), [doc, meta.logo]);

  const guard = (action: () => void) => () => (allowed ? action() : setNotice(true));

  const downloadWord = guard(() => {
    const url = URL.createObjectURL(buildDocx(doc));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.code}.docx`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  const print = guard(() => {
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    frame.srcdoc = html;
    frame.onload = () => {
      const w = frame.contentWindow;
      if (!w) return;
      (w.document.fonts?.ready ?? Promise.resolve()).then(() => {
        w.focus();
        w.print();
        setTimeout(() => frame.remove(), 1000);
      });
    };
    document.body.append(frame);
  });

  return (
    <div className="space-y-6">
      {/* Form choice */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.choose[locale]}>
        {qaForms.map((f) => (
          <button
            key={f.code}
            type="button"
            role="tab"
            aria-selected={f.code === code}
            onClick={() => choose(f.code)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${f.code === code ? "border-vault-900 bg-vault-900 font-semibold text-capsule-400" : "border-line bg-white text-vault-900 hover:border-molecule-400"}`}
          >
            <FileText className="size-4" aria-hidden="true" />
            {tx(f.title)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-5">
          {/* Header */}
          <section className="rounded-card border border-line bg-white p-5">
            <h2 className="font-bold text-vault-900">{t.header[locale]}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-vault-900">{t.company[locale]}</span>
                <input dir="auto" value={meta.company} onChange={(e) => setMeta({ ...meta, company: e.target.value })} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-vault-900">{t.rev[locale]}</span>
                <input dir="ltr" value={meta.rev} onChange={(e) => setMeta({ ...meta, rev: e.target.value })} className={`${inputClass} text-start`} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-vault-900">{t.effective[locale]}</span>
                <input dir="auto" value={meta.effective} onChange={(e) => setMeta({ ...meta, effective: e.target.value })} className={inputClass} />
              </label>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-vault-900">{t.logo[locale]}</span>
                <div className="flex items-center gap-3">
                  {meta.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.logo.dataUrl} alt="" width={meta.logo.width} height={meta.logo.height} className="rounded border border-line" />
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm hover:border-molecule-400">
                    <ImagePlus className="size-4" aria-hidden="true" />
                    {t.logo[locale]}
                  </button>
                  {meta.logo && (
                    <button type="button" onClick={() => setMeta({ ...meta, logo: undefined })} className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-700">
                      <X className="size-3.5" aria-hidden="true" />
                      {t.removeLogo[locale]}
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) setMeta({ ...meta, logo: await loadLogo(file).catch(() => undefined) });
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Fields */}
          {form.sections.map((s) => (
            <section key={s.title.en} className="rounded-card border border-line bg-white p-5">
              <h2 className="font-bold text-vault-900">{tx(s.title)}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {s.fields.map((f) => (
                  <Field key={f.id} field={f} locale={locale} value={values[f.id]} onChange={(v) => setValues((prev) => ({ ...prev, [f.id]: v }))} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Preview and export */}
        <div className="space-y-3 xl:sticky xl:top-24 xl:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={downloadWord} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-bold text-capsule-400 hover:bg-vault-800">
              {allowed ? <Download className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
              {t.word[locale]}
            </button>
            <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-400">
              {allowed ? <Printer className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
              {t.print[locale]}
            </button>
            <button type="button" onClick={() => setValues({})} className="inline-flex items-center gap-1.5 px-2 text-xs text-muted hover:text-vault-900">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              {t.reset[locale]}
            </button>
          </div>
          {notice && (
            <div role="alert" className="relative rounded-2xl border border-capsule-400/70 bg-capsule-50 p-4 pe-10 text-sm text-vault-900">
              <button type="button" onClick={() => setNotice(false)} aria-label={t.close[locale]} className="absolute end-3 top-3 rounded-full p-1 text-muted hover:text-vault-900">
                <X className="size-4" aria-hidden="true" />
              </button>
              <p className="flex items-center gap-2 font-bold">
                <Lock className="size-4 text-capsule-700" aria-hidden="true" />
                {t.lockedTitle[locale]}
              </p>
              <p className="mt-1 leading-relaxed">{t.lockedText[locale]}</p>
              <Link href={buyHref} className="mt-3 inline-block rounded-full bg-vault-900 px-4 py-1.5 text-xs font-bold text-capsule-400">
                {t.buy[locale]}
              </Link>
            </div>
          )}
          <p className="text-xs text-muted">
            {t.preview[locale]} · {t.saved[locale]}
          </p>
          <iframe title={t.preview[locale]} srcDoc={html} className="h-[75vh] w-full rounded-card border border-line bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
