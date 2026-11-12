---
title: Questions from a two-minute debrief
made: 2026-11-12
by: the Learning Lab (an example card)
---

Talk for two minutes right after class, and get back eight to twelve reflection questions grounded in what you said and in your lesson plan.

## Goal

Think about a class while it's fresh, without having to write.

## Ingredients

- A voice memo of you talking about the class (m4a, under 25 MB). Your own debrief, with no students named.
- Your lesson plan as a Markdown or text file (optional), and any reading notes (optional).
- Keys: `HUIT_OPENAI_API_KEY` (transcription) and `HUIT_BEDROCK_API_KEY` (Claude) in `.env`.
- Data route: HUIT only. Nothing goes to an external tool.
- Cost: one transcription and one text call. `node ll-utilities/huit/quota.mjs` shows what's left.

## Steps

1. Save the memo as `_media/reflections/<date>-<class>/debrief.m4a`.
2. Transcribe it:
   ```
   node ll-utilities/huit/transcribe.mjs _media/reflections/<date>-<class>/debrief.m4a --timestamps --language en
   ```
3. Ask Claude Code: "Use the class-reflection skill on that transcript and my lesson plan."
4. Read `questions.md`. Answer two of them aloud, then use the reflect-aloud skill on that memo.

## What went wrong, and the fix

- The first test clip was an `.aiff` from the Mac's `say` command; convert it with `afconvert -f m4af -d aac in.aiff out.m4a` first.
- Only `whisper-1` transcribes through HUIT's gateway; the newer transcription models answer HTTP 400 there.

## Try next

- Record the answers to the questions, too, and keep a term's worth of notes in your context folder.
- Add a reading as a PDF and use `huit/gemini.mjs`, which reads PDFs.
