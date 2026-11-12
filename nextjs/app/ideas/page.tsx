import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import { getIdeas, getStartHere, MODES } from "@/lib/ideas";
import IdeasBrowser from "./IdeasBrowser";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ideas" };

// The teaching ideas from TDM 155AI and the term's planning, written for any instructor: the Start-here list first,
// then all of them, filterable by mode and tag. Read-only; nothing is stored.
export default async function IdeasPage() {
  const [ideas, start] = await Promise.all([getIdeas(), getStartHere()]);
  const bySlug = new Map(ideas.map((i) => [i.slug, i]));
  const startIdeas = start.map((s) => bySlug.get(s)).filter((i): i is NonNullable<typeof i> => Boolean(i));
  return (
    <>
      <SiteHeader current="ideas" />
      <main id="main" className="examples-index">
        <header className="article-heading">
          <h1>Ideas</h1>
          <p className="lede">{ideas.length} teaching and learning ideas from a fall course on making media with AI, written for any instructor in any subject. Most can be performed in Claude, or built with Claude Code.</p>
        </header>
        <IdeasBrowser ideas={ideas} start={startIdeas.map((i) => i.slug)} modes={MODES} />
      </main>
      <SiteFooter />
    </>
  );
}
