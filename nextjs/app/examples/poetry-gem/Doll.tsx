// The paper doll from poetry-gem (app/doll/Doll.tsx), ported: nine Midjourney costume plates cut at the neck and hip
// and pinned to one skeleton (manifest.json), so any head sits on any torso on any legs. Legs are shifted to meet
// their torso's hip. Images are the cut .webp pieces from poetry-gem's public/doll/mj, unchanged.
/* eslint-disable @next/next/no-img-element -- stacked transparent layers */

import manifest from "./manifest.json";

export type Band = "head" | "torso" | "legs";
export const BAND_ORDER: Band[] = ["head", "torso", "legs"];
export type PlateSpec = Record<Band, string>;

// Which plate plays which part, as in poetry-gem's CASTING (meaning-based retrieval's legs, mj15, are not used here).
export const CASTING: Record<Band, Record<string, string>> = {
  head: { ghazal: "mj15", haiku: "mj13", sonnet: "mj16" },
  torso: { phaedrus: "mj15", frankenstein: "mj16", analects: "mj18", none: "mj12" },
  legs: { full: "mj18", lexical: "mj14", agentic: "mj12" },
};

export const PLATES = Object.keys(manifest.figures);
const [W, H] = manifest.canvas;
export const FOLDS = { neck: manifest.neck[1] / H, hip: manifest.hip[1] / H };

type Box = [number, number, number, number];
const figures = manifest.figures as unknown as Record<string, { hipDx: number; bbox: Record<Band, Box> }>;
const SRC = "/examples/poetry-gem/mj";

export function cast(spec: Record<Band, string>): PlateSpec {
  return { head: CASTING.head[spec.head], torso: CASTING.torso[spec.torso], legs: CASTING.legs[spec.legs] };
}

const layer: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  filter: "drop-shadow(1.5px 2.5px 2px rgba(50, 35, 20, .28))",
};

/** The layered figure. crop "frame" keeps a steady frame (the area any figure can occupy) while parts are swapped. */
export function PlateFigure({
  plates,
  crop = "frame",
  className,
  title,
  children,
}: {
  plates: PlateSpec;
  crop?: "none" | "frame";
  className?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const dx = (figures[plates.torso]?.hipDx ?? 0) / W;
  const [x0, y0, x1, y1]: Box = crop === "frame" ? (manifest.bounds as Box) : [0, 0, 1, 1];
  const cw = x1 - x0;
  const ch = y1 - y0;
  return (
    <div
      className={className}
      role="img"
      aria-label={title ?? "A paper doll"}
      style={{ position: "relative", aspectRatio: `${cw * W} / ${ch * H}`, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          width: `${100 / cw}%`,
          height: `${100 / ch}%`,
          left: `${(-x0 / cw) * 100}%`,
          top: `${(-y0 / ch) * 100}%`,
        }}
      >
        <img src={`${SRC}/legs-${plates.legs}.webp`} alt="" style={{ ...layer, transform: `translateX(${dx * 100}%)` }} />
        <img src={`${SRC}/torso-${plates.torso}.webp`} alt="" style={layer} />
        <img src={`${SRC}/head-${plates.head}.webp`} alt="" style={layer} />
        {children}
      </div>
    </div>
  );
}
