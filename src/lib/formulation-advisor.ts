/*
 * Formulation advisor for oral solid dosage forms. From the drug, its dose,
 * physicochemical risks and the excipients chosen, it ranks the manufacturing
 * routes, solves the unit weight and a starting % w/w for every component
 * inside the monograph ranges, and derives the batch (dispensing) formula,
 * process parameters, tooling, specifications and a risk assessment.
 *
 * Concentration ranges come from the excipient monographs on the site; route,
 * weight, tooling and process figures are common formulation practice and are
 * presented to the user as such.
 */

export type DosageForm = "ir" | "fc" | "chew" | "odt" | "cap";
export type Route = "dc" | "wg" | "dg";
export type Role = "dil" | "bin" | "dis" | "lub" | "gli" | "wet" | "swe" | "fla" | "col" | "oth";
export type Level = "high" | "medium" | "low";

/** [min, max, suggested start] % w/w of the core weight. */
export type Range = [number, number, number];

export type CatalogueItem = {
  key: string;
  /** Name as in the excipient database (links to its data sheet). */
  name: string;
  /** Display name with the usual abbreviation. */
  label: string;
  roles: Partial<Record<Role, Range | null>>;
  /** Reducing sugar: Maillard reaction with primary and secondary amines. */
  reducing?: boolean;
  /** Not a direct-compression grade. */
  noDc?: boolean;
  hygroscopic?: boolean;
  /** Carries peroxide impurities (oxidation of sensitive drugs). */
  peroxide?: boolean;
  /** Anionic: can bind cationic drugs. */
  anionic?: boolean;
  /** Alkaline or alkaline-earth stearate / phosphate surface. */
  alkaline?: boolean;
  /** Hydrophobic lubricant (dissolution slows with level and blend time). */
  hydrophobic?: boolean;
  /** Holds appreciable free moisture (about 5% or more). */
  wet?: boolean;
  /** Preferred grade by route. */
  grade?: Partial<Record<Route, string>>;
  /** Synonyms used on product labels (lower case). */
  aka?: string[];
};

export type Flags = {
  poorFlow: boolean;
  moisture: boolean;
  heat: boolean;
  poorlySoluble: boolean;
  amine: boolean;
  oxidizable: boolean;
  hydrolysable: boolean;
  acidic: boolean;
  cationic: boolean;
  lowMelting: boolean;
  bitter: boolean;
  hygroscopic: boolean;
};

export const noFlags: Flags = {
  poorFlow: false,
  moisture: false,
  heat: false,
  poorlySoluble: false,
  amine: false,
  oxidizable: false,
  hydrolysable: false,
  acidic: false,
  cationic: false,
  lowMelting: false,
  bitter: false,
  hygroscopic: false,
};

export type Component = { id: string; key?: string; custom?: string; role: Role; pct?: number | null };

export type Input = {
  form: DosageForm;
  /** Label claim, mg per unit. */
  strength: number;
  /** Salt (or hydrate) to label-claim ratio, e.g. 1.387 for amlodipine besilate labelled as base. */
  saltFactor?: number;
  /** Assay of the API batch, % as is (or on the dried basis when water is given). */
  assay?: number;
  /** Water / LOD of the API batch, % (used when the assay is on the dried basis). */
  water?: number;
  /** Manufacturing overage, %. */
  overage?: number;
  brandWeight?: number | null;
  flags: Flags;
  components: Component[];
  units: number;
  /** Capsule fill (tapped) density, g/mL. */
  density?: number;
  /** Film-coat weight gain, %. */
  coatGain?: number;
  /** Forced route; omitted = best ranked. */
  route?: Route | null;
};

export type Note = { code: string; values?: Record<string, string | number> };

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
  manual?: boolean;
  out?: boolean;
  /** Role switched by the solver (e.g. MCC kept as a dry binder). */
  switched?: boolean;
  grade?: string;
};

export type RouteScore = { route: Route; score: number; load: number; weight: number; pros: Note[]; cons: Note[] };

export type Risk = { cqa: string; level: Level; why: Note[] };

export type Finding = Note & { level: Level };

export type Tooling = { shape: "round" | "caplet"; size: string; thickness?: number; force?: [number, number] };

export type Result = {
  route: Route;
  auto: boolean;
  routes: RouteScore[];
  weight: number;
  coreWeight: number;
  coatMg: number;
  apiMg: number;
  apiPct: number;
  rows: Row[];
  sum: number;
  feasible: boolean;
  minWeight?: number;
  adjustments: Note[];
  findings: Finding[];
  risks: Risk[];
  score: number;
  capsule?: { size: string; volume: number; fill: number; alt?: string } | null;
  tooling?: Tooling | null;
  batch: { rows: { id: string; name: string; key?: string; role: Role | "api"; kg: number }[]; total: number; apiFactor: number };
  process: Note[];
  specs: Note[];
};

/** Largest drug load (fraction of the core weight) usually workable for each route. */
export const MAX_LOAD: Record<Route, number> = { dc: 0.35, wg: 0.9, dg: 0.6 };
/** Loads above these are impractical for the route. */
const HARD_LOAD: Record<Route, number> = { dc: 0.45, wg: 0.97, dg: 0.75 };
const CAP_MAX_LOAD = 0.8;
const MIN_WEIGHT = 100;
/** Apparent density of a compact at a solid fraction of about 0.85, g/cm³. */
const COMPACT_DENSITY = 1.2;
/** Target tensile strength for robust tablets, MPa (lower bound / target). */
const TENSILE: [number, number] = [1.0, 2.0];

/** Standard hard-capsule body volumes (mL). */
export const CAPSULES: [string, number][] = [
  ["5", 0.13],
  ["4", 0.21],
  ["3", 0.3],
  ["2", 0.37],
  ["1", 0.5],
  ["0", 0.68],
  ["0el", 0.78],
  ["00", 0.95],
  ["000", 1.37],
];

const r2 = (x: number) => Math.round(x * 100) / 100;
const roundUp = (w: number) => (w <= 300 ? Math.ceil(w / 5) * 5 : w <= 600 ? Math.ceil(w / 10) * 10 : Math.ceil(w / 25) * 25);
const isTablet = (f: DosageForm) => f !== "cap";

/* ------------------------------------------------------------------ */
/* Route ranking                                                        */
/* ------------------------------------------------------------------ */

export function rankRoutes(input: Input): RouteScore[] {
  const { form, flags } = input;
  const api = apiMg(input);
  const cap = form === "cap";
  const lowDose = input.strength < 25;
  const scored = (["dc", "wg", "dg"] as Route[]).map((route) => {
      const pros: Note[] = [];
      const cons: Note[] = [];
      const maxLoad = cap ? (route === "dc" ? 0.7 : CAP_MAX_LOAD) : MAX_LOAD[route];
      const weight = input.brandWeight ? coreOf(input) : Math.max(MIN_WEIGHT, roundUp(api / maxLoad));
      const load = api / weight;
      let score = route === "dc" ? 100 : route === "dg" ? 84 : 80;
      if (route === "dc") {
        pros.push({ code: "dcSimple" });
        if (load > maxLoad) {
          score -= load > HARD_LOAD.dc ? 45 : 25;
          cons.push({ code: "dcLoad", values: { load: Math.round(load * 1000) / 10, max: Math.round(maxLoad * 100) } });
        } else if (load > 0.25 && !cap) {
          score -= 12;
          cons.push({ code: "dcLoadEdge", values: { load: Math.round(load * 1000) / 10 } });
        }
        if (flags.poorFlow) {
          score -= 35;
          cons.push({ code: "dcFlow" });
        }
        if (lowDose) {
          score -= 8;
          cons.push({ code: "dcSegregation" });
        }
        if (flags.moisture || flags.heat || flags.hydrolysable) {
          score += 10;
          pros.push({ code: "dcNoWater" });
        }
        if (form === "odt") {
          score += 12;
          pros.push({ code: "dcOdt" });
        }
        if (cap && !flags.poorFlow) {
          score += 8;
          pros.push({ code: "dcCapsule" });
        }
      }
      if (route === "wg") {
        pros.push({ code: "wgDense" });
        if (load > maxLoad) {
          score -= load > HARD_LOAD[route] ? 40 : 10;
          cons.push({ code: "routeLoad", values: { load: Math.round(load * 1000) / 10, max: Math.round(maxLoad * 100) } });
        } else if (load > MAX_LOAD.dc) {
          score += 18;
          pros.push({ code: "wgLoad" });
        }
        if (flags.poorFlow) {
          score += 12;
          pros.push({ code: "wgFlow" });
        }
        if (flags.moisture || flags.hydrolysable) {
          score -= 45;
          cons.push({ code: "wgWater" });
        }
        if (flags.heat) {
          score -= 25;
          cons.push({ code: "wgHeat" });
        }
        if (flags.poorlySoluble) {
          score += 6;
          pros.push({ code: "wgWetting" });
        }
        if (lowDose) {
          score += 6;
          pros.push({ code: "wgCu" });
        }
        if (flags.lowMelting) {
          score -= 10;
          cons.push({ code: "wgMelting" });
        }
      }
      if (route === "dg") {
        pros.push({ code: "dgNoWater" });
        if (load > maxLoad) {
          score -= load > HARD_LOAD[route] ? 40 : 10;
          cons.push({ code: "routeLoad", values: { load: Math.round(load * 1000) / 10, max: Math.round(maxLoad * 100) } });
        } else if (load > MAX_LOAD.dc) {
          score += 12;
          pros.push({ code: "dgLoad" });
        }
        if (flags.poorFlow) {
          score += 10;
          pros.push({ code: "dgFlow" });
        }
        if (flags.moisture || flags.heat || flags.hydrolysable) {
          score += 22;
          pros.push({ code: "dgSensitive" });
        }
        cons.push({ code: "dgRecompression" });
        if (flags.lowMelting) {
          score -= 8;
          cons.push({ code: "dgMelting" });
        }
      }
      return { route, score, load: Math.round(load * 1000) / 10, weight, pros, cons };
    });
  // A larger unit than the smallest route needs costs points (swallowability, cost).
  const smallest = Math.min(...scored.map((r) => r.weight));
  for (const r of scored) if (r.weight > smallest * 1.15) {
    r.score -= Math.min(25, Math.round((r.weight / smallest - 1) * 20));
    r.cons.push({ code: "routeWeight", values: { w: Math.round(r.weight), min: Math.round(smallest) } });
  }
  return scored.sort((a, b) => b.score - a.score).map((r) => ({ ...r, score: Math.max(0, Math.min(100, r.score)) }));
}

/* ------------------------------------------------------------------ */
/* Weights and allocation                                               */
/* ------------------------------------------------------------------ */

/** API per unit as weighed at 100% potency (salt form). */
export const apiMg = (input: Input) => input.strength * (input.saltFactor && input.saltFactor > 0 ? input.saltFactor : 1);

function coreOf(input: Input): number {
  const bw = input.brandWeight ?? 0;
  if (!(bw > 0)) return 0;
  return input.form === "fc" ? bw / (1 + (input.coatGain ?? 3) / 100) : bw;
}

/** Route- and form-dependent starting level for an excipient in a role. */
function startLevel(item: CatalogueItem | undefined, role: Role, form: DosageForm, route: Route): number | null {
  const range = item?.roles[role];
  if (!range) return null;
  let v = range[2];
  if (role === "dis" && form === "odt") v = range[1];
  if (role === "dis" && form === "cap") v = range[0];
  if (role === "bin" && route === "dc" && item?.key !== "pgs") v = range[0];
  return Math.min(Math.max(v, range[0]), range[1]);
}

type Slot = Row & { min: number; max: number; auto: boolean; item?: CatalogueItem };

/** Gives each filler its minimum and shares the rest (first filler two thirds) within the maxima; returns what is left. */
function share(fillers: Slot[], rest: number): number {
  const shares = fillers.length === 2 ? [2 / 3, 1 / 3] : fillers.map(() => 1 / fillers.length);
  for (const f of fillers) f.pct = f.range ? f.min : 0;
  let extra = rest - fillers.reduce((t, f) => t + f.pct, 0);
  for (let pass = 0; pass < 4 && extra > 1e-9; pass++) {
    const open = fillers.map((f, i) => ({ f, w: shares[i] })).filter(({ f }) => f.pct < f.max - 1e-9);
    if (!open.length) break;
    const wsum = open.reduce((t, o) => t + o.w, 0);
    let used = 0;
    for (const { f, w } of open) {
      const add = Math.min(f.max - f.pct, (extra * w) / wsum);
      f.pct += add;
      used += add;
    }
    extra -= used;
  }
  return extra;
}

export function advise(input: Input, catalogue: CatalogueItem[]): Result {
  const byKey = new Map(catalogue.map((c) => [c.key, c]));
  const routes = rankRoutes(input);
  const route = input.route ?? routes[0].route;
  const auto = !input.route;
  const { form, flags } = input;
  const api = apiMg(input);
  const adjustments: Note[] = [];
  const findings: Finding[] = [];

  // Components into slots: fixed (manual or role level) and q.s. fillers.
  const fixed: Slot[] = [];
  let fillers: Slot[] = [];
  for (const c of input.components) {
    const item = c.key ? byKey.get(c.key) : undefined;
    const range = item?.roles[c.role] ?? undefined;
    const manual = c.pct !== undefined && c.pct !== null && !Number.isNaN(c.pct);
    const slot: Slot = {
      id: c.id,
      name: item?.label ?? c.custom ?? "",
      key: item?.key,
      role: c.role,
      pct: 0,
      mg: 0,
      kg: 0,
      range: range ? [range[0], range[1]] : undefined,
      min: range ? range[0] : 0,
      max: range ? range[1] : 100,
      auto: !manual,
      manual,
      item,
      grade: item?.grade?.[route],
    };
    if (c.role === "dil" && !manual) {
      slot.qs = true;
      fillers.push(slot);
    } else {
      slot.pct = manual ? (c.pct as number) : (startLevel(item, c.role, form, route) ?? 0);
      fixed.push(slot);
    }
  }

  // Core weight: the brand weight, or the smallest weight that holds the
  // drug at the route's maximum load and leaves room for the first filler.
  const capRoute = form === "cap";
  const maxLoad = capRoute ? (route === "dc" ? 0.7 : CAP_MAX_LOAD) : MAX_LOAD[route];
  const fixedPct = () => fixed.reduce((s, r) => s + r.pct, 0);
  let core: number;
  const brandCore = coreOf(input);
  if (brandCore > 0) core = r2(brandCore);
  else {
    const fillerMin = fillers[0]?.range ? fillers[0].min : 0;
    const room = 100 - fixedPct() - fillerMin;
    const byRoom = room > 0 ? api / (room / 100) : Infinity;
    core = roundUp(Math.max(MIN_WEIGHT, api / maxLoad, Number.isFinite(byRoom) ? byRoom : api / maxLoad));
  }
  const apiPct = (api / core) * 100;

  // Over-filled: bring the automatic levels down to their minimums.
  let rest = 100 - apiPct - fixedPct();
  let feasible = true;
  let minWeight: number | undefined;
  if (rest < 0) {
    // Cut every automatic level in proportion to its headroom above the minimum.
    const cuttable = fixed.filter((s) => s.auto && s.range && s.pct > s.min);
    const headroom = cuttable.reduce((t, s) => t + (s.pct - s.min), 0);
    const ratio = Math.min(1, -rest / (headroom || 1));
    for (const s of cuttable) {
      const cut = (s.pct - s.min) * ratio;
      s.pct -= cut;
      rest += cut;
      adjustments.push({ code: "reduced", values: { name: s.name, pct: r2(s.pct) } });
    }
    if (rest < -0.005) {
      feasible = false;
      const floor = fixed.reduce((t, s) => t + (s.range && s.auto ? s.min : s.pct), 0);
      minWeight = roundUp(api / ((100 - floor) / 100));
      findings.push({ code: "infeasible", level: "high", values: { min: minWeight, sum: r2(apiPct + fixedPct()) } });
    }
  }

  // Fillers: give each its minimum, drop secondary fillers that do not fit,
  // then share the remainder (first filler two thirds) within the maxima.
  if (feasible && fillers.length) {
    const mins = () => fillers.reduce((t, f) => t + (f.range ? f.min : 0), 0);
    const dropped: Slot[] = [];
    while (fillers.length > 1 && rest < mins() - 1e-9) dropped.unshift(fillers.pop()!);
    if (rest < mins() - 1e-9) dropped.unshift(fillers.pop()!);
    for (const d of dropped) adjustments.push({ code: "dropped", values: { name: d.name } });
    if (fillers.length) {
      let extra = share(fillers, rest);
      // A secondary filler left below 5% adds nothing: give its share to the others.
      for (let minor = fillers.findIndex((f) => fillers.length > 1 && f.pct < 5); minor >= 0; minor = fillers.findIndex((f) => fillers.length > 1 && f.pct < 5)) {
        adjustments.push({ code: "dropped", values: { name: fillers[minor].name } });
        fillers.splice(minor, 1);
        extra = share(fillers, rest);
      }
      if (extra > 0.005) {
        // Every filler at its maximum: the weight is larger than the formula needs.
        fillers[0].pct += extra;
        if (fillers[0].range) fillers[0].out = true;
        findings.push({ code: "fillerMax", level: "medium", values: { name: fillers[0].name } });
      }
    } else {
      // No filler fits: absorb the remainder into binder / disintegrant
      // within range, then keep a dropped filler in another role it has.
      let residual = rest;
      for (const s of fixed) if (residual > 0.005 && s.auto && s.range && (s.role === "bin" || s.role === "dis")) {
        const add = Math.min(s.max - s.pct, residual);
        if (add > 0.005) {
          s.pct = r2(s.pct + add);
          residual -= add;
          adjustments.push({ code: "raised", values: { name: s.name, pct: s.pct } });
        }
      }
      if (residual > 0.005) {
        const keep = dropped.find((d) => d.item && Object.entries(d.item.roles).some(([r, rg]) => r !== "dil" && rg && residual >= rg[0] && residual <= rg[1]));
        if (keep) {
          const [role, rg] = Object.entries(keep.item!.roles).find(([r, rg2]) => r !== "dil" && rg2 && residual >= rg2[0] && residual <= rg2[1]) as [Role, Range];
          Object.assign(keep, { role, pct: residual, range: [rg[0], rg[1]], qs: true, switched: true });
          fillers = [keep];
          const i = adjustments.findIndex((a) => a.code === "dropped" && a.values?.name === keep.name);
          if (i >= 0) adjustments.splice(i, 1);
          adjustments.push({ code: "switched", values: { name: keep.name, role } });
        } else {
          findings.push({ code: "residual", level: "medium", values: { rest: r2(residual) } });
        }
      } else adjustments.push({ code: "noFiller" });
    }
  } else if (feasible && rest > 0.5) findings.push({ code: "noDiluent", level: "high", values: { rest: r2(rest) } });

  const rows: Row[] = [{ id: "api", name: "", role: "api", pct: apiPct, mg: api, kg: 0 }, ...fixed, ...fillers].map((s) => {
    const { min: _min, max: _max, auto: _auto, item: _item, ...row } = s as Slot;
    void _min; void _max; void _auto; void _item;
    return row;
  });
  for (const r of rows) {
    r.mg = r.role === "api" ? api : (r.pct * core) / 100;
    r.kg = (r.mg * input.units) / 1e6;
    if (r.manual && r.range && (r.pct < r.range[0] - 1e-9 || r.pct > r.range[1] + 1e-9)) {
      r.out = true;
      findings.push({ code: "manualOut", level: "medium", values: { name: r.name, pct: r2(r.pct), min: r.range[0], max: r.range[1] } });
    }
  }

  const coat = form === "fc" ? (brandCore > 0 ? (input.brandWeight as number) - core : (core * (input.coatGain ?? 3)) / 100) : 0;
  const weight = r2(core + coat);

  // Composition checks.
  const roles = new Set(rows.map((r) => r.role));
  const items = rows.map((r) => (r.key ? byKey.get(r.key) : undefined)).filter(Boolean) as CatalogueItem[];
  const has = (pred: (i: CatalogueItem) => boolean | undefined) => items.filter(pred);
  if (isTablet(form) && form !== "chew" && !roles.has("dis")) findings.push({ code: "needDis", level: "high" });
  if (!roles.has("lub")) findings.push({ code: "needLub", level: "high" });
  if (route === "wg" && !roles.has("bin")) findings.push({ code: "needBin", level: "high" });
  if ((flags.poorFlow || route === "dc" || form === "cap") && !roles.has("gli")) findings.push({ code: "needGli", level: "medium" });
  if ((form === "odt" || form === "chew") && !roles.has("swe")) findings.push({ code: "needSwe", level: "medium" });
  if ((form === "odt" || form === "chew") && flags.bitter) findings.push({ code: "tasteMask", level: "medium" });
  if (flags.poorlySoluble && !roles.has("wet")) findings.push({ code: "needWet", level: "medium" });

  // Drug–excipient compatibility.
  if (flags.amine) for (const i of has((i) => i.reducing)) findings.push({ code: "maillard", level: "high", values: { name: i.label } });
  if (flags.oxidizable) for (const i of has((i) => i.peroxide)) findings.push({ code: "peroxide", level: "high", values: { name: i.label } });
  if (flags.cationic) for (const i of has((i) => i.anionic)) findings.push({ code: "anionic", level: "medium", values: { name: i.label } });
  if (flags.acidic) for (const i of has((i) => i.alkaline)) findings.push({ code: "alkaline", level: "medium", values: { name: i.label } });
  if (flags.moisture || flags.hydrolysable) for (const i of has((i) => i.wet || i.hygroscopic)) findings.push({ code: "wetExcipient", level: "medium", values: { name: i.label } });
  if (flags.poorlySoluble) {
    const mg = rows.find((r) => r.key && byKey.get(r.key)?.hydrophobic && r.pct > 1);
    if (mg) findings.push({ code: "hydrophobicLub", level: "medium", values: { name: mg.name, pct: r2(mg.pct) } });
  }
  if (flags.lowMelting) findings.push({ code: "lowMelting", level: "medium" });
  if (route === "dc") for (const r of rows) if (r.role === "dil" && r.key && byKey.get(r.key)?.noDc) findings.push({ code: "notDc", level: "medium", values: { name: r.name } });

  // Dose and size.
  const cu = input.strength < 25 || apiPct < 25;
  if (cu) findings.push({ code: "cu", level: "medium" });
  if (isTablet(form) && weight > 1000) findings.push({ code: "big", level: "medium", values: { w: Math.round(weight) } });
  if (input.brandWeight) findings.push({ code: "sizeRld", level: "low" });
  if (route !== "dc" && roles.has("dis")) findings.push({ code: "splitDis", level: "low" });

  // Capsule size or tablet tooling.
  let capsule: Result["capsule"] = null;
  let tooling: Tooling | null = null;
  if (form === "cap") {
    const density = input.density && input.density > 0 ? input.density : 0.6;
    const volume = core / 1000 / density;
    const i = CAPSULES.findIndex(([, v]) => v >= volume);
    if (i >= 0) {
      const [size, v] = CAPSULES[i];
      capsule = { size, volume: r2(volume), fill: Math.round(v * density * 1000), alt: CAPSULES[i + 1]?.[0] };
      if (volume / v < 0.6) findings.push({ code: "capLoose", level: "low", values: { s: size } });
    } else findings.push({ code: "capTooBig", level: "high", values: { v: r2(volume) } });
  } else tooling = toolingFor(core);

  // Risk assessment (initial, ICH Q9 style).
  const reducingAmine = flags.amine && has((i) => i.reducing).length > 0;
  const peroxideOx = flags.oxidizable && has((i) => i.peroxide).length > 0;
  const risk = (cqa: string, high: Note[], medium: Note[]): Risk => ({ cqa, level: high.length ? "high" : medium.length ? "medium" : "low", why: high.length ? high : medium });
  const when = (cond: boolean, code: string) => (cond ? [{ code }] : []);
  const risks: Risk[] = [
    risk("cu", [...when(cu && route === "dc", "rCuDc")], [...when(cu, "rCuLow"), ...when(flags.poorFlow && route === "dc", "rFlow")]),
    risk("dissolution", [...when(flags.poorlySoluble && !roles.has("wet"), "rSolNoWet")], [...when(flags.poorlySoluble, "rSol"), ...when(rows.some((r) => r.key && byKey.get(r.key)?.hydrophobic && r.pct > 1), "rLub")]),
    risk("degradation", [...when(reducingAmine, "rMaillard"), ...when(peroxideOx, "rPeroxide"), ...when((flags.moisture || flags.hydrolysable) && route === "wg", "rWgWater")], [...when(flags.moisture || flags.hydrolysable, "rMoisture"), ...when(flags.heat && route === "wg", "rHeat"), ...when(flags.oxidizable, "rOx")]),
    risk("weight", [...when(flags.poorFlow && route === "dc", "rFlow")], [...when(flags.poorFlow, "rFlowGran"), ...when(form === "cap" && !roles.has("gli"), "rNoGli")]),
    risk("mechanical", [...when(apiPct > MAX_LOAD.dc * 100 && route === "dc", "rDcLoad")], [...when(flags.lowMelting, "rMelting"), ...when(apiPct > 70, "rHighLoad")]),
    ...(isTablet(form) && form !== "chew" ? [risk("disintegration", [...when(!roles.has("dis"), "rNoDis")], [...when(flags.cationic && has((i) => i.anionic && Boolean(i.roles.dis)).length > 0, "rAnionicDis")])] : []),
  ];
  const penalty = risks.reduce((t, r) => t + (r.level === "high" ? 16 : r.level === "medium" ? 6 : 0), 0) + findings.filter((f) => f.level === "high").length * 6;
  const score = Math.max(0, Math.min(100, 100 - penalty - (feasible ? 0 : 25)));

  // Dispensing formula: potency-corrected API, filler reduced to keep the batch weight.
  const assay = input.assay && input.assay > 0 ? input.assay : 100;
  const water = input.water && input.water > 0 && input.water < 100 ? input.water : 0;
  const apiFactor = (100 / assay) * (100 / (100 - water)) * (1 + (input.overage ?? 0) / 100);
  const batchRows = rows.map((r) => ({ id: r.id, name: r.name, key: r.key, role: r.role, kg: r.role === "api" ? r.kg * apiFactor : r.kg }));
  const extraApi = batchRows[0].kg - rows[0].kg;
  const qsRow = batchRows.find((b, i) => rows[i].qs && rows[i].role === "dil");
  if (qsRow && extraApi > 0) qsRow.kg = Math.max(0, qsRow.kg - extraApi);
  if (extraApi > 0.0005 && qsRow) adjustments.push({ code: "potency", values: { name: qsRow.name } });
  const batchTotal = batchRows.reduce((t, b) => t + b.kg, 0);

  // Process parameters.
  const process: Note[] = [];
  const coreKg = (core * input.units) / 1e6;
  const binderKg = rows.filter((r) => r.role === "bin").reduce((t, r) => t + r.kg, 0);
  if (route === "wg") {
    if (binderKg > 0) process.push({ code: "pBinderSol", values: { b: r2(binderKg), w: r2(binderKg * 9) } });
    process.push({ code: "pFluid", values: { lo: r2(coreKg * 0.2), hi: r2(coreKg * 0.35) } });
    process.push({ code: flags.heat ? "pDryCool" : "pDry" });
    process.push({ code: "pLod" });
    process.push({ code: "pMillWg" });
  }
  if (route === "dg") {
    process.push({ code: "pRibbon" });
    process.push({ code: "pMillDg" });
  }
  process.push({ code: "pSieve" });
  process.push({ code: "pBlend" });
  process.push({ code: "pLubBlend" });
  if (tooling) {
    process.push({ code: tooling.shape === "round" ? "pToolRound" : "pToolCaplet", values: { s: tooling.size, t: tooling.thickness ?? "–" } });
    if (tooling.force) process.push({ code: "pForce", values: { lo: tooling.force[0], hi: tooling.force[1] } });
  }
  if (capsule) process.push({ code: "pCapsule", values: { s: capsule.size, f: r2(core) } });
  if (form === "fc") {
    const solids = (coreKg * (input.coatGain ?? 3)) / 100;
    process.push({ code: "pCoat", values: { s: r2(solids), q: r2((solids / 0.15) * 1.15), g: input.coatGain ?? 3 } });
  }

  // Specifications.
  const specs: Note[] = [];
  const wv = form === "cap" ? (core < 300 ? 10 : 7.5) : weight <= 80 ? 10 : weight < 250 ? 7.5 : 5;
  specs.push({ code: "sWeight", values: { w: r2(weight), d: wv } });
  specs.push({ code: cu ? "sCu" : "sWv" });
  specs.push({ code: "sAssay" });
  if (isTablet(form)) {
    specs.push({ code: "sFriability" });
    if (tooling?.force) specs.push({ code: "sHardness", values: { lo: tooling.force[0], hi: tooling.force[1] } });
  }
  specs.push({ code: form === "fc" ? "sDtFc" : form === "odt" ? "sDtOdt" : form === "chew" ? "sDtChew" : form === "cap" ? "sDtCap" : "sDtIr" });
  specs.push({ code: "sDissolution" });
  specs.push({ code: "sImpurities" });
  if (route === "wg" || flags.moisture) specs.push({ code: "sWater" });

  return {
    route,
    auto,
    routes,
    weight,
    coreWeight: r2(core),
    coatMg: r2(coat),
    apiMg: r2(api),
    apiPct: r2(apiPct),
    rows,
    sum: r2(rows.reduce((t, r) => t + r.pct, 0)),
    feasible,
    minWeight,
    adjustments,
    findings: findings.sort((a, b) => rank(a.level) - rank(b.level)),
    risks,
    score,
    capsule,
    tooling,
    batch: { rows: batchRows, total: batchTotal, apiFactor: r2(apiFactor * 10000) / 10000 },
    process,
    specs,
  };
}

const rank = (l: Level) => (l === "high" ? 0 : l === "medium" ? 1 : 2);

/** Round tooling for cores up to 750 mg, caplets above; thickness and breaking force at the target tensile strength. */
export function toolingFor(core: number): Tooling {
  if (core > 750) {
    const size = core <= 900 ? "17.5 × 8" : core <= 1100 ? "19 × 9.5" : "21 × 10";
    return { shape: "caplet", size };
  }
  const table: [number, number][] = [
    [110, 6],
    [160, 7],
    [220, 8],
    [300, 9],
    [400, 10],
    [500, 11],
    [620, 12],
    [750, 13],
  ];
  const d = (table.find(([w]) => core <= w) ?? table[table.length - 1])[1];
  // Flat-faced equivalent: V = W / ρ, t = V / (π D² / 4); F = σ π D t / 2 (Fell & Newton).
  const volume = core / COMPACT_DENSITY; // mm³ (mg / (mg/mm³))
  const t = volume / ((Math.PI * d * d) / 4);
  const f = (s: number) => Math.round((s * Math.PI * d * t) / 2 / 5) * 5;
  return { shape: "round", size: `${d}`, thickness: Math.round(t * 10) / 10, force: [f(TENSILE[0]), f(TENSILE[1])] };
}

/* ------------------------------------------------------------------ */
/* Suggested composition                                                */
/* ------------------------------------------------------------------ */

export function suggestComponents(form: DosageForm, route: Route, flags: Flags): Omit<Component, "id">[] {
  const set: Omit<Component, "id">[] = [];
  const add = (key: string, role: Role) => set.push({ key, role });
  const sensitive = flags.moisture || flags.hydrolysable;
  const amine = flags.amine;
  const ox = flags.oxidizable;
  const cationic = flags.cationic;
  // Superdisintegrant: non-ionic when the drug is cationic; no peroxide carrier when oxidizable.
  const dis = cationic ? (ox ? "lhpc" : "crospovidone") : ox ? "ccs" : form === "odt" ? "crospovidone" : "ccs";
  const lub = flags.poorlySoluble || flags.acidic ? "ssf" : "mgst";
  const binder = ox ? "hpc" : route === "dc" ? "copovidone" : "pvp";

  if (form === "odt") {
    add("mannitol", "dil");
    add("mcc", "dil");
    add(ox ? "lhpc" : "crospovidone", "dis");
    add("sucralose", "swe");
    add("silica", "gli");
    add("ssf", "lub");
  } else if (form === "chew") {
    add("mannitol", "dil");
    add(sensitive ? "dcp" : "mcc", "dil");
    add(binder, "bin");
    add(dis, "dis");
    add("sucralose", "swe");
    add("silica", "gli");
    add(lub, "lub");
  } else if (form === "cap") {
    add(sensitive ? "dcp" : "mcc", "dil");
    if (!amine && !sensitive) add("pgs", "dil");
    if (route === "wg") add(binder, "bin");
    add("silica", "gli");
    add(lub, "lub");
  } else if (route === "dc") {
    add(sensitive ? "smcc" : "mcc", "dil");
    add(amine ? "mannitol" : sensitive ? "dcp" : "lactose-sd", "dil");
    add(dis, "dis");
    add("silica", "gli");
    add(lub, "lub");
  } else if (route === "dg") {
    add("mcc", "dil");
    add(amine ? "mannitol" : "dcp", "dil");
    add(ox ? "hpc" : "copovidone", "bin");
    add(dis, "dis");
    add("silica", "gli");
    add(lub, "lub");
  } else {
    add(amine ? "mannitol" : "lactose", "dil");
    add("mcc", "dil");
    add(binder, "bin");
    add(dis, "dis");
    add("silica", "gli");
    add(lub, "lub");
  }
  if (flags.poorlySoluble) add(cationic ? "poloxamer" : "sls", "wet");
  return set.filter((c, i) => set.findIndex((d) => d.key === c.key && d.role === c.role) === i);
}

/* ------------------------------------------------------------------ */
/* Reference product label                                              */
/* ------------------------------------------------------------------ */

/** Coating and colour components that are not part of the core. */
const COATING = ["titanium dioxide", "polyethylene glycol", "macrogol", "iron oxide", "fd&c", "d&c", "polyvinyl alcohol", "triacetin", "carnauba", "lecithin", "shellac", "ink", "propylene glycol", "opadry", "talc (coating)", "aluminum lake", "aluminium lake", "indigo carmine", "sunset yellow", "tartrazine", "quinoline yellow", "erythrosine", "polydextrose", "glycerol monocaprylocaprate"];

export type LabelMatch = { text: string; key?: string; coating?: boolean };

const clean = (s: string) => s.toLowerCase().replace(/\s+/g, " ").replace(/[.]+$/, "").trim();

/** Splits a label's inactive-ingredient list and maps each entry to the catalogue. */
export function parseLabel(text: string, catalogue: CatalogueItem[]): LabelMatch[] {
  const parts = text
    .replace(/\binactive ingredients?:?/gi, "")
    .split(/[,;\n]|\band\b/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
  const names = catalogue.flatMap((c) => [c.name, ...(c.aka ?? [])].map((n) => ({ n: clean(n), key: c.key }))).sort((a, b) => b.n.length - a.n.length);
  return parts.map((raw) => {
    const t = clean(raw);
    if (COATING.some((c) => t.includes(c))) return { text: raw, coating: true };
    const hit = names.find(({ n }) => t === n || t.includes(n));
    return hit ? { text: raw, key: hit.key } : { text: raw };
  });
}

/** A composition with the label's core excipients, each in its usual role for the route. */
export function componentsFromLabel(matches: LabelMatch[], catalogue: CatalogueItem[], form: DosageForm, route: Route): Omit<Component, "id">[] {
  const byKey = new Map(catalogue.map((c) => [c.key, c]));
  const order: Role[] = ["dil", "bin", "dis", "wet", "gli", "lub", "swe"];
  const coated = form === "fc" && matches.some((m) => m.coating);
  const out: Omit<Component, "id">[] = [];
  for (const m of matches) {
    if (!m.key) continue;
    const item = byKey.get(m.key)!;
    // HPMC on a film-coated label with a coating system is the coat, not a binder.
    if (coated && m.key === "hpmc") continue;
    let role = order.find((r) => item.roles[r] !== undefined) ?? "oth";
    if (m.key === "mcc" && out.some((o) => o.role === "dil") && route === "wg") role = "dil";
    if (m.key === "talc") role = "gli";
    if (m.key === "sls") role = "wet";
    if (m.key === "pgs" && out.some((o) => o.role === "dil")) role = "bin";
    if (m.key === "starch") role = "dis";
    if (!out.some((o) => o.key === m.key)) out.push({ key: m.key, role });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Salt factor                                                          */
/* ------------------------------------------------------------------ */

const SALT_WORDS = /\b(hydrochloride|dihydrochloride|hydrobromide|sodium|potassium|calcium|magnesium|besilate|besylate|maleate|mesilate|mesylate|fumarate|hemifumarate|tartrate|succinate|citrate|sulfate|sulphate|phosphate|acetate|lactate|bromide|nitrate|monohydrate|dihydrate|trihydrate|hemihydrate|sesquihydrate|anhydrous|hyclate|oxalate|tosilate|tosylate|bitartrate|gluconate|disodium|dipropionate|propionate|valerate)\b/gi;

/** Base name of a salt or hydrate, e.g. "Amlodipine besilate" → "amlodipine". */
export const baseName = (name: string) => name.replace(SALT_WORDS, "").replace(/\s+/g, " ").trim().toLowerCase();
