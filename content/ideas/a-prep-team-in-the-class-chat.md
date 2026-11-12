---
title: "A prep team in the class chat"
description: "A few small AI agents live in a chat channel: one reads whatever a student shares, one asks questions about it, one offers a warm joke or stays quiet, and one writes a briefing only when the student says they're done."
mode: build-with-claude-code
tags: ["agents", "collaboration", "preparation", "chat"]
status: draft
---

A few small AI agents live in a chat channel: one reads whatever a student shares, one asks questions about it, one offers a warm joke or stays quiet, and one writes a briefing only when the student says they're done.

## How it runs

Each student shares material about their project (a voice memo, a photo, a link, notes) in a channel. The agents respond in the thread. When the student types `#done`, the producer agent waits for everything to finish and writes a one-page briefing for whoever will interview them. If a file couldn't be read, it says so and asks whether to go ahead anyway.

## With Claude

Ask Claude Code for a Slack (or Discord) bot in Socket Mode with four roles named for their functions, one shared contract for each item's fields, a finish rule, a per-hour post cap, and a `#retry` command. Each role is a small prompt file.

## Why it works

It meets students where they already talk, makes each agent's job and handoff visible, and shows a finish rule and failure reporting in action.

## Time and materials

About a day to build with Claude Code; runs on a laptop; a chat workspace where you can install an app; cents per student.

## Variations

A reading-group bot that asks one question per shared article; a lab bot that logs observations and writes the weekly summary on `#done`.
