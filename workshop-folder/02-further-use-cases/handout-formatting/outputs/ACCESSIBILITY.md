# Accessibility report — the handout house style

This applies the skill's checklist
([.claude/skills/handout-formatting/reference/accessibility.md](../.claude/skills/handout-formatting/reference/accessibility.md))
to the worked Spanish demo in [outputs/spanish/](spanish/). The two style
packages are the unit of compliance: fixing them once makes every handout built
on the house style inherit the fix.

## Governing standard

U.S. universities typically adopt **WCAG 2.1 Level AA** for digital course
materials and PDFs (aligned with Section 508 / ADA). For Harvard specifically,
see the Digital Accessibility Policy:
<https://accessibility.huit.harvard.edu/digital-accessibility-policy>. So
"accessible" here means: meets WCAG 2.1 AA.

## Findings and what the house style does

| Criterion | Finding | In the house style |
| --- | --- | --- |
| Use of Color (1.4.1) | Could any cue rest on color? | The default style is monochrome, so none does. The Solution and Teacher Note boxes also carry **text labels** ("Solution.", "Teacher note.") in `handout.sty`. |
| Contrast (1.4.3) | Every text-on-fill and link color must meet AA. | The style is **black text on white** throughout (no color), so contrast is maximal. |
| Language (3.1.1) | A Spanish handout announced as English would mislead a screen reader. | `housestyle.sty` defaults `pdflang=en-US`; the demo **overrides per document** with `\hypersetup{pdflang={es-ES}}`. Set this for every non-English handout. |
| Metadata / doc title | No title in PDF metadata. | Each `.tex` sets `\hypersetup{pdftitle={...}}`; `pdfdisplaydoctitle=true` is on. |
| Info & Relationships (1.3.1) | Are headings real structure? | They are produced by real `\section`/`\subsection` (rendered as plain bold headings), so the logical heading structure is intact. |
| Text not image | Source diacritics and accents. | Kept as real Unicode text (`café`, `niño`, `levantáis`), not images — selectable and screen-reader-readable. |

## The remaining gap (documented honestly)

`tectonic` (xetex-based) cannot produce a fully **tagged PDF** or embed
**equation alt text** (`tagpdf` / `axessibility` need the LaTeX PDF-management
layer via `lualatex`). This demo is prose-and-table Spanish with no equations,
so the equation gap does not bite here; the tagging gap does.

Fallbacks, in order of effort:

1. Compile the final deliverable with `lualatex` + `tagpdf` when full tagging is
   required — the same `.tex` source works, only the engine changes.
2. Validate and remediate the PDF in a checker (PAC 2024 or Acrobat).

For a text/table handout like this one, keeping all content as real selectable
Unicode text already closes the most common screen-reader failure
(text-as-image).
