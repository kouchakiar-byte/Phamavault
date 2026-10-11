import { SectionGate } from "@/components/section-gate";

export default function Layout({ children }: LayoutProps<"/[lang]/excipients">) {
  return <SectionGate section="excipients">{children}</SectionGate>;
}
