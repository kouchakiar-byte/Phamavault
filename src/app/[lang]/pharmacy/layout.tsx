import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/pharmacy">) {
  return <SectionGate section="pharmacy">{children}</SectionGate>;
}
