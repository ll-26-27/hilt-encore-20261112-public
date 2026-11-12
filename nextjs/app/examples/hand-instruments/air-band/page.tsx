import ExampleFrame from "../../ExampleFrame";
import { instrument } from "../instruments";
import { InstrumentFrame, InstrumentNav } from "../parts";

export const metadata = { title: "Air band · Hand instruments" };

// The original static page (public/examples/hand-instruments/play/air-band/), in a frame that may use the camera.
export default function Page() {
  return (
    <ExampleFrame slug="hand-instruments">
      <InstrumentNav current="air-band" />
      <InstrumentFrame inst={instrument("air-band")} />
    </ExampleFrame>
  );
}
