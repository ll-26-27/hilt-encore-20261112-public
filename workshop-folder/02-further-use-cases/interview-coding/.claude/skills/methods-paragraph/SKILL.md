---
name: methods-paragraph
description: Generate a Methods-section paragraph (250–500 words) from the actual coding pipeline that has been run on this project. Inspects inputs, indexed transcripts, negative-case memos, and any codebook to produce an honest, specific Methods write-up suitable for a journal article. Reports the absence of analysis steps when they were not run, rather than fabricating procedure. Use when the user asks to write up methods, draft a methods section, generate a transparency artifact, or check what the project state can support in print.
---

# /methods-paragraph

Pays off the record-keeping done by `/index-transcript`, `/find-negative-cases`, and any analytic coding. Reads the project state, then writes a Methods-section paragraph that describes the actual procedure that was followed.

Designed to address Deterding & Waters's finding that nearly 20 percent of the interview articles they reviewed did not discuss their coding procedure at all (2021, p. 719, Table 2). The artifact this skill produces is the transparency that the rest of the pipeline earns.

## Where the skill expects to be run

From the root of the `interview-coding` project (i.e. the directory containing `inputs/`, `PLAN.md`, and `CLAUDE.md`). Before doing anything else, verify that `inputs/transcripts/` and `inputs/protocol.md` exist. If they do not, stop and tell the user where the skill expects to be run from.

## Steps

### 1. Read the data design (from `inputs/`)

- `inputs/attributes.csv` — count the data rows (excluding header) to get N. List the attribute columns (this is the sampling frame).
- `inputs/README.md` — sampling rationale, whether the corpus is synthetic or real, what study (if any) it is modeled on. Quote sparingly.
- `inputs/protocol.md` — count the level-2 headers to get the number of protocol sections; list their topic labels.
- `inputs/transcripts/` — list the transcript files. These are the raw data, not derived artifacts. Note their filename convention (e.g. `R001-Transcript.md`) since Deterding & Waters call this out (p. 723).

### 2. Inspect the indexing stage (Stage 1)

Look at `outputs/indexed/`:

- For each `<Rxxx>-Indexed.md` file, the corresponding transcript has been indexed.
- For each `<Rxxx>-Coverage.md` file, a per-respondent coverage report exists. Skim each one to extract: which protocol sections were present, which were flagged as missing, where the conversation drifted.
- If the directory is missing or empty: indexing has not been done. State this directly. Do not write "we indexed all transcripts" when there is no evidence of that.

### 3. Inspect the analytic coding stage (Stage 2)

Look for:

- `codebook.md` at the project root — if present, list the analytic codes and any definitions.
- `outputs/coded/` or any sibling directory recording analytic coding output.
- Memos or notes that describe what fraction of which protocol sections were coded.

If none of these exist, the methods paragraph must say analytic coding was not performed (or, if you can see evidence it was done outside the file tree, say it was done but is not documented here).

### 4. Inspect the negative-case audit (Stage 3)

Look at `outputs/negative-cases/`:

- Each `.md` file is a memo auditing one working claim. Open each one and extract: the claim, which respondents surfaced as negative cases, and the implications conclusion (abandon / narrow / keep with explicit treatment).
- If the directory is missing or empty: state that no negative-case audit has been performed.

### 5. Inspect anything else worth mentioning

A `notes/` or `memos/` directory, a `typology.md`, a `decision-log.md`, an inter-coder reliability note. Mention what you find. If you do not find it, do not pretend it exists.

### 6. Compose the methods write-up

Use the structure below. Length: 250–500 words. Style: dry, specific, suitable for pasting into a real Methods section. Avoid hedge words ("we attempted to," "we sought to") when a definite verb is available.

```
## Data

[N respondents, sampling frame, synthetic vs real, study modeled on which work,
range of attribute values. Cite inputs/attributes.csv and inputs/README.md.]

## Protocol

[Number of protocol sections, list of section topics, intended duration,
interviewer(s). Cite inputs/protocol.md.]

## Indexing (Stage 1)

[If outputs/indexed/ has content: which sections were indexed, how many
transcripts, what tool (the /index-transcript skill), how coverage was verified,
which sections were flagged as missing in which transcripts.

If empty: "Indexing per Stage 1 (Deterding & Waters 2021, p. 726) has not
been performed in this project state."]

## Analytic coding (Stage 2)

[If a codebook and coded artifacts exist: list the codes, the fraction of the
corpus that was coded, the targeting heuristic (e.g. "we coded only the sections
indexed under `hopes-after-hs` and `college-meaning`, which is approximately X%
of the full transcripts").

If absent: state that analytic coding has not been performed.]

## Negative-case analysis (Stage 3)

[If outputs/negative-cases/ has memos: list each claim that was audited, the
respondents who surfaced as negative cases, and the implications conclusion.

If absent: state that no negative-case audit has been performed.]

## What was not done

[Be explicit. Default candidates: inter-coder reliability not computed (no
evidence of two coders); member-checking not performed; second-coder pass not
performed; typology refinement not performed; LLM-assistance not pitched as
"theme discovery." List only the items that genuinely were not done — do not
invent absences.]
```

You can collapse the section headers into prose if the user asks for one prose paragraph; default to the subsection structure since real Methods sections in sociology journals typically have it.

### 7. Write the file and report back

Write the paragraph to `outputs/methods/methods-paragraph.md` (create the directory if it doesn't exist). Then in chat, report:

- the path to the written file,
- a short summary of what project state you found (one sentence per pipeline stage),
- and an honest note about what is missing — if the project is at an early stage, say so plainly and tell the user the paragraph will read differently once they have run the other skills.

## Hard constraints (Waters-aligned)

- **Do not invent details the project state does not support.** If `outputs/indexed/` does not exist, do not write that indexing was performed. If there is no codebook, do not list analytic codes.
- **Do not claim reliability metrics that were not measured.** No kappa unless there is evidence of two coders and a computation. The default is to state explicitly that no inter-coder reliability was computed.
- **Do not gesture at "grounded theory."** Flexible coding is a deliberate departure from grounded theory's open-coding-first approach. Frame the methods as flexible coding (Deterding & Waters 2021) — indexing first, analytic coding on indexed sections, negative-case validation.
- **Do not pitch LLM assistance as "discovering themes."** When LLM assistance shows up in the write-up, frame it as "applying the researcher's index codes at scale," "surfacing candidate excerpts for review," or "auditing the indexed corpus for negative cases."
- **No emojis.**
- **Use markdown link syntax** for file references, e.g. `[R001](inputs/transcripts/R001-Transcript.md)`. Keep respondent IDs (R001…R004) and pseudonyms (Tasha, Marisol, Carla, Denise) stable.

## What good output looks like

Specific over vague. Bad: "We coded the data thematically." Good: "We applied the seven protocol-derived index codes (`background-education`, `kids`, `hopes-after-hs`, `college-meaning`, `sources-of-advice`, `worries-barriers`, `reflections`) to all four transcripts using the project's `/index-transcript` skill; coverage reports flagged R002 as missing the `reflections` section."

The reader should be able to reconstruct what was done — and what was not done — from the paragraph alone.

## Examples

- [outputs/methods/methods-paragraph.md](../../../outputs/methods/methods-paragraph.md) — what the skill produced after `/index-transcript` and `/find-negative-cases` had run (corrected Nov 12). A May 21 version for an empty project, which reports every stage as not yet done, was kept with the original workshop repo.
