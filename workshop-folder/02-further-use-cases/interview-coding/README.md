# Recipe: a methods paper becomes a working tool

**Flexible coding of interviews, with Claude Code.** Built May 21, 2026, the morning of day 4 of the summer workshop, for a participant whose paper it is built on: Mary Waters. Corrected November 12, 2026.

> "Mary is at our workshop so we want to think of things that really align with her views and approach." (Marlon, first prompt)

## Ingredients · [`inputs/`](inputs/)

- **The paper:** Nicole M. Deterding and Mary C. Waters, "Flexible Coding of In-depth Interviews: A Twenty-first-century Approach," *Sociological Methods & Research* 50(2): 708–739 (2021; online 2018). Index transcripts first, then code, then test against the cases that don't fit. Cited, not copied: [inputs/the-paper.md](inputs/the-paper.md).
- **Four synthetic interviews** with low-income mothers about their teenagers' college plans, plus the protocol and an attributes sheet. One (R004, Denise) is built to fool a naive coder.

## Operations · [`operations/`](operations/)

Ten short steps, prompts as typed: read the paper with the reader in mind (01) → write it down (02) → design skills tied to its pages (03) → make test data (04) → plan (05) → three Claudes build three skills in parallel (06) → a CLAUDE.md so the folder explains itself (07) → audit their work (08) → a deep-research essay (09) → run it (10).

Skills, in [`.claude/skills/`](.claude/skills/): `/index-transcript` · `/find-negative-cases` · `/methods-paragraph`

## The dish · [`outputs/`](outputs/)

- [`indexed/`](outputs/indexed/): four transcripts anchored to the protocol, with coverage reports
- [`negative-cases/`](outputs/negative-cases/): two audits, e.g. Denise talks about family and feelings but reasons about payoffs, so she cuts against "instrumental mothers reject emotional framing"
- [`methods/`](outputs/methods/methods-paragraph.md): a methods paragraph that says what was **not** done
- [`essay/`](outputs/essay/research-result.md): *From Index Cards to Indexed Codes*, the contextualizing essay

## What was corrected · [`corrections.md`](corrections.md)

What Claude wrote while reading the paper checked out. The essay, never audited in May, did not, and the rest of the sample had errors of its own:

- The synthetic interviews were said to be modeled on Deterding's study of mothers planning *their children's* college. Her study is about mothers returning to college *themselves* after Hurricane Katrina.
- The method was called "Mary Waters' approach." It is Deterding and Waters's; Deterding is first author.
- One citation was invented three different ways; one cited study can't be found; a table was read backwards.
- The invented interviewer had Nicole Deterding's initials ("ND"). Now "Interviewer."

## Run it

Open this folder in Claude Code and follow [operations/10-run-the-recipe.md](operations/10-run-the-recipe.md).

## Before publishing

The paper PDF is not included in this workshop copy. Use [the citation and library instructions](inputs/the-paper.md) to obtain your own copy. The source recipe records Mary Waters’s November 10 permission to present this sample; it does not establish author review or endorsement of the generated essay.

*Built May 21, 2026, in the week 1 Day 4 workshop repo of the Bok Center's summer Claude Code intensive; rebuilt and corrected November 12, 2026, for the HILT Encore talk.*


## This workshop copy

See [PORT.md](PORT.md) for provenance and the reconciliation of older background files and duplicate examples. [index.md](index.md) is the file guide. In another assistant, ask it to read `CLAUDE.md` and follow the relevant skill file explicitly. These materials are prompts and saved examples; no new coding run was performed during this import.
