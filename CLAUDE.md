# Instructions for Claude (and other AI coding agents)

This repository is from the Learning Lab at the Derek Bok Center for Teaching and Learning, for the 2026 HILT Encore Event (November 12, 2026): *What We Learned Teaching Harvard Faculty to Build with AI*. It holds two things: the talk as a website (`nextjs/`, `content/`), and a **kit** for the person who has opened it in Claude Code: a context folder about the Learning Lab and how we work, a set of small scripts that call AI models, and a few skills.

The person at the keyboard is probably a member of Harvard's teaching and learning community: faculty, staff, or an academic administrator. They may be new to Claude Code and the command line. Explain what you are about to do before you do it, show them the files you make, and prefer small steps they can follow.

## Read first

1. [`_context/README.md`](_context/README.md): the map of the context folder. Start there.
2. [`_context/using-this-repo.md`](_context/using-this-repo.md): setup, keys, and first things to try.
3. [`_context/data-security/`](_context/data-security/): Harvard's data security levels and what they mean for this kit. **Read it before sending anything to a model.**

## The data rule: external tools get public material only

> **External tools (fal, OpenRouter) are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.**

Harvard classifies data in levels, from Level 1 (public) up through Level 2 and higher for confidential information, such as student records, non-public research data, and personal information about identifiable people. HUIT's guidance is that confidential data (Level 2 and above) goes only into generative AI tools that have been assessed and approved for it. The levels, the sources, and what they mean for this kit are in [`_context/data-security/`](_context/data-security/).

- **HUIT's AI API gateways** (`ll-utilities/huit/`) are the route for anything sensitive, within the levels each is approved for; [`_context/huit/`](_context/huit/) records what HUIT says about each.
- **External tools** (`ll-utilities/external/`: fal, OpenRouter, and anything else that is not a HUIT gateway) get **only public or made-up material.** Every external script says so in its `--help` and prints a warning before it sends.
- **Before any call, ask what the input is.** If you cannot tell whether a file or a prompt contains confidential material (student work, names with grades, unpublished research, health or financial details), stop and ask the person. Do not guess, and do not send it to an external tool to find out.
- Claude Code itself sends what you read to the model provider the person's Claude account uses. Harvard's guidance on which Claude accounts are approved for which levels is in [`_context/data-security/`](_context/data-security/); point the person there rather than stating it from memory.

## Where things are

| path | what | for |
| --- | --- | --- |
| `_context/` | the context folder: who the Learning Lab is, the talk, how to use this repo, HUIT's APIs, Harvard's data levels | read it before working |
| `_context/huit/reference/` | every route HUIT's three gateways allow, with request bodies and what this kit has tested; HUIT's full specs are in the Harvard API Portal (HarvardKey) | read it before writing a new HUIT script |
| `ll-utilities/huit/` | one script per HUIT AI API call (transcription, text, images, embeddings, quota) | sensitive-capable work, with the person's own HUIT key |
| `ll-utilities/external/` | scripts for external tools (fal image generation) | non-sensitive work only |
| `ll-utilities/lib/` | small shared helpers the scripts use | |
| `ll-utilities/README.md` | every script, the API it calls, and when it was last tested | check here before running one |
| `.env.example` | the names of the keys the scripts read | copy to `.env` |
| `nextjs/`, `content/` | the talk's website and its words | see `README.md`; not part of the kit |

## Keys

The scripts read keys from a file called `.env` at the root of this repo. It is listed in `.gitignore`, so it is never committed. To set it up:

1. Copy `.env.example` to `.env`.
2. Fill in only the keys you have. Each is the person's own; never ask them to paste a key into the chat, and never print, log, or commit one. If a key is shown by accident, tell them to rotate it.
3. Run scripts with Node's built-in env loading: `node --env-file=.env ll-utilities/huit/<script>.mjs …`.

Nothing in the kit needs a key to be read, and every script has a `--dry-run` that shows the request it would send, with the key masked, without sending it. How a Harvard person gets a HUIT API key is in [`_context/huit/`](_context/huit/).

## Running the utilities

- Plain Node.js (version 22 or later), no packages to install. Each script runs on its own: `node ll-utilities/<folder>/<script>.mjs --help`.
- Start every new script with `--help`, then `--dry-run`, then a real run on a tiny, made-up input. Calls cost money on the key's account; keep runs small and say what a run will cost when you can.
- Results are written to files beside the input, and the script prints where. Show the person the file.
- If a call fails, show the error the API returned. Don't retry in a loop.

## Skills

A skill is a folder with a `SKILL.md` that tells you how to do one kind of task, plus any scripts it uses. If the person asks for one, make it in `.agents/skills/<name>/SKILL.md` and link it from `.claude/skills/<name>` (`ln -s ../../.agents/skills/<name> .claude/skills/<name>`) so Claude Code finds it. A skill that calls an external tool follows the data rule above.

## Working with the person at the keyboard

- This is their copy. They can change anything here: the context, the scripts, skills of their own. Help them make it theirs, for example by adding a folder of their own context to `_context/` (made-up or public material first).
- Keep their words, source material, and your own proposals distinct, and say which is which.
- The talk's website (`nextjs/`, `content/`) is the Learning Lab's account of the talk. Don't change it unless they ask.
- Write "the Learning Lab," not "the Lab."
