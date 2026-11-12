---
title: Black Key Étude
order: 24
index: "The opening eight bars of Chopin's Étude Op. 10 No. 5, heard from recorded piano and seen five ways (keyboard, pitch map, contour, intervals, five tones) while playback continues. A study in how a representation changes what you notice."
source: ""
image: "/examples/black-key-etude/card.svg"
---

## What this is

Chopin's *Étude in G-flat major, Op. 10 No. 5* is called the "Black Key Étude" because the right hand plays almost only black keys. This app takes the opening eight bars (162 notes) and lets you switch among five views on the same playback clock: a keyboard, a pitch map of both hands through time, the right hand's contour, the size of each right-hand interval, and the five pitch classes with octaves folded together. You can slow it down (36–116 BPM), hear one hand, loop a single bar, scrub, click any note to hear it, and keep notes on what you noticed in your own browser. Press Play to load the piano; nothing sounds until you do.

## How we made it

Marlon asked on October 15, 2026 for a non-kitschy interactive version of the étude to help him understand it, and said his own "study" meant repeated investigation through many experimental representations. The app was built that day in three commits, authored as mkuzmick, in a private Learning Lab repo; the repo does not record which tool or model wrote it. A Python script reads the ASAP dataset's MusicXML score, takes bars 1–8 with staff, pitch and duration, checks that every bar is complete and that every right-hand note in the excerpt is a black key, and writes the note list as JSON. It also downloaded the thirty exact-pitch piano samples the passage needs, so playback uses recordings and no synthesized fallback. Playback is steady-tempo: no expressive timing, dynamics or pedal.

What went wrong, from the repo's handoff and commits: an SVG `<title>` caused a hydration mismatch that had to be fixed; and the first version's keyboard (C2–C7) and pitch map cut off the top of the passage, which reaches D♭7, so a second commit widened both to C2–C8. In porting it here, the observations box's placeholder showed a literal `\n` instead of line breaks (a JSX string-attribute quirk in the original) and was corrected; the original's landing-page header and facts strip were left out, and its cream-and-rust palette was redrawn for this site's dark one. Whether the playback sounds right was left in the handoff for Marlon to judge by ear.

## Source

- Code: `ll-26-27/black-key-etude` (private repo, October 15, 2026).
- Score: the [ASAP dataset](https://github.com/fosfrancesco/asap-dataset/tree/master/Chopin/Etudes_op_10/5) MusicXML for Op. 10 No. 5 (Francesco Foscarin, Andrew McLeod, Philippe Rigaux, Florent Jacquemard and Masahiro Sakai, 2020; its metadata names MuseScore score 116128 as the upstream transcription). The source and the derived note data are licensed [CC BY-NC-SA 4.0](/examples/black-key-etude/SCORE-LICENSE.md). [Download the MusicXML](/examples/black-key-etude/source.musicxml).
- Piano samples: [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) by Nicholaus P. Brosowsky, samples under CC BY 3.0 ([licence and attribution](/examples/black-key-etude/PIANO-LICENSE.md)). Thirty samples, served from this site.
- Background on the étude: [Henle's account](https://www.henle.de/en/Etude-G-flat-major-op.-10-no.-5/HN-1323).
