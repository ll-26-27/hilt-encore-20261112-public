import ExampleFrame from "../ExampleFrame";
import Playthrough from "./Playthrough";

export const metadata = { title: "GENED 1196: a practice run" };
export default function Page() {
  return <ExampleFrame slug="gened1196" showHero={false}><Playthrough /></ExampleFrame>;
}
