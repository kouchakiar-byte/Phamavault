import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BookOpen,
  FileCheck,
  FlaskConical,
  FolderKanban,
  Layers,
  Library,
  Mail,
  Microscope,
  Users,
} from "lucide-react";
import type { Locale } from "@/i18n/config";

export const siteConfig = {
  name: "PharmaVault",
  url: "https://pharmavault.ir",
  // TODO: confirm the public contact address before launch.
  email: "info@pharmavault.ir",
};

/**
 * Every top-level page in the sitemap. The slug is shared by both locales
 * (`/fa/excipients`, `/en/excipients`); titles and copy live in the
 * dictionaries under `sections.<key>`.
 */
export const sections = [
  { slug: "formulation", key: "formulation", icon: FlaskConical, group: "expertise" },
  { slug: "drug-development", key: "drugDevelopment", icon: Microscope, group: "expertise" },
  { slug: "excipients", key: "excipients", icon: Layers, group: "expertise" },
  { slug: "apis", key: "apis", icon: Atom, group: "expertise" },
  { slug: "regulatory", key: "regulatory", icon: FileCheck, group: "expertise" },
  { slug: "resources", key: "resources", icon: Library, group: "knowledge" },
  { slug: "knowledge-base", key: "knowledgeBase", icon: BookOpen, group: "knowledge" },
  { slug: "projects", key: "projects", icon: FolderKanban, group: "company" },
  { slug: "about", key: "about", icon: Users, group: "company" },
  { slug: "contact", key: "contact", icon: Mail, group: "company" },
] as const satisfies readonly {
  slug: string;
  key: string;
  icon: LucideIcon;
  group: "expertise" | "knowledge" | "company";
}[];

export type Section = (typeof sections)[number];
export type SectionKey = Section["key"];

export const expertiseSections = sections.filter((s) => s.group === "expertise");

export function href(locale: Locale, path = ""): string {
  return path ? `/${locale}/${path.replace(/^\//, "")}` : `/${locale}`;
}
