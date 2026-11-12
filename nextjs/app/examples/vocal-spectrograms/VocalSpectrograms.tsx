"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Comparison, Manifest, Stem } from "./types";
import { useAudio } from "./use-audio";
import { MetricsPanel } from "./MetricsPanel";
import { ComparisonPanel } from "./ComparisonPanel";
import s from "./vocal-spectrograms.module.css";

// A port of spectrogram-demo's apps/interface/app/page.tsx (commit 7e2860a). The manifest and every file it names were
// made offline by pipeline/generate.py and copied unchanged; the manifest's "/assets/..." paths are re-rooted here.
const BASE = "/examples/vocal-spectrograms";
const rebase = (p: string) => p.replace(/^\/assets\//, `${BASE}/`);

function rebaseManifest(m: Manifest): Manifest {
  return {
    stems: m.stems.map((st) => ({ ...st, audio: rebase(st.audio), spectrogram: rebase(st.spectrogram), spectrogramWithPeaks: rebase(st.spectrogramWithPeaks), profilePlot: rebase(st.profilePlot), analysis: rebase(st.analysis) })),
    comparisons: m.comparisons.map((c) => ({ ...c, overlayImage: rebase(c.overlayImage), stackedImage: rebase(c.stackedImage), profileComparison: rebase(c.profileComparison) })),
  };
}

type Mode = "single" | "compare";
type Toggles = { playhead: boolean; peaks: boolean; metrics: boolean; overlay: boolean; summary: boolean; diffMetrics: boolean };

export default function VocalSpectrograms() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>("single");
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [toggles, setToggles] = useState<Toggles>({ playhead: true, peaks: false, metrics: true, overlay: true, summary: true, diffMetrics: true });

  const audioA = useAudio();
  const audioB = useAudio();
  const { load: loadA } = audioA;
  const { load: loadB } = audioB;

  useEffect(() => {
    fetch(`${BASE}/data/manifest.json`)
      .then((r) => r.json())
      .then((raw: Manifest) => {
        const data = rebaseManifest(raw);
        setManifest(data);
        if (data.stems.length > 0) setSelectedA(data.stems[0].id);
        if (data.stems.length > 1) setSelectedB(data.stems[1].id);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (!manifest || !selectedA) return;
    const stem = manifest.stems.find((x) => x.id === selectedA);
    if (stem) loadA(stem.audio);
  }, [selectedA, manifest, loadA]);

  useEffect(() => {
    if (!manifest || !selectedB || mode !== "compare") return;
    const stem = manifest.stems.find((x) => x.id === selectedB);
    if (stem) loadB(stem.audio);
  }, [selectedB, manifest, mode, loadB]);

  const toggle = useCallback((id: keyof Toggles) => setToggles((prev) => ({ ...prev, [id]: !prev[id] })), []);

  if (!manifest) return <p className={s.loading}>{failed ? "The manifest did not load." : "Loading manifest…"}</p>;

  const stemA: Stem | undefined = manifest.stems.find((x) => x.id === selectedA);
  const stemB: Stem | undefined = manifest.stems.find((x) => x.id === selectedB);
  const comparison: Comparison | undefined = mode === "compare" && selectedA && selectedB
    ? manifest.comparisons.find((c) => (c.a === selectedA && c.b === selectedB) || (c.a === selectedB && c.b === selectedA))
    : undefined;

  const singleToggles: { id: keyof Toggles; label: string }[] = [
    { id: "playhead", label: "Playhead" },
    { id: "peaks", label: "F0 Contour" },
    { id: "metrics", label: "Vocal Analysis" },
  ];
  const compareToggles: { id: keyof Toggles; label: string }[] = [
    { id: "playhead", label: "Playhead" },
    { id: "overlay", label: "Overlay" },
    { id: "diffMetrics", label: "Diff Metrics" },
    { id: "summary", label: "Summary" },
    { id: "metrics", label: "Vocal Analysis" },
  ];

  return (
    <div className={s.root}>
      <div className={s.header}>
        <span className={s.appTitle}>Vocal Spectrogram Explorer</span>
        <div className={s.modeSwitch} role="group" aria-label="Mode">
          {(["single", "compare"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} className={mode === m ? s.on : ""} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
      </div>

      <div className={s.controls}>
        <StemSelector stems={manifest.stems} selected={selectedA} onSelect={setSelectedA} label={mode === "compare" ? "Stem A" : "Stem"} />
        {mode === "compare" && <StemSelector stems={manifest.stems} selected={selectedB} onSelect={setSelectedB} label="Stem B" />}
        <div className={s.toggleBar}>
          {(mode === "single" ? singleToggles : compareToggles).map((t) => (
            <button key={t.id} type="button" aria-pressed={toggles[t.id]} className={toggles[t.id] ? s.on : ""} onClick={() => toggle(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {mode === "single" && stemA && (
        <div className={s.stack}>
          <SpectrogramPanel src={toggles.peaks ? stemA.spectrogramWithPeaks : stemA.spectrogram} alt={`Spectrogram of the ${stemA.label} stem${toggles.peaks ? ", with its F0 contour in green" : ""}`} progress={audioA.progress} showPlayhead={toggles.playhead} onSeek={audioA.seek} />
          <AudioPlayer audio={audioA} label={stemA.label} />
          {toggles.metrics && <MetricsPanel metrics={stemA.metrics} />}
        </div>
      )}

      {mode === "compare" && stemA && stemB && (
        <div className={s.stackWide}>
          <div className={s.pair}>
            <div className={s.stackTight}>
              <SpectrogramPanel src={stemA.spectrogram} alt={`Spectrogram of the ${stemA.label} stem`} progress={audioA.progress} showPlayhead={toggles.playhead} onSeek={audioA.seek} label={stemA.label} />
              <AudioPlayer audio={audioA} label={stemA.label} />
            </div>
            <div className={s.stackTight}>
              <SpectrogramPanel src={stemB.spectrogram} alt={`Spectrogram of the ${stemB.label} stem`} progress={audioB.progress} showPlayhead={toggles.playhead} onSeek={audioB.seek} label={stemB.label} />
              <AudioPlayer audio={audioB} label={stemB.label} />
            </div>
          </div>

          {comparison && <ComparisonPanel comparison={comparison} showOverlay={toggles.overlay} showProfiles={false} showMetrics={toggles.diffMetrics} showSummary={toggles.summary} />}
          {stemA.id === stemB.id && <p className={s.small}>Pick two different stems to see the comparison.</p>}

          {toggles.metrics && (
            <div className={s.pair}>
              <div><p className={s.small}>{stemA.label}</p><MetricsPanel metrics={stemA.metrics} /></div>
              <div><p className={s.small}>{stemB.label}</p><MetricsPanel metrics={stemB.metrics} /></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StemSelector({ stems, selected, onSelect, label }: { stems: Stem[]; selected: string | null; onSelect: (id: string) => void; label: string }) {
  return (
    <div className={s.stackTight}>
      <span className={s.eyebrow}>{label}</span>
      <div className={s.stemButtons} role="group" aria-label={label}>
        {stems.map((stem) => (
          <button key={stem.id} type="button" aria-pressed={selected === stem.id} className={selected === stem.id ? s.on : ""} onClick={() => onSelect(stem.id)}>{stem.label}</button>
        ))}
      </div>
    </div>
  );
}

function SpectrogramPanel({ src, alt, progress, showPlayhead, onSeek, label }: { src: string; alt: string; progress: number; showPlayhead: boolean; onSeek: (f: number) => void; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const click = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width);
  };
  return (
    <div className={s.stackTight}>
      {label && <h3 className={s.eyebrow}>{label}</h3>}
      <div ref={ref} className={s.spectrogram} onClick={click} title="Click to seek">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={s.img} draggable={false} />
        {showPlayhead && <div className={s.playhead} style={{ left: `${progress * 100}%` }}><span /></div>}
      </div>
    </div>
  );
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;

function AudioPlayer({ audio, label }: { audio: ReturnType<typeof useAudio>; label: string }) {
  const { playing, currentTime, duration, progress, play, pause, seek } = audio;
  return (
    <div className={s.player}>
      <button type="button" className={s.playBtn} onClick={playing ? pause : play} aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
        {playing
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginLeft: 2 }}><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" /></svg>}
      </button>
      <button type="button" className={s.restart} onClick={() => seek(0)} aria-label={`Back to the start of ${label}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
      </button>
      <span className={s.time}>{fmt(currentTime)}</span>
      <div className={s.track} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
        <div className={s.trackFill} style={{ width: `${progress * 100}%` }} />
      </div>
      <span className={`${s.time} ${s.right}`}>{fmt(duration)}</span>
    </div>
  );
}
