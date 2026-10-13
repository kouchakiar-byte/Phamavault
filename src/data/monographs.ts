import type { Bi } from "@/i18n/bi";
import m00 from "./monographs/m00.json";

/** A monograph-style review of one excipient, written for PharmaVault from the cited references. */
export type Monograph = {
  names: { ph: string; name: string }[];
  tradeNames: string;
  chemicalName: string;
  formula: string;
  mw: string;
  applications: Bi;
  description: Bi;
  properties: { k: Bi; v: Bi }[];
  stability: Bi;
  incompatibilities: Bi;
  manufacture: Bi;
  safety: Bi;
  handling: Bi;
  regulatory: Bi;
  related: Bi;
  comments: Bi;
  refs: string[];
};

export const monographs: Record<string, Monograph> = { ...(m00 as Record<string, Monograph>) };
