# Ingestion — getting text and structure out of a source

The goal of this step is a faithful *draft* of the source's words, structure,
and any special notation. Extraction is never the final answer: it scatters
tables, splits equations, and drops accents. Reassemble in the conversion step.

Always keep the original in `inputs/` untouched. Write nothing back to it.

## Word documents (`.docx`)

`pandoc` is the right tool — it preserves headings, lists, tables, bold/italic,
and footnotes as structured markup.

```bash
# To a LaTeX starting point you then re-style into the house environments:
pandoc "inputs/source.docx" -o /tmp/source.tex
# Or to Markdown, which is often easier to read while you map content to style:
pandoc "inputs/source.docx" -t markdown -o /tmp/source.md
# Pull embedded images out too (figures, scanned equations):
pandoc "inputs/source.docx" --extract-media=/tmp/media -o /tmp/source.md
```

Do **not** paste pandoc's LaTeX in wholesale — it is a starting point for the
content, not the styling. Lift the text and table data; drop pandoc's preamble
and re-express structure with the house environments (`exercise`, `passage`,
`vocabtable`, `\section`, ...).

## Typed PDFs (Word-exported or born-digital)

```bash
pdftotext -layout "inputs/source.pdf" -    # -layout keeps columns/tables roughly aligned
```

`-layout` matters: without it, multi-column and tabular material collapses into
one stream. Even with it, tables arrive as ragged whitespace and must be
rebuilt by hand, and math arrives as scattered Unicode (see
[content-types.md](content-types.md)).

## Scans and handwriting

Two paths, best used together:

```bash
# OCR a scanned page (add a language pack for non-English, e.g. -l spa, -l deu):
tesseract "inputs/scan.png" stdout -l eng
# Render a PDF page to an image first if needed:
pdftoppm -png -r 200 "inputs/scan.pdf" /tmp/scanpage
```

Tesseract language packs install separately (`brew install tesseract-lang`).
For messy layouts, math, or handwriting, **also read the page image directly**
— open the rendered PNG and transcribe what OCR garbled. Reading the image is
usually more reliable than OCR for equations, diacritics, and tables.

## Pasted text / Markdown / plain text

No extraction needed. Go straight to conversion, but still treat structure
(which lines are exercises, which are answers, which is a vocab table) as
something you impose, not something the paste already carries.

## A note on encoding

Because the build engine is Unicode-native, keep accented and non-Latin
characters *as themselves* in the `.tex` (`café`, `niño`, `Ελληνικά`,
`日本語`) rather than escaping them. Only escape the LaTeX specials:
`& % $ # _ { } ~ ^ \`.
