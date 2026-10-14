/** URL slug for an excipient name, e.g. "Cellulose, microcrystalline" → "cellulose-microcrystalline". */
export function excipientSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
