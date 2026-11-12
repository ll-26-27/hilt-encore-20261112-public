---
title: "Poetry Gem: dress the agent"
order: 23
index: "A paper doll for building a custom poetry bot: flip the head (instructions), the bodice (knowledge) and the legs (how the knowledge reaches the model), then read everything the model was sent."
source: ""
image: "/examples/poetry-gem/card.jpg"
---

## What this is

A classroom simulator for custom GPTs and Gemini Gems, made for ENG 298AI, the AI Humanities Lab, on October 19–20, 2026. A custom bot is three choices. **Instructions**: a system prompt asking for a sonnet, a sequence of three haiku, or a ghazal. **Knowledge**: a context pack from the course readings: Plato's *Phaedrus* (Jowett), Shelley's *Frankenstein* (1818 text), Confucius's *Analects* (Annping Chin's Penguin translation), or nothing. Each pack comes at four sizes, from a hand-written voice prompt up to the whole book with its editor's apparatus. **Delivery**: paste the whole pack into the system prompt, attach the passages a keyword search finds for your message, or give the model a search tool and let it decide what to look up.

The app's atelier draws the bot as a paper doll cut from Midjourney costume plates, and each choice flips one fold: head, bodice, legs. Under each reply, "What the model saw" lays out the single input the model received, in order. The bar above shows that input against the context window, beside the size of the pack being searched.

Here the doll, the meter and "What the model saw" run in your browser. The message is fixed: "Write about learning to read." Each combination has one saved reply. The meter covers all four pack sizes. The replies were written for one size, the assigned reading: *Phaedrus* from 257c to the end, *Frankenstein* chapters 10–15, and the sayings of *Analects* Books 1–4. The fourth pair of legs, meaning-based retrieval, is left out: it needed a live embedding call for each message.

## How we made it

The app was built on October 19, 2026 and reworked the morning of class, October 20: the packs moved from poets to the course readings, the context bars and the whole-input view came in, and the bodices were recast in the same order. It is a Next.js app. Calls go through the Anthropic SDK, to Claude Opus 5 by default, directly or through OpenRouter, with the system prompt cached. A Python script builds the packs from the course readings in Markdown. Keyword search is plain BM25 with no stemming. The nine Midjourney plates are Madeleine's; a script cut each at the neck and the hip and pinned it to one skeleton, so any head fits any torso and any legs. Before the plates were chosen, the same costume brief went to other image models through OpenRouter (a survey of 36). Those sheets were kept locally and are not shown here.

For this page the app's own code was run again, with no model: the prompt files, the pack builder's output, the chunking, the BM25 search and the assembly in its chat route, copied into a script and checked against the route for every combination. That produced the exact system prompts, the retrieved passages and the tool results. The tool calls were written to fit: "Theuth letters memory" for *Phaedrus*, "learned to read books" for *Frankenstein*, "learning" for the *Analects*. The search results are the real ones. Then Claude (Claude Code, Opus 5.5) wrote the 30 replies on November 12, 2026, one for each of 27 combinations plus a baseline for each form with no pack, from those inputs. The model's reasoning, token counts and cost were not recorded. Neither were the students' messages and the replies from class.

What went wrong, or behaved literally:

- Keyword search treats "about" as a content word. On "Write about learning to read," it brought back a *Frankenstein* passage about a girl carrying a pail of milk ("in about a quarter of an hour"), and *Analects* 3.22–3.24, where the Master speaks "about music."
- In *Phaedrus*, the same search matched "read" and found Phaedrus reading Lysias's speech aloud, and the physician who "has read something in a book." It never reached Theuth. The model's own search for "Theuth" found him first.
- The atelier page opened on a bodice called "donne," left over from the earlier poet packs. The code fell back to the first bodice.
- In the *Analects*, the saying most about learning, 2.15, says "learn," not "learning," so neither the keyword search nor the model's search for "learning" reached it. Only the whole-pack replies had it.
- The app's "What the model saw" view cut long parts at 1,600 characters. Here every part is shown whole, folded until opened; the packs load when you open them. All four *Analects* sizes are saved here as the app sends them, up to the Penguin text with commentary (772,680 characters).

## Source

- The app: `poetry-gem` in the course's private repository (eng-298ai-mw), commits of October 19–20, 2026. It is not public.
- The plates: nine Midjourney images, cut by the app's `scripts/cut-plates.py`.
- The texts: Plato, *Phaedrus*, translated by Benjamin Jowett; Mary Shelley, *Frankenstein; or, The Modern Prometheus* (1818 text). Confucius, *The Analects*, translated with commentary by Annping Chin (Penguin Classics, 2014).
