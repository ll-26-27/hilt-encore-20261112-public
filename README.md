# What We Learned Teaching Harvard Faculty to Build with AI

The Learning Lab at the Derek Bok Center for Teaching and Learning, at the 2026 HILT Encore Event: Thursday, November 12, 2026, 12:00–1:00 PM ET, on Zoom. Marlon Kuzmick and Madeleine Woods.

This repository is the site for the session: examples of what we built with faculty and students, the utilities we use, and a long list of teaching ideas. Open it in Claude Code, or run the site yourself.

| path | what |
| --- | --- |
| `nextjs/` | the site (Next.js): Examples, Utilities, Ideas |
| `content/` | the site's words, in Markdown: `home.md`, `utilities.md`, `examples/`, `ideas/` (one file per idea) |
| `workshop-folder/` | desktop-app workshop: walkthrough, source materials, prompts, operations, and outputs; start with its `README.md` |
| `ll-utilities/` | small readable scripts that call Harvard's HUIT AI APIs and a few outside services; its `README.md` says how to use them |

## Run the site

```
cd nextjs
pnpm install
pnpm dev
```

The site is at http://localhost:3112. The examples include browser interactives, saved outputs, screenshots, and externally hosted demonstrations. Saved model output is labelled as recorded. Some interactives keep notes in your browser; the soundbite example contains only supplied screenshots.

The cooking simulations and German reading room are copied from `workshop-folder/` automatically before development and production builds. Keep that folder beside `nextjs/` when cloning or deploying.
