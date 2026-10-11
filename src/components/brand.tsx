import type { ReactNode } from "react";

/** "Vault" in shining gold — the treasure in PharmaVault. `onLight` deepens the gold for white backgrounds. */
export function VaultWord({ onLight = false }: { onLight?: boolean }) {
  return <span className={onLight ? "pv-gold-text pv-gold-deep" : "pv-gold-text"}>Vault</span>;
}

/** Any word in the same shining gold, e.g. «گنجینه» in the slogan. */
export function GoldWord({ children, onLight = false }: { children: ReactNode; onLight?: boolean }) {
  return <span className={onLight ? "pv-gold-text pv-gold-deep" : "pv-gold-text"}>{children}</span>;
}

/** `text` with the first `word` in it set in shining gold. */
export function goldWord(text: string, word: string, onLight = false): ReactNode {
  const at = text.indexOf(word);
  if (at < 0) return text;
  return [text.slice(0, at), <GoldWord key="gold" onLight={onLight}>{word}</GoldWord>, text.slice(at + word.length)];
}

/**
 * The PharmaVault name with "Vault" in gold; always set left-to-right.
 * `plate` sets it like the header logo — navy "Pharma" on a small white
 * plate — so the navy reads on dark backgrounds.
 */
export function BrandName({ className = "", plate = false }: { className?: string; plate?: boolean }) {
  if (plate) {
    return (
      <span dir="ltr" className={`inline-block whitespace-nowrap rounded-lg bg-white px-[0.3em] leading-snug text-vault-900 ${className}`}>
        Pharma
        <VaultWord onLight />
      </span>
    );
  }
  return (
    <span dir="ltr" className={`whitespace-nowrap ${className}`}>
      Pharma
      <VaultWord />
    </span>
  );
}

/** Renders a copy string with every "PharmaVault" in it as the gold brand name. */
export function withBrand(text: string, { plate = false } = {}): ReactNode {
  if (!text.includes("PharmaVault")) return text;
  return text.split("PharmaVault").flatMap((part, i) => (i === 0 ? [part] : [<BrandName key={i} plate={plate} />, part]));
}
