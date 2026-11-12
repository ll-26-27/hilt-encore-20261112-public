"use client";

import { useEffect, useState } from "react";
import data from "./data.json";
import s from "./phaedrus.module.css";

// Rebuilt from ll-26-27/eng298ai-20261103, 01-use-cases/maps/04-phaedrus-walk/operations: 01-passages.json (the three
// texts), 02-stops.json (topography, certainty, sources), 03-landmarks.json (OpenStreetMap coordinates) and
// 03-route.geojson (the hand-drawn conjectural route and approximate river). The original page draws these on Esri
// tiles with Leaflet; this one projects the same coordinates onto a plain SVG, with no basemap and no network.

const FOLDER = "https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/maps/04-phaedrus-walk";
type Stop = (typeof data.stops)[number];
type Speech = { speaker: string; text: string };

// Equirectangular projection over a small box (about 1.1 km by 0.5 km), true to scale at this latitude.
const B = { w: 23.7303, e: 23.7421, s: 37.9663, n: 37.9707 };
const LAT0 = (B.s + B.n) / 2;
const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180); // metres per degree of longitude
const MY = 110574; // metres per degree of latitude
const W = 1000;
const PX = W / ((B.e - B.w) * MX); // pixels per metre
const H = Math.round((B.n - B.s) * MY * PX);
const px = (lon: number, lat: number): [number, number] => [(lon - B.w) * MX * PX, (B.n - lat) * MY * PX];
const path = (coords: number[][]) => coords.map(([lon, lat], i) => `${i ? "L" : "M"}${px(lon, lat).map((v) => v.toFixed(1)).join(" ")}`).join(" ");

// Label placement for the landmarks, by hand (several sit within 30 m of each other).
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle"; text?: string }> = {
  olympieion: { dx: -20, dy: -12, anchor: "end", text: "Olympieion" },
  "arch-of-hadrian": { dx: 12, dy: 5, anchor: "start", text: "Arch of Hadrian" },
  delphinion: { dx: -14, dy: 6, anchor: "end", text: "Apollo Delphinios (site)" },
  "agia-fotini": { dx: -30, dy: -2, anchor: "end", text: "Agia Fotini" },
  "pan-sanctuary": { dx: -40, dy: 22, anchor: "end", text: "Sanctuary of Pan" },
  "ilissos-open": { dx: 0, dy: 0, anchor: "start", text: "" },
  "artemis-agrotera": { dx: -6, dy: 30, anchor: "middle", text: "Artemis Agrotera (site)" },
  "zeus-meilichios": { dx: 12, dy: 6, anchor: "start", text: "Zeus Meilichios (site)" },
  "panathenaic-stadium": { dx: 0, dy: -14, anchor: "middle", text: "Panathenaic Stadium" },
  ardettos: { dx: 0, dy: 24, anchor: "middle", text: "Ardettos hill" },
};

const CERT: Record<string, string> = { high: "certain place", medium: "probable", low: "conjecture" };

function Speeches({ list, greek }: { list: Speech[]; greek?: boolean }) {
  return (
    <div className={greek ? `${s.speeches} ${s.greek}` : s.speeches} lang={greek ? "grc" : "en"}>
      {list.map((sp, i) => (
        <p key={i}><b>{sp.speaker}</b> {sp.text}</p>
      ))}
    </div>
  );
}

export default function PhaedrusWalk() {
  const stops = data.stops;
  const [i, setI] = useState(0);
  const [tr, setTr] = useState<"fowler" | "jowett" | "greek">("fowler");
  const stop: Stop = stops[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (e.key === "ArrowRight") setI((v) => Math.min(stops.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stops.length]);

  // Stops 6-11 share one (conjectural) spot: draw one marker there that shows whichever of them is selected.
  const groups: { key: string; lat: number; lon: number; ns: number[]; conj: boolean }[] = [];
  for (const st of stops) {
    const key = `${st.lat},${st.lon}`;
    const g = groups.find((x) => x.key === key);
    const conj = st.position_status !== "located-landmark" && st.position_status !== "along-route-conjectural";
    if (g) g.ns.push(st.n); else groups.push({ key, lat: st.lat, lon: st.lon, ns: [st.n], conj });
  }
  const scaleM = 100;
  const lmOn = new Set(stop.landmarks);
  const acro = data.landmarks.find((l) => l.id === "acropolis");
  const ay = acro ? px(acro.lon, acro.lat)[1] : 0;

  return (
    <div className={s.wrap}>
      <div className={s.topline}>
        <p>Eleven stops in Plato&rsquo;s <em>Phaedrus</em>, placed on the ground by the Ilissos in Athens. Solid marks stand on things that are known; <span className={s.dashWord}>dashed</span> marks are conjecture, and each stop says whose. The whole walk is under a kilometre.</p>
        <p className={s.links}><a href={FOLDER} target="_blank" rel="noreferrer">The folder on GitHub ↗</a></p>
      </div>

      <div className={s.layout}>
        <div className={s.mapCol}>
          <figure className={s.map}>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schematic map of the walk along the Ilissos, from the Olympieion to the plane tree">
              <defs>
                <marker id="pw-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" /></marker>
              </defs>
              <rect width={W} height={H} className={s.ground} />
              {/* 100 m grid */}
              {Array.from({ length: Math.ceil(W / (scaleM * PX)) }, (_, k) => <line key={`v${k}`} x1={k * scaleM * PX} x2={k * scaleM * PX} y1={0} y2={H} className={s.grid} />)}
              {Array.from({ length: Math.ceil(H / (scaleM * PX)) }, (_, k) => <line key={`h${k}`} y1={k * scaleM * PX} y2={k * scaleM * PX} x1={0} x2={W} className={s.grid} />)}

              {data.route.filter((r) => r.style === "river").map((r) => (
                <g key={r.id}>
                  <title>{r.label}</title>
                  <path d={path(r.coords)} className={s.river} />
                </g>
              ))}
              <text x={px(23.7419, 37.97012)[0]} y={px(23.7419, 37.97012)[1] - 14} className={s.riverLabel} textAnchor="end" transform={`rotate(-21 ${px(23.7419, 37.97012)[0]} ${px(23.7419, 37.97012)[1] - 14})`}>Ilissos (approx. course)</text>

              {data.route.filter((r) => r.style !== "river").map((r) => (
                <g key={r.id}>
                  <title>{r.label} (conjectural, hand-drawn)</title>
                  <path d={path(r.coords)} className={r.style === "dotted" ? s.back : s.walk} />
                </g>
              ))}

              {acro && (
                <g className={s.offmap}>
                  <title>{acro.name}: off the map, to the west-north-west</title>
                  <line x1={60} y1={Math.max(18, ay) + 4} x2={14} y2={Math.max(18, ay) + 4} markerEnd="url(#pw-arrow)" />
                  <text x={66} y={Math.max(18, ay) + 8}>Acropolis</text>
                </g>
              )}

              {data.landmarks.filter((l) => l.id !== "acropolis").map((l) => {
                const [x, y] = px(l.lon, l.lat);
                const lab = LABEL[l.id];
                return (
                  <g key={l.id} className={lmOn.has(l.id) ? `${s.lm} ${s.lmOn}` : s.lm}>
                    <title>{`${l.name}\n${l.why}\nCoordinates: ${l.matched} (${l.geocoder})`}</title>
                    <circle cx={x} cy={y} r={6} />
                    {lab?.text && <text x={x + lab.dx} y={y + lab.dy} textAnchor={lab.anchor}>{lab.text}</text>}
                  </g>
                );
              })}

              {stops.filter((st) => st.alternatives).flatMap((st) => st.alternatives!.map((a, k) => {
                const [x, y] = px(a.lon, a.lat);
                const on = stop.n >= st.n;
                return (
                  <g key={a.label} className={on ? `${s.alt} ${s.altOn}` : s.alt}>
                    <title>{`Plane tree, candidate ${a.label}`}</title>
                    <circle cx={x} cy={y} r={36} />
                    <text x={x + (k === 0 ? 0 : -40)} y={y + (k === 0 ? -46 : 52)} textAnchor={k === 0 ? "middle" : "end"}>plane tree {a.label.slice(0, 1)}?</text>
                  </g>
                );
              }))}

              {stops.filter((st) => st.secondary).map((st) => {
                const sec = st.secondary!;
                const [x, y] = px(sec.lon, sec.lat);
                return (
                  <g key={`sec${st.n}`} className={stop.n === st.n ? `${s.alt} ${s.altOn}` : s.alt}>
                    <title>{sec.label}</title>
                    <circle cx={x} cy={y} r={11} />
                  </g>
                );
              })}

              {groups.map((g) => {
                const [x, y] = px(g.lon, g.lat);
                const sel = g.ns.includes(stop.n);
                const shown = sel ? stop.n : g.ns[0];
                const label = g.ns.length > 1 ? `${g.ns[0]}–${g.ns[g.ns.length - 1]}` : "";
                return (
                  <g key={g.key} className={`${s.stop} ${g.conj ? s.stopConj : ""} ${sel ? s.stopOn : ""}`} onClick={() => setI(stops.findIndex((st) => st.n === (sel ? stop.n : g.ns[0])))} role="button" tabIndex={-1}>
                    <title>{g.ns.map((n) => `${n}. ${stops[n - 1].title}`).join("\n")}</title>
                    <circle cx={x} cy={y} r={sel ? 19 : 15} />
                    <text x={x} y={y + 6} textAnchor="middle">{shown}</text>
                    {label && <text x={x} y={y + 58} textAnchor="middle" className={s.groupLabel}>stops {label}</text>}
                  </g>
                );
              })}

              {/* scale bar and north */}
              <g className={s.scale} transform={`translate(${W - 24 - 2 * scaleM * PX} ${H - 24})`}>
                <rect width={scaleM * PX} height={5} />
                <rect x={scaleM * PX} width={scaleM * PX} height={5} className={s.scaleAlt} />
                <text x={0} y={-6}>0</text>
                <text x={scaleM * PX} y={-6} textAnchor="middle">100</text>
                <text x={2 * scaleM * PX} y={-6} textAnchor="end">200 m</text>
              </g>
              <g className={s.scale} transform={`translate(${W - 26} ${H - 84})`}>
                <path d="M0 -14 L6 6 L0 2 L-6 6 Z" />
                <text y={20} textAnchor="middle">N</text>
              </g>
            </svg>
            <figcaption>
              <span><i className={s.kWalk} />the walk out (conjectural, hand-drawn)</span>
              <span><i className={s.kBack} />the way back</span>
              <span><i className={s.kRiver} />Ilissos, approximate (culverted today except by Agia Fotini)</span>
              <span><i className={s.kStop} />stop on a located landmark or the route</span>
              <span><i className={s.kConj} />conjectured place</span>
              <span><i className={s.kLm} />landmark (OpenStreetMap)</span>
            </figcaption>
            <p className={s.attrib}>No basemap: coordinates are projected onto a 100 m grid. {data.landmarkAttribution} Grid squares are 100 m; two or three stades is {data.stade.two_or_three_stades} ({data.stade.metres}).</p>
          </figure>

          <div className={s.controls}>
            <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Previous</button>
            <div className={s.dots}>
              {stops.map((st, k) => (
                <button key={st.n} type="button" className={k === i ? s.dotOn : ""} onClick={() => setI(k)} aria-label={`Stop ${st.n}: ${st.title}`} title={st.title}>{st.n}</button>
              ))}
            </div>
            <button type="button" onClick={() => setI(Math.min(stops.length - 1, i + 1))} disabled={i === stops.length - 1}>Next →</button>
          </div>
        </div>

        <article className={s.panel} key={stop.n}>
          <p className={s.meta}>Stop {stop.n} of {stops.length} · {stop.stephanus}<span className={`${s.badge} ${s[`c_${stop.certainty}`]}`}>{CERT[stop.certainty] ?? stop.certainty}</span></p>
          <h2>{stop.title}</h2>
          <blockquote>{stop.text_words}</blockquote>
          <p className={s.where}>{stop.where}</p>
          <div className={s.cc}>
            <div><h3>Certain</h3><p>{stop.what_is_certain}</p></div>
            <div className={s.conj}><h3>Conjecture</h3><p>{stop.what_is_conjecture}</p></div>
          </div>

          <div className={s.tabs} role="tablist">
            {(["fowler", "jowett", "greek"] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tr === k} onClick={() => setTr(k)}>{k === "fowler" ? "Fowler 1914" : k === "jowett" ? "Jowett 1892" : "Greek (Burnet)"}</button>
            ))}
          </div>
          <Speeches list={stop[tr]} greek={tr === "greek"} />

          <details className={s.sources}>
            <summary>Sources for this stop ({stop.sources.length})</summary>
            <ul>
              {stop.sources.map((k) => {
                const src = (data.sources as Record<string, { opened: boolean | null; cite: string | null; url?: string | null }>)[k];
                if (!src) return null;
                return (
                  <li key={k}>
                    <span className={src.opened ? s.opened : s.unopened}>{src.opened ? "opened" : "not opened"}</span>
                    {src.url ? <a href={src.url} target="_blank" rel="noreferrer">{src.cite}</a> : src.cite}
                  </li>
                );
              })}
            </ul>
          </details>
        </article>
      </div>
    </div>
  );
}
