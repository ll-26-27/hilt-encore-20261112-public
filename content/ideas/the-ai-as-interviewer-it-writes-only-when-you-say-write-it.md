---
title: "The AI as interviewer: it writes only when you say \"write it\""
description: "Flip the usual prompt: the model asks the questions, one at a time, and writes nothing until the student says so."
mode: perform-in-claude
tags: ["context", "writing", "oral", "prompting"]
status: draft
---

Flip the usual prompt: the model asks the questions, one at a time, and writes nothing until the student says so.

## How it runs

Give students a fixed interview prompt for the task (a statement, a story, a project plan). They answer for 10–15 minutes, pushing back when a question is off. When they say "write it," the model drafts; the student then asks what it reached for that wasn't in their answers.

## With Claude

Save the interview prompt as a Claude Project instruction or a Claude Code skill (`.claude/skills/interview-me/SKILL.md`) with the rule "ask one question at a time; if an answer is vague, ask again; never draft until told 'write it'." Students run it in Claude Desktop or Claude Code.

## Why it works

The conversation is the work: students produce the material, and the model's later draft can be compared against what they said. Their thinking happens before the draft exists.

## Time and materials

20–30 minutes. A chat account.

## Variations

Use it before a paper ("interview me about my argument"), before a lab report, before an oral exam; pair it with a classmate who listens and adds one follow-up.
