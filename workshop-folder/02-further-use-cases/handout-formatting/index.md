# Handout formatting file guide

Read [`summary.md`](summary.md) for the purpose, workflow, dependencies, and
limitations of this example. [`CLAUDE.md`](CLAUDE.md) contains instructions
that Claude Code loads when working in this folder.

## Skill

The reusable skill is in
[`.claude/skills/handout-formatting/`](.claude/skills/handout-formatting/):

- [`SKILL.md`](.claude/skills/handout-formatting/SKILL.md): workflow
- [`styles/housestyle.sty`](.claude/skills/handout-formatting/styles/housestyle.sty):
  visual styles and document metadata
- [`styles/handout.sty`](.claude/skills/handout-formatting/styles/handout.sty):
  content structures and student/key/teacher options
- [`reference/ingestion.md`](.claude/skills/handout-formatting/reference/ingestion.md):
  extracting content from source formats
- [`reference/content-types.md`](.claude/skills/handout-formatting/reference/content-types.md):
  converting common document structures
- [`reference/accessibility.md`](.claude/skills/handout-formatting/reference/accessibility.md):
  accessibility checks and known limitations
- [`scripts/build.sh`](.claude/skills/handout-formatting/scripts/build.sh):
  compilation script

## Inputs

- [`inputs/spanish/spanish-rutina-diaria-DRAFT.docx`](inputs/spanish/spanish-rutina-diaria-DRAFT.docx):
  unformatted Spanish worksheet
- [`inputs/math/`](inputs/math/): original differential equations worksheets
  and homework PDFs

Treat input files as read-only.

## Outputs

- [`outputs/spanish/`](outputs/spanish/): Spanish student handout, answer key,
  LaTeX source, and style-file copies
- [`outputs/math/`](outputs/math/): four rebuilt math handouts in LaTeX and PDF
- [`outputs/ACCESSIBILITY.md`](outputs/ACCESSIBILITY.md): accessibility review

Build-time copies of the style files appear beside the output sources. The
versions under `.claude/skills/handout-formatting/styles/` are the source of
truth.

## Rebuild the examples

Install `tectonic`, `pandoc`, and Poppler, then run:

```bash
bash .claude/skills/handout-formatting/scripts/build.sh outputs
```
