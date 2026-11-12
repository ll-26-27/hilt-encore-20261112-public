// Dry-run tests for gemini.mjs --count and --stream on gpt.mjs and gemini.mjs (no keys, no network).
//   node --test ll-utilities/test/

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HUIT = fileURLToPath(new URL('../huit/', import.meta.url))
const FAKE = 'fake-key-for-dry-run-tests-0123456789'
const FAKE_ENV = { HUIT_OPENAI_API_KEY: FAKE, HUIT_GEMINI_API_KEY: FAKE, HUIT_BEDROCK_API_KEY: FAKE }
const tmp = mkdtempSync(join(tmpdir(), 'll-utilities-test-'))
const notes = join(tmp, 'notes.md')
writeFileSync(notes, '# Made-up notes\n\n- The tea committee chose oolong.\n')

function run(script, args) {
  const result = spawnSync(process.execPath, [join(HUIT, script), ...args], { encoding: 'utf8', env: { PATH: process.env.PATH, ...FAKE_ENV } })
  assert.ok(!(result.stdout + result.stderr).includes(FAKE), `${script} printed the key`)
  return result
}

function dryRun(script, args) {
  const result = run(script, [...args, '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

// gemini.mjs --count ----------------------------------------------------------

test('gemini --count sends the same body to :countTokens', () => {
  const ask = dryRun('gemini.mjs', ['--file', notes, '--system', 'Be brief.', 'Summarize.'])
  const count = dryRun('gemini.mjs', ['--count', '--file', notes, '--system', 'Be brief.', 'Summarize.'])
  assert.equal(count.url, 'https://apis.huit.harvard.edu/ais-google-gemini/v1beta/models/gemini-3.5-flash:countTokens')
  assert.deepEqual(count.body, ask.body)
})

// --stream (gpt.mjs, gemini.mjs) and lib/sse.mjs -------------------------------

test('gpt --stream asks /responses for a stream', () => {
  const req = dryRun('gpt.mjs', ['--stream', 'hi'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/responses')
  assert.equal(req.body.stream, true)
})

test('gemini --stream uses :streamGenerateContent with alt=sse', () => {
  const req = dryRun('gemini.mjs', ['--stream', 'hi'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-google-gemini/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse')
})

test('sseEvents splits a stream into JSON events, across chunk boundaries', async () => {
  const { sseEvents } = await import('../lib/sse.mjs')
  const pieces = ['data: {"delta":"Hel', 'lo"}\n\n', 'event: x\r\ndata: {"delta":" there"}\r\n\r\ndata: [DONE]\n\n']
  const body = new ReadableStream({ start(c) { for (const p of pieces) c.enqueue(new TextEncoder().encode(p)); c.close() } })
  const events = []
  for await (const event of sseEvents(new Response(body))) events.push(event)
  assert.deepEqual(events, [{ delta: 'Hello' }, { delta: ' there' }])
})
