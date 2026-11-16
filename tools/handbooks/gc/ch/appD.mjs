import { chapter, h2, p } from "../lib.mjs";

const list = (xs) => `<ol class="refs">${xs.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export default () => `
${chapter("پیوست د", "منابع و مطالعه بیشتر", "Appendix D — References and further reading")}
${h2("کتاب‌های مرجع")}
${list([
  "McNair H.M., Miller J.M., Snow N.H. <i>Basic Gas Chromatography</i>, 3rd ed. Wiley, 2019.",
  "Kolb B., Ettre L.S. <i>Static Headspace–Gas Chromatography: Theory and Practice</i>, 2nd ed. Wiley, 2006.",
  "Grob R.L., Barry E.F. (eds.) <i>Modern Practice of Gas Chromatography</i>, 4th ed. Wiley, 2004.",
  "Poole C.F. (ed.) <i>Gas Chromatography</i>, 2nd ed. Elsevier, 2021.",
  "Rood D. <i>The Troubleshooting and Maintenance Guide for Gas Chromatographers</i>, 4th ed. Wiley-VCH, 2007.",
  "Jennings W., Mittlefehldt E., Stremple P. <i>Analytical Gas Chromatography</i>, 2nd ed. Academic Press, 1997.",
])}
${h2("مقالات کلیدی")}
${list([
  "van Deemter J.J., Zuiderweg F.J., Klinkenberg A. Longitudinal diffusion and resistance to mass transfer as causes of nonideality in chromatography. <i>Chem. Eng. Sci.</i> 5 (1956) 271–289.",
  "Golay M.J.E. Theory of chromatography in open and coated tubular columns with round and rectangular cross-sections. In: Desty D.H. (ed.) <i>Gas Chromatography 1958</i>. Butterworths, London, 1958.",
  "Kováts E. Gas-chromatographische Charakterisierung organischer Verbindungen. Teil 1. <i>Helv. Chim. Acta</i> 41 (1958) 1915–1932.",
  "van den Dool H., Kratz P.D. A generalization of the retention index system including linear temperature programmed gas–liquid partition chromatography. <i>J. Chromatogr.</i> 11 (1963) 463–471.",
])}
${h2("فارماکوپه‌ها و گایدلاین‌ها")}
${list([
  "USP General Chapter &lt;621&gt; Chromatography (harmonized text, official 1 December 2022); Ph. Eur. 2.2.46 Chromatographic separation techniques; Ph. Eur. 2.2.28 Gas chromatography.",
  "USP General Chapter &lt;467&gt; Residual Solvents; Ph. Eur. 2.4.24 Identification and control of residual solvents; Ph. Eur. 5.4 Residual solvents.",
  "ICH Q3C(R9) Impurities: Guideline for Residual Solvents (EMA/CHMP/ICH/82260/2006).",
  "ICH M7(R2) Assessment and Control of DNA Reactive (Mutagenic) Impurities in Pharmaceuticals to Limit Potential Carcinogenic Risk.",
  "Ph. Eur. 2.4.22 Composition of fatty acids by gas chromatography; Ph. Eur. 2.4.25 Ethylene oxide and dioxan; USP &lt;611&gt; Alcohol Determination.",
  "US FDA. Testing of Glycerin, Propylene Glycol, Maltitol Solution, Hydrogenated Starch Hydrolysate, Sorbitol Solution, and other High-Risk Drug Components for Diethylene Glycol and Ethylene Glycol. Guidance for Industry, May 2023.",
  "US FDA. Control of Nitrosamine Impurities in Human Drugs. Guidance for Industry (current revision).",
  "USP General Chapters &lt;1058&gt; Analytical Instrument Qualification; &lt;1224&gt; Transfer of Analytical Procedures; &lt;1225&gt; Validation of Compendial Procedures; &lt;1226&gt; Verification of Compendial Procedures.",
  "ICH Q2(R2) Validation of Analytical Procedures (2023); ICH Q14 Analytical Procedure Development (2023).",
  "US FDA. Data Integrity and Compliance With Drug CGMP — Questions and Answers. Guidance for Industry, 2018.",
])}
${p("<span style=\"font-size:8.6pt;color:#5b6b7f\">یادداشت: کادرهای «از منابع مرجع» خلاصه و بازنویسی مفاهیم منابع فوق‌اند و نقل‌قول مستقیم محسوب نمی‌شوند. همه شکل‌ها برای این هندبوک ترسیم شده‌اند و داده‌های آن‌ها نمایشی است. در تصمیم‌های رسمی، متن نسخه جاری فارماکوپه‌ها و گایدلاین‌ها ملاک است.</span>")}
<div style="margin-top:18pt;padding:12pt 14pt;border-radius:6pt;background:linear-gradient(120deg,#0b1f3a,#12305a);color:#fff;text-align:center;break-inside:avoid">
<div style="font-weight:800;font-size:12pt;color:#ecd27f">PharmaVault — گنجینه اطلاعات داروسازی</div>
<div style="font-size:9.4pt;color:#cfe9e7;margin-top:3pt">هر هفته یک هندبوک تخصصی رایگان · <span style="direction:ltr;unicode-bidi:isolate;color:#ecd27f">pharmavault.ir</span></div>
</div>
`;
