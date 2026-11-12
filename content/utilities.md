---
title: Utilities
subtitle: Small scripts that call Harvard's own AI gateways. Read every line, run them from the command line, or ask Claude Code to run them for you.
---

## What they are

`ll-utilities/` is a folder of small Node.js scripts, one per AI call, written by the Learning Lab so you can read every line. Most of them call HUIT's AI API gateways, Harvard's own route to OpenAI, Google Gemini, and Anthropic's Claude (on Amazon Bedrock): transcription, text from Claude, GPT, and Gemini, images from Gemini and GPT, embeddings, and a check on how much of your budget is left. The scripts for tools outside Harvard sit apart, in `external/`, and are for public material only. There's nothing to install beyond Node.js 22 or later, and every script has `--help` and `--dry-run`.

## Why use them

- **Transcribe a recording**, a lecture, an interview, a meeting, and get a Markdown transcript beside the file.
- **Run the same prompt across models**, Claude, GPT, and Gemini, and compare what each makes of it.
- **Keep your data inside Harvard's approved gateways** instead of pasting it into a consumer chat app.
- **Make your own tools with Claude Code.** Each script is short and plain, so it's a good starting point: open the repository in Claude Code and ask for the tool you need.

## Where they are

In the repository (https://github.com/ll-26-27/hilt-encore-20261112-public), run from its top folder as `node ll-utilities/<folder>/<script>.mjs --help`:

- `ll-utilities/huit/`: Harvard's HUIT gateways, the route for anything sensitive. `transcribe.mjs` (audio or video to a Markdown transcript; `--words` adds word timings), `claude.mjs` (Claude), `gpt.mjs` (OpenAI), `gemini.mjs` (Gemini; reads PDFs and images, and `--count` shows the tokens first), `gemini-image.mjs` and `gpt-image.mjs` (images; `--ref` works from a reference image), `embed.mjs` (compare texts by meaning), `quota.mjs` (your budget, free to run).
- `ll-utilities/external/`: tools outside Harvard (`fal-image.mjs`, `fal-models.mjs`), for public or made-up material only.
- `ll-utilities/video/`: local video tools (ffmpeg on your computer, nothing sent anywhere) that take sound bites from a transcript into Final Cut, Premiere, or Resolve.
- `ll-utilities/lib/`: the small shared helpers the scripts use (finding your keys, hiding them in dry runs).
- `ll-utilities/test/`: tests that need no keys and send nothing (`node --test ll-utilities/test/`).
- `ll-utilities/README.md` is the overview, with a tested table per script; `ll-utilities/AGENTS.md` has every option of every script, written for an AI agent and useful to people too.
- `.env.example`, at the top of the repository: the names of the keys the scripts read. Copy it to `.env`; your keys stay on your computer (`.env` is never committed).

## Getting a HUIT key

You use your own key from the Harvard API Portal, https://portal.apis.huit.harvard.edu (sign in with HarvardKey). The gateways are pay-as-you-go, billed inside Harvard, so you'll need a HUIT billing number (ask your department first; most already have one). In the portal, register an app, choose the AI APIs you want, and put your billing number in the app's description; HUIT's steps are in [the portal's access guide](https://portal.apis.huit.harvard.edu/ai-services-request-access-with-billing). When it's approved, the key is in your app in the portal. You can write a spending cap into the description too, for example "limit of $10/day". Put the key in your `.env`, never in a chat, a document, or a commit. `ll-utilities/README.md` has the short version, under Keys.

## Try it

Copy the key names and fill in the ones you have:

```
cp .env.example .env
```

Start every script with a dry run: it prints the request it would send, with your key hidden, and sends nothing.

```
node ll-utilities/huit/transcribe.mjs interview.m4a --dry-run
```

Transcribe a recording (25 MB at most; a video's sound is extracted first). The transcript lands beside the file as `interview.transcript.md`:

```
node ll-utilities/huit/transcribe.mjs interview.m4a --language en --timestamps
```

Ask Claude about a file of notes, and save the answer:

```
node ll-utilities/huit/claude.mjs --file notes.md --out summary.md "Summarize these notes in three bullet points."
```

The same question to GPT and to Gemini, to compare:

```
node ll-utilities/huit/gpt.mjs --file notes.md "Summarize these notes in three bullet points."
node ll-utilities/huit/gemini.mjs --file notes.md "Summarize these notes in three bullet points."
```

Make an image:

```
node ll-utilities/huit/gemini-image.mjs --prompt "A teapot wearing a graduation cap, watercolor" --aspect 16:9
```

See what's left of your budget on each gateway (free to run; run it before and after a call to see what the call cost):

```
node ll-utilities/huit/quota.mjs
```

## The data rule

From `ll-utilities/README.md`, as it stands:

> **HUIT scripts are the route for anything sensitive, within the data levels HUIT approves each gateway for; external tools (fal, OpenRouter) are not Harvard-approved, so send them only public (Level 1) or made-up material, never confidential data.** If you can't tell what a file contains, don't send it until you know.

See [Harvard's data classification](https://privsec.harvard.edu/data-classification-table) and [HUIT's generative AI guidelines](https://huit.harvard.edu/ai/guidelines).
