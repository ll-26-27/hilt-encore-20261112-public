# What We Learned Teaching Harvard Faculty to Build with AI

The Learning Lab at the Derek Bok Center for Teaching and Learning, at the 2026 HILT Encore Event: Thursday, November 12, 2026, 12:00–1:00 PM ET, on Zoom. Marlon Kuzmick and Madeleine Woods.

This repository is the site for the session: examples of what we built with faculty and students, the utilities we use, and a long list of teaching ideas. Open it in Claude Code, or run the site yourself.

| path | what |
| --- | --- |
| `nextjs/` | the site (Next.js): Examples, Utilities, Ideas |
| `content/` | the site's words, in Markdown: `home.md`, `utilities.md`, `examples/`, `ideas/` (one file per idea) |
| `ll-utilities/` | small readable scripts that call Harvard's HUIT AI APIs and a few outside services; its `README.md` says how to use them |

## Run the site

```
cd nextjs
pnpm install
pnpm dev
```

The site is at http://localhost:3112. Every example runs in your browser: nothing calls a model or stores what you type, and model output that was generated beforehand is labelled as recorded.
