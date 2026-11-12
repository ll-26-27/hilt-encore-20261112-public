---
title: "Our docs, your notebook"
description: "Give each student a repository with two folders, one for what the instructor provides and one for what the student writes, and an instructions file telling their AI assistant which is which."
mode: build-with-claude-code
tags: ["context", "notebook", "provenance", "setup"]
status: draft
---

Give each student a repository with two folders, one for what the instructor provides and one for what the student writes, and an instructions file telling their AI assistant which is which.

## How it runs

The instructor's folder holds the assignment, how-tos, and readings; the student's notebook folder holds their notes, dictations, and drafts. The AGENTS.md (or CLAUDE.md) file tells the assistant to write only in the notebook, to mark what it writes as AI-written, and to start each session by reading the student's latest notes.

## With Claude

Ask Claude Code: "Set up this repository with docs/ and notebook/, a CLAUDE.md that explains them, and a Next.js page that renders both as a site, with each folder's README as its introduction." Students then work in Claude Code inside their own copy.

## Why it works

It keeps provenance clear (who wrote what) and gives the AI the right context every time, without students having to explain the project again.

## Time and materials

An hour to set up once; each student clones a copy.

## Variations

A research group's shared repo with one notebook folder per member; a course reader with a margin-notes folder.
