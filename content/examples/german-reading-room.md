---
title: German reading room
order: 9
index: "Read a historical German page with its scan, competing transcriptions, and English translations in view together. Switch among three sources and inspect linked passages and disagreements. The reading room turns machine output into something a person can compare, question, and correct against the original."
source: ""
image: /examples/german-reading-room/grimm-page.jpg
---

## What this is

Historical German sources are difficult to read, and a fluent transcription can hide a bad guess. This prototype puts the scan beside the German text and English translation. Selecting a passage connects it to the page; marked disagreements invite a person to decide. Try switching among the Grimm, Kaskel and Schiller pages.

## How we made it

The inputs are page images, source metadata, several machine readings and line coordinates. Code aligns the readings with the scans and keeps disagreements visible; two models provide sentence-level English translations. The result is a saved HTML reading room, supported by run records and provenance. Agreement is a way to find passages worth inspecting, not proof that the text is right. The workshop folder retains the inputs and operations needed to rebuild it.
