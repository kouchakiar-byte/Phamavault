import { SectionGate } from "@/components/section-gate";

/** The CoA review checklist is a QC tool, so it opens with the QC section. */
export default function Layout({ children }: LayoutProps<"/[lang]/coa-review">) {
  return <SectionGate section="qc">{children}</SectionGate>;
}
