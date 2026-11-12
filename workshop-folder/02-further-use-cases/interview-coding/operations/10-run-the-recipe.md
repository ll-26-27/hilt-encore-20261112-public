# 10 · Run it

Open this folder in Claude Code (or the Code tab of the Claude desktop app) and run the three skills in order. Each writes to [`outputs/`](../outputs/); the versions there are the May 21 runs, corrected Nov 12.

1. **Index** each transcript (Stage 1):
   `/index-transcript inputs/transcripts/R001-Transcript.md` (then R002, R003, R004)
   → [`outputs/indexed/`](../outputs/indexed/): an indexed copy and a coverage report for each.
2. **Look for negative cases** (Stage 3):
   `/find-negative-cases "Instrumental mothers reject family/emotional framing of college."`
   `/find-negative-cases "Mothers who attended community college themselves push their children toward four-year schools."`
   → [`outputs/negative-cases/`](../outputs/negative-cases/): R004 Denise against the first claim, R001 Tasha against the second, verbatim with line numbers.
3. **Write the methods paragraph** from what was actually done:
   `/methods-paragraph`
   → [`outputs/methods/methods-paragraph.md`](../outputs/methods/methods-paragraph.md). It reports Stage 2 (analytic coding) as not done, because it wasn't.

Index, audit, document: scale, rigor, transparency.
