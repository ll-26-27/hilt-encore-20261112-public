---
title: "Four roles brief the interviewer from a context folder"
description: "Before an oral exam or interview about a project, the student's own folder of notes, drafts, and process logs is read by a small team of AI roles that brief the interviewer on what to ask."
mode: mixed
tags: ["context", "agents", "oral", "assessment", "research"]
status: draft
---

Before an oral exam or interview about a project, the student's own folder of notes, drafts, and process logs is read by a small team of AI roles that brief the interviewer on what to ask.

## How it runs

Each student keeps a project folder (what they made, how, notes, prompts they used, sources). The interviewer gives the folder to the ensemble, reviews the plan for who reads what, withholds anything private, and reads the resulting one-page briefing before the conversation. The student sees the briefing afterward.

## With Claude

In Claude Code, from the student's folder: "Read this repository and brief me for a 15-minute interview with the person who made it. First list which files you'd read and why; wait for my OK. Don't read private/." For a built version, ask Claude Code for four roles in sequence: a Conductor that sees only the file list and proposes who reads what, an Archivist that reads the files and writes a map, a Researcher that reads only the map and checks names and claims on the web, and a Briefer that writes the page; show every prompt and let the person edit each card before the next role reads it.

## Why it works

The interview is grounded in the student's own record of making, so it tests their thinking, not their memory. Students keep better process notes when they know they'll be read.

## Time and materials

About a day to build the four-role version with Claude Code; ten minutes to run per student; a model key (about a cent and a half per run in one test).

## Variations

Lab notebooks before a lab practical; design portfolios before a crit; a thesis advisor's prep before a meeting.
