import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getHome } from "@/lib/content";

export const dynamic = "force-dynamic";

// The home page: the talk's title, who gave it, and home.md's words (what the session was, and what is in this site
// and its repo).
export default async function Home() {
  const home = await getHome();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <p className="eyebrow">{[home.date, home.time].filter(Boolean).join(" · ")}</p>
          <h1>{home.title}</h1>
          {home.subtitle && <p className="hero-deck">{home.subtitle}</p>}
          {home.people.length > 0 && (
            <div className="hero-people">
              {home.people.map((p) => <p key={p.name}><strong>{p.name}</strong>{p.title && <span>{p.title}</span>}</p>)}
            </div>
          )}
        </section>
        {!home.missing && (
          <section className="home-brief">
            <div className="prose"><Markdown content={home.content} /></div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
