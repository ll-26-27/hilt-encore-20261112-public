---
title: "Studies for an agent"
description: "Before writing instructions for an AI to do a task, do the task with the AI by hand three times and write down what you corrected."
mode: perform-in-claude
tags: ["skills", "practice", "agents", "automation"]
status: draft
---

Before writing instructions for an AI to do a task, do the task with the AI by hand three times and write down what you corrected.

## How it runs

Pick a task you do repeatedly (summarizing a paper, formatting a bibliography, critiquing a draft). Do it three times with the AI, noting each correction you make. Those notes become the skill file. Then test the skill on a new case and compare.

## With Claude

In Claude Code, after three manual runs: "Here are my three sessions and my notes. Write `.claude/skills/<name>/SKILL.md` that captures how this job should be done, including the corrections I made. Then run it on `new-case.md`."

## Why it works

"The painter studies the hand before the portrait; you study the task before the SKILL.md." The by-hand runs are where the student learns what the task requires.

## Time and materials

45 minutes. Claude Code.

## Variations

Study a style before imitating it; study a grader before writing a rubric.
