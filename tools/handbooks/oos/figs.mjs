// Figures for the OOS and OOT handbook. All data are illustrative.
import { svg, T, axes, path, arrowDefs, C } from "./lib.mjs";

const node = (x, y, w, h, title, sub, { fill = C.tealXL, stroke = C.teal, tc = C.navy, sc = C.muted, r = 8 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>` +
  T(x + w / 2, y + h / 2 - (sub ? 3 : -4), title, { size: 10, fill: tc, weight: 700 }) +
  (sub ? T(x + w / 2, y + h / 2 + 12, sub, { size: 8.2, fill: sc }) : "");

const diamond = (cx, cy, w, h, text, sub) =>
  `<path d="M${cx} ${cy - h / 2} L${cx + w / 2} ${cy} L${cx} ${cy + h / 2} L${cx - w / 2} ${cy}Z" fill="${C.goldL}" stroke="${C.gold}" stroke-width="1.4"/>` +
  T(cx, cy - (sub ? 2 : -3), text, { size: 9.4, fill: C.navy, weight: 700 }) +
  (sub ? T(cx, cy + 11, sub, { size: 8, fill: C.muted }) : "");

const line = (pts, id = "fl", color = C.navy, dash = "") =>
  `<path d="${pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("")}" fill="none" stroke="${color}" stroke-width="1.5" ${dash ? `stroke-dasharray="${dash}"` : ""} marker-end="url(#${id})"/>`;

/** Fig 1: the OOS investigation path, from the first result to the batch decision. */
export function oosFlow() {
  const W = 640;
  let s = arrowDefs("fl", C.navy) + arrowDefs("fr", C.red) + arrowDefs("fg", C.tealD);
  s += node(220, 6, 200, 40, "OOS result", "keep every solution and raw data", { fill: C.navy, stroke: C.gold, tc: "#ecd27f", sc: "#cfe9e7" });
  s += line([[320, 47], [320, 66]]);
  s += node(170, 67, 300, 44, "Phase Ia — analyst + supervisor", "obvious error? (calculation, wrong standard, spill…)");
  s += line([[320, 112], [320, 130]]);
  s += diamond(320, 158, 190, 54, "Obvious error", "documented?");
  s += line([[415, 158], [500, 158]], "fg", C.tealD);
  s += T(456, 151, "yes", { size: 8.6, fill: C.tealD, weight: 700 });
  s += node(500, 128, 132, 60, "Invalidate result", "correct · repeat test · CAPA", { fill: "#e9f8f1", stroke: C.tealD });
  s += line([[320, 186], [320, 206]]);
  s += T(330, 200, "no", { size: 8.6, fill: C.red, weight: 700, anchor: "start" });
  s += node(150, 207, 340, 44, "Phase Ib — hypothesis testing (pre-defined)", "re-inject · re-measure · check retained preparations");
  s += line([[320, 252], [320, 270]]);
  s += diamond(320, 298, 210, 54, "Assignable lab", "cause confirmed?");
  s += line([[425, 298], [500, 298], [500, 190]], "fg", C.tealD);
  s += T(462, 291, "yes", { size: 8.6, fill: C.tealD, weight: 700 });
  s += line([[320, 326], [320, 346]]);
  s += T(330, 340, "no → result stands", { size: 8.6, fill: C.red, weight: 700, anchor: "start" });
  s += node(110, 347, 420, 52, "Phase II — full-scale investigation (QA-led)", "batch record · process · other batches · retest / resample by protocol", { fill: C.navy, stroke: C.gold, tc: "#ecd27f", sc: "#cfe9e7" });
  s += line([[320, 400], [320, 418]]);
  s += diamond(320, 446, 210, 54, "Root cause", "identified?");
  s += line([[215, 446], [120, 446], [120, 478]], "fr", C.red);
  s += line([[425, 446], [520, 446], [520, 478]], "fr", C.red);
  s += T(168, 439, "manufacturing", { size: 8.4, fill: C.red, weight: 700 });
  s += T(472, 439, "not found", { size: 8.4, fill: C.red, weight: 700 });
  s += node(30, 479, 180, 54, "Confirmed OOS", "reject batch · CAPA · other batches", { fill: "#fbefec", stroke: C.red });
  s += node(420, 479, 200, 54, "Most probable cause", "OOS stands unless proven invalid", { fill: "#fbefec", stroke: C.red });
  s += node(220, 548, 200, 36, "QA batch decision · trend · APQR", "", { fill: C.goldL, stroke: C.gold });
  s += line([[120, 534], [120, 566], [219, 566]]);
  s += line([[520, 534], [520, 566], [421, 566]]);
  return svg(W, 592, s);
}

/** Fig 2: dissolution staged testing — a stage-1 failure is not an OOS result. */
export function stages() {
  let s = arrowDefs("st", C.navy);
  const col = [[20, "S1 · 6 units", "each ≥ Q + 5%"], [230, "S2 · +6 units", "mean of 12 ≥ Q; none < Q − 15%"], [440, "S3 · +12 units", "mean of 24 ≥ Q; ≤ 2 < Q − 15%; none < Q − 25%"]];
  col.forEach(([x, t, c], i) => {
    s += node(x, 20, 180, 62, t, "", i === 2 ? { fill: C.navy, stroke: C.gold, tc: "#ecd27f" } : {});
    s += T(x + 90, 98, c, { size: 8.3, fill: C.navy });
    if (i < 2) {
      s += `<line x1="${x + 181}" y1="51" x2="${x + 209}" y2="51" stroke="${C.navy}" stroke-width="1.5" marker-end="url(#st)"/>`;
      s += T(x + 195, 43, "fails", { size: 8, fill: C.muted });
    }
    s += `<rect x="${x + 30}" y="112" width="120" height="24" rx="12" fill="#e9f8f1" stroke="${C.tealD}"/>` + T(x + 90, 128, "passes → complies", { size: 8.4, fill: C.tealD, weight: 700 });
  });
  s += `<rect x="440" y="146" width="180" height="26" rx="6" fill="#fbefec" stroke="${C.red}"/>` + T(530, 163, "fails at S3 → OOS", { size: 9, fill: C.red, weight: 800 });
  return svg(640, 180, s);
}

/** Fig 3: stability OOT by the regression method — a new result outside the 95% prediction interval. */
export function ootRegression() {
  const w = 620, h = 260;
  const ax = axes({ w, h, x0: 54, xmin: 0, xmax: 24, ymin: 94, ymax: 102, xticks: [0, 3, 6, 9, 12, 18, 24], yticks: [94, 96, 98, 100, 102], xlabel: "Time (months)", ylabel: "Assay (% LC)" });
  const a = 100.3, b = -0.14, half = (t) => 0.75 + 0.012 * (t - 9) ** 2 / 9;
  const band = [];
  for (let t = 0; t <= 24; t += 0.5) band.push([ax.sx(t), ax.sy(a + b * t + half(t))]);
  for (let t = 24; t >= 0; t -= 0.5) band.push([ax.sx(t), ax.sy(a + b * t - half(t))]);
  let s = `<path d="${band.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")}Z" fill="${C.teal}" fill-opacity=".14"/>`;
  s += ax.frame;
  s += `<line x1="${ax.x0}" y1="${ax.sy(95)}" x2="${ax.x1}" y2="${ax.sy(95)}" stroke="${C.red}" stroke-width="1.3" stroke-dasharray="6 4"/>`;
  s += T(ax.x1 - 4, ax.sy(95) - 5, "specification 95.0 %", { size: 8.8, anchor: "end", fill: C.red, weight: 700 });
  s += path([[ax.sx(0), ax.sy(a)], [ax.sx(24), ax.sy(a + b * 24)]], { stroke: C.navy, width: 1.6 });
  const hist = [[0, 100.4], [3, 99.8], [6, 99.6], [9, 99.0], [12, 98.6], [18, 97.8], [24, 97.0], [0, 100.1], [3, 100.0], [6, 99.3], [9, 99.2], [12, 98.7], [18, 97.6], [0, 100.5], [3, 99.7], [6, 99.5], [12, 98.4]];
  s += hist.map(([t, y]) => `<circle cx="${ax.sx(t)}" cy="${ax.sy(y)}" r="3.2" fill="${C.navy}" fill-opacity=".55"/>`).join("");
  const nb = [[0, 100.2], [3, 99.6], [6, 98.1]];
  s += nb.map(([t, y], i) => `<circle cx="${ax.sx(t)}" cy="${ax.sy(y)}" r="4.6" fill="${i === 2 ? C.red : C.gold}" stroke="${C.navy}" stroke-width="1"/>`).join("");
  s += T(ax.sx(6) + 10, ax.sy(98.1) + 4, "new batch, 6 M: 98.1 % — OOT (still within spec)", { size: 8.8, fill: C.red, anchor: "start", weight: 700 });
  s += T(ax.sx(14), ax.sy(100.6), "95 % prediction interval from earlier batches", { size: 8.6, fill: C.tealD, weight: 600 });
  return svg(w, h, s);
}

/** Fig 4: a control chart of release assay with two kinds of OOT signal. */
export function controlChart() {
  const w = 620, h = 230;
  const ys = [99.6, 100.3, 99.8, 100.6, 99.4, 100.1, 99.9, 100.4, 100.0, 99.7, 101.9, 100.2, 99.9, 100.5, 100.6, 100.8, 100.7, 100.9, 100.6, 100.8, 101.0];
  const ax = axes({ w, h, x0: 50, xmin: 0, xmax: ys.length + 1, ymin: 98.4, ymax: 102.2, xticks: [1, 5, 10, 15, 20], yticks: [98.5, 99.5, 100.1, 100.7, 101.7], xlabel: "Batch", ylabel: "Assay (% LC)", grid: false, fmt: (v) => v.toFixed(1) });
  let s = ax.frame;
  const lim = [[101.7, "UCL (+3s)", C.red], [100.1, "mean", C.navy], [98.5, "LCL (−3s)", C.red]];
  for (const [v, l, c] of lim) s += `<line x1="${ax.x0}" y1="${ax.sy(v)}" x2="${ax.x1}" y2="${ax.sy(v)}" stroke="${c}" stroke-width="1.1" stroke-dasharray="${c === C.navy ? "" : "5 4"}"/>` + T(ax.x1 - 2, ax.sy(v) - 4, l, { size: 8.4, anchor: "end", fill: c, weight: 700 });
  s += path(ys.map((y, i) => [ax.sx(i + 1), ax.sy(y)]), { stroke: C.tealD, width: 1.3 });
  s += ys.map((y, i) => `<circle cx="${ax.sx(i + 1)}" cy="${ax.sy(y)}" r="3.4" fill="${i === 10 ? C.red : i >= 13 ? C.gold : C.tealD}" stroke="${C.navy}" stroke-width=".6"/>`).join("");
  s += T(ax.sx(11), ax.sy(101.9) - 9, "1 point beyond 3s", { size: 8.4, fill: C.red, weight: 700 });
  s += `<rect x="${ax.sx(13.6)}" y="${ax.sy(101.15)}" width="${ax.sx(21.4) - ax.sx(13.6)}" height="${ax.sy(100.3) - ax.sy(101.15)}" rx="5" fill="none" stroke="${C.gold}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  s += T(ax.sx(17.5), ax.sy(101.15) - 5, "8 in a row above the mean", { size: 8.4, fill: C.goldD, weight: 700 });
  return svg(w, h, s);
}
