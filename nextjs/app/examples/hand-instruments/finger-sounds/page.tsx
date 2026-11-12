import ExampleFrame from "../../ExampleFrame";
import FingerSounds from "../_lib/finger-sounds/FingerSounds";
import { InstrumentNav } from "../parts";
import styles from "../hand-instruments.module.css";

export const metadata = { title: "Finger sounds · Hand instruments" };

export default function Page() {
  return (
    <ExampleFrame slug="hand-instruments">
      <InstrumentNav current="finger-sounds" />
      <div className={styles.reactWrap}>
        <FingerSounds />
      </div>
    </ExampleFrame>
  );
}
