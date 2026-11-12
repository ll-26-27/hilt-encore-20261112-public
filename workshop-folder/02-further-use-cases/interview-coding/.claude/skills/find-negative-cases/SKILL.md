---
name: find-negative-cases
description: Audit an interview corpus for respondents whose evidence cuts against a stated claim. Surfaces verbatim excerpts with line references, writes a 2-4 sentence reasoning paragraph per case, and closes with an implications-for-the-theory recommendation. Implements flexible coding's Stage 3 negative-case analysis (Deterding & Waters 2021, pp. 731-732, quoting Blee 2009 and citing Katz 1982 and Luker 2008). Trigger when the user asks to find negative cases, audit a claim, stress-test a hypothesis, check for counter-evidence, or runs /find-negative-cases.
---

You are running flexible coding's Stage 3 validation step on a small interview corpus. Your job is not to confirm a claim. Your job is to find every respondent whose evidence cuts against it, quote them verbatim, and explain *how* the evidence cuts against the claim — so the analyst can decide whether to abandon the claim, narrow it, or keep it with explicit treatment of the disconfirming cases.

This skill exists because the methodological literature (Blee 2009, quoted by Deterding & Waters 2021, p. 731; Katz 1982 and Luker 2008, cited p. 732) treats negative-case analysis as a central rigor move in interview-based research. "Data that diverge from the pattern are not discounted without a clear rationale to do so" (Blee 2009).

## Inputs

- **Claim** (required): a one-sentence working claim or hypothesis. Take it from the user's invocation, e.g., `/find-negative-cases "instrumental mothers reject family/emotional framing of college"`. If the user did not pass a claim, ask for one before doing anything else.
- **Corpus directory** (optional): default to `inputs/transcripts/` relative to the project root. If the user passes a directory, use that instead.

## Step 1 — Locate the corpus and read every transcript

Use `ls` to enumerate the transcripts. For this project the corpus is the four files [R001](../../../inputs/transcripts/R001-Transcript.md), [R002](../../../inputs/transcripts/R002-Transcript.md), [R003](../../../inputs/transcripts/R003-Transcript.md), [R004](../../../inputs/transcripts/R004-Transcript.md). Read each in full. Do not skim. The point of this skill is exhaustive coverage at small N, which is exactly what the field cannot do at N=200 (p. 731).

## Step 2 — Identify the claim's scope condition

Most claims have an implicit scope condition — a subset of respondents to whom the claim is meant to apply. Examples:

- "Instrumental mothers reject family/emotional framing of college" → scope is *instrumental mothers*. Expressive and mixed cases are out of scope (they are not negative cases; they are not the population the claim is about).
- "Mothers who attended community college themselves push their children toward four-year schools" → scope is *mothers who attended community college*. Mothers who did not attend college at all are out of scope.

Before evaluating any respondent against the claim, decide which respondents are in scope and say so explicitly in the memo. **A respondent who is out of scope is not a negative case.** Conflating the two is the most common error here.

If the claim has no obvious scope condition (it is meant to apply to all respondents), say so and treat the whole corpus as in scope.

## Step 3 — For each in-scope respondent, classify the evidence

For each in-scope respondent, decide whether their evidence:

- **Supports** the claim,
- **Cuts against** the claim (i.e., they are a negative case), or
- **Is mixed** (some evidence supports, some cuts against — flag this; do not force a side).

A negative case is not just a respondent who fails to support the claim. It is a respondent whose actual statements, behavior, or reasoning *contradict* the claim's prediction. Be careful not to treat absence of evidence as counter-evidence.

## Step 4 — Pull verbatim excerpts with line references

For every negative case, pull excerpts directly from the transcript file. The quotes must be **verbatim** — exact wording, exact punctuation, including stage directions like `[laughs]` or `[pause]` that appear in the source. Do not paraphrase and then label the paraphrase as a quote. Do not silently fix typos in the source.

Cite line references using the markdown file's line numbers in the form `[R004 L46](inputs/transcripts/R004-Transcript.md#L46)` or a range `[R004 L46-50](inputs/transcripts/R004-Transcript.md#L46-L50)`. Use the markdown link syntax so the references are clickable in the IDE.

When pulling line numbers, open the file with the Read tool — the line numbers it returns are the canonical references. Do not eyeball the line number.

## Step 5 — Write a reasoning paragraph per negative case

For each negative case, write a 2-4 sentence paragraph that explains *how* the evidence cuts against the claim. Do not just present the quote — interpret it. A good reasoning paragraph names the distinction that the claim was missing. For example, if the claim conflates two dimensions (analytic reasoning vs. rhetorical framing), the reasoning paragraph should name that conflation.

Watch for these failure modes:

- **Dismissal**: "Only one respondent does this." Waters explicitly cautions against this on p. 731. One disconfirming case can be theoretically decisive. Report the count, but do not use the count as grounds for dismissal.
- **Premature reconciliation**: explaining away the negative case ("she's an exception because…") instead of letting it sit. The point of the memo is to surface the tension, not resolve it.
- **Stopping at the first negative case**: continue through the rest of the corpus even after you find one. Multiple negative cases are common and the second changes the implications.

## Step 6 — Write the implications-for-the-theory section

Close with one of three explicit recommendations:

- **Abandon** — the claim is wrong; the disconfirming evidence is decisive.
- **Narrow in scope** — the claim is right for a subset; specify the boundary. Example: "Holds for instrumental mothers whose own education was minimal; does not hold for instrumental mothers with a successful college-educated sibling."
- **Keep with explicit treatment** — the claim is mostly right; the negative case must be acknowledged and engaged with in the eventual write-up, not buried.

State which one you recommend and give the analyst the reasoning. The recommendation is a suggestion, not a verdict — Deterding and Waters's point is that the analyst decides; the LLM surfaces the candidate.

## Step 7 — Write the memo

Write to `outputs/negative-cases/<short-claim-slug>.md` relative to the project root. Generate the slug from the claim: lowercase, replace non-alphanumerics with hyphens, trim, truncate to roughly 50 characters. Examples:

- "Instrumental mothers reject family/emotional framing of college" → `instrumental-mothers-emotional-framing.md`
- "Mothers who attended community college themselves push their children toward four-year schools" → `community-college-mothers-push-four-year.md`

Create the `outputs/negative-cases/` directory if it does not exist.

Use the structure in [memo-template.md](memo-template.md). The memo has five sections in this order: Claim, Scope, Negative cases (one subsection per respondent, each with verbatim excerpts + reasoning), In-scope cases that support the claim (briefly listed), and Implications.

## Hard constraints

- **Verbatim quotes only.** Do not paraphrase as if it were a quote. Do not invent excerpts. If you cannot find a verbatim excerpt that supports the point, do not make the point.
- **Do not dismiss a negative case because it is the only one.** Waters explicitly cautions against this.
- **Do not stop after the first negative case.** Read every in-scope transcript.
- **Preserve respondent IDs and pseudonyms** exactly as they appear in the corpus (R001 Tasha, R002 Marisol, R003 Carla, R004 Denise).
- **No emojis.** No grounded-theory framing. No "the LLM discovered the negative case" — frame as "the skill surfaces candidates for the analyst to evaluate."
- **Use markdown link syntax** for all file references (`[R004 L46](inputs/transcripts/R004-Transcript.md#L46)`), so the references are clickable in the IDE.

## When the corpus is empty or the claim is missing

- If the user did not provide a claim, ask for one. Do not guess.
- If the corpus directory is empty, say so and stop. Do not fabricate cases.
- If the claim has a scope condition that no respondent meets, say so explicitly — there are no in-scope respondents to evaluate, so the claim cannot be tested against this corpus.

## See also

- [reasoning-guide.md](reasoning-guide.md) — short reference on what counts as a negative case, with the relevant Deterding & Waters / Blee / Katz citations.
- [memo-template.md](memo-template.md) — the output structure.
- [outputs/negative-cases/](../../../outputs/negative-cases/) — two worked memos against the synthetic corpus.
