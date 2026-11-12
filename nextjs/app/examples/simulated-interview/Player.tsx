"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { contextFiles } from "./contextFiles";
import type { Line, Script } from "./script";
import styles from "./interview.module.css";

// A playback of week 8's interview machine: a clock runs through CX's script; each spoken line is "cut and transcribed"
// word by word in its speaker's channel and in the merged transcript; the AI producer's pre-written notes appear only
// when someone presses "Ask the producer", and cite files in the week 9 sample context folder, which opens beside it.
// Everything is computed from the time t, so scrubbing, pausing, and 2x all stay in step. Voices (macOS `say` clips,
// made beforehand) follow the clock, not the other way round.

type Initial = { t: number; play: boolean; ask: boolean; file: string; card: boolean };

const COLORS = ["#ff6b57", "#7fc787", "#7fb4ff", "#e3c35a"];
const PRODUCER_COLOR = "#c3a8ff";
const CONTEXT_REPO = "https://github.com/tdm155ai/tdm155ai-week-9/tree/main/sample-context-repo";

type Token = { w: string; em: boolean; glue: boolean };
type Timed = Line & { index: number; tokens: Token[]; at: number[]; reveal: number };

function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let prev = "";
  for (const seg of text.split(/(\*[^*]+\*)/)) {
    if (!seg) continue;
    const em = /^\*[^*]+\*$/.test(seg);
    const s = em ? seg.slice(1, -1) : seg;
    const glueFirst = out.length > 0 && !/^\s/.test(seg) && !/\s$/.test(prev);
    s.split(/\s+/).filter(Boolean).forEach((w, i) => out.push({ w, em, glue: i === 0 && glueFirst }));
    prev = seg;
  }
  return out;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function shownWords(line: Timed, t: number) {
  if (t < line.start) return 0;
  const e = t - line.start;
  if (e >= line.reveal) return line.tokens.length;
  let n = 0;
  while (n < line.at.length && line.at[n] <= e) n++;
  return n;
}

// A meter that looks like speech: syllable-rate wobble on top of a slower phrase envelope.
function level(t: number, seed: number) {
  const v = 0.58 + 0.22 * Math.sin(t * 13.7 + seed) * Math.sin(t * 4.3 + seed * 2) + 0.14 * Math.sin(t * 29.1 + seed * 3) + 0.08 * Math.sin(t * 1.7 + seed);
  return Math.max(0.12, Math.min(1, v));
}

// The context folder as a tree.
type Node = { name: string; path: string; dir: boolean; children: Node[] };
function buildTree(paths: string[]): Node {
  const root: Node = { name: "", path: "", dir: true, children: [] };
  for (const p of paths) {
    const parts = p.split("/");
    let node = root;
    parts.forEach((part, i) => {
      const sub = parts.slice(0, i + 1).join("/");
      const dir = i < parts.length - 1;
      let child = node.children.find((c) => c.name === part && c.dir === dir);
      if (!child) { child = { name: part, path: dir ? `${sub}/` : sub, dir, children: [] }; node.children.push(child); }
      node = child;
    });
  }
  const sort = (n: Node) => {
    n.children.sort((a, b) => (a.dir === b.dir ? (a.name.toLowerCase() === "readme.md" ? -1 : b.name.toLowerCase() === "readme.md" ? 1 : a.name.localeCompare(b.name)) : a.dir ? 1 : -1));
    n.children.forEach(sort);
  };
  sort(root);
  return root;
}

const FILES = new Map(contextFiles.map((f) => [f.path, f.content]));
const FOLDERS = new Set(contextFiles.flatMap((f) => f.path.split("/").slice(0, -1).map((_, i, a) => `${a.slice(0, i + 1).join("/")}/`)));
const isPrivate = (p: string) => p === "private/" || p.startsWith("private/");
const PATH_RE = /((?:[A-Za-z0-9_-]+\/)+(?:[A-Za-z0-9_.-]+\.md)?|\b[A-Za-z0-9_-]+\.md\b)/g;

function citations(text: string) {
  return [...text.matchAll(PATH_RE)].map((m) => m[0]).filter((p) => FILES.has(p) || FOLDERS.has(p));
}

// YAML frontmatter, shown as a small key/value list instead of being rendered as Markdown.
function splitFront(text: string): { meta: Array<[string, string]>; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: [], body: text };
  const meta = m[1].split(/\r?\n/).map((l) => l.match(/^([\w-]+):\s*(.*)$/)).filter((x): x is RegExpMatchArray => !!x).map((x) => [x[1], x[2].replace(/^["']|["']$/g, "")] as [string, string]);
  return { meta, body: text.slice(m[0].length) };
}

function resolveRelative(href: string, from: string) {
  const parts = from.split("/").slice(0, -1);
  for (const seg of href.split("#")[0].split("/")) {
    if (seg === "..") parts.pop();
    else if (seg && seg !== ".") parts.push(seg);
  }
  return parts.join("/");
}

export default function Player({ script, initial }: { script: Script; initial: Initial }) {
  const { speakers, duration, notes } = script;
  const colorOf = useMemo(() => Object.fromEntries(speakers.map((s, i) => [s.id, COLORS[i % COLORS.length]])), [speakers]);
  const nameOf = useMemo(() => Object.fromEntries(speakers.map((s) => [s.id, s.name])), [speakers]);

  const lines: Timed[] = useMemo(() => script.lines.map((l, index, all) => {
    const tokens = tokenize(l.text);
    const next = all[index + 1]?.start ?? duration;
    const slot = Math.max(1, next - l.start - 0.4);
    const reveal = l.voice ? Math.min(l.voice.duration, slot + 0.3) : Math.min(slot, tokens.length * 0.32 + 0.4);
    const weights = tokens.map((t) => t.w.length + 2);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const at = weights.map((w) => { const v = (acc / total) * reveal * 0.96; acc += w; return v; });
    return { ...l, index, tokens, at, reveal };
  }), [script.lines, duration]);

  const [t, setT] = useState(initial.t);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voicesOn, setVoicesOn] = useState(true);
  const [epoch, setEpoch] = useState(0);
  const [askedAt, setAskedAt] = useState(initial.ask ? initial.t : -1);
  const [drawer, setDrawer] = useState<string>(initial.file && FILES.has(initial.file) ? initial.file : "");
  const [selected, setSelected] = useState<string>(FILES.has("README.md") ? "README.md" : contextFiles[0]?.path ?? "");
  const [open, setOpen] = useState<Set<string>>(() => new Set([...FOLDERS].filter((f) => !isPrivate(f))));
  const tRef = useRef(initial.t);
  const audio = useRef<Map<number, HTMLAudioElement>>(new Map());
  const hasVoices = lines.some((l) => l.voice);

  // Voices: one preloaded element per clip.
  useEffect(() => {
    const map = new Map<number, HTMLAudioElement>();
    lines.forEach((l) => { if (l.voice) { const a = new Audio(l.voice.src); a.preload = "auto"; map.set(l.index, a); } });
    audio.current = map;
    return () => { map.forEach((a) => { a.pause(); a.src = ""; }); };
  }, [lines]);

  const syncAudio = useCallback((now: number, live: boolean) => {
    audio.current.forEach((a, i) => {
      const l = lines[i];
      const want = live && voicesOn && now >= l.start && now < l.start + (l.voice?.duration ?? 0) - 0.05;
      if (want) {
        const pos = now - l.start;
        if (a.playbackRate !== speed) a.playbackRate = speed;
        if (a.paused) { try { a.currentTime = pos; } catch {} a.play().catch(() => {}); }
        else if (Math.abs(a.currentTime - pos) > 0.4 * speed) { try { a.currentTime = pos; } catch {} }
      } else if (!a.paused) a.pause();
    });
  }, [lines, voicesOn, speed]);

  // The clock.
  useEffect(() => {
    if (!playing) { syncAudio(tRef.current, false); return; }
    let raf = 0;
    const wall = performance.now();
    const from = tRef.current;
    const loop = (now: number) => {
      let nt = from + ((now - wall) / 1000) * speed;
      if (nt >= duration) nt = duration;
      tRef.current = nt;
      setT(nt);
      syncAudio(nt, nt < duration);
      if (nt < duration) raf = requestAnimationFrame(loop);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, epoch, duration, syncAudio]);

  const seek = useCallback((to: number) => {
    const nt = Math.max(0, Math.min(duration, to));
    tRef.current = nt;
    setT(nt);
    setEpoch((e) => e + 1);
    audio.current.forEach((a) => a.pause());
  }, [duration]);

  const toggle = useCallback(() => {
    if (!playing && tRef.current >= duration - 0.05) seek(0);
    setPlaying((p) => !p);
  }, [playing, duration, seek]);

  // ?play=1
  useEffect(() => { if (initial.play) setPlaying(true); }, [initial.play]);

  // Space plays and pauses, arrows skip 5 s, Escape closes the file.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.closest("input, textarea, select, [contenteditable]") || (e.key === " " && el.closest("button, a, summary")))) return;
      if (e.key === " ") { e.preventDefault(); toggle(); }
      else if (e.key === "ArrowRight") seek(tRef.current + 5);
      else if (e.key === "ArrowLeft") seek(tRef.current - 5);
      else if (e.key === "Escape") setDrawer("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seek]);

  const heard = lines.filter((l) => l.start <= t);
  const active = lines.filter((l) => t > l.start && t < l.start + l.reveal);
  const reachedNotes = notes.filter((n) => n.start <= t);
  const shownNotes = notes.filter((n) => n.start <= Math.min(askedAt, t));
  const waiting = reachedNotes.length - shownNotes.length;
  const cited = useMemo(() => new Set(shownNotes.flatMap((n) => citations(n.text))), [shownNotes]);

  const ask = () => setAskedAt(tRef.current);

  const openPath = (p: string) => {
    if (FOLDERS.has(p)) {
      setOpen((o) => new Set(o).add(p));
      const readme = `${p}README.md`;
      setDrawer(FILES.has(readme) ? readme : "");
      if (!FILES.has(readme)) document.getElementById("interview-folder")?.scrollIntoView({ behavior: "smooth" });
    } else if (FILES.has(p)) {
      setDrawer(p);
      setSelected(p);
      const parts = p.split("/").slice(0, -1);
      setOpen((o) => { const n = new Set(o); parts.forEach((_, i) => n.add(`${parts.slice(0, i + 1).join("/")}/`)); return n; });
    }
  };

  // Keep the newest words in view.
  const progress = `${heard.length}:${heard.length ? shownWords(heard[heard.length - 1], t) : 0}`;
  const merged = useRef<HTMLOListElement>(null);
  const lanes = useRef<Map<string, HTMLOListElement>>(new Map());
  const notesRef = useRef<HTMLOListElement>(null);
  useLayoutEffect(() => {
    if (merged.current) merged.current.scrollTop = merged.current.scrollHeight;
    lanes.current.forEach((el) => { el.scrollTop = el.scrollHeight; });
  }, [progress]);
  useLayoutEffect(() => { if (notesRef.current) notesRef.current.scrollTop = notesRef.current.scrollHeight; }, [shownNotes.length]);

  const tree = useMemo(() => buildTree(contextFiles.map((f) => f.path)), []);

  const words = (l: Timed, n: number) => (
    <>
      {l.tokens.slice(0, n).map((tok, i) => (
        <Fragment key={i}>{i > 0 && !tok.glue ? " " : ""}{tok.em ? <em>{tok.w}</em> : tok.w}</Fragment>
      ))}
      {n < l.tokens.length && <span className={styles.caret} aria-hidden="true" />}
    </>
  );

  const noteText = (text: string) => {
    const parts = text.split(PATH_RE);
    return parts.map((part, i) =>
      i % 2 === 1 && (FILES.has(part) || FOLDERS.has(part))
        ? <button key={i} type="button" className={`${styles.cite} ${isPrivate(part) ? styles.citePrivate : ""}`} onClick={() => openPath(part)}>{part}</button>
        : <Fragment key={i}>{part}</Fragment>,
    );
  };

  const renderTree = (node: Node, depth: number): React.ReactNode => node.children.map((c) => (
    <li key={c.path}>
      {c.dir ? (
        <>
          <button type="button" className={styles.treeDir} style={{ paddingLeft: 10 + depth * 18 }} onClick={() => setOpen((o) => { const n = new Set(o); if (n.has(c.path)) n.delete(c.path); else n.add(c.path); return n; })} aria-expanded={open.has(c.path)}>
            <span className={styles.chev} aria-hidden="true">{open.has(c.path) ? "▾" : "▸"}</span>{c.name}/
            {isPrivate(c.path) && <span className={styles.tagPrivate}>not for the podcast</span>}
            {cited.has(c.path) && <span className={styles.citedDot} title="Cited by the producer" />}
          </button>
          {open.has(c.path) && <ul>{renderTree(c, depth + 1)}</ul>}
        </>
      ) : (
        <button type="button" className={`${styles.treeFile} ${selected === c.path ? styles.treeOn : ""}`} style={{ paddingLeft: 28 + depth * 18 }} onClick={() => setSelected(c.path)}>
          {c.name}
          {cited.has(c.path) && <span className={styles.citedDot} title="Cited by the producer" />}
        </button>
      )}
    </li>
  ));

  const fileView = (p: string, onLink: (p: string) => void) => {
    const { meta, body } = splitFront(FILES.get(p) ?? "");
    return (
    <div className={styles.fileBody}>
      {meta.length > 0 && <dl className={styles.meta}>{meta.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>}
      {isPrivate(p) && <p className={styles.privateNote}>In <code>private/</code>: marked “not for the podcast or the ensemble.” The producer skips this folder; it’s shown here only because this is a simulation.</p>}
      <div className={styles.md}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => {
              const h = href ?? "";
              if (/^https?:\/\//i.test(h)) return <a href={h} target="_blank" rel="noreferrer">{children}</a>;
              const target = resolveRelative(h, p);
              if (FILES.has(target) || FOLDERS.has(`${target}/`)) return <a href="#" onClick={(e) => { e.preventDefault(); onLink(FILES.has(target) ? target : `${target}/`); }}>{children}</a>;
              return <span>{children}</span>;
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
    );
  };

  return (
    <div className={`${styles.player} ${initial.card ? styles.card : ""}`}>
      {script.placeholder && <p className={styles.notice}>The script file isn’t there yet, so this is a four-line placeholder.</p>}

      <section className={styles.deck} aria-label="The interview machine">
        <div className={styles.transport}>
          <button type="button" className={playing ? styles.pause : styles.play} onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            <span className={playing ? styles.pauseIcon : styles.playIcon} aria-hidden="true" />{playing ? "Pause" : t >= duration - 0.05 ? "Again" : t > 0 ? "Resume" : "Play"}
          </button>
          <span className={styles.clock}><span>{clock(t)}</span><span className={styles.of}> / {clock(duration)}</span></span>
          <span className={playing ? styles.onAir : styles.offAir}>{playing ? "On air" : "Paused"} · {speakers.length} mics</span>
          <span className={styles.spacer} />
          <span className={styles.seg} role="group" aria-label="Speed">
            {[1, 2].map((s) => (
              <button key={s} type="button" className={speed === s ? styles.segOn : undefined} onClick={() => setSpeed(s)} aria-pressed={speed === s}>{s}×</button>
            ))}
          </span>
          {hasVoices && (
            <button type="button" className={voicesOn ? styles.toggleOn : styles.toggle} onClick={() => setVoicesOn((v) => !v)} aria-pressed={voicesOn} title="Pre-made voices from macOS's say command">
              {voicesOn ? "Voices on" : "Voices off"}
            </button>
          )}
          <button type="button" className={styles.toggle} onClick={() => { seek(0); setAskedAt(-1); }}>Restart</button>
        </div>

        <div className={styles.timeline}>
          <div className={styles.track}>
            {notes.map((n, i) => (
              <span key={`n${i}`} className={styles.noteTick} style={{ left: `${(n.start / duration) * 100}%`, opacity: n.start <= askedAt ? 1 : 0.45 }} title={`Producer note at ${clock(n.start)}`} />
            ))}
            {lines.map((l) => (
              <span key={l.index} className={styles.segment} style={{ left: `${(l.start / duration) * 100}%`, width: `${(l.reveal / duration) * 100}%`, background: colorOf[l.id], top: `${8 + speakers.findIndex((s) => s.id === l.id) * 14}px` }} />
            ))}
            <span className={styles.played} style={{ width: `${(t / duration) * 100}%` }} />
            <span className={styles.head} style={{ left: `${(t / duration) * 100}%` }} />
            <input className={styles.scrub} type="range" min={0} max={duration} step={0.1} value={t} onChange={(e) => seek(Number(e.target.value))} aria-label="Scrub through the interview" />
          </div>
          <div className={styles.ticks}>
            {Array.from({ length: Math.floor(duration / 30) + 1 }, (_, i) => i * 30).map((s) => (
              <span key={s} style={{ left: `${(s / duration) * 100}%` }}>{clock(s)}</span>
            ))}
          </div>
        </div>

        <div className={styles.strips} style={{ gridTemplateColumns: `repeat(${Math.min(speakers.length, 3)}, minmax(0, 1fr))` }}>
          {speakers.map((s, si) => {
            const talking = active.find((l) => l.id === s.id);
            const lv = playing && talking ? level(t, si * 1.9 + 0.7) : talking ? 0.55 : 0;
            const mine = heard.filter((l) => l.id === s.id);
            return (
              <div key={s.id} className={`${styles.strip} ${talking ? styles.stripLive : ""}`} style={{ ["--c" as string]: colorOf[s.id] }}>
                <header className={styles.stripHead}>
                  <span className={styles.chan}>MIC {si + 1}</span>
                  <span className={styles.who}><strong>{s.name}</strong><small>{s.role}</small></span>
                  <span className={talking ? styles.liveTag : styles.idleTag}>{talking ? "speaking" : "listening"}</span>
                </header>
                <div className={styles.leds} aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => {
                    const on = (i + 1) / 24 <= lv;
                    return <span key={i} className={on ? (i >= 21 ? styles.ledHot : i >= 17 ? styles.ledWarm : styles.ledOn) : styles.led} />;
                  })}
                </div>
                <ol className={styles.lane} ref={(el) => { if (el) lanes.current.set(s.id, el); else lanes.current.delete(s.id); }}>
                  {!mine.length && <li className={styles.laneEmpty}>Nothing yet. Each thing {s.name.split(" ")[0]} says is cut and transcribed here.</li>}
                  {mine.map((l) => {
                    const n = shownWords(l, t);
                    return (
                      <li key={l.index} className={n < l.tokens.length ? styles.laneLive : undefined}>
                        <time>{clock(l.start)}</time>
                        <span>{words(l, n)}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.columns}>
        <section className={styles.transcript} aria-label="Transcript">
          <header className={styles.panelHead}>
            <h2>Transcript</h2>
            <span className={styles.count}>{heard.length} of {lines.length} cuts</span>
          </header>
          <ol className={styles.lines} ref={merged}>
            {!heard.length && <li className={styles.empty}>Press Play. Each speaker is cut at their pauses and transcribed as they talk, into one transcript.</li>}
            {heard.map((l) => {
              const n = shownWords(l, t);
              return (
                <li key={l.index} style={{ borderLeftColor: colorOf[l.id] }}>
                  <span className={styles.lineWho}>{nameOf[l.id] ?? l.id} <time>{clock(l.start)}</time></span>
                  <span className={styles.lineText}>{words(l, n)}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={styles.producer} aria-label="AI producer">
          <header className={styles.panelHead}>
            <h2>{script.producer.name}</h2>
          </header>
          <p className={styles.prewritten}>Pre-written producer notes (no model is called)</p>
          <button type="button" className={styles.ask} onClick={ask}>
            Ask the producer
            {waiting > 0 && <span className={styles.badge}>{waiting}</span>}
          </button>
          <ol className={styles.notes} ref={notesRef}>
            {askedAt < 0 && (
              <li className={styles.quiet}>
                Quiet until asked. It has read the guest’s context folder ({contextFiles.length} files), and speaks only when the producer presses the button.
              </li>
            )}
            {askedAt >= 0 && !shownNotes.length && <li className={styles.quiet}>Nothing to add yet.</li>}
            {shownNotes.map((n) => (
              <li key={`${n.start}-${n.text.length}`} className={styles.note}>
                <span className={styles.lineWho}>Note at <time>{clock(n.start)}</time></span>
                <span>{noteText(n.text)}</span>
              </li>
            ))}
          </ol>
          {script.producer.role && <p className={styles.role}>{script.producer.name}: {script.producer.role}.</p>}
        </section>
      </div>

      {!initial.card && (
        <section className={styles.folder} id="interview-folder" aria-label="The guest's context folder">
          <header className={styles.panelHead}>
            <h2>The guest’s context folder</h2>
            <a className={styles.count} href={CONTEXT_REPO} target="_blank" rel="noreferrer">copied from tdm155ai/tdm155ai-week-9 · an invented student ↗</a>
          </header>
          <div className={styles.folderGrid}>
            <nav className={styles.tree} aria-label="Files">
              <ul>{renderTree(tree, 0)}</ul>
            </nav>
            <article className={styles.reader} aria-label={selected}>
              <header className={styles.readerHead}><code>{selected}</code></header>
              {selected && fileView(selected, (p) => (FILES.has(p) ? setSelected(p) : openPath(p)))}
            </article>
          </div>
        </section>
      )}

      {drawer && (
        <div className={styles.scrim} onClick={() => setDrawer("")}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} aria-label={drawer}>
            <header className={styles.drawerHead}>
              <span>
                <small>From the context folder</small>
                <code>{drawer}</code>
              </span>
              <button type="button" onClick={() => setDrawer("")} aria-label="Close">Close</button>
            </header>
            {fileView(drawer, openPath)}
          </aside>
        </div>
      )}
    </div>
  );
}
