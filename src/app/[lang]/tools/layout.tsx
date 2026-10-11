import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/tools">) {
  return <SectionGate section="tools">{children}</SectionGate>;
}
