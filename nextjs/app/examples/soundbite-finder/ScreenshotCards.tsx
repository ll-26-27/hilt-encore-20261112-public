"use client";

import { useState } from "react";
import styles from "./screenshots.module.css";

const cards = [
  {
    label: "Reflecting on the format",
    image: "podcast-reflection.png",
    alt: "Soundbite review interface with a podcast recording and timestamped transcript on the left, and suggested excerpts about conversation, writing, and learning from peers on the right.",
    caption: "Candidate excerpts about speaking freely, learning from peers, and comparing the podcast with a written paper.",
  },
  {
    label: "Reflecting on creative work",
    image: "podcast-skills.png",
    alt: "Soundbite review interface proposing excerpts titled What AI can’t embody, Easier to talk about it than write about it, and The tool feels very human, with reasons and source timecodes.",
    caption: "Proposed moments about explaining a project aloud and the skills students bring to their tools.",
  },
];

export default function ScreenshotCards() {
  const [selected, setSelected] = useState(0);
  const card = cards[selected];
  const src = `/examples/soundbite-finder/${card.image}`;
  return (
    <div className={styles.gallery}>
      <h2>Inside the soundbite finder</h2>
      <p>Switch between two views of the student-podcast workflow. Select an image to open it at full size; the pictured controls do not play recordings.</p>
      <div className={styles.controls} role="group" aria-label="Choose a screenshot">
        {cards.map((item, index) => (
          <button key={item.image} type="button" aria-pressed={selected === index} aria-controls="soundbite-screenshot" onClick={() => setSelected(index)}>
            <span>{index + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <figure id="soundbite-screenshot" className={styles.card}>
        <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${card.label.toLowerCase()} screenshot at full size`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={2048} height={1195} alt={card.alt} />
        </a>
        <figcaption aria-live="polite"><strong>{card.label}</strong><span>{card.caption}</span><a href={src} target="_blank" rel="noreferrer">Open full-size image ↗</a></figcaption>
      </figure>
    </div>
  );
}
