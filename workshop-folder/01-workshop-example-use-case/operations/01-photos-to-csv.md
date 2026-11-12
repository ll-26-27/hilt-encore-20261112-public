# Prompt — workshop photos → comfort-spectrum CSV

Paste this as the instruction for a run. It assumes a folder of photos in `inputs/`
and produces `outputs/ai_comfort_spectrum.csv` plus `outputs/filename_map.csv`.

---

## The task

Each photo shows one round table at the end of an AI-in-teaching workshop activity.
A strip of green tape runs across the table as a 1–10 spectrum: **left end = 1, "keep
AI out"; right end = 10, "let AI do it."** Groups placed round paper cards along it.

- **Pink cards = teacher tasks.** Assign the grade · Give feedback on drafts ·
  Draft a rec letter · Write exam questions · Write the problem set + solutions ·
  Design the rubric · Detect AI use · Clean the class dataset · Generate synthetic data
- **Orange cards = student tasks.** Draft the essay · Outline the essay ·
  Summarize the reading · Run + interpret the analysis · Explain a concept ·
  Code the interview transcripts · Make practice problems · Debug the code ·
  Find + check sources

A full set is 18 cards. Most tables are missing some — that is normal, not an error.
The pink is really a magenta (hue ≈ 300–330°); a threshold aimed at pastel pink misses
every teacher card.

Three phases: rename, read, score. If the photos live in a folder connected from the
user's computer, work on them there and keep intermediates in scratch; otherwise treat
the paths below as ordinary local paths.

**Optional fast path.** `operations/extract.py` implements every deterministic step
below, with each number in this document as a named constant at the top of the file:

    python extract.py prep inputs/ work/     # HEIC -> JPEG, tape made horizontal
    python extract.py detect work/           # tape, cards, contact sheets
    # read work/sheets/*-cards.png, fill in work/labels.json
    python extract.py score work/ outputs/ai_comfort_spectrum.csv

It does not replace this document: naming the cards and judging what to exclude are
still yours, and the script's constants are worth checking against the prose before
you trust a run. Ignore it entirely and implement from the text if you prefer — the
procedure is written to stand alone.

---

## Phase 1 — Normalize the filenames

Participants name their photos however they like: `group2`, `grp4`, `Group 6`,
`table 7`, `nine`, `GROUP10`, `11`, `group 5 final`, `g8-photo`, `Group12_photo`.

1. List `inputs/` and read the group number out of each filename: take the first run of
   digits that is not a four-digit year, and failing that the first spelled-out number
   word. Case, separators, spaces and extra words are all noise.
2. **Write `outputs/filename_map.csv` first**, with columns `original_name,new_name,group`.
   The original names are not recoverable after the rename, and a mapping that lives only
   in the chat reply is lost.
3. Then rename each file in place to `group-NN` + **its own original extension**,
   zero-padded. Use `mv -n` so nothing is silently overwritten.
4. If two files claim the same group number, or a filename carries no number at all,
   **stop and ask** rather than guessing — one of them is usually a second shot of a
   table already counted.

`source_image` in the final CSV is the **normalized** name.

---

## Phase 2 — Read each photo

### Prepare the image

- Convert HEIC to JPEG (`pillow-heif` + Pillow), longest side 2000px.
- **Fix the orientation before anything else.** Rotate so the tape axis runs
  horizontally — this turns every portrait shot landscape, and every pixel threshold
  below assumes a working image 2000px on its long edge. The phone's own orientation is
  unreliable and the required quarter-turn differs in direction from photo to photo.
- That leaves a 180° ambiguity, which card text cannot resolve at this size. Settle it
  semantically instead, reading a **full-resolution crop of the two end cards**:
  *Draft the essay* and *Assign the grade* belong low, *Debug the code* and *Generate
  synthetic data* high. If the spread runs backwards, rotate 180°.

### Locate the tape and the cards

Do this programmatically, not by eye — eyeballing 15+ positions per photo is where
errors come from. Starting HSV ranges, with S and V on 0–1; widen them per photo if a
mask comes back thin, and check the mask before trusting it:

| target | hue | sat | val |
|---|---|---|---|
| tape green | 75–165° | > 0.40 | > 0.35 |
| teacher magenta | 280–345° | > 0.30 | > 0.28 |
| student orange | 10–45° | > 0.45 | > 0.45 |

- **Tape:** keep connected components above ~1500px and pick the largest *elongated*
  one (PCA elongation ≥ 3) as the seed. A blobby green object — a bag, a helmet, a
  marker cap — will otherwise hijack the axis; one photo in the 2026 set had a neon
  helmet that did exactly that. Fit the axis by PCA on the seed, then extend it with all
  green pixels within ~45px perpendicular, since cards break the tape into segments.
- **Cards:** clean the colour mask with a binary **closing** (disk ≈ 0.15·R) before the
  opening (disk ≈ 5px) and hole-fill. The closing matters: hole-filling only closes
  *enclosed* holes, and a paperclip lying across a card cuts an open notch that halves
  the card's measured radius. Drop components under 200px, then split touching discs
  with a distance transform + watershed. Take each region's radius **`r` = the maximum
  value of the distance transform inside it**, not `sqrt(area/π)` — with that second
  definition the roundness test below is identically 1 and rejects nothing. Then:
  - **Bootstrap `R`:** label the raw mask, take `R₀` = median `r` over components above
    500px, segment once with `min_distance ≈ 1.25·R₀` and `threshold_abs ≈ 0.5·R₀`, then
    recompute `R` as the median `r` of the resulting regions and segment again. Pool
    teacher and student regions into **one `R` per photo** — the cards are physically the
    same size, and a per-colour `R` collapses on a photo that has only one card of a
    colour. A fixed `min_distance` smaller than a card splits single cards into wedges;
    card size varies with camera height.
  - keep a region only if `r` is within roughly 0.5·R to 1.6·R **and**
    `area / (π·r²)` lies between **0.85 and 1.9**. Note what this does and does not do:
    with `r` an inradius a clean disc measures about 1.05–1.40, so the test only rejects
    shapes that are not discs. It does **not** reject wooden floor or tabletop — those
    score like cards and survive to the contact sheet, which is the step that kills
    them.
- Project every card centre onto the tape axis. The axis handles camera tilt; the
  perpendicular distance, divided by `r`, tells you how far off the line a card sits in
  card-radii — the unit every rule below uses.

### Name the cards

You cannot read card text on a 2000px overview — the lettering is about 15px tall.

1. Render the overview with the detected axis, tick marks and a numbered ring on each
   card. Use it to fix the *geometry*: which detections are real, which cards were
   merged, what was missed.
2. Then crop each detected card out of the **full-resolution** image, lay the crops out
   as a numbered contact sheet, and read that to attach a task name to each index.
3. For a card the detector merged or missed: re-run detection on that photo alone with
   the peaks loosened (`min_distance ≈ 0.7·R`, `threshold_abs ≈ 0.3·R`), and take the
   centres it then reports. Falling back to reading coordinates off a zoomed crop by
   hand works but is slower and less accurate.
4. **The contact sheet outranks the keep-filter.** A detection the sheet shows to be a
   real card stays, whatever its `r` and roundness scored; those bounds decide what is
   worth cropping, not what counts as a card. A detection the sheet shows to be floor,
   chair or tablecloth goes, whatever it scored.

### What to exclude

Only cards actually positioned along the tape get rows.

- **Leftover deck.** A stack of undealt cards, usually paper-clipped, usually parked at
  one end of the tape. Two tests, in order: the same task already appears elsewhere in
  this photo (decisive — decks are drawn from a duplicate set), or the full-res crop
  shows a paperclip or stepped edges.
- **Pile.** Two or more cards whose centres lie within **2.2·r** of each other, all of
  them more than 4.5 radii off the tape line. Drop the pile whole. **Run this test before
  the singleton test below** — a pile member can sit inside the keep band, and the order
  alone decides whether its group loses the whole pile or only part of it.
- **Off-line singleton.** A lone card more than **8 card-radii** off the tape line is
  not placed — it is parked on a name badge, a chair, or the next table. Drop it.
  Between 4.5 and 8 radii it is kept and down-weighted (see confidence). A deck finding —
  a paperclip or stepped edges in the crop — excludes on its own and overrides this band.
  This boundary is the single most consequential judgment call in the procedure; state in
  your report every card it excluded. Be aware that it is measured in units of the
  segmentation's own `r`, so a noisy mask can move a card across the line without the
  card having moved: sanity-check any exclusion whose `r` is far from `R`.
- **Whole photos.** Drop a photo in which a **card** is cut by the frame edge, or that
  is a second shot of a table already counted. Tape running off the frame is harmless on
  its own — Phase 3 never uses the tape's ends. Ask before dropping a whole table.
- **Duplicate task inside one group.** If the same task survives twice, keep the copy
  nearer the tape axis and drop the other as a deck or pile card.
- **Table caught mid-activity.** Fewer than 6 cards placed means the table had barely
  started — ask. Six or more placed and spread along the tape is data; include it, and
  note the shortfall in your report.

---

## Phase 3 — Turn positions into 1–10

1. **Anchor on the cards, not the tape.** Within each photo, the leftmost surviving card
   is 1 and the rightmost is 10; interpolate everything between them linearly along the
   tape axis. The physical ends of the tape do not matter — they are often out of frame
   or simply unused. Be aware of what this costs: a table whose cards occupy only the
   middle two-thirds of its tape gets stretched to the full range, so its numbers are
   not strictly comparable to a table that used the whole tape. That is the intended
   trade — it makes tables comparable in *ordering* rather than in absolute position —
   but say so in your report for any table whose cards spanned less than half the tape.
   Take the tape's extent as the along-axis range of green pixels lying within 45px of
   the fitted axis; Phase 2 fits an infinite line, which has no ends of its own.
2. **Vertical stacking means the same number.** Perpendicular projection already handles
   this, so a card above or below another gets its neighbour's value.
3. **Pool near-identical positions.** Walk the sorted positions, keeping a current
   cluster. Add the next card if its gap **to the previous card** is `< 0.3` **and** its
   distance **from the cluster's first member** is `≤ 0.6`; otherwise start a new cluster
   at that card. The 0.6 cap matters: without it an evenly spaced row chains end to end
   and collapses the whole table to one number. Each cluster's integer is the cluster
   mean rounded **half up**, clamped to 1–10. (Python's built-in `round` is banker's
   rounding and will send 4.5 to 4; do not use it here.)
4. **Confidence.** Base it on how far the **cluster's mean** sits from the nearest
   integer: under 0.22 `high`, under 0.38 `medium`, otherwise `low`. An anchor card is
   always `high` at this stage, whatever its cluster scored. Then cap everything by
   how far the card sits off the tape line: beyond 4.5 radii cap at `medium`, beyond 7
   cap at `low`. The cap applies to anchors too — it can only lower, never raise.

Expect integers to skip. A table that used 1, 2, 3, 5, 9, 10 left real gaps on its
tape, and papering over them would invent data. Expect too that `comfort_level` will
sometimes differ from `round(position_on_scale)` — that is clustering doing its job, and
`comfort_level` is the authoritative column.

---

## Output

Write `outputs/ai_comfort_spectrum.csv` with one row per placed card:

| column | meaning |
|---|---|
| `group` | group number from the filename |
| `task` | card text, exactly as printed on the card |
| `task_type` | `teacher` or `student` |
| `comfort_level` | integer 1–10, authoritative |
| `confidence` | `low` / `medium` / `high` |
| `position_on_scale` | the unrounded position, 2 dp — shows why two cards tie |
| `tied_with` | how many **other cards were pooled into this card's cluster** (not how many share the integer — two separate clusters can round to the same number) |
| `source_image` | normalized filename the row came from |

Sort by group, then comfort level, then task type, then task.

## Before you call it done

- Every `task` is one of the 18 above, and `task_type` matches the card colour.
- No task appears twice within a group.
- Each group's anchor cards — the ones holding 1 and 10 — are not themselves on your
  exclusion list. (Checking that every group's min is 1 and max is 10 proves nothing;
  it is true by construction.)
- `tied_with` equals, for each row, the number of other rows in that group sharing its
  cluster.
- Card counts per group are plausible: 9–18, and never more than 9 of either colour.

## When to stop and ask

Ask rather than guess when a filename has no group number or two files share one; when
a photo is cropped so the row's start is invisible; when two photos look like the same
table; and when a table placed fewer than 6 cards. Everything else — missing cards, odd
spacing, a table that used only half the tape — is data, and goes in as it is.

Report at the end: the filename mapping, per-group card counts, every exclusion with its
reason, and any table whose cards spanned less than half its tape.
