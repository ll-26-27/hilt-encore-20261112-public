import Link from "next/link";

const sections = [
  ["examples", "/examples", "Examples"],
  ["utilities", "/utilities", "Utilities"],
  ["ideas", "/ideas", "Ideas"],
] as const;

export function SiteHeader({ current = "" }: { current?: string }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        The Learning Lab <span>at HILT Encore 2026</span>
      </Link>
      <nav aria-label="Main navigation">
        {sections.map(([key, href, label]) => <Link key={key} href={href} aria-current={current === key ? "page" : undefined}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>The Learning Lab · Derek Bok Center for Teaching and Learning, Harvard University</span>
      <a href="https://github.com/ll-26-27/hilt-encore-20261112-public" target="_blank" rel="noreferrer">This site’s repo ↗</a>
    </footer>
  );
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="placeholder">{children}</p>;
}
