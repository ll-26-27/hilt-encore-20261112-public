"use client";
import { useState } from "react";
import styles from "../embedded.module.css";
const sims = [
  { label: "Onions", file: "onion-caramelization-sim.html", equation: "Energy in, water out: Q = mLᵥ + mcΔT." },
  { label: "Basil spheres", file: "basil-sphere-sim.html", equation: "A shell grows inward: δ = √(2Dt)." },
  { label: "Coffee", file: "coffee-sim.html", equation: "Extraction depends on temperature, time and grind size." },
  { label: "Tahini", file: "tahini-seizing-sim.html", equation: "A little water builds bridges; more water loosens the network." },
];
export default function Simulations() {
  const [selected, setSelected] = useState(1);
  const sim = sims[selected];
  const src = `/example-assets/phet/${sim.file}`;
  return <div>
    <div className={styles.toolbar}><div className={styles.choices} aria-label="Choose a cooking simulation">{sims.map((s, i) => <button key={s.file} aria-pressed={i === selected} onClick={() => setSelected(i)}>{s.label}</button>)}</div><a href={src} target="_blank" rel="noreferrer">Open full page ↗</a></div>
    <p className={styles.note} aria-live="polite">{sim.equation} Change a control, make a prediction, and compare it with what the model shows.</p>
    <iframe key={src} className={styles.frame} title={`${sim.label} — Science and Cooking simulation`} src={src} />
    <p className={styles.note}>Independent PhET-style teaching examples. Each page states its model and limitations; the tahini model is illustrative.</p>
  </div>;
}
