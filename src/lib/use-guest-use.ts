"use client";

import { useCallback, useEffect, useState } from "react";
import type { PaidSection } from "./pricing";

export type GuestUse = { ok: boolean; guest: boolean; left?: number };

/** Asks the server for one of a guest's free uses of a section before showing a result. */
export function useGuestUse(section: PaidSection) {
  return useCallback(
    async (key: string): Promise<GuestUse> => {
      try {
        const res = await fetch("/api/guest-use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, key }),
        });
        if (!res.ok && res.status !== 429) return { ok: true, guest: false }; // never block a reader on a server fault
        return (await res.json()) as GuestUse;
      } catch {
        return { ok: true, guest: false };
      }
    },
    [section],
  );
}

/**
 * For a tool whose result depends on `key` (a search, a pair of drugs): "pending" while the
 * server is asked, "open" to show the result, "blocked" when a guest's free uses are used up.
 * A key already allowed stays allowed. No key: nothing to ask, "open".
 */
export function useGuestGate(section: PaidSection, key: string | null): "open" | "blocked" | "pending" {
  const claim = useGuestUse(section);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!key || key in answers) return;
    let alive = true;
    claim(key).then((r) => {
      if (alive) setAnswers((prev) => ({ ...prev, [key]: r.ok }));
    });
    return () => {
      alive = false;
    };
  }, [key, answers, claim]);
  if (!key) return "open";
  if (!(key in answers)) return "pending";
  return answers[key] ? "open" : "blocked";
}

/** `value` once it has stopped changing for `ms`, so typing a search counts once, not per key. */
export function useSettled<T>(value: T, ms = 900): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return settled;
}
