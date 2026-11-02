import { C } from "../lib.mjs";
// Cover: navy field, a calibration line with its points and confidence band, an accuracy target and a chromatogram strip.
export default () => {
  const W = 794, H = 1123;
  // Calibration line across the lower band with a confidence band and points.
  const x0 = 60, x1 = 740, yb = 1050, yt = 860;
  const X = (c) => x0 + ((c - 60) / 80) * (x1 - x0); // 60–140 %
  const Y = (c) => yb - ((c - 60) / 80) * (yb - yt);
  const pts = [[80, -2], [80, 3], [90, 1], [100, -1], [100, 2], [110, 2], [120, -3], [120, 1]].map(([c, e]) => `<circle cx="${X(c).toFixed(1)}" cy="${(Y(c) + e).toFixed(1)}" r="5" fill="${C.navy}" stroke="${C.gold}" stroke-width="2"/>`).join("");
  const band = `<path d="M${X(60)} ${Y(60) - 14}L${X(100)} ${Y(100) - 8}L${X(140)} ${Y(140) - 14}L${X(140)} ${Y(140) + 14}L${X(100)} ${Y(100) + 8}L${X(60)} ${Y(60) + 14}Z" fill="${C.teal}" fill-opacity=".18"/>`;
  const hexes = Array.from({ length: 7 }, (_, i) => {
    const x = 590 + (i % 3) * 52 + (Math.floor(i / 3) % 2) * 26, y = 90 + Math.floor(i / 3) * 45;
    return `<path d="M${x} ${y - 30} ${x + 26} ${y - 15}v30L${x} ${y + 30} ${x - 26} ${y + 15}v-30Z" fill="none" stroke="${C.teal}" stroke-opacity=".35" stroke-width="1.2"/>`;
  }).join("");
  // Accuracy / precision target.
  const target = `<g transform="translate(150 760)">
 ${[62, 46, 30, 14].map((r, i) => `<circle r="${r}" fill="none" stroke="${i % 2 ? C.teal : C.gold}" stroke-width="2" stroke-opacity=".8"/>`).join("")}
 ${[[-4, 3], [5, -2], [2, 6], [-6, -4], [7, 4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#ecd27f"/>`).join("")}
 <text y="92" font-size="11" fill="#9fded9" text-anchor="middle" font-family="Plex">accurate &amp; precise</text>
</g>`;
  return `<div style="position:relative;width:210mm;height:296.5mm;overflow:hidden;background:radial-gradient(circle at 15% 20%,${C.navy3} 0%,${C.navy} 45%,#06111f 100%);color:#fff">
<div style="position:absolute;top:0;bottom:0;right:0;width:16mm;background:linear-gradient(${C.gold},${C.goldD})"></div>
<div style="position:absolute;top:0;bottom:0;right:16mm;width:2.2mm;background:${C.teal}"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${hexes}
<defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="${C.teal}"/><stop offset="1" stop-color="${C.gold}"/></linearGradient></defs>
${band}
<line x1="${X(60)}" y1="${Y(60)}" x2="${X(140)}" y2="${Y(140)}" stroke="url(#cg)" stroke-width="2.6"/>
${pts}
<text x="${X(140) - 4}" y="${Y(140) - 24}" font-size="11" fill="${C.gold}" font-family="Plex" text-anchor="end">y = a + bx · 80–120 %</text>
${target}
</svg>
<div style="position:absolute;right:30mm;left:22mm;top:44mm;text-align:right">
 <div style="color:${C.gold};font-weight:700;font-size:11.5pt">هندبوک رایگان هفته — شماره 3 · ویرایش 1.0</div>
 <div style="margin-top:8mm;font-size:38pt;font-weight:800;line-height:1.15;direction:ltr;text-align:right;font-family:Plex;letter-spacing:.5pt;color:#ecd27f">Method Validation</div>
 <div style="font-size:21pt;font-weight:800;line-height:1.5;margin-top:2mm">راهنمای کاربردی صحه‌گذاری روش‌های آنالیز</div>
 <div style="font-size:14pt;font-weight:500;color:#cfe9e7;margin-top:3mm;line-height:1.8">از ICH Q2(R2) و Q14 تا Verification و انتقال روش<br>ویژه کارشناسان کنترل کیفیت، تضمین کیفیت و تحقیق و توسعه</div>
 <div style="font-size:10pt;color:#9fb3c8;margin-top:4mm;direction:ltr;text-align:right">Validation of Analytical Procedures — An Applied Handbook for QC, QA and R&amp;D</div>
 <div style="width:62mm;height:1.2pt;background:${C.gold};margin:8mm 0 7mm auto"></div>
 <div style="font-size:10.5pt;line-height:2.25;color:#e6eef6">
  ${[["چرخه عمر روش، ICH Q2(R2) و Q14", "Specificity و Forced degradation"], ["Range، Response، Accuracy و Precision", "DL، QL، Robustness و System suitability"], ["Verification، Transfer و Revalidation", "10 مطالعه موردی و مسائل محاسباتی"]]
    .map((r) => `<div>${r.map((x) => `<span style="color:${C.gold}">◆</span> ${x}`).join("&emsp;&ensp;")}</div>`).join("")}
 </div>
</div>
<div style="position:absolute;right:30mm;bottom:16mm;display:flex;align-items:center;gap:10pt">
 <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="${C.navy}" stroke="#2cc4bc" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" stroke-width="1.6"/><circle cx="20" cy="18" r="2.6" fill="#dcbd6d"/><path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d"/></svg>
 <div style="line-height:1.6"><div style="font-weight:800;font-size:12pt;direction:ltr;text-align:right;font-family:Plex">Pharma<span style="color:${C.gold}">Vault</span></div><div style="font-size:9pt;color:#b9c9da">گنجینه اطلاعات داروسازی · <span style="direction:ltr;unicode-bidi:isolate;color:${C.gold}">pharmavault.ir</span> · آبان 1405</div><div style="font-size:7.6pt;color:#8fa3b8;margin-top:1pt">دانلود رایگان · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</div></div>
</div>
</div>`;
};
