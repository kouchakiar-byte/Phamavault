/*
 * A minimal Excel (.xlsx, Office Open XML) writer: several sheets of text and numbers, a bold
 * header row that stays in place, an autofilter, column widths and right-to-left sheets for
 * Persian (cells read right to left, so mixed Persian and English keep their order). Strings are written inline, so no shared-strings table is needed; the package is the
 * store-only zip of the Word writer, so no library is needed either.
 */
import { zip } from "./docx";

export type XCell = string | number | null | undefined;
export type XSheet = {
  name: string;
  /** Column headers; the first row of the sheet. */
  head: string[];
  rows: XCell[][];
  /** Column widths in characters; a missing width is worked out from the content. */
  widths?: number[];
  rtl?: boolean;
};

const esc = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
/** Excel column letters: 0 → A, 26 → AA. */
const col = (i: number): string => (i < 26 ? String.fromCharCode(65 + i) : col(Math.floor(i / 26) - 1) + col(i % 26));
/** Sheet names: at most 31 characters, none of : \ / ? * [ ], and unique in the workbook. */
function sheetNames(sheets: XSheet[]): string[] {
  const used = new Set<string>();
  return sheets.map((s, i) => {
    const base = (s.name.replace(/[:\\/?*[\]]/g, " ").trim() || `Sheet${i + 1}`).slice(0, 31);
    let name = base;
    for (let n = 2; used.has(name.toLowerCase()); n++) name = `${base.slice(0, 31 - String(n).length - 1)} ${n}`;
    used.add(name.toLowerCase());
    return name;
  });
}

function sheetXml(s: XSheet): string {
  const cols = s.head.length;
  const widths = Array.from({ length: cols }, (_, c) => {
    if (s.widths?.[c]) return s.widths[c];
    const longest = Math.max(String(s.head[c] ?? "").length, ...s.rows.slice(0, 200).map((r) => String(r[c] ?? "").length));
    return Math.min(60, Math.max(8, longest + 2));
  });
  const cell = (v: XCell, ref: string, style = 0) => {
    const st = style ? ` s="${style}"` : "";
    if (typeof v === "number" && Number.isFinite(v)) return `<c r="${ref}"${st}><v>${v}</v></c>`;
    if (v === null || v === undefined || v === "") return style ? `<c r="${ref}"${st}/>` : "";
    return `<c r="${ref}"${st} t="inlineStr"><is><t xml:space="preserve">${esc(String(v))}</t></is></c>`;
  };
  const rows = [s.head, ...s.rows].map((r, ri) => {
    const cells = Array.from({ length: cols }, (_, c) => cell(r[c], `${col(c)}${ri + 1}`, ri === 0 ? 1 : 2)).join("");
    return `<row r="${ri + 1}">${cells}</row>`;
  });
  const last = `${col(Math.max(0, cols - 1))}${s.rows.length + 1}`;
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheetViews><sheetView workbookViewId="0"${s.rtl === false ? "" : ` rightToLeft="1"`}><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>` +
    `<sheetData>${rows.join("")}</sheetData>` +
    (s.rows.length ? `<autoFilter ref="A1:${last}"/>` : "") +
    `</worksheet>`
  );
}

const STYLES =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
  `<fonts count="2"><font><sz val="11"/><name val="Tahoma"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Tahoma"/></font></fonts>` +
  `<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B1F3A"/><bgColor indexed="64"/></patternFill></fill></fills>` +
  `<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD9DEE7"/></left><right style="thin"><color rgb="FFD9DEE7"/></right><top style="thin"><color rgb="FFD9DEE7"/></top><bottom style="thin"><color rgb="FFD9DEE7"/></bottom><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="3">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1" readingOrder="2"/></xf>` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1" readingOrder="2"/></xf>` +
  `</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`;

/** The workbook as the bytes of an .xlsx file. */
export function xlsx(sheets: XSheet[], meta: { title?: string; author?: string } = {}): Uint8Array {
  const enc = new TextEncoder();
  const names = sheetNames(sheets);
  const f = (name: string, text: string) => ({ name, data: enc.encode(text) });
  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  return zip([
    f("[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>` +
      `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
      `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
      `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
      sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("") +
      `</Types>`),
    f("_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
      `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
      `</Relationships>`),
    f("docProps/core.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
      `<dc:title>${esc(meta.title ?? "")}</dc:title><dc:creator>${esc(meta.author ?? "PharmaVault")}</dc:creator>` +
      `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`),
    f("xl/workbook.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
      `<bookViews><workbookView/></bookViews><sheets>` +
      names.map((n, i) => `<sheet name="${esc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("") +
      `</sheets></workbook>`),
    f("xl/_rels/workbook.xml.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("") +
      `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      `</Relationships>`),
    f("xl/styles.xml", STYLES),
    ...sheets.map((s, i) => f(`xl/worksheets/sheet${i + 1}.xml`, sheetXml(s))),
  ]);
}
