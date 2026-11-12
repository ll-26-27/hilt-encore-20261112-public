import ExampleFrame from "../ExampleFrame";
import Player from "./Player";
import { loadScript } from "./script";

export const metadata = { title: "The interview machine" };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

// Query parameters, for the presenter and for screenshots: ?t=<seconds> starts there, ?play=1 starts playing (voices
// need a click first, browsers' rule), ?ask=1 has already asked the producer, ?file=<path> opens a file from the folder,
// ?card=1 fills the window with the machine alone (for the index card).
export default async function Page({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  const script = await loadScript();
  const t = Math.max(0, Math.min(script.duration, Number(one(q.t)) || 0));
  return (
    <ExampleFrame slug="simulated-interview" recorded="a simulation: invented speakers and a pre-written interview; no microphones, no model calls">
      <Player
        script={script}
        initial={{ t, play: one(q.play) === "1", ask: one(q.ask) === "1", file: one(q.file), card: one(q.card) === "1" }}
      />
    </ExampleFrame>
  );
}
