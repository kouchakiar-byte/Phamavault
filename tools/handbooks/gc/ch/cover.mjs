import { C, peakAt } from "../lib.mjs";
// Cover: navy field, a coiled capillary column and a residual-solvent chromatogram rising from it.
export default () => {
  const W = 794, H = 1123;
  const x0 = 70, x1 = 720, base = 1000;
  const peaks = [
    { t0: 0.08, h: 70, s: 0.006 }, { t0: 0.16, h: 120, s: 0.006 }, { t0: 0.18, h: 105, s: 0.006 },
    { t0: 0.29, h: 80, s: 0.007 }, { t0: 0.4, h: 96, s: 0.008 }, { t0: 0.51, h: 100, s: 0.008 },
    { t0: 0.64, h: 130, s: 0.008 }, { t0: 0.77, h: 74, s: 0.007 }, { t0: 0.88, h: 58, s: 0.007 },
  ];
  let d = "";
  for (let i = 0; i <= 900; i++) {
    const t = i / 900;
    let y = 0;
    for (const p of peaks) y += peakAt(t, p);
    d += `${i ? "L" : "M"}${(x0 + t * (x1 - x0)).toFixed(1)} ${(base - y).toFixed(1)}`;
  }
  const coil = Array.from({ length: 9 }, (_, i) => `<ellipse cx="610" cy="210" rx="${118 - i * 9}" ry="${44 - i * 3.2}" fill="none" stroke="${i % 2 ? C.teal : "#ecd27f"}" stroke-opacity="${0.55 - i * 0.04}" stroke-width="2.2"/>`).join("");
  const hexes = Array.from({ length: 5 }, (_, i) => {
    const x = 120 + (i % 3) * 52 + (Math.floor(i / 3) % 2) * 26, y = 90 + Math.floor(i / 3) * 45;
    return `<path d="M${x} ${y - 30} ${x + 26} ${y - 15}v30L${x} ${y + 30} ${x - 26} ${y + 15}v-30Z" fill="none" stroke="${C.teal}" stroke-opacity=".3" stroke-width="1.2"/>`;
  }).join("");
  return `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden;background:radial-gradient(circle at 15% 20%,${C.navy3} 0%,${C.navy} 45%,#06111f 100%);color:#fff">
<div style="position:absolute;top:0;bottom:0;right:0;width:16mm;background:linear-gradient(${C.gold},${C.goldD})"></div>
<div style="position:absolute;top:0;bottom:0;right:16mm;width:2.2mm;background:${C.teal}"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${hexes}
${coil}
<line x1="${x0 - 20}" y1="${base}" x2="${x1 + 20}" y2="${base}" stroke="${C.gold}" stroke-width="1.2" stroke-opacity=".7"/>
<path d="${d}L${x1} ${base}L${x0} ${base}Z" fill="${C.teal}" fill-opacity=".14"/>
<path d="${d}" fill="none" stroke="#ecd27f" stroke-width="2.4" stroke-linejoin="round"/>
<text x="${x0 + 0.16 * (x1 - x0)}" y="${base - 132}" font-size="11" fill="#cfe9e7" font-family="Plex" text-anchor="middle">Rs ≥ 1.0</text>
<text x="${x1 + 16}" y="${base + 22}" font-size="11" fill="${C.gold}" font-family="Plex" text-anchor="end">FID · G43 · headspace</text>
</svg>
<div style="position:absolute;right:30mm;left:22mm;top:58mm;text-align:right">
 <div style="color:${C.gold};font-weight:700;font-size:11.5pt">هندبوک رایگان هفته — شماره 5 · ویرایش 1.0</div>
 <div style="margin-top:8mm;font-size:36pt;font-weight:800;line-height:1.15;direction:ltr;text-align:right;font-family:Plex;letter-spacing:.5pt;color:#ecd27f">Gas Chromatography &amp; Headspace</div>
 <div style="font-size:21pt;font-weight:800;line-height:1.5;margin-top:2mm">راهنمای کاربردی کروماتوگرافی گازی (GC) و Headspace</div>
 <div style="font-size:14pt;font-weight:500;color:#cfe9e7;margin-top:3mm;line-height:1.8">از اصول و دستگاه تا Residual solvents، صحه‌گذاری و عیب‌یابی<br>ویژه کارشناسان کنترل کیفیت، آنالیز و R&amp;D</div>
 <div style="font-size:10pt;color:#9fb3c8;margin-top:4mm;direction:ltr;text-align:right">Gas Chromatography and Static Headspace in the Pharmaceutical QC Laboratory — An Applied Handbook</div>
 <div style="width:62mm;height:1.2pt;background:${C.gold};margin:8mm 0 7mm auto"></div>
 <div style="font-size:10.5pt;line-height:2.25;color:#e6eef6">
  ${[["Inlet، ستون و دتکتور (FID، TCD، ECD، MS)", "Static headspace: K، β و تعادل"], ["ICH Q3C(R9) و USP &lt;467&gt;", "DEG/EG، Nitrosamine و Ethylene oxide"], ["USP &lt;621&gt;: SST و تنظیمات مجاز", "عیب‌یابی، مطالعات موردی و مثال‌های حل‌شده"]]
    .map((r) => `<div>${r.map((x) => `<span style="color:${C.gold}">◆</span> ${x}`).join("&emsp;&ensp;")}</div>`).join("")}
 </div>
</div>
<div style="position:absolute;right:30mm;bottom:16mm;display:flex;align-items:center;gap:10pt">
 <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="${C.navy}" stroke="#2cc4bc" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" stroke-width="1.6"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>
 <div style="line-height:1.6"><div style="font-weight:800;font-size:12pt;direction:ltr;text-align:right;font-family:Plex">Pharma<span style="color:${C.gold}">Vault</span></div><div style="font-size:9pt;color:#b9c9da">گنجینه اطلاعات داروسازی · <span style="direction:ltr;unicode-bidi:isolate;color:${C.gold}">pharmavault.ir</span> · آبان 1405</div><div style="font-size:7.6pt;color:#8fa3b8;margin-top:1pt">دانلود رایگان · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</div></div>
</div>
</div>`;
};
