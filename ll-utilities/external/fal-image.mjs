#!/usr/bin/env node
// fal-image.mjs: a prompt in, image files out, through fal.ai's queue API.
//
// EXTERNAL: fal is a company outside Harvard, not a HUIT gateway. Public (Level 1) material only.
//
// fal API: POST https://queue.fal.run/<model> submits a job; the script polls its status_url,
// fetches its response_url, and downloads the images it lists.
// Models chosen for this kit:
//   fal-ai/nano-banana-2   (default) Google's Nano Banana 2: good at layout and lettering, takes reference images
//   fal-ai/flux/schnell    FLUX.1 schnell: fast and cheap, for quick tests; no reference images
//
//   node ll-utilities/external/fal-image.mjs "a lighthouse made of books, watercolor"
//
// Writes image-01.png (and more with --n) plus request.json and response.json into a new folder
// under _media/fal/ (gitignored), and prints the image paths.

import { parseArgs } from 'node:util'
import { readFile, writeFile, mkdir, stat, access } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EXTERNAL_HELP, warn } from './warning.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const MODELS = ['fal-ai/nano-banana-2', 'fal-ai/flux/schnell']
const DEFAULT_MODEL = MODELS[0]

const HELP = `Usage: node ll-utilities/external/fal-image.mjs "<prompt>" [options]

${EXTERNAL_HELP}

Generates images with fal.ai and saves them to a new folder under _media/fal/.

Options:
  --model <id>        ${MODELS.join(' (default) or ')}, or another fal endpoint ID
  --ref <image>       A local PNG, JPEG, or WebP to use as a reference; repeatable.
                      Nano Banana 2 then uses its /edit endpoint. The image is sent to fal too.
  --prompt-file <f>   Read the prompt from a text file instead.
  --aspect <ratio>    e.g. 1:1, 3:4, 16:9 (Nano Banana 2; default 1:1)
  --n <count>         How many images, 1 to 4 (default 1)
  --out <folder>      Save here instead (must not exist yet)
  --dry-run           Print the request (key masked) and send nothing.
  -h, --help          Show this help.

Environment (in .env at the repo root):
  FAL_API_KEY         your key from https://fal.ai/dashboard/keys (required)

List other fal models: node ll-utilities/external/fal-models.mjs
Cost is billed to the key's fal account; check the model's page on fal.ai for its price.`

const IMAGE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const MAX_REF_BYTES = 10 * 1024 * 1024

function fail(message) {
  console.error(`fal-image: ${message}`)
  process.exit(1)
}

function mask(key) {
  return key ? `[hidden, ${key.length} characters]` : '[NOT SET]'
}

async function exists(path) {
  return access(path).then(() => true, () => false)
}

// Use the environment if the key is already there (node --env-file), otherwise read .env at the repo root.
if (!process.env.FAL_API_KEY && await exists(join(ROOT, '.env'))) process.loadEnvFile(join(ROOT, '.env'))

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      model: { type: 'string', default: DEFAULT_MODEL },
      ref: { type: 'string', multiple: true, default: [] },
      'prompt-file': { type: 'string' },
      aspect: { type: 'string' },
      n: { type: 'string', default: '1' },
      out: { type: 'string' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }

if (opt['prompt-file'] && positionals.length) fail('give a prompt or --prompt-file, not both.')
const prompt = opt['prompt-file']
  ? await readFile(opt['prompt-file'], 'utf8').catch(() => fail(`file not found: ${opt['prompt-file']}`))
  : positionals.join(' ')
if (!prompt.trim()) fail(`give a prompt.\n\n${HELP}`)

const n = Number(opt.n)
if (!Number.isInteger(n) || n < 1 || n > 4) fail('--n must be 1, 2, 3, or 4.')
if (!/^[a-z0-9_-]+(\/[a-z0-9_.-]+)+$/i.test(opt.model) || opt.model.includes('..')) fail('--model must be a fal endpoint ID such as fal-ai/flux/schnell.')
if (opt.ref.length && opt.model === 'fal-ai/flux/schnell') fail('fal-ai/flux/schnell takes no reference images; use fal-ai/nano-banana-2.')

// Reference images travel inside the request as data URLs.
const refs = []
for (const file of opt.ref) {
  const type = IMAGE_TYPES[extname(file).toLowerCase()]
  if (!type) fail(`--ref must be PNG, JPEG, or WebP: ${file}`)
  const info = await stat(file).catch(() => fail(`file not found: ${file}`))
  if (info.size > MAX_REF_BYTES) fail(`${basename(file)} is over 10 MB; shrink it first (on a Mac: sips -Z 1536 -s format jpeg ${file} --out small.jpg)`)
  refs.push({ file: resolve(file), bytes: info.size, url: `data:${type};base64,${(await readFile(file)).toString('base64')}` })
}

// Nano Banana 2 has a separate endpoint for prompts with reference images.
const model = refs.length && opt.model === 'fal-ai/nano-banana-2' ? 'fal-ai/nano-banana-2/edit' : opt.model
const body = { prompt, num_images: n }
if (opt.aspect) body.aspect_ratio = opt.aspect
if (refs.length) body.image_urls = refs.map(r => r.url)

const key = process.env.FAL_API_KEY
const url = `https://queue.fal.run/${model}`
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const out = resolve(opt.out || join(ROOT, '_media', 'fal', `${stamp}-${model.split('/').pop()}`))

if (opt['dry-run']) {
  console.log(JSON.stringify({
    method: 'POST',
    url,
    headers: { Authorization: `Key ${mask(key)}` },
    body: { ...body, image_urls: refs.length ? refs.map(r => `${basename(r.file)} (${r.bytes} bytes, as a data URL)`) : undefined },
    writes: out,
  }, null, 2))
  process.exit(0)
}

if (!key) fail('FAL_API_KEY is not set. Copy .env.example to .env and add your fal key.')
if (await exists(out)) fail(`${out} exists; choose another --out.`)

const headers = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' }
const scrub = text => String(text).split(key).join('[key]')

async function getJson(target, init) {
  let response
  try {
    response = await fetch(target, init)
  } catch (error) {
    fail(`could not reach fal: ${error.message}`)
  }
  const text = await response.text()
  if (!response.ok) fail(`fal answered HTTP ${response.status} ${response.statusText}\n${scrub(text).slice(0, 1500)}`)
  try { return JSON.parse(text) } catch { fail(`expected JSON, got: ${scrub(text).slice(0, 300)}`) }
}

warn('fal.ai', refs.length ? `your prompt and ${refs.length} image(s)` : 'your prompt')
await mkdir(out, { recursive: true })
await writeFile(join(out, 'request.json'), JSON.stringify({ model, url, created: new Date().toISOString(), ...body, image_urls: refs.map(r => r.file) }, null, 2) + '\n')

const started = Date.now()
const job = await getJson(url, { method: 'POST', headers, body: JSON.stringify(body) })
console.error(`fal-image: job ${job.request_id} queued with ${model}; waiting`)

// Poll every two seconds, for up to five minutes. A job that times out is not resubmitted.
let status
for (let waited = 0; ; waited += 2000) {
  status = await getJson(job.status_url, { headers })
  if (status.status === 'COMPLETED') break
  if (!['IN_QUEUE', 'IN_PROGRESS'].includes(status.status)) fail(`unexpected job status: ${JSON.stringify(status).slice(0, 500)}`)
  if (waited > 300_000) fail(`still ${status.status} after five minutes; job ${job.request_id}. Nothing was resubmitted.`)
  await new Promise(done => setTimeout(done, 2000))
}

const result = await getJson(job.response_url, { headers })
await writeFile(join(out, 'response.json'), JSON.stringify(result, null, 2) + '\n')
const images = result.images || []
if (!images.length) fail(`fal returned no images; see ${join(out, 'response.json')}`)

const saved = []
for (const [i, image] of images.entries()) {
  // fal's image links are public CDN URLs: they never get the key.
  const download = await fetch(image.url)
  if (!download.ok) fail(`image download failed (HTTP ${download.status}); the link is in response.json`)
  const ext = { 'image/jpeg': 'jpg', 'image/webp': 'webp' }[download.headers.get('content-type')] || 'png'
  const path = join(out, `image-${String(i + 1).padStart(2, '0')}.${ext}`)
  await writeFile(path, Buffer.from(await download.arrayBuffer()))
  saved.push(path)
}
if (result.description) console.error(`fal-image: model said: ${result.description}`)
console.error(`fal-image: done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
for (const path of saved) console.log(path)
