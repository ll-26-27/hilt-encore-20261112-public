# Handout formatting

This example converts inconsistent Word and PDF course materials into a common
LaTeX format. The same source can produce a student handout, an answer key, and
a teacher version.

The example includes an intermediate Spanish worksheet and four differential
equations handouts. The original files are in `inputs/`; generated LaTeX and
PDF files are in `outputs/`.

## Main components

The reusable workflow is defined in
[`.claude/skills/handout-formatting/`](.claude/skills/handout-formatting/):

- [`SKILL.md`](.claude/skills/handout-formatting/SKILL.md) defines the steps
  for extracting, converting, compiling, and reviewing a document.
- [`housestyle.sty`](.claude/skills/handout-formatting/styles/housestyle.sty)
  defines typography, headings, tables, callouts, and PDF metadata.
- [`handout.sty`](.claude/skills/handout-formatting/styles/handout.sty)
  defines content structures such as exercises and solutions. Package options
  control whether answers and teacher notes are shown.
- The `reference/` folder covers source-file extraction, content types, and
  accessibility checks.
- [`scripts/build.sh`](.claude/skills/handout-formatting/scripts/build.sh)
  compiles one file or a directory tree.

Separating visual styles from content behavior allows either part to be changed
without rewriting the document body.

## Workflow

1. Extract text and structure from the source file.
2. Convert the content to the environments defined in `handout.sty`.
3. Place the new `.tex` source in `outputs/`; do not edit the original input.
4. Compile the student and answer-key versions.
5. Render the PDFs and inspect every page for missing content, overflow, broken
   tables, and incorrect answers.
6. Record accessibility checks and remaining gaps.

To rebuild all included outputs, install `tectonic`, `pandoc`, and Poppler,
then run this command from the use-case folder:

```bash
bash .claude/skills/handout-formatting/scripts/build.sh outputs
```

## Accessibility

The templates use high-contrast text, explicit labels, document headings, and
per-document language and title metadata. The current Tectonic-based process
does not produce fully tagged PDFs or equation alternative text. That limitation
is documented in [`outputs/ACCESSIBILITY.md`](outputs/ACCESSIBILITY.md).

## Limitations

Automated extraction does not preserve all document structure. Scanned pages,
complex tables, equations, and answer placement require manual review. A PDF
that compiles successfully may still contain layout or content errors, so visual
inspection is a required step.

This structure can also support quizzes, lab sheets, study guides, or other
document sets that need consistent formatting and separate student and answer
versions.
