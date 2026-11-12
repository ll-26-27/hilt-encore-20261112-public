# Google Gemini (`ais-google-gemini`)

- **Base URL:** `https://apis.huit.harvard.edu/ais-google-gemini` (the portal calls this API `ais-gemini-llm`; the path is still `ais-google-gemini`)
- **Key header:** `api-key` (tested; the spec names `X-Api-Key`)
- **Spec:** HUIT AI Services, Gemini, in the Harvard API Portal (https://portal.apis.huit.harvard.edu, HarvardKey), version 1.0.0, exported November 12, 2026
- **Request bodies:** Google's Gemini API reference, https://ai.google.dev/api, and the Vertex AI publisher-model docs
- **In this kit:** [`gemini.mjs`](../../../ll-utilities/huit/gemini.mjs) (text, with PDFs and images in), [`gemini-image.mjs`](../../../ll-utilities/huit/gemini-image.mjs) (images out)

`{version}` passes straight to Google: `v1beta` (where new models land first; this kit uses it), `v1`, `v1alpha`, or `v1beta1` (Vertex).

## Routes

| method | path | what it does | status (Nov 12, 2026) |
| --- | --- | --- | --- |
| POST | `/{version}/models/{model}:generateContent` | text and multimodal generation; Gemini image models also return images as `inline_data` | **tested**: `gemini-3.5-flash` (text; images and PDF in), `gemini-3.1-flash-image` (image out, from a prompt and from a reference image) |
| POST | `/{version}/models/{model}:streamGenerateContent` | the same, streamed as server-sent events (query `alt=sse`, header `Accept: text/event-stream`) | spec only |
| POST | `/{version}/models/{model}:embedContent` | embeddings, Gemini format | spec only |
| POST | `/{version}/models/{model}:predict` | Vertex-format embeddings, and Imagen image generation | spec only |
| POST | `/{version}/models/{model}:countTokens` | count a request's tokens | spec only |
| GET | `/{version}/publishers/google/models` | list available models; **only `v1beta1` works**. Query: `pageToken`, `pageSize` | **tested** (`v1beta1`) |
| GET | `/{version}/publishers/google/models/{model}` | one model's details; only `v1beta1` | spec only |
| GET | `/apigee/quota` | what's left of your budget | **tested** (`quota.mjs`) |

Listed on November 12 but not tried: `gemini-3.5-transcribe`, `gemini-embedding-2`, text-to-speech models, and more image models (`gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, `gemini-nano-banana-2.1`).

## Request bodies (the parts HUIT's spec defines; Google's reference has the rest)

`GenerateContentRequest`:

```json
{
  "contents": [{ "role": "user", "parts": [{ "text": "..." }] }],
  "systemInstruction": { "parts": [{ "text": "..." }] },
  "generationConfig": { "temperature": 0.7, "topP": 0.9, "topK": 40, "maxOutputTokens": 1024, "responseMimeType": "text/plain" },
  "tools": []
}
```

Files go in as parts: `{ "inlineData": { "mimeType": "application/pdf", "data": "<base64>" } }` (what `gemini.mjs --file` does). For image output, `gemini-image.mjs` adds `"generationConfig": { "responseModalities": ["TEXT", "IMAGE"] }`.

- `EmbedContentRequest`: `content { parts[] { text } }`, `taskType`, `title`, `outputDimensionality`
- `PredictRequest`: `instances[]` (e.g. `{ "content": "text" }` for embeddings, or a prompt for Imagen) and `parameters`

## Google's SDK through HUIT

Per HUIT (Python): `genai.Client(api_key=KEY, http_options=HttpOptions(base_url="https://apis.huit.harvard.edu/ais-google-gemini/"))`, with `vertexai=True` for listing models or `embed_content`. Not tested by this kit.
