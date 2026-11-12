# CLAUDE.md: flexible coding of interviews, with Claude Code

## What this folder is

A worked example of LLM-assisted qualitative interview coding, following the "flexible coding" method of Nicole Deterding and Mary Waters (Deterding & Waters 2021, *Sociological Methods & Research* 50(2): 708–739; published online 2018). It was built on May 21, 2026, for the Bok Center workshop "Claude for Teaching, Course Development, and Research," in which Mary Waters took part; corrected November 12, 2026. Open this folder in Claude Code and everything you need is here.

## Read in this order

1. [README.md](README.md): the recipe card.
2. [operations/](operations/): how it was built, step by step, with the prompts as typed. Step 10 is how to run it.
3. [inputs/README.md](inputs/README.md): the synthetic corpus and the paper.

## The skills (in `.claude/skills/`)

- `/index-transcript`: Stage 1. Anchors each section of a transcript to the interview protocol. Navigation, not analysis.
- `/find-negative-cases`: Stage 3. Given a claim, finds the respondents whose words cut against it, quoted verbatim with line numbers.
- `/methods-paragraph`: writes a methods paragraph from what the project shows was done, and says what was not.

## Conventions

- `inputs/` is read-only. New artifacts go in `outputs/` (`indexed/`, `negative-cases/`, `methods/`).
- Respondent IDs and pseudonyms (R001 Tasha, R002 Marisol, R003 Carla, R004 Denise) stay the same in every output.
- Quotations are verbatim, with line numbers. No emojis.

## Constraints (our reading of the paper)

- Don't present the model as "discovering themes." It applies the researcher's concepts, surfaces candidates for review, and audits for negative cases. (Deterding and Waters allow that some themes will be truly emergent, p. 729; the rule is ours, for honest framing.)
- Don't start with line-by-line open coding: index first (Stage 1), apply analytic codes to indexed sections (Stage 2), then validate (Stage 3).
- Don't replace the researcher's reading. In the paper, indexing is also the deep first read, with memos (pp. 726–727, 733). The skills support it; they don't stand in for it.
- Don't oversell counts. Frequencies are not proof of validity (p. 734).

## The paper

If `inputs/private-only/deterding-waters-2018-flexible-coding.pdf` is present, read it before working: it is the source the skills follow, and page numbers in this folder refer to it. If it is not there, tell the user it is missing and ask them to add their own library copy at that path (the citation and how to find it are in `inputs/the-paper.md`); until then, work from `inputs/the-paper.md` and say that you have not read the paper. Quote it only briefly, with page numbers.

## The corpus

The four transcripts are **synthetic**. They borrow the instrumental/expressive/mixed typology from Deterding's study (*Sociology of Education* 2015), which examined low-income mothers deciding whether to return to college themselves after Hurricane Katrina, and move it to mothers' plans for their teenagers. No real respondents; the interviewer is fictional.
