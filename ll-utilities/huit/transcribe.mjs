#!/usr/bin/env node
// transcribe.mjs: audio in, Markdown transcript out, through HUIT's OpenAI Direct gateway.
//
// HUIT API: OpenAI Direct v2, POST /audio/transcriptions (multipart form).
// HUIT says this gateway is approved for Level 3 confidential data.
// Limits: 25 MB per file; HUIT forces response_format=verbose_json.
//
//   node --env-file=.env ll-utilities/huit/transcribe.mjs interview.m4a
//
// Writes interview.transcript.md and interview.transcript.json beside the audio.

import { parseArgs } from 'node:util'
import { readFile, stat, writeFile, access } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { env, mask, fail as quit } from '../lib/env.mjs'

const HELP = `Usage: node --env-file=.env ll-utilities/huit/transcribe.mjs <audio-file> [options]

Transcribes one audio file with HUIT's OpenAI Direct gateway (v2, /audio/transcriptions).
Writes <name>.transcript.md and <name>.transcript.json next to the audio.

Options:
  --language <code>   Language of the audio, ISO-639-1 (e.g. en, es). Improves accuracy.
  --prompt <text>     Spelling hints: names, jargon, the previous passage.
  --timestamps        Put a [mm:ss] time before each segment in the Markdown.
  --model <id>        Default whisper-1 (the model HUIT documents for speech to text).
  --out <path>        Write the Markdown here instead (the JSON goes beside it).
  --force             Replace existing transcript files.
  --dry-run           Print the request (key masked) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2

Files over 25 MB are refused before upload. Shrink speech with:
  ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`

const MAX_BYTES = 25 * 1024 * 1024
const DEFAULT_BASE = 'https://apis.huit.harvard.edu/ais-openai-direct/v2'
const AUDIO_TYPES = { '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.mp4': 'audio/mp4', '.wav': 'audio/wav', '.webm': 'audio/webm', '.ogg': 'audio/ogg', '.flac': 'audio/flac', '.mpeg': 'audio/mpeg', '.mpga': 'audio/mpeg' }

const fail = message => quit('transcribe', message)

function clock(seconds) {
  const s = Math.floor(seconds)
  const hh = Math.floor(s / 3600)
  const mm = String(Math.floor(s / 60) % 60).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
}

function markdown({ file, model, data, timestamps }) {
  const lines = [
    `# Transcript: ${basename(file)}`,
    '',
    `- source: ${basename(file)}`,
    `- model: ${model} (HUIT OpenAI Direct)`,
    `- language: ${data.language ?? 'unknown'}`,
    `- duration: ${typeof data.duration === 'number' ? clock(data.duration) : 'unknown'}`,
    `- transcribed: ${new Date().toISOString()}`,
    '',
    '---',
    '',
  ]
  if (timestamps && Array.isArray(data.segments) && data.segments.length) {
    for (const seg of data.segments) lines.push(`[${clock(seg.start)}] ${seg.text.trim()}`, '')
  } else {
    lines.push((data.text ?? '').trim(), '')
  }
  return lines.join('\n')
}

async function exists(path) {
  return access(path).then(() => true, () => false)
}

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      language: { type: 'string' },
      prompt: { type: 'string' },
      timestamps: { type: 'boolean' },
      model: { type: 'string', default: 'whisper-1' },
      out: { type: 'string' },
      force: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }
if (positionals.length !== 1) fail(`give exactly one audio file.\n\n${HELP}`)

const file = resolve(positionals[0])
const info = await stat(file).catch(() => fail(`file not found: ${positionals[0]}`))
if (!info.isFile()) fail(`not a file: ${positionals[0]}`)
if (info.size > MAX_BYTES) {
  fail(`${basename(file)} is ${(info.size / 1048576).toFixed(1)} MB; HUIT's limit is 25 MB. Shrink or split it first:\n  ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`)
}

const mdPath = opt.out ? resolve(opt.out) : join(dirname(file), `${basename(file, extname(file))}.transcript.md`)
const jsonPath = mdPath.replace(/\.md$/i, '') + '.json'

const key = env('HUIT_OPENAI_API_KEY')
const base = (env('HUIT_OPENAI_BASE_URL') || DEFAULT_BASE).replace(/\/+$/, '')
const url = `${base}/audio/transcriptions`

const fields = { model: opt.model, response_format: 'verbose_json' }
if (opt.language) fields.language = opt.language
if (opt.prompt) fields.prompt = opt.prompt
if (opt.timestamps) fields['timestamp_granularities[]'] = 'segment'

if (opt['dry-run']) {
  console.log(JSON.stringify({
    method: 'POST',
    url,
    headers: { 'api-key': mask(key) },
    form: { file: `${basename(file)} (${info.size} bytes)`, ...fields },
    writes: [mdPath, jsonPath],
  }, null, 2))
  process.exit(0)
}

if (!key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
if (!opt.force) {
  for (const path of [mdPath, jsonPath]) if (await exists(path)) fail(`${path} exists; pass --force to replace it.`)
}

const form = new FormData()
const ext = extname(file).toLowerCase()
form.set('file', new Blob([await readFile(file)], { type: AUDIO_TYPES[ext] || 'application/octet-stream' }), basename(file))
for (const [name, value] of Object.entries(fields)) form.set(name, value)

console.error(`transcribe: sending ${basename(file)} (${(info.size / 1024).toFixed(0)} KB) to ${url}`)
const started = Date.now()
let response
try {
  response = await fetch(url, { method: 'POST', headers: { 'api-key': key }, body: form })
} catch (error) {
  fail(`could not reach the HUIT gateway: ${error.message}`)
}
const body = await response.text()
if (!response.ok) {
  fail(`HUIT answered HTTP ${response.status} ${response.statusText}\n${body.split(key).join('[key]').slice(0, 1500)}`)
}

let data
try { data = JSON.parse(body) } catch { fail(`expected JSON, got: ${body.slice(0, 300)}`) }

await writeFile(jsonPath, JSON.stringify(data, null, 2) + '\n')
await writeFile(mdPath, markdown({ file, model: opt.model, data, timestamps: opt.timestamps }))
console.error(`transcribe: done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
console.log(mdPath)
console.log(jsonPath)
