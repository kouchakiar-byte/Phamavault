/*
 * Keeps English words, numbers, units and codes in their order inside Persian
 * text: each Latin or numeric run is wrapped in an isolate (LRI … PDI), so
 * "حد 2 ppm" does not turn into "ppm 2". The same rule as isolateLatin() in the
 * handbook builds (tools/handbooks): a bracket with no partner inside the run
 * stays with the Persian text, and "label: value" are separate runs.
 */

const RUN = /Ph\. Eur\.(?: \d+(?:\.\d+)*)?|[A-Za-z0-9<>≤≥±≈~+−\-(][A-Za-z0-9<>≤≥±≈~+−\-–=.,:/×·°µμ%³²¹⁰⁴⁵⁶⁻₀-₉ ()[\]]*[A-Za-z0-9>%°µμ³²¹⁰⁴⁵⁶₀-₉)\]]|[A-Za-z0-9]/g;

const wrap = (s: string) => (s.trim() ? `⁦${s}⁩` : s);

function fit(run: string): string {
  let m = run;
  let lead = "";
  let tail = "";
  while (m.startsWith("(") && !m.slice(1).includes(")")) [lead, m] = [lead + "(", m.slice(1)];
  while (m.endsWith(")") && (m.match(/\(/g) ?? []).length < (m.match(/\)/g) ?? []).length) [tail, m] = [")" + tail, m.slice(0, -1)];
  return lead + wrap(m) + tail;
}

/** Persian text with every Latin or numeric run isolated. Text already holding isolates is left as it is. */
export function isolateLatin(text: string): string {
  if (!/[؀-ۿ]/.test(text) || /[⁦-⁩]/.test(text)) return text;
  return text.replace(RUN, (m) =>
    m
      .split(/(:\s+)/)
      .map((part, i) => (i % 2 ? part : fit(part)))
      .join(""),
  );
}
