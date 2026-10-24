import { ChevronDown } from "lucide-react";
import type { CtdItem, CtdModule } from "@/data";
import type { Locale } from "@/i18n/config";
import { BiTitle } from "./ui";

/** One heading: the CTD number and official English title (left to right), then the Persian title. */
function Heading({ item, locale, depth }: { item: CtdItem; locale: Locale; depth: number }) {
  return (
    <li className={depth === 0 ? "py-1.5" : "py-1"}>
      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <bdi dir="ltr" className={`text-start ${depth === 0 ? "font-semibold text-vault-900" : "text-vault-800"}`}>
          <span className="me-1.5 font-mono font-bold text-molecule-700">{item.code}</span>
          {item.en}
        </bdi>
        {locale === "fa" && <span className="text-xs text-muted">{item.fa}</span>}
      </span>
      {item.sub && (
        <ul className="ms-3 mt-1 border-s border-line ps-4">
          {item.sub.map((s) => (
            <Heading key={s.code} item={s} locale={locale} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** CTD modules (ICH M4) as expandable panels with the numbered heading tree. */
export function CtdTree({ modules, locale }: { modules: CtdModule[]; locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((m) => (
        <details key={m.title.en} className="group rounded-card border border-line bg-white open:border-molecule-400">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <BiTitle text={m.title} locale={locale} stacked className="font-bold text-vault-900 group-open:text-molecule-700" secondaryClassName="text-[0.8em]" />
            <ChevronDown className="mt-1 size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-line px-5 py-4 text-sm">
            {m.note && <p className="mb-3 text-xs text-muted">{m.note[locale]}</p>}
            <ul>
              {m.items.map((it) => (
                <Heading key={it.code} item={it} locale={locale} depth={0} />
              ))}
            </ul>
          </div>
        </details>
      ))}
    </div>
  );
}
