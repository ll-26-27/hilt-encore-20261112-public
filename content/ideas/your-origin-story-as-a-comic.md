---
title: "Your origin story as a comic"
description: "Students turn an interview or self-portrait into a character sheet and a four- or eight-panel superhero-style origin comic, then name where the comic got them wrong."
mode: perform-in-claude
tags: ["self-representation", "storytelling", "media", "skills", "context", "first-day"]
status: draft
---

Students turn an interview or self-portrait into a character sheet and a four- or eight-panel superhero-style origin comic, then name where the comic got them wrong.

## How it runs

(1) On paper, each student answers three questions in a sentence or two: Where do you come from? What happened to you (an obstacle, a move, a break, a doubleness)? What can you do now because of it: your power? A "power" is a real ability (a skill, a stubbornness, a way of seeing, a language), not a superpower. (2) They choose an alter ego: themselves, an animal, or an invented character. (3) An AI interviews them until the event is connected to the power and there is a specific moment where the power first shows. (4) The AI writes the captions and dialogue panel by panel before any image is made; the student edits that script. (5) Images are generated, as whole four-panel pages or one panel at a time from a character sheet. (6) The student reads the comic for its defaults ("Did it turn my obstacle into a tragedy, or into 'and then I learned'? Did it make my power a slogan?"), pushes back once, and presents the comic in a minute, saying where it got them wrong. (7) Try the same story in a different origin frame and compare.

## With Claude

Install an origin-story skill in Claude Code (`.agents/skills/origin-story/SKILL.md`, linked from `.claude/skills/`) with a few Node utilities, or ask Claude Code to write one: "Make a skill that turns my supplied text into a four- or eight-panel origin comic. Offer one short follow-up or a longer interview, or proceed if I say 'just go with what you have.' Write the factual brief and every caption and line of dialogue before any image. Then make a character sheet (front, three-quarter, profile, expressions) from photos I supply, compress it to a JPEG, and attach it as an image input to every panel request. Support two modes: `page` (one image per four panels, 2×2) and `panels` (one image per panel). Put everything in a new folder with an editable plan, the script, prompts, every image take, and an `index.html` reader and gallery that works offline." Then the student says: "Use origin-story with my three answers, eight panels, the mutant frame, my two photos." For a team story: "Draft each of these four origins, then a frame story that assembles them: opening page, the four origins, closing page, using all four character sheets together."

## Why it works

The form makes the student say how where they come from produced what they can do, and the model's familiar plots (the hardship followed by a lesson) are easy to spot when the story is your own. Switching the frame changes the answer to "where did the power come from?", which opens a discussion of how stories explain people.

## Time and materials

45–60 minutes in class. An image model that can take reference images (through a chat app, or an API key with Claude Code); a few dollars for a class. Photos are optional and stay local.

## Variations

Origin frames to try: the immigrant or "elsewhere" origin (an ability from a previous world becomes remarkable under new conditions); the exposure origin (an accident or encounter changes the person); the mutant origin (the difference was always there, and a crisis reveals it); a Golden Age re-render (same text, an old printed-comic look); a villain inversion or an affluent antihero (what if the power came from resources?). Do it as a team story where several students' origins assemble into one group. Use a historical figure's turning point, a scientist's discovery, a book's plot in eight panels, or a lab procedure as a comic. Lighter: four panels as a single page; harder: eight panels from individual panel images with consistent character sheets. Pairs with "The AI as interviewer: it writes only when you say 'write it'" and "Pair interviews as raw material" (this draft), and with pr.md's "Let AI misrepresent you".
