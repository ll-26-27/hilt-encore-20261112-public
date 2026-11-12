// AGENTS.md stays in step with the scripts: no keys, no network. Run from the repo root:
//   node --test ll-utilities/test/
//
// Each script's --help is the source of truth. Every script in huit/, video/, and external/ needs a
// section in ll-utilities/AGENTS.md headed ### `<folder>/<script>.mjs`, and that section must
// name every option and environment variable its --help lists, and no option it doesn't.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const doc = readFileSync(ROOT + 'AGENTS.md', 'utf8')

const scripts = ['huit', 'video', 'external'].flatMap(folder => readdirSync(ROOT + folder)
  .filter(name => name.endsWith('.mjs') && name !== 'warning.mjs')
  .map(name => `${folder}/${name}`))

function section(script) {
  const start = doc.indexOf(`### \`${script}\``)
  if (start === -1) return null
  const rest = doc.slice(start + 4)
  const end = rest.search(/^#{2,3} /m)
  return end === -1 ? rest : rest.slice(0, end)
}

function help(script) {
  const result = spawnSync(process.execPath, [ROOT + script, '--help'], { encoding: 'utf8', env: { PATH: process.env.PATH } })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout
}

const options = text => new Set([...text.matchAll(/^\s+(?:-h, )?(--[a-z][a-z-]*)/gm)].map(match => match[1]))
const envNames = text => new Set(text.match(/\b(?:HUIT_[A-Z_]+|FAL_API_KEY)\b/g) || [])

for (const script of scripts) {
  test(`AGENTS.md documents every option of ${script}`, () => {
    const text = section(script)
    assert.ok(text, `AGENTS.md has no section headed ### \`${script}\``)
    const helpText = help(script)
    const fromHelp = options(helpText)
    assert.ok(fromHelp.size > 1, `found no options in ${script} --help`)
    for (const option of fromHelp) {
      assert.match(text, new RegExp('`' + option + '[ `]'), `${script}: ${option} is in --help but not in AGENTS.md`)
    }
    for (const name of envNames(helpText)) {
      assert.ok(text.includes(name), `${script}: ${name} is in --help but not in AGENTS.md`)
    }
    const fromDoc = [...text.matchAll(/^\| `(?:-h`, `)?(--[a-z][a-z-]*)/gm)].map(match => match[1])
    for (const option of fromDoc) {
      assert.ok(fromHelp.has(option), `${script}: AGENTS.md lists ${option}, which --help doesn't`)
    }
  })
}
