---
title: "One stage, many triggers"
description: "Build one output (a stage window) and let students wire any input to it: a key, a MIDI pad, a spoken word, a hand in a camera zone, a box drawn on paper."
mode: build-with-claude-code
tags: ["space", "performance", "systems", "collaboration", "making"]
status: draft
---

Build one output (a stage window) and let students wire any input to it: a key, a MIDI pad, a spoken word, a hand in a camera zone, a box drawn on paper.

## How it runs

The stage and its cue format are fixed. Each rotation, students try a different input that fires the same cues, then pick one to build their performance around. The debrief compares what fired reliably, what needed a human operator, and one change for next time.

## With Claude

Ask Claude Code to write the stage contract once (a README with the cue format and a `fireCue()` function), then one small page per input, each with one file students edit (`buttons.js`, `midi-map.js`, `triggers.js`, `cues.js`). New inputs are a new page that calls `fireCue()`.

## Why it works

A shared contract lets a room of students build different things that all work together, and it makes the comparison between inputs a real one.

## Time and materials

A day to build the set; a class period to run; MIDI controller and webcam optional (on-screen pads and typed words as fallbacks).

## Variations

A data-visualization class with one chart and many data sources; a music class with one synth and many controllers.
