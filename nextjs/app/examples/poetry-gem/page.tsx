import ExampleFrame from "../ExampleFrame";
import Corpse from "./Corpse";
import PoetryGem from "./PoetryGem";
import s from "./poetry-gem.module.css";

export const metadata = { title: "Poetry Gem: dress the agent" };

export default function Page() {
  return (
    <ExampleFrame
      slug="poetry-gem"
      recorded="in class (Oct 20, 2026) the replies came live from Claude through the app's API route; the replies here were pre-written by Claude (Claude Code, Opus 5.5) on Nov 12, 2026 from the same assembled prompts. The doll, the meter and “what the model saw” run in your browser."
    >
      <PoetryGem />
      <h2 style={{ marginTop: 56 }}>Exquisite corpse</h2>
      <p className={s.muted} style={{ maxWidth: 760 }}>
        The app&rsquo;s second doll page: the same nine plates, cut at the neck and the hip and pinned to a shared skeleton,
        recombined freely. Legs go down first, the torso is laid over them, the head on top.
      </p>
      <Corpse />
    </ExampleFrame>
  );
}
