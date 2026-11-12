#!/usr/bin/env node
// book.mjs: build a comic folder's index.html, a page reader plus a gallery of every image.
//
// No network, no keys, no packages. Reads <comic>/book.json:
//   { "title": "…", "pages": [ { "image": "images/story/page-01.png" },
//                              { "panels": ["images/story/panel-01.png", "…", "…", "…"] } ] }
// Open index.html#page-2 or index.html#gallery to start there. Paths are relative to the comic folder. A page is one whole-page image, or four panel images
// shown as a 2×2 grid. Missing images show as labeled empty slots, so the book can be built early.
//
//   node .agents/skills/origin-story/scripts/book.mjs _media/comics/my-comic

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, resolve, isAbsolute, sep } from 'node:path'

const HELP = `Usage: node .agents/skills/origin-story/scripts/book.mjs <comic-folder>

Reads <comic-folder>/book.json and writes <comic-folder>/index.html:
a page reader (arrow keys or buttons) and a gallery of every image under images/.
Open index.html straight from disk; no server needed, and the folder can be moved.`

function fail(message) {
  console.error(`book: ${message}`)
  process.exit(1)
}

const arg = process.argv[2]
if (!arg || arg === '--help' || arg === '-h') { console.log(HELP); process.exit(arg ? 0 : 1) }
const root = resolve(arg)
const bookFile = join(root, 'book.json')
if (!existsSync(bookFile)) fail(`no book.json in ${root}`)

let book
try { book = JSON.parse(readFileSync(bookFile, 'utf8')) } catch (error) { fail(`book.json is not valid JSON: ${error.message}`) }
if (!book.title || !Array.isArray(book.pages) || !book.pages.length) fail('book.json needs a title and at least one page.')

// Every path must stay inside the comic folder, so the folder works wherever it is moved.
function inside(path) {
  if (typeof path !== 'string' || isAbsolute(path)) fail(`use a path relative to the comic folder: ${path}`)
  const rel = relative(root, resolve(root, path))
  if (!rel || rel.startsWith('..')) fail(`path leaves the comic folder: ${path}`)
  return rel.split(sep).join('/')
}

const pages = book.pages.map((page, i) => {
  if (page.image) return { image: inside(page.image), caption: page.caption || '' }
  if (Array.isArray(page.panels) && page.panels.length === 4) return { panels: page.panels.map(inside), caption: page.caption || '' }
  fail(`page ${i + 1} needs "image", or "panels" with exactly four paths.`)
})
const missing = pages.flatMap(p => p.image ? [p.image] : p.panels).filter(p => !existsSync(join(root, p)))

function images(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).sort().flatMap(name => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return images(path)
    return /\.(png|jpe?g|webp)$/i.test(name) ? [relative(root, path).split(sep).join('/')] : []
  })
}
const gallery = images(join(root, 'images'))

const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const data = JSON.stringify({ pages, gallery, missing }).replace(/</g, '\\u003c')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(book.title)}</title>
<style>
  :root { --bg: #f6f3ec; --ink: #1d1b17; --muted: #6b665c; --line: #d8d2c4; --card: #fffdf8; }
  @media (prefers-color-scheme: dark) { :root { --bg: #16150f; --ink: #f1ede4; --muted: #a39d90; --line: #3a372f; --card: #201e17; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.5 system-ui, sans-serif; }
  header, main { max-width: 1000px; margin: 0 auto; padding: 16px; }
  h1 { margin: 8px 0 4px; font-size: 1.6rem; }
  nav { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  button { font: inherit; padding: 6px 14px; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 6px; cursor: pointer; }
  button[aria-pressed="true"] { border-color: var(--ink); }
  .page { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 12px; margin-top: 12px; }
  .page img { display: block; width: 100%; height: auto; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .slot { display: grid; place-items: center; min-height: 240px; border: 2px dashed var(--line); color: var(--muted); border-radius: 6px; padding: 8px; text-align: center; }
  .caption, .note { color: var(--muted); margin: 8px 0 0; }
  .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-top: 12px; }
  .gallery figure { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 6px; }
  .gallery img { width: 100%; height: auto; display: block; }
  .gallery figcaption { font-size: 0.75rem; color: var(--muted); word-break: break-all; margin-top: 4px; }
  [hidden] { display: none !important; }
</style>
</head>
<body>
<header>
  <h1>${esc(book.title)}</h1>
  <nav>
    <button id="read" aria-pressed="true">Read</button>
    <button id="all" aria-pressed="false">Gallery</button>
    <span style="flex:1"></span>
    <button id="prev" aria-label="Previous page">&larr;</button>
    <span id="count"></span>
    <button id="next" aria-label="Next page">&rarr;</button>
  </nav>
</header>
<main>
  <section id="reader"></section>
  <section id="gallery" hidden></section>
</main>
<script>
const { pages, gallery, missing } = ${data}
let at = 0
const $ = id => document.getElementById(id)
function picture(src, label) {
  if (missing.includes(src)) { const d = document.createElement('div'); d.className = 'slot'; d.textContent = label + ' (not made yet): ' + src; return d }
  const img = document.createElement('img'); img.src = src; img.alt = label; return img
}
function show() {
  const page = pages[at], box = document.createElement('div')
  box.className = 'page'
  if (page.image) box.append(picture(page.image, 'Page ' + (at + 1)))
  else { const g = document.createElement('div'); g.className = 'grid'; page.panels.forEach((p, i) => g.append(picture(p, 'Panel ' + (i + 1)))); box.append(g) }
  if (page.caption) { const c = document.createElement('p'); c.className = 'caption'; c.textContent = page.caption; box.append(c) }
  $('reader').replaceChildren(box)
  $('count').textContent = 'Page ' + (at + 1) + ' of ' + pages.length
}
function tab(reading) {
  $('reader').hidden = !reading; $('gallery').hidden = reading
  $('read').setAttribute('aria-pressed', reading); $('all').setAttribute('aria-pressed', !reading)
  for (const id of ['prev', 'next', 'count']) $(id).hidden = !reading
}
$('gallery').replaceChildren(...(gallery.length ? gallery.map(src => {
  const f = document.createElement('figure'), c = document.createElement('figcaption')
  c.textContent = src; f.append(picture(src, src), c); return f
}) : [Object.assign(document.createElement('p'), { className: 'note', textContent: 'No images yet.' })]))
$('gallery').className = 'gallery'
$('prev').onclick = () => { at = (at + pages.length - 1) % pages.length; show() }
$('next').onclick = () => { at = (at + 1) % pages.length; show() }
$('read').onclick = () => tab(true)
$('all').onclick = () => tab(false)
document.addEventListener('keydown', e => { if (!$('reader').hidden && e.key === 'ArrowRight') $('next').click(); if (!$('reader').hidden && e.key === 'ArrowLeft') $('prev').click() })
// index.html#page-2 opens on page 2; index.html#gallery opens the gallery.
const start = location.hash.match(/^#page-(\\d+)$/)
if (start) at = Math.min(Math.max(Number(start[1]) - 1, 0), pages.length - 1)
show()
if (location.hash === '#gallery') tab(false)
</script>
</body>
</html>
`

writeFileSync(join(root, 'index.html'), html)
console.error(`book: ${pages.length} page(s), ${gallery.length} image(s) in the gallery${missing.length ? `, ${missing.length} not made yet` : ''}`)
console.log(join(root, 'index.html'))
