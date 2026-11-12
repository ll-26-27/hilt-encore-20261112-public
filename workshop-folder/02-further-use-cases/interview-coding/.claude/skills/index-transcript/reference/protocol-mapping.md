# Protocol-to-index mapping reference

Helper notes for the agent indexing a transcript. Anchor phrases below are typical interviewer cues that open each section; they are paraphrases of the protocol, not required wording. Use them to recognize section openings; do not require them.

## `background-education` — Protocol §1

Opens when the interviewer asks about the respondent's own past: where they grew up, what school was like for them, whether they themselves went to college.

Typical anchor cues:
- "tell me about where you grew up"
- "what was school like for you"
- "did you go to college / think about going / what happened"

Closes when the interviewer pivots to the respondent's children.

## `kids` — Protocol §2

Opens when the interviewer asks about the respondent's children in general — who they are, how they're doing in school, what they're like as people. This section is about the kids *as kids*, not yet about post-high-school plans.

Typical anchor cues:
- "tell me about your kids / your children"
- "how are they doing in school"
- "what are they into"

Closes when the interviewer asks about post-high-school plans or hopes.

## `hopes-after-hs` — Protocol §3

Opens when the interviewer asks the respondent what they hope for after high school, what conversations they've had with the kids about it, what kind of future they're imagining. Often the first time "college" or "trade" or "what's next" appears as a topic.

Typical anchor cues:
- "have you started thinking about what they'll do after high school"
- "what do you hope for them"
- "what have those conversations been like"

Note: respondents often slide directly from hopes-after-hs into college-meaning without an interviewer pivot. If the interviewer follows up with a college-specific question (meaning, programs, costs), open a new `college-meaning` header at that turn.

## `college-meaning` — Protocol §4

Opens when the interviewer asks specifically about *college* — what it means, what it is for, specific schools or programs, applications, costs, financial aid.

Typical anchor cues:
- "when you hear the word college, what comes to mind"
- "what do you think college is for"
- "have you looked at specific schools or programs"
- "what do you know about applications / costs / financial aid"

This section is often the longest in any given transcript.

## `sources-of-advice` — Protocol §5

Opens when the interviewer asks where the respondent gets information or advice: family, counselors, online, neighbors, other parents.

Typical anchor cues:
- "where do you go for advice / information"
- "who in your life has been through it"
- "what about school counselors / websites / family"

## `worries-barriers` — Protocol §6

Opens when the interviewer asks about worries, fears, or obstacles. Money, distance, the kid choosing wrong, debt, safety.

Typical anchor cues:
- "what worries you"
- "what feels like it's in the way"

## `reflections` — Protocol §7

Opens at the closing wrap-up: what the respondent wishes was different about the system, anything the interviewer didn't ask, anything they want recorded.

Typical anchor cues:
- "anything you wish was different"
- "anything I didn't ask that I should have"
- "anything else you want to say"

## Edge cases

- **Recurrence.** A topic can recur after a detour. Open a fresh header each time the interviewer's question re-opens it. Do not merge.
- **Drift.** If the respondent's answer wanders to a topic the protocol doesn't list (e.g. a long sidebar about a sibling's career), the section is still defined by the *interviewer's* opening question. Note the drift in the coverage report.
- **Compound questions.** If a single interviewer turn asks two protocol topics at once (rare in this protocol), open the section that the respondent actually answers first; note the second one in the coverage report.
- **Missing sections.** If the interviewer never asks a protocol section's question, do not invent one. List it as missing in the coverage report.
