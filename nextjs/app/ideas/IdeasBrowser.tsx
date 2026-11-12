"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Idea } from "@/lib/ideas";

const TOP_TAGS = 24;

function IdeaCard({ idea, modeLabel }: { idea: Idea; modeLabel: string }) {
  return (
    <Link href={`/ideas/${idea.slug}`} className={`idea-card mode-${idea.mode}`}>
      <span className="idea-mode">{modeLabel}</span>
      <strong>{idea.title}</strong>
      <span className="idea-desc">{idea.description}</span>
      <span className="idea-tags">{idea.tags.join(" · ")}</span>
    </Link>
  );
}

// Start here, then every idea with filters (mode, tag, words). Filters live in the page only; nothing is stored.
export default function IdeasBrowser({ ideas, start, modes }: { ideas: Idea[]; start: string[]; modes: Array<[string, string]> }) {
  const [mode, setMode] = useState("");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [allTags, setAllTags] = useState(false);
  const modeLabel = useMemo(() => Object.fromEntries(modes), [modes]);
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of ideas) for (const t of i.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [ideas]);
  const shown = ideas.filter((i) => (!mode || i.mode === mode) && (!tag || i.tags.includes(tag)) && (!query || `${i.title} ${i.description} ${i.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())));
  const startIdeas = start.map((s) => ideas.find((i) => i.slug === s)).filter((i): i is Idea => Boolean(i));
  return (
    <>
      {startIdeas.length > 0 && (
        <section className="ideas-start">
          <h2>Start here</h2>
          <div className="idea-cards">{startIdeas.map((i) => <IdeaCard key={i.slug} idea={i} modeLabel={modeLabel[i.mode] ?? i.mode} />)}</div>
        </section>
      )}
      <section className="ideas-all">
        <h2>All {ideas.length}</h2>
        <div className="ideas-filters">
          <div className="ideas-chips">
            <button type="button" className={!mode ? "on" : ""} onClick={() => setMode("")}>Every mode</button>
            {modes.map(([key, label]) => (
              <button key={key} type="button" className={`mode-${key}${mode === key ? " on" : ""}`} onClick={() => setMode(mode === key ? "" : key)}>
                {label} <span>{ideas.filter((i) => i.mode === key).length}</span>
              </button>
            ))}
          </div>
          <div className="ideas-chips tags">
            {(allTags ? tags : tags.slice(0, TOP_TAGS)).map(([t, n]) => (
              <button key={t} type="button" className={tag === t ? "on" : ""} onClick={() => setTag(tag === t ? "" : t)}>{t} <span>{n}</span></button>
            ))}
            {tags.length > TOP_TAGS && <button type="button" className="more" onClick={() => setAllTags((v) => !v)}>{allTags ? "fewer tags" : `all ${tags.length} tags`}</button>}
          </div>
          <input type="search" placeholder="Search the ideas" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the ideas" />
          <p className="ideas-count">{shown.length} of {ideas.length}{tag ? ` · tag: ${tag}` : ""}{mode ? ` · ${modeLabel[mode]}` : ""}{(tag || mode || query) && <button type="button" onClick={() => { setTag(""); setMode(""); setQuery(""); }}>clear</button>}</p>
        </div>
        <div className="idea-cards">{shown.map((i) => <IdeaCard key={i.slug} idea={i} modeLabel={modeLabel[i.mode] ?? i.mode} />)}</div>
      </section>
    </>
  );
}
