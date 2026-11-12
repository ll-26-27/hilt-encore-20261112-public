---
title: "Resource sheets whose every command was run"
description: "Have Claude write a one-page sheet for each tool students will use (the standard apps, the AI tools, the command line), and require that every command on the sheet was run and every claim checked, with the date."
mode: build-with-claude-code
tags: ["editing", "documentation", "verification", "tools"]
status: draft
---

Have Claude write a one-page sheet for each tool students will use (the standard apps, the AI tools, the command line), and require that every command on the sheet was run and every claim checked, with the date.

## How it runs

Before a unit, generate the sheets, then run every command and check every vendor claim; mark each sheet `checked: <date>`. Students use the sheets in class and report anything that's wrong.

## With Claude

In Claude Code: "Write a resource sheet for ffmpeg for students who've never used a terminal: ten tasks, one command each. Then run every command on a sample file and fix any that fail. Add checked: today's date to the frontmatter."

## Why it works

AI-written documentation is fast but unreliable; the run-every-command rule makes it trustworthy and models verification for students.

## Time and materials

An afternoon for a set of sheets.

## Variations

Statistics software cheat sheets; lab equipment quick-starts; citation style guides.
