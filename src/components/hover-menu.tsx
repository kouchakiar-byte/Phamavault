"use client";

import { useState, type ReactNode } from "react";

/**
 * A hover / focus menu that closes once one of its links is chosen: the link
 * keeps focus after a click, which would otherwise hold the menu open. It
 * opens again the next time the pointer comes back.
 */
export function HoverMenu({ className, children }: { className?: string; children: ReactNode }) {
  const [closed, setClosed] = useState(false);
  return (
    <div
      className={`${className ?? ""} ${closed ? "menu-closed" : ""}`}
      onClickCapture={(e) => {
        if (!(e.target as HTMLElement).closest("[data-menu-item]")) return;
        setClosed(true);
        (document.activeElement as HTMLElement | null)?.blur();
      }}
      onMouseLeave={() => setClosed(false)}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") setClosed(false);
      }}
    >
      {children}
    </div>
  );
}
