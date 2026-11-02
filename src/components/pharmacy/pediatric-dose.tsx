"use client";

import { useState } from "react";
import { pedDoseCopy as t, pedDrugs } from "@/content/pharmacy-tools";
import type { Locale } from "@/i18n/config";

const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString("en-US");
const downHalf = (ml: number) => Math.floor(ml * 2) / 2;

export function PediatricDose({ locale }: { locale: Locale }) {
  const [key, setKey] = useState<(typeof pedDrugs)[number]["key"]>("paracetamol");
  const drug = pedDrugs.find((d) => d.key === key)!;
  const [formIdx, setFormIdx] = useState(0);
  const [customMg, setCustomMg] = useState("");
  const [customMl, setCustomMl] = useState("5");
  const [kg, setKg] = useState("");
  const [months, setMonths] = useState("");

  const w = Number(kg);
  const m = Number(months);
  const ready = kg !== "" && months !== "" && w > 0 && m >= 0;
  const tooYoung = ready && (m < drug.minMonths || w < drug.minKg);
  const form = formIdx < drug.forms.length ? drug.forms[formIdx] : { mg: Number(customMg), ml: Number(customMl) };
  const conc = form.mg > 0 && form.ml > 0 ? form.mg / form.ml : 0;

  const lo = Math.min(drug.perDose[0] * w, drug.maxPerDoseMg);
  const hi = Math.min(drug.perDose[1] * w, drug.maxPerDoseMg);
  const day = Math.min(drug.maxPerKgDay * w, drug.maxPerDoseMg * drug.maxDoses);
  const label = "block text-xs font-medium text-muted";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-card border border-line bg-white p-5 sm:grid-cols-2">
        <label className={label}>
          {t.drug[locale]}
          <select
            className="field-input mt-1"
            value={key}
            onChange={(e) => {
              setKey(e.target.value as typeof key);
              setFormIdx(0);
            }}
          >
            {pedDrugs.map((d) => (
              <option key={d.key} value={d.key}>
                {d.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          {t.form[locale]}
          <select className="field-input mt-1" value={formIdx} onChange={(e) => setFormIdx(Number(e.target.value))}>
            {drug.forms.map((f, i) => (
              <option key={i} value={i}>
                {f.label[locale]}
              </option>
            ))}
            <option value={drug.forms.length}>{t.custom[locale]}</option>
          </select>
        </label>
        {formIdx === drug.forms.length && (
          <div className="flex items-end gap-2 sm:col-span-2">
            <input className="field-input w-28" type="number" min={1} dir="ltr" value={customMg} onChange={(e) => setCustomMg(e.target.value)} aria-label="mg" />
            <span className="pb-2 text-sm text-muted">{t.customMg[locale]}</span>
            <input className="field-input w-24" type="number" min={0.1} step={0.1} dir="ltr" value={customMl} onChange={(e) => setCustomMl(e.target.value)} aria-label="mL" />
            <span className="pb-2 text-sm text-muted">{t.customMl[locale]}</span>
          </div>
        )}
        <label className={label}>
          {t.weight[locale]}
          <input className="field-input mt-1" type="number" min={1} max={80} step={0.1} dir="ltr" value={kg} onChange={(e) => setKg(e.target.value)} />
        </label>
        <label className={label}>
          {t.age[locale]}
          <input className="field-input mt-1" type="number" min={0} max={216} dir="ltr" value={months} onChange={(e) => setMonths(e.target.value)} />
        </label>
      </div>

      <div className="rounded-card border border-molecule-500/40 bg-molecule-50/60 p-5">
        {!ready ? (
          <p className="text-muted">{t.enter[locale]}</p>
        ) : tooYoung ? (
          <p className="font-semibold text-red-700">
            {t.tooYoung[locale].replace("{m}", String(drug.minMonths)).replace("{kg}", String(drug.minKg))}
          </p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted">{t.dose[locale]}</dt>
              <dd className="text-2xl font-bold text-vault-900">
                {conc ? (
                  <>
                    <span dir="ltr">{fmt(downHalf(hi / conc))} mL</span>
                  </>
                ) : (
                  "—"
                )}
              </dd>
              <dd className="text-sm text-ink" dir="ltr">
                ≈ {fmt(conc ? downHalf(hi / conc) * conc : hi)} mg
              </dd>
              <dd className="text-xs text-muted">
                {t.range[locale]}: <span dir="ltr">{fmt(lo)}–{fmt(hi)} mg</span>
                {conc ? (
                  <>
                    {" "}
                    (<span dir="ltr">{fmt(downHalf(lo / conc))}–{fmt(downHalf(hi / conc))} mL</span>)
                  </>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t.every[locale]}</dt>
              <dd className="text-lg font-bold text-vault-900">{drug.interval[locale]}</dd>
              <dd className="text-sm text-ink">
                {t.max24[locale]} {drug.maxDoses} {t.doses[locale]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{t.dayMax[locale]}</dt>
              <dd className="text-lg font-bold text-vault-900" dir="ltr">
                {fmt(day)} mg
              </dd>
              <dd className="text-xs text-muted" dir="ltr">
                ({drug.maxPerKgDay} mg/kg/24 h)
              </dd>
            </div>
          </dl>
        )}
        <p className="mt-4 text-xs text-muted">{t.rounding[locale]}</p>
      </div>

      <ul className="list-disc space-y-1 ps-5 text-sm leading-7 text-ink">
        {drug.cautions.map((c, i) => (
          <li key={i}>{c[locale]}</li>
        ))}
      </ul>
      <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">{t.disclaimer[locale]}</p>
    </div>
  );
}
