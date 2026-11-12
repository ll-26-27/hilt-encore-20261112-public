---
title: "Rehearse a system for free"
description: "Every agent system gets a rehearsal mode that runs the same wiring with stand-in replies, no model and no cost, so students see the structure before spending anything."
mode: build-with-claude-code
tags: ["agents", "systems", "cost", "design"]
status: draft
---

Every agent system gets a rehearsal mode that runs the same wiring with stand-in replies, no model and no cost, so students see the structure before spending anything.

## How it runs

Before a real run, press Rehearse: the log shows who speaks in what order, when the judge rules, where the router goes, and when producers act, with every line marked "(rehearsal)". Fix the structure, then run it for real.

## With Claude

Ask Claude Code: "Add a rehearsal mode: replace the model call with a function that returns a placeholder in the right format for each role (a judge returns REJECT until the minimum try, a router picks branches in turn), so the whole run and dashboard work with no key."

## Why it works

It separates design from content: students debug the shape of a system first, the way actors walk a scene before the lines.

## Time and materials

Minutes to add; free to run.

## Variations

Any multi-step workflow (a grading pipeline, a research pipeline) can be rehearsed with placeholders before real runs.
