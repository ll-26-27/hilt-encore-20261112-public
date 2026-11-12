import ExampleFrame from "../ExampleFrame";
import { Chooser } from "./parts";

export const metadata = { title: "Hand instruments" };

// The chooser: one card per instrument, each opening its own page below this one.
export default function Page() {
  return (
    <ExampleFrame slug="hand-instruments">
      <Chooser />
    </ExampleFrame>
  );
}
