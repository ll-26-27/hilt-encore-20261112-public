# Images: which route, which mode, and keeping characters consistent

## Choose the route by what the story contains

An origin story is usually about a real person: their life, their work, sometimes their photo. Treat that as personal information.

| route | script | use it for |
| --- | --- | --- |
| **HUIT Gemini (default)** | `node ll-utilities/huit/gemini-image.mjs --prompt "…" [--ref sheet.jpg] [--aspect 1:1] --out <file>.png` | anything about a real person, any photo, anything you are unsure about. The gateway is Harvard's; what it is approved for is in `_context/huit/` and `_context/data-security/`. |
| fal, Nano Banana 2 (external) | `node ll-utilities/external/fal-image.mjs --prompt-file <prompt>.md [--ref sheet.jpg] [--aspect 1:1] --out <folder>` | only if the person asks for it, and only for made-up or public material. |

**External tools (fal, OpenRouter) are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.** Before any fal call, tell the person that the prompt and any attached images leave Harvard, show them what will be sent, and get a yes. Never send a photo of a real person, a student's story, or private details to fal. A fully made-up character or a story the person has already made public can go there. The script prints its own warning too; say it in your own words first.

HUIT Gemini's default model is `gemini-3.1-flash-image` (it takes reference images, up to 7 MB each). `--help` on either script lists other models. Don't switch routes silently after a failure: report the error and ask.

Both scripts take one prompt per run. The prompts from `prepare.mjs` are Markdown files: pass them to HUIT as `--prompt "$(cat prompts/<story>/page-01.md)"` and to fal as `--prompt-file prompts/<story>/page-01.md`. fal saves into a new folder and prints the image path; copy or move that image to where `book.json` expects it.

## Two modes

- **`page`: one image per four-panel page.** The model composes a 2×2 page and letters it. Good for Gemini and Nano Banana-type models, which handle layout and exact lettering well. A four-panel story is one call; eight panels are two. Character sheets are optional, useful for keeping a person the same across two pages.
- **`panels`: one image per panel.** Make a character sheet for each recurring person first, then generate each panel with the sheet(s) attached as `--ref`. Four calls per page, more control over each shot. Prose saying "the same person" is not a substitute for the image reference.

A story can mix modes page by page; `book.json` just lists, per page, one image or four.

## Character sheets

Give each recurring character one fixed description: face, proportions, hair, clothing, distinctive details, props. A sheet prompt:

> Create a character reference sheet for NAME. DESCRIPTION. STYLE. Show the same character in a full-body front view, three-quarter view, profile, and a few facial expressions. Consistent face, proportions, costume, hair, palette. Neutral light background. This is a production reference, not a story page. No captions or lettering. If a reference photograph is attached, use it for identity and render the character in the comic style.

Save it as `images/characters/<id>.png`. Look at it before using it. Shrink it before attaching it to later calls (smaller is faster and cheaper), on a Mac:

```
sips -Z 1536 -s format jpeg -s formatOptions 80 images/characters/ada.png --out images/characters/ada.jpg
```

Then pass `--ref images/characters/ada.jpg` on every panel or page that shows Ada, and name in the prompt who each attached sheet is. A team page can attach several sheets.

Photos are optional. Without one, make a clearly fictional design and say so; don't present it as a likeness. With one, it goes only to HUIT, and only with the person's agreement if it shows someone else.

## Check each image

After each generation, look at it: identity, age, props, the action, the exact lettering, who is speaking, and for a page, exactly four panels in reading order. Regenerate only what failed, saving the new take beside the old one (`page-01-take-2.png`) so the gallery keeps both; point `book.json` at the one chosen. Then rebuild the book.
