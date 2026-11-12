---
title: Dickens's places
order: 25
index: "Every place named in eight Dickens novels, found passage by passage by a language model, located with a gazetteer, and drawn on a map after Franco Moretti. Click a circle to read the passages that name it; the places that could not be located are listed, with their passages, rather than dropped."
source: https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/maps/01-dickens-places-map
image: "/examples/dickens-places/card.jpg"
---

## What this is

Franco Moretti's *Atlas of the European Novel, 1800–1900* (Verso, 1998) maps where nineteenth-century novels take place. This asks his simplest question of eight Dickens novels, from *Oliver Twist* (1838) to *Our Mutual Friend* (1865): which places do they name, and where are those places? The answer is 3,644 mentions of 1,116 places across 1,290 passages. 586 places are on the map, 496 located by OpenStreetMap's gazetteer and 90 estimated by a model and drawn dashed. Filter by novel, count only the scenes set in a place, jump to London, the City, Britain or abroad, and click any circle to read every passage that names it. The other 530 places, among them Chesney Wold, Bleak House and Satis House, are not drawn. The map lists the 300 most-mentioned of them; the full list of 530, with all 939 of their passages, is below it.

## How we made it

Built in a morning on November 3, 2026, as one of six worked examples for ENGLISH 298AI's session on vibe-coding. Most of the chain is plain scripts, each leaving a file behind: fetch the novels from Project Gutenberg unchanged, cut every chapter into chunks of about 2,000 words, check the model's quotations against the text, merge spellings of the same place, count, look each place up in Nominatim at one request a second, and build the page. Two steps are model judgment. For each of the 1,290 chunks, `anthropic/claude-haiku-5.5` returned every place named, as JSON fixed by a schema: the name as written, a type, whether the scene is set there or the place is only mentioned, and a quotation of no more than 25 words. For places the gazetteer could not find and that were mentioned at least twice, `anthropic/claude-sonnet-5.5` gave a location in Dickens's day with a confidence and a reason; only high and medium answers are drawn, dashed and labelled "model estimate." The calls cost about $1.55, logged line by line. A design brief, written before the map, asked for settings versus passing mentions, model estimates drawn differently, and unlocated places listed rather than dropped.

The checks: a crude independent pattern found 531 names ending in Street, Square, Court, Inn and so on, and the model had listed 500 of them (94%); most misses were law courts, which the prompt said to skip, but "Marshalsea Gate" and "Stepney Fields" were real misses. Recall for one-word places such as towns was not measured. 3,606 of the 3,644 quotations were found word for word in their passage.

What went wrong, from the README and the project's essay:

- **Modern namesakes.** The gazetteer knows today's map. "Custom House" passed the name check and landed on the modern district by the Royal Docks, about 7.7 km east of the building on Lower Thames Street the novels mean. "Norwood" went to Upper Norwood, more precise than the novel.
- **Demolished London.** Newgate, the King's Bench and Barnard's Inn mostly failed in the gazetteer; the model step rescued the best known, but Jacob's Island, the Fleet Prison and Hungerford Stairs stayed unresolved. The map under-represents the London that no longer exists, much of it the poorer London Dickens wrote about.
- **Merging by name.** Places were merged on the part of the name before the first comma. That joins London with "Lunnun" and "Londres," which is right, and also joins Plymouth's Custom House to London's, and two Theatres Royal (Covent Garden and a playbill in *Dombey and Son*), which then got placed at a third, Drury Lane. The opposite also happened: Miss Havisham's house is four rows (Satis House, "Miss Havisham's house," the brewery, her room), only one of them on the map.
- **Phantom places from the prompt's own example.** The prompt used "as much mud as … up Holborn Hill" to illustrate a figurative mention. Holborn Hill came back with 10 mentions in six novels; by the essay's count seven are phantoms, six with empty quotations and notes such as "Not present in this passage; remove." Empty quotations also passed the quotation check, because every text contains the empty string, so 3,606 verified is 3,599 without them.
- **Small category errors.** The ships *John of Sunderland* and *Betsy of Yarmouth* were counted as mentions of the towns. Blunderstone was typed fictional though it is usually identified with Blundeston in Suffolk. Brig Place is a street to one model and "Dickens's invention" to the other.
- **Judgment calls.** Setting versus mention, and in London or not, are the small model's readings, made 3,644 times. A quotation can be real without naming the place: one passage counted for the Marshalsea is "'How dare you!' he said to the man, and feebly burst into tears."
- **Fictional places are not drawn.** The 131 places typed fictional were never looked up, including the most mentioned places not on the map.

The page here is the project's own `outputs/index.html`, copied unchanged and shown in a frame. It loads Leaflet 1.9.4 from unpkg (version-pinned, with integrity hashes) and Esri's base map tiles, so it needs an internet connection; the places and passages are inside the page. The list of all 530 unlocated places and their passages below the map was added for this site, from the same data: the map shows only the first 300, and the project keeps their passages in `operations/data/03-mentions.jsonl`, not in the page.

## Source

- The project, with its README, prompts, scripts, CSVs and cost log: https://github.com/ll-26-27/eng298ai-20261103/tree/main/01-use-cases/maps/01-dickens-places-map
- The essay, with illustrations: https://github.com/ll-26-27/eng298ai-20261103/blob/main/01-use-cases/maps/01-dickens-places-map/outputs/essay/essay.md
- The texts: Project Gutenberg ebooks #730, #46, #821, #766, #1023, #963, #1400 and #883. Map data © OpenStreetMap contributors; base map tiles © Esri.
- The seminar's repository: https://github.com/ll-26-27/eng298ai-20261103
