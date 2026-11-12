#!/usr/bin/env node
// embed.mjs: turn texts into embeddings (lists of numbers that place meaning in space)
// through HUIT's OpenAI Direct gateway, and show how similar the texts are.
//
// HUIT API: OpenAI Direct v2, POST /embeddings.
//
//   node ll-utilities/huit/embed.mjs "a cat on a mat" "a kitten on a rug" "quarterly budget"
//   node ll-utilities/huit/embed.mjs --lines questions.txt --out questions.embeddings.json

import { parseArgs } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/embed.mjs [options] "<text>" ["<text>" ...]

Gets an embedding for each text from HUIT's OpenAI Direct gateway (v2 /embeddings).
With two or more texts, prints how similar each pair is (cosine similarity: 1 is the
same meaning, near 0 unrelated). Save the vectors with --out to use them elsewhere.

Options:
  --lines <file>      Embed each non-empty line of a text file (in addition to any texts given).
  --model <id>        Default text-embedding-3-small. Also: text-embedding-3-large.
  --out <path>        Save texts and vectors as JSON.
  --dry-run           Print the request (key masked) and send nothing.
  -h, --help          Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY    your OpenAI Direct key from the Harvard API Portal (required)
  HUIT_OPENAI_BASE_URL   default https://apis.huit.harvard.edu/ais-openai-direct/v2`

const fail = message => quit('embed', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      lines: { type: 'string' },
      model: { type: 'string', default: 'text-embedding-3-small' },
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

const texts = [...positionals]
if (opt.lines) {
  const content = await readFile(resolve(opt.lines), 'utf8').catch(() => fail(`file not found: ${opt.lines}`))
  texts.push(...content.split('\n').map(line => line.trim()).filter(Boolean))
}
if (!texts.length) fail(`give at least one text.\n\n${HELP}`)

const body = { model: opt.model, input: texts }
const g = gateway('openai')
const url = `${g.base}/embeddings`
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url, headers: { ...headers, [g.header]: mask(g.key) }, body }, null, 2))
  process.exit(0)
}
if (!g.key) fail('HUIT_OPENAI_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')

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

const vectors = (data.data || []).sort((a, b) => a.index - b.index).map(item => item.embedding)
if (vectors.length !== texts.length) fail(`asked for ${texts.length} embeddings, got ${vectors.length}.`)

const cosine = (a, b) => {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2 }
  return dot / Math.sqrt(na * nb)
}
const short = t => (t.length > 40 ? t.slice(0, 39) + '…' : t)

console.log(`${texts.length} text(s), ${vectors[0].length} numbers each (${opt.model}, ${data.usage?.total_tokens ?? '?'} tokens)`)
if (texts.length > 1) {
  const pairs = []
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) pairs.push([cosine(vectors[i], vectors[j]), i, j])
  pairs.sort((a, b) => b[0] - a[0])
  console.log('\nmost similar first:')
  for (const [score, i, j] of pairs.slice(0, 20)) console.log(`  ${score.toFixed(3)}  "${short(texts[i])}"  ~  "${short(texts[j])}"`)
}
if (opt.out) {
  await writeFile(resolve(opt.out), JSON.stringify({ model: opt.model, items: texts.map((t, i) => ({ text: t, embedding: vectors[i] })) }) + '\n')
  console.error(`embed: saved ${resolve(opt.out)}`)
}
