# Exam make-up generator

This example is a Claude Code skill for drafting a make-up exam from an existing
exam. It proposes replacement questions, collects instructor feedback, and
assembles selected questions in the original format.

The included run uses the Harvard CS20 spring 2026 final exam. It demonstrates
the workflow; it does not establish that the generated exam has equivalent
difficulty or validity.

## Install the skill

Copy [`operations/skill.md`](operations/skill.md) and
[`operations/skill.json`](operations/skill.json) to
`.claude/skills/exam-makeup/` in a project or to the corresponding user-level
skills folder. Rename `skill.md` to `SKILL.md` if required by the installed
Claude Code version.

Invoke it with an instruction such as:

```text
Use exam-makeup to generate candidates from path/to/final.tex
```

The skill uses Claude Code's file tools. It does not require a separate web
application or service.

## Three-stage workflow

The workflow uses one Markdown candidates file as both the instructor's review
document and the record of the current stage.

| Stage | Condition | Result |
|---|---|---|
| Generation | The candidates file does not exist | The skill reviews the exam, asks about topic scope, and writes candidate questions. |
| Iteration | The feedback section contains text | The skill adds another round of candidates and retains the earlier round and feedback. |
| Assembly | At least one **Keep** box is checked and no feedback is pending | The skill writes the selected questions as a make-up exam. |

The instructor edits the candidates file between runs. The skill then determines
the next stage from the file's contents. See
[`operations/three-mode-state-machine.md`](operations/three-mode-state-machine.md)
for a shorter description of the rules.

## Included files

- [`inputs/final_s.tex`](inputs/final_s.tex) and
  [`inputs/final_s.pdf`](inputs/final_s.pdf): original exam source and rendered
  reference
- [`outputs/final_s_makeup_candidates.md`](outputs/final_s_makeup_candidates.md):
  candidate questions from two rounds, including instructor selections
- [`outputs/final_s_makeup.tex`](outputs/final_s_makeup.tex): assembled example
- [`outputs/worked-run-summary.md`](outputs/worked-run-summary.md): guide to the
  example run

## Review criteria

For each replacement question, the instructor should check:

- whether it assesses the intended knowledge and skills;
- whether its difficulty and expected work are comparable to the original;
- whether it is sufficiently different from the original;
- whether each part has a clear, gradable answer;
- whether the solution is correct; and
- whether the points and topic coverage are balanced across the full exam.

The skill includes format checks for issues such as unbalanced LaTeX environments
and mismatched question counts. These checks can find structural errors but
cannot establish fairness, correctness, accessibility, or comparable difficulty.

## Limits and appropriate use

The original exam should remain unchanged. Treat all candidates as drafts and
have the course instructor solve and review them before use. Do not include
student submissions or protected assessment data unless institutional policy
allows it.

The same review-and-selection structure can be adapted to problem sets, question
banks, or other materials where an expert chooses among generated alternatives.
