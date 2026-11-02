import type { Ref } from "@/content/pharmacy";
import { pharmacyPage } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";

export function RefList({ refs, locale }: { refs: Ref[]; locale: Locale }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
      <span className="font-bold text-vault-900">{pharmacyPage.refsLabel[locale]}:</span>
      {refs.map((r) =>
        r.url ? (
          <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5 text-molecule-700 hover:underline">
            {r.label} ↗
          </a>
        ) : (
          <bdi key={r.label} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
            {r.label}
          </bdi>
        ),
      )}
    </p>
  );
}
