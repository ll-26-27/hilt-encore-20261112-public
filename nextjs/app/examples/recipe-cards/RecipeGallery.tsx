"use client";

import { useEffect, useState } from "react";
import data from "./recipes.json";
import s from "./recipes.module.css";

// Rebuilt from bok-learning-lab/claude-workshop-materials, activities/recipes: the eight files in inputs/ (matched to
// their renamed copies by checksum), the blurbs from recipe-collection.html, and the body of each per-recipe .html
// page (transcription + "About this recipe"). Photos were converted to WebP for this page; nothing else was changed,
// except one private street address elided from the marmalade card's subtitle and note.

type Recipe = (typeof data.recipes)[number];
const FOLDER = "https://github.com/bok-learning-lab/claude-workshop-materials/tree/main/activities/recipes";

export default function RecipeGallery() {
  const [open, setOpen] = useState<Recipe | null>(null);
  const [after, setAfter] = useState(true);

  // A link like /examples/recipe-cards#zuppa-pavese opens that card.
  useEffect(() => {
    const hit = data.recipes.find((r) => r.slug === window.location.hash.slice(1));
    if (hit) setOpen(hit);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={s.wrap}>
      <section className={s.flow}>
        <div className={s.step}><span>1</span><p><b>Inputs.</b> Eight recipe images with the names a camera, a scanner or a CDN gave them.</p></div>
        <div className={s.step}><span>2</span><p><b>Rename.</b> Claude reads each image and proposes a kebab-case name for the dish.</p></div>
        <div className={s.step}><span>3</span><p><b>Extract and build.</b> Claude transcribes each card, adds a short history, and writes a gallery page per recipe.</p></div>
      </section>

      <div className={s.toolbar}>
        <div className={s.toggle} role="group" aria-label="Show filenames before or after renaming">
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Before: inputs/</button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>After: renamed</button>
        </div>
        <a href={FOLDER} target="_blank" rel="noreferrer">The folder on GitHub ↗</a>
      </div>

      <div className={s.grid}>
        {data.recipes.map((r) => (
          <button key={r.slug} type="button" className={s.card} onClick={() => setOpen(r)}>
            <span className={s.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.alt} loading="lazy" />
            </span>
            <span className={s.file} title={after ? r.renamed : r.original}>
              {after ? <><em className={s.old}>{r.original}</em><span className={s.arrow}>→</span><b>{r.renamed}</b></> : <b className={s.raw}>{r.original}</b>}
            </span>
            {after ? (
              <>
                <strong>{r.cardTitle}</strong>
                <span className={s.blurb}>{r.blurb}</span>
              </>
            ) : (
              <span className={s.blurb}>An image with an unhelpful name.</span>
            )}
          </button>
        ))}
      </div>

      {open && (
        <div className={s.overlay} onClick={() => setOpen(null)} role="presentation">
          <article className={s.sheet} role="dialog" aria-modal="true" aria-label={open.title} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={s.close} onClick={() => setOpen(null)} aria-label="Close">×</button>
            <div className={s.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.image} alt={open.alt} />
              <p className={s.rename}><span>inputs/{open.original}</span><span>→ {open.renamed}</span></p>
            </div>
            <div className={s.text}>
              <h2>{open.title}</h2>
              {open.subtitle && <p className={s.subtitle}>{open.subtitle}</p>}
              <div className={s.recipe} dangerouslySetInnerHTML={{ __html: open.html }} />
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
