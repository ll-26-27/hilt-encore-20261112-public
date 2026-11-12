---
title: "A planning folder for every session, and a decision log"
description: "Plan a course in a repository with one folder per class session and a running file of decisions, so plans, changes, and reasons live in one place an AI can read."
mode: build-with-claude-code
tags: ["course design", "planning", "documentation", "context"]
status: draft
---

Plan a course in a repository with one folder per class session and a running file of decisions, so plans, changes, and reasons live in one place an AI can read.

## How it runs

Create a folder per week. Put each week's plan, readings, handouts, and notes there; after class, add a short record of what happened. Keep one `decisions.md` at the top: each change of plan with its date, who decided, and why. When plans change on the morning of class, keep the old plan beside the new one.

## With Claude

Ask Claude Code: "Create a folder per class session from this calendar, each with a README that has the date, the theme, a plan section, and an empty 'what happened' section; and a decisions.md with a dated template." Then work with Claude inside it: "Read session 7 and the decisions log and draft the handout."

## Why it works

The course's reasoning stays findable, an AI assistant has the full context when helping plan, and the record supports later reporting and revision.

## Time and materials

An hour to set up; a Git repository.

## Variations

Share the repository with co-teachers or TAs; give each student a similar folder for their project.
