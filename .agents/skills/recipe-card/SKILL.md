---
name: recipe-card
description: Turn one thing the person did with AI (a prompt that worked, a workflow, a script run, a fix) into a one-page recipe card someone else can follow, saved in their context folder as Markdown and as a printable HTML card. Use when someone says "make a recipe card", "write up how I did that", "save this as a recipe", or at the end of a session that worked.
---

# Recipe card

A recipe card is the smallest useful piece of "show your work": one thing that worked, written so a colleague (or the person themselves, next month, or an agent) can do it again. Goal, ingredients, steps, what went wrong. It travels well: print it, pin it, share it, drop it in a context folder.

## Find the recipe

Work out which one thing the card is about. Usually it's one of:

- **What we just did in this session.** You know the commands, files, and errors; reconstruct them from the conversation, and ask about anything you're unsure of.
- **Something they did before.** Ask, one short question at a time: what they were trying to do, what they used (tool, model, script, prompt), the steps, what went wrong, and what they'd change. Stop when they say "that's enough."

One card, one recipe. If there are several, write the first and offer the rest.

## Keep it safe to share

A card describes the method, not the material. **Never put real data in a card:** no student names or work, no transcripts, no private documents, no keys. Describe inputs generically ("a two-minute voice memo", "a syllabus PDF") or use made-up examples. Always state the data route: which script or tool, HUIT or external, and therefore what may go into it (the kit's rule: external tools get only public, Level 1 material; see `_context/data-security/`).

## Write it

Save to `_context/<their-folder>/recipes/<short-name>.md` (ask which folder; if they don't have one, offer the `my-context` skill, or use `_context/recipes/`). Never overwrite an existing card. Use this shape, one paragraph per line:

```markdown
---
title: <what it makes, in a few words>
made: <YYYY-MM-DD>
by: <their name, only if they want it on the card>
---

<One sentence: what you get.>

## Goal
## Ingredients
(files, scripts or tools, models, keys needed, the data route, rough cost)
## Steps
(numbered; exact commands in code blocks; paths that work from the repo root)
## What went wrong, and the fix
## Try next
```

Keep it to one printed page: about 250–400 words. Exact commands beat descriptions. [examples/transcribe-a-debrief.md](examples/transcribe-a-debrief.md) is a finished card.

## Make it printable

```
node .agents/skills/recipe-card/scripts/card.mjs _context/<folder>/recipes/<short-name>.md
```

It writes `<short-name>.html` beside the card (no network, no packages). Open it, check it fits one page, and print from the browser.

**Optional art.** If they want a small illustration, make one through HUIT: `node ll-utilities/huit/gemini-image.mjs --prompt "<a simple, friendly spot illustration of …, no text>" --aspect 1:1 --out _context/<folder>/recipes/<short-name>.png`, add `image: <short-name>.png` to the front matter, and rebuild. One call; say so first.

## Then

Show them the card and ask what's wrong. Offer to add it to a list of their recipes (`_context/<folder>/recipes/README.md`, one line per card), so the next agent finds it.
