// Additional figures for the validation handbook. All data are illustrative.
import { svg, T, axes, path, arrowDefs, C } from "./lib.mjs";

const box = (x, y, w, h, title, sub, { fill = C.tealXL, stroke = C.teal, tc = C.navy, sc = C.muted } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>` +
  T(x + w / 2, y + h / 2 - (sub ? 3 : -4), title, { size: 10.5, fill: tc, weight: 700 }) +
  (sub ? T(x + w / 2, y + h / 2 + 13, sub, { size: 8.6, fill: sc }) : "");

/** Fig 2-1: validation workflow. */
export function workflow() {
  const steps = [
    ["Develop", "ATP · Q14"],
    ["Protocol", "criteria · QA sign-off"],
    ["Execute", "SST in each run"],
    ["Evaluate", "vs. pre-set criteria"],
    ["Report", "conditions of use"],
  ];
  let s = arrowDefs("wf", C.navy);
  steps.forEach(([a, b], i) => {
    const x = 8 + i * 126;
    s += box(x, 20, 112, 62, a, b, i === 1 ? { fill: C.navy, stroke: C.gold, tc: "#ecd27f", sc: "#cfe9e7" } : {});
    if (i < 4) s += `<line x1="${x + 113}" y1="51" x2="${x + 125}" y2="51" stroke="${C.navy}" stroke-width="1.6" marker-end="url(#wf)"/>`;
  });
  s += `<path d="M388 84 v26 h-130 v-26" fill="none" stroke="${C.red}" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#wf)"/>`;
  s += T(323, 124, "fails → deviation · root cause · no criteria changed after the fact", { size: 9, fill: C.red, weight: 600 });
  return svg(640, 134, s);
}

/** Fig 3-2: degradation per stress condition against the 5–20 % target. */
export function stressBars() {
  const w = 620, h = 240;
  const data = [["Acid", 11], ["Base", 34], ["Base (mild)", 14], ["Oxidation", 8], ["Heat", 3], ["Humidity", 2], ["Light", 6]];
  const ax = axes({ w, h, x0: 50, xmin: 0, xmax: data.length, ymin: 0, ymax: 40, xticks: [], yticks: [0, 5, 10, 20, 30, 40], ylabel: "Degradation (%)", fmt: (v) => v });
  let s = `<rect x="${ax.x0}" y="${ax.sy(20)}" width="${ax.x1 - ax.x0}" height="${ax.sy(5) - ax.sy(20)}" fill="${C.gold}" fill-opacity=".14"/>`;
  s += ax.frame;
  s += T(ax.x1 - 6, ax.sy(20) - 5, "target 5–20 %", { size: 9, anchor: "end", fill: C.goldD, weight: 700 });
  data.forEach(([lbl, v], i) => {
    const x = ax.sx(i + 0.2), bw = ax.sx(i + 0.8) - x;
    const col = v > 20 ? C.red : v < 5 ? C.muted : C.teal;
    s += `<rect x="${x}" y="${ax.sy(v)}" width="${bw}" height="${ax.sy(0) - ax.sy(v)}" rx="3" fill="${col}"/>`;
    s += T(x + bw / 2, ax.sy(v) - 4, `${v}`, { size: 9, fill: C.navy, weight: 600 });
    s += T(x + bw / 2, ax.y1 + 15, lbl, { size: 9, fill: C.navy });
  });
  return svg(w, h, s);
}

/** Fig 4-2: residuals of an unweighted fit over a wide range fan out; 1/x² weighting gives an even spread. */
export function weighting() {
  const conc = [0.05, 0.1, 0.25, 0.5, 1, 1.5];
  let seed = 4;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 2;
  const pts = conc.flatMap((c) => [0, 1, 2].map(() => [c, c * 3.2 * rnd()]));
  const panel = (title, rel) => {
    const ax = axes({ w: 310, h: 220, xmin: 0, xmax: 1.6, ymin: rel ? -12 : -5, ymax: rel ? 12 : 5, xticks: [0, 0.4, 0.8, 1.2, 1.6], yticks: rel ? [-10, 0, 10] : [-4, 0, 4], xlabel: "Concentration (% of spec.)", ylabel: rel ? "Relative residual (%)" : "Residual (area)" });
    let s = ax.frame + path([[ax.sx(0), ax.sy(0)], [ax.sx(1.6), ax.sy(0)]], { stroke: C.gold, width: 1.1, dash: "5 4" });
    s += pts.map(([c, r]) => `<circle cx="${ax.sx(c)}" cy="${ax.sy(rel ? (r / (c * 3.2)) * 6 : r)}" r="3" fill="${rel ? C.tealD : C.navy}"/>`).join("");
    s += T(ax.x0 + 8, ax.y0 + 12, title, { size: 9.5, anchor: "start", fill: C.navy, weight: 700 });
    return svg(310, 220, s);
  };
  return `<div class="grid2">${panel("1/x² weighted", true)}${panel("Unweighted", false)}</div>`;
}

/** Fig 5-2: mean recovery per level with 95 % CI and the acceptance band. */
export function recoveryPlot() {
  const w = 600, h = 230;
  const lv = [[80, 99.74, 0.6], [100, 99.77, 0.7], [120, 100.01, 0.65]];
  const ax = axes({ w, h, xmin: 70, xmax: 130, ymin: 96, ymax: 104, xticks: [70, 80, 90, 100, 110, 120, 130], yticks: [96, 98, 100, 102, 104], xlabel: "Level (% of test conc.)", ylabel: "Recovery (%)" });
  let s = `<rect x="${ax.x0}" y="${ax.sy(102)}" width="${ax.x1 - ax.x0}" height="${ax.sy(98) - ax.sy(102)}" fill="${C.teal}" fill-opacity=".1"/>` + ax.frame;
  s += [98, 102].map((v) => path([[ax.sx(70), ax.sy(v)], [ax.sx(130), ax.sy(v)]], { stroke: C.teal, width: 1.2, dash: "5 4" })).join("");
  s += path([[ax.sx(70), ax.sy(100)], [ax.sx(130), ax.sy(100)]], { stroke: C.gold, width: 1 });
  for (const [x, m, ci] of lv) {
    s += `<line x1="${ax.sx(x)}" y1="${ax.sy(m - ci)}" x2="${ax.sx(x)}" y2="${ax.sy(m + ci)}" stroke="${C.navy}" stroke-width="1.6"/>`;
    s += [m - ci, m + ci].map((v) => `<line x1="${ax.sx(x) - 6}" y1="${ax.sy(v)}" x2="${ax.sx(x) + 6}" y2="${ax.sy(v)}" stroke="${C.navy}" stroke-width="1.6"/>`).join("");
    s += `<circle cx="${ax.sx(x)}" cy="${ax.sy(m)}" r="4.5" fill="${C.gold}" stroke="${C.navy}" stroke-width="1.4"/>`;
  }
  s += T(ax.x1 - 6, ax.sy(102) - 5, "acceptance 98.0–102.0 %", { size: 9, anchor: "end", fill: C.tealD, weight: 700 });
  return svg(w, h, s);
}

/** Fig 5-3: intermediate precision design (days × analysts × instruments × columns). */
export function ipDesign() {
  const runs = [
    ["Run 1", "Day 1", "Analyst A", "HPLC-1", "Col. lot 1"],
    ["Run 2", "Day 2", "Analyst B", "HPLC-2", "Col. lot 2"],
    ["Run 3", "Day 3", "Analyst A", "HPLC-2", "Col. lot 2"],
    ["Run 4", "Day 4", "Analyst B", "HPLC-1", "Col. lot 1"],
  ];
  const cols = ["", "Day", "Analyst", "Instrument", "Column"];
  let s = "";
  cols.forEach((c, j) => (s += T(70 + j * 120, 20, c, { size: 10, fill: C.navy, weight: 700 })));
  runs.forEach((r, i) => {
    r.forEach((v, j) => {
      const x = 14 + j * 120, y = 30 + i * 34;
      const alt = j === 0 ? C.navy : (v.endsWith("B") || v.endsWith("2")) ? C.goldL : C.tealXL;
      s += `<rect x="${x}" y="${y}" width="112" height="28" rx="5" fill="${alt}" stroke="${j === 0 ? C.navy : C.line}"/>`;
      s += T(x + 56, y + 18, v, { size: 9.5, fill: j === 0 ? "#fff" : C.navy, weight: j === 0 ? 700 : 500 });
    });
  });
  s += T(310, 182, "each run: 3 preparations at 100 % → 12 results; variance components by ANOVA", { size: 9, fill: C.muted });
  return svg(620, 192, s);
}

/** Fig 6-2: Pareto of robustness effects (Plackett–Burman, response: critical-pair resolution). */
export function pareto() {
  const w = 600, h = 230;
  const eff = [["pH (±0.2)", 0.42], ["% organic (±2)", 0.31], ["Column lot", 0.18], ["Temp. (±5 °C)", 0.12], ["Flow (±10 %)", 0.06], ["Buffer conc.", 0.04], ["λ (±2 nm)", 0.01]];
  const ax = axes({ w, h, x0: 110, xmin: 0, xmax: 0.5, ymin: 0, ymax: eff.length, xticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], yticks: [], xlabel: "|Effect| on Rs", grid: true, fmt: (v) => v.toFixed(1) });
  let s = ax.frame;
  const crit = 0.15;
  s += path([[ax.sx(crit), ax.y0], [ax.sx(crit), ax.y1]], { stroke: C.red, width: 1.3, dash: "5 4" });
  s += T(ax.sx(crit) + 4, ax.y0 + 10, "significance limit", { size: 8.6, anchor: "start", fill: C.red, weight: 600 });
  eff.forEach(([lbl, v], i) => {
    const y = ax.sy(eff.length - i - 0.2), bh = ax.sy(eff.length - i - 0.8) - y;
    s += `<rect x="${ax.x0}" y="${y}" width="${ax.sx(v) - ax.x0}" height="${bh}" rx="2" fill="${v > crit ? C.navy : C.teal}"/>`;
    s += T(ax.x0 - 6, y + bh / 2 + 3, lbl, { size: 9, anchor: "end", fill: C.navy });
  });
  return svg(w, h, s);
}

/** Fig 6-3: precision versus concentration near the quantitation limit. */
export function qlCurve() {
  const w = 600, h = 220;
  const ax = axes({ w, h, xmin: 0, xmax: 0.3, ymin: 0, ymax: 40, xticks: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3], yticks: [0, 10, 20, 30, 40], xlabel: "Concentration (% of test conc.)", ylabel: "RSD (%)", fmt: (v) => (v < 1 && v > 0 ? v.toFixed(2) : v) });
  const f = (c) => 0.9 + 0.45 / c;
  const pts = [];
  for (let c = 0.012; c <= 0.3; c += 0.003) pts.push([ax.sx(c), ax.sy(Math.min(f(c), 40))]);
  let s = ax.frame + path([[ax.x0, ax.sy(10)], [ax.x1, ax.sy(10)]], { stroke: C.gold, width: 1.2, dash: "5 4" }) + path(pts, { stroke: C.navy, width: 1.8 });
  const ql = 0.45 / (10 - 0.9);
  s += `<line x1="${ax.sx(ql)}" y1="${ax.sy(10)}" x2="${ax.sx(ql)}" y2="${ax.y1}" stroke="${C.tealD}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  s += `<circle cx="${ax.sx(ql)}" cy="${ax.sy(10)}" r="4.5" fill="${C.gold}" stroke="${C.navy}"/>`;
  s += T(ax.sx(ql) + 8, ax.sy(10) - 8, `QL ≈ ${ql.toFixed(3)} % (RSD = 10 %)`, { size: 9.5, anchor: "start", fill: C.tealD, weight: 700 });
  s += T(ax.x1 - 6, ax.sy(10) + 13, "RSD limit at QL", { size: 9, anchor: "end", fill: C.goldD });
  return svg(w, h, s);
}

/** Fig 7-1: revalidation decision tree. */
export function decisionTree() {
  let s = arrowDefs("dt", C.navy);
  const q = (x, y, t1, t2) =>
    `<path d="M${x} ${y - 26} L${x + 110} ${y} L${x} ${y + 26} L${x - 110} ${y}Z" fill="${C.goldL}" stroke="${C.gold}" stroke-width="1.4"/>` +
    T(x, y - 2, t1, { size: 9.5, fill: C.navy, weight: 700 }) + T(x, y + 12, t2, { size: 8.6, fill: C.muted });
  s += box(230, 6, 180, 34, "Proposed change", "", { fill: C.navy, stroke: C.gold, tc: "#fff" });
  s += q(320, 92, "Within proven ranges /", "allowed adjustments?");
  s += box(470, 76, 160, 34, "Document · no revalidation", "", {});
  s += q(320, 182, "Affects a performance", "characteristic?");
  s += box(470, 166, 160, 34, "Verify SST · document", "", {});
  s += box(200, 236, 240, 40, "Partial revalidation", "only the affected characteristics", { fill: C.navy, stroke: C.gold, tc: "#ecd27f", sc: "#cfe9e7" });
  s += box(14, 236, 170, 40, "Full revalidation", "new technique or principle", { fill: "#fbefec", stroke: C.red, tc: C.red });
  const ar = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.navy}" stroke-width="1.4" marker-end="url(#dt)"/>`;
  s += ar(320, 40, 320, 64) + ar(430, 92, 468, 92) + T(449, 86, "yes", { size: 8.6, fill: C.tealD, weight: 700 });
  s += ar(320, 118, 320, 154) + T(330, 138, "no", { size: 8.6, anchor: "start", fill: C.red, weight: 700 });
  s += ar(430, 182, 468, 182) + T(449, 176, "no", { size: 8.6, fill: C.red, weight: 700 });
  s += ar(320, 208, 320, 234) + T(330, 224, "yes", { size: 8.6, anchor: "start", fill: C.tealD, weight: 700 });
  s += `<path d="M210 182 H99 V234" fill="none" stroke="${C.navy}" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#dt)"/>` + T(150, 176, "major change", { size: 8.6, fill: C.red, weight: 700 });
  return svg(640, 284, s);
}

/** Fig 7-2: TOST — 90 % confidence intervals of the difference against ±2.0 %. */
export function tost() {
  const w = 600, h = 220;
  const ax = axes({ w, h, x0: 150, xmin: -3, xmax: 3, ymin: 0, ymax: 4, xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [], xlabel: "Difference of means, receiving − sending (%)", grid: true });
  let s = `<rect x="${ax.sx(-2)}" y="${ax.y0}" width="${ax.sx(2) - ax.sx(-2)}" height="${ax.y1 - ax.y0}" fill="${C.teal}" fill-opacity=".1"/>` + ax.frame;
  s += [-2, 2].map((v) => path([[ax.sx(v), ax.y0], [ax.sx(v), ax.y1]], { stroke: C.teal, width: 1.3, dash: "5 4" })).join("");
  const rows = [
    ["A: equivalent", 0.67, 0.35, 0.98, C.tealD],
    ["B: not shown", 1.2, -0.4, 2.8, C.red],
    ["C: not equivalent", 2.4, 2.1, 2.7, C.red],
  ];
  rows.forEach(([lbl, m, lo, hi, col], i) => {
    const y = ax.sy(3.2 - i * 1.1);
    s += `<line x1="${ax.sx(lo)}" y1="${y}" x2="${ax.sx(hi)}" y2="${y}" stroke="${col}" stroke-width="2.2"/>`;
    s += [lo, hi].map((v) => `<line x1="${ax.sx(v)}" y1="${y - 6}" x2="${ax.sx(v)}" y2="${y + 6}" stroke="${col}" stroke-width="2"/>`).join("");
    s += `<circle cx="${ax.sx(m)}" cy="${y}" r="4.5" fill="${C.gold}" stroke="${C.navy}"/>`;
    s += T(ax.x0 - 8, y + 3, lbl, { size: 9.5, anchor: "end", fill: col, weight: 700 });
  });
  s += T(ax.sx(0), ax.y0 + 12, "equivalence margin ±2.0 %", { size: 9, fill: C.tealD, weight: 600 });
  return svg(w, h, s);
}
