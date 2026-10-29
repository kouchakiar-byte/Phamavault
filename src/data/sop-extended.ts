import x00 from "./sop-extended/x00.json";
import x01 from "./sop-extended/x01.json";
import x02 from "./sop-extended/x02.json";
import x03 from "./sop-extended/x03.json";
import x04 from "./sop-extended/x04.json";
import x05 from "./sop-extended/x05.json";

/** A full, sectioned SOP text (Persian), written for PharmaVault from the cited GMP references. */
export type SopFull = {
  purpose: string;
  scope: string;
  responsibilities: { role: string; duty: string }[];
  definitions: { term: string; def: string }[];
  safety: string[];
  materials: string[];
  procedure: { title: string; steps: string[] }[];
  acceptance: string[];
  calculations: { name: string; formula: string; note: string }[];
  deviations: string[];
  records: string[];
  references: string[];
};

const files = [x00, x01, x02, x03, x04, x05] as Record<string, SopFull>[];
export const sopFull: Record<string, SopFull> = Object.assign({}, ...files);
