"use client";

import { useEffect, useState } from "react";
import { leafletsCopy as t, type Leaflet } from "@/content/pharmacy-tools";
import type { Ref } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";

const KEY = "pv-pharmacy-print";

/** All leaflets: the pharmacy's name and phone once, a picker, and the chosen leaflet; printing shows that leaflet alone. */
export function LeafletBoard({ leaflets, locale, refsLabel }: { leaflets: Leaflet[]; locale: Locale; refsLabel: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [current, setCurrent] = useState(leaflets[0].key);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from this device's storage
      if (saved.name) setName(saved.name);
      if (saved.phone) setPhone(saved.phone);
    } catch {}
    const hash = window.location.hash.slice(1);
    if (leaflets.some((l) => l.key === hash)) setCurrent(hash);
  }, [leaflets]);
  const l = leaflets.find((x) => x.key === current) ?? leaflets[0];
  const save = (next: { name: string; phone: string }) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };
  return (
    <div className="space-y-5">
      <style>{`@media print {
  @page { size: A4; margin: 14mm; }
  html, body, main { min-height: 0 !important; height: auto !important; display: block !important; background: #fff !important; }
  body > *:not(main), .no-print { display: none !important; }
  .print-shell, .print-shell *:has(#leaflet) { padding: 0 !important; margin: 0 !important; max-width: none !important; background: none !important; }
  #leaflet { border: 0 !important; box-shadow: none !important; padding: 0 !important; font-size: 11pt; line-height: 1.75 !important; }
  #leaflet * { line-height: inherit; }
}`}</style>
      <div className="no-print grid gap-3 rounded-card border border-line bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block text-xs font-medium text-muted">
          {t.pharmacyName[locale]}
          <input
            className="field-input mt-1"
            value={name}
            maxLength={60}
            onChange={(e) => {
              setName(e.target.value);
              save({ name: e.target.value, phone });
            }}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          {t.pharmacyPhone[locale]}
          <input
            className="field-input mt-1"
            dir="ltr"
            value={phone}
            maxLength={30}
            onChange={(e) => {
              setPhone(e.target.value);
              save({ name, phone: e.target.value });
            }}
          />
        </label>
        <button type="button" onClick={() => window.print()} className="rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800">
          {t.print[locale]}
        </button>
        <p className="text-xs text-muted sm:col-span-3">{t.pharmacyHint[locale]}</p>
      </div>

      <nav aria-label={t.list[locale]} className="no-print flex flex-wrap gap-2">
        {leaflets.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => {
              setCurrent(x.key);
              history.replaceState(null, "", `#${x.key}`);
            }}
            aria-pressed={x.key === l.key}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${x.key === l.key ? "border-vault-900 bg-vault-900 text-white" : "border-line bg-white text-vault-900 hover:border-molecule-500"}`}
          >
            {x.title[locale]}
          </button>
        ))}
      </nav>

      <article id="leaflet" className="rounded-card border border-line bg-white p-6 leading-8 text-ink sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-molecule-600 pb-3">
          <h2 className="text-xl font-bold text-vault-900">{l.title[locale]}</h2>
          {name && <p className="text-sm font-bold text-molecule-700">{name}</p>}
        </header>
        <p className="mt-3 rounded-lg border border-capsule-500/40 bg-capsule-400/10 px-3 py-1.5 text-sm font-semibold text-vault-900">{t.notice[locale]}</p>
        <p className="mt-4">{l.intro[locale]}</p>
        {l.before && (
          <div className="mt-4 rounded-lg bg-capsule-400/10 px-4 py-2">
            <p className="font-bold text-vault-900">{l.before.title[locale]}</p>
            <p>{l.before.text[locale]}</p>
          </div>
        )}
        <h3 className="mt-5 font-bold text-vault-900">{l.stepsTitle[locale]}</h3>
        <ol className="mt-2 space-y-1.5">
          {l.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-molecule-600 text-xs font-bold text-white">{i + 1}</span>
              <span>{s[locale]}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-5 list-disc space-y-1.5 ps-5">
          {l.after.map((s, i) => (
            <li key={i}>{s[locale]}</li>
          ))}
        </ul>
        {l.warn.map((s, i) => (
          <p key={i} className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-800">
            {s[locale]}
          </p>
        ))}
        <footer className="mt-6 border-t border-line pt-3 text-sm">
          {(name || phone) && (
            <p className="font-semibold text-vault-900">
              {t.questions[locale]} {name} {phone && <bdi dir="ltr">{phone}</bdi>}
            </p>
          )}
          <p className="text-xs text-muted">{t.notice[locale]}</p>
        </footer>
      </article>
      <RefLinks refs={l.refs} label={refsLabel} />
    </div>
  );
}

function RefLinks({ refs, label }: { refs: Ref[]; label: string }) {
  return (
    <p className="no-print flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
      <span className="font-bold text-vault-900">{label}:</span>
      {refs.map((r) =>
        r.url ? (
          <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5 text-molecule-700 hover:underline">
            {r.label} ↗
          </a>
        ) : (
          <bdi key={r.label} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
            {r.label}
          </bdi>
        ),
      )}
    </p>
  );
}
