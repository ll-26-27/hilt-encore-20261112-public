#!/usr/bin/env node
// gemini-image.mjs: a prompt (and optional reference images) in, an image file out,
// through HUIT's Google Gemini gateway.
//
// HUIT API: Google Gemini, POST /v1beta/models/<model>:generateContent
// with responseModalities TEXT + IMAGE. Reference images go in as inlineData.
//
//   node ll-utilities/huit/gemini-image.mjs --prompt "a watercolor of a lighthouse"
//   node ll-utilities/huit/gemini-image.mjs --prompt "same scene at night" --ref day.png

import { parseArgs } from 'node:util'
import { readFile, writeFile, access, stat } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { env, mask, fail as quit } from '../lib/env.mjs'

const HELP = `Usage: node ll-utilities/huit/gemini-image.mjs --prompt "<text>" [options]

Generates an image with HUIT's Gemini gateway (generateContent, image output).
Saves the image (PNG unless the model returns another type) and a small .json
beside it with the prompt, the model, and any text the model sent back.

Options:
  --prompt <text>     What to make, or how to change the reference images. Required.
  --ref <image>       A reference image (png, jpg, webp). Repeat for several.
  --aspect <ratio>    Aspect ratio, e.g. 1:1, 16:9, 9:16, 4:3.
  --model <id>        Default gemini-3.1-flash-image. Others on the gateway (Nov 12):
                      gemini-3.1-flash-lite-image, gemini-3-pro-image,
                      gemini-3.1-flash-image-preview, gemini-nano-banana-2.1
  --out <path>        Where to save. Default ./gemini-image-<date-time>.png
  --force             Replace an existing file.
  --dry-run           Print the request (key masked, images summarized) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_GEMINI_API_KEY    your Gemini key from the Harvard API Portal (required)
  HUIT_GEMINI_BASE_URL   default https://apis.huit.harvard.edu/ais-google-gemini`

const DEFAULT_BASE = 'https://apis.huit.harvard.edu/ais-google-gemini'
const IMAGE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.heic': 'image/heic' }
const EXTENSIONS = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' }
const MAX_REF_BYTES = 7 * 1024 * 1024 // Gemini's inline limit is ~20 MB per request, base64 included

const fail = message => quit('gemini-image', message)
const exists = path => access(path).then(() => true, () => false)

let args
try {
  args = parseArgs({
    options: {
      prompt: { type: 'string' },
      ref: { type: 'string', multiple: true, default: [] },
      aspect: { type: 'string' },
      model: { type: 'string', default: 'gemini-3.1-flash-image' },
      out: { type: 'string' },
      force: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const opt = args.values
if (opt.help) { console.log(HELP); process.exit(0) }
if (!opt.prompt) fail(`--prompt is required.\n\n${HELP}`)

const parts = []
const refSummary = []
for (const ref of opt.ref) {
  const path = resolve(ref)
  const info = await stat(path).catch(() => fail(`reference image not found: ${ref}`))
  const mimeType = IMAGE_TYPES[extname(path).toLowerCase()]
  if (!mimeType) fail(`${ref}: use png, jpg, webp, gif, or heic.`)
  if (info.size > MAX_REF_BYTES) fail(`${ref} is ${(info.size / 1048576).toFixed(1)} MB; keep reference images under 7 MB.`)
  parts.push({ inlineData: { mimeType, data: opt['dry-run'] ? '' : (await readFile(path)).toString('base64') } })
  refSummary.push(`${basename(path)} (${mimeType}, ${info.size} bytes)`)
}
parts.push({ text: opt.prompt })

const body = {
  contents: [{ role: 'user', parts }],
  generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
}
if (opt.aspect) body.generationConfig.imageConfig = { aspectRatio: opt.aspect }

const stamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
const requested = resolve(opt.out || `gemini-image-${stamp}.png`)
const key = env('HUIT_GEMINI_API_KEY')
const base = (env('HUIT_GEMINI_BASE_URL') || DEFAULT_BASE).replace(/\/+$/, '')
const url = `${base}/v1beta/models/${encodeURIComponent(opt.model)}:generateContent`

if (opt['dry-run']) {
  const shown = structuredClone(body)
  let i = 0
  for (const part of shown.contents[0].parts) if (part.inlineData) part.inlineData.data = `<base64 of ${refSummary[i++]}>`
  console.log(JSON.stringify({ method: 'POST', url, headers: { 'api-key': mask(key), 'content-type': 'application/json' }, body: shown, writes: requested }, null, 2))
  process.exit(0)
}

if (!key) fail('HUIT_GEMINI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
if (!opt.force && await exists(requested)) fail(`${requested} exists; pass --force to replace it.`)

console.error(`gemini-image: asking ${opt.model}${refSummary.length ? ` with ${refSummary.length} reference image(s)` : ''}…`)
const started = Date.now()
let response
try {
  response = await fetch(url, { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json' }, body: JSON.stringify(body) })
} catch (error) {
  fail(`could not reach the HUIT gateway: ${error.message}`)
}
const text = await response.text()
if (!response.ok) fail(`HUIT answered HTTP ${response.status} ${response.statusText}\n${text.split(key).join('[key]').slice(0, 1500)}`)

let data
try { data = JSON.parse(text) } catch { fail(`expected JSON, got: ${text.slice(0, 300)}`) }

const candidate = data.candidates?.[0]
const outParts = candidate?.content?.parts || []
const images = outParts.filter(part => part.inlineData?.data)
const said = outParts.filter(part => part.text && !part.thought).map(part => part.text).join('\n').trim()
if (!images.length) {
  fail(`no image came back (finishReason: ${candidate?.finishReason ?? data.promptFeedback?.blockReason ?? 'unknown'}).${said ? `\nThe model said: ${said}` : ''}`)
}

const written = []
for (const [index, part] of images.entries()) {
  const ext = EXTENSIONS[part.inlineData.mimeType] || extname(requested) || '.png'
  let path = requested.replace(/\.[a-z0-9]+$/i, '') + (images.length > 1 ? `-${index + 1}` : '') + ext
  await writeFile(path, Buffer.from(part.inlineData.data, 'base64'))
  written.push(path)
}
const sidecar = requested.replace(/\.[a-z0-9]+$/i, '') + '.json'
await writeFile(sidecar, JSON.stringify({
  model: opt.model, prompt: opt.prompt, references: refSummary, aspect: opt.aspect ?? null,
  text: said || null, images: written.map(path => basename(path)),
  usage: data.usageMetadata ?? null, created: new Date().toISOString(),
}, null, 2) + '\n')

if (said) console.error(`gemini-image: the model said: ${said}`)
console.error(`gemini-image: done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
for (const path of written) console.log(path)
