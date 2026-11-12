# ll-utilities: every script, for agents

This is the reference for calling these scripts correctly: what each does, the endpoint it calls, every option (type, default, allowed values), the environment it reads, what it writes, and how it exits. The human version is [`README.md`](README.md), which also records when each script was last tested live. Each script's `--help` is the source of truth; `test/agents-doc.test.mjs` fails if an option in any `--help` is missing here, so update both together.

## Rules that apply to every script

- **Run from the repository root** (the folder with `ll-utilities/` and `.env`): `node ll-utilities/<folder>/<script>.mjs …`. Plain Node 22 or later, no packages.
- **Keys** come from the shell environment first, then from `.env` at the repository root (`lib/env.mjs` loads it with `process.loadEnvFile`), so `node --env-file=.env …` and plain `node …` both work. Never print, log, or commit a key; never ask the person to paste one into the chat.
- **Data:** `video/` scripts are local: they run ffmpeg/ffprobe on this machine and send nothing anywhere. `huit/` scripts go through Harvard's HUIT gateways and are the route for anything sensitive, within what HUIT approves (see [the data rule](README.md#the-data-rule)). `external/` scripts go to companies outside Harvard: **public (Level 1) or made-up material only.** If you can't tell what an input contains, ask before sending it anywhere.
- **Order:** `--help`, then `--dry-run`, then a real run on a tiny input. Every call except `quota.mjs`, `claude.mjs --list-models`, and `fal-models.mjs` costs money on the key's budget.
- **`--dry-run`** (every script that calls a service or writes files) prints the request as JSON on stdout (`method`, `url`, `headers` with the key shown as `[hidden, N characters]`, `body`, and `writes` when the script saves a file), sends nothing, needs no key, and exits 0. Images and binary files are summarized as `<base64 of name (type, bytes)>`, not inlined.
- **Streams:** results (answers, file paths) go to **stdout**; progress, timings, token usage, and warnings go to **stderr**. To capture an answer, read stdout only.
- **Exit codes:** 0 on success (and for `--help` and `--dry-run`); 1 on any failure, with one line on stderr starting `<script>: ` (for example `gpt: HUIT answered HTTP 429 Too Many Requests` followed by the gateway's body, key redacted). Bad options or a missing required argument print the error and the help, then exit 1. No script retries; if a call fails, show the error rather than looping.
- **Overwriting:** scripts that write a fixed-name file refuse to replace an existing one unless given `--force` (`transcribe`, `gemini-image`, `gpt-image`, `video/timeline`); `video/clips` keeps a clip already cut for the same frames and refuses one cut for different frames. `--out` on the text scripts (`claude`, `gpt`, `gemini`, `embed`) overwrites without asking.
- **Gateway errors:** 401 is a wrong key or header; 403 is an app not approved for that API or a route HUIT doesn't allow; 429 is the key's budget used up for the period (check with `quota.mjs`); 400 usually means the model doesn't accept something in the body.

Environment variables (names only; values live in `.env`, see `../.env.example`):

| variable | used by | default |
| --- | --- | --- |
| `HUIT_OPENAI_API_KEY` | transcribe, gpt, gpt-image, embed, quota | required for those scripts |
| `HUIT_OPENAI_BASE_URL` | same | `https://apis.huit.harvard.edu/ais-openai-direct/v2` |
| `HUIT_GEMINI_API_KEY` | gemini, gemini-image, quota | required for those scripts |
| `HUIT_GEMINI_BASE_URL` | same | `https://apis.huit.harvard.edu/ais-google-gemini` |
| `HUIT_BEDROCK_API_KEY` | claude, quota | required for those scripts |
| `HUIT_BEDROCK_BASE_URL` | same | `https://apis.huit.harvard.edu/ais-bedrock-llm` |
| `FAL_API_KEY` | fal-image | required for fal-image |

HUIT's gateways take the key in a header: `api-key` for OpenAI Direct and Gemini, `x-api-key` for Bedrock (`lib/gateways.mjs`).

## Choosing a script

| task | script |
| --- | --- |
| audio (or a video's sound) to text | `huit/transcribe.mjs` |
| sound bites from a video, into an editor | `huit/transcribe.mjs --words`, pick (a model via `huit/claude.mjs`, then `makeLedger` in `lib/media.mjs`), `video/clips.mjs`, `video/timeline.mjs` |
| a video's frame rate, timecode, size | `video/probe.mjs` |
| ask a model a question, with text files | `huit/claude.mjs`, `huit/gpt.mjs`, or `huit/gemini.mjs` |
| ask about a PDF or an image | `huit/gemini.mjs` (`--file paper.pdf`) |
| count tokens before sending a big file | `huit/gemini.mjs --count` |
| an image from a prompt | `huit/gpt-image.mjs` or `huit/gemini-image.mjs` |
| edit or redraw a reference image | `huit/gemini-image.mjs --ref` (about 10 s) or `huit/gpt-image.mjs --ref` (20–50 s) |
| an image with readable lettering | `huit/gpt-image.mjs --model gpt-image-2` |
| compare texts by meaning | `huit/embed.mjs` |
| budget left on each key | `huit/quota.mjs` |
| images from public prompts with fal's models | `external/fal-image.mjs` |
| find a fal model ID | `external/fal-models.mjs` |

---

## HUIT scripts (`huit/`)

### `huit/transcribe.mjs`

Transcribes one audio file, or a video's sound, optionally with every word's timing. **Endpoint:** OpenAI Direct v2, `POST /audio/transcriptions` (multipart form).

**Call:** `node ll-utilities/huit/transcribe.mjs <audio-or-video-file> [options]`. Exactly one positional argument. Audio types: mp3, m4a, mp4, wav, webm, ogg, flac, mpeg, mpga (sent as is; over 25 MB is refused before upload; shrink speech with `ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`). Video types: mov, mkv, avi, mxf, m4v: the first audio track is extracted with ffmpeg to mono 16 kHz MP3 in a temporary folder, sent, and deleted; nothing else of the video leaves the machine. With `--words`, an mp4 with a picture is treated as video too.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--language <code>` | string | none (auto-detect) | ISO-639-1 code such as `en`, `es`; improves accuracy |
| `--prompt <text>` | string | none | spelling hints: names, jargon, the previous passage |
| `--timestamps` | flag | off | puts `[mm:ss]` before each segment in the Markdown; with `--words`, before each sentence |
| `--words` | flag | off | sends `timestamp_granularities[]=word` (alone: HUIT returns only segments when word and segment are both asked, tested Nov 12) and also writes `<stem>.words.json` beside the input; probes the input first (needs ffprobe), so drop-frame or variable-frame-rate video is refused before anything is sent |
| `--model <id>` | string | `whisper-1` | only `whisper-1` works through HUIT: HUIT forces `response_format=verbose_json`, which `gpt-4o-transcribe` and `gpt-transcribe` refuse with HTTP 400 |
| `--out <path>` | string | `<audio dir>/<stem>.transcript.md` | where the Markdown goes; the JSON goes beside it with `.json` |
| `--force` | flag | off | replace existing transcript files |
| `--dry-run` | flag | off | print the request and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_OPENAI_API_KEY` (required), `HUIT_OPENAI_BASE_URL`.

**Writes:** `<stem>.transcript.md` (a `# Transcript: <file>` heading and the text, timestamped with `--timestamps`) and `<stem>.transcript.json` (HUIT's raw verbose JSON: text, segments or words, timings). With `--words`, also `<stem>.words.json`:

```json
{ "schema": 1, "file": "/abs/workshop.words.json", "provider": "huit/whisper-1",
  "source": { "path": "/abs/workshop.mov", "fps": 30, "frameRate": "30/1", "frames": 431, "duration": 14.367,
              "startTimecode": "10:00:00:00", "timecodeIsTimeOfDay": true, "width": 640, "height": 360, "audio": true, "…": "…" },
  "words": [{ "index": 0, "word": "Welcome", "start": 0, "end": 0.34 }, "…"] }
```

`source` is `probe.mjs --json` of the input (an audio file gets `fps`, `frameRate`, and `startTimecode` null). Words come back **without punctuation**; the `text` field keeps it. Every word is checked (start ≥ 0, end ≥ start, end within the recording) before anything is written. **Stdout:** the paths written, one per line. **Stderr:** what was sent, the time taken, and how many words were timed. Exits 1 if `--words` gets no word timings.

**Examples:** `node ll-utilities/huit/transcribe.mjs clip.m4a --language en --timestamps`; `node ll-utilities/huit/transcribe.mjs workshop.mov --words --language en`

### `huit/claude.mjs`

Sends one prompt to Claude and prints the answer. **Endpoint:** Amazon Bedrock v2, `POST /v2/model/<model>/converse`; `--list-models` uses `GET /v2/inference-profiles` (free).

**Call:** `node ll-utilities/huit/claude.mjs [options] "<prompt>"`. All positional arguments are joined with spaces into the prompt. A prompt is required unless `--list-models` is given.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--file <path>` | string, repeatable | none | a text file (Markdown, plain text, CSV), read as UTF-8 and placed before the prompt inside `<file name="…">` tags; not for PDFs or images (use `gemini.mjs`) |
| `--system <text>` | string | none | system prompt |
| `--model <id>` | string | `us.anthropic.claude-sonnet-5-5` | an inference profile ID with the `us.` or `global.` prefix, e.g. `us.anthropic.claude-haiku-5-5` (cheaper), `us.anthropic.claude-opus-5-5`. **Fable:** any ID containing `fable` prints a warning on stderr first; HUIT's Bedrock documentation says Fable 5 runs in provider data share mode, so never send it confidential data |
| `--max-tokens <n>` | integer ≥ 1 | `1024` | longest answer in tokens |
| `--out <path>` | string | none | also save the answer as Markdown |
| `--list-models` | flag | off | print the Claude model IDs the gateway offers, one per line, and exit |
| `--dry-run` | flag | off | print the request and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_BEDROCK_API_KEY` (required), `HUIT_BEDROCK_BASE_URL`.

**Stdout:** the answer text. **Stderr:** model, seconds, token usage, and `(cut off: raise --max-tokens)` when the answer hit the limit. **Writes:** only with `--out`. Exits 1 if no text came back. No streaming (Bedrock streams in a binary format these scripts don't decode).

**Example:** `node ll-utilities/huit/claude.mjs --file notes.md "Summarize these notes in one sentence."`

### `huit/gpt.mjs`

Sends one prompt to an OpenAI model and prints the answer. **Endpoint:** OpenAI Direct v2, `POST /responses` (with `"stream": true` when `--stream`).

**Call:** `node ll-utilities/huit/gpt.mjs [options] "<prompt>"`. Positional arguments are joined into the prompt; required.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--file <path>` | string, repeatable | none | a text file (Markdown, plain text, CSV) placed before the prompt |
| `--system <text>` | string | none | sent as `instructions` |
| `--model <id>` | string | `gpt-5-mini` | any model the OpenAI Direct key allows |
| `--effort <level>` | string | model default | `minimal`, `low`, `medium`, `high` (reasoning models only); `minimal` is fastest for short tasks |
| `--max-tokens <n>` | integer ≥ 1 | `4000` | `max_output_tokens`; GPT-5 reasoning counts against it, so small values can return nothing |
| `--out <path>` | string | none | also save the answer as Markdown |
| `--stream` | flag | off | print the answer to stdout as it arrives (server-sent events) |
| `--dry-run` | flag | off | print the request and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_OPENAI_API_KEY` (required), `HUIT_OPENAI_BASE_URL`.

**Stdout:** the answer (all at once, or piece by piece with `--stream`). **Stderr:** model, seconds, token usage, and a note if the answer was cut off (`status: incomplete`). **Writes:** only with `--out`. Exits 1 if no text came back or the stream reports an error.

**Example:** `node ll-utilities/huit/gpt.mjs --effort low "Name three uses of a lighthouse."`

### `huit/gemini.mjs`

Sends one prompt to Gemini, with text files, PDFs, or images, and prints the answer; or counts the tokens a request would use. **Endpoint:** Google Gemini, `POST /v1beta/models/<model>:generateContent`; `:streamGenerateContent?alt=sse` with `--stream`; `:countTokens` with `--count` (same body as `generateContent`).

**Call:** `node ll-utilities/huit/gemini.mjs [options] "<prompt>"`. Positional arguments are joined into the prompt.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--file <path>` | string, repeatable | none | text files (`.md .txt .csv .json .html .htm .xml .tsv .yaml .yml`) go in as text; `.pdf .png .jpg .jpeg .webp` go in as inline data the model reads, 15 MB max each; other types are refused |
| `--system <text>` | string | none | `systemInstruction` |
| `--model <id>` | string | `gemini-3.5-flash` | also `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`, `gemini-2.5-pro`, and others on the gateway |
| `--max-tokens <n>` | integer ≥ 1 | `4000` | `maxOutputTokens`, thinking included |
| `--out <path>` | string | none | also save the answer as Markdown |
| `--stream` | flag | off | print the answer as it arrives; Gemini 3.5 thinks first, so it arrives in a few large pieces |
| `--count` | flag | off | send to `:countTokens` instead and print the input token count (by modality); nothing goes to the model and nothing is answered; exits 0 |
| `--dry-run` | flag | off | print the request (files summarized) and send nothing; with `--count`, shows the count request |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_GEMINI_API_KEY` (required), `HUIT_GEMINI_BASE_URL`.

**Stdout:** the answer; with `--count`, two lines: `<n> input tokens (<by modality>) for <model>. Nothing was sent to the model.` and a note on output tokens. **Stderr:** model version, seconds, token usage, and `(cut off: raise --max-tokens)` on `MAX_TOKENS`. **Writes:** only with `--out`. Exits 1 if no text came back (with the finish reason).

**Example:** `node ll-utilities/huit/gemini.mjs --file paper.pdf --count "List the three main claims."`, then the same without `--count`.

### `huit/gpt-image.mjs`

Makes an image from a prompt, optionally from reference images. **Endpoint:** OpenAI Direct v2. A prompt alone: `POST /images/generations`. With `--ref`: `POST /responses` with `tools: [{ type: "image_generation", model, size, quality }]` and `tool_choice: { type: "image_generation" }`, the reference images sent as `input_image` data URLs (HUIT doesn't allow `/images/edits`).

**Call:** `node ll-utilities/huit/gpt-image.mjs --prompt "<text>" [options]`. No positional arguments.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--prompt <text>` | string | required | what to make, or how to change the references |
| `--ref <image>` | string, repeatable | none | a `.png`, `.jpg`/`.jpeg`, or `.webp` under 7 MB; switches to `/responses`, 20–50 s in our tests. Shrink first: `sips -Z 1024 in.png --out small.png` |
| `--model <id>` | string | `gpt-image-1-mini` | the image model (the tool's `model` with `--ref`); also `gpt-image-1.5`, `gpt-image-2` (letters text exactly), `gpt-image-2.5-flare`, … |
| `--responses-model <id>` | string | `gpt-5-mini` | with `--ref` only: the model that calls the image tool |
| `--size <WxH>` | string | `1024x1024` | `1024x1024`, `1536x1024` (wide), `1024x1536` (tall), `auto` |
| `--quality <q>` | string | `auto` | `low`, `medium`, `high`, `auto`; others are refused. `low` is fastest and cheapest |
| `--out <path>` | string | `./gpt-image-<YYYYMMDD-HHMMSS>.png` | where to save the PNG |
| `--force` | flag | off | replace an existing file |
| `--dry-run` | flag | off | print the request (images summarized) and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_OPENAI_API_KEY` (required), `HUIT_OPENAI_BASE_URL`.

**Writes:** the PNG and a `.json` beside it (same name) with `model`, `prompt`, `revised_prompt`, `size`, `quality`, `image`, `usage`, `created`, plus `responses_model` and `references` with `--ref`. **Stdout:** the PNG's path. **Stderr:** what was asked and the time taken. Exits 1 if no image came back (with `--ref`, it prints anything the model said instead).

**Examples:** `node ll-utilities/huit/gpt-image.mjs --prompt "a teapot in a graduation cap, flat illustration" --quality low --out teapot.png`; `node ll-utilities/huit/gpt-image.mjs --prompt "the same character at night, same style" --ref character.jpg --quality low --out night.png`

### `huit/gemini-image.mjs`

Makes an image from a prompt, optionally from reference images. **Endpoint:** Google Gemini, `POST /v1beta/models/<model>:generateContent` with `responseModalities: ["TEXT", "IMAGE"]`; reference images go in as `inlineData`.

**Call:** `node ll-utilities/huit/gemini-image.mjs --prompt "<text>" [options]`. No positional arguments.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--prompt <text>` | string | required | what to make, or how to change the references |
| `--ref <image>` | string, repeatable | none | `.png`, `.jpg`/`.jpeg`, `.webp`, `.gif`, or `.heic`, under 7 MB each |
| `--aspect <ratio>` | string | model default | e.g. `1:1`, `16:9`, `9:16`, `4:3` |
| `--model <id>` | string | `gemini-3.1-flash-image` | also `gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, `gemini-3.1-flash-image-preview`, `gemini-nano-banana-2.1` (listed, not tested) |
| `--out <path>` | string | `./gemini-image-<YYYYMMDD-HHMMSS>.png` | where to save; the extension follows the type the model returns |
| `--force` | flag | off | replace an existing file |
| `--dry-run` | flag | off | print the request (images summarized) and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_GEMINI_API_KEY` (required), `HUIT_GEMINI_BASE_URL`.

**Writes:** the image (PNG unless the model returns another type; more than one if it returns several) and a `.json` beside it with the prompt, model, references, aspect, any text the model sent back, and usage. **Stdout:** each image path. **Stderr:** progress, any text the model said, time taken. Exits 1 if no image came back (with the finish or block reason).

**Example:** `node ll-utilities/huit/gemini-image.mjs --prompt "the same scene at night" --ref day.png --aspect 16:9`

### `huit/embed.mjs`

Gets an embedding for each text and, with two or more, prints the most similar pairs. **Endpoint:** OpenAI Direct v2, `POST /embeddings`.

**Call:** `node ll-utilities/huit/embed.mjs [options] "<text>" ["<text>" …]`. Each positional argument is one text; `--lines` adds more. At least one text is required.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--lines <file>` | string | none | embed each non-empty line of a text file, in addition to any positional texts |
| `--model <id>` | string | `text-embedding-3-small` | also `text-embedding-3-large` |
| `--out <path>` | string | none | save `{ model, items: [{ text, embedding }] }` as JSON |
| `--dry-run` | flag | off | print the request and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `HUIT_OPENAI_API_KEY` (required), `HUIT_OPENAI_BASE_URL`.

**Stdout:** `<n> text(s), <d> numbers each (<model>, <t> tokens)`, then with two or more texts `most similar first:` and up to 20 pairs as `0.683  "text a"  ~  "text b"` (cosine similarity: 1 is the same meaning, near 0 unrelated). **Writes:** only with `--out`.

**Example:** `node ll-utilities/huit/embed.mjs "a cat" "a kitten" "the budget report"`

### `huit/quota.mjs`

Shows each gateway's budget for this period. **Endpoint:** `GET /apigee/quota` on each gateway. Free.

**Call:** `node ll-utilities/huit/quota.mjs [openai|gemini|bedrock …] [options]`. Positional arguments pick gateways; with none, it checks every gateway that has a key set (and skips the rest silently). An unknown name exits 1.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--json` | flag | off | also print HUIT's raw answers as JSON |
| `--dry-run` | flag | off | print the requests (keys masked) and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** any of `HUIT_OPENAI_API_KEY`, `HUIT_GEMINI_API_KEY`, `HUIT_BEDROCK_API_KEY`, and optionally `HUIT_OPENAI_BASE_URL`, `HUIT_GEMINI_BASE_URL`, `HUIT_BEDROCK_BASE_URL`. Exits 1 if none is set.

**Stdout:** one line per gateway: `<gateway>: $<spent> spent of $<limit> per <period>; $<left> left` (spent is limit minus remaining). A gateway that fails gets its own line with the error, the others still print, and the script then exits 1. Run it before and after a call to see what the call cost.

**Example:** `node ll-utilities/huit/quota.mjs openai`

---

## Video scripts (`video/`): local, nothing sent anywhere

Sound bites from a recording, into an editor. The chain: `huit/transcribe.mjs <video> --words` → pick bites as word ranges (a model through `huit/claude.mjs`, then `makeLedger()` from `lib/media.mjs` turns the picks into a ledger) → `video/clips.mjs` for review clips → `video/timeline.mjs` for Final Cut, Premiere, Resolve, or an EDL. Ported from the Learning Lab's HUIT-hackathon soundbites tools (`mk-video-editing`), keeping their ledger format so picks move between the two. All need ffmpeg and ffprobe (`brew install ffmpeg`).

Timecode is non-drop, counted at the nominal rate (30 for 29.97). Drop-frame timecode and variable frame rate are refused everywhere: transcode to a constant rate first (`ffmpeg -i in.mov -fps_mode cfr -r 30 out.mov`). The start timecode comes from a `tmcd` track when the file has one (the studio's time of day), else from timecode tags, else `00:00:00:00`.

**The ledger** (`<name>.bites.json`; written by `makeLedger`, read and updated by `clips.mjs` and `timeline.mjs`):

```json
{ "schema": 1, "source": { "…": "the words file's source" }, "transcript": "/abs/workshop.words.json",
  "purpose": "…", "purposeIsDefault": false, "model": "…", "handleSeconds": 0.12, "count": 2, "createdAt": "…",
  "bites": [{ "startWord": 17, "endWord": 28, "title": "…", "reason": "…", "rating": 5,
              "id": "bite-1", "rank": 1, "inFrame": 162, "outFrame": 283,
              "sourceIn": "10:00:05:12", "sourceOutExclusive": "10:00:09:13", "status": "identified", "files": {} }] }
```

`startWord`/`endWord` are inclusive word indexes. `inFrame` is the first frame and `outFrame` the first frame *after* the bite, both counted from the file's first frame; `sourceIn`/`sourceOutExclusive` are the same at the file's timecode. `makeLedger` adds `handleSeconds` before and after each bite, rounds outward to whole frames, and clamps to the file. `status` goes `identified` → `rendered` (clips.mjs) → `in-timeline` (timeline.mjs: exported, not a confirmed import). The scripts reread the ledger right before each write, so fields other tools add survive. Both video scripts probe the media again and refuse if its frame rate or start timecode no longer matches the ledger's `source`.

### `video/probe.mjs`

Reads a video with ffprobe and prints what the other scripts need. Local; free.

**Call:** `node ll-utilities/video/probe.mjs <video> [options]`. Exactly one positional argument.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--json` | flag | off | print the full source object (what words files and ledgers carry): `path`, `size`, `mtime`, `container`, `videoCodec`, `pixelFormat`, `width`, `height`, `fps` (number), `frameRate` (exact, e.g. `"30000/1001"`), `frames`, `duration` (s), `startTimecode` (or null), `timecodeIsTimeOfDay` (has a tmcd track), `audio`, `audioChannels`, `audioRate` |
| `-h`, `--help` | flag | | show help |

**Env:** none. **Stdout:** picture size and codec, rate, length in frames and seconds, timecode range (end exclusive), sound; or the JSON. Exits 1 for a missing file, no video stream, drop-frame timecode, or variable frame rate (the message says how to fix it).

**Example:** `node ll-utilities/video/probe.mjs workshop.mov`

### `video/clips.mjs`

Cuts each bite into an H.264/AAC review clip. Re-encoded (CRF 18), so each clip starts exactly on the bite's in-frame rather than the nearest keyframe and runs exactly `outFrame - inFrame` frames; it carries a `tmcd` track at the bite's `sourceIn`, so editors show the original timecode. The source file is never changed. Only the first video and first audio streams are kept.

**Call:** `node ll-utilities/video/clips.mjs <ledger.json> [options]`.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--ids <list>` | string | all bites | comma-separated bite ids, e.g. `bite-1,bite-3`; an unknown id exits 1 |
| `--dest <folder>` | string | `<ledger dir>/<ledger name>-clips/` | where clips go; refused if it's the source's own folder |
| `--dry-run` | flag | off | print each clip's path, source timecode, frame count, and the exact ffmpeg command; write nothing |
| `-h`, `--help` | flag | | show help |

**Env:** none. **Writes:** `<rank>-<title-slug>.mp4` per bite (e.g. `01-start-with-one-clear-question.mp4`), cut to `.partial.mp4` first and renamed when done; in the ledger, per bite: `files.render` (the clip's path), `renderedRange`, and `status: "rendered"` if it was `identified`. A clip already cut for the same frames is kept (rerunning finishes an interrupted batch); a clip at that path cut for different frames is refused (use a new `--dest`). **Stdout:** each clip path. **Stderr:** progress and the total time.

**Example:** `node ll-utilities/video/clips.mjs workshop.bites.json --ids bite-1`

### `video/timeline.mjs`

Writes the bites as a string-out (ledger order, back to back from `00:00:00:00`), linked to the original media at its source timecode; nothing is copied or transcoded, so moving machines means relinking.

**Call:** `node ll-utilities/video/timeline.mjs <ledger.json> [options]`.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--with <video>` | string | none | a second camera for the same bites, placed by time of day: its in-point is A's start timecode + `inFrame` − B's start timecode. Both files need a `tmcd` track and the same `frameRate`; B must cover every bite, handles included (refused otherwise, never shifted); recordings crossing midnight are handled. B is picture only: V2 in the XML, a connected `video` on lane 1 in the FCPXML. The EDL stays camera A |
| `--formats <list>` | string | `fcpxml,xml,edl` | any of `fcpxml`, `xml`, `edl`, comma-separated |
| `--force` | flag | off | replace existing timeline files |
| `--dry-run` | flag | off | check the ledger and media (and B's coverage) and print the angles, each bite's in-points, and the files it would write; write nothing |
| `-h`, `--help` | flag | | show help |

**Env:** none. **Writes**, beside the ledger, named after it:

- `<name>.fcpxml`: FCPXML 1.8 for Final Cut Pro (File → Import → XML). One asset per file at its own size and start timecode; a 1920×1080 sequence at the source rate (`tcFormat NDF`, stereo, 48k), the shape that imported without a warning in the hackathon; one A/V `asset-clip` per bite at its source start. When Final Cut Pro is installed, the file is checked against its `FCPXMLv1_8.dtd` with xmllint and the script exits 1 if it doesn't validate.
- `<name>.xml`: Final Cut 7 XML (`xmeml` 4) for Premiere Pro and DaVinci Resolve. Element for element what OpenTimelineIO's `fcp_xml` adapter writes (the form both imported in the hackathon; `test/reference/` holds the adapter's output and a test compares), plus picture dimensions on the sequence format and each file, which Premiere needs to avoid cropping into a small canvas. Video track(s) plus camera A's sound; `in`/`out` are file-relative frames and each file carries its start timecode.
- `<name>.edl`: CMX3600, `FCM: NON-DROP FRAME`, one event per bite, reel `AX`, channel `B` (video and first sound channel; `V` for a silent source), source timecode in and out, record timecode from `00:00:00:00`; each event followed by `* FROM CLIP NAME:`, `* SOURCE FILE:`, and `* COMMENT:` (the title). New in this port; not yet imported into an editor.

In the ledger, every bite gets `files.timelines` (`{ fcpxml, xml, edl }` paths) and `status: "in-timeline"`; refused if the bites changed during the export. **Stdout:** the files written. **Stderr:** the DTD check, bite count, total frames, and B's offset. Exits 1 for an invalid ledger, media that no longer matches it, a second angle that's missing a bite or a tmcd track or runs at another rate, existing files without `--force`, or an FCPXML that fails the DTD.

**Examples:** `node ll-utilities/video/timeline.mjs workshop.bites.json`; `node ll-utilities/video/timeline.mjs workshop.bites.json --with camera-b.mov --formats fcpxml,xml`

**Test media:** `node ll-utilities/test/video-fixture.mjs --angle` writes a made-up pair to `_media/fixtures/bites/` (gitignored): `workshop.mov` (640×360, 30 fps, exactly 431 frames, macOS `say` speech, tmcd `10:00:00:00`) and `workshop-b.mov` (the same pattern as a silent second camera starting 9 frames later).

---

## External scripts (`external/`): public or made-up material only

Both print a warning on stderr before sending anything (from `external/warning.mjs`), and their `--help` starts with the data rule. Neither goes through Harvard.

### `external/fal-image.mjs`

Makes images with fal.ai. **Endpoint:** `POST https://queue.fal.run/<model>` submits a job; the script polls its `status_url` every 2 seconds for up to 5 minutes, fetches its `response_url`, and downloads the images listed (public CDN links, fetched without the key). With `--ref` and the default model, it uses `fal-ai/nano-banana-2/edit`. Header: `Authorization: Key <FAL_API_KEY>`.

**Call:** `node ll-utilities/external/fal-image.mjs "<prompt>" [options]`. Positional arguments are joined into the prompt; give a prompt or `--prompt-file`, not both.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--model <id>` | string | `fal-ai/nano-banana-2` | `fal-ai/flux/schnell` (fast, cheap, no references) or any fal endpoint ID (`owner/name[/…]`); find IDs with `fal-models.mjs` |
| `--ref <image>` | string, repeatable | none | a local `.png`, `.jpg`/`.jpeg`, or `.webp` under 10 MB, sent to fal as a data URL; refused with `fal-ai/flux/schnell` |
| `--prompt-file <f>` | string | none | read the prompt from a text file |
| `--aspect <ratio>` | string | none (Nano Banana 2's own default is `1:1`) | e.g. `1:1`, `3:4`, `16:9`; sent as `aspect_ratio` only when given. Tested with Nano Banana 2; other models may size images differently |
| `--n <count>` | integer | `1` | 1 to 4 images |
| `--out <folder>` | string | `_media/fal/<timestamp>-<last part of the endpoint ID>/` (`…-edit` with `--ref`) | a folder that must not exist yet |
| `--dry-run` | flag | off | print the request (key masked, references summarized) and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** `FAL_API_KEY` (required, from https://fal.ai/dashboard/keys).

**Writes** into the new folder: `request.json` (model, URL, prompt, settings, local reference paths), `response.json` (fal's answer), and `image-01.png` (`.jpg` or `.webp` if fal sends those), `image-02…` with `--n`. `request.json` is written before the job is sent, so a failed run still leaves its folder; the next run needs a new `--out` (the default is always new). `_media/` is gitignored. **Stdout:** each image path. **Stderr:** the external warning, the job ID, anything the model said, the time taken. Exits 1 if the job fails, isn't done after 5 minutes (it is not resubmitted), or returns no images. Cost is billed to the key's fal account; prices are on each model's page at fal.ai.

**Example:** `node ll-utilities/external/fal-image.mjs "a lighthouse made of books, watercolor" --model fal-ai/flux/schnell --n 2`

### `external/fal-models.mjs`

Lists fal endpoint IDs to pass to `fal-image.mjs --model`. **Endpoint:** `GET https://api.fal.ai/v1/models?category=<category>` (public, paged; it reads pages until it has enough matches). Sends only the category and paging; `--grep` filters on your computer. No key, free.

**Call:** `node ll-utilities/external/fal-models.mjs [options]`. No positional arguments.

| option | type | default | allowed values and notes |
| --- | --- | --- | --- |
| `--category <name>` | string | `text-to-image` | fal's categories, e.g. `image-to-image`, `text-to-video` |
| `--grep <text>` | string | none | only models whose ID or display name contains this (case-insensitive) |
| `--limit <n>` | integer | `50` | 1 to 500 |
| `--dry-run` | flag | off | print the request and send nothing |
| `-h`, `--help` | flag | | show help |

**Env:** none.

**Stdout:** one model per line, `<endpoint id>  <display name>`, in fal's catalogue order. **Stderr:** the external warning and a count. Exits 1 if nothing matched, fal can't be reached, or fal answers an error (429 means wait a minute).

**Example:** `node ll-utilities/external/fal-models.mjs --grep banana`

---

## Shared helpers (`lib/`), for writing a new script

- `lib/env.mjs`: `env(name)` reads `process.env`, falling back to the repository root's `.env`; `mask(key)` gives `[hidden, N characters]`; `fail(script, message)` prints `<script>: <message>` to stderr and exits 1.
- `lib/gateways.mjs`: `gateway('openai' | 'gemini' | 'bedrock')` returns `{ name, label, keyEnv, baseEnv, base, header, key }` with the base URL from the environment or HUIT's default.
- `lib/media.mjs` (local, for video): `probe(path, { videoRequired })` returns the source object; `makeLedger(wordsFile, picks, { purpose, purposeIsDefault, model, handle, count, transcriptPath })` returns a ledger (throws on an invalid pick); `readLedger`, `checkSource`, and `updateLedger(path, ids, change)` read, verify, and atomically update one; `timecode`, `timecodeFrames`, `parseRate`, `sourceRate`, `rationalSeconds` do the frame arithmetic; `run(command, args)` runs ffmpeg or ffprobe.
- `lib/sse.mjs`: `sseEvents(response)` yields each server-sent event's JSON from a streamed `fetch` response (OpenAI and Gemini streams).

A new script follows the same shape: `parseArgs` with a `HELP` string, `--dry-run` before any key check, results on stdout, messages on stderr, the key redacted from any error. Add it to this file (every option from its `--help`), to the table in `README.md` with its live test, and a dry-run test in `test/`. Every route HUIT allows is listed in the Harvard API Portal's API specs.
