# Reading-room-only snapshot

The selected output was fetched from `http://127.0.0.1:8765/01-use-cases/transcription/04-reading-room/outputs/index.html` on 2026-11-12. Its bytes match the source project's saved HTML. This bundle includes that one case, its inputs, saved build and translations, six raw cached translation replies, and the runtime modules/templates needed to reproduce it. Other transcription cases and mapping data are omitted.

Run from this `german-project/` directory with uv and Python 3.11 or 3.12:

```sh
uv sync --extra text --extra dev
uv run python 01-use-cases/transcription/04-reading-room/operations/00-collect-inputs.py
uv run python -m mueser.reading build --case 01-use-cases/transcription/04-reading-room
uv run python -m mueser.reading serve --case 01-use-cases/transcription/04-reading-room --who workshop
```

The first operation now verifies the already-collected input files; it does not depend on the omitted layout/hybrid case. The original provenance retains paths into that upstream project. The saved build and translations are sufficient to rebuild without API calls. Rebuilding changes repository/path provenance in the HTML; preserve the fetched artifact if exact bytes are needed.

Operations 01 and 02 document how the saved build and translation run were made. For a fresh run, choose new build/run IDs instead of replacing the included records. Translation reruns require your own OPENROUTER_API_KEY. Browser viewing needs no credentials or install; keep the inputs directory beside outputs for the scans.

The source case README records upstream methods and validation; references to other cases or project context refer to the original Mueser project. See ../../../../nextjs/EMBEDDING.md for the integration handoff.
