---
name: phet-sim
description: Author a PhET-style interactive simulation as a single self-contained HTML file that runs from file:// in Chrome. Use when a faculty member wants to build a manipulable, conceptually disciplined teaching artifact for a specific learning goal. The skill enforces a learning-goal-first workflow before any code is written, and an output contract that keeps the artifact portable (no build step, no server, no runtime data fetches).
---

# phet-sim — Author PhET-style interactive simulations

## Purpose

Help a faculty member produce a small, inspectable, locally runnable conceptual world that teaches one specific thing well — in the design tradition established by PhET Interactive Simulations.

The skill's job is not to make "an interactive diagram." It is to make a single-file HTML simulation that satisfies both a **pedagogical contract** (start from the misconception, link representations, state limitations) and a **technical contract** (open the file in Chrome, it works, no server required).

Background: see [essay-phet-tradition.md](../../../essay-phet-tradition.md) at the project root.

## When to invoke

Use this skill when the user wants to build a new interactive teaching artifact from a learning goal. Do not invoke it to add an interactive widget to an existing page, to convert React code, or to build a multi-page application — those are different jobs.

## Hard output contract (non-negotiable)

The skill must produce a single `.html` file with these properties:

- **Opens by double-click in Chrome from `file://`.** No `python -m http.server`, no `npx`, no build step.
- **No React, Vue, Svelte, Next.js, Vite, or any framework requiring a build step.**
- **No runtime data fetches.** No `fetch()`, no `XMLHttpRequest`, no loading JSON/CSV/images/audio at runtime. Every asset the simulation needs is either embedded inline or generated in code.
- **External CSS via `<link>` is allowed.** This is the one exception, because faculty may want to swap in a stylesheet and CSS does not break the file:// model.
- **External JS via CDN is allowed but discouraged.** If a CDN script is used (e.g. D3, p5.js), the file must include a comment marking it as internet-dependent, and the rest of the simulation should still degrade gracefully if the CDN fails.
- **No emojis** anywhere in the file.
- **Embedded `<style>` and `<script>` blocks** for all simulation-specific CSS and JS.

If the user explicitly overrides one of these (e.g. "I'm fine with a CDN dependency, this is just for my own course"), proceed but note the deviation in the file's header comment.

## Pedagogical contract (do this before writing code)

Do not begin with code. Open with a short structured interview that establishes the design before the implementation. The user should be able to skip steps they have already thought through, but the skill should not let them skip the *whole* design phase.

Capture answers to these, in this order:

1. **Learning goal.** One sentence. What should a student be able to do, see, or explain after using this simulation that they could not before?
2. **Target learner.** What level? What prior knowledge can be assumed?
3. **Core misconception or difficulty.** What does the simulation make visible that students typically get wrong, miss, or hand-wave past? This is the design's center of gravity.
4. **Manipulable variables.** What does the student get to change? List 2–5, with units and ranges.
5. **Deliberately hidden or fixed variables.** What is *not* manipulable, and why? Simplification is the pedagogical move; name it explicitly.
6. **Visual representations.** Which of these will be shown, and how will they be linked? (physical model, graph, equation, table, narrative readout). Aim for at least two linked representations.
7. **Feedback.** What changes on screen immediately when the student moves a control? What does "reset" do?
8. **Reflection prompts.** Three to five guided "Try this" experiments the student can run inside the simulation. These go in the HTML as visible prompts, not as instructor notes.
9. **Model limitations.** Two or three sentences naming what this simplified model gets wrong or leaves out. This goes in the HTML as a visible panel; it is part of the artifact, not metadata.
10. **Classroom use.** Where in a class session does this fit — pre-class, in-class demo, lab activity, post-class reflection? Affects pacing and depth.

Persist the answers as a header comment block at the top of the generated `.html`. They are the artifact's design record.

## Interaction patterns to prefer

- Sliders with live numeric readouts (the slider's value visible at all times).
- Draggable objects with snap-to-grid for precision when appropriate.
- Toggles and radio groups for discrete states.
- Reset button that restores the initial state cleanly.
- Play / pause / step controls for any time-evolving simulation.
- Linked views: moving a slider visibly updates both the physical model and any graph or equation.

## Interaction patterns to avoid

- Decorative motion that does not teach.
- Unlabeled controls or controls whose units are not shown.
- "Magic" numbers in the visualization that the student cannot trace to a control.
- Realism that obscures the concept (e.g. drag, friction, and turbulence all enabled when the lesson is about parabolic motion).
- Modal dialogs interrupting exploration.
- Game-like scoring or "win" states unless explicitly pedagogically motivated.

## Default visual stack

Pick based on what the simulation actually shows:

- **SVG** — diagrams, draggable objects, graphs with discrete data, anything where crisp labels and DOM-level inspection matter. Default choice for most PhET-style work.
- **Canvas (2D)** — particle systems, fields, fluids, many moving objects, anything where rendering hundreds of elements per frame matters.
- **Plain DOM** — controls, panels, readouts, "Try this" prompts, "Model limitations" panel. Never use SVG or Canvas for things that are just text and form controls.

WebGL / Three.js is allowed only when the concept genuinely requires 3D and the user accepts the dependency cost.

## Required sections in the generated HTML

The output file should contain, in roughly this order:

1. **Header comment block** — title, learning goal, target learner, design record (the answers to the pedagogical interview), date, model limitations.
2. **`<title>`** — short, descriptive.
3. **`<style>` block** — all simulation CSS.
4. **`<main>` container** with:
   - **Title bar** — simulation title and one-sentence learning goal, visible to the student.
   - **Controls section** — sliders, toggles, reset, play/pause.
   - **Simulation viewport** — the SVG or Canvas.
   - **Live readouts** — current values of key state variables, updating in real time.
   - **"What to notice" panel** — 1–2 sentences directing student attention.
   - **"Try this" panel** — 3–5 guided experiments.
   - **"Model limitations" panel** — what this model leaves out.
5. **`<script>` block at end of body** — organized as:
   - constants and configuration
   - state object
   - model update functions (pure where possible)
   - render functions
   - event handlers
   - initialization

## Development workflow inside the skill

1. Run the pedagogical interview. Persist answers.
2. Restate the learning goal in your own words and have the user confirm.
3. Sketch the conceptual model in prose: what variables, what equations or rules, what simplifications.
4. Identify the linked representations and where each lives on screen.
5. Build a minimal working simulation — controls + viewport + one readout. Verify it opens from file://.
6. Add the second representation (graph, equation, or table) and wire the links.
7. Add the "What to notice," "Try this," and "Model limitations" panels.
8. Run the quality checklist. Fix anything that fails.
9. Save to the project's output location.

## Quality checklist (run before declaring done)

Verify all of these:

- [ ] File opens by double-click from `file://` with no console errors.
- [ ] All sliders have visible live numeric readouts.
- [ ] Reset button restores initial state cleanly.
- [ ] Every control has an accessible label (`<label for="...">` or `aria-label`).
- [ ] Keyboard tab order through controls is sensible; sliders are keyboard-operable.
- [ ] Text is legible on a projector (minimum 16px body, larger for labels in the viewport).
- [ ] Simulation is usable at 1024px viewport width without horizontal scroll.
- [ ] Header comment includes learning goal, target learner, and model limitations.
- [ ] "Try this" panel has at least three concrete prompts.
- [ ] "Model limitations" panel is visible to the student, not hidden in a comment.
- [ ] Code is commented enough that another instructor (or another LLM) can edit it cleanly six months from now.
- [ ] No emojis anywhere in the file.
- [ ] No `fetch`, `XMLHttpRequest`, or other runtime network calls (CSS `<link>` and CDN `<script>` excepted).

## Output location

Generated `.html` files default to the repo's `output/` directory unless the user specifies otherwise. Suggested filename: `<short-topic-slug>.html`. The design record lives inside the file's header comment, not as a separate metadata file.

## Resources used by this skill

- `rubrics/simulation-quality-rubric.md` — used by the final quality-check pass and by the sibling `/phet-critique` skill.
- `rubrics/accessibility-checklist.md` — the keyboard/labels/contrast subset of the QC.
- `rubrics/pedagogical-design-worksheet.md` — the long-form version of the pedagogical interview, for users who want to think it through on paper first.
- `templates/single-file-svg-sim.html` — minimal SVG starter.
- `templates/single-file-canvas-sim.html` — minimal Canvas starter.
- `templates/single-file-linked-graph-sim.html` — model + graph + readout starter (the canonical PhET layout).
- `examples/` — worked examples across STEM and humanities domains.

(These resource files are stubs at the time of writing; they will be drafted as the skill matures.)

## What this skill explicitly is not

- It is not a generic web-app builder. It refuses multi-file outputs and frameworks requiring a build step.
- It is not a chart or dashboard generator. If the user wants a static data visualization, point them elsewhere.
- It is not a game maker. Scoring, levels, and win conditions are out of scope unless the user explicitly justifies them on pedagogical grounds.
- It is not a "make it interactive" upgrader for existing pages. That is the planned sibling skill `/phet-port`.

## Notes for the skill author (i.e., us)

- The temptation will be to soften the pedagogical interview to make the skill feel fast. Resist this. The interview is the skill's main contribution; without it, we are competing with every other "make a slider thing" prompt.
- The temptation will also be to allow npm/Vite for "richer" examples. Resist this too. The single-file constraint is what makes the artifact portable for faculty, which is the whole reason this skill exists.
- When examples are added, two should be from PhET's traditional domains (e.g. projectile motion, SIR epidemiology) to establish the lineage, and two should be from domains PhET never served (e.g. rhetorical feedback, attention-window visualizer) to demonstrate the new affordance.
