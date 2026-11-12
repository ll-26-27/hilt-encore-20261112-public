# The Manipulable Artifact as Pedagogical Object: Learning Science, Adjacent Traditions, and the LLM Inflection

*A contextualizing essay for faculty who have just watched a live demonstration of LLM-assisted construction of single-file interactive teaching simulations in the PhET tradition. This essay is a companion to the in-project essay `essay-phet-tradition.md`, which covers PhET's institutional history, design grammar, and the coordination-of-expertise cost collapse enabled by generative AI. The work here goes underneath that account — into the learning-science literature that justifies it — and outward, into the disciplinary traditions that the PhET model has rarely touched.*

---

## Part 1 — The intellectual tradition behind manipulable pedagogical artifacts

The simulation you just watched a language model produce sits at the intersection of at least six research programs. None of them are about software. All of them are about how people learn, and most of them are older than the web.

### Constructionism and the microworld

The deepest root is Seymour Papert's claim, developed at MIT through the 1970s, that learners build knowledge most powerfully when they build something — a public artifact that can be examined, debugged, and shared. Papert called this *constructionism*, distinguishing it from Piagetian *constructivism* by insisting that the artifact is not incidental to the learning but constitutive of it (Papert, 1980; Papert & Harel, 1991). Logo, the programming language he co-designed, was less important for its syntax than for the *turtle microworld* it offered: a contained environment with simple rules and immediate visual consequences. The learner could form a conjecture, execute it, observe a result, and revise — a debugging loop indistinguishable in structure from the loop a scientist runs in the lab.

Kafai's (2006) handbook entry on constructionism dispels a common misreading: constructionism is not discovery learning loosed from instruction, and it is not "computers as teachers." It is the claim that *people, not computers, drive learning*, and that designed environments — microworlds, simulations, manipulable artifacts — work by giving learners something tractable on which to exercise that drive. The PhET simulation you just saw, the GeoGebra applet your colleague uses, the explorable explanation Bret Victor published in 2011 — all of them are microworlds in Papert's sense.

### Constructivism and conceptual change

A second tradition, running through the 1980s and 1990s, came from the science-education community's empirical discovery that students do not arrive as blank slates. Posner, Strike, Hewson, and Gertzog (1982) proposed that conceptual change requires four conditions: dissatisfaction with the existing conception, and intelligibility, plausibility, and fruitfulness of the new one. Vosniadou (1994; 2012) showed that learners' misconceptions are not isolated errors but coherent *framework theories* built from ontological presuppositions — solidity, continuity, gravity, inertia — that consolidate in infancy. The intuitive belief that a moving object requires a continuously applied force is not a gap in instruction; it is a stable theory the world has spent years training, and it does not yield to a textbook chapter.

The design implication is direct. A good interactive does not merely *display* the correct physics; it engineers cognitive conflict. It lets the learner predict, run the model, and confront the discrepancy. Without that confrontation, lecture leaves the framework theory untouched while the student passes the exam by symbol manipulation.

### Physics Education Research and the gap between exposure and mastery

The empirical evidence that something was wrong with traditional instruction came from physics. The Force Concept Inventory (Hestenes, Wells, & Swackhamer, 1992) was a short multiple-choice instrument designed to detect Newtonian misconceptions in everyday language. Results across many institutions showed that nearly 80% of students completing introductory physics could state Newton's Third Law correctly but fewer than 15% genuinely understood it. The lecture transmitted the words and left the framework theory intact.

Hake's (1998) six-thousand-student survey then compared "interactive engagement" courses to traditional lecture courses on the same instrument and found roughly double the normalized learning gain in interactive courses, robust across high schools, colleges, and universities. Hake's paper seeded a decade of curriculum reform, including the founding of PhET. Freeman et al. (2014) then generalized the result across STEM: a meta-analysis of 225 studies found that active-learning conditions raised examination scores by 0.47 standard deviations and reduced failure rates by 55%. The Freeman result is not a license to put any interactive thing in front of students; it is evidence that *well-designed* interactive engagement consistently outperforms lecture.

### Embodied and grounded cognition

A fourth strand, from cognitive psychology, helps explain *why* manipulation outperforms description. Barsalou's perceptual-symbol-systems work (1999; 2008) argued that concepts are not stored as amodal abstractions but as partial simulations of perceptual and motor experience. Glenberg and Kaschak (2002) showed this empirically: subjects judging the sensibility of "open the drawer" responded faster when the response key required a hand motion *toward* the body, as if comprehension involved motor preparation.

For pedagogy, the implication is that *direct manipulation of a model is not merely a more engaging way to deliver the same information*. Manipulation engages sensorimotor and spatial resources that pure symbolic instruction does not. Goldstone and Son's work on concrete versus idealized simulation (2005), and the subsequent "concreteness fading" literature (Fyfe, McNeil, Son, & Goldstone, 2014), refines this: pure concreteness traps learners in surface features; pure abstraction leaves them no foothold. Effective instruction often begins concrete and fades, gradually stripping away perceptual specifics while preserving structural relationships. PhET simulations frequently do this implicitly.

### Design-based research

What made all of the above empirically defensible in messy classrooms was Ann Brown's (1992) methodological framework for "design experiments," paralleled by Collins, Joseph, and Bielaczyc (2004). Learning interventions cannot be evaluated by laboratory protocols alone; they must be iteratively deployed in actual classrooms, with mixed-methods data feeding back into refinement of both artifact and theory. This is what PhET actually did. The Colorado team conducted over two hundred individual think-aloud interviews to discover what students actually *did* with the simulations — and many discoveries were unflattering surprises (Adams et al., 2008a; 2008b). This methodology matters here because it is the part of the PhET tradition that does *not* automatically come along when an instructor builds a simulation with a language model. The artifact comes along. The empirical-validation loop does not.

### The "engaging but not pedagogical" failure mode

The educational-technology literature contains a long shelf of cautionary cases — interventions that looked impressive in demos but failed to move learning outcomes when measured. Richard Mayer's three-decade research program on multimedia learning (Mayer, 2009; 2024) catalogues when added visual and interactive elements help (reducing extraneous cognitive load, supporting a coherent mental model) and when they hurt (seductive details that steal working-memory capacity, split attention, substituting for the generative work the learner needs to do). The PhET corpus, on average, observes Mayer's principles; an LLM instructed to "make it engaging" does not necessarily.

Taken together, these strands converge on a fairly specific picture of what a well-designed interactive must do. It must target an identified learner difficulty, give the learner something to predict and revise, engage perceptual and motor systems in support of an abstraction, link multiple representations of the same underlying structure, and earn its place in a curriculum through iterative empirical validation. None of these requirements is satisfied by the fact that the artifact runs.

---

## Part 2 — What the PhET tradition gets right that other educational technology often gets wrong

The PhET corpus is one of the only bodies of educational technology with two decades of empirical evidence behind it. What separates it from the wider ed-tech landscape is a set of design commitments that are easy to articulate and surprisingly hard to follow.

**Learning-goal-first design.** Every PhET simulation begins from a specific, named cognitive difficulty — students confuse charge and voltage; students believe heavier objects fall faster; students think a battery is a reservoir of current. The simulation is built backward from the misconception. This sounds obvious. It is the opposite of how most ed-tech is built. Feature-led design starts from what the platform can render and works toward a topic; a coin-flipping animation gets built because flipping coins is easy to animate, and a learning rationale is reverse-engineered. The PhET inversion is a discipline, not a default. An LLM-generated simulation has no built-in pressure to begin from a misconception; absent explicit framing, it produces simulations of *phenomena* rather than simulations of *concepts*.

**Deliberate simplification as a pedagogical move.** A simulation faithful to the physics is often a worse teaching tool than a deliberately incomplete one. PhET's circuits sim does not model wire resistance; the Coulomb sim does not model retardation effects. These omissions are pedagogical choices made on the principle Bruner articulated in 1960: any subject can be taught in some intellectually honest form at every level, *provided* the form preserves the structural relationships that matter and strips away the ones that do not (Bruner, 1960). Deciding what to hide is the most consequential design decision in the artifact, and it is invisible in the finished product.

**Multiple linked representations.** A canonical PhET simulation displays the phenomenon, a graph, an equation, and sometimes a table — all updating together as the learner manipulates the controls. In Ainsworth's (2006) DeFT framework, multiple representations distribute cognitive load, constrain interpretation, and introduce the learner to the discipline's representational system. Physicists do not think in equations alone; they shuttle between graph, diagram, equation, and physical picture. The simulation that updates all four simultaneously is teaching the *shuttling*, which is part of the epistemic culture of the discipline.

**Immediate, reversible feedback.** What makes a simulation a *probe* rather than a *demonstration* is that the learner can ask a question of it — "what if I do this?" — and get an answer in milliseconds, and undo it, and ask again. The same simulation deployed as a non-interactive video is a different and weaker pedagogical artifact. This is why a screen recording of a PhET sim is much less useful than the sim itself, and why a static figure in a textbook is less useful still.

**Iterative validation against actual learners.** The PhET team's interview protocols (Adams et al., 2008a; 2008b) regularly discovered that learners interpreted simulations in ways their designers did not anticipate. Students would change variables and ignore the graph; they would treat the simulation as a game whose goal was to maximize a visible number; they would invent causal stories about variables the simulation did not represent. None of this is visible from the outside. It is detectable only by sitting next to students as they use the artifact. This is the part of the PhET tradition hardest to import into instructor-built work, and the part on which the artifact's actual learning effects most depend.

**The "what is hidden by design" decision.** Following from deliberate simplification: the omission is doing pedagogical work. A bad simulation reveals what the textbook reveals and hides what the textbook hides; a good one reveals what the textbook hides (the dynamics, the linked representations, the structural pattern) and hides what the textbook overemphasizes (formal apparatus, edge cases, cluttered phenomenology). The simulation's pedagogical *theory of mind* about its user is encoded in what it does not show.

Each of these moves requires real subject-matter expertise *paired with* real learning-science expertise. None of them is supplied by code generation alone.

---

## Part 3 — Where LLM-enabled simulation extends the tradition, into which adjacent fields, and what is at stake

The accompanying essay argues that the bottleneck on PhET-tradition simulation has not been pedagogical insight — that has existed in many disciplines for decades — but the cost of coordinating the small team required to ship a working sim. The LLM collapse is a coordination collapse, not a pedagogical-design collapse. An instructor can now produce in hours an artifact that previously required a year of cross-disciplinary collaboration. This unlocks the genre for disciplines whose funding or institutional culture never supported the PhET production model. It does not unlock the pedagogical-design work that PhET did over twenty years. That work still has to happen, and it now has to happen at every individual instructor's desk.

### Adjacent STEM disciplines

The clearest extension is into STEM areas with interactive traditions but no PhET-equivalent breadth. ChemCollective at Carnegie Mellon, developed under David Yaron since 1999, provides virtual labs where students design and run their own experiments (Yaron, Karabinos, Lange, Greeno, & Leinhardt, 2010). Paper-and-pencil chemistry problems frequently degenerate into algebra exercises that students pass without learning chemistry; the virtual lab forces them to *generate* the data, which means engaging with the underlying chemistry. An individual instructor can now build the specific virtual lab their topic needs that ChemCollective never produced. In mathematics, Desmos and GeoGebra are environments for building manipulable mathematical objects rather than curated topic-specific simulations; the LLM enables a faculty member to assemble a Desmos-flavored activity targeted at a specific cognitive difficulty without the platform-specific scripting that gated entry.

In data and statistics pedagogy, the relevant predecessors are the Concord Consortium's CODAP, Daniel Kunin's *Seeing Theory* project at Brown, and Allen Downey's "Think Stats" tradition. *Seeing Theory* is a useful model: Kunin built it as an undergraduate because his own introductory course had not given him the intuition the visualizations finally produced. The page on the Law of Large Numbers does not explain the law in words; it lets you watch a running sample mean converge while you change the distribution (Kunin, 2018). The teaching is in the watching.

### Computer science and quantitative reasoning across the curriculum

Bret Victor's body of work — *Up and Down the Ladder of Abstraction* (2011), *Inventing on Principle*, *Explorable Explanations* — sets the conceptual ceiling for this genre. Victor's contribution was less a set of artifacts than a design philosophy: the medium of *active reading* should let the reader manipulate the author's assumptions and observe consequences in real time. The Distill journal attempted to institutionalize this as a venue for ML and CS research communication. The LLM tooling now reduces the design effort to something an individual instructor can sustain.

The largest unclaimed territory is quantitative reasoning across the curriculum. Statistics and quantitative methods are taught throughout the social sciences and biomedical fields, often by faculty who are not statisticians. The regression-assumption sandbox — drag points, watch the line move, the residual plot update, leverage statistics shift — is the obvious case. So is the simulation-based causal-inference tool, the genre Cunningham's *Causal Inference: The Mixtape* (2021) gestures at, where directed acyclic graphs become manipulable and counterfactual outcomes appear as the student edits the assumed causal structure. In economics, CORE Econ's Interactive Economics visualizations (CORE Econ Team, 2023) — the inflation tool that puts the student in the role of a central-bank policymaker, the Skyscrapers visualization of global income distribution — sit clearly within the PhET design grammar. Game-theory pedagogy, behavioral economics demonstrations, and the bargaining-and-fairness experimental tradition remain undersupplied at the artifact level. The visualizer for qualitative coding — annotate an interview transcript, watch code frequencies and theme clusters update — has no equivalent tradition, because qualitative methods training has been bookbound.

### Writing, history, languages, arts

These are the genuinely new territory and where the design challenge bites hardest. A Toulmin-model diagrammer that re-analyzes the structure of an argument as the student edits it; a feedback-loop model of revision; a manipulable instance of audience uptake under varying rhetorical moves — none of these have a PhET tradition because rhetorical theory has not had a substrate on which manipulable simulations could be cheaply built. The opportunity is real. So is the risk: rhetoric does not have a Force Concept Inventory. No established empirical instrument tests whether a rhetoric-feedback simulation teaches what it claims to teach, and the standard of "pedagogically correct" that constrains physics simulations does not yet exist in writing pedagogy. The same applies to historical-counterfactual sandboxes, agent-based simulations of social-historical processes, manipulable grammar tools for highly inflected languages (Sanskrit, Latin, Greek, Russian), and color-theory, perspective-construction, or music-theory tools. The pedagogical move is good in each case; the supervision burden on the instructor — ensuring the simulation is not coherent-looking and conceptually wrong — is substantial.

---

### The hard problems

The above extensions are real opportunities. They are also where the failures will be expensive. Six problems deserve sustained attention.

**The demo trap.** The most consistent failure mode in educational technology is the artifact that looks superb in a workshop and produces nothing measurable in a classroom. Workshop audiences sample the artifact briefly under expert framing, while students encounter it cold in a tab open beside their textbook. PhET escaped this trap because every artifact went through extensive classroom validation before release. LLM-built simulations have no comparable empirical gate. Faculty enthusiasm at a demo does not predict student learning.

**Assessment.** What does it mean to have learned from one of these? The PhET corpus has accumulated two decades of outcome data; an instructor's simulation has no such track record by definition. The question physics education research took a generation to answer — does this artifact move scores on a validated instrument? — does not have a one-instructor-one-semester answer. For new genres in fields without concept inventories (rhetoric, history, language pedagogy), there may be no clean way to answer it at all.

**Accessibility.** A single-file HTML artifact will, by default, ship without keyboard navigation, screen-reader support, sufficient color contrast, or focus indicators. None of these are hard to add, but the LLM will not add them unless instructed, and the instructor who is not already accessibility-fluent will not notice they are missing until a student notices for them. The PhET team has worked explicitly on accessibility for years; an instructor-built artifact starts from zero. WCAG 2.1 conformance is non-optional in any institutional context with disability-services obligations.

**The discipline-specific quality bar.** What "pedagogically correct" means in physics is empirically tested. What it means in qualitative-methods pedagogy or in rhetoric is not. New genres without established quality criteria are likely to produce simulations that are visually coherent and pedagogically misaligned — and because the LLM is fluent in the language of pedagogy, the misalignment will be obscured by plausible-sounding rationale. This is a special case of the hallucination problem (Xu, Jain, & Kankanhalli, 2024): the model is most dangerous where it is most confidently fluent.

**Maintenance and decay.** A PhET simulation has been maintained for two decades because an institution maintains it. A single-file artifact built for a single semester has a shelf life measured in months. Browser API changes, dependency updates, textbook adoptions that move on — all slowly erode the artifact's fit to the course. A syllabus built around a faculty member's collection of LLM-built sims in 2026 needs significant remediation by 2029. PhET solved this with a development team. Individual instructors do not have one.

**Equity, in two directions.** First, faculty with strong design intuition and time to iterate will produce excellent interactives; faculty without those resources will produce decorative ones. From the student's seat the difference is invisible — both look like simulations — and consequential, because only one actually teaches. The PhET corpus was a *leveling* resource: a teacher at an under-resourced school could deploy the same world-class artifact a teacher at an elite school deployed. Instructor-built interactives potentially de-level the field. Second, Bastani et al. (2025), in a field experiment with nearly a thousand high-school mathematics students in Turkey, found that students given an unscaffolded ChatGPT tutor performed substantially better on practice problems but *worse* on subsequent exams without the tutor than the control group did. The mechanism was that students used the AI as a crutch and bypassed the cognitive work that would have built durable skill. The artifacts you build with an LLM are not the same risk as the AI-as-tutor case, but the underlying lesson — that AI assistance which removes the cognitive friction also removes the learning — generalizes. A simulation that lets the student answer all the homework questions without ever having to predict, fail, and revise has reproduced the demo-trap pathology in artifact form.

---

The collapse of the coordination cost is real, and it opens disciplinary territory that two decades of physics-education-research practice never reached. The collapse of the design cost is illusory. The hard parts of building a simulation that teaches — identifying the misconception, choosing what to hide, linking the representations, validating against actual students — were always the hard parts and remain so. What the workshop demonstrated is that a faculty member can now produce a credible-looking artifact in an afternoon. What two decades of learning science suggest is that whether the artifact teaches depends on a different set of questions, asked over a longer time horizon, against evidence the artifact itself cannot supply.

The right disposition for a faculty member leaving the workshop is neither the boosterism of "we can finally build what we always wanted to build" nor the dismissal of "this will produce a wave of bad sims." It is the recognition that a fifty-year intellectual tradition has just been made operationally available to disciplines that never had it — and that the responsibility for using it well now sits with the instructor, where, in the PhET model, it sat with an interdisciplinary team. The instrument is more powerful; the standard of care has not changed.

---

## References

Adams, W. K., Reid, S., LeMaster, R., McKagan, S. B., Perkins, K. K., Dubson, M., & Wieman, C. E. (2008a). A study of educational simulations Part I — Engagement and learning. *Journal of Interactive Learning Research*, *19*(3), 397–419.

Adams, W. K., Reid, S., LeMaster, R., McKagan, S. B., Perkins, K. K., Dubson, M., & Wieman, C. E. (2008b). A study of educational simulations Part II — Interface design. *Journal of Interactive Learning Research*, *19*(4), 551–577.

Ainsworth, S. (2006). DeFT: A conceptual framework for considering learning with multiple representations. *Learning and Instruction*, *16*(3), 183–198.

Barsalou, L. W. (1999). Perceptual symbol systems. *Behavioral and Brain Sciences*, *22*(4), 577–660.

Barsalou, L. W. (2008). Grounded cognition. *Annual Review of Psychology*, *59*, 617–645.

Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *Proceedings of the National Academy of Sciences*, *122*(26), e2422633122.

Brown, A. L. (1992). Design experiments: Theoretical and methodological challenges in creating complex interventions in classroom settings. *Journal of the Learning Sciences*, *2*(2), 141–178.

Bruner, J. S. (1960). *The process of education*. Harvard University Press.

Collins, A., Joseph, D., & Bielaczyc, K. (2004). Design research: Theoretical and methodological issues. *Journal of the Learning Sciences*, *13*(1), 15–42.

The CORE Econ Team. (2023). *The Economy 2.0: Microeconomics*. CORE Economics Education. https://www.core-econ.org

Cunningham, S. (2021). *Causal inference: The mixtape*. Yale University Press.

Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. *Proceedings of the National Academy of Sciences*, *111*(23), 8410–8415.

Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction: A systematic review. *Educational Psychology Review*, *26*(1), 9–25.

Glenberg, A. M., & Kaschak, M. P. (2002). Grounding language in action. *Psychonomic Bulletin & Review*, *9*(3), 558–565.

Goldstone, R. L., & Son, J. Y. (2005). The transfer of scientific principles using concrete and idealized simulations. *Journal of the Learning Sciences*, *14*(1), 69–110.

Hake, R. R. (1998). Interactive-engagement versus traditional methods: A six-thousand-student survey of mechanics test data for introductory physics courses. *American Journal of Physics*, *66*(1), 64–74.

Hestenes, D., Wells, M., & Swackhamer, G. (1992). Force Concept Inventory. *The Physics Teacher*, *30*(3), 141–158.

Kafai, Y. B. (2006). Constructionism. In R. K. Sawyer (Ed.), *The Cambridge handbook of the learning sciences* (pp. 35–46). Cambridge University Press.

Kunin, D. (2018). *Seeing Theory: A visual introduction to probability and statistics*. Brown University. https://seeing-theory.brown.edu

Mayer, R. E. (2009). *Multimedia learning* (2nd ed.). Cambridge University Press.

Mayer, R. E. (2024). The past, present, and future of the cognitive theory of multimedia learning. *Educational Psychology Review*, *36*(1).

Papert, S. (1980). *Mindstorms: Children, computers, and powerful ideas*. Basic Books.

Papert, S., & Harel, I. (Eds.). (1991). *Constructionism: Research reports and essays, 1985–1990 by the Epistemology and Learning Research Group, the Media Lab, MIT*. Ablex.

Posner, G. J., Strike, K. A., Hewson, P. W., & Gertzog, W. A. (1982). Accommodation of a scientific conception: Toward a theory of conceptual change. *Science Education*, *66*(2), 211–227.

Theobald, E. J., Hill, M. J., Tran, E., Agrawal, S., Arroyo, E. N., Behling, S., et al. (2020). Active learning narrows achievement gaps for underrepresented students in undergraduate science, technology, engineering, and math. *Proceedings of the National Academy of Sciences*, *117*(12), 6476–6483.

Victor, B. (2011). *Up and down the ladder of abstraction: A systemic approach to interactive visualization*. http://worrydream.com/LadderOfAbstraction/

Vosniadou, S. (1994). Capturing and modeling the process of conceptual change. *Learning and Instruction*, *4*(1), 45–69.

Vosniadou, S. (2012). Reframing the classical approach to conceptual change: Preconceptions, misconceptions and synthetic models. In B. J. Fraser, K. Tobin, & C. J. McRobbie (Eds.), *Second international handbook of science education* (pp. 119–130). Springer.

Wieman, C. E., Adams, W. K., Loeblein, P., & Perkins, K. K. (2010). Teaching physics using PhET simulations. *The Physics Teacher*, *48*(4), 225–227.

Xu, Z., Jain, S., & Kankanhalli, M. (2024). Hallucination is inevitable: An innate limitation of large language models. *arXiv preprint* arXiv:2401.11817.

Yaron, D., Karabinos, M., Lange, D., Greeno, J. G., & Leinhardt, G. (2010). The ChemCollective — Virtual labs for introductory chemistry courses. *Science*, *328*(5978), 584–585.
