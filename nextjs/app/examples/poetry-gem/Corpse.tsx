"use client";

import { useState } from "react";
import { FOLDS, PLATES, PlateFigure, type Band, type PlateSpec } from "./Doll";
import s from "./poetry-gem.module.css";

// poetry-gem's /doll/corpse, ported: the nine plates recombined freely, with the parlour game's folds.
const BANDS: Band[] = ["head", "torso", "legs"];
const LABEL: Record<Band, string> = { head: "Head", torso: "Torso", legs: "Legs" };

function shuffled(): PlateSpec {
  const pick = () => PLATES[Math.floor(Math.random() * PLATES.length)];
  return { head: pick(), torso: pick(), legs: pick() };
}

function Figure({ spec, folded }: { spec: PlateSpec; folded?: Set<Band> }) {
  const { neck, hip } = FOLDS;
  return (
    <PlateFigure plates={spec} crop="none" className={s.figure}>
      {folded?.has("head") && <div className={s.fold} style={{ top: 0, height: `${(neck + 0.02) * 100}%` }} />}
      {folded?.has("torso") && <div className={s.fold} style={{ top: `${(neck + 0.02) * 100}%`, height: `${(hip - neck) * 100}%` }} />}
      {folded?.has("legs") && <div className={s.fold} style={{ top: `${(hip + 0.02) * 100}%`, bottom: 0 }} />}
    </PlateFigure>
  );
}

export default function Corpse() {
  const [spec, setSpec] = useState<PlateSpec>({ head: PLATES[3], torso: PLATES[7], legs: PLATES[0] });
  const [game, setGame] = useState<Set<Band> | null>(null);
  const step = (band: Band, dir: number) =>
    setSpec((p) => ({ ...p, [band]: PLATES[(PLATES.indexOf(p[band]) + dir + PLATES.length) % PLATES.length] }));
  const reveal = () =>
    setGame((g) => {
      if (!g) return g;
      const next = new Set(g);
      const first = BANDS.find((b) => next.has(b));
      if (first) next.delete(first);
      return next.size ? next : null;
    });

  return (
    <div className={s.root}>
      <div className={s.corpseStage}>
        <div className={s.corpseControls}>
          {BANDS.map((band) => (
            <div key={band} className={s.control}>
              <span>{LABEL[band]}</span>
              <button onClick={() => step(band, -1)} aria-label={`Previous ${band}`}>‹</button>
              <code>{game?.has(band) ? "?" : spec[band].replace("mj", "")}</code>
              <button onClick={() => step(band, 1)} aria-label={`Next ${band}`}>›</button>
            </div>
          ))}
          <div className={s.buttons}>
            <button className={s.primary} onClick={() => setSpec(shuffled())}>Shuffle</button>
            {game ? (
              <button className={s.primary} onClick={reveal}>Unfold the next part</button>
            ) : (
              <button onClick={() => { setSpec(shuffled()); setGame(new Set(BANDS)); }}>Play the game (fold &amp; reveal)</button>
            )}
          </div>
          <p className={s.muted}>
            In the parlour game each player draws one part on a folded sheet without seeing the others. Here the folds hide
            the parts until you open them, top to bottom. Nine plates, so {PLATES.length ** 3} possible figures.
          </p>
        </div>
        <div className={s.corpsePlate}>
          <Figure spec={spec} folded={game ?? undefined} />
          <div className={s.corpseCaption}>
            <span>Cadavre exquis</span>
            <span>{spec.head.replace("mj", "")} · {spec.torso.replace("mj", "")} · {spec.legs.replace("mj", "")}</span>
          </div>
        </div>
      </div>
      <h4 className={s.subhead}>The nine plates, as cut</h4>
      <div className={s.wall}>
        {PLATES.map((id) => (
          <button key={id} className={s.tile} onClick={() => { setGame(null); setSpec({ head: id, torso: id, legs: id }); }}>
            <Figure spec={{ head: id, torso: id, legs: id }} />
            <small>{id}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
