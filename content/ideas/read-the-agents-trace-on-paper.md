---
title: "Read the agents' trace on paper"
description: "Print the full trace of a multi-agent run (what each agent was told, given, and said) and mark it up by hand to find where the system went right and wrong."
mode: mixed
tags: ["agents", "reflection", "critique", "transparency"]
status: draft
---

Print the full trace of a multi-agent run (what each agent was told, given, and said) and mark it up by hand to find where the system went right and wrong.

## How it runs

Run an agent system once; print its trace (around 20 pages). In groups, students mark each step: what this agent knew, what it didn't, what it got wrong, where a person should have stepped in. Then redesign one agent's instructions and run it again.

## With Claude

Ask Claude Code to make every agent tool write a Markdown trace: for each role, its system prompt, its full input, its output, the pages it used, its cost, and whether a person edited it. Add a print stylesheet so the trace prints cleanly on Letter.

## Why it works

Agents are hard to understand from their final answer; laid out on paper, the handoffs and misreadings become visible and discussable, the way a script or a lab log is.

## Time and materials

30 to 45 minutes in class; a printer.

## Variations

A trace of a single long chat; a code review agent's steps; a research agent's search log.
