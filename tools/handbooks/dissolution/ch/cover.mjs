import { C } from "../lib.mjs";
// Cover: navy field, teal and gold accents, a dissolution vessel with its paddle and a release profile drawn in line.
export default () => {
  const W = 794, H = 1123;
  // Release profile (first-order) across the lower band.
  let d = "";
  for (let x = 0; x <= W; x += 3) {
    const t = x / W;
    const y = 1040 - 150 * (1 - Math.exp(-5.2 * t));
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  const dots = [0.08, 0.16, 0.25, 0.38, 0.55, 0.75, 0.95].map((t) => {
    const x = t * W, y = 1040 - 150 * (1 - Math.exp(-5.2 * t));
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${C.navy}" stroke="${C.gold}" stroke-width="2"/>`;
  }).join("");
  const hexes = Array.from({ length: 7 }, (_, i) => {
    const x = 590 + (i % 3) * 52 + (Math.floor(i / 3) % 2) * 26, y = 90 + Math.floor(i / 3) * 45;
    return `<path d="M${x} ${y - 30} ${x + 26} ${y - 15}v30L${x} ${y + 30} ${x - 26} ${y + 15}v-30Z" fill="none" stroke="${C.teal}" stroke-opacity=".35" stroke-width="1.2"/>`;
  }).join("");
  // Vessel with paddle, medium and a tablet.
  const vessel = `<g transform="translate(90 690) scale(0.8)">
 <path d="M0 0V190a70 70 0 0 0 140 0V0" fill="none" stroke="${C.gold}" stroke-width="3"/>
 <path d="M3 70V190a67 67 0 0 0 134 0V70Z" fill="${C.teal}" fill-opacity=".22"/>
 <path d="M3 70q17 -6 34 0t34 0t34 0t32 0" fill="none" stroke="#9fded9" stroke-width="1.6"/>
 <rect x="66" y="-60" width="8" height="215" fill="#cfd9e4"/>
 <path d="M40 155h60l-6 22H46Z" fill="#cfd9e4"/>
 <ellipse cx="70" cy="248" rx="14" ry="6" fill="#f4f6f9"/>
 <path d="M48 238q-8 -14 4 -22M92 238q8 -14 -4 -22" fill="none" stroke="#9fded9" stroke-width="1.4" stroke-dasharray="3 3"/>
 <text x="70" y="290" font-size="11" fill="#9fded9" text-anchor="middle" font-family="Plex">Apparatus 2 · 50 rpm · 37 °C</text>
</g>`;
  return `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden;background:radial-gradient(circle at 15% 20%,${C.navy3} 0%,${C.navy} 45%,#06111f 100%);color:#fff">
<div style="position:absolute;top:0;bottom:0;right:0;width:16mm;background:linear-gradient(${C.gold},${C.goldD})"></div>
<div style="position:absolute;top:0;bottom:0;right:16mm;width:2.2mm;background:${C.teal}"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${hexes}
<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="${C.teal}"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>
<linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.teal}" stop-opacity=".28"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></linearGradient></defs>
<path d="${d}L${W} 1040L0 1040Z" fill="url(#fill)"/>
<path d="${d}" fill="none" stroke="url(#cg)" stroke-width="2.6"/>
<line x1="0" y1="${(1040 - 150 * 0.85).toFixed(1)}" x2="${W}" y2="${(1040 - 150 * 0.85).toFixed(1)}" stroke="${C.gold}" stroke-opacity=".55" stroke-dasharray="6 6"/>
<text x="${W - 120}" y="${(1040 - 150 * 0.85 - 8).toFixed(1)}" font-size="11" fill="${C.gold}" font-family="Plex" text-anchor="end">85 % dissolved</text>
${dots}
${vessel}
</svg>
<div style="position:absolute;right:30mm;left:22mm;top:44mm;text-align:right">
 <div style="color:${C.gold};font-weight:700;font-size:11.5pt">هندبوک رایگان هفته — شماره 2 · ویرایش 1.0</div>
 <div style="margin-top:8mm;font-size:42pt;font-weight:800;line-height:1.15;direction:ltr;text-align:right;font-family:Plex;letter-spacing:.5pt;color:#ecd27f">Dissolution</div>
 <div style="font-size:21pt;font-weight:800;line-height:1.5;margin-top:2mm">راهنمای کاربردی آزمون انحلال</div>
 <div style="font-size:14pt;font-weight:500;color:#cfe9e7;margin-top:3mm;line-height:1.8">از مبانی و Qualification دستگاه تا Troubleshooting و مقایسه پروفایل<br>ویژه کارشناسان کنترل کیفیت و تحقیق و توسعه</div>
 <div style="font-size:10pt;color:#9fb3c8;margin-top:4mm;direction:ltr;text-align:right">Dissolution Testing of Oral Solid Dosage Forms — An Applied Handbook for QC and R&amp;D</div>
 <div style="width:62mm;height:1.2pt;background:${C.gold};margin:8mm 0 7mm auto"></div>
 <div style="font-size:10.5pt;line-height:2.25;color:#e6eef6">
  ${[["مبانی انحلال، Solubility و BCS", "Apparatus 1 تا 7 و Mechanical qualification"], ["Dissolution medium و توسعه روش Discriminating", "معیارهای پذیرش IR، ER و DR"], ["مقایسه پروفایل f2 و Biowaiver", "Troubleshooting، 10 مطالعه موردی و مسائل محاسباتی"]]
    .map((r) => `<div>${r.map((x) => `<span style="color:${C.gold}">◆</span> ${x}`).join("&emsp;&ensp;")}</div>`).join("")}
 </div>
</div>
<div style="position:absolute;right:30mm;bottom:16mm;display:flex;align-items:center;gap:10pt">
 <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="${C.navy}" stroke="#2cc4bc" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" stroke-width="1.6"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>
 <div style="line-height:1.6"><div style="font-weight:800;font-size:12pt;direction:ltr;text-align:right;font-family:Plex">Pharma<span style="color:${C.gold}">Vault</span></div><div style="font-size:9pt;color:#b9c9da">گنجینه اطلاعات داروسازی · <span style="direction:ltr;unicode-bidi:isolate;color:${C.gold}">pharmavault.ir</span> · آبان 1405</div><div style="font-size:7.6pt;color:#8fa3b8;margin-top:1pt">دانلود رایگان · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</div></div>
</div>
</div>`;
};
