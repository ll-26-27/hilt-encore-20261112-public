# Further use cases

This folder contains six examples to explore after the main workshop use case.
Each example includes its source files, the instructions or code used to process
them, and sample results.

## How each example is organized

```text
<use-case>/
  inputs/        source material
  operations/    prompts, skills, and scripts
  outputs/       completed examples
  summary.md     purpose, workflow, and limitations
  index.md       file-by-file guide
  CLAUDE.md      Claude Code instructions; readable explicitly in other apps
```

Read `summary.md` first. Use `index.md` when you need to find a specific file.
The outputs are examples, not guaranteed results for new source material. These
workflows are provider-independent unless a page identifies a product-specific
feature. In ChatGPT Desktop or another app, ask the assistant to read the
example's `CLAUDE.md` before starting; Claude Code loads it automatically.

## Choose an example

| Use case | Input | Output | Main method |
|---|---|---|---|
| [`research-helper`](research-helper/) | Research papers | One HTML summary per paper and an index | Batch prompt with separate summary and interpretation sections |
| [`exam-makeup-generator`](exam-makeup-generator/) | An existing exam | Candidate questions and an assembled make-up exam | Multi-step skill with instructor review |
| [`manuscript-transcription`](manuscript-transcription/) | German Fraktur/Kurrent scans, readings and provenance | Compared transcriptions, English translations and a reading room | Saved readings → line alignment → translation → reading-room HTML |
| [`interview-coding`](interview-coding/) | Synthetic interview transcripts and a protocol | Indexed transcripts, negative-case memos, and a methods paragraph | Three skills aligned with flexible coding (Deterding & Waters 2021; online 2018), with a correction log |
| [`handout-formatting`](handout-formatting/) | Word and PDF course materials | Consistent student and answer-key PDFs | LaTeX templates and a reusable conversion skill |
| [`physics-interactives`](physics-interactives/) | GENED 1104 cooking observations and equations | Four standalone cooking simulations | Observation → mathematical model → interactive representation → checks |

For a shorter example, begin with `research-helper`. For
an example of a reusable skill, use `exam-makeup-generator` or
`handout-formatting`. For qualitative research, use `interview-coding`, which
runs on synthetic transcripts. For archival and manuscript work, use
`manuscript-transcription`. The `physics-interactives` example has the most supporting
files and is best read after the simpler examples.
