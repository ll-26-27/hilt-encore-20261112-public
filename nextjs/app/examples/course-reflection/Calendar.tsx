"use client";
import { useState } from "react";
import days from "./days.json";
import styles from "./reflection.module.css";
const weeks = [
  { dates: "May 18–21", title: "Getting a project working", change: "Cowork, then installing the terminal and VS Code." },
  { dates: "June 1–4", title: "Making the task concrete", change: "Desktop Code and terminal offered together; faculty tasks become recipe folders." },
  { dates: "June 8–11", title: "Fewer examples, more context", change: "Desktop Code becomes the shared route. The final day remains a plan, not an observed outcome." },
];
type Block = (typeof days)[number]["planned"][number];
const mode = (b: Block) => b.modes.includes("Code") ? "code" : b.modes.includes("Cowork") ? "cowork" : b.modes.includes("Chat") ? "chat" : "paper";
const date = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
export default function Calendar() {
  const [week, setWeek] = useState(0);
  const [selected, setSelected] = useState(days[0].id);
  const [layer, setLayer] = useState<"actual" | "planned">("actual");
  const day = days.find(d => d.id === selected)!;
  function chooseWeek(w: number) { setWeek(w); setSelected(days.find(d => d.week === w + 1)!.id); }
  function blocks(d: typeof day) { return layer === "planned" || !d.observed ? d.planned : d.actual; }
  return <div className={styles.explorer}>
    <div className={styles.explorerHead}><div><p className={styles.eyebrow}>The calendar from the slides, opened up</p><h2>Same four-day course. Three different weeks.</h2></div><span className={styles.count}>12 sessions · 11 transcripts</span></div>
    <div className={styles.controls}>
      <div className={styles.buttons} aria-label="Week">{weeks.map((w, i) => <button key={w.dates} aria-pressed={week === i} onClick={() => chooseWeek(i)}>Week {i + 1}<span>{w.dates}</span></button>)}</div>
      <div className={styles.layer} aria-label="Calendar evidence layer"><button aria-pressed={layer === "actual"} onClick={() => setLayer("actual")}>What happened</button><button aria-pressed={layer === "planned"} onClick={() => setLayer("planned")}>What we planned</button></div>
    </div>
    <div className={styles.weekNote}><strong>{weeks[week].title}</strong><span>{weeks[week].change}</span></div>
    <div className={styles.legend}><span className={styles.chat}>Chat</span><span className={styles.cowork}>Cowork</span><span className={styles.code}>Code</span><span className={styles.paper}>Discussion / paper</span></div>
    <div className={styles.calendar}>{days.filter(d => d.week === week + 1).map(d => <button key={d.id} className={`${styles.day} ${!d.observed ? styles.unverified : ""}`} aria-pressed={day.id === d.id} onClick={() => setSelected(d.id)}>
      <span className={styles.dayHead}>Day {d.day}<span>{date(d.date)}</span></span>
      {!d.observed && <span className={styles.badge}>Plan only · delivery unverified</span>}
      <span className={styles.blocks}>{blocks(d).map((b, i) => <span key={i} className={`${styles.block} ${styles[mode(b)]}`}>{b.title}</span>)}</span>
      <span className={styles.inspect}>Compare this day ↓</span>
    </button>)}</div>
    <p className={styles.caption}>Blocks show sequence, not measured duration. Color follows the mode labels used in the slide calendar. June 11 has no central transcript.</p>
    <section className={styles.detail} aria-live="polite"><header><p className={styles.eyebrow}>Week {day.week} · Day {day.day} · {date(day.date)}</p><h3>Put the plan beside the record.</h3></header>
      <div className={styles.compare}>{(["planned", "actual"] as const).map(key => <div key={key}><h4>{key === "planned" ? "The retained plan" : "Observed in the transcript"}</h4>{key === "actual" && !day.observed ? <p className={styles.empty}>No recording in the central transcript set. The prepared materials tell us what was available, not what was delivered.</p> : <ol>{day[key].map((b, i) => <li key={i}><strong>{b.title}</strong><p>{b.activity}</p><details><summary>Evidence: {b.evidence}</summary><p>{b.locator || "See the source account for this session."}</p></details></li>)}</ol>}</div>)}</div>
      {day.changes.length > 0 && <aside className={styles.changes}><h4>What changed—and how we know</h4>{day.changes.map((c, i) => <p key={i}>{c.summary} <span>{c.evidence}</span></p>)}</aside>}
    </section>
  </div>;
}
