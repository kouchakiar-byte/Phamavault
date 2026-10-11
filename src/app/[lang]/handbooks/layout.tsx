import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/handbooks">) {
  return <SectionGate section="handbooks">{children}</SectionGate>;
}
