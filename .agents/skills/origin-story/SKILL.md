---
name: origin-story
description: Turn a story someone tells you (how they, a project, or a team began) into a four- or eight-panel origin comic, with an optional short interview for more detail. Writes the script first, generates the art through HUIT's Gemini gateway by default (fal only on request and only for public or made-up material), and builds a local HTML reader and gallery. Use when someone asks for an origin story, a superhero origin, or a comic about how something started.
---

# Origin story

Turn particular experiences into a visible, specific power. Keep the person's facts and adapt the fictional form. You write and revise the story; the scripts in this repo make the images and the book.

## Start with what they gave you

Read their input first. Offer one short chance to add the details that would most improve this story: the actual ability, a formative scene, the tone they want, appearance. Ask whether they want to add those, have a longer interview, or go ahead with what's there. Don't make them repeat anything. If they've said "just go with what you have," go. A longer interview is opt-in; read [interview.md](references/interview.md) when it is.

Thin context is not a blocker. Make the best story you can, keep invented stage business clearly invented, and write down your assumptions separately from their facts.

**Data first.** A life story is personal information. Use HUIT's gateway for images (the default below). If the material is about someone other than the person at the keyboard, ask whether that person has agreed. Students' stories, grades, health, or anything confidential: stop and ask before going further, and never send it to an external tool. The repo's rule is in `CLAUDE.md` and `_context/data-security/`.

## Choose scope and mode

- **One story:** four panels unless they ask for eight. Read [story-craft.md](references/story-craft.md) for shapes, genre variations, and the script format.
- **A team:** each person's origin first, then a frame story that brings their abilities together. Each part is four or eight panels.
- **Image mode:** `page` (one image per four-panel page; fewest calls, good lettering) or `panels` (a character sheet first, then one image per panel with the sheet attached). Default to `page`. Read [images.md](references/images.md) before generating.
- **Image route:** HUIT Gemini (`ll-utilities/huit/gemini-image.mjs`) by default. fal (`ll-utilities/external/fal-image.mjs`, Nano Banana 2) only if they ask for it and only for made-up or public material: **external tools (fal, OpenRouter) are not Harvard-approved: send them only public (Level 1) material, never confidential data.** Say which route and model you're using.

## Make the comic

Work from the repo root. Each comic gets its own folder, by default `_media/comics/<comic-title>/` (gitignored, so it stays on their computer). Never overwrite an earlier comic: add `-2`, `-3`.

```
_media/comics/<comic-title>/
  brief.md                     their input, your assumptions, and what is invented
  scripts/<story>.md           the script, one per story
  prompts/<story>/             written by prepare.mjs
  images/characters/           character sheets (png originals, small jpg copies)
  images/<story>/              page-01.png, or panel-01.png … panel-04.png
  book.json                    title and reading order
  index.html                   written by book.mjs
```

1. **Brief and script before any image.** Write `brief.md`, then the script in the format in [story-craft.md](references/story-craft.md#script-format-for-the-bundled-prompt-preparer): `## Visual direction`, then `## Panel 1 — …` through `## Panel N — …`, with `Art:`, `Caption:`, `Dialogue:`, `Lettering:` lines. Read only the captions and dialogue: can a new reader follow who this is, what their ability is, and why it matters? Use narration boxes for what the reader needs to know. Their latest corrections override earlier drafts; don't invent a causal claim to bridge a gap. If they asked to review the text first, stop here and show it. [examples/story.md](examples/story.md) is a made-up four-panel example.
2. **Prompts.** `node .agents/skills/origin-story/scripts/prepare.mjs _media/comics/<title>/scripts/<story>.md _media/comics/<title>/prompts/<story>` writes one prompt per panel and one per four-panel page, with no network calls.
3. **Book first, so they can watch it fill.** Write `book.json`:
   ```json
   { "title": "The Proofing Drawer", "pages": [ { "image": "images/ada/page-01.png" } ] }
   ```
   For `panels` mode a page is `{ "panels": ["images/ada/panel-01.png", "…", "…", "…"] }`. Then `node .agents/skills/origin-story/scripts/book.mjs _media/comics/<title>` and open `index.html`. Images not made yet show as labeled empty slots.
4. **Images, one call at a time.** Character sheets first if using `panels` (or for a multi-page story). Then each page or panel, for example:
   ```
   node ll-utilities/huit/gemini-image.mjs --prompt "$(cat _media/comics/<title>/prompts/ada/page-01.md)" --aspect 1:1 --out _media/comics/<title>/images/ada/page-01.png
   ```
   Add `--ref _media/comics/<title>/images/characters/<id>.jpg` for each character in the shot. Look at every result before the next call (identity, action, exact lettering, four panels in order for a page). Rebuild the book after each image you keep.
5. **Deliver.** Rebuild, open `index.html`, check the reader and the gallery, and give them the folder and the `index.html` path. Say what is unfinished; never call a partial comic complete.

Each image call costs a little on the key's account. Tell them roughly how many calls a plan needs before you start (a four-panel page comic: one; four panels with one character sheet: five) and don't run batches without asking.

## Craft

Show a particular ability working; don't label a generic virtue. Don't manufacture trauma, a tidy lesson, or superiority over a whole profession. Keep the doubleness and unresolved tensions when they matter. Fictional stage business is welcome; invented biography must not become a fact. Keep the person's register (sincere, playful, a little ironic, whatever they bring) through the last panel.

## What's here

- `references/story-craft.md`: from context to panels, genre variations, the script format, frame stories.
- `references/interview.md`: the optional interview, one question at a time.
- `references/images.md`: routes, modes, character sheets, checking images.
- `scripts/prepare.mjs`: script → prompts (no network).
- `scripts/book.mjs`: `book.json` → `index.html` reader and gallery (no network).
- `examples/story.md`: a made-up four-panel script.

Ported from the Learning Lab's TDM 155AI origin-story skill (November 2026). This version uses only this repo's scripts and plain Node: no packages, no OpenRouter, and HUIT as the default image route.
