---
name: phet-activity
description: Build a complete classroom lesson plan around an existing PhET-style HTML simulation, following the Predict-Observe-Explain pattern grounded in Carl Wieman's research on interactive engagement. Use when a faculty member has a simulation (file path, or its design record pasted in) and needs the classroom scaffolding — pre-class prep, in-class activity with phase timing, peer discussion prompts, follow-up assessment, and instructor facilitation notes including expected wrong predictions — that turns the simulation into actual learning. Outputs a single markdown lesson-plan file.
---

# phet-activity — Author classroom lesson plans around PhET-style sims

## Purpose

A well-built simulation does not teach by itself. Wieman's research group has demonstrated repeatedly that PhET sims produce conceptual gains in classrooms only when they are wrapped in an activity that (1) surfaces students' prior beliefs *before* they touch the sim, (2) has students commit to a prediction in writing, (3) sequences prediction → observation → explanation in that order, and (4) is run by an instructor who knows the expected wrong predictions in advance.

The `/phet-activity` skill produces lesson plans that bake those moves in. Default output is a single markdown file — print-friendly, Canvas-uploadable, modifiable by any instructor without coding.

The research anchor is in [reference/wieman-pedagogy.md](reference/wieman-pedagogy.md). Read it once if you are new to this skill; the design choices below are not arbitrary.

## When to invoke

Use this skill when a user has a PhET-style HTML simulation (typically one produced by `/phet-sim`) and wants the classroom scaffolding around it. Do not invoke it to design a lecture without a sim, to write a problem set unrelated to a sim, or to critique an existing lesson plan — those are different jobs.

## Inputs the skill needs

Before generating the lesson plan, gather these. Ask one focused question per missing input; do not bundle.

1. **The simulation.** Either:
   - A path to an `.html` file (the skill reads the header design record for the learning goal, target learner, core misconception, manipulables, and limitations).
   - Or a paste of the design record if the file lives elsewhere.
2. **Course context.** Course name, level (intro / intermediate / capstone), typical class size.
3. **Modality.** In-person lecture hall, smaller seminar, hybrid, fully remote / asynchronous.
4. **Time budget.** Total minutes for the activity (typically 5–90).
5. **Position in the course.** Is this introducing the topic, reinforcing it after lecture, or a capstone exercise?
6. **Assessment context.** Graded for completion, graded for correctness, formative only, or part of a larger problem set?
7. **Constraints to honor.** No group work permitted? Students lack laptops? Class too large to circulate? Pre-class prep impossible?

Do not skip these. The lesson plan's quality depends entirely on whether the activity fits the context. The same sim used in a 90-minute lab differs substantially from the same sim used in a 5-minute lecture demo.

## Pedagogical contract — Predict, Observe, Explain, Synthesize

Every lesson plan must follow this four-phase structure, even at small time budgets:

1. **Predict (commitment).** Students individually commit to a prediction *in writing*, *before* exploring the sim. The prediction must target the specific misconception named in the sim's design record — not a generic prediction. This is the active-learning trigger; skipping it collapses the lesson into a demo.
2. **Observe (exploration).** Students use the sim with structured tasks, not open-ended exploration. Each task targets one aspect of the misconception. Tasks ask students to *do*, not to *notice*.
3. **Explain (peer discussion).** Students articulate, to a partner, *why* their prediction did or did not match observation. Peer discussion (think-pair-share at minimum) is non-negotiable unless the user has explicitly constrained it out.
4. **Synthesize (instructor wrap).** The instructor names the misconception explicitly, names the resolution, and connects to what students just observed. The phase exists because students do not always generalize on their own.

A 5-minute demo and a 90-minute lab both follow this structure. Time scales with budget; phases do not collapse.

## Required sections in the lesson plan

The output markdown must contain these sections in this order:

1. **Header** — course, class size, modality, total time, simulation reference, behavioral learning objectives.
2. **Misconception target** — restated from the sim's design record, in the instructor's voice.
3. **Pre-class (asynchronous)** — short prep plus one question that surfaces prior beliefs *without* the sim. Waive only if the user has named the constraint.
4. **In-class activity** — four labeled phases (Predict / Observe / Explain / Synthesize), each with explicit minute budget and specific student-facing prompts.
5. **Follow-up assessment** — one or two problems that distinguish conceptual understanding from rote formula application.
6. **Instructor facilitation notes** — expected wrong predictions with prepared responses; discussion management contingencies; tech setup checklist.
7. **Self-score** — filled-in lesson-quality checklist. See [rubrics/lesson-quality-checklist.md](rubrics/lesson-quality-checklist.md).

The blank skeleton is at [templates/lesson-plan-template.md](templates/lesson-plan-template.md).

## Hard rules

- **Behavioral objectives only.** "Students will predict X under condition Y" — not "students will understand X." Verbs must produce observable evidence: predict, identify, explain in their own words, compute, sketch, distinguish, justify.
- **Specific time budgets per phase.** Every in-class phase has an explicit minute count. No vague "have students discuss" without minutes attached.
- **Expected wrong predictions named.** The facilitation notes must list at least two common wrong predictions and what the instructor should say in response. This is the single highest-leverage piece of the artifact for the instructor running the activity. Without it the discussion defaults to vibe-based responses.
- **Peer interaction required** unless the user has explicitly named a constraint that prevents it (fully asynchronous remote class is the typical valid exception).
- **No emojis.**
- **Single markdown file.** No multi-file output, no separate slide deck, no separate instructor copy unless explicitly requested. The facilitation notes live in the same file as the student-facing prompts; the instructor decides what to print or hide.
- **Total time must match the user's budget.** The sum of phase budgets cannot exceed (or substantially undershoot) the time the user said they had.

## Output location

Default destinations:

- **Standalone (this project as its own folder):** `output/activities/<sim-name>-lesson.md`.
- **Workshop repo:** `output/physics-interactives/activities/<sim-name>-lesson.md`.

Filename: take the sim's filename slug and append `-lesson.md`. E.g. `damped-harmonic-oscillator.html` → `damped-harmonic-oscillator-lesson.md`.

## Workflow

1. Read the sim's design record. If it's not present (file unavailable or no design-record header), ask the user to paste the learning goal, target learner, and core misconception at minimum.
2. Ask for any of the seven context inputs above that have not been provided.
3. Restate the misconception target back to the user in one sentence. Confirm.
4. Draft the lesson plan against the template.
5. Run the self-score checklist. If any non-negotiable item fails, revise; do not deliver.
6. Save the file to the appropriate output location.
7. Tell the user the filename and which checklist items the lesson passes; flag any waived items with the reason.

## Quality self-score

Score against [rubrics/lesson-quality-checklist.md](rubrics/lesson-quality-checklist.md). The lesson must pass all *non-negotiable* items. *Strongly-recommended* items may be waived only if the user has named the corresponding constraint. *Good-to-have* items should be addressed but do not block delivery.

Include the filled checklist as the final section of the generated lesson plan so the instructor can see exactly which items passed and which were waived (with reasons).

## What this skill is not

- Not a lecture writer. The lesson plan assumes a sim is the centerpiece, not a slide deck.
- Not a problem-set generator unless the lesson explicitly calls for one. Scope is one to two follow-up problems, not a full set.
- Not a curriculum designer. One lesson at a time.
- Not a critique tool for existing lesson plans. That belongs in a separate skill if it's wanted.
- Not a substitute for an instructor who has thought about the lesson. The artifact is necessary but not sufficient.

## Notes for the skill author

- The biggest temptation will be to generate vague "have students discuss the implications" without time budgets, specific prompts, or expected answers. Resist this. The whole point of the skill is that it produces a lesson plan an instructor could run cold — which means every prompt, every minute budget, and every expected wrong prediction has to be specific.
- The second temptation will be to skip the pre-class step "because the user just wants the in-class part." If the user has named that constraint explicitly, fine. Otherwise, default to including pre-class — Wieman's group is consistent that prior-belief surfacing is what makes the in-class commitment phase work.
- The "expected wrong predictions" section is the highest-leverage part of the artifact. A faculty member who knows the misconceptions in advance is a fundamentally different instructor in the room than one hearing them for the first time. Spend disproportionate effort there. Two prepared responses is the floor; three is better.
- Behavioral objectives are not stylistic preference. They are how the instructor (and the institution) can tell whether the lesson worked. "Understand" is unfalsifiable and worth nothing here.
