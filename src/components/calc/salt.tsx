"use client";

import { useEffect, useMemo, useState } from "react";
import { bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { calculation } from "@/content/calculations";
import { weightOrFormula } from "@/lib/formula";
import { fixed } from "../calc-format";
import { Choice, DASH, NumberInput, Panel, bad, ltr, num, type Ctx } from "./ui";

/*
 * Salt ↔ base conversion. The table of salts comes from the FDA Orange Book
 * ingredient names, each checked against PubChem (see tools/salt-forms/).
 * It is loaded only when this calculator is opened.
 */

export type SaltRow = {
  /** Orange Book ingredient name in title case, e.g. "Tofacitinib Citrate". */
  en: string;
  /** Active moiety (free base or free acid), e.g. "Tofacitinib". */
  base: string;
  /** Persian name of the active moiety, when the site knows it. */
  fa?: string;
  /** Molecules of the active moiety per formula unit of the salt. */
  n: number;
  /** Counter-ions per formula unit, e.g. "HCl", "Ca", "2 HCl". */
  ct: string;
  /** Water of crystallisation per formula unit, as named. */
  w: number;
  f: string;
  fb: string;
  ms: number;
  mb: number;
  /** Salt factor: g of salt per g of the active moiety. */
  sf: number;
  cid: number;
  bcid: number;
  /** The hydrate PubChem lists under the same name, when the name gives no water. */
  h?: { w: number; f: string; ms: number; sf: number };
};

let cache: SaltRow[] | null = null;
function useSalts(): SaltRow[] | null {
  const [rows, setRows] = useState<SaltRow[] | null>(cache);
  useEffect(() => {
    if (cache) return;
    let live = true;
    import("@/data/salt-forms.json").then((m) => {
      cache = (m.default as { rows: SaltRow[] }).rows;
      if (live) setRows(cache);
    });
    return () => {
      live = false;
    };
  }, []);
  return rows;
}

/** Lower case, Persian letters folded, USAN and INN salt spellings made equal. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‌‎‏]/g, " ")
    .replace(/besilate/g, "besylate")
    .replace(/mesilate/g, "mesylate")
    .replace(/tosilate/g, "tosylate")
    .replace(/esilate/g, "esylate")
    .replace(/sulphate/g, "sulfate")
    .replace(/\s+/g, " ")
    .trim();

function search(rows: SaltRow[], q: string, limit = 8): number[] {
  const f = fold(q);
  if (!f) return [];
  const words = f.split(" ");
  const scored: [number, number][] = [];
  rows.forEach((r, i) => {
    const hay = fold(`${r.en} ${r.fa ?? ""}`);
    if (!words.every((w) => hay.includes(w))) return;
    const score = hay.startsWith(f) ? 0 : fold(r.fa ?? "").startsWith(f) ? 0 : hay.includes(` ${words[0]}`) ? 1 : 2;
    scored.push([score * 10000 + r.en.length, i]);
  });
  return scored.sort((a, b) => a[0] - b[0]).slice(0, limit).map(([, i]) => i);
}

const directions = [
  { value: "b2s", label: bi("Active moiety → salt to weigh", "مقدار Base ← مقدار نمک برای توزین") },
  { value: "s2b", label: bi("Salt weighed → active moiety", "مقدار نمک ← معادل Base") },
];
const bases = [
  { value: "asis", label: bi("As-is basis", "بر پایه as is") },
  { value: "dried", label: bi("Dried or anhydrous basis", "بر پایه ماده خشک یا بدون آب") },
];

const pubchem = (cid: number) => `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;

export function Salt({ ctx }: { ctx: Ctx }) {
  const { v, set, locale } = ctx;
  const rows = useSalts();
  const custom = v["sl-id"] === "custom";
  const row = !custom && rows ? rows.find((r) => r.en === v["sl-id"]) : undefined;
  const [query, setQuery] = useState("");
  const hits = useMemo(() => (rows && query ? search(rows, query) : []), [rows, query]);

  // Water of crystallisation per formula unit: the table gives the named form; any hydrate can be entered.
  const hw = custom ? 0 : num(v["sl-hw"]);
  const ms = custom ? weightOrFormula(v["sl-cms"]) : row ? row.ms + (hw - row.w) * WATER : NaN;
  const mb = custom ? weightOrFormula(v["sl-cmb"]) : (row?.mb ?? NaN);
  const n = custom ? num(v["sl-cn"]) : (row?.n ?? NaN);
  const toSalt = v["sl-dir"] !== "s2b";
  const dried = v["sl-basis"] === "dried";
  const amt = num(v["sl-amt"]), assay = num(v["sl-assay"]), lod = num(v["sl-lod"]), ov = num(v["sl-ov"]);
  const ok =
    ms > 0 && mb > 0 && n > 0 && Number.isInteger(n) && hw >= 0 && hw <= 20 && amt >= 0 && assay > 0 && assay <= 110 &&
    (!dried || (lod >= 0 && lod < 100)) && (!toSalt || ov >= 0);
  const sf = ms / (n * mb);
  const fAssay = 100 / assay;
  const fWater = dried ? 100 / (100 - lod) : 1;
  const pure = toSalt ? amt * sf : amt / sf;
  const result = toSalt ? amt * sf * fAssay * fWater * (1 + ov / 100) : (amt * (assay / 100)) / fWater / sf;

  const pick = (key: string) => {
    set("sl-id", key);
    set("sl-hw", String(rows?.find((r) => r.en === key)?.w ?? 0));
    setQuery("");
  };

  const unit = "mg";
  return (
    <Panel
      ctx={ctx}
      title={calculation("salt").title}
      form={
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sl-q" className="text-sm text-muted">
              {bi("Search a salt (English or Persian name)", "جست‌وجوی نمک (نام انگلیسی یا فارسی)")[locale]}
            </label>
            <input
              id="sl-q"
              type="search"
              autoComplete="off"
              className="field-input"
              placeholder={rows ? bi("e.g. tofacitinib citrate", "مثلاً tofacitinib citrate")[locale] : "…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {hits.length > 0 && (
              <ul className="max-h-72 overflow-auto rounded-xl border border-line bg-white text-sm shadow-sm" role="listbox">
                {hits.map((i) => {
                  const r = rows![i];
                  return (
                    <li key={r.en}>
                      <button
                        type="button"
                        className="flex w-full flex-wrap items-baseline justify-between gap-2 px-3 py-2 text-start hover:bg-molecule-50"
                        onClick={() => pick(r.en)}
                      >
                        <bdi dir="ltr" className="font-semibold text-vault-900">{r.en}</bdi>
                        <span className="text-xs text-muted">
                          {r.fa && <span className="me-2">{r.fa}</span>}
                          <bdi dir="ltr" className="font-mono">SF {r.sf.toFixed(4)}</bdi>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {rows && query && hits.length === 0 && (
              <p className="text-xs text-warn">
                {bi("Not in the table; use “custom salt” below.", "در جدول نیست؛ از گزینه «نمک دلخواه» استفاده کنید.")[locale]}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">{bi("Selected:", "انتخاب‌شده:")[locale]}</span>
            {custom ? (
              <b className="text-vault-900">{bi("Custom salt", "نمک دلخواه")[locale]}</b>
            ) : row ? (
              <bdi dir="ltr" className="font-bold text-vault-900">{row.en}</bdi>
            ) : (
              <span>{DASH}</span>
            )}
            <button
              type="button"
              onClick={() => set("sl-id", custom ? (rows?.[0]?.en ?? "") : "custom")}
              className="ms-auto rounded-full border border-line px-3 py-1 text-xs font-semibold text-molecule-700 hover:border-molecule-500"
            >
              {custom ? bi("Back to the table", "بازگشت به جدول")[locale] : bi("Custom salt", "نمک دلخواه")[locale]}
            </button>
          </div>

          {row && (
            <div className="flex flex-col gap-1.5">
              <NumberInput ctx={ctx} id="sl-hw" label={bi("Water of crystallisation (H2O per formula unit; 0 = anhydrous)", "آب تبلور (تعداد H2O در هر واحد فرمولی؛ صفر یعنی بدون آب)")} />
              {row.h && (
                <p className="text-xs text-muted">
                  {bi("PubChem also lists this salt as a hydrate with", "PubChem این نمک را به صورت هیدرات هم ثبت کرده است با")[locale]}{" "}
                  <bdi dir="ltr" className="font-mono">{`${row.h.w} H2O`}</bdi>
                  {bi(" per formula unit.", " در هر واحد فرمولی.")[locale]}
                </p>
              )}
            </div>
          )}
          {custom && (
            <>
              <TextInput ctx={ctx} id="sl-cms" label={bi("Salt: molecular formula or MW (g/mol)", "نمک: فرمول مولکولی یا وزن مولکولی (g/mol)")} placeholder="C22H28N6O8" />
              <TextInput ctx={ctx} id="sl-cmb" label={bi("Active moiety: molecular formula or MW (g/mol)", "Base: فرمول مولکولی یا وزن مولکولی (g/mol)")} placeholder="C16H20N6O" />
              <NumberInput ctx={ctx} id="sl-cn" label={bi("Molecules of active moiety per salt formula unit (n)", "تعداد مولکول Base در هر واحد فرمولی نمک (n)")} />
            </>
          )}

          <Choice ctx={ctx} id="sl-dir" label={bi("Direction", "جهت محاسبه")} options={directions} />
          <NumberInput
            ctx={ctx}
            id="sl-amt"
            label={toSalt ? bi("Amount of active moiety (mg)", "مقدار Base مورد نیاز (mg)") : bi("Amount of salt weighed (mg)", "مقدار نمک توزین‌شده (mg)")}
          />
          <NumberInput ctx={ctx} id="sl-assay" label={bi("Assay of the salt on the CoA (%)", "Assay نمک در برگه آنالیز (%)")} />
          <Choice ctx={ctx} id="sl-basis" label={bi("Basis of the assay", "مبنای گزارش Assay")} options={bases} />
          {dried && <NumberInput ctx={ctx} id="sl-lod" label={bi("LOD or water (KF) on the CoA (%)", "LOD یا آب (KF) در برگه آنالیز (%)")} />}
          {toSalt && <NumberInput ctx={ctx} id="sl-ov" label={bi("Overage (%)", "Overage (%)")} />}
        </>
      }
      results={[
        { label: bi("MW of the salt (g/mol)", "وزن مولکولی نمک (g/mol)"), value: ms > 0 ? fixed(ms, 3) : DASH },
        { label: bi("MW of the active moiety (g/mol)", "وزن مولکولی Base (g/mol)"), value: mb > 0 ? fixed(mb, 3) : DASH },
        { label: bi("Active moiety per formula unit (n)", "تعداد Base در هر واحد فرمولی (n)"), value: n > 0 ? String(n) : DASH },
        { label: bi("Salt factor SF = MW salt ÷ (n × MW base)", `ضریب نمک ${ltr("SF = MW salt ÷ (n × MW base)")}`), value: ok ? fixed(sf, 4) : DASH },
        { label: bi("Base content of the pure salt (%)", "درصد Base در نمک خالص (%)"), value: ok ? `${fixed(100 / sf, 2)}%` : DASH },
        {
          label: toSalt ? bi("Salt at 100% purity", "مقدار نمک با خلوص 100%") : bi("Active moiety if the salt were 100% pure", "معادل Base با فرض خلوص 100%"),
          value: ok ? `${fixed(pure, 3)} ${unit}` : DASH,
        },
        { label: bi("Assay factor (100 ÷ Assay)", `ضریب Assay ${ltr("(100 ÷ Assay)")}`), value: ok ? fixed(fAssay, 4) : DASH },
        { label: bi("Water/LOD factor [100 ÷ (100 − LOD)]", `ضریب رطوبت ${ltr("[100 ÷ (100 − LOD)]")}`), value: ok ? fixed(fWater, 4) : DASH, hidden: !dried },
        {
          label: toSalt ? bi("Salt to weigh", "مقدار نمک برای توزین") : bi("Active moiety delivered", "معادل Base"),
          value: ok ? `${fixed(result, 3)} ${unit}` : DASH,
        },
      ]}
      message={ok ? "" : rows || custom ? bad(ctx) : bi("Loading the salt table…", "در حال بارگذاری جدول نمک‌ها…")[locale]}
      note={bi(
        "Salt to weigh = m_base × SF × (100 ÷ Assay) × [100 ÷ (100 − LOD)] × (1 + Overage ÷ 100), with SF = MW salt ÷ (n × MW base). Use the water/LOD factor only when the certificate gives the assay on the dried or anhydrous basis. For a hydrate, either enter its water of crystallisation with an as-is assay, or leave the water at 0 and use an assay on the anhydrous basis with the water content (KF) from the CoA; pharmacopoeias usually specify hydrates the second way. Never correct for the same water twice. Molecular weights are calculated from the formulas with the IUPAC standard atomic weights (CIAAW 2021); salt names come from the FDA Orange Book and the FDA NDC directory, and every formula and its stoichiometry were checked against PubChem. Always confirm the form against the supplier's CoA and the monograph of the material you use.",
        "مقدار نمک برای توزین برابر است با ⁦m_base × SF × (100 ÷ Assay) × [100 ÷ (100 − LOD)] × (1 + Overage ÷ 100)⁩، که در آن m_base مقدار Base و ⁦SF = MW salt ÷ (n × MW base)⁩ است. ضریب رطوبت فقط وقتی به کار می‌رود که Assay در برگه آنالیز بر پایه ماده خشک یا بدون آب گزارش شده باشد. برای هیدرات‌ها دو راه وجود دارد: آب تبلور را وارد کنید و Assay بر پایه as is را به کار ببرید، یا آب تبلور را صفر بگذارید و Assay بر پایه بدون آب را همراه با مقدار آب (KF) برگه آنالیز وارد کنید؛ فارماکوپه‌ها هیدرات‌ها را معمولاً به روش دوم مشخص می‌کنند. آب را هرگز دو بار اصلاح نکنید. وزن‌های مولکولی از روی فرمول و با وزن‌های اتمی استاندارد IUPAC ⁦(CIAAW 2021)⁩ محاسبه شده‌اند؛ نام نمک‌ها از FDA Orange Book و فهرست NDC سازمان FDA گرفته شده و فرمول و استوکیومتری هر ردیف با PubChem کنترل شده است. فرم نمک را همیشه با برگه آنالیز تأمین‌کننده و مونوگراف ماده مصرفی تطبیق دهید.",
      )}
    >
      {row && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-line px-4 py-3 text-xs text-muted">
          <span>
            {bi("Salt formula:", "فرمول نمک:")[locale]} <bdi dir="ltr" className="font-mono text-vault-900">{saltFormula(row, hw)}</bdi>
          </span>
          <span>
            {bi("Active moiety:", "Base:")[locale]} <bdi dir="ltr" className="font-mono text-vault-900">{row.base} · {row.fb}</bdi>
          </span>
          <span>
            {bi("Per formula unit:", "در هر واحد فرمولی:")[locale]}{" "}
            <bdi dir="ltr" className="font-mono text-vault-900">{unitText(row, hw)}</bdi>
          </span>
          <a href={pubchem(row.cid)} target="_blank" rel="noopener noreferrer" className="text-molecule-700 underline-offset-2 hover:underline">
            PubChem ↗
          </a>
        </p>
      )}
      <SaltTable rows={rows} locale={locale} onPick={pick} />
    </Panel>
  );
}

/** Molar mass of water with the same atomic weights. */
const WATER = 2 * 1.008 + 15.999;

function unitText(r: SaltRow, water: number) {
  return [`${r.n} × ${r.base}`, r.ct, water > 0 ? `${water} H2O` : ""].filter(Boolean).join(" + ");
}

/** The table formula, with the water changed to the amount entered. */
function saltFormula(r: SaltRow, water: number) {
  if (water === r.w) return r.f;
  const anhydrous = r.w ? `${r.f} − ${r.w} H2O` : r.f;
  return water > 0 ? `${anhydrous} + ${water} H2O` : anhydrous;
}

function TextInput({ ctx, id, label, placeholder }: { ctx: Ctx; id: string; label: ReturnType<typeof bi>; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <input id={id} dir="ltr" className="field-input font-mono" placeholder={placeholder} value={ctx.v[id] ?? ""} onChange={(e) => ctx.set(id, e.target.value)} />
    </div>
  );
}

const PAGE = 40;

/** The whole table, searchable, for browsing and checking. */
function SaltTable({ rows, locale, onPick }: { rows: SaltRow[] | null; locale: Locale; onPick: (key: string) => void }) {
  const [filter, setFilter] = useState("");
  const [shown, setShown] = useState(PAGE);
  const list = useMemo(() => {
    if (!rows) return [];
    const f = fold(filter);
    return f ? rows.filter((r) => fold(`${r.en} ${r.fa ?? ""} ${r.f}`).includes(f)) : rows;
  }, [rows, filter]);
  if (!rows) return null;
  return (
    <details className="rounded-xl border border-line">
      <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-vault-900">
        {bi(`All ${rows.length} salts in the table`, `جدول کامل ${rows.length} نمک`)[locale]}
      </summary>
      <div className="flex flex-col gap-3 border-t border-line p-4">
        <input
          type="search"
          className="field-input"
          aria-label={bi("Filter the table", "فیلتر جدول")[locale]}
          placeholder={bi("Filter by name or formula", "فیلتر با نام یا فرمول")[locale]}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setShown(PAGE);
          }}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs" dir="ltr">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-2 pe-3">Salt</th>
                <th className="py-2 pe-3">Formula</th>
                <th className="py-2 pe-3 text-right">MW salt</th>
                <th className="py-2 pe-3 text-right">n</th>
                <th className="py-2 pe-3 text-right">MW base</th>
                <th className="py-2 text-right">SF</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, shown).map((r) => (
                <tr key={r.en} className="border-b border-line/60">
                  <td className="py-1.5 pe-3">
                    <button type="button" className="text-left font-semibold text-molecule-700 hover:underline" onClick={() => onPick(r.en)}>
                      {r.en}
                    </button>
                    {r.fa && <span className="block text-muted" dir="rtl">{r.fa}</span>}
                  </td>
                  <td className="py-1.5 pe-3 font-mono">{r.f}</td>
                  <td className="py-1.5 pe-3 text-right font-mono tabular-nums">{r.ms.toFixed(2)}</td>
                  <td className="py-1.5 pe-3 text-right font-mono tabular-nums">{r.n}</td>
                  <td className="py-1.5 pe-3 text-right font-mono tabular-nums">{r.mb.toFixed(2)}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums">{r.sf.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length > shown && (
          <button type="button" onClick={() => setShown((s) => s + PAGE * 3)} className="self-center rounded-full border border-line px-5 py-2 text-sm font-semibold text-vault-900 hover:border-molecule-500">
            {bi(`Show more (${list.length - shown} left)`, `نمایش بیشتر (${list.length - shown} ردیف دیگر)`)[locale]}
          </button>
        )}
      </div>
    </details>
  );
}

export const saltDefaults = {
  "sl-id": "Tofacitinib Citrate", "sl-hw": "0", "sl-dir": "b2s", "sl-amt": "5", "sl-assay": "99.6", "sl-basis": "asis", "sl-lod": "0.3", "sl-ov": "0",
  "sl-cms": "", "sl-cmb": "", "sl-cn": "1",
};
