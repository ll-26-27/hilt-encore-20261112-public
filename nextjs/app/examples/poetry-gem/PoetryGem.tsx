"use client";

import { useState } from "react";
import data from "./assembled.json";
import recordedReplies from "./replies.json";
import { BAND_ORDER, FOLDS, PlateFigure, cast, type Band } from "./Doll";
import s from "./poetry-gem.module.css";

// Everything here is computed from two saved files: assembled.json (what poetry-gem's /api/chat would send for each
// combination, rebuilt from its own content and search code) and replies.json (the replies, written beforehand).
// Nothing calls a model.

type Passage = { title: string; source: string; text: string; score?: number };
type Level = { label: string; blurb: string; chars: number; approxTokens: number; passages: number };
type PackId = "phaedrus" | "frankenstein" | "analects" | "none";
type TextPack = Exclude<PackId, "none">;
type Delivery = "full" | "lexical" | "agentic";
type Material = "voice" | "assigned" | "more" | "whole";
type Recorded = {
  material: Material;
  tails: Record<Delivery, string>;
  packFile: string;
  packChars: number;
  retrieval: { note: string; hits: Passage[] };
  toolCall: { query: string; results: Passage[] };
};
type MeterRow = { instructions: number; pack: number; retrieved: number; message: number; haystack: number };

const D = data as unknown as {
  message: string;
  genres: { id: string; label: string; blurb: string; prompt: string }[];
  packs: Record<TextPack, { label: string; edition: string; voiceOf: string; levels: Record<Material, Level> }>;
  meter: Record<string, MeterRow>;
  recorded: Record<TextPack, Recorded>;
  searchTool: unknown;
};
const REPLIES = (recordedReplies as { replies: Record<string, string> }).replies;

const PACKS: PackId[] = ["phaedrus", "frankenstein", "analects", "none"];
const PACK_LABELS: Record<PackId, string> = {
  phaedrus: "Plato, Phaedrus",
  frankenstein: "Shelley, Frankenstein",
  analects: "Confucius, Analects",
  none: "No pack (baseline)",
};
const DELIVERIES: Delivery[] = ["full", "lexical", "agentic"];
const DELIVERY_LABELS: Record<Delivery, { label: string; blurb: string }> = {
  full: { label: "Whole pack", blurb: "Paste the entire pack into the system prompt, every turn. Simple, thorough, expensive." },
  lexical: { label: "Keyword retrieval", blurb: "Search the pack for words in your message; send only the top passages. Cheap, but only finds exact words." },
  agentic: { label: "Model searches", blurb: "Give the model a search tool and let it decide what (and whether) to look up." },
};
const MATERIALS: Material[] = ["voice", "assigned", "more", "whole"];
const CONTEXT_WINDOW = 1_000_000; // poetry-gem's default (Claude Opus 5)
const CHARS_PER_TOKEN = 3.5; // poetry-gem's rough rule for pack sizes

// Jewel tones sampled from the plates (poetry-gem lib/options.ts).
type Kind = "instructions" | "pack" | "retrieved" | "tool" | "search" | "message";
const KIND: Record<Kind, { label: string; color: string }> = {
  instructions: { label: "Instructions", color: "#3a5aa8" },
  pack: { label: "Knowledge pack", color: "#3f8a33" },
  retrieved: { label: "Retrieved passages", color: "#2f8a80" },
  tool: { label: "Tool definition", color: "#8a5cc2" },
  search: { label: "Searches & results", color: "#7a45b8" },
  message: { label: "Your message", color: "#d06a4a" },
};

const fmt = (n: number) => n.toLocaleString("en-US");
const tok = (chars: number) => Math.round(chars / CHARS_PER_TOKEN);
const pct = (x: number) => (x >= 10 ? x.toFixed(0) : x >= 1 ? x.toFixed(1) : x.toFixed(2)) + "%";
const formatPassages = (ps: Passage[]) => ps.map((p) => `<passage title="${p.title}">\n${p.text}\n</passage>`).join("\n\n");

type Spec = { head: string; torso: PackId; legs: Delivery };

export default function PoetryGem() {
  const [spec, setSpec] = useState<Spec>({ head: "sonnet", torso: "frankenstein", legs: "full" });
  const [material, setMaterial] = useState<Material>("assigned");
  const genre = D.genres.find((g) => g.id === spec.head)!;
  const hasPack = spec.torso !== "none";

  const options: Record<Band, { id: string; label: string }[]> = {
    head: D.genres.map((g) => ({ id: g.id, label: g.label })),
    torso: PACKS.map((p) => ({ id: p, label: PACK_LABELS[p] })),
    legs: DELIVERIES.map((d) => ({ id: d, label: DELIVERY_LABELS[d].label })),
  };
  const step = (band: Band, dir: 1 | -1) => {
    const opts = options[band];
    const i = Math.max(0, opts.findIndex((o) => o.id === spec[band]));
    setSpec((p) => ({ ...p, [band]: opts[(i + dir + opts.length) % opts.length].id }));
  };
  const caption = `${genre.label} · ${PACK_LABELS[spec.torso]}${hasPack ? ` · ${DELIVERY_LABELS[spec.legs].label}` : ""}`;

  return (
    <div className={s.root}>
      <div className={s.stage}>
        <figure className={s.plate}>
          <PlateFigure plates={cast(spec)} className={s.figure} title={`The agent: ${caption}`}>
            {BAND_ORDER.map((band) => {
              const [top, bottom] = band === "head" ? [0, FOLDS.neck] : band === "torso" ? [FOLDS.neck, FOLDS.hip] : [FOLDS.hip, 1];
              const meta = BAND_META[band];
              const current = options[band].find((o) => o.id === spec[band]);
              const inert = band === "legs" && !hasPack;
              return (
                <div key={band} className={s.zone} style={{ top: `${top * 100}%`, height: `${(bottom - top) * 100}%` }}>
                  <button className={s.arrow} onClick={() => step(band, -1)} aria-label={`Previous ${meta.knob}`}>‹</button>
                  <span className={s.tag}>
                    <b>{meta.part}</b> · {meta.knob}: {inert ? "(no pack to deliver)" : current?.label}
                  </span>
                  <button className={s.arrow} onClick={() => step(band, 1)} aria-label={`Next ${meta.knob}`}>›</button>
                </div>
              );
            })}
          </PlateFigure>
          <figcaption className={s.caption}>
            <span className={s.plateTitle}>L&rsquo;Agent</span>
            <span className={s.plateSub}>{caption}</span>
            <span className={s.planche}><span>Costume pour un agent</span><span>Planche I</span></span>
          </figcaption>
        </figure>

        <div className={s.side}>
          <h3>Dress the agent</h3>
          <p className={s.muted}>
            The <b>head</b> is the instructions (the system prompt), the <b>bodice</b> the knowledge it carries, the{" "}
            <b>legs</b> how that knowledge reaches the model. Flip each fold with the arrows on the plate.
          </p>
          <dl className={s.knobs}>
            <dt>Instructions</dt>
            <dd>{genre.label}: {genre.blurb}</dd>
            <dt>Knowledge</dt>
            <dd>{hasPack ? D.packs[spec.torso as TextPack].edition : "No pack: the model works from the instructions alone."}</dd>
            {hasPack && (<><dt>Delivery</dt><dd>{DELIVERY_LABELS[spec.legs].label}: {DELIVERY_LABELS[spec.legs].blurb}</dd></>)}
          </dl>
          {hasPack && <Ladder pack={spec.torso as TextPack} material={material} setMaterial={setMaterial} />}
        </div>
      </div>

      <Meter spec={spec} material={hasPack ? material : "voice"} />

      <Exchange spec={spec} />
    </div>
  );
}

const BAND_META: Record<Band, { part: string; knob: string }> = {
  head: { part: "Head", knob: "Instructions" },
  torso: { part: "Bodice", knob: "Knowledge" },
  legs: { part: "Legs", knob: "Delivery" },
};

function Ladder({ pack, material, setMaterial }: { pack: TextPack; material: Material; setMaterial: (m: Material) => void }) {
  const levels = D.packs[pack].levels;
  const max = Math.max(...MATERIALS.map((m) => levels[m].approxTokens), 1);
  const replyAt = D.recorded[pack].material;
  return (
    <div>
      <h4 className={s.subhead}>How much of the text (for the meter)</h4>
      <div className={s.ladder}>
        {MATERIALS.map((m) => (
          <button key={m} type="button" aria-pressed={material === m} className={`${s.rung} ${material === m ? s.on : ""}`} onClick={() => setMaterial(m)} title={levels[m].blurb}>
            <span className={s.rungLabel}>{levels[m].label}{m === replyAt && <em> · reply recorded</em>}</span>
            <span className={s.rungBar}><i style={{ width: `${Math.max(1.5, (levels[m].approxTokens / max) * 100)}%` }} /></span>
            <small>≈ {fmt(levels[m].approxTokens)}</small>
          </button>
        ))}
      </div>
      <p className={s.muted}>
        {levels[material].blurb} {fmt(levels[material].passages)} searchable passages. The meter below follows this size;
        the recorded reply was written for <b>{levels[replyAt].label}</b>.
      </p>
    </div>
  );
}

function Meter({ spec, material }: { spec: Spec; material: Material }) {
  const key = spec.torso === "none" ? `${spec.head}|none|voice|full` : `${spec.head}|${spec.torso}|${material}|${spec.legs}`;
  const row = D.meter[key];
  const parts: [Kind, number][] = (
    [["instructions", row.instructions], ["pack", row.pack], ["retrieved", row.retrieved], ["message", row.message]] as [Kind, number][]
  ).filter(([, c]) => c > 0).map(([k, c]) => [k, tok(c)]);
  const total = Math.max(1, parts.reduce((n, [, t]) => n + t, 0));
  const used = (total / CONTEXT_WINDOW) * 100;
  const haystack = tok(row.haystack);
  return (
    <section className={s.gauge} aria-label="Context-window meter">
      <div className={s.barLabel}>
        <b>This request, to scale</b>: ≈ {fmt(total)} of {fmt(CONTEXT_WINDOW)} tokens ({pct(used)} of the context window)
      </div>
      <div className={s.gaugeBar}>
        {row.haystack > 0 && <div className={s.searched} style={{ width: `${Math.min(100, Math.max(0.25, (haystack / CONTEXT_WINDOW) * 100))}%` }} title={`The pack being searched: ≈ ${fmt(haystack)} tokens`} />}
        <div className={s.scaled} style={{ width: `${Math.min(100, Math.max(used, 0.25))}%` }}>
          <Stack parts={parts} total={total} />
        </div>
      </div>
      {row.haystack > 0 && (
        <p className={s.searchNote}>
          <i className={s.swSearched} /> <b>Searched: ≈ {fmt(haystack)} tokens</b> of the pack · <b>sent: ≈ {fmt(total)}</b>.{" "}
          {spec.legs === "lexical"
            ? "Keyword retrieval looks through the whole pack but sends only the best-matching passages, so a bigger pack changes what can be found, not how much is sent."
            : "The model can search the whole pack, but only what its searches return is sent, during the turn (not counted in this bar)."}
        </p>
      )}
      <div className={s.barLabel}><b>Zoomed in</b>: what fills it. Every turn re-sends all of it.</div>
      <div className={`${s.gaugeBar} ${s.zoomBar}`}><Stack parts={parts} total={total} labels /></div>
      <div className={s.legend}>
        {parts.map(([k, t]) => (
          <span key={k}><i style={{ background: KIND[k].color }} /> {KIND[k].label}: ≈ {fmt(t)} ({pct((t / total) * 100)})</span>
        ))}
      </div>
      <p className={s.fine}>
        Token counts are estimates at {CHARS_PER_TOKEN} characters per token, from the exact characters poetry-gem would
        send for the message &ldquo;{D.message}&rdquo;; retrieval sizes come from running its keyword search at each size.
        In class the meter recalibrated against the token count the API reported; no counts were recorded here.
      </p>
    </section>
  );
}

function Stack({ parts, total, labels }: { parts: [Kind, number][]; total: number; labels?: boolean }) {
  return (
    <>
      {parts.map(([k, t]) => {
        const share = (t / total) * 100;
        return (
          <div key={k} className={s.seg} style={{ width: `${share}%`, background: KIND[k].color }} title={`${KIND[k].label}: ≈ ${fmt(t)} tokens (${pct(share)})`}>
            {labels && share > 9 && <span>{KIND[k].label} · {pct(share)}</span>}
          </div>
        );
      })}
    </>
  );
}

type Part = { kind: Kind; label: string; text?: string; file?: string; chars: number };

function partsFor(spec: Spec): Part[] {
  const genre = D.genres.find((g) => g.id === spec.head)!;
  const msg: Part = { kind: "message", label: "You (now)", text: D.message, chars: D.message.length };
  if (spec.torso === "none") return [{ kind: "instructions", label: "System prompt", text: genre.prompt, chars: genre.prompt.length }, msg];
  const rec = D.recorded[spec.torso];
  const system = genre.prompt + rec.tails[spec.legs];
  const out: Part[] = [{ kind: "instructions", label: "System prompt", text: system, chars: system.length }];
  if (spec.legs === "full") out.push({ kind: "pack", label: "System prompt, continued: the context pack", file: rec.packFile, chars: rec.packChars });
  if (spec.legs === "agentic") {
    const def = JSON.stringify(D.searchTool, null, 2);
    out.push({ kind: "tool", label: "Tool definition, sent with the request", text: def, chars: def.length });
  }
  if (spec.legs === "lexical" && rec.retrieval.hits.length) {
    const block = `<retrieved_passages>\n${formatPassages(rec.retrieval.hits)}\n</retrieved_passages>`;
    out.push({ kind: "retrieved", label: "You (attached by retrieval)", text: block, chars: block.length });
  }
  out.push(msg);
  if (spec.legs === "agentic") {
    const call = `search_pack(${JSON.stringify({ query: rec.toolCall.query })})`;
    const result = rec.toolCall.results.length ? formatPassages(rec.toolCall.results) : "No passages matched those words.";
    out.push({ kind: "search", label: "Bot calls a tool", text: call, chars: call.length });
    out.push({ kind: "search", label: "Tool result, sent back as a user turn", text: result, chars: result.length });
  }
  return out;
}

function Exchange({ spec }: { spec: Spec }) {
  const id = spec.torso === "none" ? `${spec.head}|none|full` : `${spec.head}|${spec.torso}|${spec.legs}`;
  const reply = REPLIES[id] ?? "";
  const rec = spec.torso === "none" ? null : D.recorded[spec.torso];
  const material = rec ? D.packs[spec.torso as TextPack].levels[rec.material].label : "";
  const parts = partsFor(spec);
  return (
    <section className={s.thread}>
      <div className={s.user}>{D.message}</div>
      <div className={s.replyRow}>
        <PlateFigure plates={cast(spec)} className={s.sticker} title="The agent that wrote this" />
        <div className={s.reply}>
          <div className={s.chips}>
            <span>{spec.head}</span>
            <span>{PACK_LABELS[spec.torso]}</span>
            {rec && (<><span>{material}</span><span>{DELIVERY_LABELS[spec.legs].label}</span></>)}
          </div>
          {rec && spec.legs === "agentic" && (
            <div className={s.toolLine}>searched the pack for <q>{rec.toolCall.query}</q>: {rec.toolCall.results.length} passage(s)</div>
          )}
          <div className={s.poem}><Poem text={reply} /></div>
          <p className={s.fine}>Pre-written by Claude (Claude Code, Opus 5.5), 12 Nov 2026, from the input below; not the reply given in class.</p>

          <details className={s.inspector}>
            <summary>What the model saw</summary>
            {rec && spec.legs === "lexical" && <p className={s.muted}>{rec.retrieval.note}</p>}
            <WholeInput parts={parts} />
            {rec && spec.legs === "lexical" && <PassageList title="Passages added to your message" items={rec.retrieval.hits} />}
            {rec && spec.legs === "agentic" && <PassageList title={`Tool call 1: search_pack("${rec.toolCall.query}")`} items={rec.toolCall.results} />}
            <p className={s.fine}>The model&rsquo;s summarized reasoning, token counts and cost: not recorded.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

function Poem({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={s.line}>
          {line.split(/(\*[^*]+\*)/g).map((bit, j) => (bit.startsWith("*") && bit.endsWith("*") && bit.length > 2 ? <em key={j}>{bit.slice(1, -1)}</em> : bit))}
          {"\n"}
        </span>
      ))}
    </>
  );
}

/** The whole request, in order, as one string. Long parts fold; nothing is shortened. */
function WholeInput({ parts }: { parts: Part[] }) {
  const chars = parts.reduce((n, p) => n + p.chars, 0) || 1;
  return (
    <>
      <h4>The whole input, as one string (≈ {fmt(tok(chars))} tokens, {fmt(chars)} characters)</h4>
      <p className={s.muted}>
        A chat isn&rsquo;t really taken in turns: each time you send, everything below goes to the model again as one long input,
        and the reply is what comes next. Open any part to read it in full.
      </p>
      <div className={s.whole}>
        {parts.map((p, i) => (
          <PartView key={i} part={p} share={(p.chars / chars) * 100} />
        ))}
      </div>
    </>
  );
}

function PartView({ part, share }: { part: Part; share: number }) {
  const [text, setText] = useState<string | null>(part.text ?? null);
  const [error, setError] = useState("");
  const load = () => {
    if (text !== null || !part.file) return;
    fetch(part.file)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status}`))))
      .then(setText)
      .catch((e) => setError(`Could not load the pack (${e.message}).`));
  };
  return (
    <details className={s.part} style={{ borderLeftColor: KIND[part.kind].color }} open={part.chars < 2500} onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && load()}>
      <summary className={s.partLabel}>
        <i style={{ background: KIND[part.kind].color }} /> {part.label} · {fmt(part.chars)} characters · {pct(share)}
      </summary>
      <pre className={s.pre}>{error || text || "Loading…"}</pre>
    </details>
  );
}

function PassageList({ title, items }: { title: string; items: Passage[] }) {
  return (
    <>
      <h4>{title}</h4>
      {items.length ? (
        <ol className={s.passages}>
          {items.map((p, i) => (
            <li key={i}>
              {p.title} <small>({p.source}{p.score !== undefined ? `, score ${p.score}` : ""})</small>
            </li>
          ))}
        </ol>
      ) : (
        <p className={s.muted}>No passages matched.</p>
      )}
    </>
  );
}
