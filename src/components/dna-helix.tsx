/**
 * A turning DNA double helix, drawn as rungs that swing from side to side
 * out of phase (CSS in globals.css, .pv-dna). Decorative only.
 */
export function DnaHelix({ orientation = "vertical", rungs = 14, className = "" }: { orientation?: "vertical" | "horizontal"; rungs?: number; className?: string }) {
  const step = 12;
  const length = rungs * step;
  const vertical = orientation === "vertical";
  return (
    <svg
      viewBox={vertical ? `-24 0 48 ${length}` : `0 -24 ${length} 48`}
      className={`pv-dna ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={vertical ? undefined : "rotate(-90)"}>
        {Array.from({ length: rungs }, (_, i) => (
          // The position sits on an outer group: the CSS animation's transform would replace it.
          <g key={i} transform={`translate(0 ${i * step + step / 2})`}>
            <g className="pv-dna-rung" style={{ animationDelay: `${-i * 0.28}s` }}>
              <line x1="-17" x2="17" y1="0" y2="0" className="pv-dna-bar" />
              <circle cx="-17" cy="0" r="3.4" className="pv-dna-a" />
              <circle cx="17" cy="0" r="3.4" className="pv-dna-b" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
