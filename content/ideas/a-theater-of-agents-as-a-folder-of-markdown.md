---
title: "A theater of agents as a folder of Markdown"
description: "Students design a system of AI agents as a folder of plain text files (a premise, a cast of characters with voices and secrets, a judge or a director), run it, and watch what the system does."
mode: build-with-claude-code
tags: ["agents", "systems", "games", "making", "theater"]
status: draft
---

Students design a system of AI agents as a folder of plain text files (a premise, a cast of characters with voices and secrets, a judge or a director), run it, and watch what the system does.

## How it runs

Start with a loop: two characters play a word game and a judge accepts or rejects each try. Then a switch (a router picks one of two responders), then a cast of four at a dinner party taking turns, then add a director with a goal, producers who add twists, and observers who comment. Each step, students edit the files and rerun.

## With Claude

Ask Claude Code: "Make a Next.js app where a system is a folder in systems/<name>/: system.md (kind loop, switch, or cast; caps; premise), cast/*.md (one character each), and judge.md, router.md, director.md, producers/, observers/ as the kind needs. Run it one model call at a time, stream each event to the page, log every event to a JSONL file, cap turns and cost, and add a Stop button." Students then only write Markdown.

## Why it works

Orchestration becomes dramaturgy: who speaks when, who decides, who watches. Students learn how agent systems behave by changing one file and watching the whole play change.

## Time and materials

The engine took a morning to build with Claude Code; a run costs a cent or two with a small model; 60 to 90 minutes of class.

## Variations

History (a council of historical figures with a moderator); economics (traders and a market maker); ethics (a trolley-problem jury). Lighter: one loop only.
