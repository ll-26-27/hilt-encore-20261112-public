**Source review:** read [AUDIT.md](AUDIT.md) for the November 12 checks and unresolved issues in these materials.

# Research helper

This example reads a folder of research papers and produces one HTML summary per
paper. Each output separates a neutral account of the paper from a section that
relates the findings to a specific research question.

The sample corpus contains four papers about long-context performance in large
language models. The completed summaries and a linked index are in `outputs/`.

## How it works

The prompt at
[`operations/01-generate-research-summary-prompt.md`](operations/01-generate-research-summary-prompt.md)
asks the assistant to read each source and create an HTML file with:

1. publication details and a one-sentence plain-language description;
2. a neutral summary of the claim, method, evidence, and limitations;
3. a short list of key findings;
4. a separate discussion of implications for teaching and research with LLM
   tools; and
5. a citation and link back to the output index.

The interpretive section must identify speculation and state when a paper has
limited relevance to the research question. Keeping it separate from the
neutral summary helps readers distinguish the paper's claims from the
project's interpretation.

## File handling

- Input filename prefixes such as `01_` and `14_` are retained in the
  corresponding output names.
- [`outputs/index.html`](outputs/index.html) links to all summaries.
- The HTML files use inline styling. Some summaries also refer to local figures
  in `outputs/assets/`.
- Regenerating a summary replaces the existing file with the same name.

## Using another set of papers

1. Add the sources to `inputs/` and use stable, unique filename prefixes.
2. Update the research question in the prompt.
3. Run the prompt and write results to `outputs/`.
4. Check citations, quotations, reported methods, numerical results, and stated
   limitations against the original papers.
5. Update the output index.

## Limitations

These summaries are reading aids, not substitutes for the papers. PDF extraction
can lose tables, equations, footnotes, and page structure. A model can also
misstate a result or make the interpretive section sound more certain than the
source supports. Important claims should be checked in the original document.

The same two-section structure can be used for course-reading reviews,
literature searches, policy sources, or other tasks where a factual summary
must remain distinct from an analysis written for a particular purpose.
