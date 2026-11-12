# Build a Sim in Two Hours

**Learning Lab staff session — testing the GENED 1104 sim assignment**

---

## The course

GENED 1104, Science and Cooking, taught by Pia Sörensen. Ten weeks of physical-science topics: energy and heat, phase transitions, fermentation, elasticity, diffusion, heat transfer, viscosity, emulsions and foams.

Tuesday lectures open with twenty minutes of science and then hand over to a visiting chef — José Andrés, Joanne Chang, Bryan Furman, Mauro Colagreco and others in the 2025 roster, with a new roster coming for 2026. Thursday lectures are the instructors going deeper on the science and setting up the week's homework. Every student also does a two-hour lab in Maxwell Dworkin where they cook a recipe, take measurements, and hand in a worksheet. Grading is problem sets, lab worksheets, two in-class midterms, and a final project shown at a course-wide science fair. No final exam.

The course already allows generative AI with citation, and says explicitly that students bear final responsibility for anything they submit.

## The assignment we're testing

Students take one concept from the course, anchored in something a chef said or showed on a Tuesday, and build a PhET-style web page: one equation, two to four sliders with real units, one thing that moves. They defend it at a station in section.

The two hard steps are getting from "a chef held up a dry-aged steak" to "here is a question/concept with a number in it," and then deciding what that question/concept should look like on screen.

> **NOTE: Madeleine, here** — I actually took the class. Bridging this gap is the interesting part to me (outside of the actual vibe coding). Getting students to be able to hear about/see cooking processes or products and then extrapolate these to something scientific that can be explored/tested is the goal of the class. That is the final capstone, but this is a good way to practice that move before they get to the finals. My hope would be this would result in better final projects AND give them a cool artifact.

---

## What we are testing

Two steps in this assignment are hard. Writing the code is not one of them.

### Step 1 — turn a kitchen observation into an equation

You are given a description of something that happened in a kitchen. It contains no physics. Work out which quantity is changing and which relationship from the course governs it.

| Kitchen observation | Physics |
|---|---|
| Caramelizing onions takes 45 minutes, and most of it is "getting the water out" | Evaporating water costs energy. How much? $Q = mL_v$ |
| The spheres come out of the bath at two minutes | Something is moving inward. How far does it get? $\delta = \sqrt{2Dt}$ |
| Two and a half minutes and the beans are ruined | Heat has to reach the middle. How long? $t \approx r^2/\alpha$ |

Method:

1. Name what changed. Write down the start state and the end state.
2. Name the process that got it there — heating, drying, diffusing, dissolving, settling.
3. Decide what you would measure to know how far along it got. It has to have a unit.
4. List what makes it go faster or slower. Those become your sliders.

If you cannot finish step 3 with a quantity and a unit, the observation is still too vague to build on. Pick a different one.

**This step is supposed to be hard.** If it feels slow or uncertain, that is the intended experience and not a sign you are doing it wrong. Note how long it takes you — that number is one of the things we want out of today.

#### If you have no idea where to begin

Most people don't, the first time, and students will be worse off than you are. Answer these in one sentence each. They are deliberately dumber than the four above.

1. What is this thing mostly made of? Water, fat, sugar, starch, protein, air.
2. What went in or came out? Heat in, water out, salt in, air whipped in, something dissolved, something stiffened.
3. How long did it take — seconds, minutes, or hours? What would make it faster?
4. **Which domain is that?** Heat transfer, diffusion, phase change, viscosity, elasticity, surface tension.

Question 4 usually names the equation. The course only has about eight in total, so once you have the domain the search space is small.

#### Using AI at this step

**Use it.** Students will, the course policy allows it, and nobody is expected to do this from memory. The distinction that matters is reference versus answer machine:

| Useful | Not useful |
|---|---|
| "What physical process controls how fast water leaves a pan?" | "Give me the equation for caramelizing onions." |
| "What is the thermal diffusivity of a carrot? Cite a source." | "Write my sim for the green bean problem." |
| "My reasoning is X, Y, Z. What am I missing?" | "What should my sliders be?" |
| "Give me three ways to picture $\delta = \sqrt{2Dt}$." | "Is this right?" with no reasoning of your own attached. |

The left column asks for material you then have to assemble. The right column asks for the answer to the thing being tested. If a model hands you an equation you still have to work out why that one and not another, which is what the crit will ask about.

**Keep your transcript.** Part of today's data is what people actually typed.

### Step 2 — decide what to draw

An equation does not specify its own picture. You choose one. There is usually more than one defensible option, and different options teach different things.

Some options for the topics below:

- **Onions.** A pan from above with a shrinking puddle of water. An energy bar filling. A clock running against a marker at the 10 minutes recipes claim.
- **Sorbet.** Two tubs side by side with a spoon that does or does not go in. One tub cut open showing ice crystals against syrup. A bar splitting into frozen and unfrozen fractions as you drag the sugar.
- **Green beans.** A bean in cross-section with a colour front moving inward. A timer with a safe zone and a ruined zone, where a thickness slider moves the boundary.
- **Coffee.** Two glasses darkening at different rates on one clock.

Method:

1. Decide what the viewer should be able to notice without being told.
2. Pick the picture that makes that noticeable.
3. Decide which variables the viewer controls and which you hold fixed. Be able to say why.
4. Sketch it on paper before you start writing code.

**This step requires creativity and has no single correct answer.** Expect it to take longer than it looks, and expect to reject a first idea.

### What is not hard: the code

Claude will write the HTML in about twenty minutes and it will mostly work. Use it for that, and use it during the two steps above as well — see the AI guidance under step 1. If you are more than forty minutes into styling, stop; you have left the part of the exercise being tested.

---

## So, what we're doing today

Everyone picks a topic, works alone, and ships a sim in about an hour. Then we crit them.

Students get their anchor (so the process or product from a chef) from having been in the room during the lecture. We obviously won't have that experience, so the topics below are supplied in writing. If a written topic works about as well, the teaching team has a cheap fallback for the weeks when a chef turns up to talk about their restaurant and nothing else.

---

## Topics

Pick one. All plant-based (for Dani — they were originally steak, lol)

Each is written the way a chef would say it, with no physics in it. Extracting the physics is step 1.

1. **Onions.** Caramelizing them takes 45 minutes, not the 10 that recipes claim. Most of the time goes to driving off water.
2. **Sorbet.** Two sorbets, same fruit purée, about 8% difference in sugar. One scoops straight from the freezer; the other is a brick.
3. **Green beans.** Blanched 90 seconds in boiling water, then into ice. At two and a half minutes they're ruined. Beans about as thick as a pencil.
4. **Basil spheres.** Purée dripped into a calcium bath, spheres pulled out after two minutes. Leave them longer and they set solid through.
5. **Coffee.** Cold brew, 16 hours at 4°C, against hot brew, 5 minutes at 95°C. Same beans, same grind, same ratio.
6. **Aquafaba.** Whips to stiff peaks in 8 minutes. Egg white takes 3.
7. **Tahini.** Seizes into a stiff paste when you stir in a splash of water, then loosens and pours when you add more. Hardest one here.

Each topic contains a number. That number is your calibration target.

---

## Procedure

**1 · Quantify** — 20 minutes. Spend the **first 10 on paper alone**, then open laptops and use whatever you want, AI included. Run the four steps under step 1 above; if you stall, use the four dumber ones. Output: one measurable quantity with a unit, plus a list of what changes it.

The short paper phase is a measurement, not a rule students will face — it shows us where people stall unaided. Students will have laptops throughout, so after minute 10 you should too.

**2 · Reduce** — pick one equation or interactive, not three. Everything the sim shows has to come out of it.

**3 · Draw** — sketch the picture on the same paper. Output: what the viewer sees, what they can drag, what they should notice.

**4 · Build** — one self-contained HTML file. Two to four sliders, each a real physical quantity with real units. The equation printed on screen with your current values in it. One thing that moves. Use Claude for the code. These PhET diagrams are everywhere — feel free to google any. But [Logan](https://canvas.harvard.edu/courses/160209/pages/quantum-single-photon-interference) and Matt Schwartz have made these before for their courses.

**5 · Check** — your sim has to reproduce the number in your topic within a factor of two. Add a visible "what this model ignores" panel.

**6 · Defend** — someone else drives your sim while you stay quiet for sixty seconds, then tells you what rule they think they found.

---

## Log where the model gets the physics wrong

Keep a running list: wrong constant, dropped factor of two, a plausible equation that isn't the right one, a confident citation to a paper that doesn't exist. This feeds the assignment's AI-policy paragraph, with examples.

