"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * A query-string parameter of the current URL (e.g. ?q= from the site search),
 * read on the client only so the page itself stays static: the server and the
 * first client render see "".
 */
export function useUrlParam(name: string): string {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name) ?? "",
    () => "",
  );
}
