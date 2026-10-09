import Link from "next/link";
import { useId, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  inverted?: boolean;
  action?: ReactNode;
};

export function SectionHeader({ eyebrow, title, lead, inverted = false, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${inverted ? "text-molecule-400" : "text-molecule-600"}`}>
          {eyebrow}
        </p>
        <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${inverted ? "text-white" : "text-vault-900"}`}>
          {title}
        </h2>
        {lead && <p className={`mt-4 text-lg ${inverted ? "text-vault-100/80" : "text-muted"}`}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const buttonStyles = {
  primary: "bg-molecule-500 text-white hover:bg-molecule-600 shadow-sm shadow-molecule-700/20",
  secondary: "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
  ghost: "text-molecule-700 hover:text-molecule-600 px-0",
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${buttonStyles[variant]}`}
    >
      {children}
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

/** Decorative hexagonal lattice used behind dark hero areas. */
export function MoleculePattern({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path
            d="M28 0 56 16.2v32.3L28 64.7 0 48.5V16.2ZM28 64.7V97"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="28" cy="0" r="2" fill="currentColor" />
          <circle cx="56" cy="16.2" r="2" fill="currentColor" />
          <circle cx="0" cy="48.5" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
