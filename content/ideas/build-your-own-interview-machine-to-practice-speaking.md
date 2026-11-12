---
title: "Build your own interview machine to practice speaking"
description: "Students build, with Claude Code, a small app that records a two-person interview, transcribes it as they talk, and suggests follow-up questions, then use it to practice interviewing and being interviewed."
mode: build-with-claude-code
tags: ["oral", "interviews", "practice", "making", "tools", "podcast"]
status: draft
---

Students build, with Claude Code, a small app that records a two-person interview, transcribes it as they talk, and suggests follow-up questions, then use it to practice interviewing and being interviewed.

## How it runs

In a single session, each student (or pair) asks Claude Code for a local web app that records an interview, cuts it into utterances at each pause, transcribes each one as it ends, and shows a running transcript labeled Host and Guest. Then the practice loop: test it on each other for five minutes; change one thing about the tool (the pause length, the labels, a word count per speaker); then hold a ten-minute interview about one's own work and keep the transcript. Later rounds add a feature of the student's choosing: follow-ups only when the host highlights a line, a flag on every AI-suggested question, a timer, a beat sheet at the end.

## With Claude

Prompt Claude Code with: "Make a Next.js page that records from my microphone, cuts the audio into utterances at each pause of about 0.8 seconds, sends each utterance to a speech-to-text API as it ends, and shows a running transcript labeled Host and Guest. Keep the API key on the server. Add a Download as Markdown button." With a two-input audio interface: "Input 1 is the host, input 2 the guest; only count the louder microphone as speaking" (so one voice bleeding into the other mic isn't transcribed twice). Expect a first working version in about an hour; the features are where the learning is.

## Why it works

Building the tool makes students decide what a good interview needs (listening, follow-ups, who speaks when, where AI should and shouldn't speak), and using it gives them repeated, low-stakes practice speaking with a record they can review.

## Time and materials

One to two hours to build; a laptop, two microphones and a two-input audio interface (or one mic and a simulated second speaker); an API key for transcription.

## Variations

A text-only version that works from a pasted transcript; a version for language learners; a version for job-interview or oral-exam practice; one class tool that every student remixes.
