#!/usr/bin/env node
// transcribe.mjs: audio (or a video's sound) in, Markdown transcript out, through HUIT's OpenAI
// Direct gateway.
//
// HUIT API: OpenAI Direct v2, POST /audio/transcriptions (multipart form).
// Which data levels it is approved for: HUIT's documentation says; see ll-utilities/README.md.
// Limits: 25 MB per file; HUIT forces response_format=verbose_json.
// Word timings (--words): HUIT passes timestamp_granularities[]=word through, but asking for word
// and segment together returns segments only (tested Nov 12), so --words asks for words alone.
//
//   node --env-file=.env ll-utilities/huit/transcribe.mjs interview.m4a
//   node --env-file=.env ll-utilities/huit/transcribe.mjs workshop.mov --words
//
// Writes interview.transcript.md and interview.transcript.json beside the audio; with --words,
// also <name>.words.json (the input for sound-bite picking and ll-utilities/video/).

import { parseArgs } from 'node:util'
import { readFile, stat, writeFile, access, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { env, mask, fail as quit } from '../lib/env.mjs'
import { probe, run } from '../lib/media.mjs'

const HELP = `Usage: node --env-file=.env ll-utilities/huit/transcribe.mjs <audio-or-video-file> [options]

Transcribes one audio file with HUIT's OpenAI Direct gateway (v2, /audio/transcriptions).
Writes <name>.transcript.md and <name>.transcript.json next to the audio. A video file
(mov, mkv, avi, or an mp4 or webm with a picture) has its sound extracted first with ffmpeg
(mono, 16 kHz MP3, removed afterwards); nothing else of the video is sent.

Options:
  --language <code>   Language of the audio, ISO-639-1 (e.g. en, es). Improves accuracy.
  --prompt <text>     Spelling hints: names, jargon, the previous passage.
  --timestamps        Put a [mm:ss] time before each segment (with --words, each sentence).
  --words             Also write <name>.words.json: every word with its start and end in
                      seconds, plus the probed source (frame rate, start timecode) for
                      picking sound bites and ll-utilities/video/. Needs ffprobe.
  --model <id>        Default whisper-1, the only one that works here (Nov 12): HUIT forces
                      verbose_json, which gpt-4o-transcribe and gpt-transcribe refuse (HTTP 400).
  --out <path>        Write the Markdown here instead (the JSON goes beside it).
  --force             Replace existing transcript files.
  --dry-run           Print the request (key masked) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2

Audio files over 25 MB are refused before upload (for a video, its extracted sound is
checked instead). Shrink speech with:
  ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a`

const MAX_BYTES = 25 * 1024 * 1024
const DEFAULT_BASE = 'https://apis.huit.harvard.edu/ais-openai-direct/v2'
const VIDEO_TYPES = new Set(['.mov', '.mkv', '.avi', '.mxf', '.m4v'])
const MAYBE_VIDEO = new Set(['.mp4', '.webm'])
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
  } else if (timestamps && Array.isArray(data.words) && data.words.length) {
    // Words only (--words). HUIT's words carry no punctuation, but the text does: when the text
    // splits into as many tokens as there are words, show those and break after . ? or !;
    // otherwise break every 30 words.
    const tokens = (data.text ?? '').trim().split(/\s+/)
    const punctuated = tokens.length === data.words.length
    let line = []
    data.words.forEach((w, i) => {
      line.push(punctuated ? tokens[i] : w.word)
      const end = punctuated ? /[.?!]["')\]]*$/.test(tokens[i]) : line.length === 30
      if (end || i === data.words.length - 1) {
        lines.push(`[${clock(data.words[i - line.length + 1].start)}] ${line.join(' ')}`, '')
        line = []
      }
    })
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
      words: { type: 'boolean' },
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
if (positionals.length !== 1) fail(`give exactly one audio or video file.\n\n${HELP}`)

const file = resolve(positionals[0])
const info = await stat(file).catch(() => fail(`file not found: ${positionals[0]}`))
if (!info.isFile()) fail(`not a file: ${positionals[0]}`)
const ext = extname(file).toLowerCase()
if (!VIDEO_TYPES.has(ext) && !AUDIO_TYPES[ext]) fail(`${basename(file)}: use an audio file (${Object.keys(AUDIO_TYPES).join(' ')}) or a video (${[...VIDEO_TYPES].join(' ')}).`)
// mp4 and webm can be sound only or video (HyperDeck records mp4): ffprobe looks for a picture.
// Without ffprobe they're sent as they are, as before.
let isVideo = VIDEO_TYPES.has(ext)
let noProbe = false
if (MAYBE_VIDEO.has(ext)) {
  try {
    const streams = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type:stream_disposition=attached_pic', '-of', 'json', file])).streams || []
    isVideo = streams.some(s => s.codec_type === 'video' && !s.disposition?.attached_pic)
  } catch (error) {
    if (!/not installed/.test(error.message)) fail(`couldn't read ${basename(file)}: ${error.message}`)
    noProbe = true
  }
}
// The 25 MB limit applies to what's sent: a video's extracted sound is checked after extraction.
if (!isVideo && info.size > MAX_BYTES) {
  fail(`${basename(file)} is ${(info.size / 1048576).toFixed(1)} MB; HUIT's limit is 25 MB. Shrink or split it first:\n  ffmpeg -i in.m4a -ac 1 -ar 16000 -b:a 32k out.m4a${noProbe ? `\nIf it's a video, install ffmpeg (brew install ffmpeg) and its sound will be extracted instead.` : ''}`)
}

const mdPath = opt.out ? resolve(opt.out) : join(dirname(file), `${basename(file, extname(file))}.transcript.md`)
const jsonPath = mdPath.replace(/\.md$/i, '') + '.json'
const wordsPath = join(dirname(file), `${basename(file, ext)}.words.json`)
const writes = opt.words ? [mdPath, jsonPath, wordsPath] : [mdPath, jsonPath]

const key = env('HUIT_OPENAI_API_KEY')
const base = (env('HUIT_OPENAI_BASE_URL') || DEFAULT_BASE).replace(/\/+$/, '')
const url = `${base}/audio/transcriptions`

const fields = { model: opt.model, response_format: 'verbose_json' }
if (opt.language) fields.language = opt.language
if (opt.prompt) fields.prompt = opt.prompt
if (opt.words) fields['timestamp_granularities[]'] = 'word'
else if (opt.timestamps) fields['timestamp_granularities[]'] = 'segment'

if (opt['dry-run']) {
  console.log(JSON.stringify({
    method: 'POST',
    url,
    headers: { 'api-key': mask(key) },
    form: { file: isVideo ? `the sound of ${basename(file)}, extracted as mono 16 kHz MP3` : `${basename(file)} (${info.size} bytes)`, ...fields },
    writes,
  }, null, 2))
  process.exit(0)
}

if (!key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
if (!opt.force) {
  for (const path of writes) if (await exists(path)) fail(`${path} exists; pass --force to replace it.`)
}

// --words needs the source's frame rate and start timecode; probe before spending anything.
let source = null
if (opt.words) {
  try { source = probe(file, { videoRequired: false }) } catch (error) { fail(error.message) }
}

let audioPath = file
let scratch = null
if (isVideo || (opt.words && source?.fps)) {
  scratch = await mkdtemp(join(tmpdir(), 'transcribe-'))
  audioPath = join(scratch, `${basename(file, ext)}.mp3`)
  console.error(`transcribe: extracting the sound of ${basename(file)}`)
  try {
    run('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:a:0', '-vn', '-ac', '1', '-ar', '16000', '-b:a', '48k', audioPath])
  } catch (error) {
    await rm(scratch, { recursive: true, force: true })
    fail(`couldn't extract the sound (does the video have an audio track?): ${error.message}`)
  }
  const size = (await stat(audioPath)).size
  if (size > MAX_BYTES) {
    await rm(scratch, { recursive: true, force: true })
    fail(`the extracted sound is ${(size / 1048576).toFixed(1)} MB; HUIT's limit is 25 MB. Split the video first.`)
  }
}

const form = new FormData()
const audioExt = extname(audioPath).toLowerCase()
const audioBytes = await readFile(audioPath)
if (scratch) await rm(scratch, { recursive: true, force: true })
form.set('file', new Blob([audioBytes], { type: AUDIO_TYPES[audioExt] || 'application/octet-stream' }), basename(audioPath))
for (const [name, value] of Object.entries(fields)) form.set(name, value)

console.error(`transcribe: sending ${basename(audioPath)} (${(audioBytes.length / 1024).toFixed(0)} KB) to ${url}`)
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

let words = null
if (opt.words) {
  // Same checks as the hackathon tools: every word timed, in order, inside the recording.
  const limit = (source.duration || data.duration || Infinity) + 0.1
  if (!data.words?.length) fail(`HUIT sent no word timings (keys: ${Object.keys(data).join(', ')}); nothing was written.`)
  if (data.words.some(w => !Number.isFinite(w.start) || !Number.isFinite(w.end) || w.start < 0 || w.end < w.start || w.end > limit)) {
    fail('HUIT sent word timings outside the recording; nothing was written.')
  }
  words = { schema: 1, file: wordsPath, source, provider: `huit/${opt.model}`, words: data.words.map((w, index) => ({ index, word: w.word, start: w.start, end: w.end })) }
}

await writeFile(jsonPath, JSON.stringify(data, null, 2) + '\n')
await writeFile(mdPath, markdown({ file, model: opt.model, data, timestamps: opt.timestamps }))
if (words) await writeFile(wordsPath, JSON.stringify(words, null, 2) + '\n')
console.error(`transcribe: done in ${((Date.now() - started) / 1000).toFixed(1)}s${words ? `, ${words.words.length} words timed` : ''}`)
for (const path of writes) console.log(path)
