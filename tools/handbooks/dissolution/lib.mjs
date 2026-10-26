// Building blocks for the PharmaVault handbook: page styles, section helpers and SVG figure tools.
import { readFileSync } from "node:fs";

const dir = new URL(".", import.meta.url).pathname;
// Fonts are the site's own bundled files.
const fonts = new URL("../../../src/app/fonts/", import.meta.url).pathname;
const b64 = (f) => readFileSync(fonts + f).toString("base64");

export const C = {
  navy: "#0b1f3a",
  navy2: "#12305a",
  navy3: "#1c4373",
  teal: "#0e9f9a",
  tealD: "#0a7a76",
  tealL: "#d5f3f1",
  tealXL: "#edfaf9",
  gold: "#c9a54c",
  goldD: "#a67c1f",
  goldL: "#fbf5e3",
  red: "#b4442f",
  ink: "#1d2a3a",
  muted: "#5b6b7f",
  line: "#d9e1ea",
  grid: "#e9eef4",
};

export const fontFaces = () => `
@font-face{font-family:"Estedad";font-weight:400;src:url(data:font/woff2;base64,${b64("Estedad-Regular.woff2")}) format("woff2")}
@font-face{font-family:"Estedad";font-weight:500;src:url(data:font/woff2;base64,${b64("Estedad-Medium.woff2")}) format("woff2")}
@font-face{font-family:"Estedad";font-weight:700;src:url(data:font/woff2;base64,${b64("Estedad-Bold.woff2")}) format("woff2")}
@font-face{font-family:"Estedad";font-weight:800;src:url(data:font/woff2;base64,${b64("Estedad-ExtraBold.woff2")}) format("woff2")}
@font-face{font-family:"Plex";font-weight:400;src:url(data:font/woff2;base64,${b64("ibm-plex-sans-latin-400-normal.woff2")}) format("woff2")}
@font-face{font-family:"Plex";font-weight:600 800;src:url(data:font/woff2;base64,${b64("ibm-plex-sans-latin-600-normal.woff2")}) format("woff2")}
@font-face{font-family:"Mono";font-weight:400 700;src:url(data:font/woff2;base64,${b64("jetbrains-mono-latin-500-normal.woff2")}) format("woff2")}
`;

export const css = () => `
${fontFaces()}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:"Plex","Estedad",sans-serif;color:${C.ink};font-size:10.2pt;line-height:1.95;direction:rtl;text-align:justify}
p{margin:0 0 7pt}
b,strong{font-weight:700;color:${C.navy}}
.en{direction:ltr;unicode-bidi:isolate;font-family:"Plex","Estedad",sans-serif}
.mono{font-family:"Mono","Plex",monospace;direction:ltr;unicode-bidi:isolate}
.mk{position:absolute;font-size:1px;line-height:1px;color:#fff;opacity:.01}

.chap{break-before:page;position:relative;margin:0 0 16pt;padding:18pt 20pt 16pt;border-radius:6pt;color:#fff;overflow:hidden;
  background:linear-gradient(120deg,${C.navy} 0%,${C.navy2} 62%,${C.tealD} 135%)}
.chap:before{content:"";position:absolute;inset:0 auto 0 0;width:5pt;background:linear-gradient(${C.gold},${C.goldD})}
.chap .eyebrow{font-size:10pt;font-weight:700;color:${C.gold};letter-spacing:.2pt}
.chap h1{margin:3pt 0 2pt;font-size:21pt;line-height:1.5;font-weight:800;color:#ecd27f}
.chap .sub{font-size:9pt;color:#b9e9e5;direction:ltr;text-align:right;font-weight:600}
.chap .ring{position:absolute;left:18pt;top:50%;transform:translateY(-50%);opacity:.22}

h2{font-size:13.5pt;font-weight:800;color:${C.navy};margin:16pt 0 8pt;padding-bottom:4pt;border-bottom:1.4pt solid ${C.gold};break-after:avoid;position:relative}
h2 .n{color:${C.teal};margin-left:6pt}
h3{font-size:11pt;font-weight:700;color:${C.tealD};margin:11pt 0 5pt;break-after:avoid}
h4{font-size:10.2pt;font-weight:700;color:${C.navy};margin:8pt 0 3pt;break-after:avoid}
ul,ol{margin:0 0 8pt;padding-right:16pt}
li{margin:0 0 3pt}
ul li::marker{color:${C.teal}}
ol li::marker{color:${C.goldD};font-weight:700}

.box{border-radius:5pt;padding:9pt 12pt 8pt;margin:9pt 0 11pt;break-inside:avoid;border-right:4pt solid}
.box .t{font-weight:800;margin-bottom:3pt;display:flex;align-items:center;gap:6pt}
.box .src{font-size:8pt;color:${C.muted};direction:ltr;text-align:left;margin-top:3pt}
.box p:last-child{margin-bottom:0}
.box.ref{background:${C.goldL};border-color:${C.gold}}.box.ref .t{color:${C.goldD}}
.box.lab{background:${C.tealXL};border-color:${C.teal}}.box.lab .t{color:${C.tealD}}
.box.warn{background:#fbefec;border-color:${C.red}}.box.warn .t{color:${C.red}}
.box.key{background:${C.vault50 || "#f3f6fa"};border-color:${C.navy}}.box.key .t{color:${C.navy}}
.ic{width:15pt;height:15pt;flex:none}

.eq{margin:8pt auto 10pt;max-width:88%;border:1pt dashed #b9c7d6;border-radius:5pt;padding:7pt 12pt 5pt;text-align:center;break-inside:avoid;background:#fbfcfe}
.eq .f{font-family:"Mono","Plex",monospace;direction:ltr;font-size:10.6pt;color:${C.navy};line-height:1.7}
.eq .c{font-size:8.4pt;color:${C.muted};line-height:1.7}

table{width:100%;border-collapse:collapse;margin:7pt 0 11pt;font-size:8.7pt;line-height:1.6;break-inside:auto}
thead{display:table-header-group}
tr{break-inside:avoid}
th{background:${C.navy};color:#fff;font-weight:700;padding:5pt 6pt;text-align:right;border:.5pt solid ${C.navy}}
th:first-child{border-top-right-radius:4pt}th:last-child{border-top-left-radius:4pt}
td{padding:4pt 6pt;border:.5pt solid ${C.line};vertical-align:top;text-align:right}
tbody tr:nth-child(even) td{background:#f6f9fb}
td.l,th.l{direction:ltr;text-align:left}
.tcap{font-size:8.6pt;color:${C.muted};margin:-6pt 0 10pt;text-align:center}
.tcap b{color:${C.goldD}}

figure{margin:10pt 0 12pt;text-align:center;break-inside:avoid}
figure svg{max-width:100%;height:auto;direction:ltr}
figcaption{font-size:8.6pt;color:${C.muted};margin-top:4pt;line-height:1.75;text-align:center}
figcaption b{color:${C.goldD}}

.case{border:.8pt solid ${C.line};border-radius:6pt;margin:12pt 0 14pt;overflow:hidden;break-inside:auto}
.case .hd{background:linear-gradient(120deg,${C.navy},${C.navy2});color:#fff;padding:7pt 12pt;display:flex;justify-content:space-between;align-items:center;break-after:avoid}
.case .hd .tt{font-weight:800;font-size:10.8pt}
.case .hd .tag{background:${C.gold};color:${C.navy};font-size:8pt;font-weight:700;border-radius:10pt;padding:1pt 9pt}
.case .bd{padding:8pt 12pt 2pt}
.case .row{margin:0 0 6pt}
.case .lb{display:inline-block;background:${C.tealL};color:${C.tealD};font-weight:800;font-size:8.6pt;border-radius:3pt;padding:0 6pt;margin-left:5pt}
.case .lesson{background:${C.goldL};padding:7pt 12pt;font-size:9.2pt;border-top:.8pt solid ${C.line};break-inside:avoid}
.case .lesson b{color:${C.goldD}}

.qa{margin:0 0 9pt;break-inside:avoid}
.qa .q{font-weight:700;color:${C.navy}}
.qa .q .n{color:${C.teal}}
.qa .a{background:${C.tealXL};border-radius:4pt;padding:5pt 10pt;margin-top:3pt;font-size:9.4pt}

.toc{font-size:9.6pt}
.toc .c{display:flex;justify-content:space-between;font-weight:800;color:${C.navy};margin-top:8pt;padding-bottom:2pt;border-bottom:.6pt dotted #9fb0c3;font-size:10.4pt}
.toc .c .pg{color:${C.tealD}}
.toc .s{display:flex;justify-content:space-between;padding-right:14pt;color:#334458;line-height:1.85}
.toc .pg{direction:ltr;min-width:18pt;text-align:left}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10pt}
.pill{display:inline-block;border-radius:9pt;padding:0 7pt;font-size:8.4pt;font-weight:700}
.refs{direction:ltr;text-align:left;font-size:8.8pt;line-height:1.75;padding-left:18pt;padding-right:0}
.refs li{margin-bottom:4pt}
.refs i{color:${C.navy}}
.pb{break-before:page}
.avoid{break-inside:avoid}
`;

// ---------- text blocks ----------
let mk = 0;
export const toc = [];
const marker = (level, title) => {
  const id = `ZQ${String(++mk).replace(/\d/g, (d) => "ABCDEFGHIJ"[d])}QZ`;
  toc.push({ id, level, title });
  return `<span class="mk" dir="ltr">${id}</span>`;
};

const ring = (s = 90) => `<svg class="ring" width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="none" stroke="#2cc4bc" stroke-width="1.2"/><circle cx="20" cy="20" r="9" fill="none" stroke="#dcbd6d" stroke-width="1"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>`;

export const chapter = (eyebrow, title, en, tocTitle) =>
  `<section class="chap">${marker(1, tocTitle || `${eyebrow} — ${title}`)}${ring()}<div class="eyebrow">${eyebrow}</div><h1>${title}</h1><div class="sub">${en}</div></section>`;

let h2n = 0;
export const resetH2 = () => (h2n = 0);
export const h2 = (title, num = true) => `<h2>${marker(2, title)}${num ? "" : ""}${title}</h2>`;
export const h3 = (t) => `<h3>${t}</h3>`;
export const h4 = (t) => `<h4>${t}</h4>`;
export const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join("");
export const ul = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
export const ol = (items) => `<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export const en = (t) => `<span class="en">${t}</span>`;
export const m = (t) => `<span class="mono">${t}</span>`;

const icons = {
  ref: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="${C.goldD}" stroke-width="2"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>`,
  lab: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="${C.tealD}" stroke-width="2"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/></svg>`,
  warn: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="${C.red}" stroke-width="2"><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.5"/></svg>`,
  key: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="${C.navy}" stroke-width="2"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/></svg>`,
};
const boxTitle = { ref: "از منابع مرجع", lab: "نکته کاربردی آزمایشگاه", warn: "هشدار", key: "نکته کلیدی" };
export const box = (kind, title, body, src) =>
  `<div class="box ${kind}"><div class="t">${icons[kind]}<span>${title ? (kind === "ref" ? `از منابع مرجع: ${title}` : title) : boxTitle[kind]}</span></div>${body}${src ? `<div class="src">${src}</div>` : ""}</div>`;

export const eq = (f, c) => `<div class="eq"><div class="f">${f}</div>${c ? `<div class="c">${c}</div>` : ""}</div>`;

export const table = (head, rows, { cap, ltr = [] } = {}) =>
  `<table><thead><tr>${head.map((h, i) => `<th class="${ltr.includes(i) ? "l" : ""}">${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => `<td class="${ltr.includes(i) ? "l" : ""}">${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>${cap ? `<div class="tcap">${cap}</div>` : ""}`;

export const fig = (svg, num, cap) => `<figure>${svg}<figcaption><b>شکل ${num}.</b> ${cap}</figcaption></figure>`;

export const caseStudy = ({ n, title, tag, rows, figure, lesson }) =>
  `<div class="case"><div class="hd"><span class="tt">مورد ${n}: ${title}</span><span class="tag">${tag}</span></div><div class="bd">${rows
    .map(([lb, t]) => (lb === "FIG" ? t : `<div class="row"><span class="lb">${lb}</span>${t}</div>`))
    .join("")}${figure || ""}</div><div class="lesson"><b>درس کلیدی:</b> ${lesson}</div></div>`;

export const qa = (items) =>
  items.map(([q, a], i) => `<div class="qa"><div class="q"><span class="n">${i + 1}.</span> ${q}</div><div class="a">${a}</div></div>`).join("");

// ---------- SVG tools ----------
export const svg = (w, h, body, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Plex, Estedad, sans-serif" direction="ltr" style="direction:ltr" ${extra}>${body}</svg>`;
export const T = (x, y, s, { size = 10, fill = C.ink, anchor = "middle", weight = 400, rtl = false, extra = "" } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" ${rtl ? 'direction="rtl"' : ""} ${extra}>${s}</text>`;
export const arrowDefs = (id = "ar", color = C.navy) =>
  `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="${color}"/></marker></defs>`;

/** Gaussian peak with optional exponential tailing (tau>0) or fronting (tau<0). */
export function peakAt(t, { t0, h, s, tau = 0 }) {
  if (!tau) return h * Math.exp(-0.5 * ((t - t0) / s) ** 2);
  // Exponentially modified Gaussian, normalised to height ~h by numeric max.
  const k = Math.abs(tau);
  const x = tau > 0 ? t - t0 : t0 - t;
  const z = (s / k - x / s) / Math.SQRT2;
  const v = Math.exp(0.5 * (s / k) ** 2 - x / k) * erfc(z);
  return h * v;
}
function erfc(x) {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}

/** Plot frame with axes; returns {sx, sy, frame} where sx/sy map data → px. */
export function axes({ w, h, x0 = 48, y0 = 14, x1, y1, xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", grid = true, fmt = (v) => v }) {
  x1 = x1 ?? w - 14;
  y1 = y1 ?? h - 36;
  const sx = (v) => x0 + ((v - xmin) / (xmax - xmin)) * (x1 - x0);
  const sy = (v) => y1 - ((v - ymin) / (ymax - ymin)) * (y1 - y0);
  let f = "";
  if (grid) {
    for (const v of xticks) f += `<line x1="${sx(v)}" y1="${y0}" x2="${sx(v)}" y2="${y1}" stroke="${C.grid}" stroke-width="0.8"/>`;
    for (const v of yticks) f += `<line x1="${x0}" y1="${sy(v)}" x2="${x1}" y2="${sy(v)}" stroke="${C.grid}" stroke-width="0.8"/>`;
  }
  f += `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="${C.navy}" stroke-width="1.1"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${C.navy}" stroke-width="1.1"/>`;
  for (const v of xticks) f += `<line x1="${sx(v)}" y1="${y1}" x2="${sx(v)}" y2="${y1 + 4}" stroke="${C.navy}"/>` + T(sx(v), y1 + 15, fmt(v), { size: 8.5, fill: C.muted });
  for (const v of yticks) f += `<line x1="${x0 - 4}" y1="${sy(v)}" x2="${x0}" y2="${sy(v)}" stroke="${C.navy}"/>` + T(x0 - 7, sy(v) + 3, fmt(v), { size: 8.5, fill: C.muted, anchor: "end" });
  if (xlabel) f += T((x0 + x1) / 2, y1 + 30, xlabel, { size: 9, fill: C.navy, weight: 600 });
  if (ylabel) f += `<text transform="translate(${x0 - 34} ${(y0 + y1) / 2}) rotate(-90)" font-size="9" fill="${C.navy}" font-weight="600" text-anchor="middle">${ylabel}</text>`;
  return { sx, sy, frame: f, x0, x1, y0, y1 };
}

export const path = (pts, { stroke = C.navy, width = 1.6, fill = "none", dash = "", extra = "" } = {}) =>
  `<path d="${pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ""} stroke-linejoin="round" ${extra}/>`;

/** Chromatogram trace. peaks: [{t0,h,s,tau}], noise amplitude, drift per minute, baseline fn. */
export function trace({ sx, sy, tmin, tmax, peaks, noise = 0, drift = 0, base = () => 0, n = 700, seed = 7 }) {
  const scale = peaks.map((pk) => {
    if (!pk.tau) return 1;
    let mx = 0;
    for (let i = 0; i <= 2000; i++) mx = Math.max(mx, peakAt(pk.t0 - 6 * pk.s - 3 * Math.abs(pk.tau) + (i / 2000) * (12 * pk.s + 12 * Math.abs(pk.tau)), pk));
    return pk.h / mx;
  });
  let r = seed;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280 - 0.5);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = tmin + ((tmax - tmin) * i) / n;
    let y = base(t) + drift * t + (noise ? noise * (rnd() + rnd()) : 0);
    peaks.forEach((pk, j) => (y += peakAt(t, pk) * scale[j]));
    pts.push([sx(t), sy(y)]);
  }
  return pts;
}
