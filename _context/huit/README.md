---
title: HUIT's AI API gateways
status: draft, 2026-11-12. Written from HUIT's API specs as exported from the Harvard API Portal on September 8, 2026, checked against the November 12, 2026 export (in the Harvard API Portal) and the kit's own live tests; see "What changed".
---

# HUIT's AI API gateways

Harvard University Information Technology (HUIT) runs gateways that pass your requests to OpenAI, Google Gemini, and Amazon Bedrock (which hosts Anthropic's Claude, Meta's Llama, Mistral, Amazon's Nova, and others) under Harvard's agreements with those companies. The scripts in [`../../ll-utilities/huit/`](../../ll-utilities/huit/) call them. You use your own key from the **Harvard API Portal**, https://portal.apis.huit.harvard.edu (sign in with HarvardKey).

**What HUIT says about data.** Each gateway's documentation opens: "THIS IS A PAY-AS-YOU-GO API, APPROVED FOR USE WITH LEVEL 3 CONFIDENTIAL DATA, WHICH REQUIRES A HUIT BILLING ID FOR HARVARD-INTERNAL BILLING." What the levels mean, and the one exception (Claude Fable 5 on Bedrock), are in [`../data-security/`](../data-security/).

**How current this is.** This page was written from HUIT's specs as exported on **September 8, 2026** and checked against the **November 12, 2026** export: OpenAI Direct 2.0.42 (was 2.0.40), Gemini 1.0.0, AWS Bedrock 2.0.0. Differences are under "What changed" at the bottom. Model lists in particular move faster than this file. Each gateway has an endpoint that lists what it offers today; use it.

**Building a script?** The route-by-route reference, from HUIT's specs as exported November 12, 2026 and marked with what this kit has tested, is in [`reference/`](reference/); HUIT's full specs are in the Harvard API Portal, https://portal.apis.huit.harvard.edu (sign in with HarvardKey).

## Getting a key (all three gateways)

1. **A HUIT billing number.** The gateways are pay-as-you-go, billed inside Harvard. Before HUIT approves access you need "a HUIT customer account number (B#####)." If you or your department administrator doesn't have one, the specs point to HUIT Finance's form for new customers: https://billing.huit.harvard.edu/portal/allusers/newcustomer. Ask your department first; most already have one.
2. **Register an app in the portal.** Sign in at https://portal.apis.huit.harvard.edu, register an app, choose the AI API(s) you want, and put your billing number in the app's description field. HUIT's steps: https://portal.apis.huit.harvard.edu/ai-services-request-access-with-billing.
3. **Wait for approval by email.** Then open your app in the portal (developer menu, upper right) to find the key. "After saving your app, you will receive both a key and a secret. The key is the one you will need to use."
4. **Set a spending cap** if you want one: write it in the app description, for example "limit of $100/month" or "limit of $10/day," and re-save. Each gateway has a `/apigee/quota` endpoint that shows what is left in the period.
5. Put the key in this repo's `.env` (see [`../../.env.example`](../../.env.example)). Never paste it into a chat, a document, or a commit.

The key goes in a **request header, never the URL**: HUIT blocks requests that put the key in the query string.

## The three gateways

### OpenAI Direct (v2)

- **Base URL:** `https://go.apis.huit.harvard.edu/ais-openai-direct/v2` (the examples use the `go.` host; the spec's server list gives `https://apis.huit.harvard.edu/ais-openai-direct/v2`).
- **Key header:** `api-key: <your key>` (HUIT's spec names it `X-Api-Key`; `api-key` is what its examples use, and it works, tested November 12)
- **Endpoints**, the same shape as OpenAI's own API: `/responses`, `/chat/completions`, `/completions`, `/conversations`, `/embeddings`, `/images/generations`, `/audio/transcriptions`, `/files`, `/batches`, `/vector_stores`, plus `/apigee/quota`. HUIT doesn't republish OpenAI's full spec and points to OpenAI's API reference for parameters.
- **Models:** "All newly released OpenAI models will be available as they become publicly released" (v2). Examples in the spec name `gpt-5` and `gpt-5.3-codex`. What the gateway listed on November 12 is in "What the live gateways show".
- **Transcription** (`POST /audio/transcriptions`, form data): model `whisper-1`; **25 MB file limit** ("divide your audio into smaller files" for longer recordings); HUIT always sets `response_format` to `verbose_json`, whatever you ask for, so transcripts come back with segments and timings. **Use `whisper-1` only**: the newer transcription models the gateway lists fail through it (see "What the live gateways show").
- **Streaming:** supported in v2 (`"stream": true`).
- **Developer tools:** v2 supports Codex CLI; the spec has setup notes for IDEs and client tools.
- **v1 is gone.** The November 12 spec: "v1 of this API (ais-openai-direct/v1) was retired on 10/1/26 and is no longer available; requests to it now return HTTP 410 Gone." Use v2.

### Gemini

- **Base URL:** `https://apis.huit.harvard.edu/ais-google-gemini`, then Google's own API version and path: `/v1beta/models/<model>:generateContent` (the version Google's newest models appear under), `/v1/…` (stable), `:streamGenerateContent` for streaming, `:predict` for embeddings.
- **Key header:** `api-key: <your key>` (the spec names it `X-Api-Key`; `api-key` works, tested November 12)
- **What it does:** "text generation, image generation, embeddings, and other AI capabilities"; streaming supported.
- **Models:** the spec's examples name `gemini-2.0-flash` and `gemini-3-pro-preview`. **List the current ones** with `GET /v1beta1/publishers/google/models` (only `v1beta1` works for listing). What it listed on November 12 is in "What the live gateways show".
- **Service level:** "There is no advertised API availability or response time Service Level Agreement (SLA) for the Gemini API at this time."

### AWS Bedrock (v2)

- **Base URL:** `https://apis.huit.harvard.edu/ais-bedrock-llm/v2`
- **Key header:** `x-api-key: <your key>` (note: different from the other two)
- **Endpoints:** `/model/<modelId>/invoke`, `/invoke-with-response-stream`, `/converse`, `/converse-stream`; `/foundation-models` and `/inference-profiles` to list what's offered; `/apigee/quota` (at `https://apis.huit.harvard.edu/ais-bedrock-llm/apigee/quota`).
- **Model IDs:** most current models use a cross-region prefix, `us.` (stays in the US) or `global.` (the largest pool, highest quotas): for example `us.anthropic.claude-sonnet-4-6`. Request and response formats differ by model family. What it listed on November 12 is in "What the live gateways show".
- **Claude Code:** the spec says v2 works with Claude Code, Cline, and boto3, and gives the environment variables for pointing Claude Code at the gateway.
- **Claude Fable 5** (`global.anthropic.claude-fable-5`) is the one model that runs in "provider data share mode" (Bedrock may retain your inference data and share it with Anthropic); prompts on some risky topics fall back to Claude Opus 4.8; and it costs more. The gateway now also lists Fable 5.1 and 5.2; the September spec names only Fable 5, and **we treat every Fable model as provider data share mode until HUIT says otherwise** (the kit's scripts warn on any Fable model ID). See [`../data-security/`](../data-security/) before using one.

## Limits and costs, in brief

- Pay-as-you-go at the providers' rates, billed to your HUIT billing number; caps are set by you in the app description.
- Rate limits: the specs list "Rate limit / quota exceeded" responses but **no numbers**. Not found.
- File limits: 25 MB for OpenAI transcription. Not found for the others.

## What the live gateways show (November 12, 2026)

Checked on November 12, 2026 with the kit's own key, through each gateway's free model-list endpoint, plus small tests of a few models. **Tested** means we sent a tiny, made-up request and it worked (or failed, as noted); **listed** means the model appears on the gateway's list and we have not tried it. A listed model is not a promise it works through HUIT.

| gateway | model | status |
| --- | --- | --- |
| OpenAI Direct | `whisper-1` | **tested**, transcription works as documented |
| OpenAI Direct | `gpt-4o-transcribe`, `gpt-transcribe` | **tested, fail**: HUIT rewrites `response_format` to `verbose_json`, and these models answer HTTP 400 ("response_format verbose_json is not compatible with model …"). Use `whisper-1`. |
| OpenAI Direct | `gpt-4o-mini-transcribe`, `gpt-4o-transcribe-diarize` | listed; expected to fail the same way |
| OpenAI Direct | `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`, `gpt-image-2.5-*`, `gpt-image-2.6-*` | listed |
| OpenAI Direct | `text-embedding-3-small`, `text-embedding-3-large` | listed |
| Gemini | `gemini-3.5-flash` | **tested**: text, images, and PDF in |
| Gemini | `gemini-3.1-flash-image` | **tested**: image generation |
| Gemini | `gemini-3.5-transcribe`, `gemini-embedding-2`, text-to-speech models | listed |
| Bedrock | `claude-sonnet-5-5`, `claude-haiku-5-5` (`us.` and `global.` profiles) | **tested** |
| Bedrock | `claude-opus-5-5` | listed |
| Bedrock | `claude-fable-5`, `claude-fable-5-1`, `claude-fable-5-2` | listed; the September spec names only Fable 5 for provider data share mode; **we treat all three as data-share until HUIT says otherwise**. Not for confidential data. |

In all, Bedrock listed 33 Claude inference profiles. Each script's own test record is in [`../../ll-utilities/README.md`](../../ll-utilities/README.md).

## What changed between the September 8 and November 12 specs

Compared on November 12, 2026, against HUIT's specs as exported from the Harvard API Portal that day:

- **OpenAI Direct 2.0.40 → 2.0.42.** v1 is retired: requests to it "now return HTTP 410 Gone." The v1-to-v2 migration notice is replaced by that sentence. Transcription is still documented for `whisper-1` only, with the 25 MB limit.
- **Gemini 1.0.0 and Bedrock 2.0.0:** version numbers unchanged.
- **Unchanged on all three:** the opening statement, "APPROVED FOR USE WITH LEVEL 3 CONFIDENTIAL DATA," and the billing-number requirement.
- **Fable:** the Bedrock spec still says "Fable 5 is the only model in this API for which the provider-data-share option is enabled" and doesn't mention Fable 5.1 or 5.2, which the gateway now lists. The kit still treats every Fable model as data-share (see the table above).
- **Key header:** the specs' security schemes name `X-Api-Key` for Gemini and OpenAI Direct, while their examples use `api-key`; both gateways accept `api-key` (tested November 12). Bedrock uses `x-api-key`.
- **Newer models on all three gateways**, and newer OpenAI transcription models that don't work through HUIT: see the table above.
- **Not checked:** rate limits (the specs give none), whether Fable 5.1 and 5.2 run in provider data share mode, and whether `gemini-3.5-transcribe` works through the gateway.
