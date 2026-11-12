---
title: "A course glossary with \"why it matters this term\""
description: "Keep a glossary where every term has a one-line definition, a plain-language explanation, and a line on why it matters in this course, and grow it each week."
mode: build-with-claude-code
tags: ["vocabulary", "reference", "context"]
status: draft
---

Keep a glossary where every term has a one-line definition, a plain-language explanation, and a line on why it matters in this course, and grow it each week.

## How it runs

Start with 30–80 terms the course will use. Each entry: definition, "In plain terms" with an analogy, "Why it matters this term," "See also." Students add or improve one entry a week and present one term aloud.

## With Claude

Ask Claude Code: "Draft glossary entries in `glossary/<term>.md` for each term in `terms.txt`, in this format [paste], citing a source for each definition; mark every entry `author: claude`." Then ask it to build a small site that renders the folder and a printable version. Students review and correct entries.

## Why it works

Shared vocabulary is shared control: students who can name what they see can direct people and machines, and the "why it matters" line ties each term to the work.

## Time and materials

An hour to seed; 10 minutes a week. Claude Code; optionally a static-site host.

## Variations

Give each term two senses (the technical sense and the everyday or human-practice sense); a glossary per unit; a glossary students write entirely.
