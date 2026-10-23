import iran from "@/data/iran-products.json";
import orangeBook from "@/data/orange-book.json";

/*
 * Search over the FDA Orange Book products (src/data/orange-book.json, rebuilt
 * monthly by .github/workflows/orange-book.yml) and the Iranian products list
 * (src/data/iran-products.json). Server only: the data is several megabytes.
 */

type ObRow = [string, string, string, string, string, string, string, string, number, number, string];
type IrRow = [string, string, string, string, string];

export type ObProduct = {
  trade: string;
  applicant: string;
  strength: string;
  form: string;
  applType: "N" | "A";
  applNo: string;
  te: string;
  rld: boolean;
  rs: boolean;
  type: "R" | "O" | "D";
};
export type IranProduct = { brand: string; company: string; form: string; strength: string };
export type ObGroup = { ingredient: string; products: ObProduct[]; more: number; iran: IranProduct[] };
export type ObResult = { updated: string | null; iranUpdated: string | null; groups: ObGroup[]; total: number };

const rows = orangeBook.products as unknown as ObRow[];
const iranRows = iran.products as unknown as IrRow[];
const PER_GROUP = 80;
const GROUPS = 25;

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();

/** Iranian products whose generic name contains the main word of the Orange Book ingredient. */
function iranFor(ingredient: string): IranProduct[] {
  const key = norm(ingredient).split(" ")[0];
  if (!key || key.length < 4) return [];
  return iranRows
    .filter((r) => norm(r[0]).split(" ").includes(key))
    .map((r) => ({ brand: r[1], company: r[2], form: r[3], strength: r[4] }));
}

/** perGroup: products listed per ingredient (the formulation advisor asks for all of them). */
export function searchOrangeBook(query: string, withDiscontinued: boolean, perGroup = PER_GROUP): ObResult {
  const q = norm(query);
  const base = { updated: orangeBook.updated, iranUpdated: iran.updated, groups: [], total: 0 };
  if (q.length < 3) return base;
  // An ingredient matches by its own name or by any of its trade names, so a
  // brand search (e.g. Lipitor) lists the brand together with its generics.
  const matched = new Set<string>();
  for (const r of rows) if (norm(r[0]).includes(q) || norm(r[1]).includes(q)) matched.add(r[0]);
  const byIngredient = new Map<string, ObProduct[]>();
  for (const r of rows) {
    if (!withDiscontinued && r[10] === "D") continue;
    if (!matched.has(r[0])) continue;
    const list = byIngredient.get(r[0]) ?? [];
    list.push({
      trade: r[1],
      applicant: r[2],
      strength: r[3],
      form: r[4],
      applType: r[5] === "N" ? "N" : "A",
      applNo: r[6],
      te: r[7],
      rld: r[8] === 1,
      rs: r[9] === 1,
      type: r[10] === "R" ? "R" : r[10] === "O" ? "O" : "D",
    });
    byIngredient.set(r[0], list);
  }
  // Exact ingredient matches first, then shorter names (the plain molecule before combinations).
  const names = [...byIngredient.keys()].sort(
    (a, b) => Number(norm(b) === q) - Number(norm(a) === q) || a.length - b.length || a.localeCompare(b),
  );
  const groups = names.slice(0, GROUPS).map((ingredient) => {
    const list = byIngredient.get(ingredient)!.sort(
      (a, b) => Number(b.rld) - Number(a.rld) || a.applType.localeCompare(b.applType) * -1 || a.trade.localeCompare(b.trade),
    );
    return { ingredient, products: list.slice(0, perGroup), more: Math.max(0, list.length - perGroup), iran: iranFor(ingredient) };
  });
  return { ...base, groups, total: names.length };
}
