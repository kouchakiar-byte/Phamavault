import { PageHeader } from "@/components/page-header";
import { SolubilityBench, type SolubilityEntry } from "@/components/solubility-bench";
import { Container } from "@/components/ui";
import { solubilityCopy } from "@/content/solubility";
import { excipients, rawMaterials } from "@/data";
import { monographs } from "@/data/monographs";
import solubility from "@/data/solubility.json";
import { getLocale } from "@/i18n/locale";
import { excipientSlug } from "@/lib/excipient-slug";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(solubilityCopy.title, solubilityCopy.lead, "materials/solubility");

type Row = { cid: number; s: [string, string][]; w?: SolubilityEntry["w"] };
const data = solubility as unknown as { generated: string; items: Record<string, Row> };

/** Every API and excipient, with the solubility statements found for it. */
function entries(): SolubilityEntry[] {
  const apis: SolubilityEntry[] = rawMaterials.items.map((m) => {
    const row = data.items[m.name];
    return { name: m.name, cas: m.cas, syn: m.synonyms, kind: "api", bcs: m.bcs || undefined, ...(row ? { cid: row.cid, s: row.s, w: row.w } : {}) };
  });
  const excs: SolubilityEntry[] = excipients.items.map((x) => {
    const sol = monographs[x.name]?.properties.find((p) => p.k.en === "Solubility");
    return { name: x.name, cas: x.cas, syn: x.synonyms, kind: "exc", mono: sol?.v, slug: excipientSlug(x.name) };
  });
  return [...apis, ...excs];
}

export default async function SolubilityPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader
        locale={locale}
        section="materials"
        title={solubilityCopy.title}
        lead={solubilityCopy.lead}
        back={{ href: href(locale, "materials"), label: solubilityCopy.back }}
      />
      <Container className="py-12">
        <SolubilityBench locale={locale} entries={entries()} accessed={data.generated} />
      </Container>
    </>
  );
}
