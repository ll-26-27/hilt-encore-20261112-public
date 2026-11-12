---
title: One source, every handout
order: 12
index: "Compare a rough Spanish worksheet and scanned mathematics handouts with their formatted outputs. One source holds the content, a shared style controls the presentation, and an audience setting produces the student copy or answer key. The example shows both the reusable workflow and the checks that still need human attention."
source: ""
image: "/examples/handout-formatting/es-key-2.png"
---

## What this is

Course handouts pile up in every format: a Word file with three kinds of dashes in its vocabulary list, a PDF of a worksheet someone typed years ago. This takes them in and gives back clean, consistent LaTeX handouts. The point worth seeing is the split: one file holds the content, a second holds the look, and a third decides who's reading. Change one word at the top and the same source prints the student copy or the answer key, with the answers dropped into the blanks. Below, a Spanish worksheet from draft to student copy to key, and a differential-equations worksheet before and after.

## How we made it

A Claude Code skill, `handout-formatting`, in the workshop folder. It reads the source (pandoc for Word, `pdftotext` for typed PDFs, image reading for scans), maps each block (prose, a messy table, vocabulary, a conjugation chart, exercises, equations) to an environment in a shared `handout.sty`, writes the body once, and compiles with `tectonic`. All the visuals live in `housestyle.sty`; to match a department's template you rebuild that file and keep the rest. An answer key is a two-line file that sets the audience and includes the one source. It was first built for math in an earlier workshop, then generalized so a Spanish sheet and a math worksheet come out of the same two packages.

What went wrong, or isn't done: the PDFs aren't fully tagged for screen readers and the equations have no alt text, because `tectonic` can't produce either; the accessibility report says so and names the fix (compile the final copy with `lualatex` and `tagpdf`). The math had to be reassembled by hand from extracted text, so a PDF that compiles can still have a wrong sign, and every page has to be looked at. The source supports a teacher copy too, but none was built for these examples. The page images here were rendered from the saved PDFs on November 12.

## Source

- The use case, with the skill, inputs, outputs, and the accessibility report: `workshop-folder/02-further-use-cases/handout-formatting/`
