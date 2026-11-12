# German reading room

This example is the exact HTML served at `http://127.0.0.1:8765/01-use-cases/transcription/04-reading-room/outputs/index.html`, plus the inputs and operations needed to produce it. The wider Mueser transcription examples are not included.

**Planned Next.js embed:** [reading-room output](german-project/01-use-cases/transcription/04-reading-room/outputs/index.html). See the repository's [embedding handoff](../../../nextjs/EMBEDDING.md).

| Stage | Contents |
|---|---|
| [Inputs](german-project/01-use-cases/transcription/04-reading-room/inputs/) | Three scans, metadata, consensus readings, diplomatic text, segmentation and provenance |
| [Operations](german-project/01-use-cases/transcription/04-reading-room/operations/) | Verify bundled inputs, settle/anchor lines, translate, build and review |
| [Outputs](german-project/01-use-cases/transcription/04-reading-room/outputs/) | Exact HTML, settled build, translations and run records |

The small `german-project/` package retains the upstream directory layout so the commands work without changing their case paths. It contains only the Python dependencies and web assets used by the reading room, its tests, and the six cached translation replies.

Open the HTML to inspect the scans, German text and English translations. Keep `inputs/pages/` in place: the HTML loads these images with relative paths. Review decisions are stored in the browser when the Python logging server is absent; use Export log to keep them.

See [run instructions](german-project/PORT.md). Model agreement does not certify a reading; the marked passages are for human review.
