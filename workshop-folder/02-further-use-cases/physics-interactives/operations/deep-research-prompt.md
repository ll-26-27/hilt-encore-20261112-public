# Deep Research Prompt — Contextualizing PhET-style pedagogical interactives and their LLM successors

Use this as the prompt for an LLM Deep Research tool (Claude Deep Research, ChatGPT Deep Research, Perplexity Deep Research). The output is a contextualizing essay for workshop participants who have just seen a live demo of LLM-built single-file interactive simulations modeled on the PhET tradition.

This essay is meant to *complement*, not duplicate, the in-project essay at [essay-phet-tradition.md](essay-phet-tradition.md), which already covers PhET's institutional history, its five-element design grammar, the historical coordination-of-expertise cost, and the cost-collapse argument. The Deep Research piece should go deeper into the **pedagogical and cognitive-science literature** behind interactive learning, and broader into the **adjacent traditions** across disciplines that the existing essay only gestures at.

---

## Prompt

Produce a contextualizing essay of **2,500–3,500 words** for an audience of college and university faculty across the disciplines (STEM, social sciences, humanities) who have just attended a workshop demonstration of LLM-assisted construction of PhET-style interactive teaching simulations as single-file HTML artifacts.

The audience includes faculty with strong pedagogical sophistication who will not be persuaded by productivity claims or "AI for education" boosterism. The essay should be defensible to a senior physics-education researcher or learning scientist. Do not oversell LLMs. Frame them as collapsing the *coordination-of-expertise cost* described in the project's accompanying essay — without claiming that they collapse the underlying pedagogical-design work, which they do not.

An in-project essay at `essay-phet-tradition.md` already covers (a) the founding of PhET at Colorado in 2002 under Carl Wieman, (b) the five-element design grammar (model + manipulable interface + immediate feedback + linked representations + deliberate simplification), (c) the historical team-of-three-to-five structure of PhET simulation development, (d) the cost-collapse argument enabled by generative AI, and (e) the warning that the technical floor has dropped much faster than the design floor. Do not duplicate this material. Build on it.

The essay must accomplish three things, in this order.

### Part 1 — The intellectual tradition behind manipulable pedagogical artifacts (~1,000 words)

Trace the strands of cognitive-science, learning-science, and educational-research literature that converge in the PhET tradition. At minimum, engage with:

- **Constructionism** (Papert 1980, *Mindstorms*; Papert & Harel 1991) — the claim that learners build knowledge most powerfully when they build artifacts. Logo, the early lineage of programmable microworlds.
- **Constructivism and conceptual change** (Posner et al. 1982; Vosniadou 1994) — the empirical case that learners' misconceptions are not deficits but coherent frameworks that resist instruction and require structured cognitive conflict to revise.
- **Physics Education Research (PER)** — Hake (1998) on interactive engagement vs. traditional instruction; McDermott's University of Washington program; the Force Concept Inventory (Hestenes, Wells & Swackhamer 1992) and what it revealed about the gap between lecture exposure and conceptual mastery.
- **Wieman's research program at Colorado** — beyond founding PhET, his work on expert/novice differences in physics, the Science Education Initiative, and the empirical evidence he assembled for active-learning interventions.
- **Embodied and grounded cognition** (Barsalou 1999; Glenberg & Robertson 2000; Goldstone & Son 2005) — why direct manipulation of a model is cognitively privileged over symbolic description of the same model.
- **Active-learning meta-evidence** (Freeman et al. 2014, *PNAS*) — the meta-analysis showing failure-rate reductions across STEM under active-learning conditions, and the controversy that followed about what counts as "active."
- **Design-based research** (Brown 1992; Collins, Joseph & Bielaczyc 2004) — the methodological framing PhET and similar groups actually use: iterative deployment in classrooms, theoretical refinement, mixed-methods evaluation.
- **The "interactive but not pedagogical" failure mode** — the literature on educational technology that looks engaging in demos but does not move learning outcomes. Cite specific cautionary examples.

Make this accessible to a humanities reader who has heard of "active learning" but has not engaged with the underlying research literature. Concrete examples of what each strand contributes to a good simulation are essential.

### Part 2 — What the PhET tradition gets right that other educational technology often gets wrong (~700 words)

Building on Part 1, articulate what specifically makes a PhET-tradition simulation *pedagogical* rather than *decorative*. Distinguish from the failure modes that dominate ed-tech:

- **Learning-goal-first design.** Every effective PhET simulation begins from a specific cognitive difficulty in the topic — not from a list of interactive features. Contrast with feature-led design that produces simulations of phenomena rather than simulations of concepts.
- **Deliberate simplification as a pedagogical move.** Why a faithful simulation can be a worse teaching tool than a deliberately incomplete one. Connect to Bruner's notion of "intellectually honest" representation at the learner's level.
- **Multiple linked representations** as cognitive-load management and as preparation for the discipline's epistemic culture. The graph, the equation, the table, and the physical model all updating together is not visual flourish — it is the discipline's representational system made manipulable.
- **Immediate, reversible feedback** as the affordance that turns a simulation into a *probe* rather than a *demonstration*. The cognitive-science evidence on the role of contingent, predictable feedback in concept formation.
- **The "what is hidden by design" decision** as the most important design choice. What the simulation does *not* show is doing pedagogical work too.
- **Iterative validation against actual learners.** The classroom interview / think-aloud protocols PhET used to discover that simulations behaved differently than their designers expected. Why this empirical loop matters and why LLM-generated simulations are at risk of skipping it.

### Part 3 — Where LLM-enabled simulation extends the tradition, into which adjacent fields, and what is at stake (~1,200 words)

The PhET tradition concentrated on STEM because that is where its funding, audience, and disciplinary culture were. The LLM-enabled cost collapse described in `essay-phet-tradition.md` makes the *PhET genre* available to fields that have never had a simulation tradition. Walk through the extensions, but with disciplinary specificity rather than handwaving:

- **Adjacent STEM disciplines.** ChemCollective at Carnegie Mellon (chemistry); BioInteractive at HHMI and BioMan (biology); Desmos and GeoGebra (mathematics); CODAP (statistics and data science). What each of these traditions does well, where each falls short of the PhET grammar, and what an individual faculty member can now build for the topics each tradition has not covered.
- **Computer science and computational thinking.** Bret Victor's manipulable explanations (*Up and Down the Ladder of Abstraction*, *Inventing on Principle*) as the conceptual ceiling for this kind of work. Distill+ explorables. Why CS pedagogy has been a natural home for this genre and what the LLM tooling now enables for non-PhD instructors.
- **Statistics and quantitative reasoning across the curriculum.** Allen Downey's *Think Stats* tradition; D3 explorables; the Seeing Theory project at Brown. The case for instructor-built statistical interactives in social-science and biomedical methods courses.
- **Economics.** Bargaining games, market-design widgets, supply-and-demand sandboxes; CORE Econ's interactives as an existing tradition.
- **Social-science methods teaching.** A visualizer for qualitative coding (the kind of thing this workshop also demos in its `interview-coding` project); regression-assumption sandboxes; simulation-based causal-inference teaching tools (the *Causal Inference: The Mixtape* approach).
- **Writing, rhetoric, and communication.** The genuinely new territory. A simulation of audience uptake under varying rhetorical moves; a Toulmin-model diagrammer that updates as the student edits an argument; a feedback-loop model of revision. These genres do not exist at PhET scale because they were never funded; an individual instructor can now build them.
- **History and the humanities.** Historical-counterfactual sandboxes; agent-based simulations of social-historical processes that are too speculative to publish as research but can productively teach. The conceptual move from a *closed* historical narrative to a *manipulable* one is pedagogically generative.
- **Languages and translation.** Manipulable models of grammatical structure; interactive parsers for highly inflected languages (Sanskrit, Latin, Greek, Russian); morphology-visualization tools.
- **Arts and design pedagogy.** Color-theory manipulables; perspective-construction interactives; music-theory exploration tools.

Close with the **hard problems** the field needs to work through. The essay's credibility depends on naming these without minimizing them:

- **The "demo trap."** LLM-generated interactives are likely to look impressive in workshop settings while failing to move actual learning when deployed. Without the PhET iterative-validation loop, faculty have no empirical check on whether their simulation teaches.
- **Assessment.** What does it mean to have learned from one of these? The PhET tradition has measured outcomes for two decades; an instructor-built simulation has no such track record.
- **Accessibility.** A single-file HTML simulation can ship without keyboard support, without screen-reader support, without color-contrast affordances. Doing this well is harder than producing the visual interaction; the LLM will not enforce it.
- **The discipline-specific quality bar.** What "pedagogical correctness" means in physics is well-defined and empirically tested. What it means for a rhetoric-feedback simulation is not. New genres without established quality criteria are at risk of producing interactives that are coherent-looking but pedagogically incoherent.
- **Maintenance and decay.** Single-file HTML artifacts have a much shorter shelf life than the multi-decade PhET corpus. What happens to the syllabus in three years when the artifact still loads but no longer matches the textbook?
- **Equity.** Faculty with strong design intuition and time will build excellent interactives; others will produce decorative ones. The gap between the two is invisible to students and consequential for learning. The PhET corpus was a leveling resource; instructor-built interactives may de-level the field.

## Formal requirements

- **Length:** 2,500–3,500 words, divided into the three parts above with explicit subheadings.
- **Citations:** academic citation style (APA or Chicago author-date). Include full bibliographic information for at least 20 sources spanning (a) classical learning-science and PER texts, (b) exemplar interactive teaching artifacts across disciplines, and (c) recent commentary (2022–2026) on LLM-generated educational content and its limitations.
- **Tone:** scholarly but accessible. The audience is faculty across all disciplines, including humanists who have not engaged with PER. Gloss specialized terms on first use.
- **Honesty about LLMs.** Do not oversell. Frame the LLM-enabled cost collapse as a *coordination-of-expertise* collapse, not a *pedagogical-design* collapse. The hardest parts of building a good simulation remain hard.

## What NOT to produce

- A retelling of the PhET history (already covered in `essay-phet-tradition.md`).
- A how-to guide for building simulations.
- Generic boosterism about "AI in education."
- An ed-tech vendor pitch.
- A claim that LLM-built simulations have been empirically validated to teach. They have not.

## What to actively surface that is non-obvious

- Specific empirical findings from PER and the learning sciences that constrain what a good interactive must do.
- Concrete examples of existing manipulable-pedagogy traditions outside physics (Victor, Desmos, Distill, CODAP, etc.) that this audience may not know about.
- The genuine equity and quality risks of moving interactive teaching artifacts from funded teams to individual faculty production.
- Published research (2022–2026) on LLM-generated learning materials, including the failure cases — hallucinated explanations, mis-targeted difficulty levels, lost pedagogical scaffolding.

---

## Notes for Marlon before sending

- The audience is more disciplinarily varied than the interview-coding prompt's audience. Consider naming the audience more specifically if a single discipline dominates the room.
- The essay should *complement* the in-project [essay-phet-tradition.md](essay-phet-tradition.md). Consider including that essay as input context if the Deep Research tool supports document attachment.
- The hard-problems closing is the most important section and the most often skipped. Push back if the draft soft-pedals it.
