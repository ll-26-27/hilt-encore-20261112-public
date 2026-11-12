---
title: "One context document, many forms"
description: "Build one rich document of source material, then run it through several prompts and several models, and compare what each makes of it."
mode: build-with-claude-code
tags: ["context", "comparison", "forms", "models"]
status: draft
---

Build one rich document of source material, then run it through several prompts and several models, and compare what each makes of it.

## How it runs

Students produce one source (an interview transcript, notes, a personal context document). In class they run the same source through three forms (e.g. a song, a comic script, an object list) and two or three models, lay the outputs side by side, and discuss what changed and what stayed.

## With Claude

In Claude Code, put the source in `context/me.md` and ask: "Write a script that sends `context/me.md` with each prompt in `prompts/` to each model in `models.json` and builds `compare.html`, a grid with prompts as rows and models as columns." Students add a prompt file and rerun.

## Why it works

"The variation is the lesson": seeing one source come back in many shapes shows what belongs to the source, what belongs to the form, and what belongs to the model.

## Time and materials

45 minutes. API key for the script version; otherwise manual copy-paste across two chat apps.

## Variations

One primary source turned into a summary, a poem, a policy brief, and a lesson plan; one dataset into three chart types.
