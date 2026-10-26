import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { css, toc, fontFaces, C } from "./lib.mjs";

// Intermediate files and the finished PDF go to ./out (not committed).
const dir = new URL("./out/", import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
const only = process.argv.includes("--preview");
const parts = (await import("./parts.mjs")).default(only);
const rights = (await import("./ch/rights.mjs")).default();
const bodyParts = [];
for (const f of parts) bodyParts.push((await import(`./ch/${f}.mjs`)).default());
const cover = (await import("./ch/cover.mjs")).default();

const RUN = "راهنمای کاربردی آزمون انحلال (Dissolution)";
const doc = (inner, title = "Dissolution — PharmaVault") =>
  `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>${css()}</style></head><body>${inner}</body></html>`;

const tocHtml = (pages) => {
  let h = `<section class="chap" style="break-before:auto"><div class="eyebrow">فهرست</div><h1>فهرست مطالب</h1><div class="sub">Contents</div></section><div class="toc">`;
  for (const e of toc) {
    const pg = pages[e.id] ?? "00";
    h += e.level === 1 ? `<div class="c"><span>${e.title}</span><span class="pg">${pg}</span></div>` : `<div class="s"><span>${e.title}</span><span class="pg">${pg}</span></div>`;
  }
  return h + `</div>`;
};

const hf = (inner) => `<style>${fontFaces()}*{font-family:"Plex","Estedad";-webkit-print-color-adjust:exact}</style>${inner}`;
const headerTemplate = hf(`<div style="width:100%;margin:0 17mm;padding-top:7mm;display:flex;justify-content:space-between;font-size:7.5pt;color:${C.muted};direction:rtl;border-bottom:.6pt solid ${C.gold};padding-bottom:2mm"><span style="color:${C.tealD};font-weight:700">${RUN}</span><span style="direction:ltr;color:${C.goldD};font-weight:700">pharmavault.ir</span></div>`);
const footerTemplate = hf(`<div style="width:100%;margin:0 17mm;padding-bottom:6mm;display:flex;justify-content:space-between;align-items:center;font-size:7.5pt;color:${C.muted};direction:rtl"><span>© PharmaVault · هرگونه کپی‌برداری و بازنشر بدون مجوز ممنوع است</span><span style="background:${C.navy};color:#fff;border-radius:8pt;padding:1pt 8pt;font-weight:700" class="pageNumber"></span></div>`);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
async function render(html, out, opts) {
  writeFileSync(out.replace(/\.pdf$/, ".html"), html);
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: "A4", printBackground: true, ...opts });
}
const bodyOpts = { margin: { top: "24mm", bottom: "19mm", left: "17mm", right: "17mm" }, displayHeaderFooter: true, headerTemplate, footerTemplate };
const body = bodyParts.join("");

await render(doc(rights + tocHtml({}) + body), dir + "pass1.pdf", bodyOpts);
const n = Number(/Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [dir + "pass1.pdf"]).toString())[1]);
const pages = {};
for (let i = 1; i <= n; i++) {
  const t = execFileSync("pdftotext", ["-f", String(i), "-l", String(i), dir + "pass1.pdf", "-"]).toString();
  for (const m of t.matchAll(/ZQ[A-J]+QZ/g)) pages[m[0]] ??= i;
}
await render(doc(rights + tocHtml(pages) + body), dir + "body.pdf", bodyOpts);
await render(doc(cover, "Dissolution"), dir + "cover.pdf", { margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await render(doc((await import("./ch/bg.mjs")).default()), dir + "bg.pdf", { margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await browser.close();

const q = (...a) => execFileSync("qpdf", a, { cwd: dir, stdio: "inherit" });
q("body.pdf", "--underlay", "bg.pdf", "--repeat=1", "--", "body-bg.pdf");
q("--empty", "--pages", "cover.pdf", "body-bg.pdf", "--", "merged.pdf");
execFileSync("python3", ["-I", "-c", `
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject
r=PdfReader("merged.pdf");w=PdfWriter(clone_from=r)
# Without ToUnicode maps, copied or extracted text is meaningless glyph codes.
seen=set()
def strip(res):
    if res is None: return
    res=res.get_object()
    fonts=res.get("/Font")
    if fonts:
        for f in fonts.get_object().values():
            f=f.get_object()
            if id(f) in seen: continue
            seen.add(id(f))
            if "/ToUnicode" in f: del f[NameObject("/ToUnicode")]
            for d in f.get("/DescendantFonts",[]): pass
    xo=res.get("/XObject")
    if xo:
        for x in xo.get_object().values():
            x=x.get_object()
            if "/Resources" in x and id(x) not in seen:
                seen.add(id(x)); strip(x["/Resources"])
for pg in w.pages: strip(pg.get("/Resources"))
w.compress_identical_objects()
w.add_metadata({"/Title":"Dissolution — راهنمای کاربردی آزمون انحلال","/Author":"PharmaVault — pharmavault.ir","/Subject":"PharmaVault free weekly handbook","/Creator":"PharmaVault","/Producer":"PharmaVault"})
w.write("meta.pdf")`], { cwd: dir });
const owner = randomBytes(24).toString("hex");
const out = only ? "Dissolution-preview.pdf" : "PharmaVault-Dissolution-Handbook.pdf";
q("--encrypt", "", owner, "256", "--print=full", "--modify=none", "--extract=n", "--annotate=n", "--form=n", "--assemble=n", "--", "meta.pdf", out);
console.log("pages", n + 1, "->", out);
