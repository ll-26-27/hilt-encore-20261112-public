# Accessibility — v2 ideas

A working document for what `phet-sim` v2 (and the sibling skills `/phet-critique`, `/phet-port`) could do beyond the current floor. The current `rubrics/accessibility-checklist.md` is deliberately a floor — keyboard, labels, contrast, sizing. This document is the ceiling we have not yet built toward.

The work here splits into three tracks:

1. **Tighten the floor** — fixes to the current templates and checklist that close real gaps without changing the skill's scope.
2. **Check accessibility automatically** — move the QC pass from eyeball-checked to measured.
3. **Alt versions of the visualization** — make the skill produce more than one rendering of the same conceptual model, tuned to different students' needs.

The framing principle: in a physics class, **the simulation is the content**. An inaccessible simulation is not a UX problem; it's a student who can't learn what the rest of the class is learning. That makes accessibility a *pedagogical* requirement, not a polish item.

---

## Track 1 — Tighten the floor

These are concrete additions to the v1 floor. Most are small.

### 1.1 `prefers-reduced-motion` in every template

Every template that animates (canvas, linked-graph) should include:

```css
@media (prefers-reduced-motion: reduce) {
  /* Stop the animation loop; surface a "step" button as the primary control. */
}
```

In JS, branch on `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at init: if true, default `state.running = false` and bring the Step button to the foreground.

### 1.2 Throttle `aria-live` readouts

A live region that fires 60 times a second is hostile. Pattern to adopt across templates:

- The visible readout updates every frame (sighted users want immediate feedback).
- A *separate*, screen-reader-only element updates at most every ~500ms, debounced when the user stops moving the slider.
- For monotone changes during animation, announce at meaningful events only: "peak reached," "zero crossing," "amplitude doubled."

This is a templated helper (`announce(text)`) more than a per-sim decision.

### 1.3 Color-safe defaults

Replace the current red/blue palette with one that survives deuteranopia and protanopia, and add a second non-color channel everywhere color carries meaning:

- Series 1: blue solid line, no marker.
- Series 2: orange dashed line, square markers.
- Series 3: black dotted line, triangle markers.

Add a CSS variable `--pattern-stroke-dasharray` so templates can switch on it without per-sim edits.

### 1.4 Touch targets

Add to the floor checklist: every interactive element ≥ 44×44px (Apple HIG) or ≥ 48×48px (Material). Slider thumbs need explicit `::-webkit-slider-thumb` and `::-moz-range-thumb` styling — the platform defaults are smaller than the floor.

### 1.5 Focus management on Reset

After Reset is pressed, focus should land somewhere predictable — typically the first slider — not stay on the Reset button (which has just changed meaning). One line per template.

### 1.6 `lang` and reading-level pass

Every generated file gets `<html lang="en">` (already done). Add to QC: read the visible prose (title, goal, What to notice, Try this, Model limitations) through a reading-level check. Target Flesch–Kincaid grade 9 unless the target learner is an upper-division specialist.

---

## Track 2 — Check accessibility automatically

The v1 QC pass is "the LLM looks at the file and decides." That works for `<label for>` but not for contrast, focus order, or live-region thrash. v2 should *measure*.

### 2.1 A `/phet-accessibility-audit` sub-skill

Input: a generated `.html`. Output: a markdown report with line-numbered findings.

Checks to implement:

- **Contrast ratios.** Parse `:root` CSS vars, compute WCAG contrast for each foreground/background pair used. Report any < 4.5:1 for body text or < 3:1 for UI.
- **Form-control labeling.** Every `input`, `select`, `button` must have an associated label, `aria-label`, or `aria-labelledby`. Output line numbers of failures.
- **Heading order.** No `<h3>` without an enclosing `<h2>`. Single `<h1>`.
- **Live-region density.** Detect `aria-live` elements updated inside `requestAnimationFrame` or `setInterval(_, < 250)`. Flag as likely thrash.
- **Canvas without DOM parallel.** A `<canvas>` element with no sibling `<output>`, `<div aria-live>`, or descriptive `<p>` describing its state.
- **Motion without media query.** `requestAnimationFrame` or CSS animations without a `prefers-reduced-motion: reduce` branch.
- **Color-only information.** Heuristic: any element whose only distinguishing CSS property between two states is `color`, `background-color`, `fill`, or `stroke`.
- **Keyboard reachability of custom controls.** Any `div`/`span` with a click handler but no `tabindex` and no `role`. (LLM-detected, not regex; the report should quote each.)

The audit report should be a single markdown file with three buckets: **Blockers** (fail the QC pass), **Warnings** (worth fixing), **Notes** (style-level).

### 2.2 Optional `axe-core` runtime mode

For users who want a deeper check, the skill can offer a one-time `--with-axe` flag that injects `axe-core` from CDN into the generated file behind a `?audit=1` URL parameter. Page loads normally for students; appending `?audit=1` runs axe and prints the report to the console. This preserves the no-build, no-fetch contract for students while giving faculty a self-serve audit.

### 2.3 Integrate the audit into the main skill

The `/phet-sim` workflow's final step becomes:

```
8. Run quality checklist (LLM eyeball pass).
9. Run /phet-accessibility-audit on the file. Resolve all Blockers. Show Warnings to the user.
10. Save to output location.
```

A simulation cannot be declared done while Blockers exist, the same way it currently cannot be declared done while scoring 0 on a rubric dimension.

---

## Track 3 — Alt versions of the visualization

The most ambitious track, and the one most likely to change how this skill is taught. The idea: the pedagogical interview gains a question about *learner needs in the room*, and the skill produces additional renderings tuned to those needs. The original sim is still the canonical artifact; the alt versions are siblings, not replacements.

### 3.1 New interview question

Insert between current Q2 (target learner) and Q3 (misconception):

> **Learner needs profile.** Are there students in your class for whom the default visual rendering will not work? Options to consider (check any that apply, leave blank if not applicable at this stage):
>
> - Blind / screen-reader users
> - Low vision
> - Color-blind (deuteranopia, protanopia, tritanopia)
> - Motion-sensitive (vestibular disorders, migraine triggers)
> - Cognitive load sensitivity / processing differences
> - Students who learn best through audio / aural representations
> - Students who need more time to process state changes

The skill produces one alt version per checked box, with a shared state object so the renderings stay synchronized. Each alt version opens in the same HTML file under a tab or radio-group selector, so the artifact remains a single file.

### 3.2 The alt-rendering catalog

A reference list the skill draws from. None of these is novel individually; the contribution is bundling them as first-class outputs.

| Need | Rendering | Implementation |
|---|---|---|
| Blind / screen-reader | **Text+table view** — current state as a prose paragraph; history as a scrollable table the student can arrow through. | DOM only. No SVG/Canvas. Live region announces "value changed" on commit, not on every frame. |
| Blind / screen-reader | **Sonified view** — pitch maps to amplitude or position; tempo maps to frequency or rate. | Web Audio API. Single oscillator, single gain node. ~50 LOC. Mute toggle required. |
| Low vision | **Large-print view** — same visual, body text 24px, viewport labels 28px, controls 1.5× scale. | CSS-only variant via a class on `<body>`. |
| Low vision | **High-contrast view** — pure black/white, no grays, no light pastels. Outlines instead of fills. | CSS variable override block. |
| Color-blind | **Pattern-coded view** — every color-distinguished element gets a redundant pattern (dash, marker, fill texture). | SVG patterns; CSS `background-image` for DOM elements. |
| Motion-sensitive | **Step-only view** — autoplay disabled; user advances time via a Step button or arrow keys. Optional "skip to peak" / "skip to zero crossing" semantic jumps. | Same simulation, autoplay flag flipped, additional buttons. |
| Motion-sensitive | **Static-snapshot view** — three pre-rendered states (initial, midpoint, equilibrium) side by side, no animation. Sliders rerender all three. | Same render function called three times with different state. |
| Cognitive load | **Progressive-disclosure view** — sliders hidden by default; student reveals one at a time. The Try-this panel guides the order of reveal. | CSS `details`/`summary`. |
| Cognitive load | **Plain-language view** — Try-this and Model-limitations panels rewritten at ~grade 6 reading level. Title and goal also simplified. | Toggle in the header; both texts live in the file. |
| Aural learners | **Narrated view** — `SpeechSynthesis` announces state on each control change ("Frequency is now 1.5 hertz. The wave is faster."). Toggle on/off. | Web Speech API. ~30 LOC. |
| More processing time | **Slow-mo view** — TIME_STEP reduced 5–10×. Optional "freeze on change" mode that pauses animation for 2 seconds after any slider move. | One config constant + a setTimeout. |

### 3.3 Carrying the design record across alt versions

The header design record stays in the single file. Alt versions appear as labelled sections of the same HTML, selectable via a tab strip or radio group at the top of the page. Selection persists in `localStorage` keyed by simulation title so a student doesn't have to re-select on every visit. (`localStorage` is single-file-safe; it does not violate the no-runtime-fetch contract.)

### 3.4 What this changes about the skill's identity

v1 phet-sim: "produce one PhET-style sim from a learning goal."

v2 phet-sim: "produce one PhET-style sim *and* the matching set of alt renderings, so that the artifact is usable by every student in the room."

This is a real expansion of scope. It will roughly double the size of the generated file and the length of the pedagogical interview. The benefit is that the artifact stops being a thing-faculty-also-need-to-make-accessible-later and becomes accessible-by-construction. The cost is a longer skill workflow; the saving is that faculty don't have to be the ones writing the alt renderings from scratch.

---

## Open questions

- How many alt versions before the file gets unwieldy? Best guess: 3 is fine, 5 is the ceiling.
- Should sonification be opt-in (default off) or context-sensitive (on when a screen reader is detected)? Detection is unreliable in browsers; opt-in is safer.
- For the audit track, do we generate the report as a separate `.md` next to the `.html`, or embed it as an HTML comment in the file itself? Embedding keeps the artifact single-file but makes the report harder to read.
- Should the alt-rendering catalog live as a separate skill resource file (loadable into the model's context only when needed) or stay inside `SKILL.md`? Probably separate, given length.

## Suggested next moves

1. Backfill Track 1 fixes into the current templates. Two-hour job; no scope change.
2. Draft `/phet-accessibility-audit` as a standalone skill (it's useful even before v2 of `/phet-sim` ships, since it can audit anything).
3. Pick one worked example (e.g. the oscillation sim) and prototype the alt-rendering bundle end-to-end. This forces all the design questions in §3 into concrete decisions.
4. Run the bundled sim past one or two students with relevant needs before generalizing the pattern.

The third move is the one that will tell us whether the v2 ambition is real or whether the floor + automated audit is enough.
