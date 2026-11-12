"use client";
import { useMemo, useState } from "react";
import styles from "./dickens.module.css";

// The map is the project's own outputs/index.html, copied byte for byte into public/. It opens a place from a
// hash (#place=<place_id>) and listens for hashchange, so the jumps below only change the frame's fragment.
const MAP = "/examples/dickens-places/index.html";
const JUMPS = [
  { id: "marshalsea prison", label: "The Marshalsea" },
  { id: "lincolns inn", label: "Lincoln's Inn" },
  { id: "newgate prison", label: "Newgate (model estimate)" },
  { id: "custom house", label: "Custom House (misplaced)" },
  { id: "holborn hill", label: "Holborn Hill (phantoms)" },
  { id: "rome", label: "Rome" },
];

type Passage = [novel: number, chapter: string, role: "s" | "m", quote: string, verified: 0 | 1];
type Place = { id: string; n: string; t: string; m: number; k: number[]; why: string; p: Passage[] };
type Data = { novels: string[]; places: Place[] };

export default function DickensMap() {
  const [hash, setHash] = useState("");
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.jumps} aria-label="Open a place on the map">
          <span className={styles.jumpLabel}>Open:</span>
          {JUMPS.map((j) => (
            <button key={j.id} aria-pressed={hash === j.id} onClick={() => setHash(j.id)}>{j.label}</button>
          ))}
        </div>
        <a href={hash ? `${MAP}#place=${encodeURIComponent(hash)}` : MAP} target="_blank" rel="noreferrer">Open the full map ↗</a>
      </div>
      <iframe
        className={styles.frame}
        title="Dickens's Places: an interactive map of every place named in eight Dickens novels"
        src={hash ? `${MAP}#place=${encodeURIComponent(hash)}` : MAP}
      />
      <p className={styles.note}>The map needs an internet connection for its base map tiles (Esri) and for Leaflet; the places and passages are inside the page. On a narrow screen the controls sit below the map inside the frame; the full map is easier to use on its own.</p>
      <Unmapped />
    </div>
  );
}

function Unmapped() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const load = (open: boolean) => {
    if (!open || data) return;
    fetch("/examples/dickens-places/unmapped.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e: Error) => setError(e.message));
  };
  const shown = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    return s ? data.places.filter((p) => p.n.toLowerCase().includes(s) || p.p.some((x) => x[3].toLowerCase().includes(s))) : data.places;
  }, [data, q]);
  return (
    <details className={styles.unmapped} onToggle={(e) => load((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>Not on the map: all 530 places and their 939 passages</summary>
      <p className={styles.note}>The map&apos;s own list stops at the 300 most-mentioned, and the page does not carry their passages. This is every one, from the project&apos;s inventory and mentions files, in the map&apos;s order (most mentions first). &ldquo;Why&rdquo; is the reason the place is not drawn: fictional and never looked up, no gazetteer result, a gazetteer result that failed the name and type check, or a model estimate of low confidence or none.</p>
      {error && <p className={styles.note}>Could not load the list ({error}).</p>}
      {!data && !error && <p className={styles.note}>Loading…</p>}
      {data && (
        <>
          <label className={styles.search}>
            <span>Search names and passages</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Satis House, Jacob's Island, Fleet" />
          </label>
          <p className={styles.count}>{shown.length} of {data.places.length} places</p>
          <ol className={styles.list}>
            {shown.map((p) => (
              <li key={p.id}>
                <details>
                  <summary>
                    <span className={styles.name}>{p.n}</span>
                    <span className={styles.meta}>{p.t} · {p.m} {p.m === 1 ? "mention" : "mentions"} · {data.novels.filter((_, i) => p.k[i]).join(", ")}</span>
                  </summary>
                  <p className={styles.why}>Why not drawn: {p.why}</p>
                  <ul className={styles.passages}>
                    {p.p.map((x, i) => (
                      <li key={i}>
                        <span className={styles.where}><em>{data.novels[x[0]]}</em>, {x[1]} · <span className={x[2] === "s" ? styles.setting : undefined}>{x[2] === "s" ? "setting" : "mentioned"}</span>{x[4] ? "" : " · quotation not found in the text"}</span>
                        <q>{x[3] || "(empty quotation)"}</q>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        </>
      )}
    </details>
  );
}
