# ll-utilities

Small scripts that call AI models, one script per call, written by the Learning Lab for people who want to read every line. Plain Node.js 22 or later, no packages to install.

- **`huit/`**: Harvard's own AI API gateways, run by HUIT. HUIT's documentation says which data levels each gateway is approved for; [`../_context/huit/`](../_context/huit/) records what it says, gateway by gateway. You need your own HUIT key from the Harvard API Portal.
- **`external/`**: tools outside Harvard (fal and others). **They are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.** See [`external/README.md`](external/README.md).
- **`lib/`**: a few shared helpers (finding keys, masking them).
- **`test/`**: tests. `node --test ll-utilities/test/` runs the dry-run tests, which need no keys and send nothing; [`test/live.md`](test/live.md) lists the live tests.

## Keys

Copy `.env.example` (at the repo root) to `.env` and fill in the keys you have. Scripts read keys from the shell environment, or from `.env` at the repo root if the shell doesn't have them, so both of these work:

```
node --env-file=.env ll-utilities/huit/transcribe.mjs clip.m4a
node ll-utilities/huit/transcribe.mjs clip.m4a
```

Every script has `--help` and `--dry-run`. A dry run prints the request it would send, with the key hidden, and sends nothing. Start there.

## HUIT scripts

Each was written fresh against HUIT's documentation and run once against the live gateway with a tiny, made-up input. "Tested" says when, with what model, and what happened.

| script | HUIT API · endpoint | what it does | tested |
| --- | --- | --- | --- |
| [`huit/transcribe.mjs`](huit/transcribe.mjs) | OpenAI Direct v2 · `POST /audio/transcriptions` | audio file (25 MB max) in; `<name>.transcript.md` and the raw `<name>.transcript.json` out beside it. Options: `--language`, `--prompt`, `--timestamps` | 2026-11-12 · `whisper-1` · a 5-second clip made with macOS `say`, transcribed correctly in 2.2 s |
| [`huit/gemini-image.mjs`](huit/gemini-image.mjs) | Google Gemini · `POST /v1beta/models/<model>:generateContent` (image output) | prompt in, image out; `--ref` adds reference images (sent as inlineData) to edit or restyle; `--aspect`; saves a `.json` beside it with the prompt, model, and token usage | 2026-11-12 · `gemini-3.1-flash-image` · a 1024×1024 PNG from a prompt in 9 s, and the same scene redrawn at night from a reference image in 10 s |
| [`huit/quota.mjs`](huit/quota.mjs) | all three gateways · `GET /apigee/quota` | this period's budget per gateway: spent (limit − remaining), limit, what's left; free to run; `--json` for HUIT's raw answer | 2026-11-12 · no model · OpenAI Direct v2, Gemini, and Bedrock all answered |

Gateway notes from testing:

- **Transcription:** HUIT forces `response_format=verbose_json`, so every transcript comes back with segments and timings; the script keeps that JSON beside the Markdown. `whisper-1` is the model HUIT documents.
- **Gemini images:** the gateway's model list (`GET /v1beta1/publishers/google/models`, no charge) showed these image models on Nov 12: `gemini-3.1-flash-image` (tested), `gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, `gemini-3.1-flash-image-preview`, `gemini-nano-banana-2.1` (listed, not tested).
- **Quota:** each key is its own app with its own monthly budget; when it runs out, calls get HTTP 429 until the period resets. HUIT returns the limit and what remains, not what was spent, so the script subtracts. Run it before and after a call to see what the call cost.
