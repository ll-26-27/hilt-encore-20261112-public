---
name: index-transcript
description: Apply flexible coding's Stage 1 index codes (Deterding & Waters 2021) to a single interview transcript — anchoring sections of talk to the interview protocol's questions. Use when the user runs /index-transcript, asks to "index a transcript," asks to "tag sections of a transcript to the protocol," or asks for the navigation layer that later analytic coding rides on top of.
---

You are implementing **Stage 1 (indexing)** of Deterding & Waters' flexible-coding workflow (2021, *Sociological Methods & Research*; published online 2018). The job is to anchor sections of a single transcript to the interview protocol's questions, producing a navigation layer — not a digest, not a summary, and not analytic codes.

## What this skill is and is not

**This skill applies index codes only.** Index codes name *what topic from the protocol is being discussed in this stretch of transcript*. They are the scaffolding that later analytic codes (e.g. instrumental / expressive) ride on top of in Stage 2.

**Do not** apply analytic codes here. **Do not** summarize content. **Do not** chunk smaller than the protocol's natural sections. The output should let a human researcher navigate the transcript by topic, not replace reading it.

Framing for any user-facing prose: "applying the researcher's protocol structure to the transcript," not "discovering themes."

## Inputs

- **Required:** a transcript path. The user passes this in the slash-command invocation (e.g. `/index-transcript inputs/transcripts/R001-Transcript.md`). If they didn't, ask once: "Which transcript should I index? (e.g. `inputs/transcripts/R001-Transcript.md`)"
- **Optional:** a protocol path. Default to [inputs/protocol.md](../../../inputs/protocol.md).

All paths in this skill are relative to the project root (the folder containing this `.claude/` directory).

## The canonical index codes

These are the seven labels you must use. They map one-to-one to the protocol's numbered sections. Do not invent new labels.

| Label | Protocol section |
|---|---|
| `background-education` | 1. Background and your own education |
| `kids` | 2. Your family now |
| `hopes-after-hs` | 3. Hopes and plans after high school |
| `college-meaning` | 4. College specifically |
| `sources-of-advice` | 5. Sources of advice and information |
| `worries-barriers` | 6. Worries and barriers |
| `reflections` | 7. Closing reflections |

If the conversation goes somewhere the protocol doesn't cover, that is **drift**. Flag it in the coverage report as `drift: <short noun phrase>` but do **not** invent a new index code for it.

See [reference/protocol-mapping.md](reference/protocol-mapping.md) for anchor-phrase cues that help locate each section.

## Procedure

### Step 1 — Read both documents

1. Read the transcript at the path the user gave you. Note the total line count.
2. Read [inputs/protocol.md](../../../inputs/protocol.md) (or the protocol path the user supplied).
3. Read the respondent's `respondent_id` and `pseudonym` from the transcript's YAML frontmatter. Preserve them exactly; never re-spell.

### Step 2 — Identify section boundaries

Walk the transcript top-to-bottom. For each interviewer turn (`**I:**`), decide which protocol section it opens — usually obvious from the question's wording. The respondent's reply belongs to whatever section the question opened.

A section begins at the line of the interviewer turn that opens it and continues until the next interviewer turn that opens a different section. Sections **can recur** — if the conversation circles back, mark the new occurrence with a fresh header. Do not merge non-contiguous occurrences.

If a respondent's answer drifts onto another protocol topic before the next interviewer turn, that is fine — the section is still defined by the interviewer's question that opened it. Note any cross-topic drift in the coverage report, but do not subdivide the section.

If a protocol section never appears in the transcript, do **not** insert a header for it. Record it in the coverage report as missing.

### Step 3 — Write the annotated transcript

Write the annotated copy to `outputs/indexed/<respondent_id>-Indexed.md`. Create the directory if it doesn't exist.

The annotated copy is the original transcript with **only one kind of change**: an inserted single-line header above each section. Every other character — every word, every line, every blank line, every piece of YAML frontmatter — is preserved exactly.

The header format is a single Markdown line:

```
## INDEX: <label> (lines A–B in <source-filename>)
```

Where `A` and `B` are the line numbers **in the original transcript** that the section spans (inclusive), and `<source-filename>` is the bare filename of the transcript (e.g. `R001-Transcript.md`).

Insert each header on its own line, with a blank line before and after, immediately above the interviewer turn that opens that section.

After writing, run a programmatic check: `diff <original> <indexed>` should show **only added lines** (no deletions, no modifications). If the diff is not clean, fix it before continuing. See [reference/diff-check.md](reference/diff-check.md) for the exact command.

### Step 4 — Write the coverage report

Write the report to `outputs/indexed/<respondent_id>-Coverage.md`. Use this structure (copy verbatim and fill in):

```markdown
# Coverage report — <respondent_id> (<pseudonym>)

Source: [<source-filename>](<relative path to original>)
Indexed copy: [<respondent_id>-Indexed.md](<respondent_id>-Indexed.md)

## Protocol sections present

| Index code | Line range(s) in source | Notes |
|---|---|---|
| `background-education` | 12–22 | |
| `kids` | 24–30 | |
| ... | | |

## Protocol sections missing

- `<label>` — <one-line note on what the interviewer did or did not ask, if discernible>

## Drift (off-protocol topics)

- lines <A>–<B>: <short noun phrase, e.g. "family-history sidebar about uncle's career">

## Notes on indexing decisions

- <One bullet per non-obvious call you made. E.g. "Lines 56–58 read as both `hopes-after-hs` and `college-meaning`; assigned to `college-meaning` because the interviewer's question explicitly named specific programs.">
```

If a section is genuinely absent, list it under "Protocol sections missing." If no sections drift, write `None` under "Drift." If no non-obvious decisions, write `None` under "Notes."

### Step 5 — Report back

In your reply to the user, in 3–6 lines:

- Where the two output files are (use markdown links).
- Which sections were present, which missing, whether anything drifted.
- Any indexing call you found genuinely ambiguous.

Do not summarize the transcript's content. Do not assign analytic labels.

## Hard constraints

- **No analytic codes.** Words like "instrumental," "expressive," "ambivalent," "mixed" do not appear in any output of this skill.
- **No summarizing.** The annotated transcript adds headers and nothing else. The coverage report names structural facts (which sections, which line ranges) — not content.
- **Verbatim preservation.** The indexed copy must diff cleanly against the original — header lines added, nothing else changed. If you find yourself wanting to fix a typo or normalize spacing, stop.
- **Stable IDs.** R001/Tasha, R002/Marisol, R003/Carla, R004/Denise — preserve exactly as the transcript frontmatter has them. Never re-spell.
- **No emojis.** Anywhere.
- **No "discovering themes" framing.** This is applying the protocol's structure to the transcript.

## Worked examples

See [outputs/indexed/](../../../outputs/indexed/) for the four sample transcripts run through this skill.
