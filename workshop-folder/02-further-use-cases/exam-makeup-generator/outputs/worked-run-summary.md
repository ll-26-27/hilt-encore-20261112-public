# Worked-run summary — reading the two output files

*A guide to the real run that produced [`final_s_makeup_candidates.md`](final_s_makeup_candidates.md) and [`final_s_makeup.tex`](final_s_makeup.tex). The run targets the **CS20 spring-2026 final exam** ([`../inputs/final_s.tex`](../inputs/final_s.tex)); the artifacts in this folder are the real (un-redacted) skill outputs from that run.*

---

## The run, at a glance

| Mode | Date | What happened | Where it lives |
|---|---|---|---|
| Generation (Round 1) | 2026-05-14 | Skill read `final_s.tex`, ran the interview, and produced 3 candidates per slot across 10 slots | First half of [`final_s_makeup_candidates.md`](final_s_makeup_candidates.md) |
| Iteration (Round 2) | 2026-05-14 | Instructor left feedback on 5 of 10 slots; skill appended 1–2 more candidates per flagged slot | Sections marked `_Round 2 (2026-05-14), addressing feedback above:_` |
| Assembly | 2026-05-14 (later) | Instructor checked **Keep** on one candidate per slot; skill assembled into make-up exam | [`final_s_makeup.tex`](final_s_makeup.tex) |

## The numbers from the candidate file

- **10 slots** in the original exam (10 problems on the CS20 final).
- **37 candidates total** across all rounds (30 from Round 1 at 3-per-slot, plus 7 added in Round 2 — five slots got one new candidate, one slot got two).
- **10 `Keep` boxes checked** — one per slot, matching what assembly mode needs. The instructor's curation log.
- **5 `Round 2` markers** in the file, showing which slots iterated.

## The interview phase, captured in the test plan

The candidate file's test plan (the table near the top) records the *confirmed* topic scope per slot — i.e. what the instructor chose during the interview phase, not what the skill initially inferred. Reading that table, you can see the instructor's scope choices:

| Slot | Scope choice | What this means |
|---|---|---|
| 1 | broader | "Set identities + cardinality + characterization on any binary/ternary set operation" — broader than the original's specific *symmetric difference* problem |
| 2 | broader + substrate-flex (lateral) | "Disprove-and-strengthen technique on **any substrate** — number theory, logic, or functions" — same technique, free choice of substrate |
| 3 | broadest | "Any relations problem" — full course-unit scope on relations |
| 4 | broadest | "Any counting / combinatorics problem" |
| 5 | broadest | "Any induction problem — ordinary, strong, or structural" |
| 6 | broader | "Inductively-defined sets with possibly different object types or invariant character" |
| 7 | narrow | "Bayes with two conditionally independent ±tests on a binary state" — instructor wanted to stay tight here |
| 8 | broadest | "Random variables / expectation, preferring linearity + indicator variables" |
| 9 | broadest | "Graph theory restricted to coloring, connectivity, or isomorphism" |
| 10 | narrow | "Broken greedy MST: success/failure construction + named fix" — instructor stayed tight |

Slots 1, 2, 6 are *broader*; slots 3, 4, 5, 8, 9 are *broadest*; slots 7 and 10 are *narrow*. The split is informative — the instructor stayed narrow on the two slots where the original problem's specific structure was load-bearing (Bayes with conditional independence; the MST counterexample-and-fix). Everywhere else they widened the pool.

## What's in `final_s_makeup_candidates.md` (84 KB, 1741 lines)

Read this top-down:

1. **Header** — metadata (generation date, original-exam path, context sources used, candidates-per-slot setting).
2. **"How to use this file"** — the curation-log conventions and the checkbox semantics. Read it once; the skill's auto-detect logic depends on these conventions.
3. **Test plan** — the table above, plus a one-paragraph note on format conventions of the original (so you can see what the candidates have to match).
4. **Ten slot sections** — one per problem in the original. Each section has:
   - A heading like `## Slot 1 — Set identities + cardinality + characterization · 3 subparts · ~10 min · medium`.
   - A short "Original (excerpt for orientation)" blockquote.
   - 3+ candidates (IDs 1A, 1B, 1C, then 1D from Round 2 if applicable), each with:
     - Keep / Drop checkboxes (the curation surface).
     - A *Suitability* sentence — one line stating what is preserved (technique, structure, difficulty) and what is changed (domain, scenario, numbers).
     - The problem statement in a `\`\`\`latex` fenced block (because the original is LaTeX).
     - A complete solution (because the original includes solutions; see Generation Rule 8 in [`../operations/skill.md`](../operations/skill.md)).
   - Where Round 2 ran: a dated separator `_Round 2 (2026-05-14), addressing feedback above:_` above the new candidates, plus the consumed feedback preserved as a quoted block.
   - A fresh empty **Feedback for next round** block at the bottom of the slot.

The instructor's actual *Keep* selections are visible — each slot has exactly one `- [x] **Keep**` checkbox checked. Those ten checked boxes are what assembly mode consumes.

## What's in `final_s_makeup.tex` (20 KB)

The assembled output. Read it next to [`../inputs/final_s.tex`](../inputs/final_s.tex) — they should be structurally indistinguishable.

- **Preamble** — copied verbatim from the original (`\documentclass[test,letterpaper]{cs20}`, the same packages, the same `\header{5}{Final Exam (Make-up)}` with " (Make-up)" appended).
- **10 `\begin{problem}` blocks** — one per slot, in the original's order, with the same subpart count and subpart structure as the original. Verified by the sanity-check step described in [`operations/skill.md`](../operations/skill.md) under *Assembly mode*.
- **Complete solutions** — because the original exam was the `_s` (solutions-included) variant. The naming convention `final_s_makeup.tex` mirrors `final_s.tex` to signal "with solutions."

The Assembly mode's sanity checks ran on this file before it was reported as complete:

- ✓ All LaTeX environment begin/end pairs balanced.
- ✓ No typo'd closing tags (regex check: `\\end\{[a-z]*[^a-z}]`).
- ✓ 10 `\begin{problem}` blocks, matching the 10-slot test plan.
- ✓ Each problem's `\subproblem` count matches the test-plan's expected subpart count.

## What this run demonstrates

- **The skill works end-to-end on a real exam.** Generation → iteration → assembly, with the same single markdown file driving state across all three phases.
- **The interview phase materially shapes the output.** Five different scope-tier choices show up in the test plan. Without the interview, all slots would have defaulted to "narrow" and the candidate pool would have been a cluster of near-clones.
- **Iteration was needed for half the slots.** Round 1's three-per-slot wasn't always enough; the instructor's feedback on 5/10 slots pulled the candidate pool wider. This is normal and the skill is designed around it.
- **Assembly is mechanical.** Once the Keep checkboxes are set, the skill walks the file, copies the chosen candidates into the original's format, and runs sanity checks. The instructor doesn't author the make-up exam directly; they curate.
- **The cost is wall-clock time, not API calls.** Generation produced 30 candidates × ~complete solutions each — that's a lot of LaTeX. The skill is run interactively (one human-in-the-loop step in the middle), not in a batch.

## What you'd do to re-run on a different exam

The skill is at [`../operations/`](../operations/). To install:

```bash
# Drop the skill into a project's .claude/skills/ folder
mkdir -p .claude/skills/exam-makeup
cp /path/to/this/example/operations/skill.md .claude/skills/exam-makeup/SKILL.md
cp /path/to/this/example/operations/skill.json .claude/skills/exam-makeup/skill.json
```

(Or install it user-level at `~/.claude/skills/exam-makeup/`. The skill description in `skill.json` is what Claude reads first; the full instructions in `skill.md` load when invoked.)

Then in a Claude Code session in your project:

```
> Use exam-makeup to generate make-up candidates from path/to/my-final.tex
```

The skill auto-detects mode from the state of the candidates file. First invocation = generation; later invocations (with the file edited) = iteration or assembly. See [`../operations/three-mode-state-machine.md`](../operations/three-mode-state-machine.md) for the shape and [`../operations/skill.md`](../operations/skill.md) for the substance.
