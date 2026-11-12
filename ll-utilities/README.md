# ll-utilities

Small scripts that call AI models, one script per call, written by the Learning Lab for people who want to read every line. Plain Node.js 22 or later, no packages to install.

- **`huit/`**: Harvard's own AI API gateways, run by HUIT. HUIT's documentation says which data levels each gateway is approved for. You need your own HUIT key from the Harvard API Portal (https://portal.apis.huit.harvard.edu, HarvardKey).
- **`external/`**: tools outside Harvard (fal and others). **They are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.** See [`external/README.md`](external/README.md).
- **`video/`**: local video tools (ffmpeg and ffprobe on your machine, nothing sent anywhere) for getting sound bites into an editor; see [Video scripts](#video-scripts) below.
- **`lib/`**: shared helpers: [`env.mjs`](lib/env.mjs) finds keys and hides them in dry runs; [`sse.mjs`](lib/sse.mjs) reads streamed answers (server-sent events) for `--stream`; [`gateways.mjs`](lib/gateways.mjs) holds each HUIT gateway's address, key name, and header.
- **`test/`**: tests. `node --test ll-utilities/test/` runs the dry-run tests, which need no keys and send nothing, and a check that [`AGENTS.md`](AGENTS.md) names every option in every script's `--help`; [`test/live.md`](test/live.md) lists the live tests.

**Every option of every script** is in [`AGENTS.md`](AGENTS.md): the endpoint each calls, each option's type, default, and allowed values, the keys it reads, the files it writes, what it prints, and how it fails. It's written so an AI agent can call the scripts correctly, and it's the fullest reference for people too. This README is the overview and the test record.

## The data rule

**HUIT scripts are the route for anything sensitive, within the data levels HUIT approves each gateway for; external tools (fal, OpenRouter) are not Harvard-approved, so send them only public (Level 1) or made-up material, never confidential data.** If you can't tell what a file contains, don't send it until you know. Harvard's data classification: https://privsec.harvard.edu/data-classification-table; HUIT's generative AI guidelines: https://huit.harvard.edu/ai/guidelines.

## Where the scripts are

In this repository, at `ll-utilities/`: `huit/` (one script per HUIT call), `external/` (fal), `video/` (local video tools), `lib/` (shared helpers), `test/` (tests and the live-test record). Run every script from the repository root, as `node ll-utilities/<folder>/<script>.mjs`.

## Keys

Copy `.env.example` (at the repository root) to `.env` there and fill in the keys you have; `.env` is gitignored, so your keys stay on your computer. How a Harvard person gets a HUIT key: register an app in the Harvard API Portal with a HUIT billing number, and HUIT approves it by email. Scripts read keys from the shell environment, or from `.env` at the repo root if the shell doesn't have them, so both of these work:

```
node --env-file=.env ll-utilities/huit/transcribe.mjs clip.m4a
node ll-utilities/huit/transcribe.mjs clip.m4a
```

Every script has `--help` and `--dry-run`. A dry run prints the request it would send, with the key hidden, and sends nothing. Start there.

## HUIT scripts

Each was written fresh against HUIT's documentation and run once against the live gateway with a tiny, made-up input. "Tested" says when, with what model, and what happened.

| script | HUIT API · endpoint | what it does | tested |
| --- | --- | --- | --- |
| [`huit/transcribe.mjs`](huit/transcribe.mjs) | OpenAI Direct v2 · `POST /audio/transcriptions` | audio file (25 MB max), or a video's sound (extracted with ffmpeg), in; `<name>.transcript.md` and the raw `<name>.transcript.json` out beside it. Options: `--language`, `--prompt`, `--timestamps`; `--words` also writes `<name>.words.json`, every word's start and end plus the video's frame rate and timecode, for sound bites | 2026-11-12 · `whisper-1` · a 5-second clip made with macOS `say`, transcribed correctly in 2.2 s; `--words`: a made-up 14-second test video, 46 words timed, in 1.7–2.6 s |
| [`huit/gemini-image.mjs`](huit/gemini-image.mjs) | Google Gemini · `POST /v1beta/models/<model>:generateContent` (image output) | prompt in, image out; `--ref` adds reference images (sent as inlineData) to edit or restyle; `--aspect`; saves a `.json` beside it with the prompt, model, and token usage | 2026-11-12 · `gemini-3.1-flash-image` · a 1024×1024 PNG from a prompt in 9 s, and the same scene redrawn at night from a reference image in 10 s |
| [`huit/quota.mjs`](huit/quota.mjs) | all three gateways · `GET /apigee/quota` | this period's budget per gateway: spent (limit − remaining), limit, what's left; free to run; `--json` for HUIT's raw answer | 2026-11-12 · no model · OpenAI Direct v2, Gemini, and Bedrock all answered |
| [`huit/claude.mjs`](huit/claude.mjs) | Amazon Bedrock v2 · `POST /v2/model/<model>/converse` | one prompt to Claude, answer printed (and saved with `--out`); `--file` adds text files, `--system`, `--max-tokens`, `--model`; `--list-models` (free, `GET /v2/inference-profiles`) | 2026-11-12 · `us.anthropic.claude-sonnet-5-5` and `us.anthropic.claude-haiku-5-5` · a one-line greeting (1.2 s) and a one-sentence summary of a made-up notes file (1.3 s) |
| [`huit/gpt.mjs`](huit/gpt.mjs) | OpenAI Direct v2 · `POST /responses` | one prompt to an OpenAI model, answer printed (and saved with `--out`); `--file`, `--system`, `--effort`, `--max-tokens`, `--model`; `--stream` prints the answer as it arrives | 2026-11-12 · `gpt-5-mini` · a one-line greeting (1.1 s) and a one-sentence summary of a made-up notes file (1.6 s); `--stream`: two sentences, 52 pieces arriving 0.8–1.5 s |
| [`huit/gemini.mjs`](huit/gemini.mjs) | Google Gemini · `POST /v1beta/models/<model>:generateContent` | one prompt to Gemini, answer printed (and saved with `--out`); `--file` takes text files as text and PDFs or images as data the model reads; `--system`, `--max-tokens`, `--model`; `--stream` prints the answer as it arrives (`:streamGenerateContent`); `--count` shows the input tokens first and sends nothing to the model (`:countTokens`) | 2026-11-12 · `gemini-3.5-flash` · a greeting (2.4 s), a one-sentence summary of a made-up notes file (3.5 s), a description of a generated image (3.5 s), and the three claims from a made-up one-page PDF (2.7 s); `--stream`: answered in 3.3 s, in two large chunks (it thinks first); `--count`: 49 tokens for a made-up notes file, 1,684 for a PDF plus an image |
| [`huit/gpt-image.mjs`](huit/gpt-image.mjs) | OpenAI Direct v2 · `POST /images/generations`; with `--ref`, `POST /responses` (`image_generation` tool) | prompt in, PNG out, with a `.json` beside it (prompt, model, token usage); `--size`, `--quality`, `--model`; `--ref` adds reference images to edit or redraw (HUIT blocks `/images/edits`, so these go through `/responses`; `--responses-model` picks the model that calls the tool) | 2026-11-12 · `gpt-image-1-mini`, quality low · a 1024×1024 PNG of a teapot in a graduation cap in 7.3 s; `--ref`: a made-up comic character redrawn on a rooftop at night from a 640-pixel reference, through `gpt-5-mini`, in 20.0 s, face, hair, glasses, and cardigan kept |
| [`huit/embed.mjs`](huit/embed.mjs) | OpenAI Direct v2 · `POST /embeddings` | texts (arguments, or each line of `--lines` file) in; with two or more, prints the most similar pairs (cosine); `--out` saves the vectors as JSON | 2026-11-12 · `text-embedding-3-small` · three made-up sentences: cat ~ kitten 0.68, either ~ budget report 0.05 |

## Video scripts

Local: they run ffmpeg and ffprobe on your machine and send nothing anywhere (`brew install ffmpeg`). Together with `huit/transcribe.mjs --words` and a model to pick, they take a recording to sound bites in an editor: transcribe with word timings, pick bites as word ranges (ask a model through `huit/claude.mjs`, then `makeLedger` in `lib/media.mjs`), cut review clips, and write a timeline. They're ported from the Learning Lab's HUIT-hackathon soundbites tools and keep the same ledger format (`<name>.bites.json`: each bite's words, frames, and source timecode, and whether it has been cut or exported). Drop-frame timecode and variable frame rate are refused. Every option is in [`AGENTS.md`](AGENTS.md#video-scripts-video-local-nothing-sent-anywhere).

| script | what it does | tested |
| --- | --- | --- |
| [`video/probe.mjs`](video/probe.mjs) | a video's frame rate, length, start timecode (from its tmcd track), picture size, sound; `--json` for everything | 2026-11-12 · the made-up test video (30 fps, tmcd 10:00:00:00, 431 frames) read correctly; a drop-frame file and a variable-frame-rate file refused |
| [`video/clips.mjs`](video/clips.mjs) | one H.264 review clip per bite, starting exactly on its first frame, carrying its source timecode; records each in the ledger | 2026-11-12 · three clips of 100, 123, and 85 frames, timecodes 10:00:01:28 onward; each clip's first frame matched the source's in-frame (PSNR 49.8 dB against about 25 dB for the frames either side) |
| [`video/timeline.mjs`](video/timeline.mjs) | the bites as a string-out linked to the original media at its timecode: `.fcpxml` (Final Cut), `.xml` (Final Cut 7 XML, for Premiere and Resolve), `.edl` (CMX3600); `--with` adds a second camera placed by timecode | 2026-11-12 · on the test video and a second camera 9 frames later: the Final Cut 7 XML is identical to what OpenTimelineIO's adapter writes (the form Premiere 2026 and Resolve 20 imported in the hackathon), plus picture dimensions; the FCPXML is valid against Final Cut's own FCPXML 1.8 DTD. **Not yet imported into Final Cut, Premiere, or Resolve from this port; the EDL is new and untested in editors.** |

To try them without real footage: `node ll-utilities/test/video-fixture.mjs --angle` makes a made-up pair of test videos in `_media/fixtures/bites/`.

Gateway notes from testing:

- **Word timings:** HUIT passes `timestamp_granularities[]=word` through to `whisper-1`: the answer has `words` (each with `word`, `start`, `end` in seconds) and no `segments`. Asking for `word` and `segment` together returns segments only, no words (tested Nov 12), so `--words` asks for words alone. The words carry no punctuation; the `text` field keeps it, and the Markdown uses it.

- **Streaming:** `gpt.mjs` and `gemini.mjs` stream with `--stream` (server-sent events). `claude.mjs` doesn't: Bedrock streams in AWS's binary event-stream format, which would need a decoder package. Gemini 3.5 thinks first, then sends a few large pieces, so streaming shows less there than with GPT.
- **Counting tokens:** HUIT's Gemini `:countTokens` takes the same body as `:generateContent`, as its spec says; Google's own `generateContentRequest` wrapper gets HTTP 400. It counts input only; the answer adds output (thinking included) up to `--max-tokens`.

- **Transcription:** HUIT forces `response_format=verbose_json`, so every transcript comes back with segments and timings; the script keeps that JSON beside the Markdown. `whisper-1` is the model HUIT documents, and the only one that works: the key also lists `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`, and `gpt-4o-transcribe-diarize`, but HUIT rewrites `response_format` to `verbose_json` even when you send `json`, and those models answer HTTP 400 ("response_format 'verbose_json' is not compatible with model 'gpt-4o-transcribe' … Use 'json' or 'text' instead"; tested Nov 12 with `gpt-4o-transcribe` and `gpt-transcribe`).
- **Gemini images:** the gateway's model list (`GET /v1beta1/publishers/google/models`, no charge) showed these image models on Nov 12: `gemini-3.1-flash-image` (tested), `gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, `gemini-3.1-flash-image-preview`, `gemini-nano-banana-2.1` (listed, not tested).
- **Quota:** each key is its own app with its own monthly budget; when it runs out, calls get HTTP 429 until the period resets. HUIT returns the limit and what remains, not what was spent, so the script subtracts. Run it before and after a call to see what the call cost.
- **Claude on Bedrock:** model IDs need the `us.` or `global.` prefix (inference profiles), e.g. `us.anthropic.claude-sonnet-5-5`; `--list-models` shows them. The script uses `converse`, which takes the same body for every model; Fable models were not tested with it. **Fable:** HUIT's Bedrock documentation says Fable 5 runs in provider data share mode (Bedrock may retain inputs and share them with Anthropic), unlike every other model there, so `claude.mjs` warns before sending to any Fable model; send it no confidential data (see [the data rule](#the-data-rule)).
- **OpenAI images:** `gpt-image-2` lettered a four-panel comic page exactly (46.5 s at quality medium, tested Nov 12) where `gpt-image-1-mini` garbled the words; use it when the image has text in it. Editing from a reference goes through `/responses` because HUIT doesn't allow `/images/edits`; the tool's `model` field and a forced `tool_choice` are both accepted.
- **GPT-5 models** count their reasoning against `max_output_tokens`; with a small limit the answer can come back empty (`status: incomplete`). `gpt.mjs` defaults to 4000 and says so when an answer is cut off. `--effort minimal` is fastest for short tasks.
- **Gemini text:** Gemini 3.5 models think before answering and count that against `--max-tokens` (a one-line answer used about 400 tokens), so the default is 4000. The gateway's model list also shows `gemini-3.5-transcribe`, `gemini-embedding-2`, and TTS models (not tested).
