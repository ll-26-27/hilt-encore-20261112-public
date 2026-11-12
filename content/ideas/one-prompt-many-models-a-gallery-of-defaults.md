---
title: "One prompt, many models: a gallery of defaults"
description: "Send the same short prompt to a dozen image or text models and show all the results on one page, so the class can see what models default to."
mode: build-with-claude-code
tags: ["defaults", "models", "comparison", "critique", "media"]
status: draft
---

Send the same short prompt to a dozen image or text models and show all the results on one page, so the class can see what models default to.

## How it runs

Pick 4–6 short prompts close to the course's subject ("an artist," "a scientist," "main character of a story"). Run each across 10–20 models. Show the gallery grouped by prompt, then by model. Students describe the defaults without rating the images: lighting, age, setting, who is shown.

## With Claude

Ask Claude Code: "Write `batch.mjs` that sends each prompt in `prompts.txt` to each model in `models.json` through OpenRouter, saves the images with their request and response JSON, and builds `index.html`, a gallery I can group by prompt or by model, with a lightbox." Publish the folder on GitHub Pages so students can browse it before class.

## Why it works

One image tells you little; twenty side by side show the average a model reaches for, and students learn to read output for its defaults rather than its polish.

## Time and materials

20 minutes in class; under a dollar in API costs for ~70 images. API key; a GitHub account for Pages.

## Variations

Text models on a factual question; "describe a good teacher"; the same prompt in two languages ("an author" vs. "a Russian author").
