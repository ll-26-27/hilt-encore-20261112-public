import Link from "next/link";
import { Placeholder, SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getHome, getParts } from "@/lib/content";
import { displayUrl, qrSvg } from "@/lib/qr";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [home, parts] = await Promise.all([getHome(), getParts()]);
  const svg = await qrSvg(home.url);
  const talk = parts.filter((part) => part.number > 0 && part.number < 6);
  return (
    <>
      <SiteHeader current="talk" />
      <main id="main">
        <section className="hero">
          <p className="eyebrow">{home.time}</p>
          <h1>{home.title}</h1>
          <p className="hero-deck">{home.subtitle}</p>
          <div className="hero-meta">
            <p>{home.date}</p>
            {home.people.length > 0 && <p>{home.people.join(" · ")}</p>}
          </div>
          <div className="hero-actions">
            <Link className="button" href="/present">Watch the slides →</Link>
            <Link className="button ghost" href="/take-home">Take home</Link>
          </div>
        </section>

        <section className="home-brief">
          <div className="prose">
            {home.missing ? <Placeholder>The talk in brief is being written this morning.</Placeholder> : <Markdown content={home.content} />}
          </div>
          <aside className="home-qr">
            <div className="qr-card" dangerouslySetInnerHTML={{ __html: svg }} />
            <p>{displayUrl(home.url)}</p>
          </aside>
        </section>

        <section id="parts" className="parts">
          <p className="eyebrow">The talk in five parts</p>
          <div className="document-list">
            {talk.map((part) => (
              <Link key={part.slug} className="document-link" href={`/talk/${part.slug}`}>
                <span className="document-number">{String(part.number).padStart(2, "0")}</span>
                <span className="document-copy">
                  <strong>{part.title}</strong>
                  <span>{part.question}{part.missing ? " · coming soon" : ""}</span>
                </span>
                <span className="document-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
