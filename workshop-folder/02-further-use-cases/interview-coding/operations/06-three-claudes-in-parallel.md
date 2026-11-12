# 06 · Run three Claudes in parallel

**Prompt:**

> Now give me the prompts I should run in parallel in different Claudes to get the skills built.

**What came back:** three short prompts, one per skill, each pointing at the plan ([05-PLAN.md](05-PLAN.md), then `PLAN.md` at the root) rather than repeating it. Marlon opened three terminals in the project folder, started Claude Code in each, and pasted one prompt into each. They are reproduced exactly as written.

**Session 1, `/index-transcript`:**

```text
You're going to build a Claude Code skill called /index-transcript for a workshop demo of LLM-assisted qualitative coding.

1. Read PLAN.md in this folder. Read the "Shared context" section AND "Task 1 — Build /index-transcript". Follow the required-reading list in the shared context before writing any code.

2. Build the skill at .claude/skills/index-transcript/ — at minimum a SKILL.md, plus whatever supporting files you need.

3. Validate it by running it against all four transcripts in inputs/transcripts/. Save the worked outputs to .claude/skills/index-transcript/examples/.

4. When you're done, give me a short report: what's in SKILL.md, what examples you produced, and any decisions you made that PLAN.md didn't fully specify.

Stay aligned with the constraints in PLAN.md — especially: no analytic codes at this stage, no summarizing, no emojis. This is Waters' Stage 1: navigation layer, not digest.
```

**Session 2, `/find-negative-cases`:**

```text
You're going to build a Claude Code skill called /find-negative-cases for a workshop demo of LLM-assisted qualitative coding.

1. Read PLAN.md in this folder. Read the "Shared context" section AND "Task 2 — Build /find-negative-cases". Follow the required-reading list in the shared context before writing any code.

2. Build the skill at .claude/skills/find-negative-cases/ — at minimum a SKILL.md, plus whatever supporting files you need.

3. Validate it on both demo claims listed in PLAN.md's Task 2. Save the worked memos to .claude/skills/find-negative-cases/examples/. For the first claim — "instrumental mothers reject family/emotional framing of college" — confirm that R004 (Denise) surfaces as the negative case with verbatim excerpts and a clear reasoning paragraph.

4. When you're done, give me a short report: what's in SKILL.md, what examples you produced, and any decisions you made.

Stay aligned with the constraints in PLAN.md — especially: verbatim quotes only, don't dismiss negative cases, don't stop after one.
```

**Session 3, `/methods-paragraph`:**

```text
You're going to build a Claude Code skill called /methods-paragraph for a workshop demo of LLM-assisted qualitative coding.

1. Read PLAN.md in this folder. Read the "Shared context" section AND "Task 3 — Build /methods-paragraph". Follow the required-reading list in the shared context before writing any code.

2. Build the skill at .claude/skills/methods-paragraph/ — at minimum a SKILL.md, plus whatever supporting files you need.

3. Validate it. The other two skills are being built in parallel sessions, so their outputs may not exist yet when you validate. Design the skill to inspect the project state and accurately report what's there — including reporting "no indexing done yet" or "no negative-case analysis run yet" if those outputs are absent. Save examples/methods-paragraph-empty.md showing the empty-project behavior. If the other skills' outputs exist by the time you validate, also produce examples/methods-paragraph-full.md.

4. When you're done, give me a short report: what's in SKILL.md, what examples you produced, and any decisions you made.

Stay aligned with the constraints in PLAN.md — especially: don't invent details the project state doesn't support, don't gesture at grounded theory, be specific about what was and wasn't done.
```

The built skills are in [`.claude/skills/`](../.claude/skills/) (corrected Nov 12; the prompts above are left as they were, including "Waters' Stage 1").

**The move worth noticing:** the plan is the durable artifact; the prompts are only the trigger.
