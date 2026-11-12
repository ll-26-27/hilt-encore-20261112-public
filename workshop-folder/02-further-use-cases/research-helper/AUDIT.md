# Source audit: research-helper

Imported from the team’s November 12 review in Marlon’s idealized-workshop edition (commit `04b0670`). The section below records that team’s checks, not a new source-paper audit performed during this import. Outputs are retained as examples; the flags have not been silently repaired.

## Applicability to this folder

All ten shared output files (the five HTML pages and five figure assets) match the audited upstream copies byte for byte. The audit’s `inputs/private-only/` refers to its source layout; this existing workshop keeps its inputs directly in `inputs/`. This import adds no paper PDFs and changes no generated summaries.

## What the source team checked


We read all four summaries against the full texts in `inputs/private-only/`, most closely 02 and 03.

What checked out:

- **02, Lost in the Middle.** The models (MPT-30B-Instruct, LongChat-13B (16K), GPT-3.5-Turbo and its 16K version, Claude-1.3 and its 100K version), the U-shaped curve, the drop of more than 20 points that falls below the closed-book score (56.1%) in the 20- and 30-document settings, Claude-1.3's near-perfect key-value retrieval, query-aware contextualization helping key-value retrieval but not multi-document QA, the MPT-30B base-model comparison, Llama-2 7B being only recency-biased while 13B and 70B show both biases, the ~1.5% (GPT-3.5-Turbo) and ~1% (Claude-1.3) gain from 20 to 50 retrieved documents, and GPT-4 on a 500-example subset: all as in the paper.
- **03, Context Length Alone Hurts.** The 13.9%–85% drops, Llama-3.1-8B reciting the evidence for 970 of 1,000 MMLU problems at 30k tokens while losing 24.2% accuracy, most of the drop within 7k tokens, the whitespace and attention-masking controls, closed models being more robust, Gemini improving 8.6% on GSM8K at 30K, "up to 31.2%" for Mistral (Table 4: 35.5 to 66.7 at 26,250 tokens), "up to 4%" for GPT-4o on RULER, and the stated limitations: all in the paper. (The paper itself names Claude-3.7-Sonnet in its text and labels the same row "Claude-3.5" in Table 2; the summary follows the text.)
- **01 and 14.** Page 01's 18 models, temperature 0, the >0.99 judge alignment, no effect of needle position, Claude's low hallucination rates, all models doing better on shuffled haystacks, the ~300 vs. ~113k-token LongMemEval prompts, and the limitations match the report. Page 14's numbers (Avg/Gap 85.9/13.9 for FILM-7B, 79.0/32.1 for GPT-4-Turbo, 47.3/56.2 for the Mistral backbone; the 1.1M/300K/150K/200K dataset split; ~300 GPU days; MMLU 59.3 to 59.2; LongBench average 39.9; NarrativeQA 23.5 to 26.9; the 10× RoPE base; the 10-gram contamination filter) match the paper.
- **The format.** Every page has the five sections, keeps the summary and the twist visually separate, and uses only inline CSS and system fonts, as the prompt asked. The twists mark their speculative steps as speculative and say where a paper does not reach Claude Code.

Flagged, not fixed; the outputs are left as they came back:

1. **Page 01 says "four controlled experiment families" and lists three.** The report's "four controlled experiments" are the four needle-in-a-haystack extensions (needle–question similarity, distractors, needle–haystack similarity, haystack structure); with LongMemEval and repeated words there are six.
2. **Page 01's first key finding, "across all experiments and all 18 models,"** overstates: the report says "not all 18 models are included in each experiment" (o3 and GPT-3.5 Turbo are left out of the repeated-words task, for example).
3. **Page 01 gives the report's address as `trychroma.com/research/context-rot`.** It is research.trychroma.com/context-rot, as the same page's header says.
4. **The hub says Article 01's figures "load remotely from research.trychroma.com."** They load from the local `assets/context-rot/`, as page 01 itself says.
5. **The hub's footer points to `operations-tools-commands/`,** a folder name from an earlier layout; the prompt is in `operations/`.
6. **Page 02 is dated 2023 in its header and cites "arXiv:2307.03172; TACL" with that year,** while the workshop's filename says 2024. The input is the arXiv v3 of November 2023; pick one version and cite its year.
7. **Page 14 says the paper "only evaluates FILM-7B, Mistral, LongAlign, InternLM2, and GPT-3.5/4-Turbo."** Its LongBench table also includes Yi-6B-200K and InternLM2-7B-LongWanjuan, among others.

None of these change what the twists conclude. The lesson for the room: the numbers held up well, and the mistakes are in the scaffolding around them (counts, addresses, captions), which is where a reader stops checking.
