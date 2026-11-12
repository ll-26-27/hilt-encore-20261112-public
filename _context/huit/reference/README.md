# HUIT AI API reference, for building scripts

What each of HUIT's three AI gateways accepts, written up from HUIT's OpenAPI specs (as exported from the Harvard API Portal, https://portal.apis.huit.harvard.edu, on November 12, 2026; signing in with HarvardKey shows the full specs) and checked against this kit's own live tests the same day. Use it when you ask Claude to write a new script in `ll-utilities/huit/`, or to understand one that's there.

- [`bedrock.md`](bedrock.md): AWS Bedrock, for Claude and other models (7 routes)
- [`gemini.md`](gemini.md): Google Gemini (8 routes)
- [`openai-direct.md`](openai-direct.md): OpenAI Direct v2 (24 paths, 33 methods)

**How to read it.** Each route is marked **tested** (a script in this kit called it on November 12, 2026, with a tiny made-up input, and it worked), **tested, fails** (it was tried and didn't work through HUIT), or **spec only** (HUIT lists it; we haven't tried it). The route lists are complete: they are what HUIT's gateways allow. The request bodies are not: all three gateways pass requests through to the provider, and HUIT defines full schemas only for the quota endpoint, so the provider's own API reference (linked on each page) defines what goes in a request.

Before sending anything, read [`../../data-security/`](../../data-security/): what data may go through these gateways, and the one model (Claude Fable) that HUIT runs in provider data share mode.

## What all three have in common

| | Bedrock | Gemini | OpenAI Direct |
| --- | --- | --- | --- |
| Base URL | `https://apis.huit.harvard.edu/ais-bedrock-llm` | `https://apis.huit.harvard.edu/ais-google-gemini` | `https://apis.huit.harvard.edu/ais-openai-direct/v2` |
| Key header | `x-api-key` | `api-key` | `api-key` |
| Key in the URL | blocked | blocked | blocked |
| Quota | `GET /apigee/quota` | `GET /apigee/quota` | `GET /v2/apigee/quota` (that is, `<base>/apigee/quota`) |
| Over budget | HTTP 429 | HTTP 429 | HTTP 429 |

- **Key header, tested.** HUIT's specs name the header `X-Api-Key` for Gemini and OpenAI Direct, while their prose examples use `api-key`. This kit's scripts send `api-key` to those two and `x-api-key` to Bedrock, and all of them worked on November 12. The scripts' settings are in [`ll-utilities/lib/gateways.mjs`](../../../ll-utilities/lib/gateways.mjs).
- **Host.** OpenAI Direct's prose examples use `go.apis.huit.harvard.edu`; the spec's server, and this kit, use `apis.huit.harvard.edu`, which works.
- **Key and secret.** Registering an app in the portal gives you a key and a secret. Use the key. Getting one is in [`../README.md`](../README.md).
- **Budget cap.** Write a limit such as `limit of $100/month` (or `/week`, `/day`, `/year`) in your app's description in the portal; the gateway applies it.
- **OpenAI Direct v1 is retired:** it answers **410 Gone** since October 1, 2026. Build against v2.

### The quota answer

All three return the same shape. Every value is a string.

```json
{
  "apigee_app_id": "your app ID in the Harvard API Portal",
  "quota": { "limit": "10000.0", "limit_unit": "USD", "interval": "1", "unit": "month" },
  "remaining_limit": "9361.70396"
}
```

(HUIT's example numbers.) To find what one call cost, read the quota before and after it and subtract; OpenAI v2 no longer adds the cost to its answers. `ll-utilities/huit/quota.mjs` reads all three and is free to run.

## What this kit covers, and what's left

| script | gateway · route |
| --- | --- |
| `transcribe.mjs` | OpenAI Direct · `POST /audio/transcriptions` |
| `gpt.mjs` | OpenAI Direct · `POST /responses` |
| `gpt-image.mjs` | OpenAI Direct · `POST /images/generations` |
| `embed.mjs` | OpenAI Direct · `POST /embeddings` |
| `gemini.mjs` | Gemini · `POST /v1beta/models/{model}:generateContent` (text out) |
| `gemini-image.mjs` | Gemini · the same route (image out) |
| `claude.mjs` | Bedrock · `POST /v2/model/{modelId}/converse`; `--list-models` uses `GET /v2/inference-profiles` |
| `quota.mjs` | all three · `GET /apigee/quota` |

Not yet written, as candidates for a script of your own (one route per script, with `--help` and `--dry-run`, like the others): streaming on any gateway; Gemini `:countTokens` and `:embedContent`; OpenAI Direct `/chat/completions`, `/decisions`, files and batches, and vector stores (upload documents, then search them). Start from the route's page here and the provider's reference, run `--dry-run` first, then one tiny live call, and record it in [`ll-utilities/README.md`](../../../ll-utilities/README.md).

## Claude Code and other tools through HUIT

HUIT documents how to point tools at its gateways, so your data goes through Harvard's agreements rather than a personal account: Claude Code through Bedrock ([`bedrock.md`](bedrock.md#claude-code-through-huit)), and the OpenAI SDK and Codex CLI through OpenAI Direct ([`openai-direct.md`](openai-direct.md#tools-through-huit)). This kit has not tested these setups; they bill your HUIT key for everything the tool sends.
