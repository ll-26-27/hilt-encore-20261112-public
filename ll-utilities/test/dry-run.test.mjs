// Dry-run tests: no keys, no network. Run from the repo root:
//   node --test ll-utilities/test/
//
// Each script gets a fake key and must print its request without ever showing
// that key. Live tests are listed in live.md and need real keys.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, truncateSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HUIT = fileURLToPath(new URL('../huit/', import.meta.url))
const FAKE = 'fake-key-for-dry-run-tests-0123456789'
const FAKE_ENV = { HUIT_OPENAI_API_KEY: FAKE, HUIT_GEMINI_API_KEY: FAKE, HUIT_BEDROCK_API_KEY: FAKE }
const tmp = mkdtempSync(join(tmpdir(), 'll-utilities-test-'))

function run(script, args, extraEnv = FAKE_ENV) {
  const result = spawnSync(process.execPath, [join(HUIT, script), ...args], {
    encoding: 'utf8',
    env: { PATH: process.env.PATH, ...extraEnv },
  })
  const all = result.stdout + result.stderr
  assert.ok(!all.includes(FAKE), `${script} printed the key`)
  return result
}

function dryRun(script, args) {
  const result = run(script, [...args, '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

// transcribe.mjs ------------------------------------------------------------

const clip = join(tmp, 'clip.m4a')
writeFileSync(clip, 'not really audio')

test('transcribe --help', () => {
  const result = run('transcribe.mjs', ['--help'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /audio\/transcriptions/)
})

test('transcribe --dry-run builds the HUIT request', () => {
  const req = dryRun('transcribe.mjs', [clip, '--language', 'en', '--prompt', 'Bok Center', '--timestamps'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/audio/transcriptions')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  assert.equal(req.form.model, 'whisper-1')
  assert.equal(req.form.response_format, 'verbose_json')
  assert.equal(req.form.language, 'en')
  assert.equal(req.form['timestamp_granularities[]'], 'segment')
  assert.match(req.writes[0], /clip\.transcript\.md$/)
})

test('transcribe refuses files over 25 MB before sending', () => {
  const big = join(tmp, 'big.m4a')
  writeFileSync(big, '')
  truncateSync(big, 26 * 1024 * 1024)
  const result = run('transcribe.mjs', [big, '--dry-run'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /25 MB/)
})

// gemini-image.mjs ----------------------------------------------------------

const ref = join(tmp, 'ref.png')
writeFileSync(ref, 'not really an image')

test('gemini-image --help', () => {
  const result = run('gemini-image.mjs', ['--help'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /generateContent/)
})

test('gemini-image --dry-run builds the HUIT request, refs as inlineData', () => {
  const req = dryRun('gemini-image.mjs', ['--prompt', 'a paper boat', '--ref', ref, '--aspect', '16:9', '--out', join(tmp, 'boat.png')])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-google-gemini/v1beta/models/gemini-3.1-flash-image:generateContent')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  const [image, text] = req.body.contents[0].parts
  assert.equal(image.inlineData.mimeType, 'image/png')
  assert.match(image.inlineData.data, /ref\.png/)
  assert.equal(text.text, 'a paper boat')
  assert.deepEqual(req.body.generationConfig.responseModalities, ['TEXT', 'IMAGE'])
  assert.equal(req.body.generationConfig.imageConfig.aspectRatio, '16:9')
})

test('gemini-image needs --prompt', () => {
  const result = run('gemini-image.mjs', ['--dry-run'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /--prompt is required/)
})
