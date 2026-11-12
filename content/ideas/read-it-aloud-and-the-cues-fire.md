---
title: "Read it aloud and the cues fire"
description: "A page knows the text a performer is reading, follows along as they read it aloud, and fires a sound, an image, or a color at each marked word."
mode: build-with-claude-code
tags: ["performance", "voice", "space", "media", "making"]
status: draft
---

A page knows the text a performer is reading, follows along as they read it aloud, and fires a sound, an image, or a color at each marked word.

## How it runs

Students mark cues in a short text (a poem, a speech, a scene) with `[[name]]` after the word that should trigger each one, and define what each cue does. One student reads aloud while the page follows and fires the cues on a projector; another stands by to press Go by hand if the follower loses its place. Then they swap and change the cues.

## With Claude

Ask Claude Code: "Make a page that listens with the browser's speech recognition, matches each heard word fuzzily against the next few words of this script so mishearings don't lose the place, re-anchors on three or four words in a row if it falls behind, fires the cue marked after a word when the reader passes it, and shows the current line as a surtitle. Add a simulated reader that misreads one word in twelve, for testing without a microphone. Write tests for the matching." A first version is an afternoon.

## Why it works

Performance and technology meet at one precise point (a word), so students think about timing, cueing, and what a machine can reliably hear. It also shows a small piece of tolerant code making an error-prone model usable.

## Time and materials

45 minutes of class; Chrome, a microphone, a projector and speakers.

## Variations

Surtitles for a play in translation; a lecture where slides advance on key phrases; a language class where pronunciation is checked against the text.
