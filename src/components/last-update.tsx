import { RefreshCw } from "lucide-react";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";

const t = copy.lastUpdate;

/** "Last updated: <date>, 18:00" from the daily catalog update; hidden until the first run. */
export function LastUpdate({ at, locale, className = "" }: { at: string | null; locale: Locale; className?: string }) {
  if (!at) return null;
  const date = new Date(at);
  const time = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${className}`}>
      <RefreshCw className="size-4 text-molecule-500" aria-hidden="true" />
      <span className="font-semibold">{t.label[locale]}:</span>
      <time dateTime={at}>{t.at[locale].replace("{date}", formatDate(date, locale, "Asia/Tehran")).replace("{time}", time)}</time>
      <span className="opacity-70">· {t.daily[locale]}</span>
    </p>
  );
}
