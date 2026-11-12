---
title: "Cues from meaning"
description: "While someone talks freely, a model listens and, from what they mean rather than exact keywords, decides which slide, image, or sound to bring up."
mode: build-with-claude-code
tags: ["voice", "agents", "performance", "lecture"]
status: draft
---

While someone talks freely, a model listens and, from what they mean rather than exact keywords, decides which slide, image, or sound to bring up.

## How it runs

The instructor lists ten possible cues with a one-line description each. A student improvises a two-minute talk; the model fires cues when the talk turns to their topics. Afterward, compare the model's choices with what the student intended.

## With Claude

Ask Claude Code: "Stream speech-to-text; every few seconds send the last sentences and the cue list to a fast model, ask which cue (or none) fits now, and fire it if the confidence is high and it hasn't fired in the last 20 seconds. Log every decision." For a demo without a key, record one session and replay its decisions.

## Why it works

It raises the question of what it means for a machine to follow meaning, and where a human operator still has to decide.

## Time and materials

An afternoon to build; a model key (realtime transcription plus small decision calls).

## Variations

A lecture where the relevant figure appears as it's discussed; an improvised theater piece with a sound designer agent.
