---
title: "A live capture wall with AI captions"
description: "Put a shutter button on a live camera feed so every photo students take is saved, shown on a shared wall, and captioned by AI in the vocabulary of the day."
mode: build-with-claude-code
tags: ["media", "feedback", "vocabulary", "documentation", "space"]
status: draft
---

Put a shutter button on a live camera feed so every photo students take is saved, shown on a shared wall, and captioned by AI in the vocabulary of the day.

## How it runs

At a station, students frame a shot and press capture. The still appears on a screen in the room within seconds, with a short AI description using the day's terms (for lighting: where the key light is as a clock position, hard or soft). Afterward the wall is the class's record.

## With Claude

Ask Claude Code: "Build a Next.js page `/capture` that shows a webcam feed with a Capture button that saves stills to `media/<station>/`, and a `/live` page that shows the newest stills, refreshing every ten seconds. After each capture, send the image to a vision model with this station's prompt [paste: 'say where the key light is as a clock position…; no preamble, no praise, no hedging; don't guess who anyone is'] and show the text under the still."

## Why it works

The wall turns everyone's attempts into shared material in real time, and captions written in the day's vocabulary model the language students are learning.

## Time and materials

An hour to build; runs locally on a laptop with a camera. Vision API key (optional).

## Variations

Lab demonstrations; posters in a design critique; handwriting at a whiteboard; specimens under a document camera.
