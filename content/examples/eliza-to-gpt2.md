---
title: Who is speaking?
order: 1
index: "Talk to ELIZA and inspect the rule behind each reply, then compare saved GPT-2 output with and without an assistant prompt. The example makes a familiar chatbot voice strange again: what comes from a script, what comes from prediction, and what do we supply as readers?"
source: https://github.com/ll-26-27/eng298ai-20261020
demo: https://eng298ai-20261020.vercel.app/
image: ""
---

## What this is

A small public site for a graduate seminar in English, ENG 298AI, the AI Humanities Lab. You talk to ELIZA, Weizenbaum's DOCTOR script from 1966, running in your browser, and it shows you the rule behind each reply. Then you run GPT-2, a 2019 model, twice: raw, and with the 2021 "helpful, honest, and harmless" assistant prompt in front of your question, so you can watch a text predictor turn into someone you're talking to. Then a guide to building a bot of your own in ChatGPT, Gemini, or Claude, and a short history of the chatbot. The question for a humanities class: who is speaking?

## How we made it

The pieces were built over two days by several agents working in parallel, directed by one orchestrating agent, each from a short brief; ELIZA's asked for the DOCTOR script as Weizenbaum's paper describes it: keywords with ranks, decomposition and reassembly rules, pronoun reflection, a memory stack. The site was put together the morning of class, October 20, and redesigned more than once before 12:45. What went wrong: GPT-2 can only read 1,024 tokens, and the original assistant prompt is longer than that, so the page says it can only fit the last few exchanges; on a computer without a GPU, reading the prompt took fifteen minutes in testing; and a layout check found a column spilling under its neighbor. Afterward we kept the full class site on a branch and cut the main site down to what works for anyone.

## Source

- The site: https://eng298ai-20261020.vercel.app/
- The repository: https://github.com/ll-26-27/eng298ai-20261020
- The full class site, as taught: https://github.com/ll-26-27/eng298ai-20261020/tree/full-site
