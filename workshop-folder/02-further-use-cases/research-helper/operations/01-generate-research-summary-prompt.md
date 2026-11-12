# Prompt: Generate a Structured HTML Research Summary

Use this prompt after placing source papers in `inputs/`. It asks the assistant to produce
one self-contained HTML summary per paper plus an `index.html` hub, all written to
`outputs/`.

---

## How to share inputs

Provide the assistant with the papers in `inputs/`. These are arXiv-style research papers,
mostly PDFs plus the occasional Markdown
extract. The numeric filename prefix (`01_`, `02_`, …) is the article's ID and must
be preserved in the output filename.

State the research agenda explicitly so the "twist" has a target:

> **Research agenda:** Helping instructors and students understand how to use LLM
> coding agents and desktop AI apps for teaching, learning, and research.

---

## Prompt

```
I'm building a set of research summaries for a project on how instructors and
students should use coding agents and desktop AI apps for teaching, learning, and
research. I've shared a set of source papers in inputs/.

For EACH paper, produce one self-contained HTML file in outputs/ (inline CSS, no
external assets), with the same numeric prefix as the source file. Each summary must
contain, as visually distinct sections:

1. Header — title, authors, year, source (arXiv id/link if known), and a one-sentence
   plain-language gloss.
2. Neutral summary — what the paper claims, the method, the key evidence/results, and
   the stated limitations. Faithful to the paper on its own terms. No pedagogy here.
3. Key findings — a short bulleted list a busy reader can scan.
4. The twist: "Implications for teaching, learning & research with LLM harnesses" —
   an honest bridge from this paper's actual findings to how coding agents and similar
   harnesses should (or should not) be used in education and research. Mark
   speculative connections as speculative. If the paper's relevance is limited, say
   so plainly.
5. Footer — citation line and a back-link to index.html.

Then generate outputs/index.html: state the research agenda at the top, then list
every article (numeric ID, title, one-line gloss) with links to each summary.

Write the neutral summary before the twist, as separate passes, so the research
framing does not distort the factual summary. Faithfulness beats relevance: a precise
"limited but real" connection is better than an enthusiastic stretch.
```

---

## Output

Write to `outputs/`:
- `outputs/<NN>_<slug>.html` — one per source paper, prefix preserved
- `outputs/index.html` — the hub linking all summaries
