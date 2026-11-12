---
name: class-reflection
description: Help a teacher reflect on a class they just taught. Transcribe their spoken debrief (or a class recording they're allowed to use) through HUIT's transcription, then write grounded reflection questions from the transcript plus any notes, lesson plan, or research they provide. Use when someone says "I just taught", "help me reflect on today's class", "debrief my class", or hands over a recording of a class or of themselves talking about it.
---

# Class reflection

Right after a class is the best time to think about it and the worst time to write. This skill lets the teacher talk instead: they record a few minutes about what happened, HUIT transcribes it, and you turn the transcript, plus whatever notes or research they bring, into questions worth answering. The questions are the product. You don't grade the class or give advice unless they ask.

## 1. What they have, and where it may go

Ask what they have (skip what they've already said):

- **A recording.** Best is their own debrief: two to five minutes, talking about the class, made on their phone or with QuickTime right after it. A recording **of the class itself** carries students' voices and words: that's confidential student information. Use it only if they're allowed to (students were told, their School's policy permits it), and say so plainly.
- **Notes, a lesson plan, slides, readings, or research** they want to think with. Optional.

Then settle the route before opening anything. Say it in your own words:

- **Transcription always goes through HUIT** (`ll-utilities/huit/transcribe.mjs`, OpenAI Direct, which HUIT documents as approved for confidential data; see `_context/huit/`). Never send a class recording to an external tool.
- **Can you, Claude Code, read the transcript?** Only if it holds nothing confidential (their own debrief that doesn't name or describe students, or made-up material), or if their Claude account is approved for that level (see `_context/data-security/`; if they don't know, assume it isn't). Otherwise use the **HUIT-only route** below: you run the scripts, never open the transcript or the questions file yourself, and they read the results.

Files go in `_media/reflections/<YYYYMMDD>-<short-class-name>/` (`_media/` is gitignored, so recordings and transcripts stay on their computer). Copy their notes and research there too, or note their paths.

## 2. Transcribe

```
node ll-utilities/huit/transcribe.mjs _media/reflections/<folder>/debrief.m4a --timestamps --language en
```

It writes `debrief.transcript.md` (with `[mm:ss]` times) and `debrief.transcript.json` beside the audio. Files over 25 MB are refused; shrink first with `ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`. Add `--prompt "course names, terms, spellings"` if the recording uses words a transcriber would miss. Run `--dry-run` first if they want to see what is sent.

## 3. Questions

The instructions for the questions are in [`prompts/questions.md`](prompts/questions.md): grounded in the transcript and their materials, eight to twelve, grouped under *What happened*, *What students were doing*, *Your moves*, *Against your notes and research*, *Next time*, with no students named or quoted.

**Open route** (you may read everything): read the transcript and their materials, follow `prompts/questions.md` yourself, and write `questions.md` in the folder. Show it to them.

**HUIT-only route** (you don't read it): send it all to Claude on HUIT's Bedrock gateway:

```
node ll-utilities/huit/claude.mjs \
  --system "$(cat .agents/skills/class-reflection/prompts/questions.md)" \
  --file _media/reflections/<folder>/debrief.transcript.md \
  --file _media/reflections/<folder>/notes.md \
  --max-tokens 3000 \
  --out _media/reflections/<folder>/questions.md \
  "Write the reflection questions for this class."
```

`claude.mjs` takes text files (Markdown, plain text, CSV). For a PDF reading, use `ll-utilities/huit/gemini.mjs` with the same `--system`, `--file`, and `--out` options instead (it reads PDFs). Don't use a Fable model for confidential material (see `claude.mjs --help`). Then tell them the path and let them open it; don't print it into the chat.

## 4. After

- Offer one of: answering the questions aloud (record, then the `reflect-aloud` skill), turning one answer into a change to next class's plan, or saving the questions (not the transcript) in their context folder, if they hold nothing confidential.
- Say what each call was: one transcription, one text call. `node ll-utilities/huit/quota.mjs` shows what's left on their keys.

## Don't

- Don't evaluate the teaching unless they ask; ask questions.
- Don't invent what happened in class; if the transcript is thin, ask fewer questions.
- Don't name, describe, or quote individual students in anything you write.
- Don't move a transcript or recording out of `_media/` or into a git commit.
