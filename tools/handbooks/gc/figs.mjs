// Figures for the GC handbook. Curves and chromatograms are illustrative, drawn for teaching.
import { svg, T, axes, path, arrowDefs, trace, C } from "./lib.mjs";

/** Fig: van Deemter curves for N2, He and H2 (illustrative H = A + B/u + C·u). */
export function vanDeemter() {
  const W = 620, H = 270;
  const a = axes({ w: W, h: H, x0: 56, xmin: 0, xmax: 80, ymin: 0, ymax: 1.2, xticks: [0, 10, 20, 30, 40, 50, 60, 70, 80], yticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], xlabel: "average linear velocity of carrier gas, ū (cm/s)", ylabel: "plate height, H (mm)", fmt: (v) => (v > 0 && v < 2 ? v.toFixed(1) : v) });
  // Shapes chosen so the minima fall in the commonly quoted ranges (N2 ~10–12, He ~20–25, H2 ~35–40 cm/s).
  const gases = [
    { name: "N₂", B: 1.5, Cc: 0.0104, col: C.gold },
    { name: "He", B: 3.08, Cc: 0.00636, col: C.navy3 },
    { name: "H₂", B: 5.51, Cc: 0.00381, col: C.teal },
  ];
  let s = a.frame;
  for (const g of gases) {
    const pts = [];
    for (let u = 2; u <= 80; u += 0.5) {
      const h = g.B / u + g.Cc * u;
      if (h <= 1.2) pts.push([a.sx(u), a.sy(h)]);
    }
    s += path(pts, { stroke: g.col, width: 2.4 });
    const uopt = Math.sqrt(g.B / g.Cc), hmin = 2 * Math.sqrt(g.B * g.Cc);
    s += `<circle cx="${a.sx(uopt)}" cy="${a.sy(hmin)}" r="4" fill="${g.col}"/>`;
    s += T(a.sx(uopt), a.sy(hmin) + 16, `${g.name} · ū(opt) ≈ ${uopt.toFixed(0)}`, { size: 9, fill: g.col, weight: 700 });
  }
  s += `<rect x="${a.sx(30)}" y="${a.y0}" width="${a.sx(55) - a.sx(30)}" height="${a.y1 - a.y0}" fill="${C.teal}" fill-opacity=".06"/>`;
  s += T(a.sx(42.5), a.y0 + 14, "H₂: flat curve → fast runs, little loss", { size: 8.6, fill: C.tealD });
  return svg(W, H, s);
}

const box = (x, y, w, h, fill, stroke, r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`;
const lbl = (x, y, t, o = {}) => T(x, y, t, { size: 9, fill: C.navy, ...o });

/** Fig: split/splitless inlet cross-section with its gas paths. */
export function inlet() {
  const W = 620, H = 330;
  let s = arrowDefs("ia", C.teal) + arrowDefs("ib", C.goldD) + arrowDefs("ic", C.red);
  // body
  s += box(230, 60, 120, 210, "#eef3f8", C.navy, 6);
  // septum
  s += box(250, 40, 80, 18, C.gold, C.goldD, 3) + lbl(290, 34, "septum", { weight: 700 });
  // liner
  s += box(272, 74, 36, 170, "#ffffff", C.navy3, 3);
  s += `<path d="M280 150 h20 M280 158 h20 M280 166 h20" stroke="${C.muted}" stroke-width="1.6"/>` + lbl(198, 162, "glass wool", { anchor: "end", fill: C.muted, size: 8.6 });
  s += `<line x1="200" y1="160" x2="276" y2="158" stroke="${C.muted}" stroke-width=".8"/>`;
  s += lbl(360, 110, "liner (deactivated glass)", { anchor: "start", size: 8.6, fill: C.navy3 });
  s += `<line x1="358" y1="107" x2="308" y2="112" stroke="${C.navy3}" stroke-width=".8"/>`;
  // syringe
  s += `<line x1="290" y1="6" x2="290" y2="128" stroke="${C.ink}" stroke-width="2.4"/>` + lbl(300, 16, "syringe needle", { anchor: "start", size: 8.6 });
  // carrier in
  s += `<path d="M120 90 H230" stroke="${C.teal}" stroke-width="2.4" marker-end="url(#ia)"/>` + lbl(116, 84, "carrier gas in (EPC)", { anchor: "end", fill: C.tealD, weight: 700 });
  // septum purge
  s += `<path d="M330 66 H470" stroke="${C.goldD}" stroke-width="2" marker-end="url(#ib)"/>` + lbl(476, 70, "septum purge (~3 mL/min)", { anchor: "start", fill: C.goldD, size: 8.6 });
  // split vent
  s += `<path d="M350 230 H470" stroke="${C.red}" stroke-width="2.4" marker-end="url(#ic)"/>` + lbl(476, 226, "split vent", { anchor: "start", fill: C.red, weight: 700 });
  s += lbl(476, 240, "split ratio = vent flow / column flow", { anchor: "start", fill: C.muted, size: 8.4 });
  // column
  s += `<path d="M290 244 V310" stroke="${C.navy}" stroke-width="3"/>` + lbl(300, 300, "capillary column → oven", { anchor: "start", weight: 700 });
  // heater
  s += box(222, 60, 8, 210, C.red, C.red, 2) + box(350, 60, 8, 210, C.red, C.red, 2);
  s += lbl(214, 262, "heated block", { anchor: "end", fill: C.red, size: 8.4 });
  s += `<rect x="40" y="250" width="160" height="56" rx="6" fill="${C.goldL}" stroke="${C.gold}"/>`;
  s += lbl(120, 268, "Split: vent open during injection", { size: 8.4 });
  s += lbl(120, 283, "Splitless: vent closed ~0.5–1 min,", { size: 8.4 });
  s += lbl(120, 297, "then opened (purge)", { size: 8.4 });
  return svg(W, H, s);
}

/** Fig: flame ionization detector. */
export function fid() {
  const W = 620, H = 300;
  let s = arrowDefs("fa", C.navy) + arrowDefs("fb", C.teal);
  s += box(250, 70, 120, 190, "#eef3f8", C.navy, 6);
  // jet
  s += `<path d="M300 260 V190 h20 V260" fill="#d7dee8" stroke="${C.navy}"/>`;
  // flame
  s += `<path d="M310 190 C296 172 300 150 310 132 C320 150 324 172 310 190Z" fill="${C.gold}" stroke="${C.goldD}"/>`;
  s += `<path d="M310 186 C304 175 306 160 310 150 C314 160 316 175 310 186Z" fill="#fff6d8"/>`;
  // collector
  s += `<rect x="286" y="88" width="48" height="30" rx="4" fill="none" stroke="${C.tealD}" stroke-width="3"/>`;
  s += lbl(390, 100, "collector electrode", { anchor: "start", fill: C.tealD, weight: 700 }) + `<line x1="386" y1="97" x2="336" y2="102" stroke="${C.tealD}" stroke-width=".8"/>`;
  s += lbl(390, 118, "→ electrometer: ion current ∝ carbon atoms", { anchor: "start", size: 8.4, fill: C.muted });
  s += lbl(390, 160, "H₂ / air flame", { anchor: "start", fill: C.goldD, weight: 700 }) + `<line x1="386" y1="157" x2="322" y2="162" stroke="${C.goldD}" stroke-width=".8"/>`;
  s += lbl(390, 176, "CH• + O → CHO⁺ + e⁻", { anchor: "start", size: 8.6, fill: C.navy });
  // gases
  s += `<path d="M120 270 H300" stroke="${C.teal}" stroke-width="2" marker-end="url(#fb)"/>` + lbl(116, 266, "column effluent + make-up", { anchor: "end", size: 8.4 });
  s += `<path d="M120 230 H250" stroke="${C.navy}" stroke-width="2" marker-end="url(#fa)"/>` + lbl(116, 226, "hydrogen", { anchor: "end", size: 8.4 });
  s += `<path d="M120 200 H250" stroke="${C.navy}" stroke-width="2" marker-end="url(#fa)"/>` + lbl(116, 196, "air", { anchor: "end", size: 8.4 });
  s += `<path d="M310 70 V30" stroke="${C.muted}" stroke-width="2" marker-end="url(#fa)"/>` + lbl(320, 36, "exhaust", { anchor: "start", size: 8.4, fill: C.muted });
  return svg(W, H, s);
}

/** Fig: static headspace vial at equilibrium, with the partition equation. */
export function headspaceVial() {
  const W = 620, H = 290;
  let s = "";
  // vial
  s += `<path d="M150 70 V250 a14 14 0 0 0 14 14 H286 a14 14 0 0 0 14 -14 V70" fill="#f6f9fc" stroke="${C.navy}" stroke-width="2"/>`;
  s += box(140, 50, 170, 22, C.navy2, C.navy, 3) + T(225, 65, "crimp cap + septum (PTFE/silicone)", { size: 8.2, fill: "#fff" });
  // liquid
  s += `<path d="M151 180 H299 V250 a13 13 0 0 1 -13 13 H164 a13 13 0 0 1 -13 -13Z" fill="${C.tealL}" stroke="none"/>`;
  s += `<line x1="151" y1="180" x2="299" y2="180" stroke="${C.tealD}" stroke-width="1.6"/>`;
  // molecules
  const dots = [[175, 110], [215, 95], [255, 120], [190, 140], [270, 150], [230, 160], [205, 125]];
  s += dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.gold}"/>`).join("");
  const liq = [[170, 200], [190, 222], [215, 205], [240, 230], [262, 210], [280, 240], [200, 245], [228, 215], [250, 248], [175, 235], [268, 228]];
  s += liq.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.tealD}"/>`).join("");
  s += T(225, 100, "", {});
  s += T(320, 120, "gas phase V_G · C_G", { size: 9.6, fill: C.goldD, anchor: "start", weight: 700 });
  s += T(320, 225, "sample phase V_S · C_S", { size: 9.6, fill: C.tealD, anchor: "start", weight: 700 });
  s += `<rect x="318" y="140" width="290" height="62" rx="6" fill="${C.goldL}" stroke="${C.gold}"/>`;
  s += T(463, 162, "K = C_S / C_G      β = V_G / V_S", { size: 10.4, fill: C.navy, weight: 700 });
  s += T(463, 186, "peak area ∝ C_G = C₀ / (K + β)", { size: 10.4, fill: C.navy, weight: 700 });
  s += T(225, 285, "thermostatted at the equilibration temperature (e.g. 80 °C)", { size: 8.6, fill: C.muted });
  return svg(W, H, s);
}

/** Fig: USP <467> path for Class 1 and Class 2 solvents, A → B → C. */
export function rsFlow() {
  const W = 640, H = 330;
  let s = arrowDefs("ra", C.navy) + arrowDefs("rg", C.tealD) + arrowDefs("rr", C.red);
  const node = (x, y, w, h, t, sub, fill = C.tealXL, stroke = C.teal, tc = C.navy) =>
    box(x, y, w, h, fill, stroke, 7) + T(x + w / 2, y + h / 2 - (sub ? 3 : -4), t, { size: 9.8, fill: tc, weight: 700 }) + (sub ? T(x + w / 2, y + h / 2 + 12, sub, { size: 8.2, fill: C.muted }) : "");
  const dia = (cx, cy, t, sub) => `<path d="M${cx} ${cy - 26} L${cx + 92} ${cy} L${cx} ${cy + 26} L${cx - 92} ${cy}Z" fill="${C.goldL}" stroke="${C.gold}" stroke-width="1.4"/>` + T(cx, cy - 2, t, { size: 9, fill: C.navy, weight: 700 }) + T(cx, cy + 11, sub, { size: 8, fill: C.muted });
  const ln = (d, id = "ra", col = C.navy) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.5" marker-end="url(#${id})"/>`;
  s += node(30, 20, 180, 46, "Procedure A", "G43 · identification & limit");
  s += ln("M120 67 V92");
  s += dia(120, 120, "peak ≥ standard", "of any solvent?");
  s += ln("M212 120 H262", "rg", C.tealD) + T(237, 113, "no", { size: 8.6, fill: C.tealD, weight: 700 });
  s += node(264, 98, 150, 44, "Complies", "no further test", "#e9f8f1", C.tealD);
  s += ln("M120 146 V172") + T(130, 164, "yes", { size: 8.6, fill: C.red, weight: 700, anchor: "start" });
  s += node(30, 173, 180, 46, "Procedure B", "G16 · confirm identity");
  s += ln("M120 220 V244");
  s += dia(120, 272, "peak confirmed", "and ≥ standard?");
  s += ln("M212 272 H262", "rg", C.tealD) + T(237, 265, "no", { size: 8.6, fill: C.tealD, weight: 700 });
  s += node(264, 250, 150, 44, "Complies", "(identity not confirmed)", "#e9f8f1", C.tealD);
  s += ln("M120 298 V316 H460 V250", "rr", C.red) + T(300, 312, "yes", { size: 8.6, fill: C.red, weight: 700 });
  s += node(430, 196, 190, 52, "Procedure C", "quantify by standard addition", C.navy, C.gold, "#ecd27f");
  s += T(525, 270, "result vs Q3C limit (Option 1 or 2)", { size: 8.4, fill: C.navy });
  s += T(525, 284, "Class 3 only: LOD ≤ 0.5% may suffice", { size: 8.4, fill: C.muted });
  return svg(W, H, s);
}

/** Fig: an illustrative residual-solvent chromatogram on a G43 column (Class 2 Mixture A style). */
export function rsChromatogram() {
  const W = 640, H = 250;
  const a = axes({ w: W, h: H, x0: 46, xmin: 0, xmax: 32, ymin: -2, ymax: 100, xticks: [0, 4, 8, 12, 16, 20, 24, 28, 32], yticks: [0, 25, 50, 75, 100], xlabel: "time (min)", ylabel: "FID response", grid: true });
  const peaks = [
    { t0: 3.1, h: 52, s: 0.05, n: "methanol" },
    { t0: 5.15, h: 70, s: 0.06, n: "acetonitrile" },
    { t0: 5.42, h: 64, s: 0.06, n: "dichloromethane" },
    { t0: 8.3, h: 46, s: 0.07, n: "hexane" },
    { t0: 11.6, h: 58, s: 0.08, n: "THF" },
    { t0: 14.9, h: 61, s: 0.09, n: "cyclohexane" },
    { t0: 19.8, h: 74, s: 0.08, n: "toluene" },
    { t0: 24.6, h: 50, s: 0.07, n: "chlorobenzene" },
  ];
  let s = a.frame;
  s += path(trace({ ...a, tmin: 0, tmax: 32, peaks, noise: 0.35, base: (t) => (t > 22 ? (t - 22) * 0.25 : 0), n: 1400 }), { stroke: C.navy, width: 1.3 });
  for (const pk of peaks) s += T(a.sx(pk.t0), a.sy(pk.h) - 6, pk.n, { size: 8, fill: C.tealD, extra: `transform="rotate(-35 ${a.sx(pk.t0)} ${a.sy(pk.h) - 6})"`, anchor: "start" });
  s += T(a.sx(5.3), a.sy(84) , "Rs ≥ 1.0 (SST)", { size: 8.6, fill: C.red, weight: 700 });
  s += `<rect x="${a.sx(20)}" y="${a.y0}" width="${a.sx(32) - a.sx(20)}" height="${a.y1 - a.y0}" fill="${C.gold}" fill-opacity=".07"/>` + T(a.sx(28), a.y0 + 12, "ramp 10 °C/min", { size: 8.4, fill: C.goldD });
  return svg(W, H, s);
}

/** Fig: three problem chromatograms side by side: tailing, fronting, ghost peaks. */
export function problems() {
  const W = 640, H = 200, w = 200;
  let s = "";
  const panel = (i, title, peaks, extra = "", base = () => 0) => {
    const x0 = 14 + i * (w + 12);
    const a = axes({ w: x0 + w, h: H, x0: x0 + 6, x1: x0 + w - 6, y0: 26, y1: H - 26, xmin: 0, xmax: 10, ymin: -3, ymax: 100, grid: false });
    s += `<rect x="${x0}" y="4" width="${w}" height="${H - 8}" rx="6" fill="#fbfcfe" stroke="${C.line}"/>`;
    s += T(x0 + w / 2, 18, title, { size: 9.6, fill: C.navy, weight: 700 });
    s += a.frame + path(trace({ ...a, tmin: 0, tmax: 10, peaks, noise: 0.3, base, n: 500 }), { stroke: C.navy, width: 1.4 }) + extra;
  };
  panel(0, "tailing (As > 1.8)", [{ t0: 4, h: 88, s: 0.18, tau: 0.9 }]);
  panel(1, "fronting (overload)", [{ t0: 5.5, h: 88, s: 0.18, tau: -0.8 }]);
  panel(2, "ghost peaks · rising bleed", [{ t0: 3, h: 60, s: 0.12 }, { t0: 6.2, h: 14, s: 0.2 }, { t0: 7.6, h: 10, s: 0.25 }], "", (t) => (t > 5 ? (t - 5) ** 2 * 1.2 : 0));
  return svg(W, H, s);
}

/** Fig: phase ratio β = r / 2dƒ of common column formats. */
export function phaseRatio() {
  const W = 620, H = 150;
  let s = "";
  const cols = [
    ["0.25 mm × 0.25 µm", 125 / 0.5, "general purpose"],
    ["0.32 mm × 1.8 µm (G43)", 160 / 3.6, "<467> Procedure A"],
    ["0.53 mm × 3.0 µm (G43)", 265 / 6, "<467> wide-bore"],
    ["0.32 mm × 0.25 µm (G16)", 160 / 0.5, "<467> Procedure B"],
  ];
  const max = 350;
  cols.forEach(([n, b, u], i) => {
    const y = 18 + i * 32, len = (b / max) * 330;
    s += T(196, y + 12, n, { size: 9, fill: C.navy, anchor: "end", weight: 700 });
    s += `<rect x="206" y="${y}" width="${len}" height="18" rx="3" fill="${i === 3 ? C.gold : C.teal}"/>`;
    s += T(212 + len, y + 13, `β ≈ ${Math.round(b)} · ${u}`, { size: 8.8, fill: C.ink, anchor: "start" });
  });
  return svg(W, H, s);
}
