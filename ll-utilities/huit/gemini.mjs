#!/usr/bin/env node
// gemini.mjs: ask a Google Gemini model a question through HUIT's Gemini gateway.
//
// HUIT API: Google Gemini, POST /v1beta/models/<model>:generateContent.
// Text files go in as text; PDFs and images go in as inlineData, so Gemini can read them.
//
//   node ll-utilities/huit/gemini.mjs "Explain retrieval practice in two sentences."
//   node ll-utilities/huit/gemini.mjs --file handout.pdf "List the three main claims."

import { parseArgs } from 'node:util'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/gemini.mjs [options] "<prompt>"

Sends one prompt to a Gemini model on HUIT's Gemini gateway (generateContent) and
prints the answer.

Options:
  --file <path>         Include a file before the prompt. Repeatable. Text files (md, txt,
                        csv, json, html) go in as text; pdf, png, jpg, webp go in as data
                        the model reads (max 15 MB each).
  --system <text>       A system instruction: who the model should be, how to answer.
  --model <id>          Default gemini-3.5-flash. Also on the gateway (Nov 12):
                        gemini-3.5-flash-lite, gemini-3.1-pro-preview, gemini-2.5-pro, and more.
  --max-tokens <n>      Longest answer in tokens (thinking included). Default 4000.
  --out <path>          Also save the answer as a Markdown file.
  --dry-run             Print the request (key masked, files summarized) and send nothing.
  -h, --help            Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_GEMINI_API_KEY    your Gemini key from the Harvard API Portal (required)
  HUIT_GEMINI_BASE_URL   default https://apis.huit.harvard.edu/ais-google-gemini`

const TEXT = new Set(['.md', '.txt', '.csv', '.json', '.html', '.htm', '.xml', '.tsv', '.yaml', '.yml'])
const DATA = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const MAX_DATA_BYTES = 15 * 1024 * 1024 // inline requests top out around 20 MB, base64 included

const fail = message => quit('gemini', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      file: { type: 'string', multiple: true, default: [] },
      system: { type: 'string' },
      model: { type: 'string', default: 'gemini-3.5-flash' },
      'max-tokens': { type: 'string', default: '4000' },
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

const prompt = positionals.join(' ').trim()
if (!prompt) fail(`give a prompt.\n\n${HELP}`)
const maxTokens = Number(opt['max-tokens'])
if (!Number.isInteger(maxTokens) || maxTokens < 1) fail('--max-tokens must be a whole number above 0.')

const parts = []
for (const file of opt.file) {
  const path = resolve(file)
  const info = await stat(path).catch(() => fail(`file not found: ${file}`))
  const ext = extname(path).toLowerCase()
  if (TEXT.has(ext)) {
    parts.push({ text: `<file name="${basename(path)}">\n${await readFile(path, 'utf8')}\n</file>` })
  } else if (DATA[ext]) {
    if (info.size > MAX_DATA_BYTES) fail(`${file} is ${(info.size / 1048576).toFixed(1)} MB; keep files under 15 MB.`)
    const data = opt['dry-run'] ? `<base64 of ${basename(path)}, ${info.size} bytes>` : (await readFile(path)).toString('base64')
    parts.push({ inlineData: { mimeType: DATA[ext], data } })
  } else {
    fail(`${file}: use a text file (${[...TEXT].join(' ')}) or ${Object.keys(DATA).join(' ')}.`)
  }
}
parts.push({ text: prompt })

const body = { contents: [{ role: 'user', parts }], generationConfig: { maxOutputTokens: maxTokens } }
if (opt.system) body.systemInstruction = { parts: [{ text: opt.system }] }

const g = gateway('gemini')
const url = `${g.base}/v1beta/models/${encodeURIComponent(opt.model)}:generateContent`
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url, headers: { ...headers, [g.header]: mask(g.key) }, body }, null, 2))
  process.exit(0)
}
if (!g.key) fail('HUIT_GEMINI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')

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

const candidate = data.candidates?.[0]
const answer = (candidate?.content?.parts || []).filter(part => !part.thought).map(part => part.text ?? '').join('').trim()
const reason = candidate?.finishReason ?? data.promptFeedback?.blockReason ?? 'unknown'
if (!answer) fail(`no text came back (finishReason: ${reason}${reason === 'MAX_TOKENS' ? '; raise --max-tokens' : ''}).`)

console.log(answer)
const u = data.usageMetadata
const usage = u ? `, ${u.promptTokenCount} tokens in, ${(u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0)} out` : ''
console.error(`gemini: ${data.modelVersion ?? opt.model}, ${((Date.now() - started) / 1000).toFixed(1)}s${usage}${reason === 'MAX_TOKENS' ? ' (cut off: raise --max-tokens)' : ''}`)
if (opt.out) {
  await writeFile(resolve(opt.out), `${answer}\n`)
  console.error(`gemini: saved ${resolve(opt.out)}`)
}
