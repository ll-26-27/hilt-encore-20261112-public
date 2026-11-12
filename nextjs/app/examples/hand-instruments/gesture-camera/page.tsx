import ExampleFrame from "../../ExampleFrame";
import GestureCamera from "../_lib/gesture-camera/GestureCamera";
import { InstrumentNav } from "../parts";
import styles from "../hand-instruments.module.css";

export const metadata = { title: "Gesture camera · Hand instruments" };

export default function Page() {
  return (
    <ExampleFrame slug="hand-instruments">
      <InstrumentNav current="gesture-camera" />
      <div className={styles.reactWrap}>
        <GestureCamera />
      </div>
    </ExampleFrame>
  );
}
