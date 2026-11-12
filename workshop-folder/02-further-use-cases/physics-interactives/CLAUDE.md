# CLAUDE.md — Physics interactives

Project-level instructions loaded when Claude Code starts in this folder.

## What this project is

A self-contained bundle for making **PhET-style interactive simulations** — single-file HTML pages that a faculty member can build with Claude Code, double-click to open in Chrome, and share with students without any setup. See [summary.md](summary.md) for what the project ships, the tradition it sits in, and what LLMs change about it.

This folder is designed to be **grabbable**: a physics faculty member can take just this directory, open Claude Code inside it, and start making teaching interactives without needing the rest of the workshop repo. Skills live in the project's own `.claude/skills/` directory.

## If you just opened this folder

Read in this order:

1. [summary.md](summary.md) — what this is, how we built it, what you can translate it to.
2. [index.md](index.md) — a map of the folder.
3. [inputs/model-and-math.md](inputs/model-and-math.md) and [inputs/gened-1104-staff-brief.md](inputs/gened-1104-staff-brief.md) — the featured cooking models and teaching brief. Follow the numbered operations. The heat-pump brief remains an additional example.

## Audience modes

- **Faculty making their own interactive.** May never have touched a code editor. Default to plain-English explanations; do not assume CLI or git fluency. Natural first move: invoke `/phet-sim` and answer its questions, or fill out [.claude/skills/phet-sim/rubrics/pedagogical-design-worksheet.md](.claude/skills/phet-sim/rubrics/pedagogical-design-worksheet.md) on paper first.
- **Marlon (or another collaborator) iterating on the skill itself or its examples.** Terse responses, no hand-holding.

If unclear which mode applies, ask one question to disambiguate.

## Output contract (hard rules)

Every simulation produced by this project must satisfy these properties:

- **Single `.html` file**, opens by double-click in Chrome from `file://`.
- **No React, Vue, Vite, Next.js, `npm install`, or any build step.**
- **No runtime data fetches.** No `fetch`, no `XMLHttpRequest`, no loading of JSON/CSV/images/audio at runtime. Everything embedded inline or generated in code.
- **External CSS via `<link>` is allowed.** External JS via CDN is allowed but discouraged; if used, mark it in the file's header comment.
- **No emojis** anywhere in any file.
- **Header comment captures the design record** — learning goal, target learner, core misconception, manipulables, hidden variables, representations, prompts, limitations, classroom use, date.

If a user explicitly overrides one of these rules, proceed but mark the deviation in the file's header.

## The skills (live in `.claude/skills/`)

- **`/phet-sim`** — author a new simulation from a learning goal. See [.claude/skills/phet-sim/SKILL.md](.claude/skills/phet-sim/SKILL.md).
- **`/phet-activity`** — Wieman-style classroom lesson plan (Predict → Observe → Explain → Synthesize) around an existing sim. See [.claude/skills/phet-activity/SKILL.md](.claude/skills/phet-activity/SKILL.md).
- **`/phet-accessibility-audit`** — categorized audit report (Blockers / Warnings / Notes) against the accessibility floor. See [.claude/skills/phet-accessibility-audit/SKILL.md](.claude/skills/phet-accessibility-audit/SKILL.md).
- **`/phet-rationale`** — 600–1,000-word department-facing rationale. See [.claude/skills/phet-rationale/SKILL.md](.claude/skills/phet-rationale/SKILL.md).

## Conventions

- **Generated simulations go in `outputs/`** alongside the project's other produced artifacts (the essays, the research-basis note, the deep-research report).
- **Source artifacts in `inputs/` are read-only** for skills (faculty edit them by hand if at all).
- **Skills live in `.claude/skills/<skill-name>/`** — project-scoped, so they travel with this folder.

## Session-start checks

1. Check whether `.claude/skills/phet-sim/SKILL.md` exists. If it does, silence is correct.
2. Make sure an `outputs/` directory exists.

If both are in place and the user hasn't asked a question, say nothing.
