---
title: "Rebuild a black-box AI app in code"
description: "Take a popular all-in-one AI app and rebuild one of its steps with plain scripts, showing the command each step runs."
mode: build-with-claude-code
tags: ["tools", "black-box", "making", "media"]
status: draft
---

Take a popular all-in-one AI app and rebuild one of its steps with plain scripts, showing the command each step runs.

## How it runs

Pick an app students know (an AI video maker, a slide generator). Identify the steps it hides (reference image, character sheet, still, video). Rebuild each step as a script call to a model API, with the exact command shown next to each result. Students run it on their own image.

## With Claude

Ask Claude Code: "Write `generate-video.mjs` that takes a reference image and a prompt, calls a video model API, and saves the clip; then build a page that runs it from a form and shows the equivalent command under each result."

## Why it works

"We know it's all just API calls … under the hood. We can take it apart into its bits, understand how it's made, and remake something like that ourselves." Students see what the product adds and what it hides.

## Time and materials

An hour to build; 20 minutes in class. API keys.

## Variations

Rebuild a citation tool, a summarizer, a flashcard app.
