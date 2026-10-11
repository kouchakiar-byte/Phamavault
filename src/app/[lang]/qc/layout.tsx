import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/qc">) {
  return <SectionGate section="qc">{children}</SectionGate>;
}
