---
title: Authorial Absence
order: 21
index: "Remove tarot cards from Calvino's deck to land on one of sixteen states and its text; a model strips the author out of it, then writes four continuations, and the one you spare becomes part of the text."
source: https://github.com/bok-learning-lab/a-project-on-calvino
image: /examples/authorial-absence/card.jpg
---

## What this is

In *The Castle of Crossed Destinies*, Calvino tells stories by laying out tarot cards. This app, built for the course *Calvino and Computation*, starts from four Rider–Waite–Smith cards: The Magician, Death, The Tower and The Star. The only thing you can do to a card is make it disappear, and it does not come back. The cards that remain form a four-bit number, one of sixteen states, and each state points to a text: Hildegard, Kafka, Sappho, Hamlet, Newton's Emerald Tablet, a 1940s report on the atomic bomb, and others. Then the "authorial absention" runs. A model marks about ten places where the author shows and rewrites each one so it could have been written by anyone, and you watch each passage highlighted, struck through and replaced. Next it offers four one-sentence continuations. You delete three of them, and the survivor is saved into the text in your browser, so the next visit to that state starts from the altered text. If you remove all four cards you reach the void: there is no text, so you supply an author and choose among four possible beginnings.

## How we made it

The original is a Vite and React app, committed in one piece on January 26, 2026 (commit `41d3b5d`, "Authorial Absence app with typewriter effect, continuations, and persistent text corruption"), in the course repository. Every step called OpenAI's `gpt-4o` directly from the browser with a key in a Vite environment variable. One call identified about ten passages (temperature 0.7), one call per passage revised it (0.8), one call wrote four continuations (0.9), and in the void one call wrote four beginnings (0.9). Who wrote the app and how long it took are not recorded beyond the commit.

The port was made in Claude Code (Opus 5.5) on November 12, 2026. No API key was used. Claude wrote every output itself, from the app's own system prompts, which a script copied verbatim out of the JSX. The user prompts were filled in exactly as the app's templates fill them. Each call is saved with its settings, both prompts and the output in [`calls.json`](/examples/authorial-absence/calls.json), and the page shows them under each run.

The set of possible runs is unbounded, so it had to be cut down. The visitor can reach all sixteen card states. After the absention, the app appends the surviving continuation to the base text, and the next absention on that state runs on the base text plus that sentence. Each new run brings four new possible sentences, so the tree never ends. The smallest version that still shows the text feeding on its own continuations has two rounds per text. Round one runs on the original. Round two has one run for each of the four first-round survivors. That makes five runs for each of the fifteen texts: 75 runs, 738 revised passages (42 to 51 per text, about ten per run), 300 continuations. After a second-round choice, the altered text is shown, and the page says that no further round was recorded. The void form takes free text, which cannot be prepared in advance. Here it offers instead a choice of the fifteen authors the app keeps on file, each with the app's own author context, and four beginnings were written for each author. That comes to 903 recorded calls: 75 identifications, 738 revisions, 75 sets of continuations and 15 sets of beginnings. Claude Code wrote the runs for twelve of the texts in four parallel sub-sessions, three texts each. A script checked every run: each marked passage had to match the text exactly and not overlap an earlier edit, and each continuation had to be 10 to 20 words, as the prompt asks. The pauses where the app waited for the API are simulated. The highlight, strike and rewrite timings are the original's.

What went wrong, as the repository shows it:

- The comments in `texts.js` name a High Priestess, a card that is not in the deck. They also disagree with the encoding: "State 8: Magician + Death" is, by the code, The Star alone. This page follows the code, as the app's screens do.
- `ChoicePage.jsx` holds a second continuation prompt for ordinary states, but no page links to it. The continuations actually come from `AbsentionPage.jsx`. The dead path was not ported.
- During the absention, each edit is drawn on the unedited text and vanishes before the next one. The edits only appear together at the end. The port keeps this.
- The corruption does not accumulate. Each saved continuation replaces the previous one, and the absention's rewrites are never saved into the text. The altered text is always the original plus the latest survivor.
- The commit message promises a typewriter effect, but the code swaps each revision in whole. This port types the revision in letter by letter.
- The API key was read in the browser, so any deployed build would have exposed it to anyone who opened the page.
- The app's README is the unedited Vite template, and no deployment address is recorded.
- The source texts' editions are not always named. The translators of the Hildegard, Satie, Cocteau, Kierkegaard and Beauvoir passages are not recorded, nor are the edition of *Hamlet*, the Newton transcription, and the printing of the bomb report.

Left out: the app's Memos page and its embedding map, which belong to a separate part of the project; and the Six Memos files. "Forget them", the button that clears the saved corruptions, was added for this page. The original kept them until the browser's storage was cleared.

## Source

- The app: https://github.com/bok-learning-lab/a-project-on-calvino/tree/main/apps/mw-project-002 (`src/pages/TarotPage.jsx`, `AbsentionPage.jsx`, `ChoicePage.jsx`, `VoidPage.jsx`, `FinalPage.jsx`, `src/data/texts.js`, `src/data/tarot.js`)
- Tarot images: the Rider–Waite–Smith deck drawn by Pamela Colman Smith (1909), public domain, from the app's `public/cards/`
- The fifteen texts, by card state, whole and unchanged from the app's `texts.js`. Credits are as the app records them; "not recorded" means the app does not name the translator or edition.
  1. The Magician: Hildegard of Bingen, *Scivias* (1151), Vision One; translator not recorded
  2. Death: Franz Kafka, "The Silence of the Sirens", translated by Willa and Edwin Muir
  3. Magician and Death: Sappho, Fragment 31, translated by Anne Carson
  4. The Tower: William Shakespeare, *Hamlet* II.2; edition not recorded
  5. Magician and Tower: Becky Chambers, *A Psalm for the Wild-Built* (2021), pp. 137–139
  6. Death and Tower: Brian Eno, *A Year with Swollen Appendices* (1996)
  7. Magician, Death and Tower: Erik Satie, performance markings from *Embryons desséchés*, *Croquis et agaceries d'un gros bonhomme en bois* (1913) and related piano works; translator not recorded
  8. The Star: Isaac Newton, translation of the Emerald Tablet, Keynes MS 28 (c. 1680s); transcription not recorded
  9. Magician and Star: Jean Cocteau, "The Secret of Blue", from *Tempest of Stars: Selected Poems* (Enitharmon Press, 1997); translator not recorded
  10. Death and Star: Søren Kierkegaard, letter to Jette (1847); translator not recorded
  11. Magician, Death and Star: Anthony Burgess, *A Clockwork Orange* (1962), opening
  12. Tower and Star: U.S. Atomic Energy Commission, *Medical Effects of the Atomic Bomb in Japan*; edition not recorded
  13. Magician, Tower and Star: Simone de Beauvoir, *The Second Sex* (1949), Conclusion; translator not recorded
  14. Death, Tower and Star: Hilary Mantel, *Bring Up the Bodies* (2012), opening
  15. All four cards: Kevin Holden, "Hyaline Plains"; publication details not recorded
- The recorded calls: [calls.json](/examples/authorial-absence/calls.json)
