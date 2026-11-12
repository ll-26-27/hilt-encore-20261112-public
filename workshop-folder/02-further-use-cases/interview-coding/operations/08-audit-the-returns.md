# 08 · Audit each Claude's work

**Prompts:**

> Session 3 is done — can you check the work?
> ...also from session 2 — still waiting on 1
> ...Session 1 completed for this project. Can you now do final cleanup?

**What came back:** the sessions finished out of order (3, then 2, then 1). For each, the orchestrating Claude read the SKILL.md, checked the examples against the transcripts, and spot-checked quotations and line numbers.

- `/methods-paragraph`: clean; it refused to describe stages that had not been run.
- `/find-negative-cases`: one quotation from R004 had silently dropped its first sentence ("It changes everything."); fixed. Its added scope-condition step kept out-of-scope respondents from inflating the count.
- `/index-transcript`: clean; every indexed transcript differs from its original only by added headers.

The validated outputs were then promoted to [`outputs/`](../outputs/), and the methods paragraph was rerun against the full project.

**The move worth noticing:** the most common failure in parallel work is plausible output with small honesty bugs. This audit caught one. The essay in step 09 was never audited, and that is where the errors were (see [../corrections.md](../corrections.md)).
