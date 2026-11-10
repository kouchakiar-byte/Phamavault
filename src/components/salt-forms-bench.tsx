"use client";

import { useCallback, useState } from "react";
import type { Locale } from "@/i18n/config";
import { useUrlParam } from "@/lib/use-url-param";
import { Salt, saltDefaults } from "./calc/salt";
import type { Values } from "./calc/ui";

/** The salt converter on its own page; ?salt= (from the API database) opens that salt. */
export function SaltFormsBench({ locale }: { locale: Locale }) {
  const preselect = useUrlParam("salt");
  const water = useUrlParam("w");
  const [v, setV] = useState<Values>(saltDefaults);
  const set = useCallback((k: string, val: string) => setV((prev) => ({ ...prev, [k]: val })), []);
  return <Salt ctx={{ locale, v, set }} preselect={preselect} water={water} tableOpen />;
}
