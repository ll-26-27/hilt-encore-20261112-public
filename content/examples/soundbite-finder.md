---
title: Soundbite finder
order: 13
index: After students recorded podcasts about their projects, we used a soundbite finder to locate moments worth returning to. An extension of our “stealth oral exams,” this workflow turns long conversations into candidate excerpts, with the transcript and original timecodes available for a person to review.
source: ""
image: "/examples/soundbite-finder/podcast-reflection.png"
---

## What this is

A podcast can also be an oral exam in disguise: students explain what they made, describe their decisions, and respond to questions in conversation. We used the soundbite finder from `mk-video-editing` after those student podcasts were recorded to find good excerpts from the longer sessions.

The interface keeps the recording and its transcript beside proposed soundbites. Each candidate has a title, a rating, an explanation, and timecodes that lead back to the original. The screenshots show students reflecting on the podcast format, learning from peers, and the parts of creative work that remain human.

These are still images of the interface, shared here as an example of the workflow. The student recordings are not embedded, and the playback and selection controls pictured below are not interactive.

## How we made it

**Inputs:** recorded student podcasts, their transcripts, and an editorial purpose—what we want the excerpts to help us see or communicate.

**Operations:** transcribe the recording with timing information, ask a model to propose relevant passages, and attach titles, reasons, and ratings to the selections. The editor can return to each moment in the original recording to check context and decide whether it belongs in the final selection. A model’s rating is an editorial suggestion, not a grade for a student.

**Outputs:** a reviewable set of candidate soundbites linked to the source recording. The broader editing workflow can render selected clips or assemble them for an editing timeline; this example presents only the two supplied screenshots.

The useful shift is from scrubbing through an entire recording to reviewing a set of possible moments. People still decide whether a passage is representative, complete enough to stand alone, and appropriate for its intended use.

## Source

Built with `mk-video-editing`. Screenshots supplied from the student-podcast review interface; no live recordings or downloadable clips are included here.
