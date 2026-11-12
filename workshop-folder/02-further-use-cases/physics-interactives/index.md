**Source review:** read [AUDIT.md](AUDIT.md) for the November 12 checks and unresolved issues in these materials.

**Planned Next.js embed:** [GENED 1104 simulation page](outputs/sims/index.html). See [embedding handoff](../../../nextjs/EMBEDDING.md).

# GENED 1104 cooking simulations

Start with the [four cooking simulations](outputs/sims/index.html): onions, basil spheres, coffee and tahini. Each opens locally as a standalone HTML file. These are the existing GENED 1104 artifacts, copied unchanged.

| Stage | Files | What happens |
|---|---|---|
| Inputs | [Staff brief](inputs/gened-1104-staff-brief.md), [models and math](inputs/model-and-math.md) | A kitchen observation becomes quantities, units, equations and assumptions. |
| Operations | [Model](operations/01-observation-to-model.md), [build](operations/02-model-to-simulation.md), [check](operations/03-check-and-explain.md) | Choose the model, decide what to draw, implement it, and check the result. |
| Outputs | [Onions](outputs/sims/onion-caramelization-sim.html), [basil](outputs/sims/basil-sphere-sim.html), [coffee](outputs/sims/coffee-sim.html), [tahini](outputs/sims/tahini-seizing-sim.html) | Four interactive examples with the mathematical model visible. |

The original skills, heat-pump brief, background essays and biology simulations remain below as supporting workshop material.

---

# Interactive simulations file guide

Read [`summary.md`](summary.md) for the workflow, technical requirements, and
limitations. [`CLAUDE.md`](CLAUDE.md) contains project instructions loaded by
Claude Code.

## Sample input

- [`inputs/heat-pumps-teaching-brief.md`](inputs/heat-pumps-teaching-brief.md):
  a teaching brief about thermodynamics and heat pumps

## Operations and skills

- [`operations/deep-research-prompt.md`](operations/deep-research-prompt.md):
  prompt used to create the background research in `outputs/`
- [`.claude/skills/phet-sim/`](.claude/skills/phet-sim/): simulation skill,
  HTML templates, quality rubric, accessibility checklist, and design worksheet
- [`.claude/skills/phet-activity/`](.claude/skills/phet-activity/): classroom
  activity skill
- [`.claude/skills/phet-accessibility-audit/`](.claude/skills/phet-accessibility-audit/):
  accessibility review skill and checklist
- [`.claude/skills/phet-rationale/`](.claude/skills/phet-rationale/):
  short rationale-writing skill

## Example outputs

The standalone simulations are in [`outputs/sims/`](outputs/sims/):

- [`enzyme-kinetics.html`](outputs/sims/enzyme-kinetics.html)
- [`hardy-weinberg.html`](outputs/sims/hardy-weinberg.html)
- [`predator-prey.html`](outputs/sims/predator-prey.html)

Background and instructor material includes:

- [`outputs/research-basis.md`](outputs/research-basis.md)
- [`outputs/AI-Built-Simulations-Faculty-Guide.md`](outputs/AI-Built-Simulations-Faculty-Guide.md)
- [`outputs/deep-research-report.md`](outputs/deep-research-report.md)
- [`outputs/essay-phet-tradition.md`](outputs/essay-phet-tradition.md)
- [`outputs/essay-manipulable-artifact.md`](outputs/essay-manipulable-artifact.md)

To try the full workflow, open this folder in Claude Code, run `/phet-sim` with
the sample brief, create an activity with `/phet-activity`, and then run the
accessibility audit. Review the disciplinary model and instructional design
before using the output with students.
