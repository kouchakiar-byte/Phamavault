import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/materials">) {
  return <SectionGate section="materials">{children}</SectionGate>;
}
