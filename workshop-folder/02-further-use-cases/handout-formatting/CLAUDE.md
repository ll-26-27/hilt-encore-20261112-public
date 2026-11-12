# CLAUDE.md — Handout formatting

These are the instructions loaded when Claude starts a session inside this
folder. Read them before doing anything else.

## What this project is

A worked example built around a reusable **skill**:
[handout-formatting](.claude/skills/handout-formatting/SKILL.md). The skill turns
rough course handouts — in any format (`.docx`, `.pdf`, scans, pasted text) and
any subject — into clean, consistent, print-ready PDFs by way of LaTeX, where
the *same* source compiles to a student handout, an answer key, or a teacher
copy.

This generalizes an earlier, math-only version of the recipe (built in a
previous workshop) into a subject-agnostic skill. The move worth noticing:
**split the house style into a `look` layer and a `behaviour` layer, so one
machine serves every subject and audience.** A Spanish reading-and-vocab sheet
and a differential-equations worksheet come out of the same two packages.

Two worked examples prove the range:

- [outputs/spanish/](outputs/spanish/) — a messy Word handout
  ([inputs/spanish/](inputs/spanish/)) cleaned into a styled worksheet with a
  reading passage, a tidy vocab table, a conjugation table, and exercises;
  built as student and key versions from one source (the source also supports a
  teacher build via `[teacher]`).
- [outputs/math/](outputs/math/) — the original DE worksheets and problem sets,
  re-issued through the *generalized* house style to confirm the broadened skill
  still handles math (equations reconstructed and rendered).

## If you just opened this folder

Read in this order:

1. [summary.md](summary.md) — the whole story, top to bottom.
2. [.claude/skills/handout-formatting/SKILL.md](.claude/skills/handout-formatting/SKILL.md)
   — the skill that does the work, and its `reference/` docs.
3. One worked example, source and result side by side:
   [inputs/spanish/spanish-rutina-diaria-DRAFT.docx](inputs/spanish/spanish-rutina-diaria-DRAFT.docx)
   then [outputs/spanish/rutina-diaria.tex](outputs/spanish/rutina-diaria.tex)
   and its compiled PDFs.

## The pipeline

| Step | What | Where |
| --- | --- | --- |
| 1. Set up style | Copy the two house-style packages next to the output (or build a `housestyle.sty` from a provided template). | [styles/](.claude/skills/handout-formatting/styles/) |
| 2. Ingest | `pandoc` for `.docx`, `pdftotext -layout` for typed PDFs, OCR / image-reading for scans. | [reference/ingestion.md](.claude/skills/handout-formatting/reference/ingestion.md) |
| 3. Convert | Map each content block (prose, messy table, vocab, dialogue, math) to a house-style environment; write the body once. | [reference/content-types.md](.claude/skills/handout-formatting/reference/content-types.md) |
| 4. Compile | `tectonic <file>.tex`; fix until it builds; render and look. | [scripts/build.sh](.claude/skills/handout-formatting/scripts/build.sh) |
| 5. Audit | Check against WCAG 2.1 AA; record the gap. | [reference/accessibility.md](.claude/skills/handout-formatting/reference/accessibility.md), [outputs/ACCESSIBILITY.md](outputs/ACCESSIBILITY.md) |

## Conventions

- **`inputs/` is read-only.** The source documents are never edited in place. A
  cleaned or converted version is always an *output*.
- **Generated artifacts go in `outputs/`.** The `.sty` files beside the `.tex`
  are build-time copies; the sources of truth live in the skill's
  [styles/](.claude/skills/handout-formatting/styles/).
- **No emojis** in any file.
- **Reference files with markdown links**, never bare paths.
- **Relative paths only**, so the folder works when copied out on its own.

## Hard rules / output contract

- **One source, every audience.** A handout compiles to a student copy, an
  answer key, or a teacher copy by changing only the `handout` package option
  (`[]`, `[key]`, `[teacher]`) — never by forking the body. A `-key` (or
  `-teacher`) file is a two-line wrapper that sets `\audience` and `\input`s the
  single source.
- **Look and behaviour stay split.** All visuals live in `housestyle.sty`; all
  audience-conditional environments live in `handout.sty`. To match a provided
  template, rebuild `housestyle.sty` from it and keep `handout.sty`.
- **Not done until it compiles** under `tectonic` and you have looked at the
  rendered page. Extraction (pandoc / pdftotext) is a draft: tables and math
  must be reassembled and verified.
- **Dependencies are external tools.** `tectonic` (compile), `pandoc` (`.docx`),
  `pdftotext`/poppler (typed PDF), optionally `tesseract` (OCR). State plainly
  if one is missing; do not assume a full TeX Live install.
