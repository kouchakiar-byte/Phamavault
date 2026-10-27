/** URL slug for a general chapter, e.g. USP "<1229.1>" → "usp-1229-1", Ph. Eur. "2.9.3" → "ep-2-9-3". */
export function chapterSlug(ph: "USP" | "EP", code: string): string {
  return `${ph.toLowerCase()}-${code.replace(/[<>]/g, "").replace(/\./g, "-")}`;
}
