**Source review:** read [AUDIT.md](AUDIT.md) for the November 12 checks and unresolved issues in these materials.

# Research helper file guide

Read [`summary.md`](summary.md) for the purpose, workflow, and limitations of
this example.

## Source files

The `inputs/` folder contains four papers about long-context performance in
large language models:

- [`01_context-rot_hong-troynikov-huber_2025.md`](inputs/01_context-rot_hong-troynikov-huber_2025.md)
- [`02_lost-in-the-middle_liu_2024.pdf`](inputs/02_lost-in-the-middle_liu_2024.pdf)
- [`03_context-length-alone-hurts_du_2025.pdf`](inputs/03_context-length-alone-hurts_du_2025.pdf)
- [`14_fully-utilize-context_an_2024.pdf`](inputs/14_fully-utilize-context_an_2024.pdf)

The numeric prefixes link each source to its output.

## Operation

[`operations/01-generate-research-summary-prompt.md`](operations/01-generate-research-summary-prompt.md)
instructs the assistant to write a neutral summary and a separate interpretation for
each paper.

## Example outputs

- [`outputs/index.html`](outputs/index.html): linked list of all summaries
- `outputs/<source-name>.html`: one summary for each source
- `outputs/assets/`: local figures used by some summaries

To add papers, give them unique numeric prefixes, run the prompt, check the
result against each source, and update the output index.
