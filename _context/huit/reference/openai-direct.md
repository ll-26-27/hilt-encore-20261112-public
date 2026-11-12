# OpenAI Direct v2 (`ais-openai-direct`)

- **Base URL:** `https://apis.huit.harvard.edu/ais-openai-direct/v2` (HUIT's prose examples use `go.apis.huit.harvard.edu`; both hosts appear in HUIT's docs, and this kit uses `apis.`)
- **Key header:** `api-key` (tested; the spec names `X-Api-Key`)
- **Spec:** HUIT AI Services, OpenAI Direct, in the Harvard API Portal (https://portal.apis.huit.harvard.edu, HarvardKey), version 2.0.42, exported November 12, 2026
- **Request bodies:** HUIT defines only `{ "stream": true }`; take the rest from OpenAI's reference, https://developers.openai.com/api/reference/overview (spec: https://github.com/openai/openai-openapi)
- **In this kit:** [`transcribe.mjs`](../../../ll-utilities/huit/transcribe.mjs), [`gpt.mjs`](../../../ll-utilities/huit/gpt.mjs), [`gpt-image.mjs`](../../../ll-utilities/huit/gpt-image.mjs), [`embed.mjs`](../../../ll-utilities/huit/embed.mjs)

## Routes

Every route the gateway allows. Status is as of November 12, 2026.

### Responses and chat

| method | path | notes | status |
| --- | --- | --- | --- |
| POST | `/responses` | the Responses API; `"stream": true` streams; tools such as `web_search_preview` work, per HUIT | **tested** (`gpt.mjs`, `gpt-5-mini`) |
| GET | `/responses/{response_id}` | query `include[]` | spec only |
| POST | `/responses/{response_id}` | listed by HUIT; OpenAI's own API has no such route | spec only, probe first |
| GET | `/responses/{response_id}/input_items` | query `limit` (20), `order` (asc, desc), `after`, `before`, `include[]` | spec only |
| POST | `/chat/completions` | `"stream": true` streams | spec only |
| GET | `/chat/completions` | list stored completions; query `model`, `metadata`, `after`, `limit` (20), `order` | spec only |
| POST | `/completions` | legacy completions | spec only |
| POST | `/conversations` | create; HUIT's example body is `{ model, messages[] }` | spec only |
| GET | `/conversations/{conversation_id}` | retrieve | spec only |
| POST | `/conversations/{conversation_id}` | HUIT calls it "continue" (`{ model, messages[] }`); OpenAI uses it to update metadata | spec only, probe first |
| POST | `/decisions` | probabilities for structured questions (below) | spec only |

### Generation, embeddings, audio

| method | path | notes | status |
| --- | --- | --- | --- |
| POST | `/embeddings` | `{ model, input }` | **tested** (`embed.mjs`, `text-embedding-3-small`) |
| POST | `/images/generations` | `{ model, prompt, n, size }` | **tested** (`gpt-image.mjs`, `gpt-image-1-mini`) |
| POST | `/audio/transcriptions` | multipart form: `file`, `model`. **25 MB limit.** The gateway always sets `response_format=verbose_json` | **tested**: `whisper-1` works; `gpt-4o-transcribe` and `gpt-transcribe` **fail** (HTTP 400: they don't accept `verbose_json`). Use `whisper-1` |

### Files and batches

| method | path | notes | status |
| --- | --- | --- | --- |
| POST | `/files` | multipart `file`, `purpose` (`assistants`, `batch`, …) | spec only |
| GET | `/files/{file_id}` | metadata | spec only |
| GET | `/files/{file_id}/content` | the file itself | spec only |
| DELETE | `/files/{file_id}` | | spec only |
| POST | `/batches` | `{ input_file_id, endpoint: "/v1/chat/completions", completion_window: "24h" }`; upload the `.jsonl` input with purpose `batch` first | spec only |
| GET | `/batches` | query `limit`, `after` | spec only |
| GET | `/batches/{batch_id}` | | spec only |
| POST | `/batches/{batch_id}/cancel` | | spec only |

### Vector stores (documents you can search)

| method | path | notes | status |
| --- | --- | --- | --- |
| POST | `/vector_stores` | `{ name, file_ids[] }` | spec only |
| GET, POST, DELETE | `/vector_stores/{vector_store_id}` | retrieve, modify, delete | spec only |
| GET, POST | `/vector_stores/{vector_store_id}/files` | list files, attach a file | spec only |
| POST, DELETE | `/vector_stores/{vector_store_id}/files/{file_id}` | update attributes, detach | spec only |
| POST | `/vector_stores/{vector_store_id}/files/{file_id}/content` | listed as POST (OpenAI uses GET) | spec only, probe first |
| POST | `/vector_stores/{vector_store_id}/search` | `{ query, max_num_results }` | spec only |

### Budget

| method | path | status |
| --- | --- | --- |
| GET | `/apigee/quota` | **tested** (`quota.mjs`) |

### Not allowed (expect 403 or 404)

`GET /models`, `GET /files` and `GET /vector_stores` (the list routes), `DELETE /responses/{id}`, conversation item routes, `/audio/speech`, image edits and variations, moderations, fine-tuning, uploads, realtime. With no `GET /models`, the gateway can't tell a script which models exist; HUIT says new OpenAI models become available as they are publicly released.

Answers: 200; 400; 401 (wrong key or header); 403 (app not approved, or a route not allowed); 404; 429 (over budget); 500; 503 (OpenAI outage).

## Streaming

On `/chat/completions`, `/responses`, and `/conversations`: send `"stream": true` (and optionally `Accept: text/event-stream`); the answer is server-sent events. v2 no longer requires gzip.

## Decisions

HUIT's example: probabilities for yes-or-no questions about an input, billed for input tokens only. Several images in one request get one answer per question for the whole set.

```json
{ "model": "gpt-6-luna",
  "input": [{ "role": "user", "content": [
    { "type": "input_text", "text": "Inspect the product in this photo." },
    { "type": "input_image", "image_url": "data:image/png;base64,..." } ] }],
  "questions": [{ "type": "predicate", "name": "visible_damage",
    "instructions": "Does the product have visible damage?" }] }
```

Answer: `{ "answers": [{ "type": "predicate", "name": "visible_damage", "probability": 0.99 }], "usage": { … } }`.

## Tools through HUIT

Per HUIT; not tested by this kit:

- **OpenAI Python SDK:** `OpenAI(api_key=KEY, base_url="https://apis.huit.harvard.edu/ais-openai-direct/v2/", default_headers={"api-key": KEY})`
- **Codex CLI:** a `[model_providers.harvard-api-portal]` block in `~/.codex/config.toml` with `base_url = "https://apis.huit.harvard.edu/ais-openai-direct/v2"` and an `env_key` naming the variable that holds your key
- **Cline:** the "OpenAI Compatible" provider
