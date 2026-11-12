# Wieman pedagogy — the research anchor for /phet-activity

This is the short, honest summary of the research findings that the `/phet-activity` skill is built on. It is not a literature review. It exists so faculty (and Claude) can understand *why* the skill insists on the four-phase Predict-Observe-Explain structure, why peer discussion is non-negotiable, and why "expected wrong predictions" is treated as the highest-leverage piece of the lesson plan.

**See also:** the project-level [research-basis.md](../../../../research-basis.md), which gives a broader summary of the empirical literature spanning both simulation *design* (PhET / Adams / McKagan) and pedagogical *use* (Wieman / Deslauriers / Freeman). This file is the focused subset most relevant to `/phet-activity`; the project-level note is the place to send a reviewer or department chair who wants the citation stack.

## Where this comes from

Carl Wieman, who shared the 2001 Nobel Prize in physics, founded PhET Interactive Simulations at the University of Colorado Boulder in 2002. His research group's empirical claim is not "simulations work" but rather "simulations work *when wrapped in interactive engagement activities*, and not otherwise." Two papers by Adams et al. (2008) articulated this in detail — one on engagement and learning, one on interface design.[^adams-2008] Together they grounded PhET's design constraints (immediate feedback, direct manipulation, deliberate simplification) and informed what classroom use of the sims should look like.

Outside of PhET specifically, Wieman was a co-author on the Freeman et al. (2014) meta-analysis in *PNAS* that compared active learning to traditional lecture across 225 STEM courses. It found that students in traditional lecture were roughly 1.5 times more likely to fail than students in active-learning sections, and that conceptual gains were substantially higher.[^freeman-2014] That paper is now one of the most-cited in higher-education pedagogy.

## The mechanisms the skill is built around

### 1. Commitment before exploration

Multiple lines of research converge on the same finding: students learn more when they commit to a prediction *before* observing the answer. The earliest large-scale evidence in physics teaching is Hake's 1998 study of about 6,000 students, which compared interactive-engagement courses to traditional courses on the Force Concept Inventory and found roughly twice the normalized gain in IE courses.[^hake-1998] Eric Mazur's Peer Instruction work, developed at Harvard in the 1990s, formalized the commitment-then-discussion pattern with clicker-style ConcepTests.[^mazur-pi]

The mechanism is straightforward: the act of committing — in writing, ideally publicly — surfaces what students actually believe, makes the misconception articulable, and gives them a stake in the outcome. Without the commitment, the sim risks becoming a confirmation exercise.

This is the **Predict** phase in the lesson plan. The skill insists on it.

### 2. Predict → Observe → Explain as the structure

The Predict-Observe-Explain pattern is a long-standing inquiry-pedagogy structure. Wieman's group has been less doctrinaire about the name than about the *order*: students must form an expectation, then encounter evidence, then explain the discrepancy or confirmation. Reversing the order — giving the explanation before students have predicted — collapses the activity into a demonstration that students watch rather than think through.

### 3. Peer discussion as the resolution mechanism

Mazur's Peer Instruction research showed that students explaining concepts to *peers who hold a different view* is one of the highest-leverage moves in interactive teaching, often more effective than the instructor explaining the same concept directly. The mechanism is that explaining-to-a-peer requires articulating the conceptual model in one's own words. That articulation is the work that turns "seeing" into "knowing."

This is the **Explain** phase. The skill defaults to think-pair-share as the minimum and waives the peer step only if the user has named a real constraint (fully asynchronous remote class is the typical valid exception).

### 4. Knowing the misconceptions in advance

Wieman's group, both in PhET's design documentation and in the broader CWSEI (Carl Wieman Science Education Initiative) materials, has emphasized that effective instructors of these activities *know in advance what wrong answers to expect.* The instructor's job during the Explain and Synthesize phases is not to evaluate each student answer fresh; it is to recognize patterns from a known catalog and respond with prepared moves.

This is why the lesson-plan template forces the author to name two or more expected wrong predictions and what to say in response. Faculty who walk in without that list go in blind and tend to default to vibe-based responses that do not address the misconception directly.

## What the skill does *not* claim

- It does not claim that lessons produced this way will reach a specific learning gain. The research findings above describe *patterns of effective teaching*, not guaranteed effect sizes for any single lesson.
- It does not claim that this four-phase structure is the only correct one. It is the structure best-supported by the empirical work for the specific case of teaching with manipulable simulations. Other traditions (problem-based learning, the case method, studio crit) follow other structures suited to other tasks.
- It does not claim the lesson plan will work without an engaged instructor. The artifact is necessary but not sufficient.

## A short reading list (only sources cited above)

- Adams, W. K., Reid, S., LeMaster, R., McKagan, S. B., Perkins, K. K., & Wieman, C. E. (2008). *A study of educational simulations Part I — Engagement and Learning.* Journal of Interactive Learning Research, 19(3), 397–419.
- Adams, W. K., Reid, S., LeMaster, R., McKagan, S. B., Perkins, K. K., & Wieman, C. E. (2008). *A study of educational simulations Part II — Interface Design.* Journal of Interactive Learning Research, 19(4), 551–577.
- Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). *Active learning increases student performance in science, engineering, and mathematics.* PNAS, 111(23), 8410–8415.
- Hake, R. R. (1998). *Interactive-engagement versus traditional methods: A six-thousand-student survey of mechanics test data for introductory physics courses.* American Journal of Physics, 66(1), 64–74.
- Mazur, E. (1997). *Peer Instruction: A User's Manual.* Prentice Hall.

[^adams-2008]: Both Part I (engagement and learning) and Part II (interface design) appeared in *Journal of Interactive Learning Research* in 2008. PhET's own design-process documentation cites them as the foundation for the "PhET Look and Feel." See <https://phet.colorado.edu/publications/phet_design_process.pdf>.
[^freeman-2014]: Freeman, S., et al. (2014). "Active learning increases student performance in science, engineering, and mathematics," *PNAS*, 111(23), 8410–8415. doi:10.1073/pnas.1319030111.
[^hake-1998]: Hake, R. R. (1998). "Interactive-engagement versus traditional methods: A six-thousand-student survey of mechanics test data for introductory physics courses," *American Journal of Physics*, 66(1), 64–74.
[^mazur-pi]: Mazur, E. (1997). *Peer Instruction: A User's Manual.* Prentice Hall. The clicker / ConcepTest workflow was developed in Mazur's intro physics teaching at Harvard in the early 1990s.
