import { ShieldCheck } from "lucide-react";
import { copy, siteConfig } from "@/content/site";
import type { Locale } from "@/i18n/config";

const t = copy.enamad;

/**
 * The e-Namad seal image as the e-Namad panel issues it (same image, referrer
 * policy and `code` attribute), in a card that names what it certifies. It is
 * not linked to the verification page, which shows the owner's name.
 * `dark` sits on the footer; `light` on white pages.
 */
export function EnamadSeal({ locale, tone = "light", className = "" }: { locale: Locale; tone?: "light" | "dark"; className?: string }) {
  const seal = siteConfig.enamad;
  if (!seal) return null;
  const dark = tone === "dark";
  return (
    <div
      className={`flex items-center gap-4 rounded-card border p-3 pe-5 ${
        dark ? "border-white/10 bg-white/5" : "border-line bg-white shadow-sm"
      } ${className}`}
    >
      {/* Image only, no link: the verification page shows the owner's name, which stays private */}
      <span className="shrink-0 rounded-xl bg-white p-1.5 ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          referrerPolicy="origin"
          src={`https://trustseal.enamad.ir/logo.aspx?id=${seal.id}&Code=${seal.code}`}
          alt={t.title[locale]}
          width={84}
          height={92}
          style={{ height: "auto" }}
          // @ts-expect-error e-Namad reads this attribute on the seal image
          code={seal.code}
        />
      </span>
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
