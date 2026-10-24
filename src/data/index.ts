import type { Bi } from "@/i18n/bi";
import excipientsJson from "./excipients.json";
import formulationJson from "./formulation.json";
import handbooksJson from "./handbooks.json";
import rawMaterialsJson from "./raw-materials.json";
import regulatoryJson from "./regulatory.json";
import sopsJson from "./sops.json";

/*
 * Reference data for the vault. The JSON files were extracted from the
 * approved site design and are the single source for every table.
 */

/** One CTD heading (ICH M4): its number, the official English title and the Persian title. */
export type CtdItem = { code: string; en: string; fa: string; sub?: CtdItem[] };
export type CtdModule = { title: Bi; note?: Bi; items: CtdItem[] };

export type HandbookTopic = { title: Bi; summary: Bi; points: Bi[]; refs: string[] };
export type Handbook = { title: Bi; intro: Bi; topics: HandbookTopic[] };

export type Excipient = {
  name: string;
  cas: string;
  functions: string[];
  useLevel: string;
  forms: string[];
  synonyms: string;
};

export type RawMaterial = {
  name: string;
  cas: string;
  group: string;
  /** Molecular formula of the traded salt/hydrate form, e.g. C16H25N3O8S. */
  formula?: string;
  mw: string;
  note: Bi;
  synonyms: string;
  /** Biopharmaceutics Classification System class of the oral immediate-release drug ("1"–"4"), where published. */
  bcs?: string;
};

export type FormulaTemplate = {
  name: Bi;
  rows: { fn: string; material: string | null; pct: number | null }[];
};

export type SopText = {
  purpose: string;
  scope: string;
  responsibilities: string;
  procedure: string[];
  records: string;
  references: string;
};

export type Sop = { code: string; dep: string; title: Bi; covers: Bi; text: SopText | null };

export const excipients = excipientsJson as {
  functions: Record<string, Bi>;
  forms: Record<string, Bi>;
  items: Excipient[];
};

export const rawMaterials = rawMaterialsJson as { groups: Record<string, Bi>; items: RawMaterial[] };

export const formulation = formulationJson as {
  functions: Record<string, Bi>;
  api: Bi;
  templates: FormulaTemplate[];
};

export const handbooks = handbooksJson as Handbook[];

export const regulatory = regulatoryJson as {
  ctd: CtdModule[];
  ich: { code: string; en: string; fa: string }[];
};

export const sops = sopsJson as { departments: Record<string, Bi>; items: Sop[] };
