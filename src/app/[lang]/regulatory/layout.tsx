import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/regulatory">) {
  return <SectionGate section="regulatory">{children}</SectionGate>;
}
