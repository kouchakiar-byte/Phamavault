import { C, peakAt } from "../lib.mjs";
// Cover: navy field, teal and gold accents, a chromatogram and a column drawn in line.
export default () => {
  const W = 794, H = 1123;
  const pk = [
    { t0: 140, h: 120, s: 9 }, { t0: 215, h: 210, s: 10 }, { t0: 262, h: 90, s: 9 }, { t0: 360, h: 300, s: 13 },
    { t0: 470, h: 160, s: 14 }, { t0: 560, h: 240, s: 15 }, { t0: 650, h: 110, s: 16 },
  ];
  let d = "";
  for (let x = 0; x <= W; x += 2) {
    let y = 0;
    for (const p of pk) y += 0.62 * peakAt(x, p);
    d += `${x ? "L" : "M"}${x} ${(980 - y).toFixed(1)}`;
  }
  const hexes = Array.from({ length: 7 }, (_, i) => {
    const x = 590 + (i % 3) * 52 + (Math.floor(i / 3) % 2) * 26, y = 90 + Math.floor(i / 3) * 45;
    return `<path d="M${x} ${y - 30} ${x + 26} ${y - 15}v30L${x} ${y + 30} ${x - 26} ${y + 15}v-30Z" fill="none" stroke="${C.teal}" stroke-opacity=".35" stroke-width="1.2"/>`;
  }).join("");
  return `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden;background:radial-gradient(circle at 15% 20%,${C.navy3} 0%,${C.navy} 45%,#06111f 100%);color:#fff">
<div style="position:absolute;top:0;bottom:0;right:0;width:16mm;background:linear-gradient(${C.gold},${C.goldD})"></div>
<div style="position:absolute;top:0;bottom:0;right:16mm;width:2.2mm;background:${C.teal}"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${hexes}
<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="${C.teal}"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>
<linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.teal}" stop-opacity=".28"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></linearGradient></defs>
<path d="${d}L${W} 980L0 980Z" fill="url(#fill)"/>
<path d="${d}" fill="none" stroke="url(#cg)" stroke-width="2.6"/>
<line x1="0" y1="980.5" x2="${W}" y2="980.5" stroke="${C.gold}" stroke-opacity=".5" stroke-dasharray="6 6"/>
<g transform="translate(110 690)">
 <rect x="0" y="0" width="300" height="34" rx="8" fill="#0f2848" stroke="${C.gold}" stroke-width="1.6"/>
 <rect x="-22" y="-4" width="26" height="42" rx="4" fill="${C.gold}"/><rect x="296" y="-4" width="26" height="42" rx="4" fill="${C.gold}"/>
 ${Array.from({ length: 60 }, (_, i) => `<circle cx="${10 + (i % 30) * 9.6}" cy="${11 + Math.floor(i / 30) * 12}" r="3.6" fill="${C.teal}" fill-opacity="${0.35 + ((i * 37) % 10) / 20}"/>`).join("")}
 <path d="M-60 17H-22M322 17H360" stroke="${C.gold}" stroke-width="3"/>
 <text x="150" y="62" font-size="11" fill="#9fded9" text-anchor="middle" font-family="Plex">C18 · 150 × 4.6 mm · 5 µm</text>
</g>
</svg>
<div style="position:absolute;right:30mm;left:22mm;top:44mm;text-align:right">
 <div style="color:${C.gold};font-weight:700;font-size:11.5pt">هندبوک رایگان هفته — شماره 1 · ویرایش 1.0</div>
 <div style="margin-top:8mm;font-size:46pt;font-weight:800;line-height:1.15;direction:ltr;text-align:right;font-family:Plex;letter-spacing:1pt;color:#ecd27f">HPLC</div>
 <div style="font-size:21pt;font-weight:800;line-height:1.5;margin-top:2mm">راهنمای کاربردی کروماتوگرافی مایع با کارایی بالا</div>
 <div style="font-size:14pt;font-weight:500;color:#cfe9e7;margin-top:3mm;line-height:1.8">از مبانی جداسازی تا عیب‌یابی سیستماتیک<br>ویژه کارشناسان واحد کنترل کیفیت</div>
 <div style="font-size:10pt;color:#9fb3c8;margin-top:4mm;direction:ltr;text-align:right">High-Performance Liquid Chromatography — An Applied Handbook for the QC Laboratory</div>
 <div style="width:62mm;height:1.2pt;background:${C.gold};margin:8mm 0 7mm auto"></div>
 <div style="font-size:10.5pt;line-height:2.25;color:#e6eef6">
  ${[["مبانی جداسازی، پارامترهای کروماتوگرافی و معادله تفکیک", "اجزای دستگاه، ستون‌ها و Detector‌ها"], ["فاز متحرک، الزامات فارماکوپه و System Suitability", "صحه‌گذاری، Qualification و یکپارچگی داده"], ["عیب‌یابی سیستماتیک و 12 مطالعه موردی", "مسائل محاسباتی حل‌شده و پرسش‌های ارزیابی"]]
    .map((r) => `<div>${r.map((x) => `<span style="color:${C.gold}">◆</span> ${x}`).join("&emsp;&ensp;")}</div>`).join("")}
 </div>
</div>
<div style="position:absolute;right:30mm;bottom:16mm;display:flex;align-items:center;gap:10pt">
 <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="${C.navy}" stroke="#2cc4bc" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" stroke-width="1.6"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>
 <div style="line-height:1.6"><div style="font-weight:800;font-size:12pt;direction:ltr;text-align:right;font-family:Plex">Pharma<span style="color:${C.gold}">Vault</span></div><div style="font-size:9pt;color:#b9c9da">گنجینه اطلاعات داروسازی · <span style="direction:ltr;unicode-bidi:isolate;color:${C.gold}">pharmavault.ir</span> · مهر 1405</div><div style="font-size:7.6pt;color:#8fa3b8;margin-top:1pt">دانلود رایگان · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</div></div>
</div>
</div>`;
};
