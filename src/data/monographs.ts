import type { Bi } from "@/i18n/bi";
import m00 from "./monographs/m00.json";
import m01 from "./monographs/m01.json";
import m02 from "./monographs/m02.json";
import m03 from "./monographs/m03.json";
import m04 from "./monographs/m04.json";
import m05 from "./monographs/m05.json";
import m06 from "./monographs/m06.json";
import m07 from "./monographs/m07.json";
import m08 from "./monographs/m08.json";
import m09 from "./monographs/m09.json";
import m10 from "./monographs/m10.json";
import m11 from "./monographs/m11.json";

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

const files = [m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11] as Record<string, Monograph>[];
export const monographs: Record<string, Monograph> = Object.assign({}, ...files);
