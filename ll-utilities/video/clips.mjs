#!/usr/bin/env node
// clips.mjs: cut each sound bite in a ledger into its own small H.264 review clip.
//
// Local: runs ffmpeg on your machine, sends nothing anywhere. The source is never changed.
// Each clip starts exactly on the bite's in-frame (re-encoded, so not keyframe-bound), runs to
// its exclusive out-frame, and carries a tmcd track at the bite's source timecode, so an editor
// shows the original timecode. Ported from the hackathon tools' `render` (mk-video-editing).
//
//   node ll-utilities/video/clips.mjs workshop.bites.json

import { parseArgs } from 'node:util'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fail as quit } from '../lib/env.mjs'
import { readLedger, checkSource, sourceRate, secondsAt, startFrame, timecode, run, updateLedger } from '../lib/media.mjs'

const HELP = `Usage: node ll-utilities/video/clips.mjs <ledger.json> [options]

Cuts each bite in a sound-bites ledger into an H.264/AAC review clip (local; nothing is
sent anywhere). Clips start on the bite's in-frame, end before its out-frame, and carry
the source timecode. Names are <rank>-<title>.mp4. Then records each clip in the ledger
(files.render, status "rendered").

Options:
  --ids <list>      Only these bites, comma-separated (e.g. bite-1,bite-3). Default all.
  --dest <folder>   Where the clips go. Default <ledger name>-clips/ beside the ledger.
  --dry-run         Print the ffmpeg commands and write nothing.
  -h, --help        Show this help.

A clip already made for the same frames is kept; one made for different frames is
refused (use a new --dest). Needs ffmpeg (on a Mac: brew install ffmpeg).`

const fail = message => quit('clips', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: { ids: { type: 'string' }, dest: { type: 'string' }, 'dry-run': { type: 'boolean' }, help: { type: 'boolean', short: 'h' } },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }
if (positionals.length !== 1) fail(`give exactly one ledger file.\n\n${HELP}`)

const ledgerPath = resolve(positionals[0])
let ledger
try { ledger = readLedger(ledgerPath) } catch (error) { fail(error.message) }
const ids = opt.ids?.split(',').map(x => x.trim()).filter(Boolean)
const bites = ids ? ledger.bites.filter(b => ids.includes(b.id)) : ledger.bites
if (ids && bites.length !== ids.length) fail(`no bite with id ${ids.filter(id => !bites.some(b => b.id === id)).join(', ')} in the ledger`)

const source = ledger.source
const rate = sourceRate(source)
const first = startFrame(source)
const stem = basename(ledgerPath, extname(ledgerPath))
const dest = resolve(opt.dest || join(dirname(ledgerPath), `${stem}-clips`))
if (dest === dirname(source.path)) fail('--dest is the source\'s own folder; choose another so clips never sit beside the original.')

const slug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'bite'
const plan = bites.map(b => {
  const path = join(dest, `${String(b.rank ?? 0).padStart(2, '0')}-${slug(b.title ?? b.id)}.mp4`)
  const frames = b.outFrame - b.inFrame
  const tc = timecode(first + b.inFrame, rate)
  const range = JSON.stringify([source.path, b.inFrame, b.outFrame, `${rate.num}/${rate.den}`])
  const command = ['ffmpeg', '-v', 'error', '-n', '-ss', String(secondsAt(b.inFrame, rate)), '-i', source.path,
    '-frames:v', String(frames), '-t', String(secondsAt(frames, rate)), '-map', '0:v:0', '-map', '0:a:0?',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac',
    '-movflags', '+faststart', '-timecode', tc, `${path}.partial.mp4`]
  return { bite: b, path, frames, tc, range, command }
})

if (opt['dry-run']) {
  console.log(JSON.stringify({ source: source.path, dest, clips: plan.map(p => ({ id: p.bite.id, path: p.path, sourceIn: p.tc, frames: p.frames, command: p.command })) }, null, 2))
  process.exit(0)
}

try { checkSource(ledger) } catch (error) { fail(error.message) }
for (const p of plan) {
  if (existsSync(p.path) && p.bite.renderedRange !== p.range) fail(`${p.path} exists but was cut for other frames (or by something else); use a new --dest.`)
}
mkdirSync(dest, { recursive: true })

const started = Date.now()
for (const p of plan) {
  if (existsSync(p.path)) {
    console.error(`clips: ${p.bite.id} already cut, kept: ${basename(p.path)}`)
  } else {
    console.error(`clips: cutting ${p.bite.id} (${p.frames} frames from ${p.tc})`)
    rmSync(`${p.path}.partial.mp4`, { force: true })
    try { run(p.command[0], p.command.slice(1)) } catch (error) { fail(error.message) }
    renameSync(`${p.path}.partial.mp4`, p.path)
  }
  updateLedger(ledgerPath, [p.bite.id], bite => {
    bite.files = { ...(bite.files || {}), render: p.path }
    bite.renderedRange = p.range
    if (bite.status === 'identified') bite.status = 'rendered'
  })
  console.log(p.path)
}
console.error(`clips: ${plan.length} clip(s) in ${dest}, ${((Date.now() - started) / 1000).toFixed(1)}s`)
