---
title: The interview machine, with a context folder
order: 3
index: "Follow a scripted podcast interview alongside speaker transcripts and an AI producer’s notes. The invented guest’s project folder supplies sources, process logs, and questions to check, making it possible to see how context can support a conversation while keeping the human interviewer in charge."
source: https://github.com/tdm155ai/tdm155ai-week-8
image: ""
---

## What this is

In week 8 of our course, students interview each other about their projects, podcast style. The interview machine records two microphones, cuts the sound at each pause, and transcribes each speaker as they talk. A producer can ask an AI for a follow-up question, or to check a claim, but only when they ask. Here it's fed something new: the guest's context folder, a whole project as a folder an AI can read (sources, notes, process logs, prompts, and a folder marked "not for the podcast"). This is a simulation. The people are invented, and so is the project folder, but the folder is the one we give our students as a model.

## How we made it

The machine was written by Claude on the morning of class, October 28, in about six hours of asking for changes, and then a copy went to the students to remix. What went wrong: browsers will usually only give a web page two audio channels, so for more microphones the local server captures the interface itself; the microphones were set low and a fixed threshold missed most of the host, so each microphone now learns its own background level; and each person's voice bled into the other microphone and got transcribed twice, so only the louder microphone counts. Adding the AI producer broke the multi-microphone version for a while. The sample context folder came the next week, written for week 9 as a model of what a student's folder can hold. The simulated interview here is a script played back through the machine's interface; the AI producer's notes cite the files in that folder.

## Source

- The interview machine (TDM 155AI week 8): https://github.com/tdm155ai/tdm155ai-week-8
- The sample context folder (week 9; an invented student): https://github.com/tdm155ai/tdm155ai-week-9/tree/main/sample-context-repo
