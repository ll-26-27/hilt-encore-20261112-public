# Simulation quality rubric

Used by:

- The final QC pass of the `/phet-sim` skill (which must self-score before declaring a simulation done).
- The future `/phet-critique` skill (which scores someone else's `.html` file against this rubric).
- Faculty reviewing their own drafts.

Each of the eight dimensions is scored **0**, **1**, or **2**. Total possible: **16**. A simulation should reach **12 or higher** before it is shared with students. Anything scoring 0 on any dimension fails outright and must be revised — even if other dimensions are strong.

The rubric is deliberately concrete. Every criterion is something an observer can check by opening the file, not something that requires the author's good intentions to evaluate.

## 1. Conceptual clarity — is the learning goal recoverable from the artifact alone?

A student opens the file cold. Can they tell what this simulation is trying to teach them?

| Score | Criterion |
|---|---|
| 0 | No stated learning goal anywhere. The topic is unclear from the interface. |
| 1 | Learning goal stated in the header comment but not visible to the student. The student must infer the goal from the interface. |
| 2 | Learning goal visible to the student in the artifact itself (title bar or "What to notice" panel), and the interface directly serves that goal. |

## 2. Interactivity — is every visible value traceable to a control?

The "magic number" test. If a number is moving on screen, the student should be able to trace it back to either a control they can move, a clearly-labeled constant, or a deterministic function of those.

| Score | Criterion |
|---|---|
| 0 | Decorative motion, or values that change without student action, or "magic" numbers in the visualization with no traceable source. |
| 1 | Some controls are connected to visible values, but others are opaque (hidden state, unlabeled animation, undocumented constants). |
| 2 | Every displayed value is either a constant labeled as such, a direct readout of a control, or a deterministic result of controls plus time. Nothing changes that the student cannot explain. |

## 3. Visual legibility — projector-readable, labelled, no decorative motion

The simulation will be projected in a 200-seat lecture hall and viewed on a 13-inch laptop screen. It must work in both.

| Score | Criterion |
|---|---|
| 0 | Body text smaller than 14px, unlabeled controls or unlabeled axes, or motion that does not teach. |
| 1 | Mostly readable but with at least one of: missing label, missing unit, decorative noise, low contrast on a key element. |
| 2 | All controls labeled with units; body text at least 16px; viewport labels at least 18px; every motion or color change serves the concept. |

## 4. Feedback quality — immediate, reversible, linked

The cause-and-effect signal must be visible to the student the moment they touch a control. PhET's central pedagogical move.

| Score | Criterion |
|---|---|
| 0 | Requires a submit button. Representations don't sync. Changing a control doesn't visibly do anything until a delay or another action. |
| 1 | Some controls update immediately; others lag or require a button. Linked views drift out of sync. |
| 2 | Every control updates every linked view in real time, on every input event. Reset cleanly restores the initial state of every view. |

## 5. Accessibility — keyboard, labels, contrast

Detailed criteria live in [accessibility-checklist.md](accessibility-checklist.md). This dimension scores against the high-level outcome.

| Score | Criterion |
|---|---|
| 0 | Multiple controls are keyboard-inaccessible, or missing accessible names, or rely on color alone to convey state. |
| 1 | Most controls are labeled and keyboard-operable, but at least one gap exists (e.g. a button has no accessible name, or a slider's keyboard step is too coarse). |
| 2 | Every interactive element has an accessible name, is keyboard-operable, and color is never the only carrier of information. The accessibility checklist passes in full. |

## 6. Local portability — runs from file:// with no fetches

The whole point of the single-file constraint. This dimension is binary at the failure boundary: any fetch, any required server, any console error → score 0.

| Score | Criterion |
|---|---|
| 0 | Requires a local server. Has `fetch`, `XMLHttpRequest`, or other runtime network calls for application data. Throws console errors when opened. |
| 1 | Runs from `file://` but issues console warnings, or has an unmarked CDN dependency, or behaves differently when offline without warning. |
| 2 | Runs from `file://` with zero console errors and zero warnings. CDN dependencies, if any, are marked in the header comment and the simulation degrades gracefully or warns clearly when they fail to load. |

## 7. Code maintainability — readable to another instructor six months from now

Faculty who adopt these simulations should be able to open the HTML, change a label, retune a constant, or add a slider without rewriting the file. AI agents iterating on the file six months later face the same test.

| Score | Criterion |
|---|---|
| 0 | Inline magic numbers, no organization, no comments where the why is non-obvious, model logic and DOM manipulation tangled in the same functions. |
| 1 | Some organization (constants pulled out, state object exists) but uneven — some sections are clean, others are not. |
| 2 | Clear sections (constants, state, model, render, events, init). Model logic is separated from rendering. Comments explain the why where it's non-obvious, but the code does not over-comment what well-named identifiers already say. |

## 8. Disciplinary honesty — model limitations stated in the artifact

The single dimension that distinguishes a teaching simulation from a misleading one. PhET's hardest design move and the one most easily skipped.

| Score | Criterion |
|---|---|
| 0 | No limitations panel anywhere. The simulation implies it is a faithful model of reality when it is not. |
| 1 | Limitations mentioned in the header comment but not visible to the student. |
| 2 | Limitations panel visible to the student, naming at least one specific thing the model leaves out or simplifies, in language the student can understand. |

## Scoring

Sum the eight dimensions for a total out of 16. Interpretation:

- **14–16:** Ready to share with students.
- **12–13:** Solid; fix the lowest-scoring dimension and re-score before sharing.
- **8–11:** Workable draft. Iterate before showing it to anyone.
- **0–7:** Start over from the pedagogical interview. Probably the design, not the code, is the problem.

A **0 on any single dimension is a fail regardless of total score.** No amount of polish on the other seven can compensate for a missing learning goal, a fetch call that breaks portability, or a missing limitations panel.
