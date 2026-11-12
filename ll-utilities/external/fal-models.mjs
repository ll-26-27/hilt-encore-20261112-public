#!/usr/bin/env node
// fal-models.mjs: list the models fal.ai offers in one category, in fal's own catalogue order.
//
// EXTERNAL: fal is a company outside Harvard. This script sends only the category (--grep filters
// locally), never your files, and needs no key.
//
// fal API: GET https://api.fal.ai/v1/models?category=<category> (public, paged).
//
//   node ll-utilities/external/fal-models.mjs --grep banana

import { parseArgs } from 'node:util'
import { EXTERNAL_HELP, warn } from './warning.mjs'

const HELP = `Usage: node ll-utilities/external/fal-models.mjs [options]

${EXTERNAL_HELP}

Lists fal endpoint IDs you can pass to fal-image.mjs as --model.

Options:
  --category <name>   text-to-image (default), image-to-image, text-to-video, ...
  --grep <text>       Only models whose ID or name contains this text.
  --limit <n>         How many to list (default 50; up to 500).
  --dry-run           Print the request and send nothing.
  -h, --help          Show this help.

No key needed. Prices are on each model's page at https://fal.ai/models/<id>.`

function fail(message) {
  console.error(`fal-models: ${message}`)
  process.exit(1)
}

let args
try {
  args = parseArgs({
    options: {
      category: { type: 'string', default: 'text-to-image' },
      grep: { type: 'string' },
      limit: { type: 'string', default: '50' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt } = args
if (opt.help) { console.log(HELP); process.exit(0) }

const limit = Number(opt.limit)
if (!Number.isInteger(limit) || limit < 1 || limit > 500) fail('--limit must be a whole number from 1 to 500.')

const url = new URL('https://api.fal.ai/v1/models')
url.searchParams.set('category', opt.category)
url.searchParams.set('limit', '100')

if (opt['dry-run']) {
  console.log(JSON.stringify({ method: 'GET', url: url.href, filter: opt.grep ?? null, limit }, null, 2))
  process.exit(0)
}

warn('fal.ai', `a model search (category ${opt.category})`)

// Page through the category; with --grep, keep reading until enough models match.
const needle = opt.grep?.toLowerCase()
const found = []
let cursor
do {
  if (cursor) url.searchParams.set('cursor', cursor)
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    fail(`could not reach fal: ${error.message}`)
  }
  if (response.status === 429) fail('fal says too many requests; wait a minute and try again.')
  if (!response.ok) fail(`fal answered HTTP ${response.status} ${response.statusText}`)
  const page = await response.json()
  for (const m of page.models || []) {
    const name = m.metadata?.display_name || ''
    if (!needle || m.endpoint_id.toLowerCase().includes(needle) || name.toLowerCase().includes(needle)) found.push({ id: m.endpoint_id, name })
  }
  cursor = page.has_more ? page.next_cursor : undefined
} while (cursor && found.length < limit)

const shown = found.slice(0, limit)
if (!shown.length) fail(`no ${opt.category} models matched.`)
const width = Math.max(...shown.map(m => m.id.length))
for (const m of shown) console.log(`${m.id.padEnd(width)}  ${m.name}`)
console.error(`fal-models: ${shown.length} ${opt.category} model(s). Use one with: node ll-utilities/external/fal-image.mjs "prompt" --model <id>`)
