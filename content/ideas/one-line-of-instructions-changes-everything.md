---
title: "One line of instructions changes everything"
description: "Show how a project's instruction file shapes every answer by adding one silly rule, then have students write real instructions for their own project."
mode: perform-in-claude
tags: ["context", "instructions", "agents"]
status: draft
---

Show how a project's instruction file shapes every answer by adding one silly rule, then have students write real instructions for their own project.

## How it runs

Demo: add "Always answer in rhyming couplets" to the folder's instruction file and ask anything. Then students write their own instruction file for their project: who they are, what the project is, what to never do, how to mark what the AI wrote.

## With Claude

Claude Code reads `CLAUDE.md` at the folder root on every session. Students create `CLAUDE.md` with five lines, start Claude Code in the folder, and test a request before and after.

## Why it works

It makes context visible: the same model behaves differently because of a file the student wrote, which is the first step toward designing context on purpose.

## Time and materials

15 minutes. Claude Code.

## Variations

Instructions for a writing tutor that never writes for you; for a lab assistant that always asks for units.
