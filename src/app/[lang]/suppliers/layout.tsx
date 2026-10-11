import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/suppliers">) {
  return <SectionGate section="suppliers">{children}</SectionGate>;
}
