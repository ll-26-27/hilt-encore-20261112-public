# Accessibility checklist

The accessibility floor for any simulation produced by `/phet-sim`. Every item below is checked by the skill's QC pass before declaring a simulation done.

This is a **floor**, not a ceiling. A simulation that passes every item here is accessible enough to share with a class. A simulation that aims higher (full ARIA labeling on dynamic SVG, screen-reader narration of state changes, dyslexia-friendly typography) is welcome to do so — but the floor is non-negotiable.

## Keyboard operability

- [ ] Every control reachable by Tab in a logical order (left-to-right, top-to-bottom by visual layout).
- [ ] Sliders respond to keyboard:
  - Arrow keys: single step.
  - Page Up / Page Down: ~10% step (defaults are usually fine — don't override unless the step is meaningful).
  - Home / End: minimum / maximum.
- [ ] Buttons (Reset, Play/Pause, Step) operable by Enter and Space.
- [ ] No keyboard trap — Tab can always exit any control.
- [ ] `:focus-visible` outline is preserved. If `outline: none` is used, a visible replacement (border, box-shadow) is provided.

## Labels and accessible names

- [ ] Every `<input>`, `<select>`, `<button>` has one of:
  - An associated `<label for="...">`.
  - An `aria-label` attribute.
  - An `aria-labelledby` reference.
- [ ] Sliders show their current numeric value in a live-updating readout adjacent to the control (this is also good UX, not just accessibility).
- [ ] Units are part of the label or the readout — never implicit.
- [ ] The simulation's overall purpose is conveyed by the page `<title>`, the `<h1>`, and the visible learning-goal sentence — all of which a screen reader will encounter in the first few seconds.

## Color and contrast

- [ ] WCAG AA contrast for body text (4.5:1 against background).
- [ ] WCAG AA contrast for UI components and large text (3:1).
- [ ] No color-only information. If red means "danger" and green means "safe," shape, position, label, or pattern carries the same message.
- [ ] Critical state changes (e.g. "you crossed a threshold") are signaled by at least one non-color cue — a label change, a position change, an outline, an icon shape.

## Typography and sizing

- [ ] Body text minimum 16px.
- [ ] Viewport labels (the text *inside* the SVG or Canvas) minimum 18px equivalent at the rendered size.
- [ ] Line height at least 1.4 for any block of running text (the "Try this" panel, the limitations panel).
- [ ] No reliance on hover-only affordances — every hover state has a focus-state equivalent (relevant for tooltips, label reveals).

## Layout and resize

- [ ] At 1024px viewport width, the layout does not require horizontal scroll.
- [ ] At 800px viewport width, the layout reflows gracefully (controls above viewport, or some other single-column arrangement). The viewport never disappears.
- [ ] If using SVG for the model, labels are `<text>` elements (not background images) so they zoom with the page and remain crisp at any DPI.

## Canvas-specific (only if using `<canvas>`)

- [ ] Key state values are also exposed in a DOM readout outside the canvas. Screen readers cannot see canvas content; the readout is the parallel channel.
- [ ] If the canvas is the primary information channel, an `aria-label` or sibling `<p>` describes what is being shown in plain language.
- [ ] Interactive elements (draggable handles, buttons) inside a canvas have keyboard equivalents in the DOM.

## Things this checklist deliberately does not require

These are *welcome but not required* — including them would slow the workshop and discourage faculty from producing anything at all. They can become requirements later if specific courses demand them.

- Full ARIA live-region announcements for every state change.
- Screen-reader narration of dynamic SVG plots.
- Voice-control compatibility.
- High-contrast mode toggling.
- Dyslexia-friendly font alternatives.
- Reduced-motion media query handling (recommended if the simulation has continuous animation, but not floor-level required).

If a faculty member asks "should I add reduced-motion support?" the answer is yes — but the skill should not block on it.
