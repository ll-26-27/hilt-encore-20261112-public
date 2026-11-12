# ll-utilities

Small scripts that call AI models, one script per call, written by the Learning Lab for people who want to read every line. Plain Node.js 22 or later, no packages to install.

- **`huit/`**: Harvard's own AI API gateways, run by HUIT. HUIT's documentation says which data levels each gateway is approved for; [`../_context/huit/`](../_context/huit/) records what it says, gateway by gateway. You need your own HUIT key from the Harvard API Portal.
- **`external/`**: tools outside Harvard (fal and others). **They are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.** See [`external/README.md`](external/README.md).
- **`lib/`**: shared helpers: [`env.mjs`](lib/env.mjs) finds keys and hides them in dry runs; [`gateways.mjs`](lib/gateways.mjs) holds each HUIT gateway's address, key name, and header.
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
| [`huit/claude.mjs`](huit/claude.mjs) | Amazon Bedrock v2 · `POST /v2/model/<model>/converse` | one prompt to Claude, answer printed (and saved with `--out`); `--file` adds text files, `--system`, `--max-tokens`, `--model`; `--list-models` (free, `GET /v2/inference-profiles`) | 2026-11-12 · `us.anthropic.claude-sonnet-5-5` and `us.anthropic.claude-haiku-5-5` · a one-line greeting (1.2 s) and a one-sentence summary of a made-up notes file (1.3 s) |
| [`huit/gpt.mjs`](huit/gpt.mjs) | OpenAI Direct v2 · `POST /responses` | one prompt to an OpenAI model, answer printed (and saved with `--out`); `--file`, `--system`, `--effort`, `--max-tokens`, `--model` | 2026-11-12 · `gpt-5-mini` · a one-line greeting (1.1 s) and a one-sentence summary of a made-up notes file (1.6 s) |
| [`huit/gemini.mjs`](huit/gemini.mjs) | Google Gemini · `POST /v1beta/models/<model>:generateContent` | one prompt to Gemini, answer printed (and saved with `--out`); `--file` takes text files as text and PDFs or images as data the model reads; `--system`, `--max-tokens`, `--model` | 2026-11-12 · `gemini-3.5-flash` · a greeting (2.4 s), a one-sentence summary of a made-up notes file (3.5 s), a description of a generated image (3.5 s), and the three claims from a made-up one-page PDF (2.7 s) |
| [`huit/gpt-image.mjs`](huit/gpt-image.mjs) | OpenAI Direct v2 · `POST /images/generations` | prompt in, PNG out, with a `.json` beside it (prompt, model, token usage); `--size`, `--quality`, `--model` | 2026-11-12 · `gpt-image-1-mini`, quality low · a 1024×1024 PNG of a teapot in a graduation cap in 7.3 s |
| [`huit/embed.mjs`](huit/embed.mjs) | OpenAI Direct v2 · `POST /embeddings` | texts (arguments, or each line of `--lines` file) in; with two or more, prints the most similar pairs (cosine); `--out` saves the vectors as JSON | 2026-11-12 · `text-embedding-3-small` · three made-up sentences: cat ~ kitten 0.68, either ~ budget report 0.05 |

Gateway notes from testing:

- **Transcription:** HUIT forces `response_format=verbose_json`, so every transcript comes back with segments and timings; the script keeps that JSON beside the Markdown. `whisper-1` is the model HUIT documents, and the only one that works: the key also lists `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`, and `gpt-4o-transcribe-diarize`, but HUIT rewrites `response_format` to `verbose_json` even when you send `json`, and those models answer HTTP 400 ("response_format 'verbose_json' is not compatible with model 'gpt-4o-transcribe' … Use 'json' or 'text' instead"; tested Nov 12 with `gpt-4o-transcribe` and `gpt-transcribe`).
- **Gemini images:** the gateway's model list (`GET /v1beta1/publishers/google/models`, no charge) showed these image models on Nov 12: `gemini-3.1-flash-image` (tested), `gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, `gemini-3.1-flash-image-preview`, `gemini-nano-banana-2.1` (listed, not tested).
- **Quota:** each key is its own app with its own monthly budget; when it runs out, calls get HTTP 429 until the period resets. HUIT returns the limit and what remains, not what was spent, so the script subtracts. Run it before and after a call to see what the call cost.
- **Claude on Bedrock:** model IDs need the `us.` or `global.` prefix (inference profiles), e.g. `us.anthropic.claude-sonnet-5-5`; `--list-models` shows them. The script uses `converse`, which takes the same body for every model; Fable models were not tested with it. **Fable:** HUIT's Bedrock documentation says Fable 5 runs in provider data share mode (Bedrock may retain inputs and share them with Anthropic), unlike every other model there, so `claude.mjs` warns before sending to any Fable model; send it no confidential data (see [`../_context/data-security/`](../_context/data-security/)).
- **GPT-5 models** count their reasoning against `max_output_tokens`; with a small limit the answer can come back empty (`status: incomplete`). `gpt.mjs` defaults to 4000 and says so when an answer is cut off. `--effort minimal` is fastest for short tasks.
- **Gemini text:** Gemini 3.5 models think before answering and count that against `--max-tokens` (a one-line answer used about 400 tokens), so the default is 4000. The gateway's model list also shows `gemini-3.5-transcribe`, `gemini-embedding-2`, and TTS models (not tested).
