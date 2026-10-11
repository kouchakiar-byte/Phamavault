import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/qa">) {
  return <SectionGate section="qa">{children}</SectionGate>;
}
