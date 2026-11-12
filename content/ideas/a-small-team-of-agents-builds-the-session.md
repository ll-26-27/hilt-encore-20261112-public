---
title: "A small team of agents builds the session"
description: "Prepare a class session's materials with several AI coding agents working in parallel, each with a written brief and its own files, while you direct them from one place."
mode: build-with-claude-code
tags: ["agents", "orchestration", "course design", "planning"]
status: draft
---

Prepare a class session's materials with several AI coding agents working in parallel, each with a written brief and its own files, while you direct them from one place.

## How it runs

Write a short board: the session's goal, the pieces needed (the handout, a glossary, a tool, research notes), and who owns which files. Start one agent per piece with its brief. Check in on each, answer questions, and merge their work. Keep the board and briefs in the session folder as the record of how the materials were made.

## With Claude

Run several Claude Code sessions side by side (separate terminal panes or windows), each started with a brief: "You own docs/glossary/. Write a glossary of these terms for students; do not edit other folders; tell me when done." One lead session integrates and commits. Within a single session, Claude Code can also dispatch subagents for parallel research ("use subagents to research each of these five topics and write one file each").

## Why it works

It lets one instructor prepare far richer materials than they could alone, keeps each agent's work separable and reviewable, and gives the instructor first-hand experience of directing a system, which they can then teach.

## Time and materials

A morning; Claude Code; a terminal that can show several panes.

## Variations

Students run the same pattern for a group project, one agent per teammate's part; a single agent with subagents for smaller jobs.
