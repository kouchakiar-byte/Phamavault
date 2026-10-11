import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/formulation">) {
  return <SectionGate section="formulation">{children}</SectionGate>;
}
