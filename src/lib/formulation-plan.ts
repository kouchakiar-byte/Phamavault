/*
 * Manufacturing plan for the formulation advisor: the unit operations of the
 * chosen route, each with its purpose, equipment, starting parameters and the
 * precautions that follow from the drug's risk profile, then a challenge ->
 * strategy table, a development DoE, scale-up notes and packaging advice.
 * Figures are common starting values in oral-solid development.
 */

import type { Input, Note, Result } from "./formulation-advisor";

export type PlanStep = { code: string; values?: Record<string, string | number>; params: Note[]; tips: Note[] };
export type Challenge = { code: string; values?: Record<string, string | number> };
export type Plan = { steps: PlanStep[]; challenges: Challenge[]; doe: Note[]; scaleUp: Note[]; packaging: Note[] };

const r2 = (x: number) => Math.round(x * 100) / 100;

export function buildPlan(input: Input & { soluble?: boolean }, result: Result): Plan {
  const { form, flags } = input;
  const route = result.route;
  const cap = form === "cap";
  const coreKg = (result.coreWeight * input.units) / 1e6;
  const roles = new Set(result.rows.map((r) => r.role));
  const keys = new Set(result.rows.map((r) => r.key).filter(Boolean));
  const kg = (role: string) => r2(result.rows.filter((r) => r.role === role).reduce((t, r) => t + r.kg, 0));
  const veryLow = input.strength < 5 || result.apiPct < 5;
  const lowDose = input.strength < 25 || result.apiPct < 25;
  const highLoad = result.apiPct > 70;
  const sensitive = flags.moisture || flags.hydrolysable;

  const steps: PlanStep[] = [];
  const step = (code: string, params: (Note | false | undefined)[], tips: (Note | false | undefined)[], values?: Record<string, string | number>) =>
    steps.push({ code, values, params: params.filter(Boolean) as Note[], tips: tips.filter(Boolean) as Note[] });
  const n = (code: string, values?: Record<string, string | number>): Note => ({ code, values });

  // 1. Dispensing and API pre-treatment.
  step(
    "sDispense",
    [n("pPotency", { f: result.batch.apiFactor }), (sensitive || flags.hygroscopic) && n("pLowRh")],
    [flags.poorlySoluble && n("tPsd"), flags.oxidizable && n("tOxDispense"), veryLow && n("tPotent")],
  );
  // 2. Sieving / deagglomeration.
  step("sSieve", [n("pSieve")], [flags.poorFlow && n("tCoMill"), roles.has("gli") && flags.poorFlow && n("tSilicaFirst")]);

  if (route === "dc") {
    step(
      "sPreblend",
      [n("pPreblend")],
      [lowDose && n("tGeometric"), veryLow && n("tTrituration"), flags.poorFlow && n("tOrderedMix")],
    );
    step("sBlend", [n("pBlend"), n("pBu")], [lowDose && n("tBuSampling"), n("tSegregation")]);
  }
  if (route === "wg") {
    step("sDryMix", [n("pDryMix")], [lowDose && n("tGeometric")]);
    step(
      "sBinderSol",
      [kg("bin") > 0 && n("pBinderSol", { b: kg("bin"), w: r2(kg("bin") * 9) }), roles.has("wet") && n("pWetInFluid", { w: kg("wet") })],
      [veryLow && n("tApiInFluid"), flags.oxidizable && n("tN2Water"), keys.has("hpmc") && n("tHpmcSol")],
    );
    step(
      "sWetMass",
      [n("pFluid", { lo: r2(coreKg * (input.soluble ? 0.1 : 0.2)), hi: r2(coreKg * (input.soluble ? 0.2 : 0.35)) }), n("pAddRate"), n("pEndPoint")],
      [input.soluble && n("tSolubleApi"), highLoad && n("tHighLoadWg"), flags.poorlySoluble && n("tHydrophilize")],
    );
    step("sWetMill", [n("pWetMill")], []);
    step("sDry", [n(flags.heat ? "pDryCool" : "pDry"), n("pLod")], [flags.heat && n("tVacuum"), sensitive && n("tLodLow"), flags.lowMelting && n("tMeltDry")]);
    step("sDryMill", [n("pDryMill")], [n("tPsdGran")]);
    step("sExtra", [n("pExtra")], [roles.has("dis") && n("tSplitDis")]);
  }
  if (route === "dg") {
    step("sDgBlend", [n("pDgBlend")], [lowDose && n("tGeometric"), n("tIntraLub")]);
    step("sCompact", [n("pRoll"), n("pRibbon")], [highLoad && n("tWorkHardening"), sensitive && n("tLowRhRoom"), flags.lowMelting && n("tRollCool")]);
    step("sDgMill", [n("pDgMill")], [n("tFines")]);
    step("sExtra", [n("pExtra")], [roles.has("dis") && n("tSplitDis")]);
  }
  step(
    "sLube",
    [n("pLube")],
    [flags.poorlySoluble && keys.has("mgst") && n("tLubeSol"), (keys.has("mgst") || keys.has("cast")) && n("tOverLube")],
  );

  if (cap) {
    step(
      "sFill",
      [result.capsule ? n("pFill", { s: result.capsule.size, f: r2(result.coreWeight) }) : n("pFillNo"), n("pFillChecks")],
      [flags.hygroscopic && n("tHpmcShell"), flags.poorFlow && route === "dc" && n("tDosator"), lowDose && n("tCapCu")],
    );
  } else {
    const t = result.tooling;
    step(
      "sCompress",
      [
        t ? n(t.shape === "round" ? "pTool" : "pToolCaplet", { s: t.size, t: t.thickness ?? "–" }) : false,
        t?.force ? n("pForce", { lo: t.force[0], hi: t.force[1] }) : false,
        n("pPrecomp"),
        n("pIpcCompress"),
      ],
      [
        highLoad && n("tCapping"),
        flags.lowMelting && n("tSticking"),
        form === "odt" && n("tOdtHard"),
        form === "chew" && n("tChewHard"),
        result.weight > 800 && n("tBigTablet"),
      ],
    );
  }
  if (form === "fc") {
    const solids = (coreKg * (input.coatGain ?? 3)) / 100;
    step(
      "sCoat",
      [n("pCoatQty", { s: r2(solids), q: r2((solids / 0.15) * 1.15), g: input.coatGain ?? 3 }), n("pCoatParams")],
      [sensitive && n("tPvaCoat"), flags.oxidizable && n("tOpaque"), flags.bitter && n("tTasteCoat"), sensitive && n("tCoatWater")],
    );
  }

  // Challenges with the strategy for each.
  const challenges: Challenge[] = [];
  const add = (cond: boolean, code: string, values?: Record<string, string | number>) => cond && challenges.push({ code, values });
  add(highLoad, "cHighLoad", { p: r2(result.apiPct) });
  add(veryLow, "cVeryLow");
  add(lowDose && !veryLow, "cLowDose");
  add(Boolean(input.soluble) && route === "wg", "cSoluble");
  add(flags.poorlySoluble, "cPoorSol");
  add(flags.poorFlow, "cFlow");
  add(sensitive, "cMoisture");
  add(flags.heat, "cHeat");
  add(flags.oxidizable, "cOx");
  add(flags.amine, "cAmine");
  add(flags.acidic, "cAcid");
  add(flags.cationic, "cCation");
  add(flags.lowMelting, "cMelt");
  add(flags.bitter, form === "odt" || form === "chew" ? "cBitterOral" : "cBitter");
  add(flags.hygroscopic, cap ? "cHygroCap" : "cHygro");
  add(!cap && result.weight > 800, "cBig", { w: Math.round(result.weight) });
  add(form === "odt", "cOdt");
  add(form === "chew", "cChew");

  // Development DoE for the route.
  const doe: Note[] =
    route === "wg"
      ? [n("dWgFactors"), n("dWgResponses"), n("dLube")]
      : route === "dg"
        ? [n("dDgFactors"), n("dDgResponses"), n("dLube")]
        : [n("dDcFactors"), n("dDcResponses")];
  if (flags.poorlySoluble) doe.push(n("dPsd"));
  doe.push(n("dCompat"), n("dStability"));

  const scaleUp: Note[] = route === "wg" ? [n("uWg"), n("uDry"), n("uBlend")] : route === "dg" ? [n("uDg"), n("uBlend")] : [n("uBlend"), n("uPress")];
  if (form === "fc") scaleUp.push(n("uCoat"));

  const packaging: Note[] = [];
  if (sensitive || flags.hygroscopic) packaging.push(n("kMoisture"));
  if (flags.oxidizable) packaging.push(n("kOxygen"));
  if (!packaging.length) packaging.push(n("kStandard"));
  packaging.push(n("kStability"));

  return { steps, challenges, doe, scaleUp, packaging };
}
