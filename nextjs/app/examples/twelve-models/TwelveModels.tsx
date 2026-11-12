"use client";

import { useState } from "react";
import { models, prompts, results, type Result } from "./data";
import s from "./twelve-models.module.css";

const providerLabel: Record<string, string> = { openai: "OpenAI", gemini: "Google", openrouter: "OpenRouter" };
const find = (model: string, slug: string) => results.find((r) => r.model === model && r.slug === slug);

function Tile({ r, label, sub }: { r: Result | undefined; label: string; sub: string }) {
  const caption = (
    <figcaption className={s.caption}>
      <span className={s.label}>{label}</span>
      <span className={s.sub}>{sub}</span>
    </figcaption>
  );
  if (!r || !r.ok || !r.thumb || !r.full) {
    return (
      <figure className={s.tile}>
        <div className={`${s.frame} ${s.failed}`}>
          <span>No image</span>
          <small>{r?.error ?? "not run"}</small>
        </div>
        {caption}
      </figure>
    );
  }
  return (
    <figure className={s.tile}>
      <a className={s.frame} href={r.full} target="_blank" rel="noreferrer" title="Open the full-size image on the Pages site">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.thumb} alt={`${label}: ${sub}`} loading="lazy" />
      </a>
      {caption}
    </figure>
  );
}

export default function TwelveModels() {
  const [mode, setMode] = useState<"prompt" | "model">("prompt");
  const [slug, setSlug] = useState(prompts[0].slug);
  const [model, setModel] = useState(models[0].model);
  const prompt = prompts.find((p) => p.slug === slug) ?? prompts[0];
  const m = models.find((x) => x.model === model) ?? models[0];
  const okCount = results.filter((r) => r.ok).length;

  return (
    <div className={s.root}>
      <div className={s.toolbar}>
        <div className={s.toggle} role="tablist" aria-label="View">
          <button role="tab" aria-selected={mode === "prompt"} className={mode === "prompt" ? s.on : ""} onClick={() => setMode("prompt")}>One prompt, twelve models</button>
          <button role="tab" aria-selected={mode === "model"} className={mode === "model" ? s.on : ""} onClick={() => setMode("model")}>One model, six prompts</button>
        </div>
        <span className={s.count}>{okCount} of {results.length} requests returned an image · click any image for the full size</span>
      </div>

      {mode === "prompt" ? (
        <>
          <div className={s.picker} role="tablist" aria-label="Prompt">
            {prompts.map((p, i) => (
              <button key={p.slug} role="tab" aria-selected={p.slug === slug} className={p.slug === slug ? s.on : ""} onClick={() => setSlug(p.slug)}>
                <span className={s.num}>{i + 1}</span>{p.text}
              </button>
            ))}
          </div>
          <p className={s.prompt}><span>Prompt</span>“{prompt.text}”</p>
          <div className={s.grid}>
            {models.map((x) => (
              <Tile key={x.model} r={find(x.model, prompt.slug)} label={x.model} sub={providerLabel[x.provider] ?? x.provider} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={s.picker} role="tablist" aria-label="Model">
            {models.map((x) => (
              <button key={x.model} role="tab" aria-selected={x.model === model} className={x.model === model ? s.on : ""} onClick={() => setModel(x.model)}>
                <span className={s.num}>{providerLabel[x.provider] ?? x.provider}</span>{x.model}
              </button>
            ))}
          </div>
          <p className={s.prompt}><span>Model</span>{m.model} <em>via {providerLabel[m.provider] ?? m.provider}</em></p>
          <div className={`${s.grid} ${s.six}`}>
            {prompts.map((p, i) => (
              <Tile key={p.slug} r={find(m.model, p.slug)} label={`${i + 1}. “${p.text}”`} sub={m.model} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
