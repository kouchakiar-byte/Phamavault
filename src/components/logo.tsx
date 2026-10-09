type LogoMarkProps = { className?: string };

/**
 * The PharmaVault mark: a benzene-ring hexagon whose aromatic circle doubles
 * as a vault dial with a keyhole — chemistry and protected knowledge.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path
        d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z"
        fill="var(--color-vault-900)"
        stroke="var(--color-molecule-400)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="20"
        cy="20"
        r="9"
        fill="none"
        stroke="var(--color-molecule-400)"
        strokeWidth="1.6"
      />
      <circle cx="20" cy="18" r="2.6" fill="var(--color-capsule-400)" />
      <path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="var(--color-capsule-400)" />
    </svg>
  );
}

type LogoProps = { tagline?: string; inverted?: boolean };

export function Logo({ tagline, inverted = false }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5" dir="ltr">
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-vault-900"}`}
          style={{ fontFamily: "var(--font-plex-sans)" }}
        >
          Pharma<span className="text-molecule-500">Vault</span>
        </span>
        {tagline && (
          <span
            className={`mt-1 text-[0.55rem] font-medium uppercase tracking-[0.14em] ${inverted ? "text-vault-100/70" : "text-muted"}`}
            style={{ fontFamily: "var(--font-plex-sans)" }}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
