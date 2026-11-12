#!/usr/bin/env node
// gpt-image.mjs: a prompt in, an image file out, through HUIT's OpenAI Direct gateway.
//
// HUIT API: OpenAI Direct v2, POST /images/generations.
//
//   node ll-utilities/huit/gpt-image.mjs --prompt "a watercolor of a lighthouse"

import { parseArgs } from 'node:util'
import { writeFile, access } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/gpt-image.mjs --prompt "<text>" [options]

Generates an image with HUIT's OpenAI Direct gateway (v2 /images/generations).
Saves a PNG and a small .json beside it with the prompt, model, and token usage.

Options:
  --prompt <text>     What to make. Required.
  --model <id>        Default gpt-image-1-mini (cheapest). Also on the gateway (Nov 12):
                      gpt-image-1.5, gpt-image-2, gpt-image-2.5-flare, gpt-image-2.6-flare, ...
  --size <WxH>        1024x1024 (default), 1536x1024 (wide), 1024x1536 (tall), or auto.
  --quality <q>       low, medium, high, or auto (default). Low is fastest and cheapest.
  --out <path>        Where to save. Default ./gpt-image-<date-time>.png
  --force             Replace an existing file.
  --dry-run           Print the request (key masked) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2`

const fail = message => quit('gpt-image', message)
const exists = path => access(path).then(() => true, () => false)

let args
try {
  args = parseArgs({
    options: {
      prompt: { type: 'string' },
      model: { type: 'string', default: 'gpt-image-1-mini' },
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

const body = { model: opt.model, prompt: opt.prompt, n: 1, size: opt.size, quality: opt.quality }
const stamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
const out = resolve(opt.out || `gpt-image-${stamp}.png`)

const g = gateway('openai')
const url = `${g.base}/images/generations`
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url, headers: { ...headers, [g.header]: mask(g.key) }, body, writes: out }, null, 2))
  process.exit(0)
}
if (!g.key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
if (!opt.force && await exists(out)) fail(`${out} exists; pass --force to replace it.`)

console.error(`gpt-image: asking ${opt.model} (${opt.size}, quality ${opt.quality})…`)
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

const image = data.data?.[0]
if (!image?.b64_json) fail(`no image came back: ${text.slice(0, 300)}`)
await writeFile(out, Buffer.from(image.b64_json, 'base64'))
await writeFile(out.replace(/\.[a-z0-9]+$/i, '') + '.json', JSON.stringify({
  model: opt.model, prompt: opt.prompt, revised_prompt: image.revised_prompt ?? null,
  size: data.size ?? opt.size, quality: data.quality ?? opt.quality, image: basename(out),
  usage: data.usage ?? null, created: new Date().toISOString(),
}, null, 2) + '\n')

console.error(`gpt-image: done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
console.log(out)
