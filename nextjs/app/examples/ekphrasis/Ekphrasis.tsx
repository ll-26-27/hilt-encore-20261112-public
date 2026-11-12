"use client";

import { useRef, useState } from "react";
import recordings from "../../../public/examples/ekphrasis/recordings.json";
import s from "./ekphrasis.module.css";

const initial = [1, 4, 6, 9, 11];
type Recording = typeof recordings[number];

function Composition({ recording }: { recording: Recording }) {
  const [covered, setCovered] = useState<number[]>(initial);
  const [whole, setWhole] = useState(false);
  const [words, setWords] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const tile = active === null ? null : recording.tiles[active];
  function toggle(index: number) {
    setActive(index);
    setCovered(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index]);
  }
  return <>
    <div className={s.controls}>
      <button type="button" onClick={() => setWhole(!whole)} aria-pressed={whole}>{whole ? "Return to fragments" : "Show whole image"}</button>
      <button type="button" onClick={() => setWords(!words)} aria-pressed={words} disabled={whole}>{words ? "Hide words" : "Show words"}</button>
      <button type="button" onClick={() => { setCovered(initial); setWhole(false); setWords(true); setActive(null); }}>Reset composition</button>
    </div>
    <div className={s.stage}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={recording.image} width={recording.width} height={recording.height} alt={recording.alt} draggable={false} />
      {!whole && <div className={s.grid}>{recording.tiles.map((fragment, i) => <button key={i} type="button" className={covered.includes(i) ? `${s.covered} ${s["color" + (i % 3)]}` : s.open} onClick={() => toggle(i)} aria-label={`${covered.includes(i) ? "Uncover" : "Cover"} tile ${i + 1}: ${fragment.caption}`} aria-pressed={covered.includes(i)}>
        <small>{String(i + 1).padStart(2, "0")}</small>
        {covered.includes(i) && words && <span>{fragment.caption}</span>}
      </button>)}</div>}
    </div>
    <div className={s.below}>
      <p>Tap a tile to cover or uncover it. Swipe sideways for the next photograph.</p>
      {tile && <section className={s.tileNote} aria-live="polite"><span className={s.label}>Tile {tile.index + 1} · recorded model response</span><h3>{tile.caption}</h3><p>{tile.ekphrasis}</p>{tile.objects.length > 0 && <p className={s.objects}>Model labels: {tile.objects.map(object => `${object.label} ${Math.round(object.confidence * 100)}%`).join(" · ")}</p>}</section>}
    </div>
  </>;
}

export default function Ekphrasis() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const element = track.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({left: index * element.clientWidth, behavior: reduced ? "instant" : "smooth"});
  }
  return <div className={s.root}>
    <div className={s.intro}><span>A picture, in pieces</span><h2>Three images. Thirty-six fragments.</h2><p>A room reclaimed, a viewer in a museum, a table after a celebration. Each photograph was cut into twelve tiles and run through the installation’s descriptive model. The words below are its saved responses.</p></div>
    <nav className={s.navigation} aria-label="Photograph gallery">
      <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous photograph">←</button>
      <div className={s.tabs}>{recordings.map((recording, i) => <button key={recording.id} type="button" onClick={() => go(i)} aria-current={i === active ? "true" : undefined} aria-label={`Photograph ${i + 1}: ${recording.title}`}><span>0{i + 1}</span><span>{recording.title}</span></button>)}</div>
      <button type="button" onClick={() => go(active + 1)} disabled={active === recordings.length - 1} aria-label="Next photograph">→</button>
    </nav>
    <p className={s.position} aria-live="polite">{active + 1} / {recordings.length} · {recordings[active].title}</p>
    <div ref={track} className={s.track} role="region" aria-roledescription="carousel" aria-label="Ekphrasis photographs" tabIndex={0} onScroll={event => { const el = event.currentTarget; setActive(Math.max(0, Math.min(recordings.length - 1, Math.round(el.scrollLeft / el.clientWidth)))); }} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(Math.max(0, Math.min(recordings.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)))); } }}>
      {recordings.map((recording, i) => <article className={s.slide} key={recording.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${recordings.length}: ${recording.title}`} inert={i !== active}>
        <Composition recording={recording} />
      </article>)}
    </div>
    <details className={s.provenance}><summary>About this run</summary><p>Recorded on November 12, 2026 with {recordings[0].model}, using the original installation’s prompt and structured output. Each photograph supplied twelve crops in a 4-column, 3-row grid, sent together in one request. The model was instructed to describe each crop as if the rest of the image did not exist.</p><p>The supplied photographs are preserved, including the interface icons visible in two images. These are saved descriptions; the live installation’s separate object detector is not running here. The labels and confidence values shown when you select a tile are the language model’s output.</p><a href="/examples/ekphrasis/recordings.json" download>Download the recorded responses</a></details>
  </div>;
}
