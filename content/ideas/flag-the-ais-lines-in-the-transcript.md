---
title: "Flag the AI's lines in the transcript"
description: "Any question or fact that came from an AI and was used in a conversation is marked as AI-sourced in the transcript, so everyone can see afterward what the machine contributed."
mode: build-with-claude-code
tags: ["oral", "reflection", "attribution", "transparency"]
status: draft
---

Any question or fact that came from an AI and was used in a conversation is marked as AI-sourced in the transcript, so everyone can see afterward what the machine contributed.

## How it runs

During an AI-assisted interview or discussion, a suggestion that is read aloud (or marked "asked" by the producer) is flagged in the transcript with a badge. Afterward, the class counts the flagged lines and compares them with the organic ones: which led somewhere, which fell flat.

## With Claude

Ask Claude Code: "When a new transcript line arrives, compare it with the suggestions shown so far; if most of a suggestion's words (ignoring short ones) appear in the line, mark the line as AI-sourced and remove the suggestion from the list. Add 'mark AI' and 'mark organic' on hover for correcting it by hand. Count both in the Markdown download's frontmatter."

## Why it works

It makes the division of labor between person and model visible and discussable, which is what students are asked to account for when they use AI.

## Time and materials

A few minutes to add to an existing tool with Claude Code; none extra in class.

## Variations

Writing workshops (mark sentences an AI suggested in a draft); group discussions with an AI note-taker; a lighter version is a highlighter on a printed transcript.
