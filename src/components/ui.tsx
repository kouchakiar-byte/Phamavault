import Link from "next/link";
import { useId, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { localeDirection, type Locale } from "@/i18n/config";
import { otherLocale, type Bi } from "@/i18n/bi";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type BiTitleProps = {
  text: Bi;
  locale: Locale;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  className?: string;
  /** Classes for the second-language label. */
  secondaryClassName?: string;
  /** Put the second language on its own line instead of beside the first. */
  stacked?: boolean;
};

/**
 * A title in the reader's language with the other language beside it —
 * every title on the site is shown in both Persian and English.
 */
export function BiTitle({
  text,
  locale,
  as: Tag = "span",
  className = "",
  secondaryClassName = "",
  stacked = false,
}: BiTitleProps) {
  const other = otherLocale(locale);
  const layout = stacked ? "flex flex-col gap-1" : "flex flex-wrap items-baseline gap-x-3 gap-y-1";
  return (
    <Tag className={`${layout} ${className}`}>
      <span>{text[locale]}</span>
      {text.en !== text.fa && (
        <span
          lang={other}
          dir={localeDirection[other]}
          className={`text-[0.6em] font-medium opacity-60 ${secondaryClassName}`}
        >
          {text[other]}
        </span>
      )}
    </Tag>
  );
}

export function Eyebrow({ children, inverted = false }: { children: ReactNode; inverted?: boolean }) {
  return (
    <p className={`text-sm font-semibold tracking-wide ${inverted ? "text-molecule-400" : "text-molecule-600"}`}>
      {children}
    </p>
  );
}

type SectionHeadProps = {
  eyebrow: string;
  title: Bi;
  locale: Locale;
  lead?: string;
  as?: "h1" | "h2";
  action?: ReactNode;
};

export function SectionHead({ eyebrow, title, locale, lead, as = "h2", action }: SectionHeadProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <BiTitle
          as={as}
          text={title}
          locale={locale}
          className={`mt-3 font-bold tracking-tight text-vault-900 ${as === "h1" ? "text-3xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}
        />
        {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "outline-light";
  arrow?: boolean;
};

const buttonStyles = {
  primary: "bg-molecule-600 text-white hover:bg-molecule-700 shadow-sm shadow-molecule-700/20",
  ghost: "border border-line bg-white text-vault-900 hover:border-molecule-500 hover:text-molecule-700",
  light: "bg-white text-vault-900 hover:bg-molecule-50",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/10",
};

export function ButtonLink({ href, children, variant = "primary", arrow = true }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${buttonStyles[variant]}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          className="size-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-molecule-700 hover:text-molecule-600">
      <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="m-0.5 inline-block whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

/** Decorative hexagonal lattice used behind coloured hero areas. */
export function MoleculePattern({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path d="M28 0 56 16.2v32.3L28 64.7 0 48.5V16.2ZM28 64.7V97" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="28" cy="0" r="2" fill="currentColor" />
          <circle cx="56" cy="16.2" r="2" fill="currentColor" />
          <circle cx="0" cy="48.5" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
