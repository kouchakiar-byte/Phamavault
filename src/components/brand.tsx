import type { ReactNode } from "react";

/** "Vault" in shining gold — the treasure in PharmaVault. `onLight` deepens the gold for white backgrounds. */
export function VaultWord({ onLight = false }: { onLight?: boolean }) {
  return <span className={onLight ? "pv-gold-text pv-gold-deep" : "pv-gold-text"}>Vault</span>;
}

/** The PharmaVault name with "Vault" in gold; always set left-to-right. */
export function BrandName({ className = "" }: { className?: string }) {
  return (
    <span dir="ltr" className={`whitespace-nowrap ${className}`}>
      Pharma
      <VaultWord />
    </span>
  );
}

/** Renders a copy string with every "PharmaVault" in it as the gold brand name. */
export function withBrand(text: string): ReactNode {
  if (!text.includes("PharmaVault")) return text;
  return text.split("PharmaVault").flatMap((part, i) => (i === 0 ? [part] : [<BrandName key={i} />, part]));
}
