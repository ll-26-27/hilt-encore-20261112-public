#!/usr/bin/env node
// card.mjs: turn a recipe card in Markdown into a printable one-page HTML card beside it.
//
// No network, no keys, no packages. Understands the Markdown recipe cards use: front matter
// (title, image, made, by), ## headings, paragraphs, - and 1. lists, ``` code blocks,
// `code`, **bold**, *italic*, and [links](url).
//
//   node .agents/skills/recipe-card/scripts/card.mjs _context/my-course/recipes/transcribe-a-debrief.md
//
// Writes transcribe-a-debrief.html next to it and prints the path. Print it from the browser.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, basename, extname, resolve } from 'node:path'

const HELP = `Usage: node .agents/skills/recipe-card/scripts/card.mjs <recipe.md>

Writes <recipe>.html beside the Markdown: a one-page card, ready to print.
Front matter fields: title (required), image (a path relative to the card), made, by.`

function fail(message) {
  console.error(`card: ${message}`)
  process.exit(1)
}

const arg = process.argv[2]
if (!arg || arg === '--help' || arg === '-h') { console.log(HELP); process.exit(arg ? 0 : 1) }
const file = resolve(arg)
if (!existsSync(file)) fail(`file not found: ${arg}`)
const source = readFileSync(file, 'utf8')

// Front matter: simple "key: value" lines between --- fences.
const meta = {}
let body = source
const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
if (fm) {
  for (const line of fm[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  body = source.slice(fm[0].length)
}
if (!meta.title) {
  const h1 = body.match(/^# (.+)$/m)
  if (!h1) fail('give the card a title: front matter "title:" or a "# Title" line.')
  meta.title = h1[1]
}
body = body.replace(/^# .+\r?\n/m, '')

const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function inline(text) {
  const codes = []
  let out = esc(text).replace(/`([^`]+)`/g, (_, code) => `\u0000${codes.push(code) - 1}\u0000`)
  out = out
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => /^(https?:|\.{0,2}\/|[\w-]+\/|[\w-]+\.)/.test(url) && !/^javascript:/i.test(url) ? `<a href="${url}">${label}</a>` : label)
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`)
}

// Block parser: headings, fenced code, lists, paragraphs.
const html = []
const lines = body.split(/\r?\n/)
for (let i = 0; i < lines.length;) {
  const line = lines[i]
  if (!line.trim()) { i++; continue }
  if (line.startsWith('```')) {
    const code = []
    for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i])
    i++
    html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`)
    continue
  }
  const heading = line.match(/^(#{2,4}) (.+)$/)
  if (heading) { html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); i++; continue }
  const list = line.match(/^(\s*)(-|\d+\.) /)
  if (list) {
    const ordered = list[2] !== '-'
    const items = []
    while (i < lines.length && /^\s*(-|\d+\.) /.test(lines[i])) {
      let text = lines[i].replace(/^\s*(-|\d+\.) /, '')
      let blocks = ''
      // Indented lines continue the item: more text, or a code block inside the step.
      for (i++; i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*(-|\d+\.) /.test(lines[i]); i++) {
        if (/^\s+```/.test(lines[i])) {
          const code = []
          for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++) code.push(lines[i].trim())
          blocks += `<pre><code>${esc(code.join('\n'))}</code></pre>`
        } else text += ' ' + lines[i].trim()
      }
      items.push(`<li>${inline(text)}${blocks}</li>`)
    }
    html.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`)
    continue
  }
  const para = []
  while (i < lines.length && lines[i].trim() && !/^(#{2,4} |```|\s*(-|\d+\.) )/.test(lines[i])) para.push(lines[i++].trim())
  html.push(`<p>${inline(para.join(' '))}</p>`)
}

const image = meta.image && existsSync(join(dirname(file), meta.image)) ? `<img class="art" src="${esc(meta.image)}" alt="">` : ''
const byline = [meta.by && `by ${meta.by}`, meta.made && `made ${meta.made}`].filter(Boolean).join(' · ')

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<style>
  @page { size: letter; margin: 0.6in; }
  :root { --paper: #fffdf6; --ink: #1f1d18; --muted: #6d675b; --rule: #e3dccb; --accent: #a5381f; --bg: #ece7da; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.45 Georgia, "Times New Roman", serif; }
  .card { max-width: 7.3in; margin: 24px auto; background: var(--paper); border: 1px solid var(--rule); border-top: 6px solid var(--accent); padding: 0.45in 0.5in; }
  h1 { font: 700 1.7rem/1.15 system-ui, sans-serif; margin: 0 0 4px; }
  .byline { color: var(--muted); font: 0.8rem system-ui, sans-serif; margin: 0 0 14px; }
  h2 { font: 700 0.78rem system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin: 18px 0 6px; padding-bottom: 3px; border-bottom: 1px solid var(--rule); }
  h3, h4 { font: 700 0.95rem system-ui, sans-serif; margin: 12px 0 4px; }
  p, ul, ol { margin: 0 0 8px; }
  ul, ol { padding-left: 1.3em; }
  li { margin: 2px 0; }
  code { font: 0.85em ui-monospace, Menlo, monospace; background: #f1ecdf; padding: 0 3px; border-radius: 3px; }
  pre { background: #f1ecdf; padding: 8px 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; }
  pre code { background: none; padding: 0; }
  a { color: var(--accent); }
  .art { float: right; width: 1.6in; margin: 0 0 8px 14px; border: 1px solid var(--rule); }
  @media print { body { background: none; } .card { margin: 0; border: none; border-top: 6px solid var(--accent); max-width: none; padding: 0; } }
  @media (max-width: 600px) { .card { margin: 0; padding: 20px 16px; } .art { width: 40%; } }
</style>
</head>
<body>
<article class="card">
${image}<h1>${inline(meta.title)}</h1>
${byline ? `<p class="byline">${esc(byline)}</p>` : ''}
${html.join('\n')}
</article>
</body>
</html>
`

const out = join(dirname(file), `${basename(file, extname(file))}.html`)
writeFileSync(out, page)
console.log(out)
