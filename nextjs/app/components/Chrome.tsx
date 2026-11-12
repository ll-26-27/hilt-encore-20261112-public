import Link from "next/link";

export const sections = [
  ["/ideas", "Ideas"],
  ["/utilities", "Utilities"],
  ["/examples", "Examples"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        The Learning Lab <span>HILT Encore 2026</span>
      </Link>
      <nav aria-label="Main navigation">
        {sections.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>The Learning Lab · Derek Bok Center for Teaching and Learning</span>
      <span>HILT Encore · November 12, 2026</span>
    </footer>
  );
}

export function Placeholder({ title }: { title: string }) {
  return (
    <main id="main" className="article-shell">
      <h1>{title}</h1>
      <p className="lede">Coming soon.</p>
    </main>
  );
}
