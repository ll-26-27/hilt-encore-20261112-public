import ExampleFrame from "../ExampleFrame";
import styles from "./story.module.css";

export const metadata = { title: "Shot by Shot" };
const src = "https://gened-1049.vercel.app/video-essay/01";

export default function Page() {
  return <ExampleFrame slug="shot-by-shot" showHero={false}>
    <div className={styles.toolbar}><span>Seven shots · scroll to move through the film</span><a href={src} target="_blank" rel="noreferrer">Open the full story ↗</a></div>
    <iframe className={styles.frame} src={src} title="Shot by Shot: a scroll-driven analysis of Zhang Yimou’s To Live" allow="fullscreen" allowFullScreen loading="lazy" />
    <p className={styles.note}>Scroll inside the story to advance the clips. For more room, use its fullscreen button or open the full story.</p>
  </ExampleFrame>;
}
