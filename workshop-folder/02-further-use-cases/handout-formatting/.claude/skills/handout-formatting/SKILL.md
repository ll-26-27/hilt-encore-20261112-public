---
name: handout-formatting
description: >-
  Turn rough course handouts in any format (.docx, .pdf, scans, pasted text)
  into clean, consistent, print-ready handouts via LaTeX. Use whenever the user
  wants to reformat, clean up, standardize, or "make nice" worksheets, problem
  sets, readings, vocabulary sheets, study guides, exams, or lecture notes
  into a uniform house style and export polished PDFs. Works for any subject —
  math (reconstructs equations), language learning (texts, vocab lists, messy
  conjugation tables, dialogues, non-Latin scripts), humanities readings, and
  more. Produces a single source that compiles to student, answer-key, and
  teacher versions, with accessibility built in.
---

# Handout formatting

Convert a pile of look-inconsistent source documents into uniform, print-ready
handouts. The source can be `.docx`, `.pdf` (typed or Word-exported), scans of
handwriting, or pasted text. The output is clean LaTeX that follows a house
style and compiles to a polished PDF — and the *same* `.tex` produces a blank
student handout, an answer key, or a teacher copy by flipping one package
option.

This skill is subject-agnostic. The original recipe it generalizes was a math
course; the same machine handles a Spanish reading-and-vocab sheet, a history
primary-source packet, or a chemistry problem set.

## When to use

Reach for this when someone has rough materials and wants them issued cleanly
and consistently: "reformat these worksheets," "clean up this messy vocab
table," "make these readings match our template," "turn this Word doc into a
nice PDF," "give me a student and a key version."

## What you need

Two external tools (state them plainly; do not assume a full TeX install):

- **`tectonic`** — the LaTeX engine. Single binary, Unicode-native (so accented
  and non-Latin text compiles directly), downloads packages on demand.
  `brew install tectonic` or see <https://tectonic-typesetting.github.io>.
- **`pandoc`** — converts `.docx` to a LaTeX/Markdown starting point.
  `brew install pandoc`. Optional but strongly recommended for Word sources.
- **`pdftotext`** (poppler) — pulls text out of typed PDFs. `brew install poppler`.

If a tool is missing, say so and offer the closest path you can run.

## The two style packages (the house style)

The look and the behaviour are split into two files, shipped in
[styles/](styles/):

- **[styles/housestyle.sty](styles/housestyle.sty)** — the *look*: a plain
  black-and-white, standard problem-set aesthetic. Unicode-first fonts, a
  centered title block (`\handouttitle`), plain bold section headings (a rule
  under `\section`), a thin-ruled callout box (`\calloutbox`), a bold numbered
  label (`\numbox`), a clean `vocabtable`, `\dialogue`/`\gloss` helpers, and the
  PDF accessibility metadata. Nothing decorative or colored.
- **[styles/handout.sty](styles/handout.sty)** — the *behaviour*: the content
  environments (`exercise`, `solution`, `note`, `passage`, `\fitb`) and the
  audience switch. `\usepackage[]{handout}` = student, `[key]` = answer key,
  `[teacher]` = key plus teacher notes. **The body is written once**; the
  audience is a compile option, never a forked file.

Keeping look and behaviour apart means a department can drop in its own visual
layer without touching the exercise logic.

### Matching a provided template instead of the default

If the user hands over an existing template or an exemplar document they want
matched, **follow it instead of the default house style**:

1. Read the exemplar. Pull its preamble (colors, fonts, section formatting,
   title block, any custom macros) into a `housestyle.sty` built from *that*
   template, keeping the same `handout.sty` behaviour layer.
2. If the template depends on a package that was not supplied, **reconstruct it
   from how the template uses it** so you stay unblocked, and keep the provided
   package untouched — own your additions in the companion `housestyle.sty`. If
   the real package arrives later it drops straight in.

## Workflow

Work one source document at a time.

1. **Set up the style.** Copy `styles/housestyle.sty` and `styles/handout.sty`
   into the output directory (or wherever the `.tex` will compile) so the
   handout compiles standalone. (Or build a `housestyle.sty` from a provided
   template, per above.)

2. **Ingest the source into text and structure.** See
   [reference/ingestion.md](reference/ingestion.md). In short: `.docx` via
   `pandoc`, typed `.pdf` via `pdftotext -layout`, scans via OCR
   (`tesseract`) or by reading the page image directly. Treat extraction as a
   *draft*, never the final answer.

3. **Convert to a house-style `.tex`.** See
   [reference/content-types.md](reference/content-types.md) for the mapping from
   each content type (prose, messy tables, vocab lists, dialogues, interlinear
   glosses, math, exercises, non-Latin scripts) to the right environment.
   Write the body once; put answers in `solution`/`\fitb` and teacher asides in
   `note` so all three audiences come from this one file.

4. **Compile and verify.** From the output directory, run `tectonic <file>.tex`.
   Fix errors and recompile until it builds cleanly, then render the PDF to an
   image and check it actually looks right. Build the student and key versions
   (and teacher, if asked) by changing only the `handout` option. The helper
   [scripts/build.sh](scripts/build.sh) compiles a whole tree.

5. **Accessibility pass.** Check the result against
   [reference/accessibility.md](reference/accessibility.md) (WCAG 2.1 AA): text
   labels not color alone, AA contrast, PDF language + title, real sectioning.
   Note honestly anything the engine cannot do (tagged PDF / equation alt text).

## Invariants worth keeping

- **One source, every audience** — never fork the body to make a key. If you
  catch yourself editing the body to hide an answer, gate it with `solution`,
  `\fitb`, `\studentonly`, or `note` instead.
- **`inputs/` is read-only.** A cleaned or converted version is always an
  *output*, never an edit in place.
- **Not done until it compiles** and you have looked at the rendered page.
  Extraction scatters tables and math; reassemble and verify, don't trust the
  raw dump.
- **Preserve the source's meaning, fix its typography.** Clean up inconsistent
  spacing, broken tables, and OCR noise; do not silently change content (a
  vocabulary gloss, a date, a problem's numbers).
- **For anything you cannot reproduce** (a complex figure, a photo), insert
  `% FIGURE OMITTED: <description>` where it belongs and keep going.
