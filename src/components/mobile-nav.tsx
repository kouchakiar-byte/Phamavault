"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

type Item = { href: string; label: string };
type Props = {
  items: Item[];
  menuLabel: string;
  closeLabel: string;
  footer?: ReactNode;
};

export function MobileNav({ items, menuLabel, closeLabel, footer }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : menuLabel}
        className="inline-flex size-10 items-center justify-center rounded-lg text-vault-900 hover:bg-vault-50"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-line bg-white shadow-lg"
        >
          <ul className="mx-auto max-w-7xl px-4 py-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-lg px-3 py-2.5 font-medium text-vault-900 hover:bg-vault-50 aria-[current=page]:text-molecule-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {footer && <div className="mx-auto max-w-7xl px-7 pb-5">{footer}</div>}
        </nav>
      )}
    </div>
  );
}
