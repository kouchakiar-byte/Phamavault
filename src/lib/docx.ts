/*
 * A minimal Word (.docx, Office Open XML) writer for the GMP forms: headings,
 * paragraphs, bordered tables and one header logo, right-to-left for Persian.
 * The package is a store-only zip built here, so no library is needed.
 */

export type DocBlock =
  | { kind: "heading"; text: string }
  | { kind: "para"; label?: string; text: string; boxed?: boolean }
  | { kind: "table"; columns?: string[]; rows: string[][]; widths?: number[]; labelColumn?: boolean; tall?: boolean };

export type DocModel = {
  rtl: boolean;
  header: { company: string; title: string; meta: [string, string][] };
  logo?: { png: Uint8Array; width: number; height: number };
  blocks: DocBlock[];
};

// ---------- zip (store, no compression) ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint16(8, 0, true); // store
    local.setUint16(10, 0, true);
    local.setUint16(12, 0x21, true); // 1980-01-01
    local.setUint32(14, crc, true);
    local.setUint32(18, f.data.length, true);
    local.setUint32(22, f.data.length, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), name, f.data);

    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true);
    dir.setUint16(4, 20, true);
    dir.setUint16(6, 20, true);
    dir.setUint16(8, 0x0800, true);
    dir.setUint16(10, 0, true);
    dir.setUint16(12, 0, true);
    dir.setUint16(14, 0x21, true);
    dir.setUint32(16, crc, true);
    dir.setUint32(20, f.data.length, true);
    dir.setUint32(24, f.data.length, true);
    dir.setUint16(28, name.length, true);
    dir.setUint32(42, offset, true);
    central.push(new Uint8Array(dir.buffer), name);
    offset += 30 + name.length + f.data.length;
  }
  const centralSize = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of all) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

// ---------- document.xml ----------

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Isolates become left-to-right marks around each Latin run: every word processor honours them. */
const bidiText = (s: string) => s.replace(/[\u2066\u2069]/g, "\u200e");

const FULL_WIDTH = 9638; // A4 with 2 cm margins, in twips

const hasPersian = (s: string) => /[\u0600-\u06ff]/.test(s);

function run(text: string, docRtl: boolean, opts: { bold?: boolean; size?: number; color?: string } = {}): string {
  const size = opts.size ?? 20;
  const rtl = docRtl || hasPersian(text);
  const rPr = [
    `<w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma"/>`,
    opts.bold ? "<w:b/><w:bCs/>" : "",
    opts.color ? `<w:color w:val="${opts.color}"/>` : "",
    `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`,
    rtl ? "<w:rtl/>" : "",
    rtl ? `<w:lang w:bidi="fa-IR"/>` : "",
  ].join("");
  const lines = bidiText(text).split("\n");
  return lines.map((l, i) => `${i ? "<w:br/>" : ""}<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(l)}</w:t></w:r>`).join("");
}

function para(content: string, rtl: boolean, opts: { after?: number; before?: number; center?: boolean; keepNext?: boolean } = {}): string {
  const pPr = [
    opts.keepNext ? "<w:keepNext/>" : "",
    `<w:spacing w:before="${opts.before ?? 0}" w:after="${opts.after ?? 60}"/>`,
    rtl || content.includes("<w:rtl/>") ? "<w:bidi/>" : "",
    opts.center ? `<w:jc w:val="center"/>` : "",
  ].join("");
  return `<w:p><w:pPr>${pPr}</w:pPr>${content}</w:p>`;
}

function cell(content: string, width: number, fill?: string): string {
  const shd = fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : "";
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shd}<w:vAlign w:val="center"/></w:tcPr>${content}</w:tc>`;
}

function table(rows: string[][], widths: number[], rtl: boolean, rowFill: (r: number, c: number) => string | undefined, bold: (r: number, c: number) => boolean, minHeight = 0): string {
  const border = `w:val="single" w:sz="4" w:space="0" w:color="9AA9BC"`;
  const tblPr = `<w:tblPr>${rtl ? "<w:bidiVisual/>" : ""}<w:tblW w:w="${FULL_WIDTH}" w:type="dxa"/><w:tblBorders><w:top ${border}/><w:left ${border}/><w:bottom ${border}/><w:right ${border}/><w:insideH ${border}/><w:insideV ${border}/></w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>`;
  const grid = `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`;
  const trs = rows
    .map((r, ri) => {
      const trPr = minHeight ? `<w:trPr><w:cantSplit/><w:trHeight w:val="${minHeight}"/></w:trPr>` : "<w:trPr><w:cantSplit/></w:trPr>";
      return `<w:tr>${trPr}${r.map((c, ci) => cell(para(run(c, rtl, { bold: bold(ri, ci), size: 19 }), rtl, { after: 0 }), widths[ci], rowFill(ri, ci))).join("")}</w:tr>`;
    })
    .join("");
  return `<w:tbl>${tblPr}${grid}${trs}</w:tbl>`;
}

const split = (n: number, weights?: number[]) => {
  const w = weights ?? Array(n).fill(1);
  const sum = w.reduce((a, b) => a + b, 0);
  const out = w.map((x) => Math.floor((FULL_WIDTH * x) / sum));
  out[out.length - 1] += FULL_WIDTH - out.reduce((a, b) => a + b, 0);
  return out;
};

function logoXml(width: number, height: number): string {
  const emu = (px: number) => Math.round(px * 9525);
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${emu(width)}" cy="${emu(height)}"/><wp:docPr id="1" name="Logo"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="logo.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${emu(width)}" cy="${emu(height)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function documentXml(doc: DocModel): string {
  const { rtl } = doc;
  const body: string[] = [];

  // Header block: logo | company and title | code, revision, date
  const [wLogo, wTitle, wMeta] = split(3, [1.1, 2.6, 1.5]);
  const logoCell = doc.logo ? para(logoXml(doc.logo.width, doc.logo.height), rtl, { after: 0, center: true }) : para("", rtl, { after: 0 });
  const titleCell =
    para(run(doc.header.company, rtl, { bold: true, size: 24, color: "0B1F3A" }), rtl, { after: 40, center: true }) +
    para(run(doc.header.title, rtl, { bold: true, size: 22, color: "0E7F7A" }), rtl, { after: 0, center: true });
  const metaCell = doc.header.meta.map(([k, v]) => para(run(`${k}: ${v}`, rtl, { size: 18 }), rtl, { after: 0 })).join("");
  const border = `w:val="single" w:sz="8" w:space="0" w:color="0B1F3A"`;
  body.push(
    `<w:tbl><w:tblPr>${rtl ? "<w:bidiVisual/>" : ""}<w:tblW w:w="${FULL_WIDTH}" w:type="dxa"/><w:tblBorders><w:top ${border}/><w:left ${border}/><w:bottom ${border}/><w:right ${border}/><w:insideH ${border}/><w:insideV ${border}/></w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="${wLogo}"/><w:gridCol w:w="${wTitle}"/><w:gridCol w:w="${wMeta}"/></w:tblGrid><w:tr>${cell(logoCell, wLogo)}${cell(titleCell, wTitle)}${cell(metaCell, wMeta)}</w:tr></w:tbl>`,
  );

  for (const b of doc.blocks) {
    if (b.kind === "heading") {
      body.push(para(run(b.text, rtl, { bold: true, size: 22, color: "0E7F7A" }), rtl, { before: 240, after: 80, keepNext: true }));
    } else if (b.kind === "para") {
      if (b.label) body.push(para(run(b.label, rtl, { bold: true, size: 19 }), rtl, { before: 60, after: 40, keepNext: true }));
      if (b.boxed) body.push(table([[b.text || " "]], [FULL_WIDTH], rtl, () => undefined, () => false, 900));
      else if (b.text) body.push(para(run(b.text, rtl), rtl));
    } else {
      const n = (b.columns ?? b.rows[0] ?? [""]).length;
      const widths = split(n, b.widths);
      const rows = b.columns ? [b.columns, ...b.rows] : b.rows;
      const header = (r: number) => Boolean(b.columns) && r === 0;
      body.push(
        table(
          rows,
          widths,
          rtl,
          (r, c) => (header(r) || (b.labelColumn && c === 0) ? "EEF3F8" : undefined),
          (r, c) => header(r) || Boolean(b.labelColumn && c === 0),
          b.tall ? 560 : 0,
        ),
      );
    }
  }

  const sect = `<w:sectPr>${rtl ? "<w:bidi/>" : ""}<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>${body.join("")}${sect}</w:body></w:document>`;
}

/** The .docx file of a document model. */
export function buildDocx(doc: DocModel): Blob {
  const enc = new TextEncoder();
  const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${doc.logo ? `<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/>` : ""}</Relationships>`;
  const files = [
    { name: "[Content_Types].xml", data: enc.encode(ct) },
    { name: "_rels/.rels", data: enc.encode(rels) },
    { name: "word/document.xml", data: enc.encode(documentXml(doc)) },
    { name: "word/_rels/document.xml.rels", data: enc.encode(docRels) },
    ...(doc.logo ? [{ name: "word/media/logo.png", data: doc.logo.png }] : []),
  ];
  return new Blob([zip(files) as BlobPart], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
