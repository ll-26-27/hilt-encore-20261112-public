// The shape of manifest.json as written by pipeline/generate.py in spectrogram-demo (copied from its lib/types.ts).
export interface StemMetrics {
  spectral_flatness: number;
  spectral_centroid_hz: number;
  spectral_bandwidth_hz: number;
  harmonic_energy_ratio: number;
  dominant_f0_hz: number;
}

export interface Stem {
  id: string;
  label: string;
  audio: string;
  spectrogram: string;
  spectrogramWithPeaks: string;
  profilePlot: string;
  analysis: string;
  metrics: StemMetrics;
  notes: string;
}

export interface DifferenceMetrics {
  flatness_delta: number;
  bandwidth_delta_hz: number;
  harmonic_energy_ratio_delta: number;
  centroid_delta_hz: number;
}

export interface Comparison {
  id: string;
  a: string;
  b: string;
  overlayImage: string;
  stackedImage: string;
  profileComparison: string;
  differenceMetrics: DifferenceMetrics;
  summary: string;
}

export interface Manifest {
  stems: Stem[];
  comparisons: Comparison[];
}
