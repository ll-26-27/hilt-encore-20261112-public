import Link from "next/link";
import { notFound } from "next/navigation";
import { Placeholder, SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getPart, getParts, resolveSrc, withoutH1 } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ part: string }> }) {
  const part = await getPart((await params).part);
  return { title: part?.title ?? "Not found" };
}

// A part of the talk as a page to read: the part's own words, then its slides in order (those not marked site: false).
export default async function PartPage({ params }: { params: Promise<{ part: string }> }) {
  const slug = (await params).part;
  const parts = await getParts();
  const index = parts.findIndex((p) => p.slug === decodeURIComponent(slug));
  if (index < 0) notFound();
  const part = parts[index];
  const prev = parts[index - 1];
  const next = parts[index + 1];
  // Slides that are only the part's question (a title, no words) would repeat the heading.
  const slides = part.slides.filter((s) => s.site && s.layout !== "qr" && s.layout !== "made" && (withoutH1(s.content).trim() || s.title !== part.title));
  return (
    <>
      <SiteHeader current="talk" />
      <main id="main" className="article-shell">
        <nav className="breadcrumbs"><Link href="/#parts">The talk</Link><span>/</span><span>Part {part.number}</span></nav>
        <header className="article-heading">
          <p className="eyebrow">Part {part.number}{part.who ? ` · ${part.who}` : ""}</p>
          <h1>{part.title}</h1>
          {part.question && <p className="lede">{part.question}</p>}
          <p className="updated"><Link href={`/present#${encodeURIComponent(part.slug)}`}>See this part as slides →</Link></p>
        </header>
        <div className="prose">
          {part.missing ? <Placeholder>This part is being written this morning; it will be here after the talk.</Placeholder> : <Markdown content={part.content} dir={part.dir} />}
          {slides.length > 0 && <hr />}
          {slides.map((slide) => (
            <section key={slide.id} className="slide-read">
              <h2>{slide.layout === "set-piece" ? `${slide.who || "Madeleine"}: ${slide.title}` : slide.title}</h2>
              {slide.layout === "image" && slide.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveSrc(slide.image, slide.dir)} alt={slide.title} />
              )}
              <Markdown content={withoutH1(slide.content)} dir={slide.dir} />
              {slide.cite && <p className="cite">— {slide.cite}</p>}
              {slide.demo && <p><a href={slide.demo} target="_blank" rel="noreferrer">Open the demo ↗</a></p>}
            </section>
          ))}
        </div>
        <nav className="pager">
          {prev ? <Link href={prev.number === 0 ? "/" : `/talk/${prev.slug}`}><span className="eyebrow">Previous</span>{prev.number === 0 ? "Home" : prev.title}</Link> : <span />}
          {next ? <Link className="pager-next" href={next.number >= 6 ? "/take-home" : `/talk/${next.slug}`}><span className="eyebrow">Next</span>{next.number >= 6 ? "Take home" : next.title}</Link> : <span />}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
