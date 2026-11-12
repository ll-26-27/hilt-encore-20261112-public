# Lesson plan quality checklist

Used by:

- The `/phet-activity` skill's self-score before delivering a lesson plan. The skill refuses to ship a plan that fails any non-negotiable item.
- Faculty reviewing their own draft lesson plans.
- A future `/phet-activity-critique` skill (if one ever exists), which would score someone else's plan.

The checklist mirrors the self-score section that gets embedded at the end of every generated lesson plan, so the instructor opens the file and immediately sees which items passed.

## Non-negotiable items

Failure on any of these is a fail outright. No amount of polish on the rest compensates.

- [ ] **P-O-E-S structure present.** Lesson includes all four phases in order: **P**redict → **O**bserve → **E**xplain → **S**ynthesize.
- [ ] **Commitment moment.** Students commit to a prediction *in writing*, *before* exploring the sim. The prediction is collected, not just contemplated silently.
- [ ] **Misconception-anchored prediction.** The Predict-phase prompt targets the specific misconception named in the sim's design record, not a generic prediction about the topic.
- [ ] **Behavioral learning objectives.** Objectives use observable verbs: predict, identify, explain in their own words, compute, sketch, distinguish, justify. No "understand" or "appreciate" or "be familiar with."
- [ ] **At least two expected wrong predictions named.** Facilitation notes list common wrong predictions with prepared instructor responses. This is the highest-leverage piece of the artifact.
- [ ] **Time budgets attached to every in-class phase.** No vague "have students discuss" without a minute count.
- [ ] **Total phase time matches the user's stated budget.** Sum of in-class phase budgets cannot exceed the time the user said they had, and should not substantially undershoot it.

## Strongly recommended items

Waive only with an explicit user-stated reason. If waived, the lesson plan's self-score must record the reason.

- [ ] **Peer-discussion phase.** Think-pair-share at minimum. *Waive only if:* the user has named a constraint (fully asynchronous remote is the typical valid exception).
- [ ] **Pre-class prep that surfaces prior beliefs.** *Waive only if:* the user has stated that pre-class prep is impossible in their context.
- [ ] **Follow-up assessment distinguishing conceptual understanding from rote application.** *Waive only if:* the user has named where assessment will happen instead (midterm, separate problem set).
- [ ] **Tech setup checklist concrete enough that a TA could run the lesson cold.** Includes backup plan for tech failure.
- [ ] **Synthesize phase names the misconception explicitly.** The instructor wrap-up restates the wrong belief and the resolution out loud.

## Good-to-have items

Address if you have time, but they do not block delivery.

- [ ] **Backup plan for tech failure** — sim won't load, student laptop dies, wifi drops.
- [ ] **Discussion contingencies named** — what to do if the discussion stalls, dominates, goes off-topic, or converges too quickly.
- [ ] **Modality-specific facilitation moves** — in-person, hybrid, and remote each need slightly different moves; the lesson plan acknowledges its modality rather than ignoring it.
- [ ] **Connection to the rest of the course** — what precedes this lesson, what follows. A one-sentence orientation that locates the activity in the larger arc.
- [ ] **Inclusive design considerations** — language accessible to students at the named level; no assumed cultural references that would land differently across the class.

## How the skill applies the checklist

1. Generate the draft lesson plan against [../templates/lesson-plan-template.md](../templates/lesson-plan-template.md).
2. Run the checklist mentally against the draft. Mark each item pass / waive / fail.
3. If any non-negotiable item is in fail state, revise and re-score — do not ship.
4. If any strongly-recommended item is waived, the waiver reason must be recorded in the lesson plan's self-score section.
5. Append the filled checklist (with statuses) as the last section of the generated lesson plan.
6. When reporting back to the user, name which strongly-recommended items were waived and why, so the user can override the waiver if they want.

## Score interpretation for human reviewers

- **All non-negotiables pass + most strongly-recommended pass:** ready to deliver.
- **All non-negotiables pass + multiple strongly-recommended waived without stated reason:** ship with caution; the lesson may be context-thin.
- **Any non-negotiable fails:** do not deliver. The lesson is not yet pedagogically structured; it is a worksheet.

A lesson plan can be technically complete (all sections filled in) and still fail this checklist — the sections themselves are not the point; what they accomplish is.
