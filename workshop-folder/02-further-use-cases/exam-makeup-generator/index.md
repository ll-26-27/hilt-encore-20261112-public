# Exam make-up generator file guide

Read [`summary.md`](summary.md) for installation, workflow, review criteria,
and limitations. [`CLAUDE.md`](CLAUDE.md) contains the project instructions
loaded by Claude Code.

## Source exam

- [`inputs/final_s.tex`](inputs/final_s.tex): Harvard CS20 spring 2026 final
  exam with solutions
- [`inputs/final_s.pdf`](inputs/final_s.pdf): rendered copy of the same exam

The skill treats the source exam as read-only.

## Skill files

- [`operations/three-mode-state-machine.md`](operations/three-mode-state-machine.md):
  short explanation of generation, iteration, and assembly
- [`operations/skill.md`](operations/skill.md): full skill instructions
- [`operations/skill.json`](operations/skill.json): skill metadata

## Example run

- [`outputs/worked-run-summary.md`](outputs/worked-run-summary.md): guide to
  the example
- [`outputs/final_s_makeup_candidates.md`](outputs/final_s_makeup_candidates.md):
  candidate questions, feedback history, and selected questions
- [`outputs/final_s_makeup.tex`](outputs/final_s_makeup.tex): assembled example
  exam

To use the skill with another exam, install the files as described in
[`summary.md`](summary.md), pass the source exam's path, and review the
candidates file between runs.
