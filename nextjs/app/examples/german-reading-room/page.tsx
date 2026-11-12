import ExampleFrame from "../ExampleFrame";
import styles from "../embedded.module.css";
export const metadata = { title: "German reading room" };
const src = "/example-assets/reading-room/outputs/index.html";
export default function Page() { return <ExampleFrame slug="german-reading-room" showHero={false} recorded="saved German readings and two English translations, with disagreements marked for a person to review.">
  <div className={styles.toolbar}><span>Scan · transcription · translation</span><a href={src} target="_blank" rel="noreferrer">Open full reading room ↗</a></div>
  <iframe className={`${styles.frame} ${styles.reader}`} src={src} title="German reading room: three scans with transcription and translation" />
  <p className={styles.note}>Review notes stay in this browser. Use “Export log” in the reading room to save a copy. This site does not send your edits back to the research project.</p>
</ExampleFrame>; }
