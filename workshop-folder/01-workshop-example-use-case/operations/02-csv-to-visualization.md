# Prompt — comfort-spectrum CSV → interactive HTML

Paste this as the instruction for a run. It assumes `outputs/ai_comfort_spectrum.csv`
already exists (see `01-photos-to-csv.md`).

---

## The task

Build a single self-contained HTML page showing where the workshop tables placed
eighteen teaching tasks on a 1–10 AI-comfort spectrum.

Write it to **`outputs/ai_comfort_spectrum.html`**, as a file — do not publish it as
a hosted page. Embed the CSV rows as JSON in the page so it opens by double-clicking:
no server, no `fetch`, no sidecar data file. Webfonts are the one permitted network
request; everything else must be inline. Design so the page still reads correctly in the
fallback stack, because offline that is what a reader gets. 

The page is titled **AI Comfort Spectrum** — use that exact string, in that case, as both
the `<title>` and the `<h1>`.

Read the CSV first and compute the real summary figures. Never hard-code a number the
data can produce.

### What the columns mean

- `comfort_level` — integer 1–10, **authoritative**. Every chart position, median and
  sort order uses this column.
- `position_on_scale` — the unrounded measured position. Shown in tooltips and the
  table; never used to place a mark. It will sometimes disagree with
  `round(position_on_scale)` because near-identical positions were pooled upstream.
  That is expected; do not "correct" it.
- `tied_with` — how many other cards were pooled into the same cluster. Reproduce it
  verbatim in the data table; it drives nothing on the chart.
- `confidence` — `high`, `medium` or `low`. **Only `low` is drawn hollow, and only `low`
  is removed by the hide filter.** `medium` is drawn as an ordinary dot.
- `group`, `task`, `task_type` and `source_image` are self-explanatory; no other column
  exists, and none is unused.
- The CSV carries no exclusion log. Read `outputs/filename_map.csv` for it if that file
  is present; if it is not, say plainly in the footnote that the data does not record
  which photos were set aside — do not infer or invent exclusions.

---

## The form

One row per task, sorted by **median `comfort_level`**, lowest at the top, **ties broken
alphabetically by task name** — six medians tie in the 2026 data, so without that rule the
row order is undetermined. Each row is a horizontal track from 1 to 10 carrying one dot
per group. This is a dot plot, not a bar
chart — the point is the *spread* across tables, and a bar of the mean would hide it.

- **Cards sharing an integer stack vertically** within the row, centred on the track, so
  a tall column reads as agreement. Size each row to its tallest stack.
- Mark each row's **median `comfort_level`** (which may land on a half) with a marker
  that cannot be mistaken for a gridline — a small filled caret on a faint vertical line
  reads well; a plain 2px bar does not. This applies to both views.
- **Medians and row order are computed from the cards currently drawn**, so they never
  contradict the dots. Hiding low-confidence readings can therefore reorder rows; that is
  intended. The summary strip, by contrast, is computed once from the whole file and does
  not respond to filters — say so beside it.
- Draw the track as a green tape strip: **`#cfe0bd` on a `#b3cb99` edge in light,
  `#36452b` on `#4a5e38` in dark.** It is what the groups actually used, and it gives the
  page one subject-specific detail that costs nothing. Keep it flat; a glossy gradient
  blows out in dark mode. Note that the tape, not the card surface, is what most marks
  sit on, so validate the series colours against the tape hex as the surface.
- Mark spec: **13px dots, 2px separation ring, 15px stack pitch.** Row height is
  `max(46, (tallest stack − 1) × 15 + 17 + 24)` — the trailing 24 is clearance so the
  median caret never collides with the top dot. Inset the scale at both ends by **at
  least the dot radius plus the ring** (≥ 9px here) — dots at 1 and 10 are centred on
  the endpoints and clip otherwise, most visibly at phone width.

A second view, one row per group, **ordered by group number**, shows each table's own
spectrum. Same mechanics, same scale, different grouping.

---

## Colour

Two series only: teacher card and student card.

- **Do not use pink and orange**, however tempting the match to the physical cards.
  Validate the pair first; `#e87ba4` against `#eb6834` fails the normal-vision
  separation floor outright — full-colour readers cannot reliably tell them apart.
- Use **blue `#2a78d6` for teacher, orange `#eb6834` for student** in light mode, and
  `#3987e5` / `#d95926` in dark. That pair clears every check in both modes. Say in the
  legend which card type each chart colour encodes — "Blue · teacher task", not a claim
  about the physical card colour, which the CSV does not record.
- **Encode confidence by shape, never by a third hue.** Rings, in one order: every dot
  carries an outer 2px ring in the surface colour so overlapping dots stay countable; a
  low-confidence dot *additionally* takes the surface colour as its fill plus a 2.5px
  inner border in its series colour, so it reads as hollow.
- Run any palette you change through the dataviz skill's `validate_palette.js` before
  shipping it. Do not reason about colour distance by eye.

Ink, gridlines and tape colours all come from theme tokens defined on bare `:root`, with
dark values redefined under both `@media (prefers-color-scheme: dark)` (guarded
`:root:not([data-theme="light"])`) and `:root[data-theme="dark"]`. Paint `body`'s
background from a token — a transparent body borrows the host's ground.

---

## What goes on the page

1. **Masthead** — a short eyebrow, the `AI Comfort Spectrum` title, and two or three
   sentences saying what a dot is and how to read a row. Do not assume the reader knows
   the activity.
2. **Summary strip** — a thin row of figures, not big cards: number of tables, cards
   placed, teacher median, student median, and the **widest split** — defined as
   `max − min` of `comfort_level` within a task — with the task that owns it.
3. **Controls, in one row above the chart** — switch rows between task and table; filter
   to teacher or student cards; hide low-confidence readings; a filter to select which dates of the data to show (and this would only apply to a CSV which had dates as one of the columns)-- either a specific date or a range of dates; and a theme control with
   **three** segments — Auto / Light / Dark, defaulting to Auto — where Auto removes
   `data-theme` from `:root` and the other two stamp it. Two segments would make the
   `prefers-color-scheme` block unreachable after the first click. Segmented buttons with
   `aria-pressed`, not dropdowns.
   Note that in the task view the card filter removes whole rows, because `task_type` is
   a property of the task; in the group view it thins each row.
4. **Legend**, always present, naming both series, the hollow-dot meaning, and the
   median marker.
5. **The chart**, with a sticky axis header carrying ticks 1–10 and the end labels
   **"Keep AI out"** (left) and **"Let AI do it"** (right).
6. **The table of rows**, in a collapsible section — the accessible equivalent of the
   chart, and not optional. It follows the filters, so it always matches what is drawn;
   name the active filter in its caption.
7. **A method footnote** — how positions became integers, what `position_on_scale`
   means and why it can disagree with `comfort_level`, and what the file does and does
   not record about set-aside photos.

---

## Interaction

- Hover any dot for a tooltip naming the table, the task, the integer, the mean, the unrounded
  position and the confidence. Position it with a pointer offset and flip it near the
  viewport edges so it never runs off screen.
- **Colour follows the card type, never the row's rank** — a filter that changes the
  row count must not repaint the survivors.
- Keyboard focus gets a visible ring on every control; respect
  `prefers-reduced-motion`.
- Empty state: if a filter combination matches nothing, say so in the chart area rather
  than leaving it blank.

---

## Build notes

- Everything meant to be read is visible at load — default to the task view, all cards
  shown, low-confidence included.
- Lay out with grid and `gap`. At phone width, drop the label column above the track
  rather than squeezing both. Keep a ≥16px side gutter; the page body must never scroll
  sideways.
- `font-variant-numeric: tabular-nums` wherever digits line up.
- Pair a display face with a body face and a mono for axis ticks and small labels; load
  them from Google Fonts with a real fallback stack. Avoid Inter and Space Grotesk.
- **Render before delivering:** light and dark at desktop, light at ~390px, plus — in
  either mode — the group view, one filtered state, and the empty state. Check for
  clipped end dots, colliding labels, a median marker that reads as a gridline, end
  labels duplicating the 1 and 10 ticks, and anything that blows out in dark mode. One
  look per case, then one pass of fixes. If the render environment has no network the
  webfonts will not load; say so rather than reporting that you checked the typography.
