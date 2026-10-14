import type { Handbook } from "@/data";

/** Fragment id of a handbook on the handbooks page, e.g. "hb-solid-dosage-forms". */
export const handbookAnchor = (h: Pick<Handbook, "title">) =>
  `hb-${h.title.en.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`;
