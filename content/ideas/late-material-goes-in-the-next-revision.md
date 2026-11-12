---
title: "Late material goes in the next revision"
description: "When an AI (or a person) writes a briefing from shared material, closing it with \"done\" freezes a revision; anything added later goes into the next revision, and each briefing says which items it covers."
mode: build-with-claude-code
tags: ["agents", "versioning", "context", "preparation"]
status: draft
---

When an AI (or a person) writes a briefing from shared material, closing it with "done" freezes a revision; anything added later goes into the next revision, and each briefing says which items it covers.

## How it runs

Students share material, say done, and get revision 1. They add something they forgot, say done again, and get revision 2 over everything. They compare the two briefings: what did the new item change?

## With Claude

Ask Claude Code: "Each item gets a revision number when it arrives. Done closes the open revision; the briefing's first line says 'revision N, items 1–M'. Items added later go into N+1."

## Why it works

It shows how a summary depends on what was in front of it, and it makes versioning a habit.

## Time and materials

15 minutes.

## Variations

Literature reviews that update as sources arrive; a lab's weekly summary; a study guide rebuilt as the term goes on.
