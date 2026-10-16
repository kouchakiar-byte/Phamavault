"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Reports each page shown to /api/track; the outside referrer only with the first page. */
export function VisitBeacon() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    const body = JSON.stringify({ p: pathname, r: first.current ? document.referrer : "" });
    first.current = false;
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      void fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);
  return null;
}
