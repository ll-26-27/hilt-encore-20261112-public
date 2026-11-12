// @ts-nocheck — preserved JavaScript drawing algorithm from cv-installation.
"use client";

import { useEffect, useRef, useState } from "react";

// After Vera Molnar's Interruptions (1968–69): a square grid of short lines of equal length, each turned by chance,
// with patches of the grid left empty. Molnar wrote the program in FORTRAN and a plotter drew it; here the "plotter"
// draws line by line on a canvas. The same seed always gives the same drawing.

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function plan({ n, length, turn, holes, holeSize, seed }) {
  const rand = rng(seed);
  const centers = Array.from({ length: holes }, () => [rand() * n, rand() * n, holeSize * (0.5 + rand())]);
  const lines = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const angle = Math.PI / 2 + (rand() * 2 - 1) * (turn / 180) * Math.PI;
    const gone = centers.some(([cx, cy, rad]) => (c - cx) ** 2 + (r - cy) ** 2 < rad * rad);
    if (!gone) lines.push({ c, r, angle });
  }
  return { lines, length };
}

const SIZE = 720;

export default function Interruptions() {
  const canvas = useRef(null);
  const [n, setN] = useState(40);
  const [length, setLength] = useState(1.4);
  const [turn, setTurn] = useState(90);
  const [holes, setHoles] = useState(6);
  const [holeSize, setHoleSize] = useState(4);
  const [seed, setSeed] = useState(1968);
  const [speed, setSpeed] = useState(40);
  const [plotted, setPlotted] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    const { lines } = plan({ n, length, turn, holes, holeSize, seed });
    const margin = SIZE * 0.08, cell = (SIZE - 2 * margin) / n, half = (cell * length) / 2;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "#111"; ctx.lineWidth = Math.max(1, cell / 9); ctx.lineCap = "round";
    setTotal(lines.length); setPlotted(0);
    let i = 0, frame = 0;
    const step = () => {
      const until = speed >= 200 ? lines.length : Math.min(lines.length, i + speed);
      ctx.beginPath();
      for (; i < until; i++) {
        const { c, r, angle } = lines[i];
        const x = margin + (c + 0.5) * cell, y = margin + (r + 0.5) * cell;
        ctx.moveTo(x - Math.cos(angle) * half, y - Math.sin(angle) * half);
        ctx.lineTo(x + Math.cos(angle) * half, y + Math.sin(angle) * half);
      }
      ctx.stroke();
      setPlotted(i);
      if (i < lines.length) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [n, length, turn, holes, holeSize, seed, speed]);

  const slider = (label, value, set, min, max, stepSize = 1, note = "") => (
    <label className="int-slider">
      <span>{label} <b>{value}{note}</b></span>
      <input type="range" min={min} max={max} step={stepSize} value={value} onChange={(e) => set(+e.target.value)} />
    </label>
  );

  return (
    <div className="int">
      <div className="int-sheet"><canvas ref={canvas} width={SIZE} height={SIZE} aria-label="A plotted grid of lines in the manner of Vera Molnar's Interruptions" /></div>
      <div className="int-panel">
        {slider("Grid", n, setN, 6, 80, 1, ` × ${n}`)}
        {slider("Line length", length, setLength, 0.4, 3, 0.1, " cells")}
        {slider("Turn", turn, setTurn, 0, 90, 1, "°")}
        {slider("Interruptions", holes, setHoles, 0, 30)}
        {slider("Size of each", holeSize, setHoleSize, 1, 15, 0.5, " cells")}
        {slider("Plotter speed", speed, setSpeed, 1, 200, 1, speed >= 200 ? " (instant)" : " lines/frame")}
        <div className="int-actions">
          <button type="button" className="int-go" onClick={() => setSeed(Math.floor(Math.random() * 1e6))}>New chance</button>
          <button type="button" onClick={() => { const a = document.createElement("a"); a.href = canvas.current.toDataURL("image/png"); a.download = `interruptions-${seed}.png`; a.click(); }}>Save</button>
        </div>
        <p className="int-meta">Seed {seed} · {plotted.toLocaleString()} of {total.toLocaleString()} lines plotted</p>
        <p className="int-note">With the turn at 0° every line stands upright: pure order. At 90° each line can point anywhere. Molnar worked in between: an order, and chance disturbing it.</p>
      </div>
    </div>
  );
}
