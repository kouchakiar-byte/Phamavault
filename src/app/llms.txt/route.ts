import { copy, siteConfig } from "@/content/site";
import { sections } from "@/content/sections";

/** /llms.txt (llmstxt.org): a plain summary of the site and its sections for AI assistants and answer engines. */
export function GET() {
  const line = (path: string, title: string, description: string) => `- [${title}](${siteConfig.url}/${path}): ${description}`;
  const text = [
    `# ${siteConfig.name}`,
    "",
    `> ${copy.meta.description.en}`,
    "",
    "Bilingual (Persian and English) pharmaceutical knowledge platform for R&D, production, QC, QA, regulatory affairs, supply chain, pharmacies and pharmacy students. Persian pages are under /fa, English pages under /en.",
    "",
    "## Sections",
    "",
    ...sections.filter((s) => !s.href.startsWith("#")).map((s) => line(`en/${s.href}`, s.title.en, s.description.en)),
    "",
    "## Persian",
    "",
    ...sections.filter((s) => !s.href.startsWith("#")).map((s) => line(`fa/${s.href}`, s.title.fa, s.description.fa)),
    "",
    "## Optional",
    "",
    `- [Sitemap](${siteConfig.url}/sitemap.xml): every public page with its Persian and English versions`,
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
