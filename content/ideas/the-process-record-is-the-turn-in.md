---
title: "The process record is the turn-in"
description: "When students work in a repository with an AI, have them turn in the history (commits and the AI session log) along with the work, instead of condensing their process into a separate write-up."
mode: perform-in-claude
tags: ["assessment", "process", "repositories", "integrity"]
status: draft
---

When students work in a repository with an AI, have them turn in the history (commits and the AI session log) along with the work, instead of condensing their process into a separate write-up.

## How it runs

Students work in a Git repository and commit as they go, with short messages. At submission they hand in a tag ("the version I stand behind") plus the exported AI session logs. The instructor reads the history to see how the work was made and uses it to prepare questions for the oral account.

## With Claude

Claude Code sessions can be exported or summarized; ask Claude Code at the end: "Summarize this session as a dated log of what I asked, what you did, and what I changed, and save it to process/<date>.md." Then: "git tag first-project-final" and push.

## Why it works

The full trace is more honest and more informative than a polished process essay, and it gives the oral account something concrete to ask about.

## Time and materials

Git and GitHub accounts; five minutes to tag and export.

## Variations

A commit hash in the learning management system instead of a tag; a diff between two tags as the revision record.
