---
title: HUIT's AI API gateways
status: draft, 2026-11-12. Written from HUIT's API specs as exported from the Harvard API Portal on September 8, 2026, plus the kit's own live tests. A check of the live portal (which needs HarvardKey) is pending; see "What may have changed".
---

# HUIT's AI API gateways

Harvard University Information Technology (HUIT) runs gateways that pass your requests to OpenAI, Google Gemini, and Amazon Bedrock (which hosts Anthropic's Claude, Meta's Llama, Mistral, Amazon's Nova, and others) under Harvard's agreements with those companies. The scripts in [`../../ll-utilities/huit/`](../../ll-utilities/huit/) call them. You use your own key from the **Harvard API Portal**, https://portal.apis.huit.harvard.edu (sign in with HarvardKey).

**What HUIT says about data.** Each gateway's documentation opens: "THIS IS A PAY-AS-YOU-GO API, APPROVED FOR USE WITH LEVEL 3 CONFIDENTIAL DATA, WHICH REQUIRES A HUIT BILLING ID FOR HARVARD-INTERNAL BILLING." What the levels mean, and the one exception (Claude Fable 5 on Bedrock), are in [`../data-security/`](../data-security/).

**How current this is.** Everything below, unless marked otherwise, is from HUIT's specs as exported on **September 8, 2026**: OpenAI Direct 2.0.40, Gemini 1.0.0, AWS Bedrock 2.0.0. Model lists in particular move faster than this file. Each gateway has an endpoint that lists what it offers today; use it.

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
- **Key header:** `api-key: <your key>`
- **Endpoints**, the same shape as OpenAI's own API: `/responses`, `/chat/completions`, `/completions`, `/conversations`, `/embeddings`, `/images/generations`, `/audio/transcriptions`, `/files`, `/batches`, `/vector_stores`, plus `/apigee/quota`. HUIT doesn't republish OpenAI's full spec and points to OpenAI's API reference for parameters.
- **Models:** "All newly released OpenAI models will be available as they become publicly released" (v2). Examples in the spec name `gpt-5` and `gpt-5.3-codex`.
- **Transcription** (`POST /audio/transcriptions`, form data): model `whisper-1`; **25 MB file limit** ("divide your audio into smaller files" for longer recordings); HUIT always sets `response_format` to `verbose_json`, whatever you ask for, so transcripts come back with segments and timings.
- **Streaming:** supported in v2 (`"stream": true`).
- **Developer tools:** v2 supports Codex CLI; the spec has setup notes for IDEs and client tools.
- **v1 is gone.** "v1 will remain available only through 9/30/26; beginning 10/1/26, only the v2 endpoint will be supported." Budget limits applied to v1 and v2 separately.

### Gemini

- **Base URL:** `https://apis.huit.harvard.edu/ais-google-gemini`, then Google's own API version and path: `/v1beta/models/<model>:generateContent` (the version Google's newest models appear under), `/v1/…` (stable), `:streamGenerateContent` for streaming, `:predict` for embeddings.
- **Key header:** `api-key: <your key>`
- **What it does:** "text generation, image generation, embeddings, and other AI capabilities"; streaming supported.
- **Models:** the spec's examples name `gemini-2.0-flash` and `gemini-3-pro-preview`. **List the current ones** with `GET /v1beta1/publishers/google/models` (only `v1beta1` works for listing).
- **Service level:** "There is no advertised API availability or response time Service Level Agreement (SLA) for the Gemini API at this time."

### AWS Bedrock (v2)

- **Base URL:** `https://apis.huit.harvard.edu/ais-bedrock-llm/v2`
- **Key header:** `x-api-key: <your key>` (note: different from the other two)
- **Endpoints:** `/model/<modelId>/invoke`, `/invoke-with-response-stream`, `/converse`, `/converse-stream`; `/foundation-models` and `/inference-profiles` to list what's offered; `/apigee/quota` (at `https://apis.huit.harvard.edu/ais-bedrock-llm/apigee/quota`).
- **Model IDs:** most current models use a cross-region prefix, `us.` (stays in the US) or `global.` (the largest pool, highest quotas): for example `us.anthropic.claude-sonnet-4-6`. Request and response formats differ by model family.
- **Claude Code:** the spec says v2 works with Claude Code, Cline, and boto3, and gives the environment variables for pointing Claude Code at the gateway.
- **Claude Fable 5** (`global.anthropic.claude-fable-5`) is the one model that runs in "provider data share mode" (Bedrock may retain your inference data and share it with Anthropic); prompts on some risky topics fall back to Claude Opus 4.8; and it costs more. See [`../data-security/`](../data-security/) before using it.

## Limits and costs, in brief

- Pay-as-you-go at the providers' rates, billed to your HUIT billing number; caps are set by you in the app description.
- Rate limits: the specs list "Rate limit / quota exceeded" responses but **no numbers**. Not found.
- File limits: 25 MB for OpenAI transcription. Not found for the others.

## What may have changed since September 8, 2026

- **Confirmed by our own test (November 12, 2026):** OpenAI Direct v2 transcription works as documented: `whisper-1`, `verbose_json` forced. See [`../../ll-utilities/README.md`](../../ll-utilities/README.md) for every script's test record.
- **Expected but not checked:** OpenAI Direct v1 should now be off (the spec said so for October 1). Newer models on all three gateways. The spec versions above may have moved on.
- **Not checked:** the live portal pages (they need HarvardKey; a browser check is pending), any change to the Level 3 approval, rate limits, and any new transcription model (for example OpenAI's newer speech-to-text models) on OpenAI Direct.
