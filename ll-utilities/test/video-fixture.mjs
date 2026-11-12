#!/usr/bin/env node
// video-fixture.mjs: make a short, made-up video to test the video scripts with.
// Needs macOS `say` and ffmpeg. Nothing real: a test pattern and a synthetic voice.
//
//   node ll-utilities/test/video-fixture.mjs            writes _media/fixtures/bites/workshop.mov
//   node ll-utilities/test/video-fixture.mjs <folder>   writes <folder>/workshop.mov
//
// workshop.mov: 640x360, 30 fps, H.264 + AAC, exactly 431 frames (14.37 s) of speech, with a tmcd track starting at
// 10:00:00:00. With --angle it also writes workshop-b.mov: the same test pattern as a second camera
// that started recording 9 frames later (timecode 10:00:00:09), for two-angle timelines.

import { mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { run } from '../lib/media.mjs'

export const FRAMES = 431 // 14.37 s at 30 fps

export const SPEECH = 'Welcome to our workshop. Today we learned that a small experiment can change how a team works. Start with one clear question, test it together, and share what failed. The best tool is the one that helps you notice something new. Thank you for joining us.'

// Returns the paths it wrote. rate is an ffmpeg rate ("30", "30000/1001").
export function makeFixture(dir, { rate = '30', startTimecode = '10:00:00:00', angle = false, force = false } = {}) {
  mkdirSync(dir, { recursive: true })
  const speech = join(dir, 'speech.aiff')
  const a = join(dir, 'workshop.mov')
  const b = join(dir, 'workshop-b.mov')
  if (force || !existsSync(speech)) run('say', ['-o', speech, SPEECH])
  if (force || !existsSync(a)) {
    // Exactly FRAMES frames whatever the voice's pace, so test/reference/ matches on any machine:
    // the speech is padded with silence (or, if a voice runs long, cut) to the same length.
    run('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `testsrc2=size=640x360:rate=${rate}`, '-i', speech,
      '-filter_complex', '[1:a]apad[a]', '-map', '0:v', '-map', '[a]', '-frames:v', String(FRAMES), '-t', String(FRAMES / 30),
      '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000',
      '-timecode', startTimecode, a])
  }
  if (angle && (force || !existsSync(b))) {
    // Camera B: the same pattern from 9 frames in (0.3 s at 30 fps), silent, timecode 9 frames later.
    const [h, m, s, f] = startTimecode.split(':').map(Number)
    const later = [h, m, s, f + 9].map(x => String(x).padStart(2, '0')).join(':')
    run('ffmpeg', ['-v', 'error', '-y', '-i', a, '-vf', `trim=start_frame=9,setpts=PTS-STARTPTS`, '-an',
      '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-timecode', later, b])
  }
  return angle ? { a, b } : { a }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.includes('-h') || args.includes('--help')) {
    console.log('Usage: node ll-utilities/test/video-fixture.mjs [folder] [--angle] [--force]\nMakes workshop.mov (and workshop-b.mov with --angle) from a test pattern and macOS say.')
    process.exit(0)
  }
  const folder = args.find(a => !a.startsWith('--')) || fileURLToPath(new URL('../../_media/fixtures/bites/', import.meta.url))
  const paths = makeFixture(resolve(folder), { angle: args.includes('--angle'), force: args.includes('--force') })
  for (const path of Object.values(paths)) console.log(path)
}
