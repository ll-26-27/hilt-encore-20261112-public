---
title: "Plant a file the AI can't read"
description: "When testing any AI pipeline, include one item it can't possibly handle and check that it says so instead of pretending."
mode: build-with-claude-code
tags: ["testing", "reliability", "agents", "verification"]
status: draft
---

When testing any AI pipeline, include one item it can't possibly handle and check that it says so instead of pretending.

## How it runs

Add an unreadable file (random bytes with an odd extension) to the materials. Run the pipeline. Did it report the failure, stop before the final step, and name what wasn't read in the result?

## With Claude

Ask Claude Code: "Every item gets a status per step: waiting, running, done, failed, skipped. The final step refuses to run while an item has failed, unless I say go ahead anyway; then the result lists what wasn't read." Test with a `mystery.bin`.

## Why it works

It teaches students to test for honest failure, which is what makes an AI tool trustworthy.

## Time and materials

Five minutes per test.

## Variations

A blurry photo for a transcription tool; a silent recording for a dictation tool; a PDF of images for a reader.
