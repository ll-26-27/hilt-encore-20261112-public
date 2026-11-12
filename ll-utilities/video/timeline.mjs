#!/usr/bin/env node
// timeline.mjs: a string-out of a ledger's sound bites, as files an editor opens: FCPXML for
// Final Cut, Final Cut 7 XML for Premiere and Resolve, and a CMX3600 EDL for anything else.
//
// Local: probes the media with ffprobe and writes text files; sends nothing anywhere. Every
// timeline links to the original media at its own timecode; nothing is copied or transcoded.
//
// Ported from the Learning Lab's HUIT-hackathon tools (mk-video-editing, bites/timeline.py), in
// plain Node instead of Python and OpenTimelineIO. What the editors accepted there:
// - FCPXML 1.8 imported into Final Cut without a warning only with a separate 1920x1080 sequence
//   format at the source rate, tcFormat NDF, stereo, 48k (the sources keep their own sizes), and
//   linked A/V asset-clips at source timecode. A second angle is a connected <video> element on
//   lane 1 whose offset is the parent clip's *source* start: asset-clip srcEnable="video" brought
//   its audio in anyway.
// - Final Cut 7 XML opened in Premiere 2026 and Resolve 20 as OpenTimelineIO's fcp_xml adapter
//   writes it, element for element (test/reference/ holds that adapter's output for the test
//   video). Premiere refused a version with elements reordered, and cropped 4K into a small
//   default canvas until the sequence format and each file declared picture dimensions, which
//   are added here exactly where the hackathon added them.
// - The EDL is new in this port and has not been imported anywhere yet.
//
//   node ll-utilities/video/timeline.mjs workshop.bites.json
//   node ll-utilities/video/timeline.mjs workshop.bites.json --with camera-b.mov

import { parseArgs } from 'node:util'
import { existsSync, writeFileSync, copyFileSync, mkdtempSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fail as quit } from '../lib/env.mjs'
import { readLedger, checkSource, probe, parseRate, nominal, isNtsc, rationalSeconds, timecodeFrames, timecode, run, updateLedger } from '../lib/media.mjs'

const HELP = `Usage: node ll-utilities/video/timeline.mjs <ledger.json> [options]

Writes a string-out of a sound-bites ledger's bites, in ledger order, linked to the
original media at its source timecode (local; nothing is sent anywhere):
  <ledger name>.fcpxml   FCPXML 1.8, for Final Cut Pro (File > Import > XML)
  <ledger name>.xml      Final Cut 7 XML (xmeml), for Premiere Pro and DaVinci Resolve
  <ledger name>.edl      CMX3600 EDL, one video track and its sound (untested in editors)
beside the ledger, then marks the bites "in-timeline" in the ledger (exported, not a
confirmed import).

Options:
  --with <video>      A second camera for the same bites, placed by timecode: on V2 (lane 1
                      in Final Cut) above the first, picture only. Both files need a tmcd
                      time-of-day timecode track and the same frame rate, and the second
                      must cover every bite. The EDL stays one angle.
  --formats <list>    Which to write, comma-separated: fcpxml,xml,edl (default all three).
  --force             Replace existing timeline files.
  --dry-run           Check everything and print what would be written; write nothing.
  -h, --help          Show this help.

Needs ffprobe (on a Mac: brew install ffmpeg). If Final Cut Pro is installed, the FCPXML
is also checked against its FCPXML 1.8 DTD with xmllint.`

const FORMATS = ['fcpxml', 'xml', 'edl']
const FCP_DTD = '/Applications/Final Cut Pro.app/Contents/Frameworks/Interchange.framework/Versions/A/Resources/FCPXMLv1_8.dtd'

const fail = message => quit('timeline', message)

let args
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      with: { type: 'string' },
      formats: { type: 'string', default: FORMATS.join(',') },
      force: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }
if (positionals.length !== 1) fail(`give exactly one ledger file.\n\n${HELP}`)
const formats = opt.formats.split(',').map(f => f.trim()).filter(Boolean)
if (!formats.length || formats.some(f => !FORMATS.includes(f))) fail(`--formats takes ${FORMATS.join(', ')}`)

const ledgerPath = resolve(positionals[0])
const name = basename(ledgerPath, extname(ledgerPath))
let ledger, a, b
try {
  ledger = readLedger(ledgerPath)
  a = checkSource(ledger)
  if (opt.with) b = probe(opt.with)
} catch (error) {
  fail(error.message)
}
const rate = parseRate(a.frameRate)
a.base = timecodeFrames(a.startTimecode, rate)

// Each bite as { bite, aIn, b: { in } , duration }: file-relative frames. With a second angle,
// its in-point is the same time of day: A's start + A's in-frame - B's start.
const ranges = ledger.bites.map(bite => ({ bite, aIn: bite.inFrame, duration: bite.outFrame - bite.inFrame }))
for (const r of ranges) {
  if (r.aIn + r.duration > a.frames) fail(`${r.bite.id} runs past the end of ${basename(a.path)} (${a.frames} frames)`)
}
if (b) {
  if (b.path === a.path) fail('--with must be a different file from the ledger\'s source')
  for (const s of [a, b]) if (!s.startTimecode || !s.timecodeIsTimeOfDay) fail(`${basename(s.path)} has no tmcd time-of-day timecode track; two angles are placed by timecode`)
  if (b.frameRate !== a.frameRate) fail(`different frame rates: ${basename(a.path)} ${a.frameRate}, ${basename(b.path)} ${b.frameRate}`)
  b.base = timecodeFrames(b.startTimecode, rate)
  // A shared recording can cross midnight: take the day that gives the two files the most overlap.
  const day = 24 * 3600 * nominal(rate)
  const overlap = base => Math.max(0, Math.min(a.base + a.frames, base + b.frames) - Math.max(a.base, base))
  const bBase = [b.base, b.base - day, b.base + day].reduce((best, x) => (overlap(x) > overlap(best) ? x : best))
  for (const r of ranges) {
    const bIn = a.base + r.aIn - bBase
    if (bIn < 0 || bIn + r.duration > b.frames) {
      fail(`${basename(b.path)} doesn't cover ${r.bite.id} (${r.bite.sourceIn ?? r.aIn}); pick bites inside both files' shared time of day`)
    }
    r.bIn = bIn
  }
}

// --- XML, written by hand ------------------------------------------------------------------

const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const el = (tag, attrs = {}, ...children) => ({ tag, attrs, children: children.flat().filter(c => c !== null && c !== undefined && c !== false) })
// Four-space indented, empty elements as <tag/>, text-only elements on one line (the layout
// Python's minidom gives the adapter's output).
function serialize(node, depth = 0) {
  const pad = '    '.repeat(depth)
  const attrs = Object.entries(node.attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
  if (!node.children.length) return `${pad}<${node.tag}${attrs}/>\n`
  if (node.children.length === 1 && typeof node.children[0] !== 'object') return `${pad}<${node.tag}${attrs}>${esc(node.children[0])}</${node.tag}>\n`
  return `${pad}<${node.tag}${attrs}>\n${node.children.map(c => (typeof c === 'object' ? serialize(c, depth + 1) : `${pad}    ${esc(c)}\n`)).join('')}${pad}</${node.tag}>\n`
}
const uri = path => pathToFileURL(path).href

// Final Cut 7 XML: the fcp_xml adapter's elements and order, plus picture dimensions.
function fcp7() {
  const rateEl = () => el('rate', {}, el('timebase', {}, nominal(rate)), el('ntsc', {}, isNtsc(rate) ? 'TRUE' : 'FALSE'))
  const picture = s => el('samplecharacteristics', {}, rateEl(), el('width', {}, s.width), el('height', {}, s.height),
    el('anamorphic', {}, 'FALSE'), el('pixelaspectratio', {}, 'square'), el('fielddominance', {}, 'none'))
  const fileEl = (s, id, full) => (full
    ? el('file', { id }, el('pathurl', {}, uri(s.path)), el('name', {}, basename(s.path)), rateEl(), el('duration', {}, s.frames),
      el('timecode', {}, rateEl(), el('string', {}, timecode(s.base, rate)), el('frame', {}, s.base), el('displayformat', {}, 'NDF')),
      el('media', {}, el('video', {}, picture(s)), el('audio')))
    : el('file', { id }))
  let n = 0
  let start = 0
  const track = (s, fileId, inOf) => {
    start = 0
    return el('track', {}, ranges.map((r, i) => {
      const item = el('clipitem', { frameBlend: 'FALSE', id: `clipitem-${++n}` }, fileEl(s, fileId, i === 0), el('name', {}, r.bite.title ?? r.bite.id),
        rateEl(), rateEl(), el('duration', {}, r.duration), el('start', {}, start), el('end', {}, start + r.duration),
        el('in', {}, inOf(r)), el('out', {}, inOf(r) + r.duration))
      start += r.duration
      return item
    }))
  }
  const videoA = track(a, 'file-1', r => r.aIn)
  const videoB = b ? track(b, 'file-2', r => r.bIn) : null
  // The adapter's audio track points back at camera A's clipitems by id.
  const audio = a.audio ? el('audio', {}, el('track', {}, ranges.map((_, i) => el('clipitem', { id: `clipitem-${i + 1}` })))) : el('audio')
  const total = ranges.reduce((sum, r) => sum + r.duration, 0)
  const doc = el('xmeml', { version: '4' }, el('project', {}, el('name', {}, name), el('children', {},
    el('sequence', { id: 'sequence-1' }, el('name', {}, name), el('duration', {}, total), rateEl(),
      el('media', {}, el('video', {}, el('format', {}, picture(a)), videoA, videoB), audio)))))
  return `<?xml version="1.0" ?>\n${serialize(doc)}`
}

// FCPXML 1.8: explicit linked asset-clips (the hackathon's normalized form), B as connected video.
function fcpxml() {
  const t = frames => rationalSeconds(frames, rate)
  const resources = [a, b].filter(Boolean).flatMap((s, i) => {
    const id = i ? 'b' : 'a'
    const asset = { id: `asset_${id}`, name: basename(s.path), src: uri(s.path), start: t(s.base), duration: t(s.frames), hasVideo: '1', format: `format_${id}` }
    if (s.audio && !i) Object.assign(asset, { hasAudio: '1', audioSources: '1', audioChannels: String(s.audioChannels), audioRate: String(s.audioRate) })
    return [el('format', { id: `format_${id}`, frameDuration: t(1), width: s.width, height: s.height }), el('asset', asset)]
  })
  resources.push(el('format', { id: 'r_sequence', frameDuration: t(1), width: '1920', height: '1080', colorSpace: '1-1-1' }))
  let offset = 0
  const clips = ranges.map(r => {
    const clip = el('asset-clip', { name: r.bite.title ?? r.bite.id, ref: 'asset_a', offset: t(offset), start: t(a.base + r.aIn), duration: t(r.duration) },
      b && el('video', { name: `${r.bite.title ?? r.bite.id} - camera B`, ref: 'asset_b', lane: '1', offset: t(a.base + r.aIn), start: t(b.base + r.bIn), duration: t(r.duration) }))
    offset += r.duration
    return clip
  })
  const doc = el('fcpxml', { version: '1.8' }, el('resources', {}, resources), el('project', { name },
    el('sequence', { format: 'r_sequence', tcStart: '0s', tcFormat: 'NDF', duration: t(offset), audioLayout: 'stereo', audioRate: '48k' },
      el('spine', {}, clips))))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n${serialize(doc)}`
}

// CMX3600: one event per bite, camera A, video plus its first sound channel ("B") when it has sound.
function edl() {
  const reel = 'AX'
  const lines = [`TITLE: ${name.slice(0, 70)}`, 'FCM: NON-DROP FRAME', '']
  let record = 0
  ranges.forEach((r, i) => {
    const channel = a.audio ? 'B' : 'V'
    const src = a.base + r.aIn
    lines.push(`${String(i + 1).padStart(3, '0')}  ${reel.padEnd(8)} ${channel.padEnd(5)} C        ${timecode(src, rate)} ${timecode(src + r.duration, rate)} ${timecode(record, rate)} ${timecode(record + r.duration, rate)}`)
    lines.push(`* FROM CLIP NAME: ${basename(a.path)}`, `* SOURCE FILE: ${a.path}`, `* COMMENT: ${(r.bite.title ?? r.bite.id).replace(/\s+/g, ' ')}`, '')
    record += r.duration
  })
  return lines.join('\n')
}

const writers = { fcpxml, xml: fcp7, edl }
const outputs = Object.fromEntries(formats.map(f => [f, join(dirname(ledgerPath), `${name}.${f}`)]))

if (opt['dry-run']) {
  console.log(JSON.stringify({
    ledger: ledgerPath,
    angles: [a, b].filter(Boolean).map(s => ({ path: s.path, startTimecode: s.startTimecode, frameRate: s.frameRate, frames: s.frames, size: `${s.width}x${s.height}` })),
    bites: ranges.map(r => ({ id: r.bite.id, aIn: r.aIn, ...(b && { bIn: r.bIn }), frames: r.duration, sourceIn: timecode(a.base + r.aIn, rate) })),
    writes: Object.values(outputs),
  }, null, 2))
  process.exit(0)
}
for (const path of Object.values(outputs)) if (!opt.force && existsSync(path)) fail(`${path} exists; pass --force to replace it.`)

for (const [format, path] of Object.entries(outputs)) writeFileSync(path, writers[format]())

// Well-formed, and valid against Final Cut's own DTD when it's installed (copied to a plain
// path first: xmllint can't read a DTD path with spaces).
if (outputs.fcpxml) {
  const checks = [outputs.fcpxml, outputs.xml].filter(Boolean)
  try { run('xmllint', ['--noout', ...checks]) } catch (error) { if (!/not installed/.test(error.message)) fail(`a written file isn't well-formed XML: ${error.message}`) }
  if (existsSync(FCP_DTD)) {
    const scratch = mkdtempSync(join(tmpdir(), 'timeline-'))
    try {
      copyFileSync(FCP_DTD, join(scratch, 'FCPXMLv1_8.dtd'))
      run('xmllint', ['--noout', '--dtdvalid', join(scratch, 'FCPXMLv1_8.dtd'), outputs.fcpxml])
      console.error('timeline: FCPXML is valid against Final Cut\'s FCPXML 1.8 DTD')
    } catch (error) {
      if (!/not installed/.test(error.message)) fail(`the FCPXML doesn't match Final Cut's DTD: ${error.message}`)
    } finally {
      rmSync(scratch, { recursive: true, force: true })
    }
  }
}

// Record the export, unless the picks changed while we were writing.
const selection = l => JSON.stringify(l.bites.map(x => [x.id, x.inFrame, x.outFrame]))
const latest = JSON.parse(readFileSync(ledgerPath, 'utf8'))
if (selection(latest) !== selection(ledger)) fail('the ledger\'s bites changed while exporting; run again')
updateLedger(ledgerPath, null, bite => {
  bite.files = { ...(bite.files || {}), timelines: outputs }
  bite.status = 'in-timeline'
})
console.error(`timeline: ${ranges.length} bite(s), ${ranges.reduce((s, r) => s + r.duration, 0)} frames${b ? `, two angles (${basename(b.path)} offset ${b.base - a.base} frames)` : ''}`)
for (const path of Object.values(outputs)) console.log(path)
