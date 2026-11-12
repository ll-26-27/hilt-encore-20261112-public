"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import score from "./opening.json";
import s from "./black-key-etude.module.css";

// Ported from ll-26-27/black-key-etude, nextjs/app/study.jsx (commit f066917), converted to TypeScript. The opening eight
// bars of Chopin's Op. 10 No. 5 as 162 note events (opening.json, derived from the ASAP MusicXML by the repo's
// scripts/prepare-score.py), played from thirty recorded piano samples in public/examples/black-key-etude/piano/.
// Audio starts only from Play or a click on a note. Nothing is sent anywhere; observations stay in localStorage.

type Hand = "right" | "left";
type NoteEvent = { beat: number; duration: number; midi: number; hand: Hand; name: string; bar: number };
type View = "keyboard" | "map" | "contour" | "intervals" | "five";

const BASE = "/examples/black-key-etude";
const STORE = "black-key-observations";
const E = score.events as NoteEvent[];
const PITCHES = score.pitches as number[];
const BLACK = [1, 3, 6, 8, 10];
const NAMES = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const label = (m: number) => NAMES[m % 12] + (Math.floor(m / 12) - 1);
const VIEWS: Array<[View, string, string]> = [
  ["keyboard", "Keyboard", "Where does the line travel? Follow distance on the actual key layout."],
  ["map", "Pitch map", "Read left to right through time, low to high through pitch. Compare the two hands."],
  ["contour", "Contour", "Follow the right-hand line as a shape. Which turns repeat at another height?"],
  ["intervals", "Intervals", "How far does the right hand move each time? Above zero rises; below zero falls."],
  ["five", "Five tones", "Collapse the octaves. How does a wide-ranging passage use just five pitch classes?"],
];
const QUESTIONS: Record<View, string> = {
  keyboard: "Where does a small musical pattern require a large physical move?",
  map: "Which shapes repeat? What changes when the pattern returns?",
  contour: "Can you recognize a repeated gesture without the keyboard?",
  intervals: "Are the most frequent moves small steps or larger leaps?",
  five: "What can this view reveal—and what does losing the octave hide?",
};
const RIGHT = E.filter((e) => e.hand === "right");
const KEYS = Array.from({ length: 73 }, (_, i) => i + 36); // C2 to C8
const WHITES = KEYS.filter((m) => !BLACK.includes(m % 12));
const keyX = (m: number) => {
  const i = WHITES.filter((w) => w < m).length;
  return BLACK.includes(m % 12) ? i - 0.32 : i;
};
const cls = (...names: Array<string | false | undefined>) => names.filter(Boolean).map((n) => s[n as string] ?? n).join(" ");
const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

export default function Study() {
  const [view, setView] = useState<View>("map");
  const [hand, setHand] = useState<"both" | Hand>("both");
  const [bpm, setBpm] = useState(72);
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState("all");
  const [repeat, setRepeat] = useState(true);
  const [sound, setSound] = useState<"idle" | "loading" | "ready">("idle");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const audio = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<number, AudioBuffer>());
  const voices = useRef<AudioBufferSourceNode[]>([]);
  const frame = useRef(0);
  const transport = useRef<{ start: number; origin: number } | null>(null);
  const position = useRef(0);
  const load = useRef<Promise<void> | null>(null);
  const generation = useRef(0);
  const mounted = useRef(true);

  const min = loop === "all" ? 0 : (Number(loop) - 1) * 2;
  const max = loop === "all" ? 16 : Number(loop) * 2;
  const shown = E.filter((e) => (hand === "both" || e.hand === hand) && e.beat >= min && e.beat < max);
  const active = shown.filter((e) => beat >= e.beat - 0.001 && beat < e.beat + e.duration * 0.9);
  const current = active.filter((e) => e.hand === "right").at(-1);
  const bar = Math.min(8, Math.floor(beat / 2) + 1);
  const rightInPassage = RIGHT.filter((e) => e.beat >= min && e.beat < max);

  function silence() {
    for (const v of voices.current) {
      try {
        v.stop();
      } catch {}
    }
    voices.current = [];
  }
  function stop() {
    generation.current++;
    cancelAnimationFrame(frame.current);
    silence();
    transport.current = null;
    setPlaying(false);
  }
  function seek(b: number) {
    stop();
    position.current = b;
    setBeat(b);
  }

  // Creates the AudioContext and loads the samples on the first Play or note click (a user gesture), never before.
  async function ready() {
    if (!audio.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) throw Error("This browser does not support Web Audio.");
      audio.current = new AC();
    }
    const ctx = audio.current;
    await ctx.resume();
    if (buffers.current.size === PITCHES.length) return;
    if (!load.current) {
      setSound("loading");
      load.current = Promise.all(
        PITCHES.map(async (p) => {
          const r = await fetch(`${BASE}/piano/${p}.mp3`);
          if (!r.ok) throw Error("Piano recordings could not be loaded. Please retry.");
          buffers.current.set(p, await ctx.decodeAudioData(await r.arrayBuffer()));
        }),
      )
        .then(() => {
          if (mounted.current) setSound("ready");
        })
        .catch((err) => {
          load.current = null;
          if (mounted.current) setSound("idle");
          throw err;
        });
    }
    await load.current;
  }

  function playNote(e: NoteEvent, when: number, duration: number) {
    const ctx = audio.current;
    const buffer = buffers.current.get(e.midi);
    if (!ctx || !buffer) return;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buffer;
    src.connect(g);
    g.connect(ctx.destination);
    const gain = e.hand === "right" ? 0.23 : 0.16;
    g.gain.setValueAtTime(gain, when);
    g.gain.setValueAtTime(gain, when + duration);
    g.gain.exponentialRampToValueAtTime(0.0001, when + duration + 0.16);
    src.start(when);
    src.stop(when + duration + 0.2);
    voices.current.push(src);
  }

  function schedule(start: number) {
    const ctx = audio.current;
    if (!ctx) return;
    const origin = ctx.currentTime + 0.05;
    const seconds = 60 / bpm;
    for (const e of shown) {
      if (e.beat + e.duration <= start) continue;
      const offset = Math.max(e.beat, start);
      playNote(e, origin + (offset - start) * seconds, (e.beat + e.duration - offset) * seconds * 0.9);
    }
    transport.current = { start, origin };
    setPlaying(true);
    function tick() {
      if (!transport.current || !ctx) return;
      const b = Math.max(start, start + (ctx.currentTime - origin) / seconds);
      if (b >= max) {
        silence();
        position.current = min;
        setBeat(min);
        if (repeat) schedule(min);
        else {
          transport.current = null;
          setPlaying(false);
        }
        return;
      }
      position.current = b;
      setBeat(b);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
  }

  async function play() {
    if (playing) {
      stop();
      return;
    }
    setError("");
    const g = ++generation.current;
    try {
      await ready();
      if (!mounted.current || generation.current !== g) return;
      schedule(position.current >= min && position.current < max ? position.current : min);
    } catch (e) {
      setError(errorText(e));
    }
  }

  async function inspect(e: NoteEvent) {
    seek(e.beat);
    const g = ++generation.current;
    setError("");
    try {
      await ready();
      if (mounted.current && generation.current === g && audio.current) playNote(e, audio.current.currentTime, 0.35);
    } catch (err) {
      setError(errorText(err));
    }
  }

  // Changing speed, hands, passage or repeat pauses playback; changing the view does not.
  function settings(fn: () => void) {
    stop();
    fn();
  }

  useEffect(() => {
    mounted.current = true;
    try {
      setNote(localStorage.getItem(STORE) || "");
    } catch {}
    return () => {
      mounted.current = false;
      generation.current++;
      cancelAnimationFrame(frame.current);
      for (const v of voices.current) {
        try {
          v.stop();
        } catch {}
      }
      voices.current = [];
      const ctx = audio.current;
      audio.current = null;
      load.current = null;
      buffers.current.clear();
      ctx?.close().catch(() => {});
    };
  }, []);

  function saveNotes() {
    try {
      localStorage.setItem(STORE, note);
      setSaved(true);
    } catch {
      setError("Your browser could not save notes. Copy them somewhere safe.");
    }
  }
  function exportNotes() {
    const text = `Black Key Étude — observations\n${new Date().toISOString()}\n${view} / ${bpm} BPM / ${loop === "all" ? "bars 1–8" : `bar ${loop}`}\n\n${note}`;
    const u = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = u;
    a.download = "black-key-etude-observations.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let j = i;
    if (e.key === "ArrowRight") j = (i + 1) % VIEWS.length;
    else if (e.key === "ArrowLeft") j = (i + VIEWS.length - 1) % VIEWS.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = VIEWS.length - 1;
    else return;
    e.preventDefault();
    setView(VIEWS[j][0]);
    document.getElementById(`bke-tab-${VIEWS[j][0]}`)?.focus();
  }

  const keyClass = (m: number, fallback: string) => active.find((e) => e.midi === m)?.hand ?? fallback;
  const x = (b: number) => 46 + ((b - min) / (max - min)) * 870;
  const y = (m: number) => 212 - ((m - 36) / 62) * 175;
  const viewInfo = VIEWS.find((v) => v[0] === view)!;
  const before = Math.max(0, RIGHT.filter((e) => e.beat >= min && e.beat < beat).length - 3);

  const piano = (
    <svg className={s.piano} viewBox={`0 0 ${WHITES.length * 24} 140`} role="img" aria-label="Piano keyboard, C2 to C8. Right-hand notes are red; left-hand notes are blue.">
      {WHITES.map((m) => (
        <g key={m}>
          <rect x={keyX(m) * 24} y="0" width="23.5" height="138" rx="1" className={cls(keyClass(m, "white"))} />
          {m % 12 === 0 && (
            <text x={keyX(m) * 24 + 12} y="124" textAnchor="middle">
              {label(m)}
            </text>
          )}
        </g>
      ))}
      {KEYS.filter((m) => BLACK.includes(m % 12)).map((m) => (
        <rect key={m} x={keyX(m) * 24} y="0" width="15.4" height="86" rx="1" className={cls(keyClass(m, "black"))} />
      ))}
    </svg>
  );

  let representation: React.ReactNode;
  if (view === "keyboard") {
    representation = (
      <div className={s.keyboardStudy}>
        <p className={s.bigNote}>{current ? current.name : "G♭ · B♭ · D♭"}</p>
        <p>
          Follow the keyboard below. <span>Pause and scrub to inspect a moment.</span>
        </p>
        <div className={s.keySequence}>
          {rightInPassage.slice(before, before + 10).map((e) => (
            <button type="button" className={active.includes(e) ? s.selected : ""} onClick={() => inspect(e)} key={`${e.beat}-${e.midi}`}>
              {e.name}
            </button>
          ))}
        </div>
      </div>
    );
  } else if (view === "five") {
    representation = (
      <div className={s.toneStudy}>
        <svg viewBox="0 0 600 255" role="img" aria-label="Five right-hand pitch classes, collapsed across octaves">
          {[6, 8, 10, 1, 3].map((p, i) => {
            const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
            const cx = 300 + 98 * Math.cos(a);
            const cy = 127 + 98 * Math.sin(a);
            const on = active.some((e) => e.hand === "right" && e.midi % 12 === p);
            return (
              <g key={p}>
                <line x1="300" y1="127" x2={cx} y2={cy} className={cls("toneLine", on && "on")} />
                <circle cx={cx} cy={cy} r="25" className={cls("toneDot", on && "on")} />
                <text x={cx} y={cy + 5} textAnchor="middle" className={on ? s.toneTextOn : undefined}>
                  {NAMES[p]}
                </text>
              </g>
            );
          })}
          <text x="300" y="130" textAnchor="middle" className={s.ringLabel}>
            RIGHT HAND
          </text>
        </svg>
        <p>
          Octave disappears. Pitch class remains.
          <br />
          The left hand is still visible on the keyboard below.
        </p>
      </div>
    );
  } else {
    representation = (
      <svg
        className={s.noteMap}
        viewBox="0 0 960 260"
        role="img"
        aria-label={
          view === "map"
            ? "Note map: time runs left to right; higher notes appear higher. Click a note to hear it."
            : view === "contour"
              ? "Right-hand pitch contour through time."
              : "Right-hand successive pitch intervals, measured in semitones."
        }
      >
        {Array.from({ length: (max - min) / 2 + 1 }, (_, i) => min + i * 2).map((b) => (
          <g key={b}>
            <line x1={x(b)} x2={x(b)} y1="22" y2="224" className={s.grid} />
            <text x={x(b) + 4} y="246">
              {b < max ? `Bar ${Math.floor(b / 2) + 1}` : ""}
            </text>
          </g>
        ))}
        {view === "map" &&
          [48, 60, 72, 84, 96].map((m) => (
            <g key={m}>
              <line x1="46" x2="916" y1={y(m)} y2={y(m)} className={s.pitchGrid} />
              <text x="4" y={y(m) + 4}>
                {label(m)}
              </text>
            </g>
          ))}
        {view === "map" &&
          shown.map((e, i) => (
            <rect
              key={i}
              x={x(e.beat)}
              y={y(e.midi) - 3}
              width={Math.max(3, (e.duration / (max - min)) * 870 - 1)}
              height="6"
              className={cls("event", e.hand, active.includes(e) && "active")}
              onClick={() => inspect(e)}
            >
              <title>{`${e.hand} hand, ${e.name}, bar ${e.bar}`}</title>
            </rect>
          ))}
        {view === "contour" && (
          <>
            <polyline points={rightInPassage.map((e) => `${x(e.beat)},${y(e.midi)}`).join(" ")} className={s.contourPath} />
            {rightInPassage.map((e, i) => (
              <circle
                key={i}
                cx={x(e.beat)}
                cy={y(e.midi)}
                r={active.includes(e) ? 6 : 3}
                className={cls("event", "right", active.includes(e) && "active")}
                onClick={() => inspect(e)}
              >
                <title>{e.name}</title>
              </circle>
            ))}
          </>
        )}
        {view === "intervals" && (
          <>
            <line x1="46" x2="916" y1="126" y2="126" className={s.zero} />
            <text x="4" y="35">+12</text>
            <text x="4" y="130">0</text>
            <text x="4" y="220">−12</text>
            {RIGHT.map((e, i) => {
              if (!i || e.beat < min || e.beat >= max) return null;
              const delta = e.midi - RIGHT[i - 1].midi;
              const yy = 126 - delta * 7;
              return (
                <g key={i} className={cls("interval", active.includes(e) && "active")} onClick={() => inspect(e)}>
                  <line x1={x(e.beat)} x2={x(e.beat)} y1="126" y2={yy} />
                  <circle cx={x(e.beat)} cy={yy} r="3" />
                  <title>{`${delta > 0 ? "+" : ""}${delta} semitones to ${e.name}`}</title>
                </g>
              );
            })}
          </>
        )}
        <line x1={x(beat)} x2={x(beat)} y1="15" y2="224" className={s.playhead} />
      </svg>
    );
  }

  return (
    <div className={s.root}>
      <section className={s.lab} aria-label="Investigate the opening eight bars">
        <div className={s.labHeading}>
          <div>
            <p className={s.eyebrow}>The investigation / 01</p>
            <h2>Change the lens.</h2>
          </div>
          <p>
            Same passage. Same clock.
            <br />A different thing to pay attention to.
          </p>
        </div>
        <div className={s.viewTabs} role="tablist" aria-label="Representations">
          {VIEWS.map(([v, name], i) => (
            <button
              type="button"
              key={v}
              id={`bke-tab-${v}`}
              role="tab"
              aria-selected={view === v}
              aria-controls="bke-view-panel"
              tabIndex={view === v ? 0 : -1}
              onKeyDown={(e) => onTabKey(e, i)}
              onClick={() => setView(v)}
            >
              <small>0{i + 1}</small>
              {name}
            </button>
          ))}
        </div>
        <div className={s.instrument}>
          <div className={s.viewCaption}>
            <p>{viewInfo[2]}</p>
            <div className={s.legend}>
              <span>
                <i />
                Right hand
              </span>
              <span>
                <i />
                Left hand
              </span>
            </div>
          </div>
          <div id="bke-view-panel" role="tabpanel" aria-labelledby={`bke-tab-${view}`} className={s.representation}>
            {representation}
          </div>
          <div className={s.keyboardWrap}>{piano}</div>
          <div className={s.transport}>
            <div className={s.transportPrimary}>
              <button type="button" className={s.play} onClick={play} disabled={sound === "loading"}>
                {sound === "loading" ? "Loading piano…" : playing ? "Pause" : "Play passage"}
                <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
              </button>
              <button type="button" className={s.restart} onClick={() => seek(min)}>
                ↶ Restart
              </button>
              <output aria-live="off">
                Bar {bar}
                <span> / 8</span>
              </output>
            </div>
            <label className={s.scrubber}>
              <span className={s.srOnly}>Position in passage</span>
              <input
                aria-label="Position in passage"
                type="range"
                min={min}
                max={max - 0.001}
                step="0.01"
                value={Math.min(max - 0.001, Math.max(min, beat))}
                onChange={(e) => seek(Number(e.target.value))}
              />
            </label>
            <div className={s.settings}>
              <label>
                Tempo{" "}
                <strong>
                  {bpm} <small>BPM</small>
                </strong>
                <input aria-label="Tempo" type="range" min="36" max="116" step="1" value={bpm} onChange={(e) => settings(() => setBpm(Number(e.target.value)))} />
              </label>
              <label>
                Hear
                <select aria-label="Hear hands" value={hand} onChange={(e) => settings(() => setHand(e.target.value as "both" | Hand))}>
                  <option value="both">Both hands</option>
                  <option value="right">Right hand only</option>
                  <option value="left">Left hand only</option>
                </select>
              </label>
              <label>
                Passage
                <select
                  aria-label="Passage"
                  value={loop}
                  onChange={(e) =>
                    settings(() => {
                      const v = e.target.value;
                      setLoop(v);
                      const b = v === "all" ? 0 : (Number(v) - 1) * 2;
                      position.current = b;
                      setBeat(b);
                    })
                  }
                >
                  <option value="all">Opening · bars 1–8</option>
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      Bar {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label className={s.repeat}>
                <input type="checkbox" checked={repeat} onChange={(e) => settings(() => setRepeat(e.target.checked))} />
                Repeat
              </label>
            </div>
            <p className={s.audioStatus} role="status">
              {error ||
                (sound === "loading"
                  ? "Loading recorded piano samples…"
                  : sound === "ready"
                    ? "Piano ready · click a note in the map or sequence to inspect it."
                    : "Recorded piano · sound loads when you first press Play or inspect a note.")}
            </p>
          </div>
        </div>
        <div className={s.studyPrompt}>
          <span className={s.eyebrow}>Try this</span>
          <p>
            {QUESTIONS[view]}
            <br />
            <span>Listen once. Switch the view without changing the passage. Listen again.</span>
          </p>
        </div>
      </section>

      <section className={s.observations} aria-label="Your observations">
        <div>
          <p className={s.eyebrow}>Your observations</p>
          <h2>
            What changed
            <br />
            in your attention?
          </h2>
          <p>
            Keep a trace of the experiment.
            <br />
            Saved only in this browser.
          </p>
        </div>
        <div>
          <div className={s.observationMeta}>
            {viewInfo[1]} / {bpm} BPM / {loop === "all" ? "Bars 1–8" : `Bar ${loop}`}
          </div>
          <label className={s.srOnly} htmlFor="bke-notes">
            Your observations
          </label>
          <textarea
            id="bke-notes"
            placeholder={"I expected…\nWhen I changed the view…\nNext I want to try…"}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
          />
          <div className={s.notesActions}>
            <button type="button" onClick={saveNotes}>
              {saved ? "Saved in this browser" : "Save observations"}
            </button>
            <button type="button" onClick={exportNotes}>
              Export .txt ↗
            </button>
          </div>
        </div>
      </section>

      <section className={s.context} aria-label="The étude">
        <div>
          <p className={s.eyebrow}>The étude</p>
          <h2>
            A constraint is
            <br />a place to begin.
          </h2>
        </div>
        <div className={s.essay}>
          <p className={s.large}>An étude is a study: a piece organized around a technical problem. Here, the right hand moves almost entirely across the black keys.</p>
          <p>
            Chopin’s <i>Étude in G-flat major, Op. 10 No. 5</i> is often called the “Black Key Étude.” The restriction belongs to the right hand, not the whole piano. The left hand uses white keys too. Across the complete work, the famous right-hand exception is an F in bar 66—outside this eight-bar excerpt.{" "}
            <a href="https://www.henle.de/en/Etude-G-flat-major-op.-10-no.-5/HN-1323" target="_blank" rel="noreferrer">
              Henle’s account ↗
            </a>
          </p>
          <p>Five available pitch classes do not mean five notes, one fixed hand position, or an easy task. The same black keys recur in different octaves. Listen for the changing distances, the quick turns, and the way the accompaniment gives the running line a harmonic setting.</p>
          <h3>Your study is a different kind of practice.</h3>
          <p>You are investigating how a representation changes your attention. The keyboard makes physical distance visible. A pitch map reveals register and density. Contour isolates the shape of a line. Intervals expose the size and direction of successive moves. The five-tone view folds the octaves together.</p>
          <p>Repeat a passage with one question in mind. Change one view, speed, or hand. What becomes obvious? What disappears? These are listening and observation experiments; they do not measure piano technique.</p>
          <details>
            <summary>Sources, sound, and what this version does</summary>
            <p>
              The opening eight bars are derived from the{" "}
              <a href="https://github.com/fosfrancesco/asap-dataset/tree/master/Chopin/Etudes_op_10/5" target="_blank" rel="noreferrer">
                ASAP dataset’s MusicXML score
              </a>{" "}
              (Foscarin et al.; upstream source identifies MuseScore score 116128). The source and derived note data are shared under <a href={`${BASE}/SCORE-LICENSE.md`}>CC BY-NC-SA 4.0</a>. <a href={`${BASE}/source.musicxml`} download>Download the source MusicXML</a>.
            </p>
            <p>
              Piano recordings:{" "}
              <a href="https://github.com/nbrosowsky/tonejs-instruments" target="_blank" rel="noreferrer">
                tonejs-instruments, Nicholaus P. Brosowsky
              </a>
              , samples under CC BY 3.0; <a href={`${BASE}/PIANO-LICENSE.md`}>license and attribution</a>. Exact-pitch recordings are served locally. Playback is a steady-tempo study rendering, not a concert performance; expressive timing, dynamics, and pedaling are not reproduced. The pitch map is a visual analysis, not engraved notation. No MIDI hardware is needed or assessed.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
