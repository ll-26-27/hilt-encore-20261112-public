# Pedagogical design worksheet

A paper-friendly version of the structured interview that `/phet-sim` runs before writing any code. Faculty can fill this out in advance — alone, with a colleague, or in a workshop session — then hand the completed worksheet to Claude Code to skip the live interview.

The worksheet is also a workshop handout. Filling it out by hand for ten minutes is a faster path to a good simulation than typing prompts for an hour.

The ten questions are in deliberate order. Resist the temptation to skip ahead to the visuals — the simulation's quality is determined by the first three answers, not the last seven.

---

## 1. Learning goal

What should a student be able to do, see, or explain after using this simulation that they could not before?

*Write one sentence. If it takes two, the goal is probably two goals — pick one.*

> Example: "After using this simulation, a student can explain why a projectile launched at 45° travels the farthest, and predict how that optimal angle would change if launched from a hilltop."

**Your answer:**

---

## 2. Target learner

Who is this for? What level? What can you assume they already know?

> Example: "First-year intro physics students who have seen vector decomposition once. Cannot be assumed to be fluent in calculus."

**Your answer:**

---

## 3. Core misconception or difficulty

What does this simulation make visible that students typically get wrong, miss, or hand-wave past? This is the design's center of gravity. Everything else flows from this.

If you cannot name a misconception, the simulation does not yet have a reason to exist. Go back to question 1 or pick a different topic.

> Example: "Students often think the optimal launch angle is steeper for longer ranges, conflating 'farther' with 'higher.' The simulation makes the symmetry of the trajectory and the cosine-of-angle relationship visible."

**Your answer:**

---

## 4. Manipulable variables

What does the student get to change? List two to five, each with units and a sensible range.

Fewer is usually better. PhET simulations almost always have three to four sliders, not eight.

> Example:
> - Launch angle: 0° to 90°
> - Initial velocity: 0 to 50 m/s
> - Gravitational acceleration: 1 to 25 m/s² (lets students explore other planets / no gravity)

**Your answer:**

---

## 5. Deliberately hidden or fixed variables

What is *not* manipulable, and why? Naming the simplification is the pedagogical move — it tells the student (and you) what this simulation is and is not about.

If you cannot name a single thing you deliberately excluded, the simulation is probably trying to do too much.

> Example: "Air resistance is off. Projectile mass does nothing. Wind doesn't exist. These are excluded because the lesson is about the geometry of unforced projectile motion, and adding drag turns it into a numerical-methods problem rather than a conceptual one."

**Your answer:**

---

## 6. Visual representations

Which of these will be shown, and how will they be linked to each other?

- Physical model (the thing happening — projectile arcing, wave propagating, molecules colliding)
- Graph (height vs. time, energy vs. position, population vs. time)
- Equation (the symbolic statement, possibly with current numerical values substituted)
- Table (current and historical values)
- Narrative readout ("Currently: range = 18.4 m, peak height = 4.6 m")

Aim for at least two linked representations. PhET's research finding: the linking is the learning. A graph and a model that update *together* teach more than either one alone.

> Example: "Physical model (a launcher, the projectile, the ground) on the left. Height-vs-time graph on the right, updating in real time as the projectile flies. Range readout below both. Equation panel showing R = v² sin(2θ) / g with current values substituted."

**Your answer:**

---

## 7. Feedback

What changes on screen *immediately* when the student moves a control? What does "reset" do?

Immediate feedback is non-negotiable. If the student has to press a "run" button, the simulation has failed.

> Example: "Moving the angle slider tilts the launcher and updates the projected trajectory dashed line, the range readout, and the equation panel. Moving the velocity slider does the same. Reset puts the projectile back at the launcher and clears the graph."

**Your answer:**

---

## 8. Reflection prompts ("Try this")

Three to five guided experiments the student can run inside the simulation. These appear in the artifact as a visible panel — they're part of the simulation, not separate handout material.

Good prompts ask the student to *predict before observing*, then check.

> Example:
> 1. Set velocity to 30 m/s. Predict the angle that gives the longest range. Then test by trying 15°, 30°, 45°, 60°, 75°. Did your prediction match?
> 2. With angle fixed at 45°, what happens to the range if you double the velocity? Does it double too?
> 3. Set angle to 30°, then to 60°. Are the ranges equal? Why might that be?

**Your answer:**

---

## 9. Model limitations

In two or three sentences, in language a student can understand: what does this simplified model leave out? What would have to be added before it could predict the real world?

This panel goes in the artifact, visible to the student. It is part of the lesson, not metadata.

> Example: "This model ignores air resistance, which is significant for fast or light projectiles. It also assumes the ground is flat and infinite. A real artillery shell, baseball, or thrown rock would deviate from these trajectories — often substantially. The model is useful for understanding the geometry of motion, not for hitting a target."

**Your answer:**

---

## 10. Classroom use

Where in a class session does this fit?

- Pre-class warm-up — students explore on their own before lecture.
- In-class demo — instructor drives, students discuss.
- Lab activity — students work through prompts in pairs.
- Post-class reflection — paired with a problem set.

This affects pacing and depth: a five-minute in-class demo wants fewer prompts and a more focused single representation. A lab activity wants more prompts and richer linked views.

> Example: "Post-class reflection. Students have seen the equations in lecture; this lets them check intuition. Paired with a problem set asking them to predict trajectories before computing them symbolically."

**Your answer:**

---

## When you're done

Hand the completed worksheet to Claude Code with a prompt like:

> "Build a PhET-style interactive based on this design worksheet. Use the `/phet-sim` skill. Worksheet attached."

The skill will read your answers, restate the learning goal back to you for confirmation, and produce the single-file HTML.

If any of your answers feel thin — especially questions 1, 3, 5, or 9 — talk it through with a colleague before generating the simulation. The technical floor is low; the design floor is where the work is.
