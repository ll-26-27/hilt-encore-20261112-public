import ExampleFrame from "../ExampleFrame";
import VocalSpectrograms from "./VocalSpectrograms";
import styles from "./live.module.css";

export const metadata = { title: "Sound, made visible" };

export default function Page() {
  return (
    <ExampleFrame slug="vocal-spectrograms">
      <p className={styles.instructions}>Choose a sound along the bottom to begin. Select it again to stop. <a href="/examples/vocal-spectrograms/live/index.html" target="_blank" rel="noreferrer">Open the full-size explorer ↗</a></p>
      <iframe className={styles.frame} src="/examples/vocal-spectrograms/live/index.html" title="Live 3D spectrogram — instruments, voices, and drawn tones" allow="microphone" />
      <details className={styles.earlier}>
        <summary>Earlier vocal comparison: saved spectrograms and measurements</summary>
        <p>These plots and measurements were computed by the original Python pipeline and saved. This view plays the two excerpts against those images; it does not perform live analysis.</p>
        <VocalSpectrograms />
      </details>
    </ExampleFrame>
  );
}
