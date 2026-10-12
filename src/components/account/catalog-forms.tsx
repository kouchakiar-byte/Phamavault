"use client";

import { useActionState, useState } from "react";
import { hideRecord, saveMaterial, saveSupplier, type CatalogState } from "@/app/[lang]/admin/catalog/actions";
import { account } from "@/content/account";
import { pages } from "@/content/pages";
import type { RawMaterial } from "@/data";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import type { SupplierRecord } from "@/lib/supplier-search";

const t = account.admin.catalog;
const label = "block text-xs font-medium text-muted";

function Result({ state, locale }: { state: CatalogState; locale: Locale }) {
  if (state.error) return <p className="text-sm text-red-700">{t.invalid[locale]}</p>;
  if (state.ok) return <p className="text-sm text-molecule-700">{t.queued[locale]}</p>;
  return null;
}

function Input({ name, title, value, dir, required }: { name: string; title: string; value?: string; dir?: "ltr"; required?: boolean }) {
  return (
    <div>
      <label className={label} htmlFor={`cat-${name}`}>
        {title}
        {required && " *"}
      </label>
      <input id={`cat-${name}`} name={name} defaultValue={value} dir={dir} required={required} className="field-input mt-1" />
    </div>
  );
}

/** Queues removal of the picked record. */
function Hide({ kind, recordKey, locale }: { kind: "supplier" | "material"; recordKey: string; locale: Locale }) {
  return (
    <form action={hideRecord}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="key" value={recordKey} />
      <button type="submit" className="rounded-full px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
        {t.hide[locale]}
      </button>
    </form>
  );
}

function Submit({ pending, locale }: { pending: boolean; locale: Locale }) {
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-molecule-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-molecule-700 disabled:opacity-60">
      {t.queue[locale]}
    </button>
  );
}

export function SupplierEditor({ locale, companies, provinces }: { locale: Locale; companies: SupplierRecord[]; provinces: string[] }) {
  const [state, action, pending] = useActionState(saveSupplier, {});
  const [picked, setPicked] = useState("");
  const s = companies.find((c) => c.n === picked);
  const categories = Object.entries(pages.suppliers.categories).filter(([k]) => k !== "all");
  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <label className={label} htmlFor="cat-pick">{t.pick[locale]}</label>
        <select id="cat-pick" className="field-input mt-1" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="">{t.new[locale]}</option>
          {companies
            .map((c) => c.n)
            .sort((a, b) => a.localeCompare(b, "fa"))
            .map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
        </select>
      </div>
      {/* Remounted per pick so the fields show the chosen record */}
      <form key={picked} action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input name="n" title={t.faName[locale]} value={s?.n} required />
        <Input name="e" title={t.enName[locale]} value={s?.e} dir="ltr" />
        <div>
          <label className={label} htmlFor="cat-t">{t.type[locale]}</label>
          <select id="cat-t" name="t" defaultValue={s?.t ?? "m"} className="field-input mt-1">
            <option value="m">{t.maker[locale]}</option>
            <option value="t">{t.trader[locale]}</option>
          </select>
        </div>
        <fieldset className="sm:col-span-2 lg:col-span-3">
          <legend className={label}>{t.categories[locale]} *</legend>
          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
            {categories.map(([k, v]: [string, Bi]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="c" value={k} defaultChecked={s?.c.includes(k)} className="accent-molecule-600" />
                {v[locale]}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className={label} htmlFor="cat-prov">{t.province[locale]}</label>
          <input id="cat-prov" name="prov" list="cat-provinces" defaultValue={s?.prov} className="field-input mt-1" />
          <datalist id="cat-provinces">
            {provinces.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <Input name="city" title={t.city[locale]} value={s?.city} />
        <Input name="tel" title={t.phones[locale]} value={s?.tel.join("، ")} dir="ltr" />
        <Input name="mail" title={t.email[locale]} value={s?.mail} dir="ltr" />
        <Input name="web" title={t.website[locale]} value={s?.web} dir="ltr" />
        <Input name="src" title={t.source[locale]} value={s?.src} dir="ltr" />
        <div className="sm:col-span-2 lg:col-span-3">
          <Input name="note" title={t.note[locale]} value={s?.note} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={label} htmlFor="cat-p">{t.products[locale]}</label>
          <textarea
            id="cat-p"
            name="p"
            rows={8}
            defaultValue={s?.p.map((x) => x.split("|").slice(0, 2).join(" | ")).join("\n")}
            className="field-input mt-1 font-mono text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Submit pending={pending} locale={locale} />
          <Result state={state} locale={locale} />
        </div>
      </form>
      {s && <Hide kind="supplier" recordKey={s.n} locale={locale} />}
    </div>
  );
}

export function MaterialEditor({
  locale,
  materials,
  groups,
}: {
  locale: Locale;
  materials: RawMaterial[];
  groups: Record<string, Bi>;
}) {
  const [state, action, pending] = useActionState(saveMaterial, {});
  const [picked, setPicked] = useState("");
  const m = materials.find((x) => x.name === picked);
  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <label className={label} htmlFor="mat-pick">{t.pick[locale]}</label>
        <select id="mat-pick" className="field-input mt-1" value={picked} onChange={(e) => setPicked(e.target.value)}>
          <option value="">{t.new[locale]}</option>
          {materials.map((x) => (
            <option key={x.name} value={x.name}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
      <form key={picked} action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input name="name" title={t.name[locale]} value={m?.name} dir="ltr" required />
        <Input name="cas" title={t.cas[locale]} value={m?.cas} dir="ltr" />
        <div>
          <label className={label} htmlFor="mat-group">{t.group[locale]} *</label>
          <select id="mat-group" name="group" defaultValue={m?.group ?? "api"} className="field-input mt-1">
            {Object.entries(groups).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </div>
        <Input name="formula" title={t.formula[locale]} value={m?.formula} dir="ltr" />
        <Input name="mw" title={t.mw[locale]} value={m?.mw} dir="ltr" />
        <Input name="noteEn" title={t.noteEn[locale]} value={m?.note.en} dir="ltr" />
        <Input name="noteFa" title={t.noteFa[locale]} value={m?.note.fa} />
        <div className="sm:col-span-2 lg:col-span-3">
          <Input name="synonyms" title={t.synonyms[locale]} value={m?.synonyms} />
        </div>
        <div className="flex items-center gap-4">
          <Submit pending={pending} locale={locale} />
          <Result state={state} locale={locale} />
        </div>
      </form>
      {m && <Hide kind="material" recordKey={m.name} locale={locale} />}
    </div>
  );
}
