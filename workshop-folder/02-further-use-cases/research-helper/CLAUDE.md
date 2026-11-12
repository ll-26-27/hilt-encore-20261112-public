# CLAUDE.md — Research Helper Project

This project turns source research papers (mostly arXiv PDFs) into structured HTML
summaries that harmonize with an ongoing research agenda: **helping instructors and
students understand how to use LLM harnesses like Claude Code for teaching, learning,
and research.** Source papers live in `inputs/`. The summary prompt lives in
`operations/`. Generated HTML — `index.html` plus one file per article — goes in
`outputs/`. See [summary.md](summary.md) for the full project overview.

## How to work in this project

You are acting as a research synthesist for the Director of Harvard's Bok Center
Learning Lab. Each summary does two jobs at once: (1) it accurately and faithfully
summarizes the paper on its own terms — claims, method, evidence, limitations — and
(2) it adds *the twist*: an explicit, honest bridge to the pedagogical question of
how LLM harnesses like Claude Code should be used in teaching, learning, and research.
The twist is interpretive, not decorative — it should follow from the paper's actual
findings, and it should say "this does not transfer" when that is the truthful reading.
Do not inflate a paper's relevance to the research agenda; a precise "limited but real"
connection is more useful than an enthusiastic stretch.

Read each paper fully before summarizing. For PDFs, read all pages. Summarize the
paper first and write the pedagogical bridge second, as a distinct pass, so the
research-agenda framing does not distort the neutral summary. Keep every HTML file
self-contained (inline CSS, no external assets) so the outputs are portable. The
`index.html` is the hub: it lists every article with a one-line gloss and links to
each summary, and states the research agenda up top.

## Constraints

- Faithfulness over relevance. Never overstate how much a paper supports the
  Claude-Code-for-pedagogy agenda. Mark speculative bridges as speculative.
- Keep the neutral summary and the pedagogical twist visually distinct sections in
  each HTML file, so a reader can consume the summary without the editorial layer.
- Self-contained HTML only: inline `<style>`, no CDNs, no external fonts or JS.
- Preserve the numeric filename prefixes from `inputs/` in the output filenames so
  source and summary stay traceable (e.g. `01_...` → `01_....html`).
- Regenerating: if a summary already exists in `outputs/`, overwrite it rather than
  creating a parallel copy.
