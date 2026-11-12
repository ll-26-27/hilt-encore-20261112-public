#!/usr/bin/env node
// gpt.mjs: ask an OpenAI model a question through HUIT's OpenAI Direct gateway.
//
// HUIT API: OpenAI Direct v2, POST /responses (with --stream, the answer arrives as server-sent events).
//
//   node ll-utilities/huit/gpt.mjs "Explain retrieval practice in two sentences."
//   node ll-utilities/huit/gpt.mjs --file notes.md "Summarize these notes as five bullets."

import { parseArgs } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'
import { sseEvents } from '../lib/sse.mjs'

const HELP = `Usage: node ll-utilities/huit/gpt.mjs [options] "<prompt>"

Sends one prompt to an OpenAI model on HUIT's OpenAI Direct gateway (v2 /responses)
and prints the answer.

Options:
  --file <path>         Include a text file (Markdown, plain text, CSV) before the prompt. Repeatable.
  --system <text>       Instructions: who the model should be, how to answer.
  --model <id>          Default gpt-5-mini.
  --effort <level>      How hard a reasoning model thinks: minimal, low, medium, high.
  --max-tokens <n>      Longest answer in tokens, reasoning included. Default 4000.
  --out <path>          Also save the answer as a Markdown file.
  --stream              Print the answer as it is written, instead of all at once.
  --dry-run             Print the request (key masked) and send nothing.
  -h, --help            Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2`

const fail = message => quit('gpt', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      file: { type: 'string', multiple: true, default: [] },
      system: { type: 'string' },
      model: { type: 'string', default: 'gpt-5-mini' },
      effort: { type: 'string' },
      'max-tokens': { type: 'string', default: '4000' },
      out: { type: 'string' },
      stream: { type: 'boolean' },
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
if (opt.effort && !['minimal', 'low', 'medium', 'high'].includes(opt.effort)) fail('--effort must be minimal, low, medium, or high.')

let input = prompt
for (const file of opt.file.toReversed()) {
  const path = resolve(file)
  const text = await readFile(path, 'utf8').catch(() => fail(`file not found: ${file}`))
  input = `<file name="${basename(path)}">\n${text}\n</file>\n\n${input}`
}

const body = { model: opt.model, input, max_output_tokens: maxTokens }
if (opt.system) body.instructions = opt.system
if (opt.effort) body.reasoning = { effort: opt.effort }
if (opt.stream) body.stream = true

const g = gateway('openai')
const url = `${g.base}/responses`
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url, headers: { ...headers, [g.header]: mask(g.key) }, body }, null, 2))
  process.exit(0)
}
if (!g.key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')

const started = Date.now()
let response
try {
  response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
} catch (error) {
  fail(`could not reach the HUIT gateway: ${error.message}`)
}
if (!response.ok) {
  const text = (await response.text()).split(g.key).join('[key]')
  fail(`HUIT answered HTTP ${response.status} ${response.statusText}\n${text.slice(0, 1500)}`)
}

// The answer is in the "message" items of data.output; reasoning items carry no text.
const textOf = data => (data.output || [])
  .filter(item => item.type === 'message')
  .flatMap(item => item.content || [])
  .map(part => part.text ?? part.refusal ?? '')
  .join('').trim()

let data, answer
if (opt.stream) {
  // Each event has a type; the answer comes in "response.output_text.delta" pieces,
  // and the last event ("response.completed" or "response.incomplete") carries usage.
  answer = ''
  for await (const event of sseEvents(response)) {
    if (event.type === 'response.output_text.delta') { process.stdout.write(event.delta); answer += event.delta }
    else if (event.type === 'response.completed' || event.type === 'response.incomplete') data = event.response
    else if (event.type === 'error' || event.type === 'response.failed') fail(`the stream stopped: ${JSON.stringify(event.error ?? event.response?.error ?? event).slice(0, 500)}`)
  }
  if (answer) process.stdout.write('\n')
  answer = answer.trim()
  data ??= {}
} else {
  const text = await response.text()
  try { data = JSON.parse(text) } catch { fail(`expected JSON, got: ${text.slice(0, 300)}`) }
  answer = textOf(data)
}
const cutOff = data.status === 'incomplete' ? ` (incomplete: ${data.incomplete_details?.reason ?? 'unknown'}; raise --max-tokens)` : ''
if (!answer) fail(`no text came back${cutOff || ` (status: ${data.status ?? 'unknown'})`}.`)

if (!opt.stream) console.log(answer)
const usage = data.usage ? `, ${data.usage.input_tokens} tokens in, ${data.usage.output_tokens} out` : ''
console.error(`gpt: ${data.model ?? opt.model}, ${((Date.now() - started) / 1000).toFixed(1)}s${usage}${cutOff}`)
if (opt.out) {
  await writeFile(resolve(opt.out), `${answer}\n`)
  console.error(`gpt: saved ${resolve(opt.out)}`)
}
