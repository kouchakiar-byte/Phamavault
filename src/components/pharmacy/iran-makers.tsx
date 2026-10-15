"use client";

import { useEffect, useRef, useState } from "react";
import { orangeBook as t } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import type { IranDrugResult, IranGeneric } from "@/lib/iran-drugs";

const n = (x: number, locale: Locale) => x.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

/** US (USAN) names that Iran lists under the international (INN) name. */
const INN: Record<string, string> = {
  GLYBURIDE: "GLIBENCLAMIDE",
  ACETAMINOPHEN: "PARACETAMOL",
  ALBUTEROL: "SALBUTAMOL",
  EPINEPHRINE: "ADRENALINE",
  NOREPINEPHRINE: "NORADRENALINE",
  LIDOCAINE: "LIDOCAINE",
  MEPERIDINE: "PETHIDINE",
  CYCLOSPORINE: "CICLOSPORIN",
  RIFAMPIN: "RIFAMPICIN",
  FUROSEMIDE: "FUROSEMIDE",
  ISOPROTERENOL: "ISOPRENALINE",
  PHENYTOIN: "PHENYTOIN",
  BUDESONIDE: "BUDESONIDE",
};

/** Words that name a salt, form, route or unit rather than the active moiety. */
const NOT_MOIETY = new Set(
  (
    "AND WITH OF FOR PER EQ BASE HCL HYDROCHLORIDE DIHYDROCHLORIDE HYDROBROMIDE SODIUM POTASSIUM CALCIUM MAGNESIUM ZINC " +
    "SULFATE SULPHATE MALEATE ACETATE CITRATE TARTRATE BITARTRATE BESYLATE BESILATE MESYLATE MESILATE FUMARATE SUCCINATE " +
    "PHOSPHATE BROMIDE CHLORIDE NITRATE LACTATE GLUCONATE HYCLATE HYDRATE MONOHYDRATE DIHYDRATE TRIHYDRATE ANHYDROUS " +
    "TABLET TABLETS CAPSULE CAPSULES ORAL INJECTION INJECTABLE SOLUTION SUSPENSION SYRUP DROP DROPS CREAM OINTMENT GEL " +
    "LOTION SPRAY NASAL OPHTHALMIC OTIC TOPICAL RECTAL VAGINAL SUPPOSITORY FILM COATED EXTENDED DELAYED SUSTAINED " +
    "MODIFIED RELEASE CHEWABLE DISPERSIBLE EFFERVESCENT ORALLY DISINTEGRATING POWDER RECONSTITUTION INTRAVENOUS " +
    "INTRAMUSCULAR SUBCUTANEOUS IV IM SC VIAL AMPOULE PREFILLED SYRINGE PEN INHALATION AEROSOL ELIXIR EMULSION " +
    "MG G MCG ML IU UNIT UNITS KG L"
  ).split(" "),
);

/** Active moieties of a name: "GLYBURIDE; METFORMIN HYDROCHLORIDE" → {GLIBENCLAMIDE, METFORMIN}. */
function moieties(name: string): Set<string> {
  return new Set(
    name
      .toUpperCase()
      .split(/[^A-Z]+/)
      .filter((w) => w.length > 2 && !NOT_MOIETY.has(w))
      .map((w) => INN[w] ?? w),
  );
}

const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));

/** One request per term for all the cards of a search (e.g. every metformin combination). */
const requests = new Map<string, Promise<IranDrugResult | "locked">>();
const lookup = (term: string) => {
  let p = requests.get(term);
  if (!p) {
    p = fetch(`/api/iran-drugs?q=${encodeURIComponent(term)}`).then(
      (res): Promise<IranDrugResult | "locked"> => (res.status === 403 ? Promise.resolve("locked") : res.json()),
    );
    p.catch(() => requests.delete(term));
    requests.set(term, p);
  }
  return p;
};

/**
 * The Iranian licensed products of an Orange Book ingredient, read from the
 * Iran FDA register when the card scrolls into view. Products match when they
 * have exactly the same active moieties (salts and dosage words aside).
 */
export function IranMakers({ locale, ingredient }: { locale: Locale; ingredient: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"waiting" | "loading" | "done" | "failed" | "locked">("waiting");
  const [generics, setGenerics] = useState<IranGeneric[]>([]);
  const wanted = moieties(ingredient);
  const term = [...wanted][0] ?? ingredient;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setState("loading");
      lookup(term)
        .then((r) => {
          if (r === "locked") return setState("locked");
          if (r.status === "unavailable" || r.status === "unreadable") return setState("failed");
          const target = moieties(ingredient);
          setGenerics(r.generics.filter((g) => sameSet(moieties(g.titleEn.split("(")[0]), target)));
          setState("done");
        })
        .catch(() => setState("failed"));
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [term, ingredient]);

  return (
    <div ref={box} className="mt-1">
      {(state === "waiting" || state === "loading") && <p className="text-sm text-muted">{t.iranLoading[locale]}</p>}
      {state === "failed" && <p className="text-sm text-muted">{t.iranFailed[locale]}</p>}
      {state === "locked" && <p className="text-sm text-muted">{t.iranLocked[locale]}</p>}
      {state === "done" && generics.length === 0 && <p className="text-sm text-muted">{t.iranNone[locale]}</p>}
      {state === "done" &&
        generics.map((g) => (
          <div key={g.genericCode + g.titleEn} className="mt-2 overflow-x-auto rounded-xl border border-line">
            <p className="border-b border-line bg-vault-50 px-3 py-2 text-sm font-semibold text-vault-900">
              {g.titleFa || g.titleEn}
              <span className="ms-2 text-xs font-normal text-muted">{t.iranCount[locale].replace("{n}", n(g.products.length, locale))}</span>
            </p>
            <table className="db">
              <thead>
                <tr>
                  <th>{t.iranCols.company[locale]}</th>
                  <th>{t.iranCols.pack[locale]}</th>
                  <th>{t.iranCols.price[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {g.products.map((p) => (
                  <tr key={p.productCode || p.brandOwner + p.pack}>
                    <td className="font-medium text-vault-900">{p.brandOwner}</td>
                    <td dir="ltr" className="text-xs" style={{ textAlign: "start" }}>
                      {p.pack}
                    </td>
                    <td className="whitespace-nowrap">
                      {p.priceRial !== null ? `${n(Math.round(p.priceRial / 10), locale)} ${t.toman[locale]}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      {state === "done" && <p className="mt-1.5 text-[0.7rem] text-muted">{t.iranSource[locale]}</p>}
    </div>
  );
}
