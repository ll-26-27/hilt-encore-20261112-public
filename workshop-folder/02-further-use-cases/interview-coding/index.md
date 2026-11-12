# Interview coding file guide

Read [README.md](README.md) for the recipe and [summary.md](summary.md) for its scope.

## Inputs

- [Paper citation](inputs/the-paper.md) and [synthetic corpus description](inputs/README.md)
- [Protocol](inputs/protocol.md), [attributes](inputs/attributes.csv), and [four transcripts](inputs/transcripts/)

## Operations and skills

- [Ten numbered operations](operations/): the original build, including its prompts and audit
- [Run the recipe](operations/10-run-the-recipe.md)
- [Index transcripts](.claude/skills/index-transcript/SKILL.md)
- [Find negative cases](.claude/skills/find-negative-cases/SKILL.md)
- [Write the methods paragraph](.claude/skills/methods-paragraph/SKILL.md)

## Outputs and review

- [Indexed transcripts and coverage reports](outputs/indexed/)
- [Negative-case memos](outputs/negative-cases/)
- [Methods paragraph](outputs/methods/methods-paragraph.md)
- [Corrected contextual essay](outputs/essay/research-result.md)
- [Correction log](corrections.md) and [import provenance](PORT.md)

The older `background/` paths now point to the corrected sources. Duplicate skill-example paths point to the canonical outputs so they cannot retain contradictory versions. The empty-project methods example is labelled as a hypothetical earlier state.
