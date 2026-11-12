---
title: Sound, made visible
order: 14
index: Play an instrument or vocal clip and watch its frequencies unfold in a live 3D spectrogram. This Next.js version of the Chrome Music Lab experiment lets you compare familiar sounds, draw tones, try microphone input, or drop in an audio file. The earlier saved vocal comparison remains available below.
source: https://github.com/ll-26-27/spectrogram-next
image: /examples/vocal-spectrograms/hero-current.png
---

## What this is

A spectrogram turns sound into a changing picture. Frequency, time, and intensity reveal patterns that are hard to separate by ear: sustained tones, overtones, noisy attacks, and the changing texture of a voice.

This is the current `spectrogram-next` interface, built around the Chrome Music Lab WebGL and audio engine. Select a sound along the bottom—flute, harp, whistling, trombone, drums, birds, modem, wine glass, or the Adele and Billie Eilish clips—and watch it appear. Select the same sound again to stop it. You can also draw tones, choose microphone input, or drop an audio file into the explorer.

The older two-stem comparison is still here under “Earlier vocal comparison.” Its saved plots and measurements are a separate approach: a record you can inspect alongside the live visualizer. The cover image shows the current live explorer playing the flute sample.

## How we made it

**Inputs:** the example audio clips, an optional microphone signal, a dropped audio file, or a tone produced by drawing.

**Operations:** the browser’s audio engine analyzes frequencies while WebGL renders the changing spectrum. The Next.js shell provides the controls around the original Chrome Music Lab engine. This is signal processing and visualization; it does not require a model to generate the picture.

**Outputs:** an interactive spectrogram that connects what you hear to what you see. Sound starts when you select a control. Microphone use requires your browser’s permission; you can explore the supplied sounds without granting it.

We embedded a static build of the current repository in its own frame so its full-screen canvas, styles, and audio lifecycle stay separate from the workshop site. The prior saved-image explorer is preserved as a secondary view, with its original data and measurements.

## Source

- [Current Next.js spectrogram](https://github.com/ll-26-27/spectrogram-next), revision `059ffc1e44f6dbd9b05de06260ef81288546f3a7`.
- The upstream engine retains its Google / Chrome Music Lab Apache 2.0 copyright notices.
- The earlier vocal comparison comes from `bok-learning-lab/spectrogram-demo`; its original methodology is retained in `nextjs/app/examples/vocal-spectrograms/LEGACY-NOTES.md`.
