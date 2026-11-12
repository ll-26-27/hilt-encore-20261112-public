---
title: "Your \"I Want\" song"
description: "Students write the \"I Want\" song of their own life, the musical-theater number where the character stops and sings what they want, by having an AI interview them first and write only when they say \"write it.\""
mode: perform-in-claude
tags: ["self-representation", "oral", "context", "songwriting", "defaults", "first-day"]
status: draft
---

Students write the "I Want" song of their own life, the musical-theater number where the character stops and sings what they want, by having an AI interview them first and write only when they say "write it."

## How it runs

(1) Pairs talk for five minutes each way, recorded on a phone. The interviewer asks where you come from (the place, the people, the thing you grew up around), where you are now, and what you want, then keeps asking for names, places, and objects. (2) Each student gets a transcript, or writes down eight to twelve specific lines while the talk is fresh. (3) They paste it into an AI with an interview prompt; the AI asks one question at a time, pushing on how where they come from leads to where they are and to what they want, and what is in the way. (4) When they say "write it," the AI writes a lyric from only what they built: verse one where I come from, verse two where I am now, the chorus what I want, the bridge what is in the way, with a repeating hook. (5) The student reads it aloud and marks every line "that could be anyone's," sends those back ("Replace them with something only I could sing"), and gets a revision. (6) Optionally a music model sings it in a chosen genre, or they make a cover image. They post the lyric with one line on what the model reached for that wasn't them.

## With Claude

In Claude Desktop, paste the prompt: "I'm writing an 'I Want' song about myself, in the musical-theatre sense… Before you write anything, help me build out the material… Interview me. Ask one question at a time, and keep asking for specifics: names, places, objects, moments… Do not write the song until I say 'write it.' When I do, use only what we have built here: real details, no invented backstory, no 'follow my dreams,' no 'find my way.'" Save it as a Claude Project instruction or a Claude Code skill so every student starts from the same interviewer. After "write it," ask Claude for a music-model prompt in a genre the student picks (a style line plus the lyric), and paste that into a song generator. In Claude Code, a student can keep `transcript.md`, `lyric-v1.md`, the flagged lines, and `lyric-v2.md` in one folder to show the revision.

## Why it works

The song only gets as particular as the answers ("The conversation is the context; without it, every model writes 'follow my dreams.'"), so students learn that specific context, not a cleverer prompt, is what makes output theirs. Marking the lines that could be anyone's trains them to hear the model's default in a form they know well.

## Time and materials

40 minutes in class. Phones for the pair talk; a chat account; optionally a music model and a transcription tool.

## Variations

Change the genre (country, hip-hop, a hymn, an aria) and compare what each genre pulls out of the same material. Write the "I Want" song of a historical figure, a character in a novel, a scientist before their discovery, or a city. Use it before a statement of purpose or a project proposal. Pair it with the origin-story comic: the comic says where you came from and what you can do; the song says where you are and where you want to go. Pairs with "Pair interviews as raw material" and "The AI as interviewer: it writes only when you say 'write it'" (this draft), and with pr.md's "Let AI misrepresent you".
