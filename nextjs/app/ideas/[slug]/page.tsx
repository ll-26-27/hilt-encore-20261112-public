import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getIdeas, MODES } from "@/lib/ideas";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
  const idea = (await getIdeas()).find((i) => i.slug === slug);
  return { title: idea?.title ?? "Idea" };
}

// One idea: what it is, how it runs, with Claude, why it works, time and materials, variations.
export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
  const ideas = await getIdeas();
  const idea = ideas.find((i) => i.slug === slug);
  if (!idea) notFound();
  const modeLabel = Object.fromEntries(MODES)[idea.mode] ?? idea.mode;
  return (
    <>
      <SiteHeader current="ideas" />
      <main id="main" className="article-shell">
        <nav className="breadcrumbs"><Link href="/ideas">Ideas</Link><span>/</span><span>{modeLabel}</span></nav>
        <header className="article-heading">
          <p className={`idea-mode mode-${idea.mode}`}>{modeLabel}</p>
          <h1>{idea.title}</h1>
          <p className="lede">{idea.description}</p>
          <p className="idea-tags-line">{idea.tags.map((t) => <span key={t}>{t}</span>)}</p>
        </header>
        <div className="prose"><Markdown content={idea.body} /></div>
      </main>
      <SiteFooter />
    </>
  );
}
