---
title: "A recorded replay so the tool demos anywhere"
description: "For every AI tool you teach with, record one real run and build a replay mode that shows it with no key, no microphone, and no network."
mode: build-with-claude-code
tags: ["demo", "reliability", "teaching-tools", "transparency"]
status: draft
---

For every AI tool you teach with, record one real run and build a replay mode that shows it with no key, no microphone, and no network.

## How it runs

Before class, run the tool once on invented material and save every output. In class (or in a link sent afterward), the replay plays the run at a readable pace: the transcript arriving, the agents taking turns, the briefing at the end. The live mode stays available when a key or device is present.

## With Claude

Ask Claude Code: "Write a script that runs this pipeline once on this sample input and saves every step as JSON; then add a Replay mode to the page that plays the saved steps with timing, and turn on the live mode only when the server reports a key." Building a replay took between fifteen minutes and an hour per tool.

## Why it works

Demos fail in rooms (Wi-Fi, permissions, keys). A replay makes the idea visible every time, and keeping the real outputs, mistakes included, keeps the demo honest.

## Time and materials

An hour per tool; a few cents of model calls to record.

## Variations

Students record a replay of their own project's pipeline for their portfolio; a replay as the evidence attached to a lab report.
