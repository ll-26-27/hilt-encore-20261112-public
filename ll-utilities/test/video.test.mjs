// Video tests: local only, no keys, no network. Run from the repo root:
//   node --test ll-utilities/test/
//
// Makes a made-up two-camera fixture (test pattern + macOS say) in a temporary folder, then checks
// probe, the ledger arithmetic, clips, and timelines. The Final Cut 7 XML must match what
// OpenTimelineIO's fcp_xml adapter wrote for the same bites (test/reference/), the form Premiere
// and Resolve accepted in the hackathon, apart from the picture dimensions added on purpose.
// Skipped where ffmpeg or say isn't installed.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { probe, makeLedger, timecode, rationalSeconds, sourceRate, parseRate } from '../lib/media.mjs'
import { makeFixture } from './video-fixture.mjs'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const has = command => spawnSync(command, ['-version']).error?.code !== 'ENOENT'
const ready = has('ffmpeg') && has('ffprobe') && spawnSync('which', ['say']).status === 0
const skip = ready ? false : 'needs ffmpeg, ffprobe, and macOS say'
const FCP_DTD = '/Applications/Final Cut Pro.app/Contents/Frameworks/Interchange.framework/Versions/A/Resources/FCPXMLv1_8.dtd'

const tmp = mkdtempSync(join(tmpdir(), 'll-video-test-'))
const fixture = ready ? makeFixture(join(tmp, 'media'), { angle: true }) : {}

function node(script, args) {
  return spawnSync(process.execPath, [join(ROOT, script), ...args], { encoding: 'utf8', env: { PATH: process.env.PATH } })
}
function ffmpeg(args) {
  return spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { encoding: 'utf8' })
}
// A ledger like the reference one: bites at frames 58-158, 200-323, 330-415, titled one, two, three.
function referenceLedger(name, count = 3) {
  const source = probe(fixture.a)
  const bites = [['one', 58, 158], ['two', 200, 323], ['three', 330, 415]].slice(0, count).map(([title, inFrame, outFrame], i) => ({
    startWord: 0, endWord: 0, title, reason: 'test', rating: 3, id: `bite-${i + 1}`, rank: i + 1, inFrame, outFrame, status: 'identified', files: {},
  }))
  const path = join(tmp, `${name}.json`)
  writeFileSync(path, JSON.stringify({ schema: 1, source, bites }, null, 2))
  return path
}
// Our FCP7 output minus the picture dimensions we add on purpose, with fixture paths normalized.
function withoutPicture(xml) {
  return xml
    .replace(/\n\s*<samplecharacteristics>[\s\S]*?<\/samplecharacteristics>/g, '')
    .replace(/<format>\n\s*<\/format>/g, '<format/>')
    .replace(/<video>\n\s*<\/video>/g, '<video/>')
    .replace(/file:\/\/\/[^<]*\/media\//g, 'file:///FIXTURE/')
}

test('timecode and rate arithmetic: non-drop, NTSC counted at the nominal rate', () => {
  assert.equal(timecode(1080058, { num: 30, den: 1 }), '10:00:01:28')
  assert.equal(timecode(108000, parseRate('30000/1001')), '01:00:00:00')
  assert.equal(rationalSeconds(1080058, { num: 30, den: 1 }), '540029/15s')
  assert.equal(rationalSeconds(1, parseRate('30000/1001')), '1001/30000s')
  assert.deepEqual(sourceRate({ fps: 29.97002997002997 }), { num: 30000, den: 1001 })
  assert.deepEqual(sourceRate({ fps: 24 }), { num: 24, den: 1 })
})

test('makeLedger: word picks become frames with 0.12 s handles rounded outward, clamped, at source timecode', () => {
  const source = { path: '/x.mov', fps: 30, frameRate: '30/1', duration: 10, startTimecode: '10:00:00:00' }
  const words = [{ word: 'a', start: 0.05, end: 0.4 }, { word: 'b', start: 1.01, end: 1.5 }, { word: 'c', start: 9.8, end: 9.99 }].map((w, index) => ({ ...w, index }))
  const ledger = makeLedger({ source, words }, [
    { startWord: 1, endWord: 1, title: 'B', reason: 'r', rating: 5 },
    { startWord: 0, endWord: 2, title: 'all', reason: 'r', rating: 3 },
  ], { purpose: 'test', model: 'none' })
  const [b, all] = ledger.bites
  assert.equal(b.inFrame, Math.floor((1.01 - 0.12) * 30)) // 26
  assert.equal(b.outFrame, Math.ceil((1.5 + 0.12) * 30)) // 49
  assert.equal(b.sourceIn, '10:00:00:26')
  assert.equal(b.sourceOutExclusive, '10:00:01:19')
  assert.equal(all.inFrame, 0) // clamped at the start
  assert.equal(all.outFrame, 300) // clamped at the end
  assert.deepEqual([b.id, b.rank, b.status, all.id, all.rank], ['bite-1', 1, 'identified', 'bite-2', 2])
  assert.throws(() => makeLedger({ source, words }, [{ startWord: 2, endWord: 1, title: 't', reason: 'r', rating: 3 }], {}), /invalid/)
})

test('probe reads the fixture: 30 fps, tmcd 10:00:00:00, 640x360, sound', { skip }, () => {
  const s = probe(fixture.a)
  assert.deepEqual([s.frameRate, s.startTimecode, s.timecodeIsTimeOfDay, s.width, s.height, s.audio], ['30/1', '10:00:00:00', true, 640, 360, true])
  const b = probe(fixture.b)
  assert.deepEqual([b.startTimecode, b.audio, b.frames], ['10:00:00:09', false, s.frames - 9])
  const result = node('video/probe.mjs', [fixture.a])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /10:00:00:00 to 10:00:14:11 \(exclusive\)/)
})

test('probe refuses drop-frame timecode and variable frame rate', { skip }, () => {
  const df = join(tmp, 'df.mov')
  ffmpeg(['-f', 'lavfi', '-i', 'testsrc2=size=160x90:rate=30000/1001', '-t', '0.5', '-timecode', '01:00:00;00', '-c:v', 'libx264', '-preset', 'ultrafast', df])
  const vfr = join(tmp, 'vfr.mov')
  ffmpeg(['-f', 'lavfi', '-i', 'testsrc2=size=160x90:rate=30:d=1', '-f', 'lavfi', '-i', 'testsrc2=size=160x90:rate=15:d=1',
    '-filter_complex', '[0][1]concat=n=2:v=1:a=0', '-fps_mode', 'vfr', '-c:v', 'libx264', '-preset', 'ultrafast', vfr])
  assert.throws(() => probe(df), /drop-frame/)
  assert.throws(() => probe(vfr), /variable frame rate/)
  assert.equal(node('video/probe.mjs', [vfr]).status, 1)
})

test('timeline: Final Cut 7 XML matches the OpenTimelineIO adapter output; FCPXML and EDL at source timecode', { skip }, () => {
  const ledger = referenceLedger('ref')
  const result = node('video/timeline.mjs', [ledger])
  assert.equal(result.status, 0, result.stderr)
  const xml = readFileSync(join(tmp, 'ref.xml'), 'utf8')
  assert.equal(withoutPicture(xml), readFileSync(join(ROOT, 'test/reference/otio-fcp7-one-angle.xml'), 'utf8'))
  // The picture dimensions Premiere needed: the sequence format and the file both declare 640x360.
  assert.equal((xml.match(/<width>640<\/width>/g) || []).length, 2)
  const fcpxml = readFileSync(join(tmp, 'ref.fcpxml'), 'utf8')
  assert.match(fcpxml, /<asset-clip name="one" ref="asset_a" offset="0s" start="540029\/15s" duration="10\/3s"\/>/)
  assert.match(fcpxml, /<asset-clip name="three" ref="asset_a" offset="223\/30s" start="36011s" duration="17\/6s"\/>/)
  assert.match(fcpxml, /<sequence format="r_sequence" tcStart="0s" tcFormat="NDF" duration="154\/15s" audioLayout="stereo" audioRate="48k">/)
  const edl = readFileSync(join(tmp, 'ref.edl'), 'utf8')
  assert.match(edl, /^001  AX       B     C        10:00:01:28 10:00:05:08 00:00:00:00 00:00:03:10$/m)
  assert.match(edl, /^003  AX       B     C        10:00:11:00 10:00:13:25 00:00:07:13 00:00:10:08$/m)
  const after = JSON.parse(readFileSync(ledger, 'utf8'))
  assert.ok(after.bites.every(b => b.status === 'in-timeline' && b.files.timelines.fcpxml.endsWith('ref.fcpxml')))
  assert.equal(node('video/timeline.mjs', [ledger]).status, 1, 'refuses to replace without --force')
})

test('timeline --with: camera B placed by timecode, matching the adapter output, B silent in FCPXML', { skip }, () => {
  const ledger = referenceLedger('ref2', 2)
  const result = node('video/timeline.mjs', [ledger, '--with', fixture.b])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(withoutPicture(readFileSync(join(tmp, 'ref2.xml'), 'utf8')), readFileSync(join(ROOT, 'test/reference/otio-fcp7-two-angles.xml'), 'utf8'))
  const fcpxml = readFileSync(join(tmp, 'ref2.fcpxml'), 'utf8')
  // B's connected clip: offset is the parent's source start, start is B's own clock at the same time of day.
  assert.match(fcpxml, /<video name="one - camera B" ref="asset_b" lane="1" offset="540029\/15s" start="540029\/15s" duration="10\/3s"\/>/)
  assert.match(fcpxml, /<asset id="asset_b" name="workshop-b.mov" src="[^"]+" start="360003\/10s" duration="211\/15s" hasVideo="1" format="format_b"\/>/)
})

test('timeline refuses a second angle that misses a bite, or media that no longer matches the ledger', { skip }, () => {
  const early = referenceLedger('early', 1)
  const ledger = JSON.parse(readFileSync(early, 'utf8'))
  ledger.bites[0].inFrame = 2 // camera B starts 9 frames later, so it can't cover frames 2 onward
  writeFileSync(early, JSON.stringify(ledger))
  const missed = node('video/timeline.mjs', [early, '--with', fixture.b, '--dry-run'])
  assert.equal(missed.status, 1)
  assert.match(missed.stderr, /doesn't cover bite-1/)
  ledger.source.startTimecode = '09:00:00:00'
  writeFileSync(early, JSON.stringify(ledger))
  const stale = node('video/timeline.mjs', [early, '--dry-run'])
  assert.equal(stale.status, 1)
  assert.match(stale.stderr, /rebuild the ledger/)
})

test('FCPXML is valid against Final Cut\'s own DTD', { skip: skip || (!existsSync(FCP_DTD) && 'Final Cut Pro is not installed') }, () => {
  const dtd = join(tmp, 'FCPXMLv1_8.dtd')
  copyFileSync(FCP_DTD, dtd)
  for (const name of ['ref', 'ref2']) {
    const result = spawnSync('xmllint', ['--noout', '--dtdvalid', dtd, join(tmp, `${name}.fcpxml`)], { encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
  }
})

test('clips: H.264 review clips start on the in-frame, run the exact length, carry source timecode', { skip }, () => {
  const ledger = referenceLedger('cuts')
  const result = node('video/clips.mjs', [ledger])
  assert.equal(result.status, 0, result.stderr)
  const paths = result.stdout.trim().split('\n')
  assert.deepEqual(paths.map(p => p.split('/').pop()), ['01-one.mp4', '02-two.mp4', '03-three.mp4'])
  const info = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames:stream_tags=timecode', '-of', 'json', paths[0]], { encoding: 'utf8' })
  const stream = JSON.parse(info.stdout).streams[0]
  assert.equal(stream.nb_read_frames, '100')
  assert.equal(stream.tags.timecode, '10:00:01:28')
  // The clip's first frame is source frame 58, not its neighbours (PSNR, since it's re-encoded).
  const psnr = n => Number(/average:([\d.]+)/.exec(spawnSync('ffmpeg', ['-hide_banner', '-i', paths[0], '-i', fixture.a, '-filter_complex',
    `[0:v]trim=end_frame=1,setpts=PTS-STARTPTS[a];[1:v]trim=start_frame=${n}:end_frame=${n + 1},setpts=PTS-STARTPTS[b];[a][b]psnr`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr)[1])
  assert.ok(psnr(58) > psnr(57) + 10 && psnr(58) > psnr(59) + 10, `frame 58 should match best: ${psnr(57)} ${psnr(58)} ${psnr(59)}`)
  const after = JSON.parse(readFileSync(ledger, 'utf8'))
  assert.ok(after.bites.every(b => b.status === 'rendered' && b.files.render && b.renderedRange))
  // A rerun keeps them; a changed bite is refused rather than overwritten.
  assert.equal(node('video/clips.mjs', [ledger]).status, 0)
  after.bites[0].inFrame = 60
  writeFileSync(ledger, JSON.stringify(after))
  assert.equal(node('video/clips.mjs', [ledger, '--ids', 'bite-1']).status, 1)
})
