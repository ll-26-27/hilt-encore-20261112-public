# What We Learned Teaching Harvard Faculty to Build with AI

The Learning Lab at the Derek Bok Center for Teaching and Learning, at the 2026 HILT Encore Event: Thursday, November 12, 2026, 12:00–1:00 PM ET, on Zoom.

This is the talk as a website, for participants to follow along and come back to: the slides for the day, plus the repos, tools, and examples we mention.

| path | what |
| --- | --- |
| `nextjs/` | the site (Next.js, App Router, TypeScript) |
| `content/` | the words and links the site shows, in Markdown; its `README.md` is the contract for how they're laid out |

Everything in this repo is public.

## Run it

```
cd nextjs
pnpm install
pnpm dev
```

The site is at http://localhost:3112. It reads `content/` on every request, so edited Markdown shows on reload.

| address | what |
| --- | --- |
| `/` | the talk in brief, a QR code to the site, and the five parts |
| `/present` | the slides |
| `/talk/<part>` | one part as a page to read (e.g. `/talk/01-learning-lab`) |
| `/take-home` | repos, tools, and examples |
| `/wondering` | what we learned, what we're still wondering |

## The slides

`/present` draws every slide on a 1600×900 stage scaled to the window, so it reads the same over a Zoom screen share. The address keeps your place (`/present#<slide>`).

| key | does |
| --- | --- |
| → space enter, or a clicker | next (a `shift` slide reveals one column per press) |
| ← backspace | back |
| 0–6 | jump to a part (0 the open, 6 the close) |
| home / end | first / last slide |
| f | full screen |
| g | every slide, to jump to one |
| q | the site's QR code, over anything |
| b | blank the screen |
| r | reload the words, keeping your place |
| ? | these keys |

On a phone, swipe left and right.

Not every slide is shown in the talk. A slide with `present: false` in its frontmatter is left out of `/present` (and its grid and part jumps) but still appears on its part's page at `/talk/<part>`, for participants to read. `site: false` does the opposite: the slide is shown in the talk but left off the part's page.

## Live parts

- **The title slide** counts down to noon ET, then shows how long the talk has been running.
- **The QR code** opens the `url` in `content/home.md`. Until there's one, it opens this repo.
- **"How this talk was made"** (layout `made`) shows the agents that built the talk this morning, and this repo's commits, refreshed every 10 seconds. It only works on the machine the talk was made on: set `HILT_RUN_JSON` in the gitignored `nextjs/.env.local` to the orchestration run's `run.json`. Anywhere else it shows the slide's screenshot or words instead. It shows roles, models, and status only.
