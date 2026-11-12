import ExampleFrame from "../ExampleFrame";
import PhaedrusWalk from "./PhaedrusWalk";

export const metadata = { title: "Walking the Phaedrus" };

export default function Page() {
  return (
    <ExampleFrame slug="phaedrus-walk" recorded="the folder's saved data of 2026-11-03 (passages cut by script, topography researched by Claude Code with sources, coordinates from OpenStreetMap), drawn here without map tiles.">
      <PhaedrusWalk />
    </ExampleFrame>
  );
}
