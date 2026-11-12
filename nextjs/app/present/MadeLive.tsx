"use client";

import { useEffect, useState } from "react";
import type { Made } from "@/lib/made";

const time = (iso: string) => (iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) : "");

// The workspace that made this talk, refreshed every 10 seconds while the slide is up. With nothing live (deployed, or
// the run is over), it shows `fallback`: CX's words or a screenshot.
export default function MadeLive({ fallback }: { fallback?: React.ReactNode }) {
  const [made, setMade] = useState<Made | null>(null);
  useEffect(() => {
    let stop = false;
    const load = () => fetch("/api/made", { cache: "no-store" }).then((r) => r.json()).then((m) => !stop && setMade(m)).catch(() => {});
    load();
    const timer = setInterval(load, 10000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, []);
  if (made && !made.live) return <div className="made-fallback">{fallback}</div>;
  return (
    <div className="made">
      <div className="made-panes">
        {(made?.agents.length ? made.agents : [{ id: "…", label: "loading", role: "", model: "", status: "" }]).map((agent) => (
          <div key={agent.id} className={`made-pane${"done" in agent && agent.done ? " done" : ""}`}>
            <strong>{agent.id}</strong>
            <span className="made-role">{agent.role}</span>
            <span className="made-meta">{agent.model}{agent.status ? ` · ${agent.status}` : ""}</span>
          </div>
        ))}
      </div>
      <div className="made-log">
        <p className="eyebrow">This site, commit by commit, this morning</p>
        <ol>
          {(made?.commits ?? []).slice(0, 7).map((c) => (
            <li key={c.hash}><time>{time(c.time)}</time> {c.subject}</li>
          ))}
        </ol>
        {made && <p className="made-count">{made.commits.length} commits · updated {time(made.at)}</p>}
      </div>
    </div>
  );
}
