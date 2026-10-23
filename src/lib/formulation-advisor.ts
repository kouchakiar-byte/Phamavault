/*
 * Formulation advisor for oral solid dosage forms: from the drug, its dose and
 * the excipients the user chooses, it picks a manufacturing route, a target
 * unit weight and a starting % w/w for every component. Concentration ranges
 * come from the excipient monographs on the site (Pharmaceutical Excipients);
 * the route and weight rules are common formulation practice and are shown to
 * the user as such.
 */

export type DosageForm = "ir" | "fc" | "chew" | "odt" | "cap";
export type Route = "dc" | "wg" | "dg" | "cap";
export type Role = "dil" | "bin" | "dis" | "lub" | "gli" | "wet" | "swe" | "fla" | "col" | "oth";

/** [min, max, default] % w/w of the unit (core) weight. */
export type Range = [number, number, number];

export type CatalogueItem = {
  key: string;
  /** Name as in the excipient database (links to its data sheet). */
  name: string;
  roles: Partial<Record<Role, Range | null>>;
  /** Reducing sugar: Maillard reaction with primary and secondary amines. */
  reducing?: boolean;
  /** Suitable as a direct-compression grade. */
  dc?: boolean;
  hygroscopic?: boolean;
};

export type Flags = {
  poorFlow: boolean;
  moisture: boolean;
  heat: boolean;
  poorlySoluble: boolean;
  amine: boolean;
};

export type Component = { id: string; key?: string; custom?: string; role: Role; pct?: number | null };

export type Input = {
  form: DosageForm;
  strength: number;
  brandWeight?: number | null;
  flags: Flags;
  components: Component[];
  units: number;
  /** Capsule fill (tapped) density, g/mL. */
  density?: number;
};

export type Row = {
  id: string;
  name: string;
  key?: string;
  role: Role | "api";
  pct: number;
  mg: number;
  kg: number;
  range?: [number, number];
  qs?: boolean;
  out?: boolean;
};

export type Note = { code: string; values?: Record<string, string | number> };

export type Result = {
  route: Route;
  reasons: Note[];
  weight: number;
  coreWeight: number;
  coatMg: number;
  apiPct: number;
  rows: Row[];
  warnings: Note[];
  capsule?: { size: string; volume: number; fill: number } | null;
  sum: number;
};

/** Largest drug load (fraction of the unit weight) usually workable for each route. */
const MAX_LOAD: Record<Route, number> = { dc: 0.3, wg: 0.6, dg: 0.5, cap: 0.7 };
const FILM_GAIN = 0.03;

/** Standard hard-capsule body volumes (mL). */
export const CAPSULES: [string, number][] = [
  ["5", 0.13],
  ["4", 0.21],
  ["3", 0.3],
  ["2", 0.37],
  ["1", 0.5],
  ["0", 0.68],
  ["00", 0.95],
  ["000", 1.37],
];

const roundWeight = (w: number) => (w <= 300 ? Math.ceil(w / 5) * 5 : w <= 600 ? Math.ceil(w / 10) * 10 : Math.ceil(w / 25) * 25);
const r2 = (x: number) => Math.round(x * 100) / 100;

export function chooseRoute(input: Input): { route: Route; reasons: Note[] } {
  const { form, strength, brandWeight, flags } = input;
  const reasons: Note[] = [];
  const sensitive = flags.moisture || flags.heat;
  if (form === "cap") {
    reasons.push({ code: "capsule" });
    if (flags.poorFlow) reasons.push({ code: sensitive ? "capPoorFlowSensitive" : "capPoorFlow" });
    return { route: "cap", reasons };
  }
  const load = brandWeight ? strength / brandWeight : 0;
  const dcWeight = strength / MAX_LOAD.dc;
  const highLoad = brandWeight ? load > MAX_LOAD.dc : dcWeight > 800;
  if (brandWeight) reasons.push({ code: "brandLoad", values: { load: r2(load * 100) } });
  else if (highLoad) reasons.push({ code: "highDose", values: { w: Math.round(dcWeight) } });
  if (flags.poorFlow) reasons.push({ code: "poorFlow" });
  if (!highLoad && !flags.poorFlow) {
    reasons.push({ code: form === "odt" ? "odtDc" : "dcOk" });
    return { route: "dc", reasons };
  }
  if (sensitive) {
    reasons.push({ code: "sensitiveDg" });
    return { route: "dg", reasons };
  }
  reasons.push({ code: "wgOk" });
  return { route: "wg", reasons };
}

export function targetWeight(input: Input, route: Route): { weight: number; core: number; coat: number } {
  const { form, strength, brandWeight } = input;
  if (brandWeight && brandWeight > 0) {
    const core = form === "fc" ? brandWeight / (1 + FILM_GAIN) : brandWeight;
    return { weight: brandWeight, core: r2(core), coat: r2(brandWeight - core) };
  }
  const maxLoad = form === "chew" || form === "odt" ? Math.min(MAX_LOAD[route], 0.3) : MAX_LOAD[route];
  const core = roundWeight(Math.max(100, strength / maxLoad));
  const coat = form === "fc" ? r2(core * FILM_GAIN) : 0;
  return { weight: r2(core + coat), core, coat };
}

/** Role defaults that depend on the route (e.g. superdisintegrant levels in an ODT). */
function defaultPct(item: CatalogueItem | undefined, role: Role, form: DosageForm): number | null {
  const range = item?.roles[role];
  if (!range) return null;
  let v = range[2];
  if (form === "odt" && role === "dis") v = range[1];
  return Math.min(Math.max(v, range[0]), range[1]);
}

export function advise(input: Input, catalogue: CatalogueItem[]): Result {
  const byKey = new Map(catalogue.map((c) => [c.key, c]));
  const { route, reasons } = chooseRoute(input);
  const { weight, core, coat } = targetWeight(input, route);
  const warnings: Note[] = [];
  const apiPct = (input.strength / core) * 100;

  const rows: Row[] = [{ id: "api", name: "", role: "api", pct: apiPct, mg: input.strength, kg: 0 }];
  const fixed: Row[] = [];
  const diluents: Row[] = [];
  for (const c of input.components) {
    const item = c.key ? byKey.get(c.key) : undefined;
    const range = item?.roles[c.role] ?? undefined;
    const row: Row = {
      id: c.id,
      name: item?.name ?? c.custom ?? "",
      key: item?.key,
      role: c.role,
      pct: 0,
      mg: 0,
      kg: 0,
      range: range ? [range[0], range[1]] : undefined,
    };
    const manual = c.pct !== undefined && c.pct !== null && !Number.isNaN(c.pct);
    if (c.role === "dil" && !manual) {
      row.qs = true;
      diluents.push(row);
    } else {
      row.pct = manual ? (c.pct as number) : (defaultPct(item, c.role, input.form) ?? 0);
      fixed.push(row);
    }
  }
  const fixedSum = apiPct + fixed.reduce((s, r) => s + r.pct, 0);
  const rest = 100 - fixedSum;
  if (diluents.length) {
    // Two diluents: the first takes two thirds, a common MCC:lactose-type split.
    const shares = diluents.length === 2 ? [2 / 3, 1 / 3] : diluents.map(() => 1 / diluents.length);
    diluents.forEach((d, i) => (d.pct = Math.max(0, rest * shares[i])));
  }
  rows.push(...fixed, ...diluents);
  if (rest < -0.001) warnings.push({ code: "over", values: { sum: r2(fixedSum) } });
  else if (!diluents.length && rest > 0.5) warnings.push({ code: "noDiluent", values: { rest: r2(rest) } });

  for (const r of rows) {
    r.mg = r.role === "api" ? input.strength : (r.pct * core) / 100;
    r.kg = (r.mg * input.units) / 1e6;
    if (r.range && (r.pct < r.range[0] - 1e-9 || r.pct > r.range[1] + 1e-9)) {
      r.out = true;
      warnings.push({ code: "outOfRange", values: { name: r.name, pct: r2(r.pct), min: r.range[0], max: r.range[1] } });
    }
  }

  const roles = new Set(input.components.map((c) => c.role));
  const items = input.components.map((c) => (c.key ? byKey.get(c.key) : undefined)).filter(Boolean) as CatalogueItem[];
  const isTablet = input.form !== "cap";
  if (isTablet && !roles.has("dis")) warnings.push({ code: "needDis" });
  if (!roles.has("lub")) warnings.push({ code: "needLub" });
  if (route === "wg" && !roles.has("bin")) warnings.push({ code: "needBin" });
  if ((input.flags.poorFlow || route === "dc" || route === "cap") && !roles.has("gli")) warnings.push({ code: "needGli" });
  if ((input.form === "odt" || input.form === "chew") && !roles.has("swe")) warnings.push({ code: "needSwe" });
  if (input.flags.poorlySoluble && !roles.has("wet")) warnings.push({ code: "needWet" });
  if (input.flags.amine) for (const i of items) if (i.reducing) warnings.push({ code: "maillard", values: { name: i.name } });
  if (input.flags.moisture) for (const i of items) if (i.hygroscopic) warnings.push({ code: "hygroscopic", values: { name: i.name } });
  if (route === "dc") for (const c of input.components) {
    const i = c.key ? byKey.get(c.key) : undefined;
    if (c.role === "dil" && i && i.dc === false) warnings.push({ code: "notDc", values: { name: i.name } });
  }
  if (input.strength < 25 || apiPct < 25) warnings.push({ code: "cu" });
  if (isTablet && weight > 1000) warnings.push({ code: "big", values: { w: Math.round(weight) } });
  if (input.brandWeight) warnings.push({ code: "sizeRld" });
  if (route === "wg") warnings.push({ code: "splitDis" });

  let capsule: Result["capsule"] = null;
  if (input.form === "cap") {
    const density = input.density && input.density > 0 ? input.density : 0.6;
    const volume = core / 1000 / density;
    const fit = CAPSULES.find(([, v]) => v >= volume);
    capsule = fit ? { size: fit[0], volume: r2(volume), fill: Math.round(fit[1] * density * 1000) } : null;
    if (!fit) warnings.push({ code: "capTooBig", values: { v: r2(volume) } });
  }

  const sum = rows.reduce((s, r) => s + r.pct, 0);
  return { route, reasons, weight, coreWeight: core, coatMg: coat, apiPct: r2(apiPct), rows, warnings, capsule, sum: r2(sum) };
}

/** A typical starting set of excipients for a dosage form and route. */
export function suggestComponents(form: DosageForm, route: Route, flags: Flags): Omit<Component, "id">[] {
  const set: Omit<Component, "id">[] = [];
  if (form === "odt") set.push({ key: "mannitol", role: "dil" }, { key: "mcc", role: "dil" }, { key: "crospovidone", role: "dis" }, { key: "sucralose", role: "swe" }, { key: "silica", role: "gli" }, { key: "ssf", role: "lub" });
  else if (form === "chew") set.push({ key: "mannitol", role: "dil" }, { key: "mcc", role: "dil" }, { key: route === "wg" ? "pvp" : "copovidone", role: "bin" }, { key: "ccs", role: "dis" }, { key: "sucralose", role: "swe" }, { key: "silica", role: "gli" }, { key: "mgst", role: "lub" });
  else if (form === "cap") set.push({ key: "mcc", role: "dil" }, { key: "pgs", role: "dil" }, { key: "silica", role: "gli" }, { key: "mgst", role: "lub" });
  else if (route === "dc") set.push({ key: "mcc", role: "dil" }, { key: "lactose-sd", role: "dil" }, { key: "ccs", role: "dis" }, { key: "silica", role: "gli" }, { key: "mgst", role: "lub" });
  else if (route === "dg") set.push({ key: "mcc", role: "dil" }, { key: "dcp", role: "dil" }, { key: "copovidone", role: "bin" }, { key: "crospovidone", role: "dis" }, { key: "silica", role: "gli" }, { key: "mgst", role: "lub" });
  else set.push({ key: "lactose", role: "dil" }, { key: "mcc", role: "dil" }, { key: "pvp", role: "bin" }, { key: "ccs", role: "dis" }, { key: "silica", role: "gli" }, { key: "mgst", role: "lub" });
  if (flags.poorlySoluble) set.push({ key: "sls", role: "wet" });
  if (flags.amine) for (const c of set) if (c.key === "lactose" || c.key === "lactose-sd") c.key = c.key === "lactose" ? "mcc" : "mannitol";
  // Drop a duplicate created by the swap above.
  return set.filter((c, i) => set.findIndex((d) => d.key === c.key && d.role === c.role) === i);
}
