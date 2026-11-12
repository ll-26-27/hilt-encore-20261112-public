---
title: Ekphrasis
order: 16
index: Cover parts of a picture with words. What does a description reveal, and what does it hide?
source: https://github.com/ll-26-27/cv-installation/tree/main/site/app/ekphrasis
image: /examples/ekphrasis/balloon-room-hero.svg
---

## What this is

Inspired by **estampa’s *Ekphrasis* (2025)**, an installation that applies object recognition and generated descriptions to film fragments, exploring what happens when images become words. [Read the artists’ project text and see exhibition photographs](https://tallerestampa.com/en/estampa/ekphrasis/).

In our camera-based adaptation, a camera image is divided into tiles. An object detector outlines what it recognizes, while a language model describes selected fragments without seeing the rest of the frame. Colored blocks display the descriptions over the image they replace.

Swipe through three supplied photographs: a weathered room, a visitor looking at a painting, and a dining room with balloons. Each was run through the installation’s descriptive model. Cover or uncover the red, yellow, and blue tiles, read their saved descriptions, and return to the whole image. No camera or API key is needed.

## How we made it

Built in November 2026 as part of *Seeing Machines*, after estampa's *Ekphrasis*. The original combines a browser-based COCO-SSD detector with a server-side language-model call. Each selected tile is sent separately, so the model's description has only a fragment's context.

On November 12, 2026, we reran the original descriptive route on all three photographs using `anthropic/claude-opus-5.5`. Each image was cut into a grid of four columns and three rows. Twelve crops were sent together per photograph, with the original prompt instructing the model to describe each tile as if the rest of the frame did not exist. All 36 responses, model names, token counts, and timings are saved with the site.

The gallery displays the literal captions on colored tiles; selecting a tile also reveals its longer ekphrastic description and model-supplied object labels. These labels come from the language model, not a fresh run of the installation’s separate COCO-SSD detector. The original photographs are preserved, including the interface icons visible in two of them. The gallery card uses the balloon-room photograph and the same primary-color overlays; this page opens directly into the three-image interactive.

## Source

[Original camera implementation](https://github.com/ll-26-27/cv-installation/tree/main/site/app/ekphrasis) · [estampa's Ekphrasis](https://tallerestampa.com/en/estampa/ekphrasis/).

[Download this run’s complete recorded responses](/examples/ekphrasis/recordings.json). Photographs supplied by Madeleine.
