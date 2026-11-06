/**
 * The calculators are not behind the section gate: readers without access see every
 * calculator on its worked example, with the inputs locked (see the page).
 */
export default function Layout({ children }: LayoutProps<"/[lang]/tools">) {
  return children;
}
