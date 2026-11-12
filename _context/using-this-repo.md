# Using this repository

## What you need

- **Claude Code**, in the Claude desktop app or the terminal. Setup guides for Harvard accounts, Mac and Windows: https://bok-learning-lab.github.io/claude-workshop-materials/encyclopedia/get-started/
- **Git**, to copy the repository to your computer.
- **Node.js 22 or later**, only if you want to run the scripts in `ll-utilities/`. Check with `node --version`.

## Get it and open it

```
git clone https://github.com/ll-26-27/hilt-encore-20261112-public.git
cd hilt-encore-20261112-public
claude
```

Or, in the Claude desktop app, open the folder you cloned. Claude reads `CLAUDE.md` when it starts, and that points it here.

## Keys: optional

You can use most of this kit without any keys: read the context, ask Claude about the talk, use it as the model for a context folder of your own, and run any script with `--dry-run` to see exactly what it would send.

To make real calls, you need keys of your own:

- **HUIT AI API keys** reach OpenAI, Google Gemini, and Anthropic (through Amazon Bedrock) through Harvard's gateways. How a Harvard person gets one, and what each gateway is approved for, is in [`huit/`](huit/).
- **External keys** (fal for image generation, OpenRouter for many models) come from those companies' own sites. **They are not Harvard-approved: send them only public (Level 1) material, never confidential data.** See [`data-security/`](data-security/).

Then copy `.env.example` to `.env` and fill in the keys you have. `.env` is gitignored, so it stays on your computer. Don't paste keys into the chat.

## Things to try

Paste any of these into Claude Code:

- "Read `_context/` and tell me in a paragraph what this repository is and what I can do with it."
- "What did the Learning Lab learn from teaching faculty to use Claude Code? Answer from `_context/the-talk.md` and `content/`."
- "Help me start a context folder for my own course in `_context/my-course/`. Ask me five questions first."
- "Show me what `ll-utilities/huit/transcribe.mjs` would send, with `--dry-run`, for a short audio file you make with the Mac's `say` command."
- "Run the site in `nextjs/` and open it."
- "What are the skills in `.agents/skills/` for? Pick one and walk me through it."

## Make it yours

This is your copy. Change the context, write a script for an API call you need, or ask Claude to make a skill from something you do often. If you want to keep your changes, make your own repository on GitHub and push there; ask Claude to walk you through it.
