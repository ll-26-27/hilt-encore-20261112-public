---
name: reflect-aloud
description: Turn a spoken reflection (a voice memo about a class, a project, a meeting, a week, or answers to reflection questions) into a short written note, transcribed through HUIT, with the person's own words quoted and kept separate from the agent's summary. Use when someone says "I recorded my thoughts", "transcribe my reflection", "I want to think out loud", or follows up the class-reflection skill by answering aloud.
---

# Reflect aloud

Many people think better talking than typing. This skill takes a few minutes of someone talking about their work and gives back a short note they'll keep: their best sentences, verbatim, with timestamps; a draft summary they can correct; the threads they left open; and the next step they named. The note is theirs. Your job is to listen carefully and stay out of the way.

## 1. Get the recording

If they don't have one yet, suggest two to five minutes on their phone's voice memo app or QuickTime Player (File → New Audio Recording), about one thing. Prompts that help: "What happened, what surprised you, what will you do differently?" or the questions from the `class-reflection` skill. Save it in `_media/reflections/<YYYYMMDD>-<short-topic>/` (`_media/` is gitignored, so the audio and transcript stay on their computer).

## 2. Settle the route

- **Transcription always goes through HUIT** (`ll-utilities/huit/transcribe.mjs`; HUIT documents its OpenAI Direct gateway as approved for confidential data, see `_context/huit/`). Never send a recording to an external tool.
- **Can you, Claude Code, read the transcript?** Yes, if it's made up, or their own reflection with nothing confidential in it (no students or colleagues named or described, no grades, no private matters), or if their Claude account is approved for that level (`_context/data-security/`). If they aren't sure, use the **HUIT-only route**: you run the scripts, never open the transcript or the note, and they read the result.

## 3. Transcribe

```
node ll-utilities/huit/transcribe.mjs _media/reflections/<folder>/memo.m4a --timestamps --language en
```

It writes `memo.transcript.md` (with `[mm:ss]` times) and `memo.transcript.json` beside the audio. Over 25 MB is refused; shrink with `ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`. `--prompt "names, terms"` helps with unusual spellings.

## 4. Write the note

The note's shape is in [`prompts/note.md`](prompts/note.md): *In their words* (four to eight verbatim quotes with timestamps), *What I heard (draft)*, *Threads*, *One next step*.

**Open route:** read the transcript, follow `prompts/note.md` yourself, and save `reflection.md` in the same folder. Check every quote against the transcript before showing it: a quote must be their exact words.

**HUIT-only route:**

```
node ll-utilities/huit/claude.mjs \
  --system "$(cat .agents/skills/reflect-aloud/prompts/note.md)" \
  --file _media/reflections/<folder>/memo.transcript.md \
  --max-tokens 2000 \
  --out _media/reflections/<folder>/reflection.md \
  "Write the reflection note."
```

Give them the path; don't print the note into the chat.

## 5. After

- Ask them to correct *What I heard*; their corrections win.
- Offer to file the note (not the audio or the transcript) in their context folder, for example `_context/<name>/reflections/`, only if it holds nothing confidential. A folder of these over a term is a record of their teaching they can reread, and good context for an agent helping them next term.
- If they recorded answers to `class-reflection` questions, put the note beside that `questions.md`.

## Don't

- Don't add advice, praise, or interpretation they didn't ask for.
- Don't put words in quotes that they didn't say.
- Don't quote or name other people; refer to them by role.
- Don't move a recording or transcript out of `_media/` or into a git commit.
