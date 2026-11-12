# CLAUDE.md — Exam make-up generator (a Claude Code skill)

Project-level instructions loaded when Claude Code starts in this folder.

## What this example is

A worked example of a **standalone skill** — the substance is the skill itself, not a deployed webapp. It ships a single `skill.md` plus a `skill.json` manifest that an instructor drops into their own project's `.claude/skills/` directory. The skill takes an existing exam, runs an interview about per-slot topic scope, generates candidate replacement problems, iterates on instructor feedback, and assembles the chosen candidates into a finished make-up exam in the original's format.

The skill in this example is **CS20-tested** (Harvard's discrete math course): the worked run in [`outputs/`](outputs/) is the real Round-1 + Round-2 + Assembly trace from the CS20 spring-2026 final exam. The candidates file has 1,741 lines across 10 slots; the assembled make-up exam is 470 lines of LaTeX in the same format as the original.

In the other examples in this folder a skill is one piece of a larger project. Here the **skill is the project** — there is nothing to deploy and nothing to run but the skill itself.

## If you just opened this folder

Read in this order:

1. [summary.md](summary.md) — what this is, the security-vs-parity foundational principle, the three-mode state machine, how to install. **No Vercel URL — the skill is installed by file copy into `.claude/skills/`.**
2. [operations/three-mode-state-machine.md](operations/three-mode-state-machine.md) — the reader's entry point to the skill itself. The shape before the substance.
3. [operations/skill.md](operations/skill.md) — **the skill** (~400 lines). The full instructions, all three modes, the interview phase, the generation rules, the assembly sanity checks.
4. [operations/skill.json](operations/skill.json) — the one-line manifest.
5. [inputs/final_s.tex](inputs/final_s.tex) — the original CS20 final exam used as the worked-run input.
6. [outputs/worked-run-summary.md](outputs/worked-run-summary.md) — a reader's guide to the two real-run output artifacts.
7. [outputs/final_s_makeup_candidates.md](outputs/final_s_makeup_candidates.md) — the actual Generation + Iteration output (1,741 lines, 10 slots, 37 candidates total).
8. [outputs/final_s_makeup.tex](outputs/final_s_makeup.tex) — the actual Assembly output: the finished make-up exam.

## How to work in this project

You are reading an example whose substance is **one substantial document** (`operations/skill.md`, ~400 lines) plus a **worked run** that demonstrates the skill end-to-end. Two passes, in order:

1. **Read the state-machine overview first.** [`operations/three-mode-state-machine.md`](operations/three-mode-state-machine.md) is the shape: three modes, one driving file, one interview moment. Without that frame, the 400-line skill reads as a wall of detail.
2. **Then read the skill itself.** [`operations/skill.md`](operations/skill.md) is deliberately one document. The state machine is small and the trust contract (*never modify the original*, *the instructor curates*, *don't guess past ambiguous structure*) is uniform across modes — splitting it would obscure that uniformity.
3. **Then look at the run.** The candidates file's structure ([`outputs/final_s_makeup_candidates.md`](outputs/final_s_makeup_candidates.md)) shows the curation log; the assembled exam ([`outputs/final_s_makeup.tex`](outputs/final_s_makeup.tex)) shows the output format the skill committed to matching.

## The pipeline

| Step | What | Where |
|---|---|---|
| 0 | Instructor installs the skill | Drop into `.claude/skills/exam-makeup/` |
| 1 | Instructor invokes the skill on an exam path | First call (no candidates file yet) |
| 2 | Skill runs the **interview phase**: asks for global constraints + per-slot topic scope tier | One chat turn |
| 3 | Skill writes Round-1 candidates to `<original-stem>_makeup_candidates.md` | Generation mode |
| 4 | Instructor reviews the file in their editor; leaves feedback on some slots; checks Drop on others | File edit |
| 5 | Instructor re-invokes the skill | Auto-detected as iteration |
| 6 | Skill appends Round-2 candidates per flagged slot; preserves consumed feedback as a quoted block | Iteration mode |
| 7 | Steps 4–6 may loop (Round 3, Round 4, etc.) | Curation rounds |
| 8 | Instructor checks **Keep** on one candidate per slot | File edit |
| 9 | Instructor re-invokes the skill | Auto-detected as assembly |
| 10 | Skill assembles chosen candidates into `<original-stem>_makeup.tex` (or `.md`, `.docx`, depending on original format) | Assembly mode |
| 11 | Skill runs sanity checks (balanced LaTeX environments, no typo'd closing tags, problem-count and subpart-count match the test plan) | Same call |

## Conventions

- **`inputs/` holds the worked-run input** — the original exam in both LaTeX source and rendered PDF.
- **`operations/` holds the skill itself plus a reader's entry point.** Two artifacts you'd install (`skill.md`, `skill.json`) and one reader's overview (`three-mode-state-machine.md`).
- **`outputs/` holds the worked-run output** — the candidates file and the assembled exam, plus a `worked-run-summary.md` that walks through them.
- **No emojis** in any file (workshop-wide convention).
- **Markdown link syntax** for file references.

## Alignment constraints (the hard ones)

These come from the skill itself and survive translation to other curation-style skills:

- **Never modify the original.** The skill reads the original exam but never writes to it. The original is the structural anchor; corrupting it would corrupt the whole curation log.
- **The instructor curates; the skill proposes.** Three modes, but only the instructor decides what to Keep, what to Drop, and which slot is finished. The skill never auto-selects a candidate.
- **A single file drives state.** `<original-stem>_makeup_candidates.md` is both the output of generation/iteration and the input of iteration/assembly. The file's checkbox state and feedback blocks are the only things the auto-detect logic looks at.
- **Security and parity together.** The make-up must change the *concrete domain*, the *scenario*, the *specific numbers*, and the *surface framing*. It must *not* change the *underlying technique*, the *number/structure of subparts*, the *conceptual depth*, or the *algebraic complexity*. A student who mastered the original's *technique* should solve the make-up in roughly the same time; a student who only memorized the original's *answers and steps* should gain nothing.
- **Concrete subparts only.** No "explain why this is hard" or "describe the key idea" — every subpart yields a gradable artifact (stated formula, explicit case split, constructed witness, proven sub-claim, counterexample, computed numeric, written algorithm). Partial credit depends on it.
- **The Suitability line is non-negotiable.** Every candidate carries one sentence stating what it *preserves* (technique, structure, difficulty) and what it *changes* (domain, scenario, numbers). The instructor decides at-a-glance.
- **Audit trail preserved across iteration.** Consumed feedback is preserved as a quoted block, not reset to empty. The candidates file is a permanent curation log — future readers (including the instructor weeks later) need to see what each round addressed.
- **Sanity-check assembly before reporting success.** Balanced LaTeX environments, matching problem and subpart counts, no typo'd closing tags. Don't claim success until the checks pass.
- **Format-agnostic input, format-preserving output.** The skill reads `.tex`, `.pdf`, `.docx`, `.md`, `.html`, `.txt`, `.rtf`, `.doc`. The assembled output matches the original's format — same environment names, same subpart syntax, same point notation.
- **One exam per invocation.** Don't loop across multiple exams unless explicitly asked.
