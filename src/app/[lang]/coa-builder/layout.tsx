import { SectionGate } from "@/components/section-gate";

/** The CoA builder is a QC tool, so it opens with the QC section. */
export default function Layout({ children }: LayoutProps<"/[lang]/coa-builder">) {
  return <SectionGate section="qc">{children}</SectionGate>;
}
