import { formsCopy as t, type QaForm } from "@/content/qa-forms";
import type { Locale } from "@/i18n/config";
import { isolateLatin, isolateText } from "./bidi";
import type { DocBlock, DocModel } from "./docx";

export type CheckValue = "yes" | "no" | "na";
export type FormValues = Record<string, string | string[] | Record<string, CheckValue> | string[][]>;
export type FormMeta = { company: string; code: string; rev: string; effective: string; logo?: { dataUrl: string; png: Uint8Array; width: number; height: number } };

/** The document of a filled form, shared by the preview, the print view and the Word file. */
export function formDocument(form: QaForm, values: FormValues, meta: FormMeta, locale: Locale): DocModel {
  const rtl = locale === "fa";
  // In a right-to-left document a wholly Latin string is isolated as one run too ("☑ 5 Whys").
  const tx = (s: string) => (rtl ? isolateText(s) : isolateLatin(s));
  const L = (b: { en: string; fa: string }) => tx(b[locale]);
  const blocks: DocBlock[] = [];

  blocks.push({ kind: "para", text: L(form.purpose) });
  for (const section of form.sections) {
    blocks.push({ kind: "heading", text: L(section.title) });
    let simple: string[][] = [];
    const flush = () => {
      if (simple.length) blocks.push({ kind: "table", rows: simple, widths: [1, 2], labelColumn: true });
      simple = [];
    };
    for (const f of section.fields) {
      const v = values[f.id];
      if (f.type === "text" || f.type === "date" || f.type === "select") simple.push([L(f.label), tx(typeof v === "string" ? v : "")]);
      else if (f.type === "multi") {
        const chosen = Array.isArray(v) ? (v as string[]) : [];
        simple.push([L(f.label), f.options.map((o) => `${chosen.includes(o.en) ? "☑" : "☐"} ${L(o)}`).join("\n")]);
      } else if (f.type === "textarea") {
        flush();
        blocks.push({ kind: "para", label: L(f.label), text: tx(typeof v === "string" ? v : ""), boxed: true });
      } else if (f.type === "check") {
        flush();
        const answers = (v && !Array.isArray(v) && typeof v === "object" ? v : {}) as Record<string, CheckValue>;
        const mark = (a?: CheckValue) => (a === "yes" ? `☑ ${L(t.yes)}` : a === "no" ? `☒ ${L(t.no)}` : a === "na" ? L(t.na) : "☐");
        blocks.push({
          kind: "table",
          columns: ["#", L(f.label), L(t.resultCol)],
          rows: f.items.map((item, i) => [String(i + 1), L(item), mark(answers[String(i)])]),
          widths: [0.45, 5, 1.3],
        });
      } else if (f.type === "table") {
        flush();
        const grid = Array.isArray(v) && Array.isArray(v[0]) ? (v as string[][]) : [];
        const n = Math.max(f.rows, grid.length);
        blocks.push({ kind: "para", label: L(f.label), text: "" });
        blocks.push({
          kind: "table",
          columns: ["#", ...f.columns.map(L)],
          rows: Array.from({ length: n }, (_, r) => [String(r + 1), ...f.columns.map((_, c) => tx(grid[r]?.[c] ?? ""))]),
          widths: [0.45, ...f.columns.map((_, c) => (c === 0 ? 4 : 1.4))],
        });
      }
    }
    flush();
  }
  blocks.push({ kind: "heading", text: L({ en: "Approval", fa: "تأیید" }) });
  blocks.push({
    kind: "table",
    columns: [L(t.role), L(t.name), L(t.signature), L(t.date)],
    rows: form.signatures.map((s) => [L(s), "", "", ""]),
    widths: [1.6, 1.6, 1.4, 1],
    tall: true,
  });

  return {
    rtl,
    header: {
      company: tx(meta.company || "—"),
      title: L(form.title),
      meta: [
        [L(t.docNo), meta.code || form.code],
        [L(t.rev), meta.rev || "00"],
        [L(t.effective), meta.effective || "—"],
        [L(t.sop), form.sop],
      ],
    },
    logo: meta.logo ? { png: meta.logo.png, width: meta.logo.width, height: meta.logo.height } : undefined,
    blocks,
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const br = (s: string) => esc(s).replace(/\n/g, "<br>");

/** A standalone HTML page of the document, for the preview frame and for printing. */
export function documentHtml(doc: DocModel, logoUrl?: string): string {
  const dir = doc.rtl ? "rtl" : "ltr";
  const blocks = doc.blocks
    .map((b) => {
      if (b.kind === "heading") return `<h2>${br(b.text)}</h2>`;
      if (b.kind === "para") {
        const label = b.label ? `<p class="label">${br(b.label)}</p>` : "";
        return label + (b.boxed ? `<div class="box" dir="auto">${br(b.text) || "&nbsp;"}</div>` : b.text ? `<p dir="auto">${br(b.text)}</p>` : "");
      }
      const widths = b.widths ?? [];
      const sum = widths.reduce((a, c) => a + c, 0) || 1;
      const cols = widths.length ? `<colgroup>${widths.map((w) => `<col style="width:${((w / sum) * 100).toFixed(1)}%">`).join("")}</colgroup>` : "";
      const head = b.columns ? `<thead><tr>${b.columns.map((c) => `<th>${br(c)}</th>`).join("")}</tr></thead>` : "";
      const rows = b.rows.map((r) => `<tr${b.tall ? ' class="tall"' : ""}>${r.map((c, i) => (b.labelColumn && i === 0 ? `<th>${br(c)}</th>` : `<td dir="auto">${br(c)}</td>`)).join("")}</tr>`).join("");
      return `<table>${cols}${head}<tbody>${rows}</tbody></table>`;
    })
    .join("");
  const logo = logoUrl ? `<img src="${logoUrl}" alt="">` : "";
  const meta = doc.header.meta.map(([k, v]) => `<div>${br(k)}: <b>${br(v)}</b></div>`).join("");
  return `<!doctype html><html dir="${dir}" lang="${doc.rtl ? "fa" : "en"}"><head><meta charset="utf-8"><title>${br(doc.header.title)}</title><style>
@font-face{font-family:Estedad;src:url(/fonts/Estedad-Regular.woff2) format("woff2");font-weight:400}
@font-face{font-family:Estedad;src:url(/fonts/Estedad-Bold.woff2) format("woff2");font-weight:700}
@page{size:A4;margin:16mm}
*{box-sizing:border-box}
body{margin:0;padding:18px;font-family:Estedad,Tahoma,sans-serif;font-size:12px;line-height:1.7;color:#0b1f3a;background:#fff}
.head{display:grid;grid-template-columns:1.1fr 2.6fr 1.5fr;border:2px solid #0b1f3a;margin-bottom:10px}
.head>div{padding:8px 10px;border-inline-start:2px solid #0b1f3a;display:flex;flex-direction:column;justify-content:center}
.head>div:first-child{border-inline-start:0;align-items:center}
.head img{max-width:100%;max-height:60px}
.company{font-weight:700;font-size:15px;text-align:center}
.title{font-weight:700;font-size:14px;color:#0e7f7a;text-align:center}
.meta{font-size:11px}
h2{font-size:13.5px;color:#0e7f7a;margin:16px 0 6px;break-after:avoid}
p{margin:4px 0}
.label{font-weight:700;margin-top:8px}
.box{border:1px solid #9aa9bc;min-height:56px;padding:6px 8px;white-space:normal}
table{width:100%;border-collapse:collapse;table-layout:fixed;margin:4px 0}
th,td{border:1px solid #9aa9bc;padding:4px 7px;vertical-align:middle;text-align:start;word-wrap:break-word}
th{background:#eef3f8;font-weight:700}
tr{break-inside:avoid}
tr.tall td,tr.tall th{height:34px}
</style></head><body><div class="head"><div>${logo}</div><div><div class="company">${br(doc.header.company)}</div><div class="title">${br(doc.header.title)}</div></div><div class="meta">${meta}</div></div>${blocks}</body></html>`;
}
