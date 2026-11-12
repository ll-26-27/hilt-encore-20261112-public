"use client";

import { useState } from "react";
import s from "./handouts.module.css";

const base = "/examples/handout-formatting";
const pages = (name: string, n: number) => Array.from({ length: n }, (_, i) => `${base}/${name}-${i + 1}.png`);

function Pages({ srcs, label }: { srcs: string[]; label: string }) {
  return (
    <div className={s.pages}>
      {srcs.map((src, i) => (
        <a key={src} href={src} target="_blank" rel="noreferrer" className={s.page}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${label}, page ${i + 1} of ${srcs.length}`} loading="lazy" />
        </a>
      ))}
    </div>
  );
}

type SpanishView = "draft" | "student" | "key";

function Spanish({ draft }: { draft: string }) {
  const [view, setView] = useState<SpanishView>("draft");
  const tabs: Array<[SpanishView, string, string]> = [
    ["draft", "The draft", "the Word file as it came in"],
    ["student", "Student copy", "\\usepackage{handout}"],
    ["key", "Answer key", "\\def\\audience{key}"],
  ];
  return (
    <section className={s.panel} aria-labelledby="es">
      <h2 id="es" className={s.h}>A Spanish worksheet</h2>
      <div className={s.tabs} role="tablist" aria-label="Version">
        {tabs.map(([id, label, sub]) => (
          <button key={id} role="tab" aria-selected={view === id} className={view === id ? s.on : ""} onClick={() => setView(id)}>
            <strong>{label}</strong>
            <code>{sub}</code>
          </button>
        ))}
      </div>
      {view === "draft" && (
        <>
          <p className={s.note}>The text of the .docx: ten vocabulary lines with five different separators, answers typed into the exercises, "!!" in the title.</p>
          <pre className={s.draft}>{draft.trim()}</pre>
        </>
      )}
      {view === "student" && <Pages srcs={pages("es-student", 3)} label="Student copy" />}
      {view === "key" && (
        <>
          <p className={s.note}>The same source file. The key is a two-line wrapper: it sets the audience and includes the worksheet unchanged. Compare page 2 with the student copy.</p>
          <Pages srcs={pages("es-key", 3)} label="Answer key" />
        </>
      )}
    </section>
  );
}

function Math() {
  const [after, setAfter] = useState(true);
  return (
    <section className={s.panel} aria-labelledby="math">
      <h2 id="math" className={s.h}>A differential-equations worksheet</h2>
      <div className={s.tabs} role="tablist" aria-label="Version">
        <button role="tab" aria-selected={!after} className={!after ? s.on : ""} onClick={() => setAfter(false)}>
          <strong>Before</strong><code>the original PDF, 5 pages</code>
        </button>
        <button role="tab" aria-selected={after} className={after ? s.on : ""} onClick={() => setAfter(true)}>
          <strong>After</strong><code>the same house style, 3 pages</code>
        </button>
      </div>
      <p className={s.note}>The equations were reconstructed from extracted text and set again in LaTeX, through the same two style files as the Spanish sheet.</p>
      {after ? <Pages srcs={pages("math-after", 3)} label="Rebuilt worksheet" /> : <Pages srcs={pages("math-before", 5)} label="Original worksheet" />}
    </section>
  );
}

export default function Handouts({ draft }: { draft: string }) {
  return (
    <div className={s.root}>
      <Spanish draft={draft} />
      <Math />
    </div>
  );
}
