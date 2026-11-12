# AWS Bedrock (`ais-bedrock-llm`)

- **Base URL:** `https://apis.huit.harvard.edu/ais-bedrock-llm`
- **Key header:** `x-api-key` (tested)
- **Spec:** HUIT AI Services, AWS Bedrock, in the Harvard API Portal (https://portal.apis.huit.harvard.edu, HarvardKey), version 2.0.0, exported November 12, 2026
- **Request bodies:** HUIT types every body as a generic JSON object; the AWS Bedrock API reference defines them: https://docs.aws.amazon.com/bedrock/latest/APIReference/welcome.html
- **In this kit:** [`ll-utilities/huit/claude.mjs`](../../../ll-utilities/huit/claude.mjs)

## Routes

| method | path | what it does | status (Nov 12, 2026) |
| --- | --- | --- | --- |
| GET | `/v2/foundation-models` | list base models (`modelSummaries[]`). Query: `byProvider` (e.g. `Anthropic`, `Meta`, `Mistral AI`), `byOutputModality` (TEXT, IMAGE, EMBEDDING), `byInferenceType` (ON_DEMAND, PROVISIONED), `byCustomizationType` | spec only |
| GET | `/v2/inference-profiles` | list cross-region inference profiles (`inferenceProfileSummaries[]`; use `inferenceProfileId`). Query: `type` (SYSTEM_DEFINED, APPLICATION), `maxResults` (1–1000), `nextToken` (URL-encode it: it can hold `+ / =`) | **tested** (`claude.mjs --list-models`: 33 Claude profiles) |
| POST | `/v2/model/{modelId}/invoke` | the model family's native request body | spec only |
| POST | `/v2/model/{modelId}/invoke-with-response-stream` | the same, streaming | spec only |
| POST | `/v2/model/{modelId}/converse` | one request format for every model family | **tested** (`claude.mjs`: Claude Sonnet 5.5 and Haiku 5.5) |
| POST | `/v2/model/{modelId}/converse-stream` | the same, streaming | spec only |
| GET | `/apigee/quota` | what's left of your budget (no `/v2`) | **tested** (`quota.mjs`) |

Answers: 200; 400 (bad request); 401 (key); 403 (a model you're not allowed); 429 (over budget).

## Model IDs

Use the cross-region (CRI) IDs, found with `GET /v2/inference-profiles` rather than typed from memory:

- `us.` keeps processing in US regions (us-east-1, us-east-2, us-west-2): data residency.
- `global.` routes worldwide: the highest quotas and about 10% cheaper, with no residency guarantee and sometimes more latency.
- Some on-demand models also accept a bare ID (e.g. `amazon.nova-micro-v1:0`).

**Claude Fable.** HUIT's spec says Claude Fable 5 (`global.anthropic.claude-fable-5`) is the only model on this gateway with **provider data share mode** on: a call to it opts that request into retention by Bedrock and sharing with the model provider. Its safeguards send harmful cyber, bio, chemical, and health prompts to Claude Opus 4.8 instead, and it is billed at AWS's pay-as-you-go rates. On November 12 the gateway also listed Fable 5.1 and 5.2, which the spec doesn't mention; this kit treats every Fable model as data-share, and `claude.mjs` warns before sending to one. Don't send confidential data to them. See [`../../data-security/`](../../data-security/).

## Request bodies

Converse, for any model (what `claude.mjs` sends):

```json
{ "messages": [{ "role": "user", "content": [{ "text": "..." }] }],
  "inferenceConfig": { "maxTokens": 10000 } }
```

Converse also takes AWS's `system`, `toolConfig`, `additionalModelRequestFields`, and more (AWS's Converse reference).

Invoke, native bodies:

```json
{ "anthropic_version": "bedrock-2023-05-31",
  "messages": [{ "role": "user", "content": [{ "type": "text", "text": "..." }] }],
  "max_tokens": 10000 }
```

- Llama: `{ "prompt": "...", "temperature": 0.5, "top_p": 0.9 }`
- Mistral: `{ "messages": [{ "role": "user", "content": "..." }], "max_tokens": 1000 }`

## Streaming

The spec says only that output handling "depends on client." From AWS's documentation (not HUIT's): Bedrock's streaming routes answer in AWS's binary event-stream framing (`application/vnd.amazon.eventstream`), not server-sent events, so a streaming script needs an event-stream decoder. That would mean a package, which this kit's scripts avoid; the non-streaming `converse` route is enough for most work.

## Claude Code through HUIT

HUIT documents running Claude Code against this gateway, so what Claude Code reads and sends goes through Harvard's Bedrock agreement and is billed to your HUIT key. The environment variables, per HUIT:

```
CLAUDE_CODE_USE_BEDROCK=1
CLAUDE_CODE_SKIP_BEDROCK_AUTH=1
ANTHROPIC_BEDROCK_BASE_URL=https://apis.huit.harvard.edu/ais-bedrock-llm/v2
ANTHROPIC_CUSTOM_HEADERS="x-api-key: <your key>"
CLAUDE_CODE_ATTRIBUTION_HEADER=0
ANTHROPIC_MODEL=<an inference profile ID>
ANTHROPIC_SMALL_FAST_MODEL=<an inference profile ID>
```

Not tested by this kit. Claude Code sends a lot (every file it reads, every turn), so set a budget cap first and watch `quota.mjs`. HUIT also documents Cline (provider Amazon Bedrock, region us-east-1, custom endpoint `…/ais-bedrock-llm/v2`, cross-region inference and caching on).
