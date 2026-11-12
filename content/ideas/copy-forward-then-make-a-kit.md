---
title: "Copy forward, then make a kit"
description: "Build each new class tool by copying the last one and changing it; once a piece has been copied twice, save its best version as a kit with its history."
mode: build-with-claude-code
tags: ["course design", "reuse", "tools", "documentation"]
status: draft
---

Build each new class tool by copying the last one and changing it; once a piece has been copied twice, save its best version as a kit with its history.

## How it runs

Keep every session's tools. When a new session needs something similar, copy the previous version and adapt it. When you notice you've copied the same piece a second time, move its best version into a kits folder with a README that records where it came from, every version, and where it has been used.

## With Claude

Ask Claude Code: "Copy the capture page from last week's repo into this one and change it for <new activity>." When making a kit: "Make kits/<name>/ from the best version of this piece, with a README that records its source repos, versions, and uses, and a SKILL.md that explains how to install it in a new app." When the copies have drifted (GH): Ask Claude Code: "Compare the three copies of this tool in these repos, merge the best of each into kits/<name>/, write the README with its history, and a SKILL.md that tells Claude how to install it into a Next app."

## Why it works

Copying keeps each class tool fitted to its room, and the kit keeps improvements from getting lost; the pool of previous references is what makes the next tool fast.

## Time and materials

Minutes per copy; a kits repository.

## Variations

Kits of prompts, handouts, rubrics, or activity cards, not only code.
