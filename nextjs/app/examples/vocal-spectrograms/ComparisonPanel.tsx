import type { Comparison } from "./types";
import s from "./vocal-spectrograms.module.css";

export function ComparisonPanel({ comparison, showOverlay, showProfiles, showMetrics, showSummary }: {
  comparison: Comparison;
  showOverlay: boolean;
  showProfiles: boolean;
  showMetrics: boolean;
  showSummary: boolean;
}) {
  const dm = comparison.differenceMetrics;
  const signed = (v: number, digits: number, unit = "") => `${v > 0 ? "+" : ""}${v.toFixed(digits)}${unit}`;
  return (
    <div className={s.stack}>
      {showOverlay && (
        <div className={s.stackTight}>
          <h3 className={s.eyebrow}>Overlay Comparison</h3>
          <div className={s.imageBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={comparison.overlayImage} alt="Both stems' spectrograms drawn over each other, the first in red and the second in blue" className={s.img} />
          </div>
        </div>
      )}

      {showProfiles && (
        <div className={s.stackTight}>
          <h3 className={s.eyebrow}>Spectral Profile Comparison</h3>
          <div className={s.imageBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={comparison.profileComparison} alt="Average spectral profiles of both stems" className={s.img} />
          </div>
        </div>
      )}

      {showMetrics && (
        <div className={s.stackTight}>
          <h3 className={s.eyebrow}>Difference Metrics</h3>
          <div className={s.diffGrid}>
            <DiffMetric label="Flatness Delta" value={dm.flatness_delta} fmt={(v) => v.toFixed(4)} />
            <DiffMetric label="Bandwidth Delta" value={dm.bandwidth_delta_hz} fmt={(v) => signed(v, 1, " Hz")} />
            <DiffMetric label="Harmonic Ratio Delta" value={dm.harmonic_energy_ratio_delta} fmt={(v) => signed(v, 2)} />
            <DiffMetric label="Centroid Delta" value={dm.centroid_delta_hz} fmt={(v) => signed(v, 1, " Hz")} />
          </div>
        </div>
      )}

      {showSummary && comparison.summary && (
        <div className={s.card}><p className={s.summary}>{comparison.summary}</p></div>
      )}
    </div>
  );
}

function DiffMetric({ label, value, fmt }: { label: string; value: number; fmt: (v: number) => string }) {
  return (
    <div className={s.card}>
      <span className={s.small}>{label}</span>
      <p className={`${s.mono} ${value > 0 ? s.pos : value < 0 ? s.neg : ""}`}>{fmt(value)}</p>
    </div>
  );
}
