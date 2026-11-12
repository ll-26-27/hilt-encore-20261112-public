---
name: my-context
description: Start a context folder of the person's own in _context/, through a short interview, one question at a time, about their role, a course, or a project. Writes a README that a new collaborator (or an AI agent) can read first, one file per course or project, and a list of open questions, keeping their words separate from the agent's summary. Use when someone says "start my context folder", "help me set up context for my course", or "make this repo mine".
---

# My context

A context folder is what you'd hand a new collaborator on their first day: who you are, what you're working on, what to read first, and what you're still figuring out. Written once, it lets any agent (or colleague) pick up the work without being told everything again. This skill helps the person start one in `_context/<name>/`, using the structure of this repo's own `_context/` as the model.

## Before the first question

Say in two sentences what you'll make and that they can stop the interview at any time ("that's enough" ends it). Then the data rule, in your own words:

- Start with public or made-up material: a public course description, a syllabus they'd share, how they'd describe their work at a conference.
- **No student names, grades, private correspondence, or unpublished research in this folder.** If they want to add confidential material later, point them to `_context/data-security/` first: what Claude Code reads goes to whichever provider their Claude account uses, and that may not be approved for it.
- Everything you write stays on their computer unless they push it somewhere.

Ask what the folder is about if they haven't said: themselves and their role, one course, or one project. Agree on a short folder name (lowercase, hyphens: `_context/hist-1234/`, `_context/writing-center/`). Never overwrite an existing folder; if the name is taken, ask.

## The interview

Ask **one short question per turn**. Follow their answer rather than a script, don't praise or recap before each question, and accept "skip." Skip anything they've already told you. If they hand you a file (a syllabus, a course page), read it first and ask only about what it leaves out. Aim for five to eight questions; stop when they say so.

What you're after, roughly in this order:

1. **What it is**, in one or two sentences, as they'd say it to a colleague.
2. **Who's involved**: their role, the audience (students, faculty, staff), collaborators by role rather than by name unless they choose to name them.
3. **What's happening now**: this term, this month, the next deadline.
4. **What they'd want an agent to help with**: drafting, organizing, building, reflecting, preparing materials.
5. **What matters to how the work is done**: values, constraints, things that must not happen, the tone of their materials.
6. **What to read first**: the documents that carry the most context, and where they live.
7. **Open questions**: what they're still figuring out.

## Write the folder

Write in plain language, one paragraph per line (don't hard-wrap). Keep **their words** (quoted, in "In their words" sections) separate from **your summary**, and mark anything you inferred as a draft for them to check.

```
_context/<name>/
  README.md        what this is, who it's for, what's happening now, what to read first,
                   how an agent should work here, and "In their words" quotes
  <course-or-project>.md   one per course or project they described (skip if there's only one; it lives in the README)
  questions.md     their open questions, as a list, each one line
  sources/         empty, with a one-line README.md: "Public or made-up documents go here."
```

The README's first lines should let a stranger orient in ten seconds:

```markdown
# <Title>

<One or two sentences: what this is and who it's for.>

Started <date> with the my-context skill. Written by <their name, if they gave it> and Claude; quotes are theirs, everything else is a draft summary for them to check.

## Read first
## What's happening now
## How to work here (for agents)
## In their words
```

"How to work here" carries their answers to question 5 as instructions an agent can follow ("Explain before running anything", "Never put student names in a file", "Handouts are one page, plain language").

Then:

1. Show them the folder: list the files and open the README.
2. Ask what's wrong or missing, and fix it. Their corrections override your drafts.
3. Offer to add one line for their folder under "Add your own" in `_context/README.md`, so the next agent finds it. Do it only on a yes.
4. Suggest one next step that uses the folder, for example: "Ask me to draft next week's handout using `_context/<name>/`," or the `recipe-card` skill for something they've already done with AI.

## Don't

- Don't invent facts about their course, students, or institution. Leave a `TODO:` line where you need an answer they didn't give.
- Don't ask for or store personal information about other people.
- Don't call any API. This skill uses only Claude Code and the files it writes.
