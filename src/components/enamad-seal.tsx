import { ShieldCheck } from "lucide-react";
import { copy, siteConfig } from "@/content/site";
import type { Locale } from "@/i18n/config";

const t = copy.enamad;

/**
 * The e-Namad seal image as the e-Namad panel issues it (same image, referrer
 * policy and `code` attribute), not clickable. `compact` is the small badge at
 * the top of the home page; otherwise it sits in a card that names what it
 * certifies (`dark` on the footer, `light` on white pages).
 */
export function EnamadSeal({ locale, tone = "light", compact = false, className = "" }: { locale: Locale; tone?: "light" | "dark"; compact?: boolean; className?: string }) {
  const seal = siteConfig.enamad;
  if (!seal) return null;
  const image = (size: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      referrerPolicy="origin"
      src={`https://trustseal.enamad.ir/logo.aspx?id=${seal.id}&Code=${seal.code}`}
      alt={t.title[locale]}
      width={size}
      height={Math.round(size * 1.1)}
      style={{ height: "auto" }}
      // @ts-expect-error e-Namad reads this attribute on the seal image
      code={seal.code}
    />
  );
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-2.5 rounded-2xl bg-white/95 py-1.5 pe-3.5 ps-1.5 text-vault-900 shadow-lg shadow-black/20 ${className}`}>
        <span className="shrink-0">{image(52)}</span>
        <span className="text-xs font-bold leading-snug">{t.title[locale]}</span>
      </span>
    );
  }
  const dark = tone === "dark";
  return (
    <div
      className={`flex items-center gap-4 rounded-card border p-3 pe-5 ${
        dark ? "border-white/10 bg-white/5" : "border-line bg-white shadow-sm"
      } ${className}`}
    >
      <span className="shrink-0 rounded-xl bg-white p-1.5 ring-1 ring-black/5">{image(84)}</span>
      <div className="min-w-0">
        <p className={`flex items-center gap-1.5 text-sm font-bold ${dark ? "text-white" : "text-vault-900"}`}>
          <ShieldCheck className={`size-4 shrink-0 ${dark ? "text-molecule-400" : "text-molecule-600"}`} aria-hidden="true" />
          {t.title[locale]}
        </p>
        <p className={`mt-1 text-xs leading-relaxed ${dark ? "text-vault-100/80" : "text-ink"}`}>{t.text[locale]}</p>
      </div>
    </div>
  );
}
