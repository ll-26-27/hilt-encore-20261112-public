---
name: phet-rationale
description: Produce a one-to-two-page department-facing rationale for a specific PhET-style simulation and/or its companion lesson plan. Reads the simulation's design record and (optionally) the matching `/phet-activity` lesson plan, draws on the project's Wieman/PhET research anchor, and produces a markdown document suitable for sharing with a department chair, curriculum committee, dean, accreditation reviewer, or skeptical colleague. The skill's job is to make the case for this specific artifact in this specific course — honestly, with citations, without over-claiming.
---

# phet-rationale — Department-facing rationale for a specific sim or activity

## Purpose

A faculty member who has built a simulation with `/phet-sim` (and ideally a lesson plan with `/phet-activity`) sometimes needs to *defend* the artifact to a department-level audience: a chair who wants to know why this is in the syllabus, a curriculum committee evaluating a course redesign, a dean asking about an AI-assisted teaching initiative, an accreditation reviewer auditing learning outcomes, or a skeptical colleague who suspects the simulation is decorative rather than pedagogical.

This skill produces that defense. It draws on the project's research anchor (Wieman, Hake, Adams, Mazur, Freeman, Banda & Nzabahimana) and the artifact's own design record to make a specific, citable, modest case for *this* sim doing *this* learning work in *this* course. It is not a generic "AI for teaching" pitch and it must not become one.

The output is a single markdown document, 600–1,000 words, that the faculty member can email, print as a one-pager, or paste into a curriculum proposal.

## When to invoke

- After `/phet-sim` has produced a simulation and the faculty member needs to justify it externally.
- After `/phet-activity` has produced a lesson plan and the same justification is needed for the classroom routine, not just the artifact.
- Before submitting a course redesign, accreditation document, or department-level proposal that includes the simulation.

Do not invoke for: a generic argument that simulations or AI are good in teaching; a marketing pitch; a curriculum-wide rationale (this skill is artifact-specific by design); a research methods paper.

## Inputs the skill needs

Gather these before drafting. Ask one focused question at a time; do not bundle.

1. **The simulation.** A path to the `.html` file. The skill reads the header design record for the learning goal, target learner, core misconception, manipulables, hidden variables, representations, and limitations.
2. **The lesson plan, if it exists.** Path to the markdown file produced by `/phet-activity`. If present, the rationale gains a classroom-routine section. If absent, the rationale stays focused on the artifact alone and notes the gap explicitly.
3. **The course.** Course name and number, level (intro / intermediate / capstone / graduate), department, typical enrollment.
4. **The audience.** Who specifically is reading this? Options to ask about:
   - Department chair (peer-discipline; assume content fluency)
   - Curriculum committee (mixed-discipline; assume general academic fluency, not content)
   - Dean or provost (administrative; assume no content fluency; weight institutional concerns)
   - Accreditation reviewer (assume formal learning-outcomes language matters)
   - Skeptical colleague (assume content fluency *and* methodological challenge)
   - General faculty audience (mixed; default if unsure)
5. **The skepticism to address.** Optional. If the faculty member knows the specific objection ("the chair thinks this is just an animation," "the committee wonders why not use existing PhET sims," "the dean wants ROI on AI in teaching"), the rationale should engage that objection directly. If unknown, leave generic.
6. **Length preference.** Default ~800 words; short (~500) or long (~1,200) on request.

## Output contract

A single markdown file at the same location as the source simulation, named `<sim-stem>.rationale.md`. Or at a user-specified path.

The document must contain these sections, in this order:

### 1. What this artifact is (one paragraph)

Name the simulation. State the specific learning goal in the faculty member's own discipline-language. Name the course it lives in. State the misconception or difficulty the artifact is designed to make visible. Resist the temptation to praise the artifact; describe it.

### 2. Why this learning goal warrants an interactive (the research basis)

Explain — in two short paragraphs — why the PhET tradition treats this kind of conceptual difficulty as one where a manipulable simulation outperforms lecture or textbook. Reference the empirical record specifically: Hake's interactive-engagement comparison, the Freeman et al. 2014 meta-analysis on active learning across STEM, and Banda & Nzabahimana's 2021 review of PhET-specific outcomes. Cite real work. Do not say "research shows" without saying *which* research.

The skill draws this material from `../../../research-basis.md` at the project root and from `../phet-activity/reference/wieman-pedagogy.md`. Do not fabricate citations.

### 3. The design choices in this artifact

Walk through the specific design decisions in *this* sim and map each to a research-validated PhET principle. Examples of the form this section should take:

- "The simulation hides air resistance, drag, and turbulence, exposing only gravity and initial velocity — this follows Bruner's principle that pedagogically honest simplification preserves the structural relationship while removing accidental detail, a move PhET formalized in its design process documentation (Adams et al., 2008a)."
- "The graph and the physical model update together as the student moves the slider — this implements Ainsworth's (2006) DeFT framework of multiple linked representations distributing cognitive load and constraining interpretation."
- "Reflection prompts ask the student to predict before observing — this is the Predict-Observe-Explain pattern grounded in Hake's 1998 interactive-engagement comparison."

The choices come from the simulation's header design record. The research grounding for each comes from the research-basis note. Tie them together explicitly.

### 4. The classroom routine — *only if a lesson plan is present*

If `/phet-activity` has produced a lesson plan, summarize the classroom routine in one paragraph: the Predict-Observe-Explain-Synthesize structure, the role of peer discussion (citing Mazur's Peer Instruction findings), and the instructor's preparation for expected wrong predictions. Note that the artifact and the routine are inseparable in the empirical record — a sim deployed without the routine produces measurably weaker outcomes than the same sim deployed within it.

If no lesson plan is present: skip this section but include a short note at the end of section 3 acknowledging that classroom scaffolding is not yet in place and that the artifact's pedagogical value depends on it.

### 5. What we are not claiming

Mandatory. The rationale must include a short paragraph (3–5 sentences) naming honestly what *this artifact* has not done:

- The sim has not been independently classroom-tested. The PhET corpus accumulated outcome evidence over years; this artifact has not.
- The skill produces a credible design, not validated learning gains.
- Faculty supervision of the classroom routine remains essential; the artifact does not teach on its own.
- For new disciplines without a Force Concept Inventory equivalent, no validated measurement instrument exists.

Tailor the specific claims-not-being-made to what is true for this artifact. Do not paste a generic disclaimer.

### 6. Citation stack (4–6 entries)

A short reference list with full bibliographic detail for the works actually cited above. Pull from `../../../research-basis.md`. Do not pad with citations that were not used in the rationale.

## What this skill must NOT do

- **Must not over-claim.** No "research proves," no "studies show this works," no "students learn X% more." The PhET-tradition evidence is about *patterns* of effective teaching, not about effect sizes for *this* artifact.
- **Must not fabricate citations.** Every citation must come from `../../../research-basis.md` or `../phet-activity/reference/wieman-pedagogy.md`. If a section needs a citation those files do not provide, leave a `[citation needed]` placeholder and tell the faculty member.
- **Must not become a generic AI-in-teaching pitch.** This is artifact-specific. If the faculty member asks for a generic rationale, decline and point them at the project-level essays `../../../essay-phet-tradition.md` and `../../../essay-manipulable-artifact.md`.
- **Must not omit the "what we are not claiming" section.** That section is the rationale's credibility hinge with a skeptical reader. Removing it is removing the reason a senior reader will trust the document.
- **Must not assume content fluency the audience does not have.** A dean reading a physics-simulation rationale needs the misconception explained in plain language. A curriculum-committee mixed-discipline audience needs the research basis without inside-baseball method-name shorthand.

## Workflow

1. Read the simulation HTML; pull the header design record.
2. Read the lesson plan if path provided; pull the activity structure and key facilitation moves.
3. Gather inputs 3–5 (course, audience, optional skepticism) via one-question-at-a-time interview.
4. Read `../../../research-basis.md` and `../phet-activity/reference/wieman-pedagogy.md` for the citation material.
5. Draft the six sections per the contract above.
6. Run a self-check against the "must not" list. Specifically: did any sentence over-claim? Is any citation absent from the source files? Is the "what we are not claiming" section concrete to this artifact?
7. Write to `<sim-stem>.rationale.md` (or the user-specified path).
8. Report length, audience tuning, and which lesson-plan path was used (or "none provided").

## Resources used by this skill

- `templates/rationale-template.md` — the structural skeleton; the skill fills in section-by-section rather than rewriting.
- `../phet-activity/reference/wieman-pedagogy.md` — the research anchor for the classroom-routine paragraph and for the Mazur/Hake/Wieman citation cluster.
- `../../../research-basis.md` — the project-level empirical citation stack (Adams, Wieman/Perkins, Finkelstein, Freeman, Banda & Nzabahimana, McKagan). This is the source of truth for what may be cited.
- `../../../essay-phet-tradition.md` — historical context. Useful for the design-choices section when the rationale needs to explain why a particular simplification is a pedagogical move.
- `../../../essay-manipulable-artifact.md` — the broader learning-sciences companion essay (constructionism, conceptual change, embodied cognition). Useful when the audience is mixed-discipline and a deeper rationale is needed for *why* manipulable artifacts work at all.

## Notes for the skill author (i.e., us)

- The temptation will be to make the rationale punchier by sharpening the claims. Resist. The rationale's value is that a senior reader can trust every sentence in it; the moment one sentence over-claims, the whole document loses standing.
- The temptation will be to recycle paragraphs across rationales for similar sims. Resist that too — the value of the artifact-specific rationale is the specificity. A generic paragraph is a tell that the author did not think.
- For non-physics rationales (when the genre extends as the project's essays anticipate), the citation stack will need to extend too. The skill should flag this case to the user rather than padding the rationale with physics-specific citations.
- Future extension: a sibling `/phet-rationale-bundle` that produces rationales for a *collection* of sims being used in one course, with a course-level synthesis paragraph. Out of scope for v1.
