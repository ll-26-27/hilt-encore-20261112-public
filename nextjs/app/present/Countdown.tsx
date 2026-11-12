"use client";

import { useEffect, useState } from "react";

// The talk starts at noon ET on November 12, 2026 (17:00 UTC). Before then the title slide counts down; after, it
// shows how far in we are.
const START = Date.parse("2026-11-12T17:00:00Z");

function clock(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (now === null) return <span className="countdown">&nbsp;</span>;
  const left = START - now;
  if (left > 6 * 3600 * 1000) return <span className="countdown">Noon ET · Thursday, November 12</span>;
  if (left > 0) return <span className="countdown">Starting in <b>{clock(left)}</b></span>;
  if (-left < 75 * 60 * 1000) return <span className="countdown live"><i /> Live · {clock(-left)} in</span>;
  return <span className="countdown">Recorded live, November 12, 2026</span>;
}
