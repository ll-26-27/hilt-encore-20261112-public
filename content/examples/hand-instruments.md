---
title: Hand instruments
order: 2
index: Instruments you play with your hands in front of a webcam, built by our undergraduate fellows in an afternoon, then given to a class the next day.
source: https://github.com/tdm155ai/tdm155ai-week-10
image: ""
---

## What this is

Hand drums, finger sounds, a gesture camera, Blobs, and an Air Band, where up to five people stand in front of one webcam and play trumpet, piano, guitar, drums, and a filter by moving their hands. They use MediaPipe's tracking in a web browser, with nothing to install. The Learning Lab's undergraduate fellows made them on November 9 and 10, playing with what a camera can do as an instrument; four people played the Air Band together on the 10th. The next morning they became the starting point for our course's week on installations: launching sound, video, and light for a live audience.

## How we made it

The fellows each sat down with Claude Code and asked for an instrument in plain words, roughly "make a trumpet sound when I make the trumpet motion on camera." The Air Band took one session of about an hour and a half. Most of the time on the hand drums went into tuning the detection, because a pinch triggered too easily. On the morning of class, an agent ported the five experiments into the class app, beside a set of simpler instruments (a hand fader, a pinch, mouth open, arms up) that students could open and change. What went wrong in the port: two of them showed errors until the hand model was loaded from a CDN, the hand model had to move to the GPU, and one, Blobs, got glitchy and was rebuilt lighter.

## Source

- The class app, TDM 155AI week 10 (runs locally): https://github.com/tdm155ai/tdm155ai-week-10
- The fellows' experiments: https://github.com/tdm155ai/tdm155ai-week-10/blob/main/nextjs/content/fellows.md
