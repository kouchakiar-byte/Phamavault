import { ChevronDown } from "lucide-react";
import type { Accordion as AccordionData } from "@/data";
import type { Locale } from "@/i18n/config";
import { BiTitle } from "./ui";

type Props = { items: AccordionData; locale: Locale; badge?: string };

/** Two-column list of expandable titles (handbooks, CTD modules). */
export function Accordion({ items, locale, badge }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <details key={item.title.en} className="group rounded-card border border-line bg-white open:border-molecule-400">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <span className="flex flex-col gap-2">
              <BiTitle
                text={item.title}
                locale={locale}
                stacked
                className="font-bold text-vault-900 group-open:text-molecule-700"
                secondaryClassName="text-[0.8em]"
              />
              {badge && (
                <span className="self-start rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{badge}</span>
              )}
            </span>
            <ChevronDown className="mt-1 size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ul className="list-disc space-y-1.5 border-t border-line px-5 py-4 ps-10 text-sm text-muted marker:text-molecule-500">
            {item.items.map((c) => (
              <li key={c.en}>{c[locale]}</li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
