"use client";

import { useState, type ReactNode } from "react";
import raw from "./data.json";
import s from "./pharmakon.module.css";

type Rendering = { rendering: string; gloss?: string; category?: string; note?: string };
type Version = { id: string; language: string; lang_code: string; translator: string; year: number | null; passage: string; back_translation?: string; source_url: string; imprint: string; edition_used: string; notes?: string; renderings: Record<string, Rendering | string>; check: Record<string, string> };
const data = raw as unknown as { greek: string; greek_crib: string; versions: Version[]; slots: { key: string; describe: string }[] };
const versions = data.versions.filter(version => version.passage && version.renderings).sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
const words = [
  ["pharmakon_274e", "φάρμακον", "Theuth · remedy, 274e"],
  ["pharmakon_275a", "φάρμακον", "Thamus · remedy, 275a"],
  ["mneme_274e", "μνήμη", "Memory · 274e"],
  ["mneme_275a", "μνήμη", "Memory · 275a"],
  ["hypomnesis_275a", "ὑπόμνησις", "Reminding · 275a"],
  ["sophia_274e", "σοφία", "Wisdom · 274e"],
  ["sophia_275a", "σοφίας δόξα", "Seeming wisdom · 275a"],
  ["doxosophoi_275b", "δοξόσοφοι", "Wise-seeming · 275b"],
];
const colors: Record<string, string> = { "remedy/medicine": "#83caa6", drug: "#e9bc69", poison: "#ff8a80", "elixir/potion": "#c0a1f0", "recipe/prescription": "#80bce3", specific: "#73d3d6", "means/aid": "#c9c9bf" };
function rendering(version: Version, slot: string): Rendering | undefined {
  const item = version.renderings[slot];
  return typeof item === "object" ? item : undefined;
}
function highlight(text: string, needle: string): ReactNode {
  if (!needle || needle.length < 2) return text;
  const pieces: ReactNode[] = [];
  const haystack = text.toLocaleLowerCase(), match = needle.toLocaleLowerCase();
  let cursor = 0, index = haystack.indexOf(match);
  while (index >= 0) {
    pieces.push(text.slice(cursor, index), <mark key={index}>{text.slice(index, index + needle.length)}</mark>);
    cursor = index + needle.length; index = haystack.indexOf(match, cursor);
  }
  pieces.push(text.slice(cursor));
  return pieces;
}

function Passage({ version, slot }: { version: Version; slot: string }) {
  const r = rendering(version, slot);
  const check = version.check?.[slot];
  return <article className={s.passage}>
    <header><span>{version.year ?? "Undated"} · {version.language}</span><h3>{version.translator}</h3></header>
    {r && <div className={s.rendering}><strong>{r.rendering}</strong><p>{r.gloss}</p>{r.category && <span style={{ color: colors[r.category] || "#dcb6ce" }}>{r.category}</span>}<small className={check === "NOT FOUND" ? s.warning : ""}>{check === "exact" ? "Found verbatim in the source passage" : check === "loose" ? "Matched with differences in case or spacing" : check === "NOT FOUND" ? "Not found verbatim: inspect the source" : check || "No automatic match recorded"}</small></div>}
    <p className={s.original} lang={version.lang_code}>{highlight(version.passage, r?.rendering || "")}</p>
    {r?.note && <details><summary>Note on this rendering</summary><p>{r.note}</p><small>Model interpretation from the saved research run.</small></details>}
    {version.back_translation && <details><summary>Literal English back-translation</summary><p>{version.back_translation}</p><small>Model-generated comparison aid; check against the source-language passage.</small></details>}
    <footer><a href={version.source_url} target="_blank" rel="noreferrer">Read the source ↗</a><p>{version.imprint}</p><details><summary>Edition and provenance</summary><p>{version.edition_used}</p>{version.notes && <p>{version.notes}</p>}</details></footer>
  </article>;
}

export default function Pharmakon() {
  const [slot, setSlot] = useState("pharmakon_274e");
  const [left, setLeft] = useState("en-1892-jowett");
  const [right, setRight] = useState("en-1914-fowler");
  const [language, setLanguage] = useState("All languages");
  const a = versions.find(version => version.id === left)!;
  const b = versions.find(version => version.id === right)!;
  const visible = versions.filter(version => language === "All languages" || version.language === language);

  return <div className={s.root}>
    <section className={s.opening}><p className={s.eyebrow}>Plato · Phaedrus 274c–275b</p><h2>Remedy? Drug? A means of remembering?</h2><p>Theuth offers writing as a <em>pharmakon</em> for memory and wisdom. Thamus answers with the same word: a remedy for reminding, not memory. Follow the translators' choices, then read those choices in their passages.</p>
      <details><summary>Read the Greek and a reference crib</summary><p className={s.greek} lang="grc">{data.greek}</p><p>{data.greek_crib}</p><small>The English crib is model-generated.</small></details>
    </section>
    <div className={s.words} aria-label="Choose a Greek word and passage">{words.map(([key, greek, label]) => <button key={key} type="button" aria-pressed={slot === key} onClick={() => setSlot(key)}><strong lang="grc">{greek}</strong><span>{label}</span></button>)}</div>
    <p className={s.slotNote}>{data.slots.find(item => item.key === slot)?.describe}</p>
    <section className={s.overview}><div className={s.overviewHeading}><h3>Seventeen translations, 1484–1922 and one undated</h3><label>Language<select value={language} onChange={event => setLanguage(event.target.value)}>{["All languages", ...new Set(versions.map(version => version.language))].map(value => <option key={value}>{value}</option>)}</select></label></div>
      <p>Select a row to read it in the left comparison panel. The colors show the saved interpretation of the word's sense.</p>
      <div className={s.timeline}>{visible.map(version => {
        const r = rendering(version, slot);
        return <button type="button" key={version.id} onClick={() => setLeft(version.id)} aria-pressed={left === version.id} className={s.row}><span className={s.year}>{version.year ?? "n.d."}</span><span>{version.translator}<small>{version.language}</small></span><strong style={{ color: colors[r?.category || ""] || "#e6ccaa" }}>{r?.rendering || "Not recorded"}</strong><span className={s.category}>{r?.category || ""}</span></button>;
      })}</div>
    </section>
    <section className={s.compare} aria-label="Compare two translations">
      {[{ id: "left-version", value: left, set: setLeft, version: a }, { id: "right-version", value: right, set: setRight, version: b }].map((panel, index) => <div key={panel.id}><label className={s.selectLabel} htmlFor={panel.id}>{index === 0 ? "Left passage" : "Right passage"}<select id={panel.id} value={panel.value} onChange={event => panel.set(event.target.value)}>{versions.map(version => <option key={version.id} value={version.id}>{version.year ?? "Undated"} · {version.translator} · {version.language}</option>)}</select></label><Passage version={panel.version} slot={slot} /></div>)}
    </section>
    <p className={s.audit}>The original run checked 136 extracted renderings against their source passages; one did not match verbatim. The categories and interpretive notes are model judgments, not a scholarly consensus. <a href="/examples/pharmakon/original.html" target="_blank" rel="noreferrer">Open the full original explorer ↗</a></p>
  </div>;
}
