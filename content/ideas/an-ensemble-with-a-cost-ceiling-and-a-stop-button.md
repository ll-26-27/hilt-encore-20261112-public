---
title: "An ensemble with a cost ceiling and a stop button"
description: "Every multi-agent run has a visible running cost, a ceiling it can't pass, and a Stop button that ends it after the current call."
mode: build-with-claude-code
tags: ["agents", "cost", "systems", "responsibility"]
status: draft
---

Every multi-agent run has a visible running cost, a ceiling it can't pass, and a Stop button that ends it after the current call.

## How it runs

Students set the ceiling themselves before a run (ten cents, fifty cents) and watch the cost climb on the dashboard. When a system loops or rambles, they press Stop and read why.

## With Claude

Ask Claude Code to track the cost OpenRouter (or the API) reports for each call, show it as a running total, refuse the next call past the ceiling, and end the run with a stop event saying why.

## Why it works

Students learn that agents cost something and can run away, and they practice setting limits on a system they built.

## Time and materials

Minutes to add; small model costs.

## Variations

Token budgets for essays written with AI; time budgets for an AI research assistant.
