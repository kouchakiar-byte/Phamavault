import { chapter, h2, p } from "../lib.mjs";

const list = (xs) => `<ol class="refs">${xs.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export default () => `
${chapter("پیوست د", "منابع و مطالعه بیشتر", "Appendix D — References and further reading")}
${h2("کتاب‌های مرجع")}
${list([
  "Dressman J., Krämer J. (eds.) <i>Pharmaceutical Dissolution Testing</i>. Taylor &amp; Francis, 2005.",
  "Hanson R., Gray V. <i>Handbook of Dissolution Testing</i>, 3rd ed. Dissolution Technologies, 2004.",
  "Dressman J.B., Reppas C. (eds.) <i>Oral Drug Absorption: Prediction and Assessment</i>, 2nd ed. Informa Healthcare, 2010.",
  "Shargel L., Yu A.B.C. <i>Applied Biopharmaceutics &amp; Pharmacokinetics</i>, 7th ed. McGraw-Hill, 2016.",
  "Aulton M.E., Taylor K.M.G. (eds.) <i>Aulton's Pharmaceutics: The Design and Manufacture of Medicines</i>, 6th ed. Elsevier, 2021.",
])}
${h2("مقالات کلیدی")}
${list([
  "Noyes A.A., Whitney W.R. The rate of solution of solid substances in their own solutions. <i>J. Am. Chem. Soc.</i> 19 (1897) 930–934.",
  "Amidon G.L., Lennernäs H., Shah V.P., Crison J.R. A theoretical basis for a biopharmaceutic drug classification. <i>Pharm. Res.</i> 12 (1995) 413–420.",
  "Moore J.W., Flanner H.H. Mathematical comparison of dissolution profiles. <i>Pharm. Technol.</i> 20 (1996) 64–74.",
  "Shah V.P., Tsong Y., Sathe P., Liu J.P. In vitro dissolution profile comparison — statistics and analysis of the similarity factor, f2. <i>Pharm. Res.</i> 15 (1998) 889–896.",
  "Kukura J., Arratia P.E., Szalai E.S., Muzzio F.J. Engineering tools for understanding the hydrodynamics of dissolution tests. <i>Drug Dev. Ind. Pharm.</i> 29 (2003) 231–239.",
  "Gray V. et al. The science of USP 1 and 2 dissolution: present challenges and future relevance. <i>Pharm. Res.</i> 26 (2009) 1289–1302.",
])}
${h2("فارماکوپه‌ها و گایدلاین‌ها")}
${list([
  "USP General Chapters &lt;711&gt; Dissolution; &lt;724&gt; Drug Release; &lt;1092&gt; The Dissolution Procedure: Development and Validation; &lt;1094&gt; Capsules — Dissolution Testing and Related Quality Attributes.",
  "Ph. Eur. 2.9.3 Dissolution test for solid dosage forms; 5.17.1 Recommendations on dissolution testing.",
  "ICH M9 Biopharmaceutics Classification System-Based Biowaivers (2019); ICH Q2(R2) Validation of Analytical Procedures (2023).",
  "US FDA. Dissolution Testing of Immediate Release Solid Oral Dosage Forms. Guidance for Industry, 1997.",
  "US FDA. Extended Release Oral Dosage Forms: Development, Evaluation, and Application of In Vitro/In Vivo Correlations. Guidance for Industry, 1997.",
  "US FDA. SUPAC-IR: Immediate-Release Solid Oral Dosage Forms — Scale-Up and Postapproval Changes. Guidance for Industry, 1995.",
  "US FDA. The Use of Mechanical Calibration of Dissolution Apparatus 1 and 2 — CGMP. Guidance for Industry, 2010.",
  "ASTM E2503 Standard Practice for Qualification of Basket and Paddle Dissolution Apparatus.",
  "EMA. Guideline on the Investigation of Bioequivalence. CPMP/EWP/QWP/1401/98 Rev. 1, 2010.",
])}
${p("<span style=\"font-size:8.6pt;color:#5b6b7f\">یادداشت: کادرهای «از منابع مرجع» خلاصه و بازنویسی مفاهیم منابع فوق‌اند و نقل‌قول مستقیم محسوب نمی‌شوند. همه شکل‌ها برای این هندبوک ترسیم شده‌اند و داده‌های آن‌ها نمایشی است. در تصمیم‌های رسمی، متن نسخه جاری فارماکوپه‌ها و گایدلاین‌ها ملاک است.</span>")}
<div style="margin-top:18pt;padding:12pt 14pt;border-radius:6pt;background:linear-gradient(120deg,#0b1f3a,#12305a);color:#fff;text-align:center;break-inside:avoid">
<div style="font-weight:800;font-size:12pt;color:#ecd27f">PharmaVault — گنجینه اطلاعات داروسازی</div>
<div style="font-size:9.4pt;color:#cfe9e7;margin-top:3pt">هر هفته یک هندبوک تخصصی رایگان · <span style="direction:ltr;unicode-bidi:isolate;color:#ecd27f">pharmavault.ir</span></div>
</div>
`;
