---
title: "A custom app for one session"
description: "Build a small web tool for a single class activity (a capture page for one station, a timer with prompts, a gallery of today's work), the morning of, because now it costs an hour, not a semester."
mode: build-with-claude-code
tags: ["tools", "making", "capture", "course design"]
status: draft
---

Build a small web tool for a single class activity (a capture page for one station, a timer with prompts, a gallery of today's work), the morning of, because now it costs an hour, not a semester.

## How it runs

The day before or the morning of class, list what would make the activity smoother: where photos should go, what prompt each station shows, what the room sees on the wall. Build one page for each need, test it on a phone, put the link on the board. After class, keep the repository as the record of the session.

## With Claude

In Claude Code: "Make a Next.js app with a /capture page where a student picks one of these four stations, takes a photo, and it saves to _media/<station>/ with a timestamp; and a /live page that shows the latest twenty photos in a grid, refreshing every ten seconds." Run it locally on the classroom laptop; no deployment needed. The short version (GH): Claude Code in the course's repo: "Today students will … Build a page that …; test it with a fake input; tell me what you tested." Commit it so students can clone it.

## Why it works

Small quality-of-life tools that were never worth the coding effort for one class now are, and they let the activity run on the students' attention rather than on logistics.

## Time and materials

One to two hours to build; a laptop on the room's network; phones.

## Variations

A practice timer that plays the next prompt; a sign-up sheet for presentation order; a voting page for a critique.
