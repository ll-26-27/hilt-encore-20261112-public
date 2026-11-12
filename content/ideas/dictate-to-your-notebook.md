---
title: "Dictate to your notebook"
description: "Students say a note out loud; one model writes it down word for word, a second turns it into a titled note in their own words, with their to-dos as a checklist, saved into their notebook folder."
mode: build-with-claude-code
tags: ["notebook", "reflection", "voice", "context"]
status: draft
---

Students say a note out loud; one model writes it down word for word, a second turns it into a titled note in their own words, with their to-dos as a checklist, saved into their notebook folder.

## How it runs

After a reading, a studio session, or a walk, students record a two-minute voice note. They compare the raw transcript with the cleaned note and correct anything the cleanup changed. The notes accumulate in a folder their AI assistant can read later.

## With Claude

Ask Claude Code: "Make a page with a Record button. Convert the recording to 16 kHz mono WAV in the browser, send it to an audio model with 'Transcribe this exactly as spoken, keep every word including filler', then send the transcript to a text model with 'Turn this into a clean Markdown note; keep their meaning, voice, and words; add nothing; collect to-dos as a task list.' Save it as notebook/<date>-<title>.md." In Claude Desktop, the manual version is pasting a transcript with the second prompt.

## Why it works

Speaking is faster than typing and catches thoughts that would be lost; keeping the raw transcript beside the cleaned note keeps the line between what the student said and what the model added.

## Time and materials

About an hour to build; ten seconds of processing for a one-minute note; a microphone and a model key.

## Variations

Field notes in anthropology or ecology; rehearsal notes in theater; reflection after clinical rotations.
