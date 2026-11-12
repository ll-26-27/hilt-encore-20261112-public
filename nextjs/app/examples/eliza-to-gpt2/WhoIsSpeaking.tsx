"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { describeRule, greeting, initialState, respond, type ElizaState } from "./eliza";
import { MEN_ARE_ALL_ALIKE } from "./eliza/examples";
import { HHH_READ, HHH_TOTAL, SAMPLES } from "./gpt2-recorded";
import s from "./eliza.module.css";

const PAPER = new Map(MEN_ARE_ALL_ALIKE);
const QUESTIONS = [...new Set(SAMPLES.map(x => x.question))];

type Turn = { said: string; reply: string; rule: string };

// The page opens on the first four lines of the paper's conversation, answered by this engine (deterministic, so the
// server and the browser agree).
function opening(): { turns: Turn[]; state: ElizaState } {
  let st = initialState();
  const turns = MEN_ARE_ALL_ALIKE.slice(0, 4).map(([said]) => {
    const out = respond(said, st);
    st = out.state;
    return { said, reply: out.reply, rule: describeRule(out.rule) };
  });
  return { turns, state: st };
}
const OPENING = opening();

function Eliza({ ask }: { ask: { text: string; n: number } | null }) {
  const [turns, setTurns] = useState<Turn[]>(OPENING.turns);
  const [draft, setDraft] = useState("");
  const [showRules, setShowRules] = useState(true);
  const [playing, setPlaying] = useState(false);
  const state = useRef<ElizaState>(OPENING.state);
  const run = useRef(0);
  const log = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [turns.length]);

  function say(text: string) {
    const out = respond(text, state.current);
    state.current = out.state;
    setTurns(t => [...t, { said: text, reply: out.reply, rule: describeRule(out.rule) }]);
  }

  // The GPT-2 side can hand ELIZA the same question.
  useEffect(() => {
    if (ask) say(ask.text);
  }, [ask]);

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    say(text);
    setDraft("");
  }

  function reset() {
    run.current++;
    setPlaying(false);
    setTurns([]);
    state.current = initialState();
  }

  async function play() {
    reset();
    const id = run.current;
    setPlaying(true);
    for (const [line] of MEN_ARE_ALL_ALIKE) {
      await new Promise(r => setTimeout(r, 800));
      if (run.current !== id) return;
      say(line);
    }
    setPlaying(false);
  }

  return (
    <section className={s.side} aria-label="ELIZA">
      <header className={s.sideHead}>
        <p className={s.badgeLive}>Live in your browser</p>
        <h2>ELIZA <span>1966</span></h2>
        <p className={s.how}>Joseph Weizenbaum&rsquo;s DOCTOR script. No model: keywords, patterns, and templates, every reply traceable to a rule.</p>
      </header>
      <div className={s.toolbar}>
        <button type="button" onClick={play} disabled={playing}>{playing ? "Playing…" : "Play the 1966 exchange"}</button>
        <button type="button" onClick={reset}>Start over</button>
        <label><input type="checkbox" checked={showRules} onChange={e => setShowRules(e.target.checked)} /> Show the rule</label>
      </div>
      <ol className={s.log} ref={log} aria-live="polite">
        <li><p className={s.eliza}>{greeting}</p></li>
        {turns.map((t, i) => {
          const paper = PAPER.get(t.said);
          return (
            <li key={i}>
              <p className={s.you}>{t.said}</p>
              <p className={s.eliza}>{t.reply}</p>
              {showRules && <p className={s.rule}>{t.rule}</p>}
              {paper && <p className={s.paper}>{paper === t.reply ? "✓ same reply as printed in the 1966 paper" : `The paper has: ${paper}`}</p>}
            </li>
          );
        })}
      </ol>
      <form className={s.composer} onSubmit={send}>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Tell ELIZA what's on your mind" aria-label="Your message to ELIZA" disabled={playing} autoComplete="off" />
        <button type="submit" disabled={playing || !draft.trim()}>Send</button>
      </form>
    </section>
  );
}

function Gpt2({ onAsk }: { onAsk: (q: string) => void }) {
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [run, setRun] = useState(0);
  const runs = SAMPLES.filter(x => x.question === question);
  const sample = runs[run % runs.length];

  return (
    <section className={s.side} aria-label="GPT-2, recorded">
      <header className={s.sideHead}>
        <p className={s.badgeRecorded}>Recorded</p>
        <h2>GPT-2 small <span>2019</span></h2>
        <p className={s.how}>A base model: it only continues text. The same question, given two ways. These runs were recorded on {sample.date}; nothing here calls a model.</p>
      </header>
      <div className={s.chips}>
        {QUESTIONS.map(q => (
          <button key={q} type="button" className={q === question ? s.on : undefined} onClick={() => { setQuestion(q); setRun(0); }}>{q}</button>
        ))}
      </div>
      <div className={s.runBar}>
        <span>Run {(run % runs.length) + 1} of {runs.length}</span>
        {runs.length > 1 && <button type="button" onClick={() => setRun(r => r + 1)}>Show another run</button>}
        <button type="button" onClick={() => onAsk(question)}>Ask ELIZA the same ←</button>
      </div>

      <div className={s.col}>
        <h3><span>1</span> The question alone</h3>
        <pre className={s.out}><span className={s.prompt}>{sample.question}{"\n"}</span><mark>{sample.bare}</mark></pre>
      </div>
      <div className={s.col}>
        <h3><span>2</span> After the HHH prompt</h3>
        <pre className={s.out}><span className={s.elided}>[the HHH prompt: a paragraph about a helpful, polite, honest assistant, then its last 6 exchanges]{"\n\n"}</span><span className={s.prompt}>{`Human:  ${sample.question}\n\nAssistant:`}</span><mark>{sample.scripted}</mark></pre>
      </div>
      <details className={s.read}>
        <summary>What GPT-2 read before the question in column 2</summary>
        <p>The HHH prompt (Askell et al. 2021) is {HHH_TOTAL.conversations} invented conversations, {HHH_TOTAL.exchanges} exchanges, about 4,600 words. GPT-2 can read only 1,024 tokens, so it got the opening paragraph and the last 6 exchanges, exactly as below.</p>
        <pre>{HHH_READ}</pre>
      </details>
      <p className={s.note}>Recorded {sample.date}: GPT-2 small (Xenova/gpt2, 8-bit), temperature 0.7, top-k 40, up to 90 new tokens; column 2 stops when GPT-2 starts the next &ldquo;Human:&rdquo; line. Unedited, from the original site. Highlighted text is GPT-2&rsquo;s.</p>
    </section>
  );
}

export default function WhoIsSpeaking() {
  const [ask, setAsk] = useState<{ text: string; n: number } | null>(null);
  return (
    <div className={s.wrap}>
      <Eliza ask={ask} />
      <Gpt2 onAsk={q => setAsk(a => ({ text: q, n: (a?.n ?? 0) + 1 }))} />
    </div>
  );
}
