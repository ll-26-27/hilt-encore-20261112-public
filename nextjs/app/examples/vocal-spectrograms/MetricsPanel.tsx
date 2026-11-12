import type { StemMetrics } from "./types";
import s from "./vocal-spectrograms.module.css";

// The explanations and thresholds are the original app's (components/spectrogram/MetricsPanel.tsx), unchanged:
// what each metric measures, a 0–1 scale for the bar, and a sentence for the value's range.
const METRICS: {
  key: keyof StemMetrics;
  title: string;
  what: string;
  lowLabel: string;
  highLabel: string;
  normalize: (v: number) => number;
  describe: (v: number) => string;
  format: (v: number) => string;
}[] = [
  {
    key: "dominant_f0_hz",
    title: "Fundamental Frequency (F0)",
    what: "The base pitch of the voice — the lowest note the vocal cords are producing. Everything else is built on top of this.",
    lowLabel: "Low voice",
    highLabel: "High voice",
    normalize: (v) => Math.min(1, Math.max(0, (v - 80) / (500 - 80))),
    describe: (v) => {
      if (v < 165) return "Bass/baritone range. Deep, grounded vocal production.";
      if (v < 260) return "Alto/tenor range. Middle of the vocal spectrum.";
      if (v < 400) return "Soprano/mezzo range. Higher vocal placement.";
      return "Very high register. Likely head voice or falsetto.";
    },
    format: (v) => `${v.toFixed(0)} Hz`,
  },
  {
    key: "spectral_flatness",
    title: "Tonal Clarity",
    what: "How \"pure\" vs \"breathy\" the voice sounds. A perfectly clean note (like a tuning fork) scores near 0. Breath, whisper, and noise push it higher.",
    lowLabel: "Pure tone",
    highLabel: "Breathy / noisy",
    normalize: (v) => Math.min(1, v / 0.15),
    describe: (v) => {
      if (v < 0.01) return "Extremely clean signal. Almost no breathiness — the voice is producing a very focused, pure tone.";
      if (v < 0.03) return "Clean and controlled. Minimal breathiness — the sound energy is concentrated in distinct pitches.";
      if (v < 0.06) return "Some breathiness present. The voice mixes clear tone with audible air, giving it a softer, more intimate quality.";
      return "Significant breathiness. A lot of air is moving through the vocal cords alongside the pitched tone, creating a wispy, intimate texture.";
    },
    format: (v) => v.toFixed(4),
  },
  {
    key: "harmonic_energy_ratio",
    title: "Harmonic Strength",
    what: "What fraction of the sound is pitched (harmonic) vs unpitched (noise, breath, consonants). Higher = the voice rings clearly. Lower = more texture and air.",
    lowLabel: "Airy / textured",
    highLabel: "Resonant / ringing",
    normalize: (v) => v,
    describe: (v) => {
      if (v > 0.85) return "Very strong harmonic structure. The voice is resonant and ringing — most of the energy is in clean, pitched overtones.";
      if (v > 0.7) return "Solid harmonic presence. The voice clearly projects pitched content with some natural texture.";
      if (v > 0.5) return "Mixed signal. About half the energy is pitched, half is texture — common in breathy or stylistically rough vocals.";
      return "Low harmonic content. The sound is dominated by noise and texture rather than clear pitch.";
    },
    format: (v) => `${(v * 100).toFixed(0)}%`,
  },
  {
    key: "spectral_centroid_hz",
    title: "Brightness",
    what: "The \"center of gravity\" of the frequency spectrum. A dark, warm voice has a low centroid. A bright, cutting voice has a high one.",
    lowLabel: "Dark / warm",
    highLabel: "Bright / forward",
    normalize: (v) => Math.min(1, Math.max(0, (v - 500) / (4000 - 500))),
    describe: (v) => {
      if (v < 800) return "Very dark timbre. The energy sits low — warm, round, and mellow.";
      if (v < 1500) return "Warm to neutral. A natural-sounding vocal tone without excessive brightness.";
      if (v < 2500) return "Moderately bright. Energy is spread across the mid-range — the voice has presence and clarity.";
      return "Very bright. High-frequency energy dominates — the voice cuts through and sounds forward, almost sibilant.";
    },
    format: (v) => `${v.toFixed(0)} Hz`,
  },
  {
    key: "spectral_bandwidth_hz",
    title: "Overtone Spread",
    what: "How wide the frequency range of the voice is. A narrow bandwidth means energy is focused around the fundamental. A wide one means lots of overtones and harmonics ringing out above and below.",
    lowLabel: "Focused / clean",
    highLabel: "Rich / complex",
    normalize: (v) => Math.min(1, Math.max(0, (v - 300) / (4000 - 300))),
    describe: (v) => {
      if (v < 600) return "Very focused. The voice energy is concentrated in a narrow band — clean, simple, almost sine-wave-like.";
      if (v < 1200) return "Moderate spread. A healthy range of overtones, but the voice still sounds centered and controlled.";
      if (v < 2500) return "Wide overtone spread. The voice activates many frequencies simultaneously — it sounds rich, complex, and full.";
      return "Very broad frequency range. Energy is distributed across a huge range of frequencies — dense, complex texture with many competing overtones.";
    },
    format: (v) => `${v.toFixed(0)} Hz`,
  },
];

export function MetricsPanel({ metrics }: { metrics: StemMetrics }) {
  return (
    <div className={s.stack}>
      <h3 className={s.eyebrow}>Vocal Characteristics</h3>
      <div className={s.metricList}>
        {METRICS.map(({ key, title, what, lowLabel, highLabel, normalize, describe, format }) => {
          const val = metrics[key];
          const pct = normalize(val);
          return (
            <div key={key} className={s.metric}>
              <div className={s.metricHead}>
                <span className={s.metricTitle}>{title}</span>
                <span className={s.mono}>{format(val)}</span>
              </div>
              <div>
                <div className={s.scale}>
                  <div className={s.scaleFill} style={{ width: `${Math.max(2, pct * 100)}%` }} />
                  <div className={s.scaleDot} style={{ left: `calc(${pct * 100}% - 5px)` }} />
                </div>
                <div className={s.scaleLabels}><span>{lowLabel}</span><span>{highLabel}</span></div>
              </div>
              <p className={s.describe}>{describe(val)}</p>
              <details className={s.what}>
                <summary>What does this measure?</summary>
                <p>{what}</p>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
