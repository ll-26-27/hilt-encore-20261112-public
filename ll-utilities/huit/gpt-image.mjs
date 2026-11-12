#!/usr/bin/env node
// gpt-image.mjs: a prompt (and optional reference images) in, an image file out,
// through HUIT's OpenAI Direct gateway.
//
// HUIT API: OpenAI Direct v2. A prompt alone goes to POST /images/generations.
// With --ref it goes to POST /responses with the image_generation tool, because
// HUIT doesn't allow /images/edits (tested Nov 12).
//
//   node ll-utilities/huit/gpt-image.mjs --prompt "a watercolor of a lighthouse"
//   node ll-utilities/huit/gpt-image.mjs --prompt "same character at night" --ref page.png

import { parseArgs } from 'node:util'
import { readFile, writeFile, access, stat } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/gpt-image.mjs --prompt "<text>" [options]

Generates an image with HUIT's OpenAI Direct gateway. A prompt alone uses
v2 /images/generations; with --ref it uses v2 /responses and its image_generation
tool (HUIT blocks /images/edits). Saves a PNG and a small .json beside it with
the prompt, model, and token usage.

Options:
  --prompt <text>     What to make, or how to change the reference images. Required.
  --ref <image>       A reference image (png, jpg, webp). Repeat for several.
                      Switches to /responses; slower (20–50 s in our tests).
  --model <id>        Image model. Default gpt-image-1-mini (cheapest). Also on the
                      gateway (Nov 12): gpt-image-1.5, gpt-image-2, gpt-image-2.5-flare, ...
  --responses-model <id>  With --ref, the model that calls the image tool.
                      Default gpt-5-mini.
  --size <WxH>        1024x1024 (default), 1536x1024 (wide), 1024x1536 (tall), or auto.
  --quality <q>       low, medium, high, or auto (default). Low is fastest and cheapest.
  --out <path>        Where to save. Default ./gpt-image-<date-time>.png
  --force             Replace an existing file.
  --dry-run           Print the request (key masked, images summarized) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2`

const IMAGE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const MAX_REF_BYTES = 7 * 1024 * 1024

const fail = message => quit('gpt-image', message)
const exists = path => access(path).then(() => true, () => false)

let args
try {
  args = parseArgs({
    options: {
      prompt: { type: 'string' },
      ref: { type: 'string', multiple: true, default: [] },
      model: { type: 'string', default: 'gpt-image-1-mini' },
      'responses-model': { type: 'string', default: 'gpt-5-mini' },
      size: { type: 'string', default: '1024x1024' },
      quality: { type: 'string', default: 'auto' },
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
if (!['low', 'medium', 'high', 'auto'].includes(opt.quality)) fail('--quality must be low, medium, high, or auto.')

const refs = []
for (const ref of opt.ref) {
  const path = resolve(ref)
  const info = await stat(path).catch(() => fail(`reference image not found: ${ref}`))
  const mimeType = IMAGE_TYPES[extname(path).toLowerCase()]
  if (!mimeType) fail(`${ref}: use png, jpg, or webp.`)
  if (info.size > MAX_REF_BYTES) fail(`${ref} is ${(info.size / 1048576).toFixed(1)} MB; keep reference images under 7 MB (shrink with: sips -Z 1024 ${ref}).`)
  refs.push({ path, mimeType, summary: `${basename(path)} (${mimeType}, ${info.size} bytes)` })
}
const editing = refs.length > 0

const stamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
const out = resolve(opt.out || `gpt-image-${stamp}.png`)

const g = gateway('openai')
const url = `${g.base}/${editing ? 'responses' : 'images/generations'}`
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

const imageUrl = async ref => opt['dry-run']
  ? `<base64 of ${ref.summary}>`
  : `data:${ref.mimeType};base64,${(await readFile(ref.path)).toString('base64')}`
const body = editing
  ? {
      model: opt['responses-model'],
      input: [{ role: 'user', content: [
        { type: 'input_text', text: opt.prompt },
        ...await Promise.all(refs.map(async ref => ({ type: 'input_image', image_url: await imageUrl(ref) }))),
      ] }],
      tools: [{ type: 'image_generation', model: opt.model, size: opt.size, quality: opt.quality }],
      tool_choice: { type: 'image_generation' },
    }
  : { model: opt.model, prompt: opt.prompt, n: 1, size: opt.size, quality: opt.quality }

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url, headers: { ...headers, [g.header]: mask(g.key) }, body, writes: out }, null, 2))
  process.exit(0)
}
if (!g.key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
if (!opt.force && await exists(out)) fail(`${out} exists; pass --force to replace it.`)

console.error(`gpt-image: asking ${opt.model} (${opt.size}, quality ${opt.quality})${editing ? ` through ${opt['responses-model']} with ${refs.length} reference image(s)` : ''}…`)
const started = Date.now()
let response
try {
  response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
} catch (error) {
  fail(`could not reach the HUIT gateway: ${error.message}`)
}
const text = (await response.text()).split(g.key).join('[key]')
if (!response.ok) fail(`HUIT answered HTTP ${response.status} ${response.statusText}\n${text.slice(0, 1500)}`)
let data
try { data = JSON.parse(text) } catch { fail(`expected JSON, got: ${text.slice(0, 300)}`) }

let b64, revised
if (editing) {
  const call = (data.output || []).find(item => item.type === 'image_generation_call')
  const said = (data.output || []).filter(item => item.type === 'message')
    .flatMap(item => item.content || []).map(part => part.text).filter(Boolean).join('\n')
  if (!call?.result) fail(`no image came back (status ${data.status})${said ? `; the model said:\n${said}` : ''}`)
  b64 = call.result
  revised = call.revised_prompt
} else {
  const image = data.data?.[0]
  if (!image?.b64_json) fail(`no image came back: ${text.slice(0, 300)}`)
  b64 = image.b64_json
  revised = image.revised_prompt
}
await writeFile(out, Buffer.from(b64, 'base64'))
await writeFile(out.replace(/\.[a-z0-9]+$/i, '') + '.json', JSON.stringify({
  model: opt.model, ...(editing && { responses_model: opt['responses-model'], references: refs.map(ref => ref.summary) }),
  prompt: opt.prompt, revised_prompt: revised ?? null,
  size: data.size ?? opt.size, quality: data.quality ?? opt.quality, image: basename(out),
  usage: data.usage ?? null, created: new Date().toISOString(),
}, null, 2) + '\n')

console.error(`gpt-image: done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
console.log(out)
