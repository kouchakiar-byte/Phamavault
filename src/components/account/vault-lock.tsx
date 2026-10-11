/**
 * The PharmaVault mark drawn large as a vault: a dial ringed by one tumbler
 * per checkout step and a gold key in the keyhole. Every choice turns the key,
 * every finished step lights a tumbler, and paying swings the vault open.
 */
export function VaultLock({
  steps,
  unlocked,
  turns,
  opening,
  className = "",
}: {
  steps: number;
  unlocked: number;
  /** Increments on every choice, replaying the key turn. */
  turns: number;
  opening: boolean;
  className?: string;
}) {
  const gap = 10; // degrees between tumblers
  const span = 360 / steps - gap;
  const r = 62;
  const circumference = 2 * Math.PI * r;
  const arc = (span / 360) * circumference;

  return (
    <div className={`pv-vault relative ${opening ? "pv-vault-open" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="size-full overflow-visible">
        <defs>
          <radialGradient id="pv-glow">
            <stop offset="0%" stopColor="var(--color-capsule-400)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--color-molecule-400)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-molecule-400)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Light that pours out when the vault opens */}
        <circle className="pv-vault-light" cx="100" cy="100" r="98" fill="url(#pv-glow)" />
        <g className="pv-vault-rays" stroke="var(--color-capsule-400)" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="100" y1="22" x2="100" y2="4" transform={`rotate(${i * 30} 100 100)`} />
          ))}
        </g>

        {/* The vault door: the logo hexagon */}
        <g className="pv-vault-door">
          <path
            d="M100 12.5 176 56.25v87.5L100 187.5 24 143.75v-87.5Z"
            fill="var(--color-vault-900)"
            stroke="var(--color-molecule-400)"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Tumblers: one arc per step, gold once that step is done */}
          {Array.from({ length: steps }, (_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${arc} ${circumference}`}
              transform={`rotate(${-90 + gap / 2 + i * (span + gap)} 100 100)`}
              className={i < unlocked ? "pv-tumbler pv-tumbler-on" : "pv-tumbler"}
            />
          ))}

          {/* Dial: turns a notch with every choice and a quarter per step */}
          <g className="pv-dial" style={{ transform: `rotate(${unlocked * 90 + turns * 12}deg)` }}>
            <circle cx="100" cy="100" r="45" fill="none" stroke="var(--color-molecule-400)" strokeWidth="4" />
            {Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1="100"
                y1="58"
                x2="100"
                y2={i % 6 === 0 ? 66 : 62}
                stroke="var(--color-molecule-400)"
                strokeOpacity={i % 6 === 0 ? 0.9 : 0.45}
                strokeWidth="2"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
          </g>

          {/* Keyhole */}
          <circle cx="100" cy="91" r="12" fill="var(--color-capsule-400)" />
          <path d="M93 98h14l4 25H89Z" fill="var(--color-capsule-400)" />
          <circle cx="100" cy="91" r="5" fill="var(--color-vault-950)" />
          <path d="M97.5 94h5l1.5 22h-8Z" fill="var(--color-vault-950)" />

          {/* The key, replayed on every choice */}
          <g key={turns} className={turns > 0 ? "pv-key pv-key-turn" : "pv-key"}>
            <rect x="97.5" y="96" width="5" height="44" rx="2" fill="var(--color-capsule-500)" />
            <rect x="102" y="104" width="8" height="4" rx="1" fill="var(--color-capsule-500)" />
            <rect x="102" y="111" width="5" height="4" rx="1" fill="var(--color-capsule-500)" />
            <circle cx="100" cy="152" r="14" fill="none" stroke="var(--color-capsule-500)" strokeWidth="6" />
            <circle cx="100" cy="152" r="4" fill="var(--color-molecule-400)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
