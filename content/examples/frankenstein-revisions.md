---
title: Frankenstein, 1818 and 1831
order: 5
index: Every change Mary Shelley made between the 1818 and 1831 Frankenstein, found, sorted, and checked, with an audit trail.
source: https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/distant-reading/01-frankenstein-revisions
image: ""
---

## What this is

Mary Shelley revised *Frankenstein* for the 1831 edition. This finds every change between the two texts, 550 of them: 216 are punctuation only, and the other 334 are sorted into kinds of revision by a small, cheap model, with each one you can filter and read in context. A stronger model then checks a sample of the sorting and agrees 78 times out of 100, but only half the time on large rewritten passages, and we say so on the page. It found all twelve of the revisions scholars have written about. It was one of the use cases for the same seminar's session on Claude Code and vibe coding, November 3.

## How we made it

The approach: a one-shot prompt is bound to be brittle, so segment the texts first, check with guardrails that every difference was found, use structured outputs and spots of plain code where the answer should be deterministic, and keep an auditable trail. It was built in a morning by a model and a few scripts, and the model calls cost seventy cents. What went wrong is written into its README: some of the model's rationales are wrong about the text, forty-two ran over their word limit, a scholarly source refused automated access, and the most common free online copy of the novel turned out not to be the 1818 text.

## Source

- The use case, with every change and every check: https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/distant-reading/01-frankenstein-revisions
- The seminar's repository (Claude Code and vibe coding for the humanities): https://github.com/ll-26-27/eng298ai-20261103
