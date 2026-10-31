import { ShieldCheck } from "lucide-react";
import { copy, siteConfig } from "@/content/site";
import type { Locale } from "@/i18n/config";

const t = copy.enamad;

/**
 * The e-Namad seal exactly as the e-Namad panel issues it: the image (referrer
 * policy and `code` attribute) inside a link to the domain's e-Namad profile,
 * which e-Namad requires. `compact` is a smaller copy of the
 * footer card for the top of the home page; otherwise it sits in a card that names what it
 * certifies (`dark` on the footer, `light` on white pages).
 */
export function EnamadSeal({ locale, tone = "light", compact = false, className = "" }: { locale: Locale; tone?: "light" | "dark"; compact?: boolean; className?: string }) {
  const seal = siteConfig.enamad;
  if (!seal) return null;
  const image = (size: number) => (
    <a referrerPolicy="origin" target="_blank" href={`https://trustseal.enamad.ir/?id=${seal.id}&Code=${seal.code}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        referrerPolicy="origin"
        src={`https://trustseal.enamad.ir/logo.aspx?id=${seal.id}&Code=${seal.code}`}
        alt={t.title[locale]}
        width={size}
        height={Math.round(size * 1.1)}
        style={{ height: "auto", cursor: "pointer" }}
        // @ts-expect-error e-Namad reads this attribute on the seal image
        code={seal.code}
      />
    </a>
  );
  if (compact) {
    // The footer card on the dark hero, smaller: seal, tick and title, then the description
    return (
      <div className={`flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 pe-4 ${className}`}>
        <span className="shrink-0 rounded-lg bg-white p-1 ring-1 ring-black/5">{image(56)}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-bold text-white">
            <ShieldCheck className="size-3.5 shrink-0 text-molecule-400" aria-hidden="true" />
            {t.title[locale]}
          </p>
          <p className="mt-0.5 text-[0.7rem] leading-relaxed text-vault-100/80">{t.text[locale]}</p>
        </div>
      </div>
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
