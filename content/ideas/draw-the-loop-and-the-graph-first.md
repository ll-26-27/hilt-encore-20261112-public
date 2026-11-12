---
title: "Draw the loop and the graph first"
description: "Before building anything with agents, have students draw the two shapes every agent system is made of, a loop and a graph, for one small system."
mode: mixed
tags: ["agents", "systems", "diagrams"]
status: draft
---

Before building anything with agents, have students draw the two shapes every agent system is made of, a loop and a graph, for one small system.

## How it runs

On paper: draw a loop (try, judge, try again, stop) and a graph (nodes that do work, edges that pass state) for a small task. Then run the smallest working loop (a guesser tries to find a hidden answer; a judge, which is a line of code, says yes or no; maximum ten tries), and compare the run with the drawing.

## With Claude

In Claude Code: "Build a loop where a model guesses my favorite color, a judge that is plain code checks each guess, the answer is never in the guesser's prompt, and it stops after 10 tries; log every turn to `runs/loop.jsonl`."

## Why it works

"Every agent can be described as a combination of graphs and loops." Drawing first makes the structure visible before the model's text distracts.

## Time and materials

30 minutes. Paper; Claude Code; an API key.

## Variations

A graph with one decision point that routes to two branches; a loop with a minimum number of tries, and a discussion of what that rule does.
