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

test('transcribe --words asks for word timings alone and writes a words file; a video is sent as its extracted sound', () => {
  const req = dryRun('transcribe.mjs', [clip, '--words', '--timestamps'])
  assert.equal(req.form['timestamp_granularities[]'], 'word') // word + segment together returns segments only
  assert.match(req.writes[2], /clip\.words\.json$/)
  const video = join(tmp, 'talk.mov')
  writeFileSync(video, 'not really video')
  const fromVideo = dryRun('transcribe.mjs', [video])
  assert.match(fromVideo.form.file, /^the sound of talk\.mov/)
  assert.equal(run('transcribe.mjs', [join(tmp, 'notes.txt'), '--dry-run']).status, 1)
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

// quota.mjs -----------------------------------------------------------------

test('quota --dry-run asks every gateway, Bedrock with x-api-key', () => {
  const reqs = dryRun('quota.mjs', [])
  assert.deepEqual(reqs.map(r => r.gateway), ['openai', 'gemini', 'bedrock'])
  assert.equal(reqs[0].url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/apigee/quota')
  assert.equal(reqs[2].url, 'https://apis.huit.harvard.edu/ais-bedrock-llm/apigee/quota')
  assert.ok(reqs[2].headers['x-api-key'])
  assert.ok(reqs[1].headers['api-key'])
})

test('quota rejects an unknown gateway', () => {
  const result = run('quota.mjs', ['azure', '--dry-run'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /unknown gateway/)
})

// claude.mjs ----------------------------------------------------------------

const notes = join(tmp, 'notes.md')
writeFileSync(notes, '# Made-up notes\n\n- The tea committee chose oolong.\n')

test('claude --dry-run builds a Bedrock converse request with the file first', () => {
  const req = dryRun('claude.mjs', ['--file', notes, '--system', 'Be brief.', '--max-tokens', '50', 'Summarize.'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-bedrock-llm/v2/model/us.anthropic.claude-sonnet-5-5/converse')
  assert.equal(req.headers['x-api-key'], `[hidden, ${FAKE.length} characters]`)
  const [file, prompt] = req.body.messages[0].content
  assert.match(file.text, /<file name="notes.md">/)
  assert.equal(prompt.text, 'Summarize.')
  assert.deepEqual(req.body.system, [{ text: 'Be brief.' }])
  assert.equal(req.body.inferenceConfig.maxTokens, 50)
})

test('claude needs a prompt', () => {
  const result = run('claude.mjs', ['--dry-run'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /give a prompt/)
})

test('claude warns before sending to a Fable model', () => {
  const result = run('claude.mjs', ['--model', 'global.anthropic.claude-fable-5', 'hi', '--dry-run'])
  assert.equal(result.status, 0)
  assert.match(result.stderr, /WARNING: .*Fable.*provider data share mode/s)
})

// gpt.mjs -------------------------------------------------------------------

test('gpt --dry-run builds an OpenAI Direct /responses request', () => {
  const req = dryRun('gpt.mjs', ['--file', notes, '--system', 'Be brief.', '--effort', 'low', 'Summarize.'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/responses')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  assert.equal(req.body.model, 'gpt-5-mini')
  assert.match(req.body.input, /^<file name="notes.md">[\s\S]*Summarize\.$/)
  assert.equal(req.body.instructions, 'Be brief.')
  assert.deepEqual(req.body.reasoning, { effort: 'low' })
})

test('gpt rejects an unknown effort', () => {
  const result = run('gpt.mjs', ['--effort', 'max', 'hi', '--dry-run'])
  assert.equal(result.status, 1)
})

// gemini.mjs ----------------------------------------------------------------

test('gemini --dry-run: text files as text, images and PDFs as inlineData', () => {
  const pdf = join(tmp, 'handout.pdf')
  writeFileSync(pdf, '%PDF-1.4 not really')
  const req = dryRun('gemini.mjs', ['--file', notes, '--file', pdf, '--system', 'Be brief.', 'Summarize.'])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-google-gemini/v1beta/models/gemini-3.5-flash:generateContent')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  const [text, data, prompt] = req.body.contents[0].parts
  assert.match(text.text, /<file name="notes.md">/)
  assert.equal(data.inlineData.mimeType, 'application/pdf')
  assert.equal(prompt.text, 'Summarize.')
  assert.deepEqual(req.body.systemInstruction, { parts: [{ text: 'Be brief.' }] })
})

test('gemini refuses file types it cannot send', () => {
  const doc = join(tmp, 'essay.docx')
  writeFileSync(doc, 'x')
  const result = run('gemini.mjs', ['--file', doc, 'hi', '--dry-run'])
  assert.equal(result.status, 1)
})

// gpt-image.mjs -------------------------------------------------------------

test('gpt-image --dry-run builds an OpenAI Direct /images/generations request', () => {
  const req = dryRun('gpt-image.mjs', ['--prompt', 'a teapot', '--quality', 'low', '--size', '1536x1024', '--out', join(tmp, 'teapot.png')])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/images/generations')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  assert.deepEqual(req.body, { model: 'gpt-image-1-mini', prompt: 'a teapot', n: 1, size: '1536x1024', quality: 'low' })
})

test('gpt-image --ref goes through /responses with the image_generation tool, images summarized', () => {
  const ref = join(tmp, 'character.png')
  writeFileSync(ref, 'not really an image')
  const req = dryRun('gpt-image.mjs', ['--prompt', 'same character at night', '--ref', ref, '--ref', ref, '--quality', 'low', '--out', join(tmp, 'night.png')])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/responses')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  assert.equal(req.body.model, 'gpt-5-mini')
  assert.deepEqual(req.body.tools, [{ type: 'image_generation', model: 'gpt-image-1-mini', size: '1024x1024', quality: 'low' }])
  assert.deepEqual(req.body.tool_choice, { type: 'image_generation' })
  const content = req.body.input[0].content
  assert.deepEqual(content[0], { type: 'input_text', text: 'same character at night' })
  assert.equal(content.length, 3)
  assert.equal(content[1].image_url, '<base64 of character.png (image/png, 19 bytes)>')
})

test('gpt-image --ref refuses a missing file or an unsupported type', () => {
  assert.equal(run('gpt-image.mjs', ['--prompt', 'x', '--ref', join(tmp, 'missing.png'), '--dry-run']).status, 1)
  const gif = join(tmp, 'moving.gif')
  writeFileSync(gif, 'x')
  assert.equal(run('gpt-image.mjs', ['--prompt', 'x', '--ref', gif, '--dry-run']).status, 1)
})

// embed.mjs -----------------------------------------------------------------

test('embed --dry-run sends every text, from arguments and --lines', () => {
  const lines = join(tmp, 'lines.txt')
  writeFileSync(lines, 'first line\n\nsecond line\n')
  const req = dryRun('embed.mjs', ['a cat', '--lines', lines])
  assert.equal(req.url, 'https://apis.huit.harvard.edu/ais-openai-direct/v2/embeddings')
  assert.equal(req.headers['api-key'], `[hidden, ${FAKE.length} characters]`)
  assert.deepEqual(req.body, { model: 'text-embedding-3-small', input: ['a cat', 'first line', 'second line'] })
})
