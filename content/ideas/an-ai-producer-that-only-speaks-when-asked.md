---
title: "An AI producer that only speaks when asked"
description: "During a live interview, a third person (the producer) can highlight any passage of the running transcript and ask an AI for two follow-up questions about it; the AI never interrupts on its own."
mode: mixed
tags: ["oral", "interview", "agents", "feedback", "assessment"]
status: draft
---

During a live interview, a third person (the producer) can highlight any passage of the running transcript and ask an AI for two follow-up questions about it; the AI never interrupts on its own.

## How it runs

Three roles: host, guest, producer. The producer reads the live transcript; when something deserves a follow-up, they highlight it, type a one-line note ("get at how they knew"), and get two questions. They choose one and pass it to the host, or don't. Rotate roles every ten minutes.

## With Claude

Add to an interview tool that transcribes as it goes: "When I select text in the transcript, show a box with a one-line note and a Question button. Send the pre-interview notes, the transcript so far, the highlighted passage, and the note to Claude with this system prompt [paste], and show two questions, one per line. Show the full request on the page before it's sent." Without building anything: paste the transcript so far into Claude Desktop and ask for two follow-ups about one quoted passage.

## Why it works

The person stays in charge of the conversation; the AI supplies options, not direction. The producer learns to listen for the moment worth following, which is the hard part of interviewing.

## Time and materials

30 minutes of class per rotation of three; a laptop on the producer's side; a model key (a fraction of a cent per question).

## Variations

Oral exams (the examiner is the producer); thesis defenses; peer critique, where the producer highlights a claim and asks for a question that tests it.
