"use client";

import { useMemo, useRef, useState } from "react";
import type { Board, Card, Column } from "@/lib/stories";

const ORDER: Column[] = ["0", "1", "2", "3", "4", "5", "unplaced"];
const kindClass = (kind: string) => `kind-${kind.toLowerCase().replace(/[^a-z]+/g, "-")}`;
const time = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function StoryCard({ card, label, print = false }: { card: Card; label: string; print?: boolean }) {
  return (
    <>
      <div className="story-top">
        <span className="story-kind">{card.kind}</span>
        {print && <span className="story-part">{label}</span>}
        {card.show && <span className={`story-show show-${card.show}`}>{card.show}</span>}
      </div>
      <h3>{card.title}</h3>
      {card.body && <p className="story-body">{card.body}</p>}
      <p className="story-meta">
        {[card.who, card.minutes ? `${card.minutes} min` : "", print ? "" : card.status].filter(Boolean).join(" · ")}
      </p>
    </>
  );
}

// Drag a card within or between columns; each drop saves order.json and the card's part to the private folder.
export default function StoryBoard({ initial, labels }: { initial: Board; labels: Record<string, string> }) {
  const [columns, setColumns] = useState(initial.columns);
  const [cards, setCards] = useState(() => new Map(initial.cards.map((c) => [c.id, c])));
  const [status, setStatus] = useState("");
  const [printing, setPrinting] = useState<Column | "all">("all");
  const [over, setOver] = useState<{ col: Column; index: number } | null>(null);
  const dragged = useRef<string | null>(null);

  const minutes = useMemo(
    () => Object.fromEntries(ORDER.map((col) => [col, columns[col].reduce((sum, id) => sum + (cards.get(id)?.minutes ?? 0), 0)])),
    [columns, cards],
  );

  async function save(next: Record<Column, string[]>) {
    setStatus("Saving…");
    try {
      const res = await fetch("/api/stories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ columns: next }) });
      if (!res.ok) throw new Error(await res.text());
      const board: Board = await res.json();
      setColumns(board.columns);
      setCards(new Map(board.cards.map((c) => [c.id, c])));
      setStatus(`Saved ${time()}`);
    } catch (error) {
      setStatus(`Not saved: ${(error as Error).message}`);
    }
  }

  function drop(col: Column, index: number) {
    const id = dragged.current;
    dragged.current = null;
    setOver(null);
    if (!id) return;
    const next = Object.fromEntries(ORDER.map((c) => [c, columns[c].filter((x) => x !== id)])) as Record<Column, string[]>;
    const from = ORDER.find((c) => columns[c].includes(id));
    const oldIndex = from ? columns[from].indexOf(id) : -1;
    const at = from === col && oldIndex < index ? index - 1 : index;
    next[col].splice(Math.max(0, Math.min(at, next[col].length)), 0, id);
    if (ORDER.every((c) => next[c].join() === columns[c].join())) return;
    setColumns(next);
    save(next);
  }

  function print(target: Column | "all") {
    setPrinting(target);
    setTimeout(() => window.print(), 60);
  }

  const toPrint = (printing === "all" ? ORDER : [printing]).flatMap((col) => columns[col].map((id) => ({ card: cards.get(id)!, col })));
  const total = ORDER.filter((c) => c !== "unplaced").reduce((sum, c) => sum + minutes[c], 0);

  return (
    <main id="main" className="stories">
      <header className="stories-head">
        <div>
          <p className="eyebrow">HILT Encore · story cards · private</p>
          <h1>Micro-stories</h1>
        </div>
        <div className="stories-actions">
          <span className="stories-status">{status || `${cards.size} cards · ${total} min placed`}</span>
          <button type="button" onClick={() => print("all")}>Print all</button>
        </div>
      </header>

      <div className="story-columns">
        {ORDER.map((col) => (
          <section
            key={col}
            className={`story-column${col === "unplaced" ? " unplaced" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (e.target === e.currentTarget) setOver({ col, index: columns[col].length });
            }}
            onDrop={(e) => {
              e.preventDefault();
              drop(col, over?.col === col ? over.index : columns[col].length);
            }}
          >
            <header>
              <div>
                <span className="story-col-num">{col === "unplaced" ? "—" : col}</span>
                <strong>{labels[col] ?? col}</strong>
              </div>
              <span className="story-col-meta">
                {columns[col].length} · {minutes[col]} min
                <button type="button" onClick={() => print(col)} title="Print this column">Print</button>
              </span>
            </header>
            {columns[col].map((id, i) => {
              const card = cards.get(id);
              if (!card) return null;
              return (
                <article
                  key={id}
                  draggable
                  className={`story-card ${kindClass(card.kind)}${over?.col === col && over.index === i ? " drop-before" : ""}`}
                  onDragStart={(e) => {
                    dragged.current = id;
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", id);
                  }}
                  onDragEnd={() => setOver(null)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const r = e.currentTarget.getBoundingClientRect();
                    const index = e.clientY < r.top + r.height / 2 ? i : i + 1;
                    if (over?.col !== col || over.index !== index) setOver({ col, index });
                  }}
                >
                  <StoryCard card={card} label={labels[col]} />
                </article>
              );
            })}
            <div className={`story-drop-end${over?.col === col && over.index === columns[col].length ? " active" : ""}`} />
          </section>
        ))}
      </div>

      <div className="print-sheet" aria-hidden>
        {toPrint.map(({ card, col }) => (
          <article key={card.id} className={`print-card ${kindClass(card.kind)}`}>
            <StoryCard card={card} label={col === "unplaced" ? "Unplaced" : `${col} · ${labels[col]}`} print />
          </article>
        ))}
      </div>
    </main>
  );
}
