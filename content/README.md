# content/: the words the site shows

Agreed November 12, 2026, between FE (the site, `nextjs/`) and CX (the words, this folder). FE proposed it; CX wrote it down. The app renders whatever is here and shows a placeholder for anything missing. **Everything in this folder is published.** Speaker notes, sources, and anything private stay in the private working repo.

## Layout

```
content/
  README.md              this contract (the app never renders it)
  home.md                the home page
  talk/
    NN-<slug>/           one folder per part of the talk; the NN- prefix sets the order, following HL's run of show:
                         00-open, 01-learning-lab, 02-why-this, 03-design, 04-what-we-learned, 05-what-comes-next, 06-close
      README.md          the part, as a readable page
      01-<slug>.md       one slide per file; the NN- prefix sets the order
  take-home.md           repos, tools, examples, links
  wondering.md           (optional) the "learned / wondering" close
```

## Frontmatter

**`home.md`**

| field | what |
| --- | --- |
| `title` | the talk's title |
| `subtitle` | one line under it |
| `date` | e.g. `Thursday, November 12, 2026` |
| `time` | e.g. `12:00–1:00 PM ET · Zoom` |
| `people` | list of strings, names exactly as the invite or HL gives them |
| `url` | the public short link, for the QR code; blank until Marlon deploys |

Body: the talk in brief, two to four short paragraphs.

**`talk/NN-<slug>/README.md`** (a part)

| field | what |
| --- | --- |
| `title` | the part's title |
| `question` | the kicker in one line, e.g. `Why were we doing all this AI stuff?` |
| `who` | who leads it, e.g. `Marlon`, `Madeleine` |
| `minutes` | a number |

Body: the part as a readable page for participants (not shown on the slides).

**`talk/NN-<slug>/NN-<slug>.md`** (a slide)

| field | what |
| --- | --- |
| `title` | string, shown big |
| `layout` | one of `statement` (one big line, the default), `bullets`, `quote`, `image`, `demo`, `set-piece`, `shift`, `made`, `qr` |
| `who` | optional; a small label in the corner, e.g. `Madeleine` |
| `image` | optional; a path beside the file or a URL (layout `image`) |
| `demo` | optional; a URL or site path the slide opens (layout `demo`; shows a big "open" button and the address) |
| `cite` | optional; a source line under a quote |
| `site` | optional, default `true`; `false` keeps the slide out of the readable part page |

Body: the slide's words in Markdown. Keep slides short: one heading-sized line, or three to five bullets. For layout `shift` (meant for part 3's day-by-day plan), write one `## <label>` per column (e.g. `## Sept`, `## Oct`, `## Nov`) with bullets under each; the app shows them as columns that reveal one by one. Layout `made` is "how this talk was made": the live view of this morning's workspace (part 4); set `image:` to a screenshot as the fallback for when it isn't live, and the body's words are the fallback if there's no image. `kind` and `speaker` are accepted as aliases of `layout` and `who`. There is no `notes` field: speaker notes are never published.

The app makes two slides itself: part `00`'s first slide is a title slide from `home.md` (with the QR code and a countdown), and part `06` gets a QR "take it home" slide unless it already has a `qr` slide. A missing part number shows as a placeholder.

**`take-home.md`**: frontmatter `title`, `subtitle`. Body: `## <group>` headings with link lists. Every link is a full `https://` URL, so it works on a phone.

**`wondering.md`** (optional): two sections of bullets, `## Learned` and `## Wondering`. Static; nothing is stored from visitors without Marlon's go.

## Images and media

Small images go beside the Markdown that uses them (the app serves them). Anything big goes in the gitignored `_media/` at the repo root and is flagged to HL.

## Rules for the words

- "The Learning Lab," never "the Lab"; "the Learning Lab studio" for the place.
- No student names. A faculty member's story appears only as `[permission pending: …]` until Marlon confirms permission.
- Every repo or page linked from here is public at the time it is linked; CX checks each one (`gh repo view <repo> --json visibility`, and that the URL resolves).
