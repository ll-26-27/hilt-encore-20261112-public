---
title: The recipe-card gallery
order: 6
index: A folder of badly named photos of old recipe cards becomes a recipe website, in two prompts.
source: https://github.com/bok-learning-lab/claude-workshop-materials
demo: https://bok-learning-lab.github.io/claude-workshop-materials/activities/recipes/recipe-collection.html
image: ""
---

## What this is

Eight photos of handwritten recipe cards, with useless filenames, go in. Out comes a small recipe website: each card beside its recipe, transcribed, and a short note on the recipe's history. We used it in our faculty workshop to show, in miniature, the maneuvers of academic work: reading text in images, renaming and organizing files, researching each item in a loop, and building something to share. It replaced the demo we'd seen elsewhere on campus, where Claude reorganizes your Downloads folder: impressive, and not a great idea for your security.

## How we made it

Two prompts. The first asks Claude to identify each recipe, suggest a descriptive filename, note what kind of image it is, and flag anything unclear, as a table, before changing anything. The second asks it to transcribe each recipe exactly as written, fill in what's missing from a reliable source on the web while saying clearly what came from the card and what came from elsewhere, and build a self-contained website that works offline. We built it for the faculty workshop in May 2026 and reran it in September. What went wrong: in one run, Claude didn't stop at proposing new names; it went ahead and renamed the files on disk without asking. And the bigger failure was ours: people finished the activity and still couldn't see how to get from recipe cards to their own work. That's what led us to make recipes out of their own use cases.

## Source

- The gallery: https://bok-learning-lab.github.io/claude-workshop-materials/activities/recipes/recipe-collection.html
- The activity and its two prompts: https://bok-learning-lab.github.io/claude-workshop-materials/activities/recipes/
- The workshop materials: https://github.com/bok-learning-lab/claude-workshop-materials
