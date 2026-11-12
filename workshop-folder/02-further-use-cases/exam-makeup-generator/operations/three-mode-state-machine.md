# The three-mode state machine — read this before `skill.md`

*The skill itself is in [`skill.md`](skill.md) — about 400 lines, detailed and self-contained. This document is a reader's entry point: the **shape** of the skill before the substance. Skim this, then read the skill.*

---

## The skill in one paragraph

The instructor gives the skill the path to an original exam (any common format — `.tex`, `.pdf`, `.docx`, `.md`, etc.) and (optionally) some course context. The skill works in three modes, **auto-detected from the state of a single markdown file** that travels with the run. Across the modes, the file is built up, curated by the instructor, and finally collapsed into a clean make-up exam in the original's format.

## The file that drives state

A single artifact carries the run's state:

```
<original-stem>_makeup_candidates.md
```

For the worked run in this folder, that's [`outputs/final_s_makeup_candidates.md`](../outputs/final_s_makeup_candidates.md) — 1,741 lines, 10 slots, 3–4 candidates per slot, with Keep/Drop checkboxes and complete solutions.

This file is *both* the skill's output (in generation/iteration) *and* the skill's input (in iteration/assembly). It is the curation log. Auto-detection looks at its state to decide what to do next.

## The three modes

| Mode | Trigger | What the skill produces |
|---|---|---|
| **Generation** | The candidates file does not yet exist | Creates the file from scratch: extracts the test plan from the original, runs the interview phase, writes 2–3 candidates per slot |
| **Iteration** | The file exists; one or more **Feedback for next round** blocks have been filled in (anything other than `_(empty)_`) | Appends 1–2 new candidates per flagged slot. Preserves consumed feedback as a quoted block; opens a fresh feedback slot |
| **Assembly** | The file exists; at least one **Keep** checkbox is checked; no pending feedback | Assembles the chosen-per-slot candidates into a finished exam in the original's format (e.g. [`outputs/final_s_makeup.tex`](../outputs/final_s_makeup.tex)) |

The auto-detect logic is encoded at the top of [`skill.md`](skill.md). If ambiguous (both feedback *and* Keep checkboxes present), the skill asks. The user can also override with an explicit `mode=` argument.

## The single chat-level interaction

In **generation mode** the skill pauses *once* before writing — the **interview phase** — to ask the instructor:

1. Global constraints (scratch-tools policy, time limit, other constraints).
2. A per-slot **topic-scope table** with three columns: *narrow* (the original's surface topic), *broader* (same skill across a wider operation/framing space), *broadest* (the course-unit level). Plus two cross-cutting modifiers: *lateral broadening* (same technique, different substrate) and *broader still* (re-propose wider).

The instructor replies with constraints + per-slot scope choices ("broader for all; lateral on 2; broadest for 4 and 8"). Without this step, the skill infers narrow topics from surface form alone — and produces near-clones with weak security. The interview is the single moment of human-driven scope choice; everything downstream is mechanical.

In **iteration mode** and **assembly mode** there is no interview — the test plan is already established. In iteration the instructor leaves feedback in the file; in assembly the instructor toggles Keep checkboxes in the file. Both are *file edits*, not chat turns.

## The state-driving conventions (parsing rules)

The skill reads checkboxes from the markdown file. It recognizes any of these as **checked**:

```
- [x]    - [X]    * [x]    * [X]
```

Any other state (including `- [ ]` and a missing line) is **unchecked**. The "Keep" and "Drop" headings are checkable independently. The conventions are deliberately the GitHub-Flavored Markdown task-list syntax so editors (VS Code, Cursor, GitHub web) render them as clickable boxes — the instructor toggles with one click rather than editing heading text.

## The two foundational commitments

The skill is built around two principles that pull in opposite directions:

- **Security.** A student who has seen the original (intentionally or otherwise) must not be able to convert that knowledge into points on the make-up.
- **Parity.** The make-up must be the same exam in difficulty, length, structure, and concept coverage as the original.

The skill's job is to find candidates that change *enough* that recall doesn't help, but *only* the things that don't change difficulty. Concretely: change the **concrete domain** (e.g., disease-test Bayes → spam-filter Bayes), the **scenario**, the **specific numbers**, and the **surface framing**. Do *not* change the underlying technique, the number/structure of subparts, the conceptual depth, or the algebraic complexity.

The posture throughout is to make the limit structurally legible — here, in the Suitability sentence under each candidate, which explicitly names *what was preserved* and *what was changed*.

## The reader's path

1. **This document** — for the shape.
2. **[`skill.md`](skill.md)** — for the substance. ~400 lines covering the three modes, the interview phase, every generation rule, the LaTeX/markdown/PDF/Word read strategies, the assembly sanity checks, the audit-trail conventions, edge cases.
3. **[`skill.json`](skill.json)** — the one-line manifest (name, description, version, author).
4. **[`../inputs/final_s.tex`](../inputs/final_s.tex)** — the worked example's original exam.
5. **[`../outputs/final_s_makeup_candidates.md`](../outputs/final_s_makeup_candidates.md)** — what generation+iteration produced.
6. **[`../outputs/final_s_makeup.tex`](../outputs/final_s_makeup.tex)** — what assembly produced.

The skill is one substantial document, deliberately. The state machine is small and the trust contract — *never modify the original*, *the instructor curates*, *don't guess past ambiguous structure* — is uniform across modes. Splitting the skill into many small files would obscure how a single state-driven artifact governs the whole run.
