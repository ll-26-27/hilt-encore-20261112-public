import ExampleFrame from "../ExampleFrame";
import Calendar from "./Calendar";
import styles from "./reflection.module.css";
export const metadata = { title: "Course reflection" };
export default function Page() { return <ExampleFrame slug="course-reflection" showHero={false}>
  <Calendar />
  <div className={styles.workflow}>
    <div><h3>Inputs: keep the traces</h3><p>Session transcriptions, our handwritten notes, revised plans and the materials we actually made. Each captures a different part of the teaching.</p></div>
    <div><h3>Operations: read across the record</h3><p>Organize by session, align plans with transcripts, and follow recurring activities across weeks. Keep an observation separate from an intention or a later explanation.</p></div>
    <div><h3>Outputs: something to reflect with</h3><p>A calendar we can inspect together, discrepancies we can return to, and better questions for the next iteration: where did setup displace practice, and which examples helped people find their own work?</p></div>
  </div>
</ExampleFrame>; }
