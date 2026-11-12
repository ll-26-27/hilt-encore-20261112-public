---
name: phet-accessibility-audit
description: Audit a single-file PhET-style HTML simulation for accessibility against the project's accessibility floor and v2 ideas. Produces a categorized markdown report (Blockers / Warnings / Notes) with line-numbered findings. Use after `/phet-sim` produces an artifact, or standalone on any imported `.html` simulation, or as a periodic check on an existing sim before sharing it with students.
---

# phet-accessibility-audit — Accessibility audit for single-file simulations

## Purpose

Measure a single-file HTML simulation against the accessibility expectations of the `physics-interactives` project — both the v1 floor (`rubrics/accessibility-checklist.md`, bundled with this skill) and the v2 ideas (`accessibility-v2-ideas.md`, bundled alongside).

This skill's contribution is **moving the QC pass from eyeball-checked to measured**. The author of `/phet-sim` runs the floor checklist by reading the file. This skill runs it by reasoning about specific properties of the file with deterministic helpers where possible (contrast ratios, label coverage, `aria-live` density) and LLM judgment where heuristic (color-only information, prose reading level).

## When to invoke

- Final pass at the end of `/phet-sim` (replaces the v1 eyeball checklist).
- Standalone, when a user has an `.html` simulation (produced here or imported) and wants an audit before sharing it with students.
- As input to the planned `/phet-critique` skill, which uses this audit as the accessibility section of a broader review.

Do not invoke for: multi-file web apps, framework-built sites, non-simulation content (slide decks, articles). This skill assumes the single-file artifact shape that `/phet-sim` produces.

## Inputs

- **Required:** path to a `.html` file.
- **Optional:** the user can name specific concerns to weight more heavily ("the student I'm thinking about uses a screen reader" → weight Blockers in the canvas, live-region, and DOM-parallel categories).
- **Optional:** `--apply-fixes` mode where, after presenting the report, the skill offers to apply automatic fixes for the categories that have safe, mechanical fixes (adding `<label>` associations, inserting `prefers-reduced-motion` blocks, etc.).

## Output contract

A single markdown report at `<original-stem>.accessibility-audit.md` next to the audited file. (Or embedded as an HTML comment at the bottom of the audited file if the user passes `--embed`.)

Structure:

```markdown
# Accessibility audit — <filename>

Audited: <date>
Floor reference: ../rubrics/accessibility-checklist.md
v2 reference: ../accessibility-v2-ideas.md

## Summary
<count> Blockers, <count> Warnings, <count> Notes.

## Blockers
<must-fix items, with line numbers and quoted excerpts>

## Warnings
<items worth fixing>

## Notes
<style-level items>

## Suggested next steps
<a short numbered list of the highest-impact fixes>
```

A simulation with any Blockers must not be declared "ready to share with students." Warnings and Notes do not block.

## Checks to run

Run all of these. For each finding, record: severity (Blocker / Warning / Note), location (line number + short quoted excerpt), what is wrong, suggested fix in one sentence.

### Structural

1. **`<html lang>` present and non-empty.** Severity: Warning. (Most browsers infer, but screen readers need it.)
2. **Single `<h1>`; heading levels do not skip (no `<h3>` without an `<h2>` ancestor).** Severity: Warning.
3. **Page title is descriptive (not "Document", not the template placeholder).** Severity: Warning.

### Form controls and labels

4. **Every `<input>`, `<select>`, `<textarea>`, `<button>` has an accessible name** via one of: associated `<label for="">`, wrapping `<label>`, `aria-label`, `aria-labelledby`. Severity: Blocker.
5. **Units are present in the label text or the readout** for every numeric slider. ("Frequency: 1.0 Hz" passes; "Slider 1: 1.0" fails.) Severity: Warning.
6. **Every slider has a visible numeric readout** updating with the slider's value. Severity: Warning. (Often already enforced by `/phet-sim`'s output contract; verify.)

### Contrast

7. **Compute WCAG contrast for each declared foreground/background pair** in `:root` CSS variables and inline styles. Flag any pair used for body text < 4.5:1 (Blocker), and any pair used for large text or UI components < 3:1 (Warning). Quote both colors and the computed ratio.
8. **Focus indicator visible.** If `outline: none` or `outline: 0` appears, verify a `:focus-visible` rule provides a visible replacement (border, box-shadow, outline of contrasting color ≥ 3:1 against adjacent surfaces). Severity: Blocker if no replacement; Warning if replacement is weak.

### Live regions

9. **`aria-live` density.** Find every element with `aria-live="polite"` or `"assertive"`. For each, locate the JS that mutates its `textContent` / `innerHTML`. If that mutation occurs inside `requestAnimationFrame`, a `setInterval` with delay < 250ms, or a render loop that runs every frame, flag as Blocker. Recommend a throttled `announce()` helper.
10. **`aria-atomic` correctness.** Live regions that announce a sentence should have `aria-atomic="true"`; live regions announcing just a value can omit it. Severity: Note.

### Canvas

11. **Every `<canvas>` has a DOM parallel.** A sibling element (often `aria-live="polite"` or a static `<p>`) describes what the canvas currently shows, in plain language, with key state values. Severity: Blocker if canvas is the primary information channel.
12. **Canvas itself has an `aria-label` or `aria-describedby`** describing the kind of visualization. Severity: Warning. (Not sufficient on its own; check 11 must still pass.)
13. **Any draggable handle or interactive element inside a canvas has a keyboard equivalent in the DOM.** Severity: Blocker.

### Motion

14. **Continuous animation (`requestAnimationFrame` loop running by default, CSS `animation`) is guarded by `prefers-reduced-motion: reduce`.** The guard can be CSS-level (animation disabled) or JS-level (autoplay defaulted off). Severity: Warning at v1 floor; will move to Blocker in v2.
15. **No autoplaying audio.** If Web Audio or `<audio>` is used, it must be user-initiated. Severity: Blocker.

### Color-coded information

16. **No color-only information.** For each place where state is conveyed by color difference (line color in a graph, fill color of a state indicator, etc.), verify there is a second non-color channel: shape, pattern, position, label, dash style. LLM-mediated check — quote the visual element and the colors and explain why or why not a second channel exists. Severity: Warning.

### Keyboard

17. **Every interactive element is reachable by Tab.** Detect `div`, `span`, `<svg>` child elements that have click handlers (`onclick` attribute, or `addEventListener('click', ...)` on that ID) but no `tabindex` and no `role="button"`. Severity: Blocker.
18. **No keyboard trap.** Detect any focus management code that sets `focus()` in a loop or in a `blur` handler that re-focuses the same element. Severity: Blocker if present.
19. **Reset and Play/Pause buttons are operable by Enter and Space.** Native `<button>` elements get this for free; flag non-button elements used as buttons. Severity: Blocker if non-button.

### Typography and touch

20. **Body text ≥ 16px and line-height ≥ 1.4.** Severity: Warning.
21. **Slider thumbs and small buttons ≥ 44×44 px effective hit area** (computed from `::-webkit-slider-thumb` / `::-moz-range-thumb` styling plus the surrounding control). Severity: Note. (Less critical for desktop projector use; more critical if students will use on tablets.)

### Prose

22. **Reading level of visible student-facing prose** (the `<h1>`, `.goal`, "What to notice", "Try this", "Model limitations" panels). Read each block, estimate Flesch–Kincaid grade level qualitatively. If the target learner is undergraduate non-specialist and the prose reads above grade 12, flag as Warning. The target-learner level comes from the header design record at the top of the file.
23. **No emojis anywhere in the file** (project-wide convention). Severity: Blocker if present.

### Design record

24. **Header comment design record is intact** — the bracketed placeholders from the template should not still read `[Simulation title]` etc. Severity: Warning (the artifact still works, but the design record is missing).

## Workflow

1. Read the target `.html` file in full.
2. Run each check in order. For each finding, record severity, location, excerpt, and suggested fix.
3. Group findings into Blockers / Warnings / Notes.
4. Write the markdown report to `<stem>.accessibility-audit.md`, or embed it if `--embed`.
5. Print the summary line ("3 Blockers, 5 Warnings, 2 Notes") and the report path.
6. If `--apply-fixes` was passed: walk through the Blocker and safe-mechanical Warning categories one at a time, propose a unified diff for each, and apply on user approval.

## Categories with safe mechanical fixes (for `--apply-fixes` mode)

These are the only categories where the skill should offer to edit the file automatically — everywhere else, suggest a fix in prose and let the user decide.

- **Missing `<label for>` association** for an `<input>` that has a textual sibling that obviously labels it. (Often the case in templates that wrap the input in text.)
- **Missing `aria-label`** on a slider that has a visible textual label nearby — copy that text into `aria-label`.
- **Missing `prefers-reduced-motion` block** — append a CSS block + a JS guard at init based on detected animation patterns.
- **Missing `lang` attribute** — add `lang="en"` to `<html>`.
- **Emoji removal** — strip detected emoji characters. (Project-wide rule.)
- **`outline: none` without `:focus-visible` replacement** — append a `:focus-visible` rule with `outline: 3px solid #ffb800; outline-offset: 2px;` (matching template defaults).

Anything that requires *understanding the simulation* (color-only information, canvas DOM parallel content, prose reading level) is reported but not auto-fixed.

## Severity reference

- **Blocker** — the simulation excludes at least one category of student from the conceptual content. Do not declare done until resolved.
- **Warning** — a real accessibility issue, but the simulation is still mostly usable. Should be fixed before sharing widely.
- **Note** — stylistic or v2-ambition item; useful to flag, not blocking.

## What this skill explicitly is not

- It is not a pedagogical critique. It only audits accessibility. The broader pedagogical+technical review is `/phet-critique` (planned).
- It is not a full WCAG audit. It targets a narrower, sharper set of checks tuned to the kind of artifact `/phet-sim` produces. A formal WCAG 2.2 AA audit needs a real tool like axe or accessibility-insights.
- It does not run the file. All checks are static — they read the source. (A v2 of this skill could optionally inject `axe-core` for dynamic audit; see `accessibility-v2-ideas.md` §2.2.)

## Resources used by this skill

- `rubrics/accessibility-checklist.md` — the v1 floor (bundled).
- `accessibility-v2-ideas.md` — the v2 ambition (bundled); informs which Notes to surface.
- `../phet-sim/rubrics/simulation-quality-rubric.md` — only the row about accessible labels is relevant here; the rest is the domain of `/phet-critique`.

## Notes for the skill author (i.e., us)

- The temptation will be to expand this skill into a general accessibility linter. Resist. Its value is in being tightly tuned to the shape of artifacts this project produces.
- The contrast computation should be done from the source CSS, not by guessing. If a CSS variable is overridden in a media query (`prefers-color-scheme: dark`), audit both branches.
- For the `aria-live` density check, the deciding question is *how often the text inside the live region actually changes*, not just how often the surrounding code runs. A render function that writes the same value every frame won't actually trigger announcements in most screen readers — but relying on that is fragile. Recommend throttling regardless.
- This skill is project-scoped at `.claude/skills/phet-accessibility-audit/`. Its rubric, v2-ideas roadmap, and SKILL.md are bundled here so the whole audit travels with the project.
