/**
 * An invisible account code inside text a subscriber copies from an SOP or a general chapter:
 * zero-width characters that carry the user id, repeated through the text, so a copy that turns
 * up elsewhere can be traced to the account it came from (admin page, "Trace copied text").
 * 24 bits of user id and an 8-bit check, between two word joiners.
 */
const ZERO = "​";
const ONE = "‌";
const EDGE = "⁠";
const check = (id: number) => ((((id >> 16) & 255) + ((id >> 8) & 255) + (id & 255)) ^ 0xa5) & 255;

export function encodeMark(id: number): string {
  const value = ((id & 0xffffff) * 256 + (check(id) & 255)) >>> 0;
  let bits = "";
  for (let i = 31; i >= 0; i--) bits += Math.floor(value / 2 ** i) % 2 ? ONE : ZERO;
  return `${EDGE}${bits}${EDGE}`;
}

/** The account code found most often in the text, or null if there is no valid one. */
export function decodeMark(text: string): number | null {
  const counts = new Map<number, number>();
  for (const m of text.matchAll(new RegExp(`${EDGE}([${ZERO}${ONE}]{32})${EDGE}`, "g"))) {
    let value = 0;
    for (const c of m[1]) value = value * 2 + (c === ONE ? 1 : 0);
    const id = Math.floor(value / 256);
    if ((value % 256) === (check(id) & 255)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let best: number | null = null;
  for (const [id, n] of counts) if (best === null || n > (counts.get(best) ?? 0)) best = id;
  return best;
}

/** The text with the code after its first character and again about every 300 characters. */
export function watermark(text: string, id: number): string {
  if (!text) return text;
  const mark = encodeMark(id);
  let out = text[0] + mark;
  let since = 0;
  for (let i = 1; i < text.length; i++) {
    out += text[i];
    since++;
    if (since >= 300 && /\s/.test(text[i])) {
      out += mark;
      since = 0;
    }
  }
  return out;
}
