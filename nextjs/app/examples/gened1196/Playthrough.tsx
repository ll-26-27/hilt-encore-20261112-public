"use client";

import { useEffect, useState } from "react";
import { decks, type Card } from "./decks";
import s from "./playthrough.module.css";
import transcript from "./elisa.json";

const stages = ["Draw", "Choose", "Prepare", "Present", "Reflect"];
const titles = ["Transmission", "Jokes", "Attention and Aesthetics"];
const selected = decks.map((deck, i) => deck.cards.find(card => card.title === titles[i])!);
const hands = [
  ["Transmission", "Tradition", "Folklore"],
  ["Jokes", "Waulking Songs", "The Folk Revival"],
  ["Attention and Aesthetics", "Ethnography / Fieldwork", "The Twin Laws of Tradition"],
].map((names, i) => names.map(name => decks[i].cards.find(card => card.title === name)!));
const feedback = [
  ["What came through", "Your idea of humor as ‘skipping steps’ gives the presentation a clear thread. You return to shared context as you move from oral jokes to memes and AI-generated visual juxtapositions."],
  ["How your cards talked to each other", "Jokes provide the case; transmission connects their movement across communities and media; attention and aesthetics help you discuss the experience of an image beside a line of text. The move from shared references to changing production costs brings all three into conversation."],
  ["One thing to try next run", "Slow down at the move from kin communities to online subcultures. Use one concrete example to distinguish the evolutionary explanation you propose from the cultural transmission you can observe."],
];

function PlayingCard({ card, chosen = false, back = false }: { card: Card; chosen?: boolean; back?: boolean }) {
  return <div className={[s.card, chosen ? s.chosen : "", back ? s.back : ""].join(" ")}>
    {back ? <div className={s.cardBack}><span>1196</span><i>✳</i><span>Language · Evidence · Perspective</span></div> : <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.image} alt={card.title + " illustrated course card"} width={640} height={960} loading="lazy" />
      <strong>{card.title}</strong>{chosen && <span className={s.chosenLabel}>Selected for this run</span>}
    </>}
  </div>;
}

export default function Playthrough() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [expandedTranscript, setExpandedTranscript] = useState(false);
  const [notes, setNotes] = useState("Transmission: how humor moves between people and media.\nJokes: shared references and the steps a listener supplies.\nAttention and Aesthetics: image + text, juxtaposition, and recognition.\nFollow the argument from oral jokes to memes to AI juxtaposition.");
  useEffect(() => {
    if (!playing) return;
    if (step === 0) setDealt(true);
    const timer = window.setTimeout(() => {
      if (step === stages.length - 1) setPlaying(false);
      else setStep(step + 1);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [playing, step]);
  function go(next: number) { setStep(next); setPlaying(false); }

  return <div className={s.root}>
    <div className={s.intro}>
      <a className={s.photo} href="/examples/gened1196/elisa-tabletop-color.jpg" target="_blank" rel="noreferrer" aria-label="Open Elisa’s tabletop photograph at full size">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/examples/gened1196/elisa-tabletop-color.jpg" alt="Elisa’s three card decks and handwritten preparation notes on a wooden table" width={1920} height={1080} />
        <span>Elisa’s tabletop · enlarge ↗</span>
      </a>
      <div><p className={s.eyebrow}>GENED 1196 · Fall 2026</p><h2>Follow Elisa’s practice run</h2><p>Play the tour or choose a stage below.</p><details className={s.disclosure}><summary>About this demonstration</summary><p>Elisa demonstrates as a Learning Lab fellow, not as a student submitting an assessment. Her photograph and full transcript are supplied examples. The draw and notes are reconstructed around her chosen cards; the practice feedback is newly written for this page.</p></details></div>
    </div>
    <div className={s.navigation}><button className={s.play} type="button" aria-pressed={playing} onClick={() => { if (step === 4 && !playing) setStep(0); setPlaying(!playing); }}>{playing ? "Pause tour" : step === 4 ? "Replay tour" : "Play tour"}</button><span>{playing ? "Advances every 12 seconds" : "No microphone or API key needed"}</span></div>
    <nav className={s.steps} aria-label="Practice playthrough stages">{stages.map((stage, i) => <button key={stage} type="button" onClick={() => go(i)} aria-current={step === i ? "step" : undefined}><span>0{i + 1}</span>{stage}</button>)}</nav>
    <section className={s.scene} aria-labelledby="practice-stage">
      <div className={s.stageHeading}><span>0{step + 1} / 05</span><h3 id="practice-stage">{["Draw three cards from each deck", "Keep one card from each deck", "Make a plan", "Put the cards into conversation", "Get ready for another run"][step]}</h3></div>
      {step < 2 ? <>
        <p>{step === 0 ? "The original app deals three options from each deck. This walkthrough uses a fixed hand so you can follow the same example all the way through." : "Elisa chose Transmission, Jokes, and Attention and Aesthetics. The task is to build a connection across the three cards."}</p>
        {step === 0 && <button className={s.action} type="button" onClick={() => setDealt(!dealt)}>{dealt ? "Turn cards over" : "Deal the cards"}</button>}
        <div className={s.decks}>{decks.map((deck, i) => <section key={deck.id}><h4>{deck.name}</h4><p>{deck.role}</p><div className={s.hand}>{hands[i].map(card => <PlayingCard key={card.title} card={card} chosen={step === 1 && card.title === titles[i]} back={step === 0 && !dealt} />)}</div></section>)}</div>
      </> : <div className={s.later}>
        <aside className={s.picks}>{selected.map(card => <PlayingCard key={card.title} card={card} />)}</aside>
        <div className={s.detail}>
          {step === 2 && <><div className={s.clock}><strong>05:00</strong><span>The original prep window</span></div><p>Students can use five minutes to make notes or skip ahead. The outline below is reconstructed from Elisa’s transcript, not a transcription of her handwritten notes. You can edit it; her presentation remains unchanged.</p><label className={s.noteLabel}>Preparation notes<textarea rows={5} value={notes} onChange={event => setNotes(event.target.value)} /></label></>}
          {step === 3 && <><p className={s.badge}>Elisa · Learning Lab Undergraduate Fellow</p><p>The original app records a 4–6 minute presentation and transcribes the audio. Read Elisa’s complete demonstration below. Paragraph breaks have been added for readability; her wording is preserved.</p><div className={s.transcriptActions}><a className={s.transcriptLink} href="/examples/gened1196/elisa-transcript.txt" download>Download transcript</a><button type="button" aria-expanded={expandedTranscript} aria-controls="elisa-transcript" onClick={() => setExpandedTranscript(!expandedTranscript)}>{expandedTranscript ? "Use compact view" : "Expand full transcript"}</button></div><div id="elisa-transcript" className={[s.transcript, expandedTranscript ? s.expandedTranscript : ""].join(" ")} role="region" aria-label="Elisa’s complete presentation transcript" tabIndex={0}>{transcript.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></>}
          {step === 4 && <><p className={s.badge}>Illustrative feedback on Elisa’s demonstration</p><p>This feedback was written for the showcase from Elisa’s transcript, following the practice app’s three-part format. It is not a saved response from her session. No grade or score is assigned.</p>{feedback.map(([heading, body]) => <section className={s.feedback} key={heading}><h4>{heading}</h4><p>{body}</p></section>)}<button className={s.action} type="button" onClick={() => { go(0); setDealt(false); }}>Start the playthrough again</button></>}
        </div>
      </div>}
    </section>
    <div className={s.footer}><button type="button" onClick={() => go(step - 1)} disabled={step === 0}>← Previous</button><span>{stages[step]} · {step + 1} of 5</span><button type="button" onClick={() => go(step + 1)} disabled={step === 4}>Next →</button></div>
    <details className={s.catalogue}><summary>Explore all 40 illustrated course cards</summary><div className={s.catalogueGrid}>{decks.map(deck => <section key={deck.id}><h3>{deck.name}</h3><div className={s.allCards}>{deck.cards.map(card => <PlayingCard key={card.title} card={card} />)}</div></section>)}</div></details>
  </div>;
}
