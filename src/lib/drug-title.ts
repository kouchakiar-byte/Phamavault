/**
 * A register title split into the medicine and its strength, so a Persian
 * heading never scatters "2 mg/1.5 mL" across a right-to-left line:
 * "محلول تزریقی سماگلوتاید 2 mg/1.5 mL" → ["محلول تزریقی سماگلوتاید", "2 mg/1.5 mL"].
 * The strength starts at the first word that opens with a digit.
 */
export function splitStrength(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  const at = words.findIndex((w) => /^[\d۰-۹]/.test(w));
  if (at <= 0) return [title.trim(), ""];
  return [words.slice(0, at).join(" ").replace(/[,،]$/, ""), words.slice(at).join(" ")];
}
