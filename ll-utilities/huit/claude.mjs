#!/usr/bin/env node
// claude.mjs: ask Claude a question through HUIT's Amazon Bedrock gateway.
//
// HUIT API: Bedrock v2, POST /v2/model/<model>/converse (the same body for every model).
//
//   node ll-utilities/huit/claude.mjs "Explain retrieval practice in two sentences."
//   node ll-utilities/huit/claude.mjs --file notes.md "Summarize these notes as five bullets."

import { parseArgs } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { mask, fail as quit } from '../lib/env.mjs'
import { gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/claude.mjs [options] "<prompt>"

Sends one prompt to Claude on HUIT's Bedrock gateway (v2 converse) and prints the answer.

Options:
  --file <path>         Include a text file (Markdown, plain text, CSV) before the prompt. Repeatable.
  --system <text>       A system prompt: who Claude should be, how to answer.
  --model <id>          Default us.anthropic.claude-sonnet-5-5. Also on the gateway (Nov 12):
                        us.anthropic.claude-haiku-5-5 (faster, cheaper), us.anthropic.claude-opus-5-5,
                        and global.* versions of each. List them all with --list-models.
                        Fable models: HUIT's Bedrock documentation says Fable 5 runs in
                        "provider data share mode" (Bedrock may keep your input and share it
                        with Anthropic). Don't send confidential data to any Fable model; see
                        ll-utilities/README.md (the data rule). The script warns before it sends.
  --max-tokens <n>      Longest answer, in tokens. Default 1024.
  --out <path>          Also save the answer as a Markdown file.
  --list-models         List the Claude models the gateway offers (free) and exit.
  --dry-run             Print the request (key masked) and send nothing.
  -h, --help            Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_BEDROCK_API_KEY    your Bedrock key from the Harvard API Portal (required)
  HUIT_BEDROCK_BASE_URL   default https://apis.huit.harvard.edu/ais-bedrock-llm`

const fail = message => quit('claude', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      file: { type: 'string', multiple: true, default: [] },
      system: { type: 'string' },
      model: { type: 'string', default: 'us.anthropic.claude-sonnet-5-5' },
      'max-tokens': { type: 'string', default: '1024' },
      out: { type: 'string' },
      'list-models': { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }

const g = gateway('bedrock')
const headers = { [g.header]: g.key, 'content-type': 'application/json' }

async function call(method, path, body) {
  if (!g.key) fail('HUIT_BEDROCK_API_KEY is not set. Copy .env.example to .env at the repo root and add your key.')
  let response
  try {
    response = await fetch(`${g.base}${path}`, { method, headers, body: body && JSON.stringify(body) })
  } catch (error) {
    fail(`could not reach the HUIT gateway: ${error.message}`)
  }
  const text = (await response.text()).split(g.key).join('[key]')
  if (!response.ok) fail(`HUIT answered HTTP ${response.status} ${response.statusText}\n${text.slice(0, 1500)}`)
  try { return JSON.parse(text) } catch { fail(`expected JSON, got: ${text.slice(0, 300)}`) }
}

if (opt['list-models']) {
  if (opt['dry-run']) {
    console.log(JSON.stringify({ method: 'GET', url: `${g.base}/v2/inference-profiles`, headers: { [g.header]: mask(g.key) } }, null, 2))
    process.exit(0)
  }
  const data = await call('GET', '/v2/inference-profiles')
  const ids = (data.inferenceProfileSummaries || []).map(p => p.inferenceProfileId).filter(id => id.includes('anthropic')).sort()
  console.log(ids.join('\n'))
  process.exit(0)
}

const prompt = positionals.join(' ').trim()
if (!prompt) fail(`give a prompt.\n\n${HELP}`)
const maxTokens = Number(opt['max-tokens'])
if (!Number.isInteger(maxTokens) || maxTokens < 1) fail('--max-tokens must be a whole number above 0.')

const content = []
for (const file of opt.file) {
  const path = resolve(file)
  const text = await readFile(path, 'utf8').catch(() => fail(`file not found: ${file}`))
  content.push({ text: `<file name="${basename(path)}">\n${text}\n</file>` })
}
content.push({ text: prompt })

const body = { messages: [{ role: 'user', content }], inferenceConfig: { maxTokens } }
if (opt.system) body.system = [{ text: opt.system }]
const path = `/v2/model/${encodeURIComponent(opt.model)}/converse`

if (/fable/i.test(opt.model)) {
  console.error(`claude: WARNING: ${opt.model} is a Fable model. HUIT's Bedrock documentation says Fable 5 runs
  in "provider data share mode": Bedrock may retain what you send and share it with the model
  provider. Every other Claude model on the gateway runs with data sharing off. Send Fable only
  public or made-up material, never confidential data. See ll-utilities/README.md (the data rule).`)
}

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'POST', url: `${g.base}${path}`, headers: { ...headers, [g.header]: mask(g.key) }, body }, null, 2))
  process.exit(0)
}

const started = Date.now()
const data = await call('POST', path, body)
const answer = (data.output?.message?.content || []).map(part => part.text ?? '').join('').trim()
if (!answer) fail(`no text came back (stopReason: ${data.stopReason ?? 'unknown'}).`)

console.log(answer)
const usage = data.usage ? `, ${data.usage.inputTokens} tokens in, ${data.usage.outputTokens} out` : ''
console.error(`claude: ${opt.model}, ${((Date.now() - started) / 1000).toFixed(1)}s${usage}${data.stopReason === 'max_tokens' ? ' (cut off: raise --max-tokens)' : ''}`)
if (opt.out) {
  await writeFile(resolve(opt.out), `${answer}\n`)
  console.error(`claude: saved ${resolve(opt.out)}`)
}
