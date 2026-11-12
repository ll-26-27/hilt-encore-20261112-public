---
title: Walking the Phaedrus
order: 7
index: Plato's Phaedrus is the one dialogue set outside Athens. Follow the walk on a map, eleven stops, the text in Greek and two translations, conjecture marked as conjecture.
source: https://github.com/ll-26-27/eng298ai-20261103
image: ""
---

## What this is

In the *Phaedrus*, Socrates leaves the city: he and Phaedrus wade up the Ilissos, pass the altar of Boreas, and sit under a plane tree by a spring, where they argue about love and then about writing. Plato describes the place more fully than any other, with exact bearings. This puts the walk on a map of the Ilissos valley in eleven stops, each with its passage in Greek and in Fowler's and Jowett's English, and it marks what is known on the ground and what is conjecture, including the two rival spots scholars have proposed for the plane tree. The question for a humanities seminar on AI tools is in the README: how do you keep a model from drawing a plane tree where no one has found one?

## How we made it

Built in a morning on November 3, for the same seminar's session on Claude Code. Three of the four steps are plain scripts: cut the eleven passages from the Greek and the two translations by their Stephanus numbers, look up the modern landmarks in OpenStreetMap, and build the page, checking that every stop has a passage and every claim a source. The fourth step was research by Claude Code with web search, and for each source it recorded whether it actually opened it. No API calls, no cost beyond the plan. What went wrong: the standard article on the setting sits behind a paywall and was never opened, so its argument appears only as two other scholars report it; the route between landmarks had to be drawn by hand; and Jowett's translation has no section numbers, so his passages may start or end a sentence off.

## Source

- The walk, with its README, data, and scripts: https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/maps/04-phaedrus-walk
- The seminar's repository: https://github.com/ll-26-27/eng298ai-20261103
