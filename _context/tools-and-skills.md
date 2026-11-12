# What the utilities and skills are for

## `ll-utilities/`: one small script per call

Each script makes one kind of call to one AI service, and is short enough to read. Every one has `--help` (what it does and what it needs) and `--dry-run` (the request it would send, with the key masked, and nothing sent). They need Node.js 22 or later and nothing else. The full list, with the exact API each one calls and when it was last tested, is [`ll-utilities/README.md`](../ll-utilities/README.md).

- **`huit/`: Harvard's AI API gateways.** One script per call, each run against the live gateway before it is listed here. These are the route for sensitive material, within what each gateway is approved for; see [`huit/`](huit/) and [`data-security/`](data-security/).
  - `transcribe.mjs`: an audio file in, a Markdown transcript out (OpenAI Direct, `whisper-1`).
  - `claude.mjs`, `gpt.mjs`, `gemini.mjs`: a prompt, optionally with files and a system prompt, to Claude (through Bedrock), an OpenAI model, or Gemini (which also reads PDFs and images); the answer out.
  - `gemini-image.mjs`, `gpt-image.mjs`: a prompt (and, for Gemini, reference images) in, an image out.
  - `embed.mjs`: texts in; which are most alike, and the vectors if you want them.
  - `quota.mjs`: what is left on your key on each gateway (free).
  - To write another (streaming, document search, batches), start from [`huit/reference/`](huit/reference/), which lists every route each gateway allows and what is tested.
- **`external/`: tools outside Harvard's gateways.** Image generation with fal. **Not Harvard-approved: only public (Level 1) or made-up material, never confidential data.** Each one prints a warning before it sends.

Why scripts and not an app? Because a script is something you and your agent can both read, run, and change. Once a call works as a script, Claude can use it inside anything you build: a skill, a web page, a pipeline for a whole folder.

## Skills: make your own

A skill is a folder with a `SKILL.md` that tells Claude how to do one kind of task, plus any scripts it uses. Ask Claude to make one from something you do often: it goes in `.agents/skills/<name>/`, linked from `.claude/skills/<name>` so Claude Code finds it. A skill can call the scripts in `ll-utilities/`; one that calls an external tool follows the data rule in `CLAUDE.md`.
