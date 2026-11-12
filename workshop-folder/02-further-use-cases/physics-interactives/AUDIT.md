# Source audit: physics-interactives

Imported from the team’s November 12 review in Marlon’s idealized-workshop edition (commit `04b0670`). The section below records that team’s checks, not a new source-paper audit performed during this import. Outputs are retained as examples; the flags have not been silently repaired.

## Applicability to this folder

This review covers the older background essays, research notes and reusable skills. It does **not** assess the four GENED 1104 cooking simulations. References below to the “example simulation” concern an upstream damped harmonic oscillator, which is not included here. `workshop-original/summary.md` is an upstream historical document, not our current summary. The upstream operation 01 corresponds to our `operations/deep-research-prompt.md`. The original path and citation defects in the skills are listed for review; this change adds the audit rather than rewriting those skills.

## What the source team checked


We read `essay-phet-tradition.md` against the PhET document it footnotes, `essay-manipulable-artifact.md` against operation 01 (its prompt), and the citations in `research-basis.md`, the faculty guide, and the essays against the works they name. We also opened the example simulation and the skills.

What checked out:

- **`essay-phet-tradition.md` quotes its source correctly.** PhET's "Simulation Design Process" (phet.colorado.edu/publications/phet_design_process.pdf) does describe a team of "three to five individuals," the step to "discuss feasibility, refine the interface and acquire a cost benefit analysis," formal studies "two to four times a year," and no hour count. The essay's footnote says its dollar figure is an inference, not PhET's; that is accurate.
- **`essay-manipulable-artifact.md` answers its prompt.** Three parts as specified, about 3,500 words before the references (the top of the requested range), 31 references, and a closing "hard problems" section that does not soft-pedal. The references we checked are real and correctly described (Posner et al. 1982; Hestenes, Wells & Swackhamer 1992; Hake 1998; Barsalou 1999; Glenberg & Kaschak 2002; Goldstone & Son 2005; Ainsworth 2006; Freeman et al. 2014; Yaron et al. 2010; Bastani et al. 2025 in *PNAS*, including its finding that an unguarded ChatGPT tutor raised practice scores and lowered exam scores).
- **`research-basis.md` and the faculty guide cite real works with correct details** (Wieman, Adams & Perkins, *Science* 322:682–683, 2008; Deslauriers, Schelew & Wieman, *Science* 332:862–864, 2011; Freeman et al.'s 225 studies; Wieman's 2014 *PNAS* commentary; McKagan et al. on quantum mechanics, arXiv:0709.4503).
- **The example simulation is sound.** It computes the damping ratio as ζ = c / (2√(m·k)) (0.158 at the defaults, as displayed), loads nothing from the network, and has the "Try this" and "Model limitations" panels its skill requires.

Flagged, not fixed; the outputs are left as they came back:

1. **"Reduced failure rates by 55%"** (`essay-manipulable-artifact.md`, Part 1; repeated in `workshop-original/summary.md`). Freeman et al. (2014) found students in traditional lectures 1.5 times as likely to fail as students in active learning: lecture raises the failure rate by about 55%; active learning lowers it by about a third. The skill's own `wieman-pedagogy.md` states it correctly.
2. **"Nearly 80% of students ... could state Newton's Third Law correctly but fewer than 15% ... understood it"** (same essay; repeated in `summary.md`) has no citation, and the 1992 FCI paper it sits beside is not its source. We could not trace the figures.
3. **The essay does not cover Wieman's research program** (expert–novice differences, the Science Education Initiative), which the prompt lists as required, and its "2022–2026 research on LLM-generated learning materials" is one study (Bastani et al., on AI tutoring, not generated materials). Two references (Theobald et al. 2020; Wieman et al. 2010) are listed but never cited in the text.
4. **`deep-research-report.md` has no usable citations.** Its 83 source markers are unresolved ChatGPT placeholders (`citeturn7search0` and the like) with no reference list, so none of its claims can be traced from the file.
5. **The same report says PhET's documentation gives "roughly 160 hours of design, 500 or more hours of development, and about 40 hours of testing"** per simulation. The May 21 project plan records removing that figure from the PhET essay as "spurious," and the PhET design-process document gives no hours.
6. **The workshop's `index.md` calls `deep-research-report.md` "output of the deep-research prompt."** It isn't: the prompt asks for the three-part essay, which is `essay-manipulable-artifact.md`. The report's own prompt was not saved.
7. **`essay-phet-tradition.md` goes beyond its source twice:** "a multi-year ... research program *per simulation*" (the PhET document gives no duration), and formal studies "on it two to four times a year" (PhET says it studies its simulations two to four times a year, not each one).
8. **`wieman-pedagogy.md` (in the `phet-activity` skill) says Wieman "was a co-author on the Freeman et al. (2014) meta-analysis"** and that it covered "225 STEM courses." Wieman wrote the accompanying commentary, not the paper (the file's own reference lists the authors without him), and the 225 are studies.
9. **The skills point to files that aren't where they say.** `/phet-sim` and `/phet-activity` save to `output/` (no s); `/phet-rationale` and `wieman-pedagogy.md` look for `research-basis.md` and the essays at the folder root, and `phet-sim/SKILL.md` links `essay-phet-tradition.md` there too; all are in `outputs/`. The operation files here say how to steer around this.
10. **The example simulation's design record says the system "is fastest to settle at ζ = 1."** True only among non-oscillating responses, which is how its learning goal and on-screen text put it; with a tolerance band, a slightly underdamped system (ζ around 0.7) settles sooner.
11. **`essay-phet-tradition.html` loads its font from Google Fonts,** so it falls back to a system serif offline; the Markdown and HTML texts are otherwise the same.

`research-basis.md` was written with ChatGPT (its links carry `utm_source=chatgpt.com`); its claims are attributed to the summaries on ERIC, PER-Central, and PubMed rather than to the papers themselves, and we did not read the papers behind each summary.
