---
title: "Withhold before the agents read"
description: "Before any AI reads a student's folder, the student (or instructor) unticks the files it must not see, and the trace afterward shows what each agent was given."
mode: mixed
tags: ["context", "privacy", "agents", "ethics"]
status: draft
---

Before any AI reads a student's folder, the student (or instructor) unticks the files it must not see, and the trace afterward shows what each agent was given.

## How it runs

Put a `private/` folder and a raw-notes file in every project folder, with a README saying they're not for the AI. Run the reading with every file allowed once, and once with them withheld; compare what the AI wrote about each. Discuss what leaked indirectly (one agent mentioning a file to another).

## With Claude

Ask Claude Code for a file list with checkboxes in front of any multi-agent reader, and a trace table at the end: file, size, allowed, and which agent received it. In Claude Desktop, the manual version is choosing which files to attach.

## Why it works

Privacy and consent become concrete decisions, not a policy. In one test run with everything allowed, the planning agent left out `private/` on its own but passed a venting note to one reader, and the final writer, who never saw the note, still flagged it from the other's summary.

## Time and materials

Fifteen minutes; a sample folder with something sensitive in it (invent one).

## Variations

Medical or legal case files with redaction; research data with personal information; a lighter version with a printed folder and a black marker.
