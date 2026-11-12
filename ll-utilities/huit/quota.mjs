#!/usr/bin/env node
// quota.mjs: how much of your HUIT budget is left this period, per gateway.
//
// HUIT API: GET /apigee/quota on each gateway (OpenAI Direct v2, Gemini, Bedrock).
// Checking costs nothing. HUIT reports the limit and what remains; spent = limit − remaining.
//
//   node ll-utilities/huit/quota.mjs            every gateway you have a key for
//   node ll-utilities/huit/quota.mjs bedrock    just one

import { parseArgs } from 'node:util'
import { mask, fail as quit } from '../lib/env.mjs'
import { GATEWAYS, gateway } from '../lib/gateways.mjs'

const HELP = `Usage: node ll-utilities/huit/quota.mjs [openai|gemini|bedrock ...] [options]

Shows each HUIT gateway's budget for this period: the limit, what remains, and
what has been spent (limit minus remaining). Free to run. With no names, checks
every gateway you have a key for. Budgets are per gateway (each key is its own app).

Options:
  --json        Print HUIT's raw answers as JSON.
  --dry-run     Print the requests (keys masked) and send nothing.
  -h, --help    Show this help.

Environment (read from the shell, or from .env at the repo root):
  HUIT_OPENAI_API_KEY, HUIT_GEMINI_API_KEY, HUIT_BEDROCK_API_KEY   (any you have)
  HUIT_OPENAI_BASE_URL, HUIT_GEMINI_BASE_URL, HUIT_BEDROCK_BASE_URL (optional)`

const fail = message => quit('quota', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      json: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }

let gateways
try {
  gateways = (positionals.length ? positionals : Object.keys(GATEWAYS)).map(gateway)
} catch (error) {
  fail(error.message)
}

if (opt['dry-run']) {
  console.log(JSON.stringify(gateways.map(g => ({
    gateway: g.name, method: 'GET', url: `${g.base}/apigee/quota`, headers: { [g.header]: mask(g.key) },
  })), null, 2))
  process.exit(0)
}

const usable = gateways.filter(g => g.key)
if (!usable.length) fail('no HUIT keys found. Copy .env.example to .env at the repo root and add yours.')

const money = n => `$${n.toFixed(2)}`
const raw = {}
let failed = false
for (const g of gateways) {
  if (!g.key) { if (positionals.length) console.log(`${g.label}: no ${g.keyEnv} set`); continue }
  let response, text
  try {
    response = await fetch(`${g.base}/apigee/quota`, { headers: { [g.header]: g.key } })
    text = (await response.text()).split(g.key).join('[key]')
  } catch (error) {
    console.log(`${g.label}: could not reach the gateway (${error.message})`); failed = true; continue
  }
  if (!response.ok) { console.log(`${g.label}: HTTP ${response.status} ${text.slice(0, 300)}`); failed = true; continue }
  let data
  try { data = JSON.parse(text) } catch { console.log(`${g.label}: expected JSON, got ${text.slice(0, 200)}`); failed = true; continue }
  raw[g.name] = data
  if (opt.json) continue
  const limit = Number(data.quota?.limit)
  const remaining = Number(data.remaining_limit)
  if (!Number.isFinite(limit) || !Number.isFinite(remaining)) { console.log(`${g.label}: unexpected answer ${text.slice(0, 200)}`); failed = true; continue }
  const period = `${data.quota.interval ?? 1} ${data.quota.unit ?? ''}`.trim()
  console.log(`${g.label}: ${money(limit - remaining)} spent of ${money(limit)} per ${period}; ${money(remaining)} left`)
}
if (opt.json) console.log(JSON.stringify(raw, null, 2))
process.exit(failed ? 1 : 0)
