# What the utilities and skills are for

## `ll-utilities/`: one small script per call

Each script makes one kind of call to one AI service, and is short enough to read. Every one has `--help` (what it does and what it needs) and `--dry-run` (the request it would send, with the key masked, and nothing sent). They need Node.js 22 or later and nothing else. The full list, with the exact API each one calls and when it was last tested, is [`ll-utilities/README.md`](../ll-utilities/README.md).

- **`huit/`: Harvard's AI API gateways.** Scripts for HUIT's OpenAI, Gemini, and Bedrock gateways, added one at a time and each tested live before it is listed as working. First: `transcribe.mjs` (an audio file in, a Markdown transcript out, through OpenAI Direct's `whisper-1`) and image generation through the Gemini gateway (`gemini-image.mjs`, from a prompt or a reference image), `claude.mjs` (Claude through HUIT's Bedrock gateway) and `gpt.mjs` (OpenAI models through OpenAI Direct): a prompt, optionally with text files and a system prompt, in; the answer out. And `quota.mjs`, which asks each gateway what is left on your key (free). Embeddings and more are next; the README's table says what is tested. These are the route for sensitive material, within what each gateway is approved for; see [`huit/`](huit/) and [`data-security/`](data-security/).
- **`external/`: tools outside Harvard's gateways.** Image generation with fal. **Not Harvard-approved: only public (Level 1) or made-up material, never confidential data.** Each one prints a warning before it sends.

Why scripts and not an app? Because a script is something you and your agent can both read, run, and change. Once a call works as a script, Claude can use it inside anything you build: a skill, a web page, a pipeline for a whole folder.

## `.agents/skills/`: skills

A skill is a folder with a `SKILL.md` that tells Claude how to do one kind of task, plus any scripts it uses. Claude Code finds them through the links in `.claude/skills/`. Ask "what skills do you have?" or name one.

| skill | what it does | calls |
| --- | --- | --- |
| `origin-story` | turns a story you tell it (how you, a project, or a team began) into a four- or eight-panel comic, with an optional interview for more detail, and builds a local page to read it | an image model (the skill says which; external ones follow the data rule) |

More to come; this list is updated as skills are added.
