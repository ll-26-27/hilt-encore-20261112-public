*Corrected November 12, 2026. What changed and why: [corrections.md](../../corrections.md).*

# Methods (project state as of 2026-05-21)

This write-up describes the project as currently constituted. Stages 1 and 3 of Deterding & Waters' (2021) flexible-coding workflow have been performed; Stage 2 has not, and that absence is noted explicitly rather than glossed.

## Data

N=4 semistructured interviews with low-income mothers of teenagers about their children's college planning: [R001 Tasha](../../inputs/transcripts/R001-Transcript.md), [R002 Marisol](../../inputs/transcripts/R002-Transcript.md), [R003 Carla](../../inputs/transcripts/R003-Transcript.md), [R004 Denise](../../inputs/transcripts/R004-Transcript.md). Transcripts are **synthetic**; they borrow the instrumental/expressive typology from Deterding's (2015) "Instrumental and Expressive Education" (*Sociology of Education* 88(4)), a study of low-income mothers' own return to college after Hurricane Katrina, and move it to mothers' plans for their children. Per-respondent attributes — age, race/ethnicity, highest education, employment, household income, marital status, children, interview metadata — are in [inputs/attributes.csv](../../inputs/attributes.csv). Filenames follow the Deterding & Waters (2021, p. 723) convention of leading with respondent ID. Respondents are 36–44; the synthetic interview metadata assign them to March 2024 and a single fictional interviewer.

## Protocol

A seven-section semistructured guide ([inputs/protocol.md](../../inputs/protocol.md)): background and own education; family and children; hopes after high school; college; sources of advice; worries and barriers; closing reflections.

## Indexing (Stage 1)

All four transcripts were indexed using the project's `/index-transcript` skill, which applies seven protocol-derived index codes (`background-education`, `kids`, `hopes-after-hs`, `college-meaning`, `sources-of-advice`, `worries-barriers`, `reflections`) to chunks of transcript text. Output is in [outputs/indexed/](../indexed/). Coverage was verified by running `diff` between each indexed transcript and its original; the diff returned only additions (single-line section headers), with no modifications to interview content. All seven protocol sections were present in every transcript. R003 returned to `hopes-after-hs` after a detour through `college-meaning` and `sources-of-advice`; that recurrence was marked with a fresh header (eight total headers for R003) rather than merged into the first occurrence. R003 and R004 exhibit documented drift inside indexed sections — notably R004's answer to a `kids` question that opens immediately into `hopes-after-hs` content, and R003's `hopes-after-hs` recurrence containing a meta-reflective probe about the source of her ambivalence. These drift events are documented in the per-respondent coverage reports for Stage 2 attention.

## Analytic coding (Stage 2)

Analytic coding has **not** been performed. No `codebook.md` exists at the project root, and no coded artifacts are present. The Stage 1 index positions a future coder to target only the protocol sections topically relevant to a given analytic question, capturing the efficiency gain Deterding & Waters describe (p. 729). Until a codebook is drafted and applied to indexed sections, no typological claims (e.g., instrumental / expressive / mixed) are warranted on the basis of this project's outputs.

## Negative-case analysis (Stage 3)

Two working claims were audited for negative cases using the project's `/find-negative-cases` skill, with results in [outputs/negative-cases/](../negative-cases/). [The first audit](../negative-cases/instrumental-mothers-emotional-framing.md) tested the claim that *instrumental mothers reject family/emotional framing of college* and surfaced R004 (Denise) as a disconfirming case: her reasoning is instrumental in the strict sense (return-on-credential, risk-managed, oriented to labor-market leverage) but her framing is saturated with family and emotional vocabulary. The audit recommends narrowing the claim's scope, distinguishing instrumental *reasoning* from instrumental *framing*. [The second audit](../negative-cases/community-college-mothers-push-four-year.md) tested the claim that *mothers who attended community college themselves push their children toward four-year schools* and surfaced R001 (Tasha) as a disconfirming case — a community-college-attending mother pushing trade school. That audit also recommends narrowing the claim's scope, with the proposed boundary set by the presence or absence of a vivid model of what a four-year degree concretely affords. Both audits quote verbatim with line references and explicitly treat case count as theoretically informative rather than as grounds for dismissal (Blee 2009, quoted in Deterding & Waters 2021, p. 731).

## What was not done

No analytic codebook was drafted; no analytic coding was applied to indexed sections; no typology was constructed from the data; no inter-coder reliability metric was computed (the indexing and audits were run by Claude Code skills and spot-checked by an orchestrating Claude session; no human coder worked the corpus); no second-coder pass was performed; no member-checking was conducted. LLM-assistance is framed throughout as applying the researcher's protocol structure at scale and surfacing candidate excerpts for review — not as theme discovery.
