---
title: "A question skill that reads the work"
description: "A Claude Code skill reads everything a student has made and drafts the questions an interviewer must ask, so oral assessment is prepared from the work itself."
mode: build-with-claude-code
tags: ["assessment", "oral", "agents", "context", "skills"]
status: draft
---

A Claude Code skill reads everything a student has made and drafts the questions an interviewer must ask, so oral assessment is prepared from the work itself.

## How it runs

The instructor writes the skill once. Before each oral check, it is run on the student's folder; it returns a short list of decision points, obstacles overcome, and skills developed, each tied to a file, and drafts questions about them. The interviewer chooses which to ask and adds follow-ups live.

## With Claude

Ask Claude Code: "Write a skill (SKILL.md) that has subagents read every file in this folder, then lists key decision points, moments the author overcame an obstacle, and places they developed or used a difficult skill, with a file reference for each; then draft questions that let the author show what they did that the AI couldn't, or a complex way of using AI they invented. End with a question about how they would scale the work up." Put it in `.claude/skills/<name>/SKILL.md`.

## Why it works

Questions grounded in the actual work are fair and hard to bluff; the student meets their own decisions again and has to explain them.

## Time and materials

An hour to write and test the skill; a minute to run per student.

## Variations

Keep the skill secret until the exam ("the skill is the test"); give students the skill to rehearse with; run it on a group's shared repo.
