# External tools

> [!WARNING]
> **External tools (fal, OpenRouter) are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.**
>
> "External" means anything that is not a HUIT gateway. These scripts send your prompt, and any image you attach, to a company outside Harvard. Use made-up or public material only: no student work, no names with grades, no unpublished research, no photos of people who haven't agreed. For anything sensitive, use the scripts in [`../huit/`](../huit/). Harvard's data levels are explained in [`_context/data-security/`](../../_context/data-security/).

Every script here repeats that warning in its `--help` and prints it before it sends anything. The wording lives in one place, [`warning.mjs`](warning.mjs). It is interim wording until the Learning Lab settles exactly where Harvard draws the line for tools like these.

## The scripts

| script | service and endpoint | what it does | tested |
| --- | --- | --- | --- |
| [`fal-image.mjs`](fal-image.mjs) | fal.ai queue API, `POST https://queue.fal.run/<model>` | a prompt (plus optional reference images) in, image files out in `_media/fal/<time>-<model>/` | 2026-11-12: `fal-ai/flux/schnell` (one watercolor image, 2.8 s); `fal-ai/nano-banana-2` (a two-panel comic, lettering exact, 13.5 s); `fal-ai/nano-banana-2/edit` with one reference image (13.9 s). All made-up prompts. |
| [`fal-models.mjs`](fal-models.mjs) | fal.ai, `GET https://api.fal.ai/v1/models` (public, no key) | lists the model IDs you can pass to `fal-image.mjs --model` | 2026-11-12: listed text-to-image models, with and without `--grep` |
| [`warning.mjs`](warning.mjs) | none | the warning text the other scripts print | |

## The two image models we chose

- **`fal-ai/nano-banana-2`** (the default): Google's Nano Banana 2. Good at layout and at drawing the exact words you ask for, so it suits comic pages, posters, and diagrams. Attach reference images with `--ref` (a character sheet, a sketch, a style sample) and the script switches to its `/edit` endpoint.
- **`fal-ai/flux/schnell`**: FLUX.1 schnell. Fast and cheap, good for trying out a prompt. It takes no reference images.

Any other fal model ID works with `--model`; find them with `fal-models.mjs`. Not every model accepts every option. Each run is billed to the key's fal account; prices are on each model's page at `https://fal.ai/models/<id>`.

## Try it

Put your fal key in `.env` at the repo root as `FAL_API_KEY` (see `.env.example`), then:

```
node --env-file=.env ll-utilities/external/fal-image.mjs --help
node --env-file=.env ll-utilities/external/fal-image.mjs "a lighthouse built from library books, watercolor" --model fal-ai/flux/schnell --dry-run
node --env-file=.env ll-utilities/external/fal-image.mjs "a lighthouse built from library books, watercolor" --model fal-ai/flux/schnell
```

The last line prints the path of the saved image. The folder beside it also holds `request.json` (what was sent, without the key) and `response.json` (what fal sent back). `_media/` is gitignored, so images stay on your computer.

More:

```
node --env-file=.env ll-utilities/external/fal-image.mjs "a four-panel comic about ..." --aspect 1:1
node --env-file=.env ll-utilities/external/fal-image.mjs "the same character, now waving" --ref sheet.png
node --env-file=.env ll-utilities/external/fal-image.mjs --prompt-file prompt.md --n 2
node ll-utilities/external/fal-models.mjs --grep flux
```

## Notes

- If `FAL_API_KEY` isn't already set, the script reads `.env` at the repo root itself (through `../lib/env.mjs`), so `--env-file` is optional.
- Reference images go to fal inside the request. The same rule applies to them: public or made-up only.
- A job that takes longer than five minutes stops with its job ID. Nothing is resubmitted automatically.
- No video generation or batch runs here yet.
