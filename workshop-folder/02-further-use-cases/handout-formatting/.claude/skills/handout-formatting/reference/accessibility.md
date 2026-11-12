# Accessibility — WCAG 2.1 AA for handouts

Course materials and the PDFs shared through a learning management system are
typically in scope for an institution's digital accessibility policy, which for
U.S. universities usually adopts **WCAG 2.1 Level AA** (aligned with Section 508
and the ADA). Treat the shared house style as the unit of compliance: fix it
once and every handout inherits the fix.

If the institution is known, look up its policy and cite the source in your
report. For example, Harvard's policy is at
<https://accessibility.huit.harvard.edu/digital-accessibility-policy>.

## Checklist (and how the house style already meets it)

| Criterion | What to check | House-style default |
| --- | --- | --- |
| **Use of Color (1.4.1)** | Is any meaning carried by color alone? | The default is monochrome, so nothing rests on color. The `solution` and `note` boxes also carry **text labels** ("Solution.", "Teacher note."), so they stay distinguishable. Keep a text label on any new box. |
| **Contrast (1.4.3)** | Every text-on-fill and link color ≥ 4.5:1 (3:1 large). | The default style is **black text on white** throughout (no color), so contrast is maximal. If you swap in a colored visual layer, re-check every text-on-fill and link color. |
| **Language (3.1.1)** | PDF language set so a screen reader announces correctly. | `housestyle.sty` sets `pdflang=en-US`. **Override per document** for other languages: `\hypersetup{pdflang={es-ES}}`. |
| **Name, Role, Value / metadata** | Document title in PDF metadata. | Set `\hypersetup{pdftitle={...}}` in every `.tex`; `pdfdisplaydoctitle=true` is on. |
| **Info & Relationships (1.3.1)** | Headings are real structure, not just big text. | Use `\section`/`\subsection` (rendered as plain bold headings, structurally real headings). Do not fake a heading with `\textbf{\Large ...}`. |
| **Reading order** | Content flows in logical order. | Single-column flow is fine; if you use `multicol`, check the rendered order. |

## The honest gap

Two things WCAG wants for PDFs are **not** fully achievable with `tectonic`
(xetex-based):

1. **Tagged PDF** (structure tags, defined reading order for assistive tech).
   Full tagging needs the LaTeX PDF-management layer with `lualatex` + `tagpdf`.
2. **Equation alt text.** `axessibility` embeds each equation's LaTeX as
   actual/alt text but depends on the same PDF-management layer.

**Fallbacks**, in order of effort:

- Compile the final deliverable with `lualatex` + `tagpdf` (and `axessibility`
  for math) when full tagging is required. The same `.tex` source works;
  only the engine changes.
- Validate the PDF in a checker (PAC 2024, or Adobe Acrobat's accessibility
  check) and remediate there.
- For text content (no math), keeping everything as real selectable Unicode
  text — which this skill does — already covers the most common screen-reader
  failure (text-as-image).

State which of these you did, and which gap remains, in the report.
