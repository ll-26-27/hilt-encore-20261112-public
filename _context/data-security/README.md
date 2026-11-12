---
title: Harvard's data security levels, generative AI, and this kit
status: draft, 2026-11-12, morning. The Learning Lab may revise the wording for external tools once Harvard's pages are checked in a browser (see "Two lines" below).
---

# Harvard's data security levels, generative AI, and this kit

Read this before you send anything to a model. It has three parts: **what Harvard's sources say** (quoted, linked, dated), **what that means for this kit** (our reading, marked as ours), and **what we have not been able to check**.

Everything here was gathered on **November 12, 2026**. Harvard updates these pages; when this file and Harvard's page disagree, Harvard's page wins. The authoritative pages are:

- Harvard Information Security and Data Privacy, **Classify Risk**: https://privsec.harvard.edu/classify-risk
- **Data classification table**: https://privsec.harvard.edu/data-classification-table
- HUIT, **Generative AI Guidelines**: https://huit.harvard.edu/ai/guidelines
- HUIT, **AI tools at Harvard** (which tools are approved, for which levels): https://huit.harvard.edu/ai/tools
- PrivSec, **which collaboration tools can hold confidential data, by level**: https://privsec.harvard.edu/shield-data#collabtoolsmatrix

**How we read them.** These Harvard pages refuse automated requests, so on November 12 we could not load them from a script. What follows comes from three kinds of source, and each quote says which: **read** (we loaded the page itself), **excerpt** (the wording as a web search returned it from that page, not yet checked against the page), and **HUIT spec** (HUIT's own API documentation, exported from the Harvard API Portal on September 8, 2026 and kept in the Learning Lab's records).

## 1. The five levels

Harvard sorts data into five data security levels (DSL). The higher the level, the stricter the rules for where the data may go.

> "Harvard groups data into 5 data security levels depending on the sensitivity of the data. The DSL for data determines how that data must be managed."
> FAS Research Computing, *Data Security Levels*, https://docs.rc.fas.harvard.edu/kb/data-security-levels (read; page last updated August 7, 2026). The page says to treat https://privsec.harvard.edu/classify-risk as the up-to-date university source.

| level | Harvard's name (FASRC page, read) | in plain words |
| --- | --- | --- |
| **Level 1** | Public information | Already public, or meant to be: published papers, public web pages, a course catalog entry, anything you made up for a test. |
| **Level 2** | Low Risk | Not public, but low harm if disclosed: most internal Harvard business, drafts, internal memos. |
| **Level 3** | Medium Risk | Confidential: harm to people or to Harvard if disclosed. HUIT's guidelines name examples of confidential data (see below): non-public research data, finance, HR, student records, medical information. |
| **Level 4** | High Risk | Data that can do serious harm if disclosed, for example Social Security numbers and bank account numbers. |
| **Level 5** | Extreme Risk | Rare; data whose disclosure could cause severe harm. Researchers who think they have it contact their School's privacy and security officer. |

The "in plain words" column is our summary, not Harvard's text. Harvard's own examples for each level are in the data classification table (link above), which we could not load; check it when you are unsure. **If you can't tell which level something is, treat it as the higher one and ask.**

## 2. What Harvard says about generative AI tools

**Confidential data only goes into approved tools.**

> "Level 2 and above confidential data must only be entered into Generative AI tools that have been assessed and approved for such use."
> HUIT, *Generative AI Guidelines*, https://huit.harvard.edu/ai/guidelines (excerpt, November 12, 2026; not yet checked against the page).

The same guidelines, as excerpted, say confidential data "including non-public research data, finance, HR, student records, medical information" should not be entered into publicly available generative AI tools, and that vendor generative AI tools must be "assessed for risk by Harvard's Information Security and Data Privacy office prior to use" (both excerpts).

**One School's reading.** Harvard Medical School's IT office states the same rule more strictly for HMS work:

> "Use only approved AI tools for HMS work. Publicly available and personal AI tools aren't covered by Harvard agreements, so don't use them for HMS work, even with public data."
> "Most approved AI tools are approved for Level 3 and below."
> HMS IT, *Generative AI*, https://it.hms.harvard.edu/about/policies-and-guidelines/generative-ai (read, November 12, 2026; HMS only, no date on the page).

That page's list of approved tools at HMS (read): the Harvard AI Sandbox, Claude, ChatGPT Edu, Microsoft Copilot Premium, Adobe Firefly, and the **HUIT API Portal**, each at **Level 3**; HMS Azure AI and the Longwood cluster at Level 4; "No AI tool is approved for Level 5 data." It also warns that "a Data Use Agreement (DUA) may separately restrict a dataset's use or require the data provider's permission for use with AI." Other Schools may differ; the university-wide list is https://huit.harvard.edu/ai/tools, which we could not load.

**HUIT's AI API gateways describe themselves this way.** Each of the three gateway specs opens with the same sentence:

> "THIS IS A PAY-AS-YOU-GO API, APPROVED FOR USE WITH LEVEL 3 CONFIDENTIAL DATA, WHICH REQUIRES A HUIT BILLING ID FOR HARVARD-INTERNAL BILLING."
> HUIT API Portal: AI Services, OpenAI Direct (spec 2.0.40), Gemini (1.0.0), and AWS Bedrock (2.0.0) (HUIT spec, exported September 8, 2026; the live portal needs HarvardKey).

Each spec's terms of use add: "All existing, University-wide policies regarding data usage have been reviewed and MUST be followed," linking to the Generative AI Guidelines and the Information Security Policy (https://policy.security.harvard.edu/).

**One exception inside a gateway.** The Bedrock spec says one model, Claude Fable 5 (`global.anthropic.claude-fable-5`), runs in "provider data share mode," which "allows Amazon Bedrock to retain your inference data and share it with the model provider," and that "Fable 5 is the only model in this API for which the provider-data-share option is enabled" (HUIT spec, September 8). The spec does not say how this affects the Level 3 approval for that model. Until HUIT says otherwise, **we don't send confidential data to Fable 5**, even through the gateway.

## 3. What this means for this kit

This part is the Learning Lab's reading of the sources above, not Harvard's.

- **`ll-utilities/huit/`** calls HUIT's gateways. HUIT says they are approved for Level 3 confidential data. They are the route in this kit for anything that is not public, **with your own HUIT key**, within your School's and your data agreements' rules, and never Level 4 or 5.
- **`ll-utilities/external/`** calls tools outside Harvard's agreements: fal (image generation) and OpenRouter. As far as we can find, neither is on Harvard's list of approved generative AI tools. **Never send Level 3 or higher data to them**, and until the question in "Two lines" below is settled, **send them only public (Level 1) or made-up material**, as `CLAUDE.md` says.
- **Claude Code itself** sends what it reads to whichever model provider your Claude account uses. HMS lists Claude as approved for Level 3 at HMS; whether *your* Claude account is a Harvard-approved one depends on how you got it (a Harvard-provisioned account, or Claude Code pointed at the HUIT Bedrock gateway, versus a personal account). Check https://huit.harvard.edu/ai/tools or your School's IT office before opening a folder with confidential material in it.
- **Test with made-up material.** Every example in this kit uses synthetic audio (made with macOS `say`), invented text, and invented prompts. Do the same until you know where your data may go.

## Two lines, and which one this kit follows

The Learning Lab's starting line for the kit was: **nothing sent to an external tool should be Level 3 data.** HUIT's guidelines, as excerpted, draw the line lower: **"Level 2 and above confidential data must only be entered into Generative AI tools that have been assessed and approved for such use."** Read that way, an external tool that Harvard hasn't approved should get **public (Level 1) material only.** Until the guidelines are checked first-hand, this kit takes the stricter reading: `CLAUDE.md` says external tools get public or made-up material only, and the external scripts' printed warning says never Level 3 or higher. If in doubt, follow the stricter one.

## Not yet checked (November 12, 2026)

- The current text of https://huit.harvard.edu/ai/guidelines, https://huit.harvard.edu/ai/tools, https://privsec.harvard.edu/classify-risk, and https://privsec.harvard.edu/data-classification-table (all refuse automated requests). A check in a browser is pending.
- Whether fal or OpenRouter has been assessed by Harvard for any level: not found.
- Whether the HUIT gateways' Level 3 approval has changed since the September 8 specs: not checked. See [`../huit/`](../huit/).
