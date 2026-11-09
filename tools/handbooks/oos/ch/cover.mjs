import { C } from "../lib.mjs";
// Cover: navy field, a strip of results against a specification band with one result outside it, a magnifier on that result.
export default () => {
  const W = 794, H = 1123;
  const x0 = 70, x1 = 720, yLo = 985, yHi = 905; // band = specification 95.0–105.0 %
  const X = (i) => x0 + (i / 17) * (x1 - x0);
  const vals = [101.2, 99.4, 100.6, 98.9, 100.2, 101.6, 99.8, 100.9, 99.1, 100.4, 92.7, 100.1, 99.6, 101.1, 100.3, 99.2, 100.7, 100.0];
  const Y = (v) => yLo - ((v - 95) / 10) * (yLo - yHi);
  const pts = vals
    .map((v, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${v < 95 ? 7 : 5}" fill="${v < 95 ? C.red : C.navy}" stroke="${v < 95 ? "#fff" : C.gold}" stroke-width="2"/>`)
    .join("");
  const hexes = Array.from({ length: 7 }, (_, i) => {
    const x = 590 + (i % 3) * 52 + (Math.floor(i / 3) % 2) * 26, y = 90 + Math.floor(i / 3) * 45;
    return `<path d="M${x} ${y - 30} ${x + 26} ${y - 15}v30L${x} ${y + 30} ${x - 26} ${y + 15}v-30Z" fill="none" stroke="${C.teal}" stroke-opacity=".35" stroke-width="1.2"/>`;
  }).join("");
  const mx = X(10), my = Y(92.7);
  const lens = `<g><circle cx="${mx}" cy="${my}" r="34" fill="${C.teal}" fill-opacity=".10" stroke="#ecd27f" stroke-width="4"/>
 <line x1="${mx + 24}" y1="${my + 24}" x2="${mx + 62}" y2="${my + 62}" stroke="#ecd27f" stroke-width="9" stroke-linecap="round"/>
 <text x="${mx + 44}" y="${my - 30}" font-size="13" fill="#f2b8ab" font-family="Plex" font-weight="700">92.7 % — OOS</text></g>`;
  return `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden;background:radial-gradient(circle at 15% 20%,${C.navy3} 0%,${C.navy} 45%,#06111f 100%);color:#fff">
<div style="position:absolute;top:0;bottom:0;right:0;width:16mm;background:linear-gradient(${C.gold},${C.goldD})"></div>
<div style="position:absolute;top:0;bottom:0;right:16mm;width:2.2mm;background:${C.teal}"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${hexes}
<rect x="${x0 - 20}" y="${yHi}" width="${x1 - x0 + 40}" height="${yLo - yHi}" fill="${C.teal}" fill-opacity=".16"/>
<line x1="${x0 - 20}" y1="${yHi}" x2="${x1 + 20}" y2="${yHi}" stroke="${C.gold}" stroke-width="1.4" stroke-dasharray="7 5"/>
<line x1="${x0 - 20}" y1="${yLo}" x2="${x1 + 20}" y2="${yLo}" stroke="${C.gold}" stroke-width="1.4" stroke-dasharray="7 5"/>
<text x="${x1 + 16}" y="${yHi - 8}" font-size="11" fill="${C.gold}" font-family="Plex" text-anchor="end">USL 105.0 %</text>
<text x="${x1 + 16}" y="${yLo + 18}" font-size="11" fill="${C.gold}" font-family="Plex" text-anchor="end">LSL 95.0 %</text>
${pts}
${lens}
</svg>
<div style="position:absolute;right:30mm;left:22mm;top:44mm;text-align:right">
 <div style="color:${C.gold};font-weight:700;font-size:11.5pt">هندبوک رایگان هفته — شماره 4 · ویرایش 1.0</div>
 <div style="margin-top:8mm;font-size:38pt;font-weight:800;line-height:1.15;direction:ltr;text-align:right;font-family:Plex;letter-spacing:.5pt;color:#ecd27f">OOS &amp; OOT Investigations</div>
 <div style="font-size:21pt;font-weight:800;line-height:1.5;margin-top:2mm">راهنمای کاربردی بررسی نتایج OOS و OOT</div>
 <div style="font-size:14pt;font-weight:500;color:#cfe9e7;margin-top:3mm;line-height:1.8">از فاز I آزمایشگاهی تا فاز II، تصمیم درباره بچ و CAPA<br>ویژه کارشناسان کنترل کیفیت، تضمین کیفیت و تولید</div>
 <div style="font-size:10pt;color:#9fb3c8;margin-top:4mm;direction:ltr;text-align:right">Investigating Out-of-Specification and Out-of-Trend Results — An Applied Handbook for QC, QA and Production</div>
 <div style="width:62mm;height:1.2pt;background:${C.gold};margin:8mm 0 7mm auto"></div>
 <div style="font-size:10.5pt;line-height:2.25;color:#e6eef6">
  ${[["FDA OOS Guidance (Rev. 1, 2022) و EU GMP", "فاز Ia و Ib و فرضیه‌آزمایی"], ["فاز II، Retest، Resample و Averaging", "OOT در پایداری و روندگیری"], ["تصمیم درباره بچ، CAPA و APQR", "10 مطالعه موردی، فلوچارت و فرم‌ها"]]
    .map((r) => `<div>${r.map((x) => `<span style="color:${C.gold}">◆</span> ${x}`).join("&emsp;&ensp;")}</div>`).join("")}
 </div>
</div>
<div style="position:absolute;right:30mm;bottom:16mm;display:flex;align-items:center;gap:10pt">
 <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="${C.navy}" stroke="#2cc4bc" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" stroke-width="1.6"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>
 <div style="line-height:1.6"><div style="font-weight:800;font-size:12pt;direction:ltr;text-align:right;font-family:Plex">Pharma<span style="color:${C.gold}">Vault</span></div><div style="font-size:9pt;color:#b9c9da">گنجینه اطلاعات داروسازی · <span style="direction:ltr;unicode-bidi:isolate;color:${C.gold}">pharmavault.ir</span> · آبان 1405</div><div style="font-size:7.6pt;color:#8fa3b8;margin-top:1pt">دانلود رایگان · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</div></div>
</div>
</div>`;
};
