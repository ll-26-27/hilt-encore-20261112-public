"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type Frame = {
  key: string; // also the address: /present#<key>
  part: number;
  partTitle: string;
  title: string;
  layout: string;
  who: string;
  steps: number;
  body: React.ReactNode;
};

const W = 1600;
const H = 900;

const HELP: Array<[string, string]> = [
  ["→ / space / clicker", "next"],
  ["← / backspace", "back"],
  ["0–6", "jump to a part (0 open, 6 close)"],
  ["home / end", "first / last slide"],
  ["f", "full screen"],
  ["g", "all slides"],
  ["q", "the site's QR code"],
  ["b", "blank screen"],
  ["r", "reload the words (keeps your place)"],
  ["?", "these keys"],
];

// The slides for the day. Screen-shared on Zoom, so everything is drawn on a fixed 1600×900 stage and scaled to the
// window. The place is kept in the address (/present#<frame key>), so reloading, or `r` after CX changes the words,
// stays on the same slide.
export default function Deck({ frames, qr, url }: { frames: Frame[]; qr: string; url: string }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [overlay, setOverlay] = useState<"" | "grid" | "qr" | "blank" | "help">("");
  const [scale, setScale] = useState(1);
  const [placed, setPlaced] = useState(false); // the address has been read; only then is it written back
  const touch = useRef<number | null>(null);
  const frame = frames[Math.min(index, frames.length - 1)];

  // Read the place from the address on load and when it changes (back button, a pasted link).
  useEffect(() => {
    const read = () => {
      const key = decodeURIComponent(window.location.hash.slice(1));
      const found = frames.findIndex((f) => f.key === key);
      if (found >= 0) setIndex(found);
      setPlaced(true);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [frames]);

  useEffect(() => {
    if (!frame || !placed) return;
    const hash = `#${encodeURIComponent(frame.key)}`;
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
    document.title = `${frame.title} · HILT Encore 2026`;
  }, [frame, placed]);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const go = useCallback((to: number, atStep = 1) => {
    setIndex(Math.max(0, Math.min(frames.length - 1, to)));
    setStep(atStep);
    setOverlay("");
  }, [frames.length]);

  const next = useCallback(() => {
    if (frame && step < frame.steps) setStep(step + 1);
    else go(index + 1);
  }, [frame, step, index, go]);

  const prev = useCallback(() => {
    if (step > 1) setStep(step - 1);
    else if (index > 0) go(index - 1, frames[index - 1].steps);
  }, [step, index, frames, go]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const k = event.key;
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) next();
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) prev();
      else if (k === "Home") go(0);
      else if (k === "End") go(frames.length - 1);
      else if (/^[0-9]$/.test(k)) {
        const found = frames.findIndex((f) => f.part === Number(k));
        if (found >= 0) go(found);
      } else if (k === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (k === "g") setOverlay((o) => (o === "grid" ? "" : "grid"));
      else if (k === "q") setOverlay((o) => (o === "qr" ? "" : "qr"));
      else if (k === "b" || k === ".") setOverlay((o) => (o === "blank" ? "" : "blank"));
      else if (k === "?") setOverlay((o) => (o === "help" ? "" : "help"));
      else if (k === "Escape") setOverlay("");
      else if (k === "r") router.refresh();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, frames, router]);

  if (!frame) return null;
  const parts = frames.filter((f, i) => i === 0 || f.part !== frames[i - 1].part);

  return (
    <main
      id="main"
      className="deck"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touch.current = null;
      }}
    >
      <div className="stage" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <section key={frame.key} className={`frame layout-${frame.layout}`} data-step={step} style={{ ["--step" as string]: step }}>
          {frame.body}
          <footer className="frame-foot">
            <span>{frame.part > 0 && frame.part < 6 ? `${frame.part} · ` : ""}{frame.partTitle}</span>
            {frame.who && <span className="frame-who">{frame.who}</span>}
          </footer>
        </section>
        <nav className="progress" aria-label="Parts">
          {parts.map((p) => {
            const start = frames.indexOf(p);
            const count = frames.filter((f) => f.part === p.part).length;
            const inPart = frame.part === p.part;
            const done = inPart ? (index - start + 1) / count : index > start ? 1 : 0;
            return (
              <button key={p.key} type="button" onClick={() => go(start)} title={p.partTitle} style={{ flexGrow: count }}>
                <i style={{ width: `${done * 100}%` }} />
              </button>
            );
          })}
        </nav>
      </div>

      {overlay === "blank" && <div className="overlay blank" onClick={() => setOverlay("")} />}
      {overlay === "qr" && (
        <div className="overlay qr-overlay" onClick={() => setOverlay("")}>
          <div className="qr-card" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="qr-url">{url}</p>
          <p className="qr-hint">Open the talk on your own screen</p>
        </div>
      )}
      {overlay === "grid" && (
        <div className="overlay grid-overlay" onClick={() => setOverlay("")}>
          <ol>
            {frames.map((f, i) => (
              <li key={f.key}>
                <button type="button" className={i === index ? "current" : ""} onClick={(e) => { e.stopPropagation(); go(i); }}>
                  <span>{f.part > 0 && f.part < 6 ? f.part : f.part === 0 ? "Open" : "Close"} · {f.layout}</span>
                  <strong>{f.title}</strong>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
      {overlay === "help" && (
        <div className="overlay help-overlay" onClick={() => setOverlay("")}>
          <dl>{HELP.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      )}
      <a className="deck-exit" href={frame.part > 0 && frame.part < 6 ? `/#parts` : "/"}>Site</a>
    </main>
  );
}
