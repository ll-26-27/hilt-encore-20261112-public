"use client";

import { useEffect, useRef, useState } from "react";
import raw from "./data.json";
import s from "./absence.module.css";

// Rebuilt from bok-learning-lab/a-project-on-calvino, apps/mw-project-002 (Vite + React Router, Jan 2026): TarotPage,
// TextPage, AbsentionPage, VoidPage, ChoicePage and FinalPage become views of one component. The original called
// OpenAI's gpt-4o from the browser at every step; here each call's output was written beforehand by Claude from the
// same prompts and is read from data.json (the full prompts are in /examples/authorial-absence/calls.json).
// Timings of the highlight, strike and rewrite phases are the original's; the waits for the API are simulated.

type Card = { id: number; name: string; numeral: string; description: string; systemLabel: string; image: string };
type State = { id: number; title: string; author: string; source: string; authorContext: string[]; text: string; credit?: string };
type Edit = { original: string; reason: string; revised: string };
type Run = { input: string; identified: Edit[]; processed: string; continuations: string[] };
type Data = { cards: Card[]; states: State[]; runs: Record<string, Record<string, Run>>; void: Record<string, string[]>; recordedBy: string; originalModel: string };
type Saved = { text: string; savedAt: string; run: string; index: number };
type Call = { step: string; original_model: string; temperature: number; max_tokens: number; system: string; user: string; output: string };
type Calls = { runs: Record<string, Record<string, Call[]>>; void: Record<string, Call[]> };
type Final = { s: number; text: string; survivor: string; date: string } | { s: 0; author: number; survivor: string; date: string };
type View = { v: "tarot" } | { v: "text"; s: number } | { v: "absention"; s: number } | { v: "void" } | { v: "choice"; author: number } | { v: "final" };

const D = raw as unknown as Data;
const CARDS = D.cards;
const TOTAL = 2 ** CARDS.length;
const KEY = (n: number) => `authorial-absence:continuation_${n}`;
const bin = (n: number) => n.toString(2).padStart(4, "0");
const present = (n: number) => CARDS.map((_, i) => Boolean(n & (2 ** i)));
const strip = (t: string) => t.replace(/\{\{/g, "").replace(/\}\}/g, "");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const CALLS_URL = "/examples/authorial-absence/calls.json";

function loadSaved(): Record<number, Saved> {
  const out: Record<number, Saved> = {};
  try {
    for (let n = 1; n < TOTAL; n++) {
      const v = localStorage.getItem(KEY(n));
      if (v) out[n] = JSON.parse(v);
    }
  } catch {}
  return out;
}

// The text as getTextByState returns it: the base text with the last surviving continuation appended.
const textOf = (st: State, saved?: Saved) => st.text + (saved ? " " + saved.text : "");
// Which recorded run applies: the first absention on the base text, then one per first-round survivor.
const runKeyOf = (saved?: Saved) => (!saved ? "r1" : saved.run === "r1" ? `r2-${saved.index}` : null);

let callsCache: Promise<Calls> | null = null;
function RecordedCalls({ pick, label }: { pick: (c: Calls) => Call[] | undefined; label: string }) {
  const [calls, setCalls] = useState<Call[] | null>(null);
  const [err, setErr] = useState(false);
  return (
    <details className={s.calls} onToggle={(e) => {
      if (!(e.currentTarget as HTMLDetailsElement).open || calls) return;
      callsCache ??= fetch(CALLS_URL).then((r) => r.json());
      callsCache.then((c) => setCalls(pick(c) ?? [])).catch(() => setErr(true));
    }}>
      <summary>{label}</summary>
      <p className={s.note}>Each call as the original app would have sent it to {D.originalModel}: its settings, system prompt, user prompt, and the output written for it by Claude. <a href={CALLS_URL} target="_blank" rel="noreferrer">All recorded calls as JSON</a>.</p>
      {err && <p className={s.note}>Could not load the recorded calls.</p>}
      {calls?.map((c, i) => (
        <div key={i} className={s.call}>
          <div className={s.callHead}>{i + 1}. {c.step.toUpperCase()} · temperature {c.temperature} · max_tokens {c.max_tokens}</div>
          <div className={s.callLabel}>system</div><pre>{c.system}</pre>
          <div className={s.callLabel}>user</div><pre>{c.user}</pre>
          <div className={s.callLabel}>output</div><pre>{c.output}</pre>
        </div>
      ))}
    </details>
  );
}

function BigButton({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div className={s.bigBox}>
      <button type="button" className={s.big} onClick={onClick} disabled={disabled}>{children}</button>
    </div>
  );
}

function Back({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <div className={s.backRow}><button type="button" className={s.back} onClick={onClick}>{children}</button></div>;
}

// Four options; delete all but one; confirm; proceed. Shared by the absention (continuations) and the void (beginnings).
function Survivor({ options, noun, onProceed, warning }: { options: string[]; noun: string; warning: string; onProceed: (text: string) => void }) {
  const [deleted, setDeleted] = useState<boolean[]>(options.map(() => false));
  const [confirmed, setConfirmed] = useState(false);
  const remaining = deleted.filter((d) => !d).length;
  return (
    <>
      <div className={s.warn}><p className={s.warnHead}>This action is final.</p><p>{warning}</p></div>
      <div className={s.options}>
        {options.map((text, i) => (
          <div key={i} className={deleted[i] ? `${s.option} ${s.optionGone}` : s.option}>
            <div className={s.optionBody}>
              <div className={s.optionLabel}>{noun.toUpperCase()} {i + 1}</div>
              <p className={deleted[i] ? s.struck : undefined}>{text}</p>
            </div>
            {!deleted[i] && remaining > 1 && !confirmed && (
              <button type="button" className={s.del} onClick={() => setDeleted((d) => d.map((x, j) => (j === i ? true : x)))}>Delete</button>
            )}
            {deleted[i] && <span className={s.tag}>DELETED</span>}
            {!deleted[i] && remaining === 1 && <span className={`${s.tag} ${s.tagRed}`}>SURVIVING</span>}
          </div>
        ))}
      </div>
      <div className={s.status}><span>REMAINING: {remaining}</span><span>DELETED: {options.length - remaining}</span></div>
      {remaining === 1 && !confirmed && (
        <div className={s.confirm}>
          <p>You have selected one {noun}. The others will no longer be possible.</p>
          <p className={s.quote}>&ldquo;These readings will no longer be possible.&rdquo;</p>
          <button type="button" className={s.big} onClick={() => setConfirmed(true)}>I UNDERSTAND. CONFIRM DELETION.</button>
        </div>
      )}
      {confirmed && (
        <div className={s.confirm}>
          <p className={s.muted}>The choice has been made. The surviving text will now be integrated.</p>
          <button type="button" className={s.big} onClick={() => onProceed(options[deleted.findIndex((d) => !d)])}>VIEW FINAL TEXT →</button>
        </div>
      )}
    </>
  );
}

function Absention({ st, saved, onBack, onFinal }: { st: State; saved?: Saved; onBack: () => void; onFinal: (survivor: string, index: number, runKey: string, processed: string) => void }) {
  const runKey = runKeyOf(saved);
  const run = runKey ? D.runs[String(st.id)]?.[runKey] : undefined;
  const text = textOf(st, saved);
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [cur, setCur] = useState<{ e: Edit; phase: "highlight" | "strike" | "rewrite"; typed: string } | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [conts, setConts] = useState<string[] | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const go = async () => {
    if (!run) return;
    const add = (l: string) => alive.current && setLog((p) => [...p, l]);
    setProcessing(true);
    setLog(["Initiating authorial absention...", "Analyzing text for authorial presence..."]);
    await sleep(1400); // stands in for the identification call
    add(`Found ${run.identified.length} passages to process...`);
    for (let i = 0; i < run.identified.length; i++) {
      if (!alive.current) return;
      const e = run.identified[i];
      add(`Processing ${i + 1}/${run.identified.length}: "${e.original.slice(0, 40)}..."`);
      setCur({ e, phase: "highlight", typed: "" });
      await sleep(800);
      setCur({ e, phase: "strike", typed: "" });
      await sleep(600 + 500); // the original's strike phase, then the revision call
      const step = Math.max(1, Math.ceil(e.revised.length / 50));
      for (let n = step; n < e.revised.length + step; n += step) {
        if (!alive.current) return;
        setCur({ e, phase: "rewrite", typed: e.revised.slice(0, n) });
        await sleep(22);
      }
      await sleep(1000);
      add(`  → "${e.revised.slice(0, 50)}..."`);
      setCur(null);
      await sleep(300);
    }
    if (!alive.current) return;
    setProcessed(run.processed);
    add("Authorial absention complete. Generating continuations...");
    setGenerating(true);
    await sleep(1500); // stands in for the continuation call
    if (!alive.current) return;
    setGenerating(false);
    setConts(run.continuations);
    add("Continuations generated.");
    setProcessing(false);
  };

  const render = () => {
    if (processing && cur) {
      const idx = text.indexOf(cur.e.original);
      if (idx !== -1) {
        const cls = cur.phase === "highlight" ? s.hl : cur.phase === "strike" ? s.strike : s.rewrite;
        return (
          <span className={s.pre}>
            {text.slice(0, idx)}
            <span className={cls}>{cur.phase === "rewrite" ? cur.typed : cur.e.original}{cur.phase === "rewrite" && cur.typed.length < cur.e.revised.length && <span className={s.caret}>▌</span>}</span>
            {text.slice(idx + cur.e.original.length)}
          </span>
        );
      }
    }
    return <span className={s.pre}>{processed ? strip(processed) : text}</span>;
  };

  return (
    <div className={s.col}>
      <header className={s.head}>
        <div className={s.trace}>STATE {st.id} → ABSENTION</div>
        <h3 className={s.h1}>Authorial Absention</h3>
        <p className={s.muted}><em>Sottrazione d&rsquo;autore</em></p>
      </header>
      <div className={s.titleBlock}>
        <h4 className={s.h2}>{st.title}</h4>
        <div className={s.muted}>{st.author}{st.source && `, ${st.source}`}</div>
      </div>
      <div className={s.text}>{render()}</div>
      {processing && log.length > 0 && <div className={s.log}>{log.map((l, i) => <div key={i}>{l}</div>)}</div>}
      {!processed && !processing && run && <BigButton onClick={go}>RUN ABSENTION →</BigButton>}
      {!run && (
        <div className={s.warn}>
          <p className={s.warnHead}>Not recorded past this point</p>
          <p>This text has already been through two rounds of absention in this browser, and its second continuation is now part of it. Two rounds are recorded for each text; in the original app the model would be called again here, on the text as it now reads.</p>
        </div>
      )}
      {processed && conts && (
        <div className={s.contSection}>
          <h4 className={s.h2}>Choose a Continuation</h4>
          <p className={s.muted}>Delete all but one. The deleted options will be permanently inaccessible.</p>
          <Survivor options={conts} noun="continuation" warning="The surviving continuation will be permanently integrated into the text. It will become indistinguishable from the original. Future readers will not know what was there before."
            onProceed={(t) => onFinal(t, conts.indexOf(t), runKey!, strip(processed))} />
          <RecordedCalls label={`Recorded calls for this run (${run!.identified.length + 2})`} pick={(c) => c.runs[String(st.id)]?.[runKey!]} />
        </div>
      )}
      {generating && <div className={s.gen}><div>Generating continuations...</div><div className={s.pulse}>The machine considers possible futures</div></div>}
      {!conts && <Back onClick={onBack}>← Back to text</Back>}
    </div>
  );
}

export default function AuthorialAbsence() {
  const [view, setView] = useState<View>({ v: "tarot" });
  const [cards, setCards] = useState<boolean[]>(CARDS.map(() => true));
  const [saved, setSaved] = useState<Record<number, Saved>>({});
  const [final, setFinal] = useState<Final | null>(null);
  const [author, setAuthor] = useState(1);
  const [beginnings, setBeginnings] = useState<string[] | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => { setSaved(loadSaved()); }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    root.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [view]);
  useEffect(() => {
    if (view.v !== "choice") return;
    setBeginnings(null);
    const t = setTimeout(() => setBeginnings(D.void[String(view.author)]), 1500); // stands in for the beginnings call
    return () => clearTimeout(t);
  }, [view]);

  const stateId = cards.reduce((a, p, i) => a + (p ? 2 ** i : 0), 0);
  const presentCount = cards.filter(Boolean).length;
  const savedCount = Object.keys(saved).length;

  const saveContinuation = (n: number, text: string, runKey: string, index: number) => {
    const v: Saved = { text, savedAt: new Date().toISOString(), run: runKey, index };
    try { localStorage.setItem(KEY(n), JSON.stringify(v)); } catch {}
    setSaved((p) => ({ ...p, [n]: v }));
  };
  const forget = () => {
    try { for (let n = 1; n < TOTAL; n++) localStorage.removeItem(KEY(n)); } catch {}
    setSaved({});
  };
  const restart = () => { setCards(CARDS.map(() => true)); setFinal(null); setView({ v: "tarot" }); };

  let body: React.ReactNode = null;

  if (view.v === "tarot") {
    body = (
      <div className={s.wide}>
        <header className={s.head}>
          <h3 className={s.title}>AUTHORIAL <span className={s.red}>ABSENCE</span></h3>
          <p className={s.lead}>You are presented with four cards. <span className={s.red}>Click a card to make it disappear.</span> Disappearance is the only available action. When you are satisfied with what remains, submit your configuration.</p>
        </header>
        <div className={s.sys}>
          <div><span>TOTAL STATES: <span className={s.red}>{TOTAL}</span></span><span>CURRENT STATE: <span className={s.red}>{bin(stateId)}</span> ({stateId})</span></div>
          <div><span>PRESENT: {presentCount}</span><span>ABSENT: <span className={s.red}>{CARDS.length - presentCount}</span></span></div>
        </div>
        <div className={s.grid}>
          {CARDS.map((c, i) => (
            <button type="button" key={c.id} className={cards[i] ? s.card : `${s.card} ${s.cardGone}`} disabled={!cards[i]}
              aria-label={cards[i] ? `${c.name}: remove` : `${c.name}: absent`}
              onClick={() => cards[i] && setCards((p) => p.map((x, j) => (j === i ? false : x)))}>
              {cards[i] ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={`${c.name}, Rider–Waite–Smith tarot, 1909`} />
                  <span className={s.cardLabel}><b>{c.numeral} · {c.name}</b><small>click to remove</small></span>
                </>
              ) : (
                <span className={s.absent}><span>[{c.systemLabel}]</span><small>ABSENT</small></span>
              )}
            </button>
          ))}
        </div>
        <div className={s.desc}>
          {presentCount === 4 && <span>All cards present. <span className={s.red}>The full state.</span></span>}
          {presentCount === 0 && <span className={s.red}><b>All cards absent. The void state.</b></span>}
          {presentCount > 0 && presentCount < 4 && (
            <>Present: <b>{CARDS.filter((_, i) => cards[i]).map((c) => c.numeral).join(", ")}</b>. Absent: <b className={s.red}>{CARDS.filter((_, i) => !cards[i]).map((c) => c.numeral).join(", ")}</b>.</>
          )}
        </div>
        <div className={s.submit}>
          <button type="button" className={s.go} onClick={() => setView(stateId === 0 ? { v: "void" } : { v: "text", s: stateId })}>Continue with this configuration →</button>
          <span>STATE <b className={s.red}>{stateId}</b> / {TOTAL - 1}{presentCount === 4 && <span className={s.red}> (all cards present)</span>}</span>
        </div>
        <div className={s.foot}>
          <p>With {CARDS.length} cards, there are 2<sup>{CARDS.length}</sup> = <span className={s.red}>{TOTAL}</span> possible states, including the state in which no cards remain.</p>
          {savedCount > 0 && (
            <p>This browser holds {savedCount} corrupted {savedCount === 1 ? "text" : "texts"}. <button type="button" className={s.linkish} onClick={forget}>Forget them</button> <span className={s.muted}>(added for this page; the original kept them until local storage was cleared)</span></p>
          )}
        </div>
      </div>
    );
  } else if (view.v === "text") {
    const st = D.states[view.s];
    const p = present(view.s);
    const pc = CARDS.filter((_, i) => p[i]);
    const ac = CARDS.filter((_, i) => !p[i]);
    body = (
      <div className={s.col}>
        <div className={s.traceBox}>
          <div><span>STATE {view.s} ({bin(view.s)})</span><span className={s.red}>TEXT SELECTED</span></div>
          <div className={s.labels}>{CARDS.map((c, i) => <span key={c.id} className={p[i] ? s.red : s.dim}>{c.systemLabel}</span>)}</div>
        </div>
        <header className={s.head}>
          <h3 className={s.h1light}>{st.title}</h3>
          <div className={s.muted}>{st.author}{st.source && <span className={s.small}> ({st.source})</span>}</div>
          <div className={s.small}>
            Present: <span className={s.red}>{pc.map((c) => c.name).join(", ")}</span>
            {ac.length > 0 && <> | Absent: {ac.map((c) => c.name).join(", ")}</>}
          </div>
        </header>
        <div className={s.text}><span className={s.pre}>{textOf(st, saved[st.id])}</span></div>
        {st.credit && <p className={s.note}>{st.credit}</p>}
        <BigButton onClick={() => setView({ v: "absention", s: st.id })}>BEGIN AUTHORIAL ABSENTION →</BigButton>
        <Back onClick={restart}>← Return to cards</Back>
      </div>
    );
  } else if (view.v === "absention") {
    const st = D.states[view.s];
    const sv = saved[st.id];
    body = (
      <Absention key={`${st.id}:${sv?.run ?? "-"}:${sv?.index ?? "-"}`} st={st} saved={sv} onBack={() => setView({ v: "text", s: st.id })}
        onFinal={(survivor, index, runKey, processed) => {
          saveContinuation(st.id, survivor, runKey, index);
          setFinal({ s: st.id, text: processed, survivor, date: new Date().toISOString().split("T")[0] });
          setView({ v: "final" });
        }} />
    );
  } else if (view.v === "void") {
    const st = D.states[author];
    body = (
      <div className={s.col}>
        <header className={s.head}>
          <div className={s.trace}>STATE 0 (0000) → THE VOID</div>
          <h3 className={s.h1light}>The Void</h3>
          <p className={s.muted}>You have removed all cards. There is no text. The page is empty.</p>
        </header>
        <div className={s.nothing}>[ nothing ]</div>
        <div className={s.explain}>
          <p>In the void state, there is no author to absent.</p>
          <p className={s.muted}>Instead, you must provide the authorial presence that will shape what emerges. The machine will generate possible beginnings based on the author you describe. You will then choose which beginning becomes the text.</p>
        </div>
        <h4 className={s.h2}>Provide Authorial Information</h4>
        <p className={s.note}>In the original you type an author&rsquo;s name, an optional biography, and items of context. Because every set of beginnings here was written in advance, the choice is limited to the fifteen authors the app keeps on file, each with the context the app holds for them.</p>
        <label className={s.field}>
          <span>Author</span>
          <select value={author} onChange={(e) => setAuthor(Number(e.target.value))}>
            {D.states.slice(1).map((x) => <option key={x.id} value={x.id}>{x.author}</option>)}
          </select>
        </label>
        <div className={s.field}>
          <span>Authorial Context</span>
          <ol className={s.ctx}>{st.authorContext.map((c, i) => <li key={i}>{c}</li>)}</ol>
        </div>
        <BigButton onClick={() => setView({ v: "choice", author })}>GENERATE POSSIBLE BEGINNINGS →</BigButton>
        <Back onClick={restart}>← Return to cards</Back>
      </div>
    );
  } else if (view.v === "choice") {
    const a = view.author;
    body = (
      <div className={s.col}>
        <header className={s.head}>
          <div className={s.trace}>STATE 0 → GENESIS</div>
          <h3 className={s.h1}>The Beginning</h3>
          <p className={s.muted}>The machine is generating possible beginnings based on the author you described. You must delete all but one. The deleted options will never exist.</p>
        </header>
        {!beginnings && <div className={s.gen}><div>Generating beginnings...</div><div className={s.pulse}>The machine imagines possible origins</div></div>}
        {beginnings && (
          <>
            <Survivor key={a} options={beginnings} noun="beginning" warning="The surviving beginning will become the text. The others will never have existed."
              onProceed={(t) => { setFinal({ s: 0, author: a, survivor: t, date: new Date().toISOString().split("T")[0] }); setView({ v: "final" }); }} />
            <RecordedCalls label="Recorded call for these beginnings (1)" pick={(c) => c.void[String(a)]} />
            <Back onClick={() => setView({ v: "void" })}>← Back to the void</Back>
          </>
        )}
      </div>
    );
  } else if (view.v === "final" && final) {
    const isVoid = final.s === 0;
    const p = present(final.s);
    const st = D.states[final.s];
    body = (
      <div className={s.col}>
        <header className={s.head}>
          <h3 className={s.h1light}>{"author" in final ? D.states[final.author].author : st.title}</h3>
          <div className={s.muted}>{isVoid ? "A text that began from nothing" : CARDS.filter((_, i) => p[i]).map((c) => c.name).join(" · ")}</div>
        </header>
        {"text" in final && <div className={s.finalText}><span className={s.pre}>{final.text}</span></div>}
        <div className={s.finalText}>{final.survivor}</div>
        <hr className={s.rule} />
        <div className={s.colophon}>
          <div>STATE {final.s} ({bin(final.s)})</div>
          <div>CARDS: {CARDS.map((c, i) => (p[i] ? c.systemLabel : "—")).join(" ")}</div>
          <div>{isVoid ? "TEXT GENERATED" : "CONTINUATION INTEGRATED"}: {final.date}</div>
          <div className={s.colNote}>
            {isVoid
              ? "This text emerged from the void. The author was provided by the reader. The beginning was chosen from possibilities that no longer exist."
              : "This text has been processed through authorial absention. The original authorial insertions have been removed. A continuation has been permanently integrated. The seams are no longer visible."}
          </div>
        </div>
        <BigButton onClick={restart}>BEGIN AGAIN →</BigButton>
        {!isVoid && <Back onClick={() => setView({ v: "text", s: final.s })}>← View Original Text</Back>}
      </div>
    );
  }

  return <div ref={root} className={s.wrap}>{body}</div>;
}
