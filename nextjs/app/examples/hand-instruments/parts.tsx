import Link from "next/link";
import { INSTRUMENTS, type Instrument } from "./instruments";
import styles from "./hand-instruments.module.css";

// The cards on /examples/hand-instruments: one per instrument.
export function Chooser() {
  return (
    <div className={styles.chooser}>
      <p className={styles.note}>
        Choose an instrument. Each needs a webcam and works best in Chrome. The camera starts only when you press Start;
        the hand tracking (MediaPipe) runs in this browser, and nothing is recorded or sent.
      </p>
      <div className={styles.cards}>
        {INSTRUMENTS.map((inst) => (
          <Link key={inst.slug} href={`/examples/hand-instruments/${inst.slug}`} className={styles.card}>
            <span className={styles.glyph} aria-hidden="true">{inst.glyph}</span>
            <strong>{inst.title}</strong>
            <span className={styles.what}>{inst.what}</span>
            <ul>
              {inst.how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <span className={styles.play}>Play →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// The tabs above an instrument: back to the chooser, or across to another instrument.
export function InstrumentNav({ current }: { current: string }) {
  return (
    <nav className={styles.tabs} aria-label="Hand instruments">
      <Link href="/examples/hand-instruments">All instruments</Link>
      {INSTRUMENTS.map((inst) => (
        <Link key={inst.slug} href={`/examples/hand-instruments/${inst.slug}`} aria-current={inst.slug === current ? "page" : undefined}>
          <span aria-hidden="true">{inst.glyph}</span> {inst.title}
        </Link>
      ))}
    </nav>
  );
}

// An instrument that was a static page in the original: shown in a frame that may use the camera.
export function InstrumentFrame({ inst }: { inst: Instrument }) {
  if (!inst.frame) return null;
  return (
    <div className={styles.framed}>
      <iframe
        className={styles.frame}
        src={inst.frame.src}
        title={inst.title}
        style={{ height: inst.frame.height }}
        allow="camera; autoplay; fullscreen"
      />
      <p className={styles.under}>
        Click inside the frame first if you want to use the keyboard. <a href={inst.frame.src} target="_blank" rel="noreferrer">Open it on its own ↗</a> (best for full screen).
      </p>
    </div>
  );
}
