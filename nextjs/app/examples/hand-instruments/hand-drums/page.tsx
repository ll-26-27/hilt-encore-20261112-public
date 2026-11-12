import ExampleFrame from "../../ExampleFrame";
import { instrument } from "../instruments";
import { InstrumentFrame, InstrumentNav } from "../parts";

export const metadata = { title: "Hand drums · Hand instruments" };

// The original static page (public/examples/hand-instruments/play/hand-drums/), in a frame that may use the camera.
export default function Page() {
  return (
    <ExampleFrame slug="hand-instruments">
      <InstrumentNav current="hand-drums" />
      <InstrumentFrame inst={instrument("hand-drums")} />
    </ExampleFrame>
  );
}
