---
title: Vocal spectrogram explorer
order: 22
index: "Two isolated vocal stems, Adele and Billie Eilish, played over their own spectrograms. Turn on the pitch contour, read what five measurements say about each voice, or put the two side by side with an overlay, difference metrics and a one-line summary."
source: ""
image: "/examples/vocal-spectrograms/images/adele_vs_billie-eilish_stacked.png"
---

## What this is

A spectrogram shows a sound as a picture: time runs left to right, pitch runs bottom to top, and brightness is loudness. A sung note appears as a stack of bright horizontal lines, its fundamental at the bottom and its overtones above it.

The explorer holds two vocal stems, a 9.8-second excerpt of Adele and a 19.2-second excerpt of Billie Eilish, isolated from their backing tracks by the Learning Lab. In **Single** mode, press play and a playhead moves across the spectrogram; click anywhere on the image to jump there. **F0 Contour** swaps in a copy with the detected fundamental pitch drawn in green. **Vocal Analysis** lists five measurements for the stem (fundamental frequency, tonal clarity, harmonic strength, brightness, overtone spread), each with a scale, a sentence on what the value means, and a note on what is being measured.

In **Compare** mode the two stems sit side by side, each with its own player. Below them: an overlay of both spectrograms (Adele in red, Billie Eilish in blue), the differences between their measurements, a one-sentence summary, and both sets of measurements.

The images, measurements and summary were all computed in advance and saved. The page plays the audio and shows the pictures.

## How we made it

One Python script, `pipeline/generate.py`, does the analysis with librosa and matplotlib. It takes the two source files (24-bit, 48 kHz stereo WAVs), converts each to 16-bit mono at 22,050 Hz for the browser, and then makes, per stem:

- a mel spectrogram (2,048-sample FFT, 512-sample hop, 128 mel bands up to 8 kHz, drawn edge to edge with no axes, in the "magma" colormap);
- the same spectrogram with the fundamental pitch traced by pYIN (searching C2 to C7) drawn on top;
- an average spectral profile plot;
- five numbers: spectral flatness, centroid and bandwidth (each averaged over time), the median pitch of the voiced frames, and the share of energy in the harmonic part after librosa's harmonic/percussive separation;
- a frame-by-frame JSON file with the pitch and the five strongest frequency bins every 23 milliseconds.

For each pair of stems it then draws the overlay, a stacked pair of spectrograms on a shared time axis, and a profile comparison, subtracts one stem's numbers from the other's, and writes the summary from three if/else rules (lower flatness is "more tonally pure," higher bandwidth is "wider overtone spread," higher harmonic ratio is "stronger harmonic structure"). Everything is listed in a `manifest.json` that the interface reads. The interface is a Next.js page built from seven small components and an audio hook; the explanations in the Vocal Analysis panel and the thresholds behind each sentence are written into the interface, not computed. Pipeline and interface went in as a single commit on March 26, 2026, co-authored with Claude Opus 4.6. The repository's README is the unedited project template, so nothing else about the process is recorded.

What went wrong, or is worth knowing:

- The stems are different lengths. The comparison images pad the shorter one with silence, so in the overlay and the stacked image Adele occupies only the first half.
- The stem names come from the file names, which is why the interface says "Billie-Eilish."
- The descriptive sentences change at fixed lines. Adele's median pitch is 406 Hz and Billie Eilish's is 394 Hz; with a cutoff at 400 Hz, one is described as "very high register, likely head voice or falsetto" and the other as "soprano/mezzo range."
- The frame-by-frame JSON, the single-stem profile plots, the profile comparison and the stacked image are generated but not shown in the interface (the profile comparison is switched off in the code). The stacked image is used here as the card.
- The working copy holds a later, uncommitted revision: the pipeline switched to a linear-frequency spectrogram (4,096-sample FFT, 256-sample hop, "inferno" colormap, higher resolution) and the page dropped the Vocal Analysis and Diff Metrics panels. Its images, about 3 MB each, and two further full-length stems were never committed. Why it stopped there is not recorded. This page ports the committed version.
- How the stems were separated is not recorded in the repository.

## Source

The repository is `bok-learning-lab/spectrogram-demo` (private): `pipeline/generate.py` for the analysis, `apps/interface/` for the explorer. The audio, images and data on this page are its committed `apps/interface/public/assets`, copied unchanged.
