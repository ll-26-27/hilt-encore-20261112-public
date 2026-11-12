import type { Metadata } from "next";
import Markdown from "@/app/components/Markdown";
import { getHome, getParts, resolveSrc, withoutH1, type Home, type Part, type Slide } from "@/lib/content";
import { displayUrl, qrSvg } from "@/lib/qr";
import Countdown from "./Countdown";
import Deck, { type Frame } from "./Deck";
import MadeLive from "./MadeLive";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Slides" };

const isOpen = (part: Part) => part.number === 0;
const isClose = (part: Part) => part.number >= 6;

function Qr({ svg, url, label }: { svg: string; url: string; label?: string }) {
  return (
    <div className="qr-block">
      <div className="qr-card" dangerouslySetInnerHTML={{ __html: svg }} />
      <div>
        {label && <p className="eyebrow">{label}</p>}
        <p className="qr-url">{url}</p>
      </div>
    </div>
  );
}

function TitleBody({ home, svg, url }: { home: Home; svg: string; url: string }) {
  return (
    <div className="title-slide">
      <p className="eyebrow">The Learning Lab · HILT Encore 2026</p>
      <h1>{home.title}</h1>
      <p className="title-sub">{home.subtitle}</p>
      {home.people.length > 0 && <p className="title-people">{home.people.join(" · ")}</p>}
      <Countdown />
      <Qr svg={svg} url={url} label="Follow along" />
    </div>
  );
}

function PartBody({ part }: { part: Part }) {
  return (
    <div className="part-card">
      <span className="part-number">{isClose(part) ? "→" : part.number}</span>
      <div>
        <h1>{part.title}</h1>
        {part.question && <p className="part-question">{part.question}</p>}
        <p className="part-meta">{[part.who, part.minutes ? `${part.minutes} min` : ""].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
  );
}

// layout shift: each "## label" is a column, revealed one per press. With no columns yet, placeholders hold the shape.
function columns(content: string) {
  const parts = withoutH1(content).split(/^##\s+(.+)$/m);
  const cols: Array<{ label: string; body: string }> = [];
  for (let i = 1; i < parts.length; i += 2) cols.push({ label: parts[i].trim(), body: parts[i + 1] ?? "" });
  return { lead: parts[0].trim(), cols };
}

function SlideBody({ slide, svg, url }: { slide: Slide; svg: string; url: string }) {
  const body = withoutH1(slide.content).trim();
  const words = body ? <div className="slide-words"><Markdown content={body} dir={slide.dir} /></div> : null;
  const heading = <h2 className="slide-title">{slide.title}</h2>;

  switch (slide.layout) {
    case "set-piece":
      return (
        <div className="set-piece">
          <p className="eyebrow">Set piece</p>
          <p className="set-piece-who">{slide.who || "Madeleine"}</p>
          <h2>{slide.title}</h2>
          {words}
        </div>
      );
    case "quote":
      return (
        <figure className="quote">
          <blockquote>{body ? <Markdown content={body} dir={slide.dir} /> : <p>{slide.title}</p>}</blockquote>
          {slide.cite && <figcaption>{slide.cite}</figcaption>}
        </figure>
      );
    case "image": {
      const src = resolveSrc(slide.image, slide.dir);
      return (
        <div className="image-slide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src ? <img src={src} alt={slide.title} /> : <div className="placeholder-box">image to come</div>}
          <p className="image-caption">{slide.title}</p>
        </div>
      );
    }
    case "demo":
      return (
        <div className="demo-slide">
          <p className="eyebrow">Live</p>
          {heading}
          {words}
          {slide.demo ? (
            <a className="demo-button" href={slide.demo} target="_blank" rel="noreferrer">
              Open ↗ <span>{slide.demo.replace(/^https?:\/\//, "")}</span>
            </a>
          ) : <p className="placeholder">demo link to come</p>}
        </div>
      );
    case "shift": {
      const { lead, cols } = columns(slide.content);
      const shown = cols.length ? cols : ["Day 1", "Day 2", "Day 3", "Day 4"].map((label) => ({ label, body: "_outline to come_" }));
      return (
        <div className="shift">
          {heading}
          {lead && <div className="shift-lead"><Markdown content={lead} dir={slide.dir} /></div>}
          <div className="shift-cols" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>
            {shown.map((col, i) => (
              <div key={col.label} className="shift-col" style={{ ["--i" as string]: i + 1 }}>
                <p className="shift-label">{col.label}</p>
                <Markdown content={col.body} dir={slide.dir} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "qr":
      return (
        <div className="qr-slide">
          {heading}
          {words}
          <Qr svg={svg} url={url} />
        </div>
      );
    case "made": {
      const src = resolveSrc(slide.image, slide.dir);
      return (
        <div className="made-slide">
          {heading}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <MadeLive fallback={src ? <img src={src} alt={slide.title} /> : words} />
        </div>
      );
    }
    case "bullets":
      return <div className="bullets">{heading}{words}</div>;
    default:
      return body ? <div className="statement">{heading}{words}</div> : <div className="statement only"><h2>{slide.title}</h2></div>;
  }
}

export default async function PresentPage() {
  const [home, parts] = await Promise.all([getHome(), getParts()]);
  const svg = await qrSvg(home.url);
  const url = displayUrl(home.url);
  const frames: Frame[] = [];

  for (const part of parts) {
    const base = { part: part.number, partTitle: part.title, who: "", steps: 1 };
    if (isOpen(part)) frames.push({ ...base, key: "open", title: home.title, layout: "title", body: <TitleBody home={home} svg={svg} url={url} /> });
    else frames.push({ ...base, key: part.slug, title: part.title, layout: "part", who: part.who, body: <PartBody part={part} /> });
    for (const slide of part.slides) {
      frames.push({ ...base, key: slide.id, title: slide.title, layout: slide.layout, who: slide.who, steps: slide.steps, body: <SlideBody slide={slide} svg={svg} url={url} /> });
    }
    if (isClose(part) && !part.slides.some((s) => s.layout === "qr")) {
      frames.push({ ...base, key: "take-home", title: "Take it home", layout: "qr", body: <SlideBody slide={{ ...part, id: "take-home", title: "Take it home", layout: "qr", who: "", image: "", demo: "", cite: "", site: true, steps: 1, content: "Repos, tools, and examples from today, on the site's take-home page." }} svg={svg} url={url} /> });
    }
  }

  return <Deck frames={frames} qr={svg} url={url} />;
}
