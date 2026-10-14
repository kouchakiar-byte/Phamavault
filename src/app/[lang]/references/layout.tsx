import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/references">) {
  return <SectionGate section="references">{children}</SectionGate>;
}
