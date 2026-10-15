/*
 * Active moieties of a medicine name, for matching products across the FDA
 * Orange Book (US names) and the Iran FDA register (international names):
 * salts, dosage forms, routes and units are ignored. Safe for the browser.
 */

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
export function moieties(name: string): Set<string> {
  const all = name.toUpperCase().split(/[^A-Z]+/).filter((w) => w.length > 2);
  const found = all.filter((w) => !NOT_MOIETY.has(w)).map((w) => INN[w] ?? w);
  // A medicine that is itself a salt (zinc sulfate, potassium chloride) keeps its salt words.
  return new Set(found.length ? found : all);
}

export const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));

/** A stable key for a set of moieties: "LINAGLIPTIN+METFORMIN". */
export const moietyKey = (set: Set<string>) => [...set].sort().join("+");

/** "LINAGLIPTIN+METFORMIN" → "Linagliptin + Metformin". */
export const moietyLabel = (key: string) =>
  key
    .split("+")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" + ");
