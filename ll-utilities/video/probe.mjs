#!/usr/bin/env node
// probe.mjs: what a video file is: frame rate, length, start timecode, picture size, sound.
//
// Local: runs ffprobe on your machine, sends nothing anywhere. Refuses drop-frame timecode and
// variable frame rate, which the other video scripts can't place frame-accurately.
//
//   node ll-utilities/video/probe.mjs workshop.mov

import { parseArgs } from 'node:util'
import { basename } from 'node:path'
import { fail as quit } from '../lib/env.mjs'
import { probe, parseRate, isNtsc, timecode, startFrame } from '../lib/media.mjs'

const HELP = `Usage: node ll-utilities/video/probe.mjs <video> [options]

Reads a video with ffprobe (local; nothing is sent anywhere) and prints its frame rate,
length in frames and seconds, start timecode (from a tmcd track if it has one), picture
size, codec, and sound. Refuses drop-frame timecode and variable frame rate.

Options:
  --json        Print the full source object (the one words files and ledgers carry).
  -h, --help    Show this help.

Needs ffprobe (on a Mac: brew install ffmpeg).`

const fail = message => quit('probe', message)

let args
try {
  args = parseArgs({ allowPositionals: true, options: { json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } })
} catch (error) {
  fail(`${error.message}\n\n${HELP}`)
}
const { values: opt, positionals } = args
if (opt.help) { console.log(HELP); process.exit(0) }
if (positionals.length !== 1) fail(`give exactly one video file.\n\n${HELP}`)

let source
try { source = probe(positionals[0]) } catch (error) { fail(error.message) }

if (opt.json) { console.log(JSON.stringify(source, null, 2)); process.exit(0) }
const rate = parseRate(source.frameRate)
const end = timecode(startFrame(source) + source.frames, rate)
console.log(`${basename(source.path)}
  picture:   ${source.width}x${source.height}, ${source.videoCodec}${source.pixelFormat ? ` (${source.pixelFormat})` : ''}
  rate:      ${+source.fps.toFixed(3)} fps (${source.frameRate}${isNtsc(rate) ? ', NTSC; timecode counts at ' + Math.round(source.fps) : ''})
  length:    ${source.frames} frames, ${source.duration.toFixed(3)} s
  timecode:  ${source.startTimecode ? `${source.startTimecode} to ${end} (exclusive), non-drop${source.timecodeIsTimeOfDay ? ', tmcd track' : ''}` : 'none (counts from 00:00:00:00)'}
  sound:     ${source.audio ? `${source.audioChannels} channel(s), ${source.audioRate} Hz` : 'none'}`)
