# What the utilities and skills are for

## `ll-utilities/`: one small script per call

Each script makes one kind of call to one AI service, and is short enough to read. Every one has `--help` (what it does and what it needs) and `--dry-run` (the request it would send, with the key masked, and nothing sent). They need Node.js 22 or later and nothing else. The full list, with the exact API each one calls and when it was last tested, is [`ll-utilities/README.md`](../ll-utilities/README.md).

- **`huit/`: Harvard's AI API gateways.** One script per call, each run against the live gateway before it is listed here. These are the route for sensitive material, within what each gateway is approved for; see [`huit/`](huit/) and [`data-security/`](data-security/).
  - `transcribe.mjs`: an audio file in, a Markdown transcript out (OpenAI Direct, `whisper-1`).
  - `claude.mjs`, `gpt.mjs`, `gemini.mjs`: a prompt, optionally with files and a system prompt, to Claude (through Bedrock), an OpenAI model, or Gemini (which also reads PDFs and images); the answer out.
  - `gemini-image.mjs`, `gpt-image.mjs`: a prompt (and, for Gemini, reference images) in, an image out.
  - `embed.mjs`: texts in; which are most alike, and the vectors if you want them.
  - `quota.mjs`: what is left on your key on each gateway (free).
- **`external/`: tools outside Harvard's gateways.** Image generation with fal. **Not Harvard-approved: only public (Level 1) or made-up material, never confidential data.** Each one prints a warning before it sends.

Why scripts and not an app? Because a script is something you and your agent can both read, run, and change. Once a call works as a script, Claude can use it inside anything you build: a skill, a web page, a pipeline for a whole folder.

## `.agents/skills/`: skills

A skill is a folder with a `SKILL.md` that tells Claude how to do one kind of task, plus any scripts it uses. Claude Code finds them through the links in `.claude/skills/`. Ask "what skills do you have?" or name one.

| skill | what it does | calls |
| --- | --- | --- |
| `my-context` | starts a context folder of your own in `_context/`, through a short interview one question at a time: a README a collaborator or an agent reads first, a file per course or project, and your open questions, with your words kept apart from Claude's summary. Say "start my context folder" | nothing beyond Claude itself |
| `class-reflection` | helps you reflect on a class you just taught: transcribes your spoken debrief (or a class recording you're allowed to use), then writes eight to twelve questions grounded in the transcript and any notes, lesson plan, or research you add. Names no students. For anything confidential it runs entirely through HUIT, and Claude never opens the transcript. Say "help me reflect on today's class" | `huit/transcribe.mjs`, then Claude Code or `huit/claude.mjs` |
| `origin-story` | turns a story you tell it (how you, a project, or a team began) into a four- or eight-panel comic, with an optional short interview for more detail, and builds a local page to read it (in `_media/comics/`, which is not committed) | HUIT's Gemini gateway by default; fal only if you ask, and only for public or made-up material |

More to come; this list is updated as skills are added.
