import type { ReactNode } from "react";
import data from "./data.json";
import s from "./frankenstein.module.css";

// Everything on this page is read from data.json, which was extracted (unchanged numbers, truncated passages) from
// the pipeline's saved outputs in ll-26-27/eng298ai-20261103: 07-aggregate.json, 06-known-revisions.json and
// 04-categorized.json. No model is called here.

const FOLDER = "https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/distant-reading/01-frankenstein-revisions";

type Change = {
  id: string; where1818: string; where1831: string; kind: string; size: string; rewrite: boolean;
  wordsRemoved: number; wordsAdded: number; segments: string[][];
  category: string | null; secondary: string[]; significance: number | null; confidence: string | null;
  rationale: string | null; by: string | null;
};
const changes = data.changes as unknown as Record<string, Change>;

// Seven interpretive categories get the validated categorical slots (dark steps); the four surface categories share a gray.
const STYLE = ["wording", "spelling", "punctuation", "other"];
const COLOR: Record<string, string> = {
  characterization: "#3987e5", plot: "#d95926", expansion: "#199e70", cut: "#c98500",
  "moral-religious": "#d55181", "fate-agency": "#008300", framing: "#9085e9",
  wording: "#6d716a", spelling: "#6d716a", punctuation: "#6d716a", other: "#6d716a",
};
const STACK = ["characterization", "plot", "expansion", "cut", "moral-religious", "fate-agency", "framing", "style"];
const colorOf = (k: string) => (k === "style" ? "#6d716a" : COLOR[k]);
const nameOf = (k: string) => (k === "style" ? "wording, spelling, punctuation, other" : k);
const fmt = (n: number) => n.toLocaleString("en-US");
const tidy = (t: string) => t.replace(/ ([,.;:!?)])/g, "$1").replace(/\( /g, "(");

// Footnote from the source README ("Methods and findings"): this rationale is wrong about the text.
const WRONG: Record<string, string> = {
  c0113: "The pipeline's README flags this rationale as wrong about the text: it says the 1818 letter is replaced by \"a new letter from Elizabeth herself\"; both versions are her letters.",
};

function Stat({ n, label }: { n: string; label: string }) {
  return <div className={s.stat}><strong>{n}</strong><span>{label}</span></div>;
}

function CategoryBars() {
  const cats = data.categories;
  const max = Math.max(...cats.map((c) => data.byCategory[c as keyof typeof data.byCategory].anyLabel));
  return (
    <div className={s.bars} role="table" aria-label="Changes by category">
      <div className={s.barsHead} role="row"><span role="columnheader">category</span><span role="columnheader">primary label <i className={s.keySolid} /> · counting secondary labels too <i className={s.keyGhost} /></span><span role="columnheader">primary</span></div>
      {cats.map((c) => {
        const v = data.byCategory[c as keyof typeof data.byCategory];
        const by = c === "punctuation" ? "labelled by rule, no model" : `${v.primary} primary, ${v.anyLabel} with secondary labels`;
        return (
          <div key={c} className={s.barRow} role="row" title={`${c}: ${by}`}>
            <span className={s.barName} role="cell">{c}</span>
            <span className={s.barTrack} role="cell">
              <span className={s.barGhost} style={{ width: `${(v.anyLabel / max) * 100}%`, borderColor: COLOR[c] }} />
              <span className={s.barFill} style={{ width: `${(v.primary / max) * 100}%`, background: COLOR[c] }} />
            </span>
            <span className={s.barNum} role="cell">{v.primary}{v.anyLabel !== v.primary && <em> / {v.anyLabel}</em>}</span>
          </div>
        );
      })}
    </div>
  );
}

function SectionChart() {
  const secs = data.sections.map((sec) => {
    const w = sec.wordsChanged as Record<string, number>;
    const parts = STACK.map((k) => ({ k, v: k === "style" ? STYLE.reduce((a, c) => a + (w[c] || 0), 0) : w[k] || 0 }));
    return { ...sec, parts, total: parts.reduce((a, p) => a + p.v, 0) };
  });
  const W = 1120, H = 360, top = 20, left = 52, bottom = 300, step = (W - left - 10) / secs.length, bw = step - 6;
  const max = 2400;
  const y = (v: number) => bottom - (v / max) * (bottom - top);
  const short = (label: string) => label.replace("Author's Introduction (1831)", "Intro").replace("Preface", "Pref.").replace("Letter ", "L.").replace("Ch. ", "");
  const vol = (from: string) => (from.startsWith("Vol. I,") || from.startsWith("Letter") || from === "Preface" ? "I" : from.startsWith("Vol. II,") ? "II" : from.startsWith("Vol. III,") ? "III" : "");
  const spans: { v: string; a: number; b: number }[] = [];
  secs.forEach((sec, i) => {
    const v = vol(sec.from1818);
    if (!v) return;
    const last = spans[spans.length - 1];
    if (last && last.v === v) last.b = i; else spans.push({ v, a: i, b: i });
  });
  return (
    <figure className={s.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label="Words changed in each section of the 1831 text, stacked by category">
        {[0, 500, 1000, 1500, 2000].map((t) => (
          <g key={t}>
            <line x1={left} x2={W - 4} y1={y(t)} y2={y(t)} className={s.grid} />
            <text x={left - 8} y={y(t) + 4} textAnchor="end" className={s.tick}>{fmt(t)}</text>
          </g>
        ))}
        {secs.map((sec, i) => {
          const x = left + 3 + i * step;
          let acc = 0;
          const tip = `${sec.label} (1818: ${sec.from1818}): ${fmt(sec.total)} words changed\n` + sec.parts.filter((p) => p.v).map((p) => `  ${nameOf(p.k)}: ${fmt(p.v)}`).join("\n");
          return (
            <g key={sec.id} className={s.col}>
              <title>{tip}</title>
              <rect x={x - 3} y={top} width={step} height={bottom - top} fill="transparent" />
              {sec.parts.map((p) => {
                if (!p.v) return null;
                const y0 = y(acc), y1 = y(acc + p.v);
                acc += p.v;
                const h = Math.max(0, y0 - y1 - (acc === p.v ? 0 : 1.5));
                return h > 0 ? <rect key={p.k} x={x} y={y1} width={bw} height={Math.max(h, 0.8)} rx={1.5} fill={colorOf(p.k)} /> : null;
              })}
              {sec.total >= 600 && <text x={x + bw / 2} y={y(sec.total) - 6} textAnchor="middle" className={s.colVal}>{fmt(sec.total)}</text>}
              <text x={x + bw / 2} y={bottom + 16} textAnchor="middle" className={s.tick}>{short(sec.label)}</text>
            </g>
          );
        })}
        {spans.map((sp) => {
          const x1 = left + 3 + sp.a * step, x2 = left + 3 + sp.b * step + bw;
          return (
            <g key={sp.v}>
              <path d={`M${x1} ${bottom + 28} V${bottom + 34} H${x2} V${bottom + 28}`} className={s.bracket} />
              <text x={(x1 + x2) / 2} y={bottom + 52} textAnchor="middle" className={s.volLabel}>1818 Vol. {sp.v}</text>
            </g>
          );
        })}
        <text x={left + 3 + step / 2 - 3} y={bottom + 52} textAnchor="middle" className={s.volLabel}>new</text>
      </svg>
      <div className={s.legend}>
        {STACK.map((k) => <span key={k}><i style={{ background: colorOf(k) }} />{nameOf(k)}</span>)}
      </div>
      <figcaption>Words changed in each section of the 1831 text (the larger of words added and removed), by the change&rsquo;s primary category. 1831 Chs. I and II both come from 1818 Vol. I, Ch. I. Hover a column for its numbers.</figcaption>
      <details className={s.tableView}>
        <summary>Show as a table</summary>
        <div className={s.tableWrap}>
          <table>
            <thead><tr><th>1831 section</th><th>from 1818</th>{STACK.map((k) => <th key={k}>{k === "style" ? "style" : k}</th>)}<th>total</th></tr></thead>
            <tbody>
              {secs.map((sec) => (
                <tr key={sec.id}><td>{sec.label}</td><td>{sec.from1818}</td>{sec.parts.map((p) => <td key={p.k}>{p.v ? fmt(p.v) : ""}</td>)}<td>{fmt(sec.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

function Diff({ c }: { c: Change }) {
  if (!c.segments.length) return <p className={s.muted}>The whole Introduction is new in 1831 ({fmt(c.wordsAdded)} words); open the original page to read it.</p>;
  if (c.rewrite) {
    const before = c.segments.filter((x) => x[0] !== "+").map((x) => x[1]).join(" ");
    const after = c.segments.filter((x) => x[0] !== "-").map((x) => x[1]).join(" ");
    return (
      <div className={s.sideBySide}>
        <div><span className={s.ed}>1818</span><p className={s.del}>{tidy(before)}</p></div>
        <div><span className={s.ed}>1831</span><p className={s.ins}>{tidy(after)}</p></div>
      </div>
    );
  }
  return (
    <p className={s.inline}>
      {c.segments.map(([k, t], i) => (k === "-" ? <del key={i}>{tidy(t)}</del> : k === "+" ? <ins key={i}>{tidy(t)}</ins> : <span key={i}>{tidy(t)}</span>)).reduce<ReactNode[]>((a, el, i) => (i ? [...a, " ", el] : [el]), [])}
    </p>
  );
}

function ChangeBody({ c }: { c: Change }) {
  return (
    <div className={s.changeBody}>
      <p className={s.where}>{c.id} · 1818 {c.where1818} → 1831 {c.where1831} · {c.kind}{c.rewrite ? " (rewrite: shown whole, trimmed)" : ""} · −{fmt(c.wordsRemoved)} / +{fmt(c.wordsAdded)} words</p>
      <Diff c={c} />
      {c.rationale && (
        <div className={s.label}>
          <span className={s.chip} style={{ borderColor: COLOR[c.category ?? "other"] }}>{c.category}</span>
          {c.secondary.map((x) => <span key={x} className={s.chipGhost}>{x}</span>)}
          <span className={s.muted}>significance {c.significance}/5 · confidence {c.confidence}</span>
          <p><span className={s.muted}>Model&rsquo;s rationale ({c.by?.replace("anthropic/", "")}):</span> {c.rationale}</p>
          {WRONG[c.id] && <p className={s.warn}>{WRONG[c.id]}</p>}
        </div>
      )}
    </div>
  );
}

export default function FrankensteinRevisions() {
  const t = data.totals;
  const ck = data.check;
  const pct = (a: number, n: number) => Math.round((a / n) * 100);
  const sizes: [string, { n: number; agree: number }][] = [["small", ck.bySize.small], ["medium", ck.bySize.medium], ["large", ck.bySize.large]];
  const sig = data.bySignificance as Record<string, number>;
  const sigMax = Math.max(...Object.values(sig));
  return (
    <div className={s.wrap}>
      <section className={s.question}>
        <p className={s.kicker}>The question</p>
        <h2>What did Mary Shelley change between the 1818 and 1831 <em>Frankenstein</em>, and how far can a model&rsquo;s sorting of those changes be trusted?</h2>
        <p>Code finds every change; models only interpret them. A deterministic diff of the two Project Gutenberg texts accounts for every sentence of both editions. Then each change is sent to a cheap model with a fixed JSON schema of categories, and the sorting is checked against a stronger model, a reading of 25 passages, and revisions scholars have described.</p>
        <p className={s.links}><a href={FOLDER} target="_blank" rel="noreferrer">The folder on GitHub ↗</a><a href="/examples/frankenstein-revisions/original.html" target="_blank" rel="noreferrer">Open the pipeline&rsquo;s own page (all 550 changes) ↗</a></p>
      </section>

      <section className={s.stats}>
        <Stat n={fmt(t.sentences1818)} label="sentences in 1818" />
        <Stat n={fmt(t.sentences1831)} label="sentences in 1831" />
        <Stat n={fmt(t.sentencesUnchanged)} label="identical in both" />
        <Stat n={fmt(t.changes)} label={`changes: ${data.byRule} punctuation-only by rule, ${data.byModel} sorted by the model, ${data.failures} failed calls`} />
        <Stat n={`${data.known.filter((k) => k.caught).length} of ${data.known.length}`} label="revisions described by scholars, caught by the diff" />
      </section>

      <section className={s.block}>
        <h3>What kind of change</h3>
        <p className={s.note}>Primary category for each of the 550 changes. The categories were chosen before any model ran, from what scholars have asked of the 1831 revision; tone, gender, class, politics and science have no category of their own and land in &ldquo;wording&rdquo; or &ldquo;characterization&rdquo;.</p>
        <CategoryBars />
      </section>

      <section className={s.block}>
        <h3>Where the changes fall</h3>
        <div className={s.claim}>
          <blockquote>&ldquo;{data.shelleyClaim.claim}&rdquo; <cite>Shelley, Introduction, 1831</cite></blockquote>
          <div className={s.claimNums}>
            <Stat n={`${data.shelleyClaim.beginningOfVol1Pct}%`} label="of changed words fall in the four letters and 1818 Vol. I, Chs. I–II" />
            <Stat n={`${data.shelleyClaim.allOfVol1Pct}%`} label="fall in Vol. I" />
          </div>
          <p className={s.note}>Concentrated, not exclusive. (Excluding the new Introduction; {fmt(data.shelleyClaim.wordsChangedTotal)} changed words in all.) Her other claim, that she &ldquo;changed no portion of the story&rdquo;, is contradicted by the barn scene and the Como villa below.</p>
        </div>
        <SectionChart />
      </section>

      <section className={s.block}>
        <h3>How far to trust the sorting</h3>
        <div className={s.trust}>
          <div className={s.trustCol}>
            <p className={s.note}>A seeded random sample of {ck.sampleSize} of the {ck.population} model-sorted changes went to the stronger model, blind to the first answer.</p>
            <Stat n={`${ck.sameCategoryPct}%`} label="same primary category" />
            <Stat n={`${ck.overlappingPct}%`} label="overlap if secondary categories count" />
            <Stat n={`${ck.significanceWithin1Pct}%`} label="significance (1–5) within one point" />
          </div>
          <div className={s.trustCol}>
            <p className={s.note}>Agreement on primary category by size of change.</p>
            {sizes.map(([k, v]) => (
              <div key={k} className={s.agreeRow} title={`${k}: ${v.agree} of ${v.n} agree`}>
                <span>{k} <em>({v.agree} of {v.n})</em></span>
                <span className={s.agreeTrack}><span style={{ width: `${pct(v.agree, v.n)}%` }} /></span>
                <strong>{pct(v.agree, v.n)}%</strong>
              </div>
            ))}
            <p className={s.note}>The large rewritten passages, the ones that matter most, are where the two models agree least.</p>
          </div>
          <div className={s.trustCol}>
            <p className={s.note}>{data.hand.n} of those changes read against the text, with a category for each.</p>
            <Stat n={`${data.hand.agreeCheapPct}%`} label="agree with the cheap model" />
            <Stat n={`${data.hand.agreeStrongPct}%`} label="agree with the stronger model" />
            <p className={s.note}>{data.hand.reader}</p>
          </div>
        </div>
        <div className={s.sigRow}>
          <p className={s.note}>Significance the model gave each change (1 = trivial, 5 = major), all 550:</p>
          <div className={s.sig}>
            {["1", "2", "3", "4", "5"].map((k) => (
              <div key={k} title={`significance ${k}: ${sig[k]} changes`}>
                <span className={s.sigBar}><span style={{ height: `${(sig[k] / sigMax) * 100}%` }} /></span>
                <strong>{sig[k]}</strong><em>{k}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.block}>
        <h3>The revisions scholars describe: {data.known.filter((k) => k.caught).length} of {data.known.length} caught</h3>
        <p className={s.note}>Each looked up by exact phrase, then matched to the change the diff found. Open one to see the passage and the model&rsquo;s label.</p>
        <div className={s.list}>
          {data.known.map((k) => {
            const c = k.changeId ? changes[k.changeId] : null;
            return (
              <details key={k.key} className={s.item}>
                <summary><span className={s.check}>{k.caught ? "✓" : "✗"}</span><span>{k.title}</span>{c && <span className={s.dot} style={{ background: COLOR[c.category ?? "other"] }} title={c.category ?? ""} />}</summary>
                {c && <ChangeBody c={c} />}
              </details>
            );
          })}
        </div>
        <div className={s.fate}>
          <Stat n={String(data.fateWords.count1818)} label="fate words in 1818 (destiny, destined, fate, fatal, doom…)" />
          <Stat n={String(data.fateWords.count1831)} label="in 1831" />
          <p className={s.note}>The &ldquo;more fatalistic 1831&rdquo; that scholars describe lives in a few emphatic passages, not in word frequency.</p>
        </div>
      </section>

      <section className={s.block}>
        <h3>The {data.sig5.length} changes the model rated most significant (5 of 5)</h3>
        <p className={s.note}>One label per change is too few for long rewrites, and rationales can be wrong about the text: read the passage, not just the label. Passages are trimmed here; the full text is on the pipeline&rsquo;s page.</p>
        <div className={s.list}>
          {data.sig5.map((id) => {
            const c = changes[id];
            return (
              <details key={id} className={s.item}>
                <summary><span className={s.dot} style={{ background: COLOR[c.category ?? "other"] }} /><span><b>{c.where1831}</b> · {c.category} · {c.id}</span></summary>
                <ChangeBody c={c} />
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
