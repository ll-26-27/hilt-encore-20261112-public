# Make-up Exam Candidate Generator

You generate **candidate replacement problems** for a make-up exam, using an existing exam as the structural anchor and (optionally) past exams or other course material as additional inspiration. The instructor curates the final make-up from your candidates.

## When to use

A student or cohort missed the original exam, or the original exam's contents may have been compromised (leaked, shared, or seen by students who will sit the make-up). You need replacement problems that:

- Test the same concepts and skills as the original.
- Match its difficulty, length, and structure (so the make-up isn't easier or harder).
- Are sufficiently different from the original that a student who saw the original would gain **no unfair advantage** on the make-up.

The output is a markdown file with **2–3 candidate replacements per slot** in the original exam. The instructor picks one per slot, optionally requests another round of revisions, and then asks you to assemble the chosen candidates into a final exam file.

## Foundational principle: security vs. parity

The two hardest constraints on a make-up exam pull in opposite directions:

- **Security.** A student who has seen the original (intentionally or otherwise) must not be able to convert that knowledge into points on the make-up. The make-up is not just a "different exam on the same topic" — it must be different in ways that defeat memorization, scenario-recall, and answer-recall.
- **Parity.** The make-up must be the same exam in difficulty, length, structure, and concept coverage as the original. A make-up that is easier or harder is unfair in a different way.

These pull in opposite directions because the obvious way to make a problem "different" (change the topic, add a twist, simplify, complicate) usually breaks parity. Your job is to find replacements that change *enough* that recall doesn't help, but *only* the things that don't change difficulty.

Concretely: change the **concrete domain** (disease-test Bayes → spam-filter Bayes), the **scenario**, the **specific numbers**, and the **surface framing**. Do *not* change the underlying technique, the number/structure of subparts, the conceptual depth, or the algebraic complexity. A student who mastered the original's *technique* should solve the make-up in roughly the same time; a student who only memorized the original's *answers and steps* should gain nothing.

When in doubt, lean toward more distinctness. A make-up that is slightly different in difficulty is recoverable (curve the grade); a make-up where memorization helps is not.

## Modes

The skill operates in three modes:

1. **Generation** — first run. Produce the candidate file from scratch.
2. **Iteration** — instructor has reviewed the candidates and left feedback on some slots; produce 1–2 additional candidates per flagged slot, addressing the feedback. Append to the existing file.
3. **Assembly** — instructor has checked the **Keep** checkbox on one candidate per slot; assemble those into a complete make-up exam file in the original's format.

Auto-detect the mode from the state of `<original-stem>_makeup_candidates.md`:

- File does not exist → **generation**.
- File exists, has at least one **Keep** checkbox checked (`- [x] **Keep**`), and the user is asking to assemble (or has filled in no new feedback blocks) → **assembly**.
- File exists with one or more **Feedback for next round** blocks filled in → **iteration**.
- Ambiguous (e.g., both feedback and **Keep** checkboxes present) → ask the user which mode they want.

The user may also pass `mode=generation|iteration|assembly` explicitly to override auto-detection.

## Inputs

The user invokes you with:

- **Path to the original exam** (required). Any of the formats listed below.
- **Path(s) to additional context** (optional, can be multiple — see *Context that helps most* below for what to include).
- **Candidates per slot** (optional, default `3` for generation, `2` for iteration).
- **Mode** (optional, see above).
- **Interview** (optional, default `true` for generation mode, `false` for iteration/assembly). When true, the skill pauses after analysis to confirm the inferred per-slot topic with the instructor and offer to broaden it. Pass `interview=false` to skip.

If the original exam path is missing or the file doesn't exist, stop and ask the user to clarify.

### Context that helps most

The make-up's quality depends heavily on how well the skill understands the *course context* the original exam was written for. The skill can work from the original exam alone, but the resulting candidates will inherit only what's visible on the page — the surface form of each question. Providing additional context lets the skill infer broader topic scopes, calibrate difficulty more accurately, and avoid out-of-scope techniques.

When you invoke the skill, consider sharing as much of the following as you reasonably can:

- **What kind of exam this is.** Quiz, unit test, midterm, final, comprehensive exam, qualifier — each has different conventions for breadth, difficulty, and time budget. State this in the invocation message ("this is a unit test on probability for a sophomore-level discrete math course").
- **Syllabus or course outline.** Lets the skill anchor the *broadest* topic-tier in the interview to your actual course units rather than to inference from the original exam.
- **Past versions of the same exam** (in the same course or a prior offering). Calibrates difficulty, framing conventions, problem styles, and reveals which techniques students have already encountered.
- **Readings, lecture notes, or section notes** for the unit(s) being tested. Reveals which definitions / theorems / techniques are in scope and which are not.
- **Homework or problem sets** covering the same material. Strong signal of difficulty band and worked-through technique repertoire.
- **A problem bank** (if you maintain one). Useful for both inspiration and ensuring candidates don't accidentally duplicate existing problems.
- **Calculator / open-book / formula-sheet policy and time limit.** Affects whether candidates should have calculator-friendly numerics, standalone-statement preambles, etc. (The interview will also ask about this if not provided.)

Pass file-based context as additional path arguments; describe non-file context (course type, exam type, time limit, constraints) in the invocation message. The skill will surface what it found and what it inferred, so it's easy to spot gaps before generation.

**No context? That's OK.** The skill will still work from the original exam alone — it will infer narrowly, flag uncertainty in the test plan, and rely more heavily on the interview phase to confirm topic scope. Expect to do more curation across iteration rounds without context.

## Reading the input (format-agnostic)

Detect the file extension on the original exam (and any context paths) and use the right read strategy:

| Format | How to read |
|--------|-------------|
| `.tex`, `.md`, `.txt`, `.html`, `.rtf` | Read directly with the `Read` tool. |
| `.pdf` | Use `Read` with `pages:` for large PDFs. |
| `.docx` (Word) | Convert first. Try `pandoc <path> -o /tmp/exam.md` (best fidelity). Fallback on macOS: `textutil -convert txt <path> -output /tmp/exam.txt`. |
| `.doc` (legacy Word) | `textutil -convert txt <path> -output /tmp/exam.txt` on macOS, otherwise ask the user to convert to .docx or .pdf. |
| Google Docs link / `.gdoc` | Ask the user to export to .docx, .pdf, or .md and re-invoke. |
| Other | Ask the user what format it is and how to convert it. |

If a conversion command isn't available on the user's system (e.g., `pandoc: command not found`), surface the missing tool, suggest install (`brew install pandoc`), and offer to fall back to a less-faithful converter or ask the user to convert manually.

If the original is a scanned/image PDF (text extraction returns empty or garbled), say so and ask the user to provide a typed version or to describe the slot structure manually — you cannot reliably model what you cannot read.

After reading, you should have plain text representing the exam. **Do not modify the source files.**

## Analysis phase (do this before generating)

Extract the **test plan** of the original exam. Write a short internal analysis covering:

1. **Slot inventory.** For each problem in the original, record:
   - Identifier (Problem 1, Question 3, etc.).
   - Topic / concept(s) tested.
   - Skills required (definitional recall, application, computation, proof, modeling, design, debugging, ...).
   - Number and structure of subparts (escalation pattern, build-on-previous, parallel disprove/strengthen, separable existence/uniqueness, ...).
   - Estimated time budget and point value (if marked).
   - Difficulty band (easy / medium / hard).

2. **Difficulty distribution.** Spread across the exam (e.g., "1 warm-up, 4 medium, 1 hard").

3. **Concept coverage.** Aggregate the concepts. Which units of the course are represented and in what proportion?

4. **Format conventions.** What environments / commands / point notation / solution-block style does the exam use? Candidates need to drop in cleanly.

If structure is ambiguous (e.g., a flat document with no obvious problem boundaries), surface what you inferred and ask the user to confirm before generating.

## Interview phase (optional, generation mode only)

**Why this exists.** Without context, you can only infer each slot's topic from the surface form of the original problem — and that inference tends to be narrow. A problem about "lattice paths" gets re-interpreted as a problem about lattice paths, when the instructor may actually be testing the broader skill of "binomial counting" or "combinatorics" generally. A narrowly-inferred topic forces the candidate replacements to be near-clones in domain, which (a) hurts the security principle and (b) gives the instructor less variety to choose from.

The interview phase lets the instructor confirm or broaden your inferred topics *before* you generate, so the candidate pool is sized to what they actually want.

**When to skip.** Skip the interview if:

- The user passed `interview=false` as an argument.
- The user provided rich additional context (past exams, syllabus, problem bank) that already disambiguates topic scope. In this case, surface that you're skipping ("I have enough context from your syllabus; skipping the topic interview") and proceed.
- You are in iteration or assembly mode (the test plan was already established in generation).

**Procedure.**

1. After analysis, write a single chat message to the user containing **two parts**:

   **Part A — Global constraints.** A short list of constraints that affect every slot's calibration. Pre-fill any values you can infer from context (e.g., a syllabus that states an open-book policy); for the rest, ask:
   - **Scratch-tools policy**: closed-book, calculator allowed, formula sheet, open notes, open-book, etc. *Affects whether candidates need calculator-friendly numerics, standalone preambles, etc.*
   - **Time limit** (per problem and/or for the whole exam). *Affects difficulty calibration.*
   - **Other constraints** (e.g., "no proofs longer than half a page," "students don't know Bézout's identity").

   **Part B — Per-slot topic-scope table.** A compact table with **three columns of topic scope** at increasing widths:
   - **Narrow** — the specific skill the original surface form tests (e.g., "symmetric difference identity → cardinality → characterization").
   - **Broader** — the same skill across a wider domain of operations or framings (e.g., "set identities + derived cardinality + characterizing condition, on any binary/ternary set operation").
   - **Broadest** — the **course-unit level** scope: any problem on the same general unit of the course at the same difficulty (e.g., "any set-theory unit problem: identities, cardinality, partitions, subset relations, power sets, ..."). The broadest tier may include problems testing a *different specific skill* than the original.

   Plus a brief mention of two cross-cutting modifiers:
   - **Lateral broadening** (a per-slot modifier): "keep the technique, allow a different *substrate*." E.g., "broader + lateral on slot 2" means *same disprove-then-strengthen technique, but the substrate may be number theory, logic, or functions* (any substrate the course covers). Often the strongest security gap without loosening skill-parity.
   - **Broader still**: an iterative request that re-proposes wider scopes than the broadest column.

   Plus a one-line nudge: "If you have a syllabus or list of course units, sharing it (in chat or as a context file) lets me anchor the broadest tier to your actual course structure."

   Plus a one-line parity caveat: "Broadest-tier and lateral-broadening candidates may relax conceptual parity with the original — better security, but the specific skill or substrate tested may differ."

   One short paragraph telling the instructor what to do: confirm, pick a tier per slot, request lateral broadening, ask for "broader still," or skip.

   Example phrasing:
   ```
   Before generating, two things to confirm:

   ## Global constraints
   - Scratch-tools policy: ?  (closed-book / calculator / formula sheet / open-notes / open-book)
   - Time limit: ?            (per problem and/or whole exam)
   - Other constraints: ?

   ## Per-slot topic scope

   | Slot | Narrow                        | Broader                                | Broadest (unit-level)                          |
   |------|-------------------------------|----------------------------------------|------------------------------------------------|
   | 1    | symmetric difference          | set identities & cardinality           | any set-theory problem                         |
   | 4    | lattice paths                 | binomial counting + forced passage     | any combinatorics / counting problem           |
   | 8    | die-roll stopping             | discrete-RV stopping with symmetry     | any discrete-RV problem                        |
   | ...  |                               |                                        |                                                |

   You can also request **lateral broadening** per slot ("same technique, different substrate"),
   or **broader still** if even the broadest column is too narrow.

   If you have a syllabus or list of course units, sharing it lets me anchor the broadest
   tier to your actual course structure. Note: broadest-tier and lateral candidates may
   relax conceptual parity (the specific skill or substrate tested may differ).

   Reply with constraints + adjustments — e.g., "calculator allowed, 90 min total; use
   broader for all; lateral on slot 2; broadest for 4 and 8; broader still for 1" or
   "no calculator, 50 min; looks good, generate."
   ```

2. **Wait for the instructor's reply.** Do not generate until they respond.

3. Parse the reply:
   - **Global constraints** → record and apply during generation. Calculator-friendly = numerics that simplify cleanly (multi-step decimals fine, not e.g. $0.040375/0.045125$). Open-book = students can look up definitions; tighter time limits = less algebraic complexity.
   - "Looks good," "go ahead," "generate," or similar → use the inferred narrow topics for unspecified slots.
   - "Use [tier] for all" → apply that tier to every slot.
   - "[tier] for N, [tier] for M" → apply per-slot tiers.
   - "Lateral on N" or "broader + lateral on N" → keep the technique but open the substrate for that slot. Combine with any tier.
   - "Broader still for N" or "broader still globally" → re-propose with a wider scope (may go beyond the broadest column — cross-unit, related course area). Re-issue the table for the affected slots and wait again.
   - Free-text per-slot instructions ("for slot 4, also consider permutations and inclusion-exclusion") → record the expanded scope for that slot.
   - Mixed instructions are fine — apply each per slot. Treat the widest path as binding when multiple instructions touch the same slot.

4. The interview can loop. If the user says "broader still," re-propose and wait. Each loop adds at most one more level of width. After two or three loops, surface that you may be reaching the limit of useful broadening — courses don't usually have a meaningful "broader than the entire syllabus" scope.

5. Update the test plan with the confirmed (possibly broadened) topic scope for each slot. The test plan you write into the candidate file should reflect the *final* scope (with a note when the user broadened to a tier beyond narrow), not the initial inference.

6. Proceed to generation. The Generation Rule 7 ("stay strictly inside the concept scope of the original slot") now means strictly inside the *confirmed* scope, which may be much broader than the original surface topic.

**Note on parity.** Broadening to the *broader* tier does not loosen parity on difficulty, structure, subpart shape, or skill class — only on the conceptual domain. Broadening to the *broadest* tier (or beyond, via "broader still") begins to loosen skill-class parity: a slot that originally tested "symmetric difference cardinality" might be replaced by a slot testing "subset counting." Difficulty, length, and structural shape (subpart count, escalation) remain anchored to the original at every tier — the make-up should still feel like the same exam in every respect except the specific concept tested.

## Generation rules

For each slot in the original, generate `count` candidate replacements (default 3). Every candidate must:

1. **Test the same concepts and skills** as the original slot. Concept parity, not problem parity.

2. **Match the difficulty band and time budget** of the original slot. A 5-minute warm-up replacement is a 5-minute warm-up, not a 12-minute proof.

3. **Match the structural shape** of the original slot — same number of subparts, same kind of escalation. If the original has a 3-part build-on-previous structure (a → b uses (a)'s result → c synthesizes), the candidate should too.

4. **Be sufficiently distinct from the original** to satisfy the security principle (see "Foundational principle" above). A student who has seen the original must gain no unfair advantage. Change the *concrete domain* (e.g., disease-test Bayes → spam-filter Bayes), the *scenario*, the *specific numbers*, and the *surface framing*. A pure renumbering, a pure renaming, or a problem that has the same numerical answer is too transparent and defeats the purpose. When you draft a candidate, ask yourself: *if a student walked in having memorized the original, would my candidate cost them more than 1–2 minutes of "translation" effort beyond what a student who only knew the technique would spend?* If yes, it is distinct enough; if no, redraft.

5. **Every subpart must yield a concrete, gradable artifact** — a stated formula, an explicit case split, a constructed witness, a proven sub-claim, a counterexample, a computed numeric, a written algorithm. Do **not** include vague metacognitive subparts like "explain why this is hard" or "describe the key idea." If you want a meta subpart, rewrite it as a structural output: "state the contrapositive in symbols," "list the cases you'll use," "name the technique that applies." Reason: subparts must support partial credit and consistent grading.

6. **Be partial-credit-friendly.** Prefer build-on-previous, separable techniques (existence / uniqueness), or parallel structures (disprove + strengthen, compute + bound). Students should be able to earn substantial credit even if they can't finish the hardest subpart.

7. **Stay strictly inside the concept scope of the original slot.** Cross-topic synthesis is OK only if the original itself spans those topics or the additional context confirms they are in scope. Do not introduce material the class hasn't seen.

8. **Include a complete solution** for every candidate **but only if** the original exam included solutions. Solutions let the instructor verify correctness and grade consistently.

9. **Don't copy** any problem from the original or context verbatim. Close paraphrases that materially change scenario / numbers are acceptable; outright duplicates are not.

10. **Match the original's formatting conventions** — same environment names, subpart syntax, point notation, math delimiters — so a chosen candidate can be copy-pasted into the make-up exam without reformatting.

## Optional context handling

If the user provided additional context paths:

- **Past exams**: scan for problems on the same concepts as the slot you're replacing. Use them to calibrate exam-appropriate framing and to seed scenario ideas. Never copy verbatim. Note the source if you draw heavily from one ("inspired by 2018 Q4 framing").
- **Problem banks / homework / lecture notes**: use to confirm concept scope and difficulty band. Homework and lecture often supply better fresh domains than past exams (which can become predictable).
- **Syllabus**: use to confirm what's in scope. Cross-reference any cross-topic synthesis you propose.

If the additional context introduces topics not present in the original exam, ignore those parts — the make-up matches the original, not the full course.

## Output format

Write the result to a single markdown file next to the original exam, named `<original-stem>_makeup_candidates.md`. Examples:

- `final.tex` → `final_makeup_candidates.md`
- `Midterm 2.docx` → `Midterm 2_makeup_candidates.md`
- `exam_3_2025.pdf` → `exam_3_2025_makeup_candidates.md`

If the file already exists, ask the user whether to overwrite or write to a `.v2.md` variant.

The file structure:

````markdown
# Make-up Candidates for <original exam name>

_Generated YYYY-MM-DD from `<original-path>` (<format>)._
_Context sources: <list, or "none">._
_Candidates per slot: <N>._

## Test plan (extracted from original)

| Slot | Topic scope | Skills | Subparts | Difficulty | Est. time |
|------|-------------|--------|----------|------------|-----------|
| 1    | ...         | ...    | ...      | ...        | ...       |
| 2    | ...         | ...    | ...      | ...        | ...       |

The "Topic scope" column reflects the **confirmed** scope after the interview phase (or the inferred narrow scope, if the interview was skipped). When the instructor broadened a slot during the interview, write the broader scope here (e.g., "binomial counting (broadened from lattice paths)") so it's clear in the audit trail.

---

## Slot 1 — <topic> · <subpart count> subparts · ~<time> min · difficulty: <band>

**Original (excerpt for orientation):**

> <first ~300 chars of the original problem>

### Candidate 1A — <one-line distinguishing description>

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** <one sentence on why this candidate is a strong replacement for this slot — what it preserves from the original (technique, structure, difficulty) and what it changes (domain, scenario, numbers) to defeat memorization. Make it concrete enough that the instructor can decide at a glance.>

<problem statement, in the original exam's format>

**Solution.**

<complete solution>

### Candidate 1B — <one-line distinguishing description>

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** <one sentence — same idea, distinct from 1A>

...

### Candidate 1C — <one-line distinguishing description>

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** <one sentence — same idea, distinct from 1A and 1B>

...

**Feedback for next round** (instructor: add notes here if you want more candidates for this slot — e.g., "harder," "more proof-flavored," "drop the graph-theory framing," "use a domain other than dice"):

_(empty)_

---

## Slot 2 — ...
````

Each candidate must include a **Suitability** line — one sentence stating, concretely, why this candidate is a strong replacement for this slot. Name what is preserved (technique, structural shape, difficulty) and what is changed (domain, scenario, numbers). The suitability gloss is for the instructor's review at-a-glance; it is not a section heading or a formal write-up. Do not write more than one sentence per candidate.

For LaTeX-format originals, wrap each candidate's problem statement and solution in a ```` ```latex ```` fenced block so it renders cleanly and can be copied directly. For Word/PDF/markdown originals, render the candidate as plain markdown the instructor can paste back into their editor.

ID convention: `<slot-number><letter>` (1A, 1B, 1C, 2A, ...) so the instructor can refer to a specific candidate unambiguously when giving feedback or asking for revisions.

To choose a candidate, the instructor checks its **Keep** box (`- [x] **Keep**`). To mark one for avoidance in future rounds, they check its **Drop** box. Both checkboxes use GitHub Flavored Markdown task list syntax, which most editors (VS Code, GitHub web, Cursor, etc.) render as clickable checkboxes — instructors can toggle them with one click rather than editing the heading text. A candidate with neither box checked is "under consideration" — kept in the file for future rounds but not yet chosen.

When parsing a candidate's status, treat any of `- [x]`, `- [X]`, `* [x]`, `* [X]` as checked (markdown variants). Treat anything else (including `- [ ]` and a missing checkbox line) as unchecked.

## Report (generation mode)

After writing, print a short report:

- **Original exam**: `<path>` (`<format>`)
- **Slots identified**: `<N>`
- **Candidates generated**: `<N × count>`
- **Context sources used**: `<list, or "none">`
- **Output**: `<output-path>` written
- **Concerns**: any ambiguities in the original you flagged (e.g., "Slot 4 had no explicit point value; assumed equal weight," "Original problem 6 had figure I could not extract from the PDF; described it instead").

## Iteration mode

Triggered when the candidate file already exists and one or more **Feedback for next round** blocks have been filled in (i.e., contain anything other than `_(empty)_`).

Procedure:

1. Re-read the original exam and any context files (paths are recorded in the file header).
2. **Determine the next round number.** Scan the candidate file for existing `_Round k (YYYY-MM-DD), ..._` separators. The next round number is `max(k) + 1`, or `2` if none exist (Round 1 is always the initial generation). Iterations are unbounded — Round 5 or Round 10 is fine if curation requires it.
3. Read the candidate file. For each slot, classify:
   - **No feedback, no checked Drop boxes** → skip; leave the slot's existing candidates unchanged.
   - **Feedback present** → generate 1–2 additional candidates that address the feedback. Continue the letter sequence (if A–C exist, the new ones are D, E; if D–E already exist from a prior round, the new ones are F, G).
   - **Checked Drop boxes** → avoid the structural patterns or framings of dropped candidates in the new ones, even if there's no explicit textual feedback.
4. **Append** the new candidates *under* the existing ones for that slot. Do not delete or edit prior candidates — the file is a curation log; the instructor needs to see what was tried. Each new candidate gets its own pair of unchecked Keep / Drop checkboxes, just like the original ones.
5. Insert a dated separator above the new candidates within the slot:
   ```
   _Round N (YYYY-MM-DD), addressing feedback above:_
   ```
   where `N` is the round number computed in step 2.
6. **Preserve the consumed feedback as a quoted block.** Do *not* simply reset the feedback to `_(empty)_`. Instead:
   - Replace the existing `**Feedback for next round:**` header with `**Feedback for next round** (consumed by Round N):`
   - Quote the user's feedback text underneath as a markdown blockquote (`> ...`).
   - Then add a fresh empty `**Feedback for next round:**` block (with `_(empty)_` underneath) at the *bottom* of the slot, ready for the next round.

   Reason: the candidate file is the curation log. Future readers (including the instructor weeks later) need to see what each round of feedback addressed; resetting to empty orphans the audit trail.
7. Apply all the same generation rules (parity, distinctness, partial-credit, format match) — feedback overrides nothing about correctness or grading-friendliness.

Iteration can run any number of times. The file accumulates rounds; each round is dated and each consumed feedback block is preserved.

**Iteration report**: list which slots got new candidates (with round number and new IDs), and a one-line summary of the feedback addressed per slot.

## Assembly mode

Triggered when the candidate file has at least one **Keep** checkbox checked and the user is asking for the final make-up (or auto-detection picks assembly because no new feedback is pending).

Procedure:

1. Read the candidate file. For each slot, find the candidate whose **Keep** checkbox is checked (`- [x] **Keep**`, or its case/marker variants — see "Output format" for parsing rules).
2. Validate the *selection*:
   - **Every slot must have exactly one Keep checked.** If any slot has zero, list those slots and ask the instructor to check a Keep box. If any slot has more than one Keep checked, list those and ask which to use.
   - Warn (but do not block) if a candidate has *both* its Keep and Drop boxes checked — that's almost certainly a mistake; ask the instructor to clarify.
   - All chosen candidates have problem text and (if originally required) a solution.
3. **Confirm assembly options** with the user before writing. Ask in a single chat message:
   - **Title / header text** for the assembled exam. Default suggestion: append " (Make-up)" or " — Make-up" to the original's title (which you can usually parse from the original's preamble/header). If you can't auto-detect, ask explicitly.
   - **Version(s) to produce.** Common workflows need both:
     - **Combined** — problems with inline solutions (instructor / answer-key version).
     - **Student-facing** — problems only, with the `\begin{solution}…\end{solution}` blocks (or format-equivalent) stripped.
     - **Both** — write both files, naming them per the original's convention (e.g., if the original is `final_s.tex` with `_s` denoting "with solutions," write `final_s_makeup.tex` for combined and `final_makeup.tex` for student-facing).
   
     Auto-detect default: if the original's filename suggests a solution-included variant (`_s`, `_solutions`, `_with_answers`, etc.), default to **both** with mirrored naming. Otherwise default to **combined** and ask if a student-facing version is also wanted.
4. Assemble the chosen candidates into the output file(s) in the **same format as the original exam**:
   - Original `.tex` → write `<stem>_makeup.tex` (combined) and/or `<stem-without-solutions-marker>_makeup.tex` (student-facing). Reuse the original's preamble / packages / header / closing exactly; only the problem content and the title/header text change.
   - Original `.md` or `.txt` → write `<stem>_makeup.<same-ext>`.
   - Original `.docx` → write `<stem>_makeup.md` first, then convert with `pandoc <stem>_makeup.md -o <stem>_makeup.docx` if pandoc is available. If not, leave the markdown and tell the instructor.
   - Original `.pdf` → write `<stem>_makeup.md` (PDFs aren't generally regenerable from markup) and tell the instructor to typeset it themselves.
5. Preserve **slot order** from the original exam.
6. Do **not** modify the candidate file during assembly — it remains the curation history.
7. Do **not** overwrite the assembled output if it already exists; ask whether to overwrite or to write to a `.v2` variant.
8. **Sanity-check the assembled output before reporting success.** Run mechanical checks appropriate to the format:
   - **LaTeX outputs**: 
     - Count `\begin{X}` vs `\end{X}` for each environment used (`problem`, `solution`, `itemize`, `enumerate`, `align`, `align*`, `equation`, ...). Each pair must balance.
     - Search for typo'd closing tags using a regex like `\\end\{[a-z]*[^a-z}]` — catches `\end{problem>` (`>` instead of `}`), `\end{solution]`, etc.
     - Verify the number of `\begin{problem}` blocks equals the number of slots in the test plan.
     - Verify each problem's `\subproblem` count matches the test plan's expected subpart count.
   - **Markdown / Word / text outputs**: verify each chosen problem's first sentence appears in the output (catches missed copy-pastes).
   - If checks fail, fix automatically when safe (e.g., a single typo'd closing tag) and re-run the check; otherwise list the failures explicitly in the report and ask the user how to proceed. Do **not** report assembly success when sanity checks fail.

**Assembly report**: list which candidate (e.g., `Slot 1: 1B`, `Slot 2: 2D`) was chosen per slot, where the assembled exam was written (one path or two if both versions were produced), the result of the sanity checks ("✓ all balanced; no typo'd tags; 10 problems / 10 slots"), and any conversion or formatting caveats (missing preamble, pandoc not available, figure that needs to be redrawn, etc.).

## Important notes

- This skill operates on **one exam per invocation**. Don't loop across multiple exams unless the user explicitly asks.
- **Do not modify the original exam file or any context files.** The candidate markdown is the only output.
- **The instructor curates.** Your job in generation/iteration is to give them strong, distinct options per slot. Assembly is a separate step (assembly mode), invoked only when the instructor has marked their choices.
- If you cannot reliably extract slot structure from the input (scanned PDF, ambiguous Word formatting, etc.), stop and ask the user. Don't guess — a make-up exam built on a misread test plan is worse than no draft.
- Keep candidates within a slot **distinct from each other**, not just from the original. Three near-duplicate candidates give the instructor no real choice.
