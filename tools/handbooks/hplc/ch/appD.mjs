import { chapter, h2, p } from "../lib.mjs";

const list = (xs) => `<ol class="refs">${xs.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export default () => `
${chapter("پیوست د", "منابع و مطالعه بیشتر", "Appendix D — References and further reading")}
${h2("کتاب‌های مرجع")}
${list([
  "Snyder L.R., Kirkland J.J., Dolan J.W. <i>Introduction to Modern Liquid Chromatography</i>, 3rd ed. Wiley, 2010.",
  "Snyder L.R., Kirkland J.J., Glajch J.L. <i>Practical HPLC Method Development</i>, 2nd ed. Wiley, 1997.",
  "Dolan J.W., Snyder L.R. <i>Troubleshooting LC Systems</i>. Humana Press, 1989.",
  "Meyer V.R. <i>Practical High-Performance Liquid Chromatography</i>, 5th ed. Wiley, 2010.",
  "Kazakevich Y., LoBrutto R. (eds.) <i>HPLC for Pharmaceutical Scientists</i>. Wiley, 2007.",
  "Dong M.W. <i>HPLC and UHPLC for Practicing Scientists</i>, 2nd ed. Wiley, 2019.",
  "Neue U.D. <i>HPLC Columns: Theory, Technology, and Practice</i>. Wiley-VCH, 1997.",
  "McMaster M.C. <i>HPLC: A Practical User's Guide</i>, 2nd ed. Wiley, 2007.",
])}
${h2("مقالات کلیدی")}
${list([
  "van Deemter J.J., Zuiderweg F.J., Klinkenberg A. Longitudinal diffusion and resistance to mass transfer as causes of nonideality in chromatography. <i>Chem. Eng. Sci.</i> 5 (1956) 271–289.",
  "Snyder L.R., Dolan J.W., Carr P.W. The hydrophobic-subtraction model of reversed-phase column selectivity. <i>J. Chromatogr. A</i> 1060 (2004) 77–116.",
  "McCalley D.V. The challenges of the analysis of basic compounds by high performance liquid chromatography: some possible approaches for improved separations. <i>J. Chromatogr. A</i> 1217 (2010) 858–880.",
  "Gritti F., Guiochon G. The van Deemter equation: assumptions, limits, and adjustment to modern high performance liquid chromatography. <i>J. Chromatogr. A</i> 1302 (2013) 1–13.",
  "Dolan J.W. Temperature selectivity in reversed-phase high performance liquid chromatography. <i>J. Chromatogr. A</i> 965 (2002) 195–205.",
  "Dolan J.W. <i>LC Troubleshooting</i> (column series). LCGC North America.",
])}
${h2("فارماکوپه‌ها و گایدلاین‌ها")}
${list([
  "USP General Chapter &lt;621&gt; Chromatography (harmonized text).",
  "Ph. Eur. 2.2.46 Chromatographic separation techniques; 2.2.29 Liquid chromatography.",
  "USP General Chapters &lt;1058&gt; Analytical Instrument Qualification; &lt;1220&gt; Analytical Procedure Life Cycle; &lt;1224&gt; Transfer of Analytical Procedures; &lt;1225&gt; Validation of Compendial Procedures; &lt;1226&gt; Verification of Compendial Procedures.",
  "ICH Q2(R2) Validation of Analytical Procedures (2023); ICH Q14 Analytical Procedure Development (2023).",
  "ICH Q3A(R2) Impurities in New Drug Substances; ICH Q3B(R2) Impurities in New Drug Products.",
  "US FDA. Data Integrity and Compliance With Drug CGMP — Questions and Answers. Guidance for Industry, 2018.",
  "US FDA. Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production. Guidance for Industry, 2006 (rev. 2022).",
  "MHRA. GXP Data Integrity Guidance and Definitions, 2018; PIC/S PI 041-1 Good Practices for Data Management and Integrity in Regulated GMP/GDP Environments, 2021.",
])}
${p("<span style=\"font-size:8.6pt;color:#5b6b7f\">یادداشت: کادرهای «از منابع مرجع» خلاصه و بازنویسی مفاهیم منابع فوق‌اند و نقل‌قول مستقیم محسوب نمی‌شوند. همه شکل‌ها برای این هندبوک ترسیم شده‌اند و داده‌های آن‌ها نمایشی است. در تصمیم‌های رسمی، متن نسخه جاری فارماکوپه‌ها و گایدلاین‌ها ملاک است.</span>")}
<div style="margin-top:18pt;padding:12pt 14pt;border-radius:6pt;background:linear-gradient(120deg,#0b1f3a,#12305a);color:#fff;text-align:center;break-inside:avoid">
<div style="font-weight:800;font-size:12pt;color:#ecd27f">PharmaVault — گنجینه اطلاعات داروسازی</div>
<div style="font-size:9.4pt;color:#cfe9e7;margin-top:3pt">هر هفته یک هندبوک تخصصی رایگان · <span style="direction:ltr;unicode-bidi:isolate;color:#ecd27f">pharmavault.ir</span></div>
</div>
`;
