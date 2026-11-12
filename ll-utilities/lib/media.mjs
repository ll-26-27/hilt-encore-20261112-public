// media.mjs: what the video scripts share: reading a file with ffprobe, frame and timecode
// arithmetic, and the sound-bites ledger. Local only; nothing here touches the network.
//
// Ported from the Learning Lab's HUIT-hackathon soundbites tools (mk-video-editing, bites/cli.mjs
// and bites/timeline.py), keeping their ledger format so picks move between the two.
//
// Timecode is non-drop (NDF), counted at the nominal rate (30 for 29.97). Drop-frame timecode and
// variable frame rate are refused: transcode to a constant rate first.

import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, renameSync, realpathSync, statSync } from 'node:fs'

// Run a command and return its stdout; throws with its stderr if it fails or isn't installed.
export function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.error?.code === 'ENOENT') throw Error(`${command} is not installed (on a Mac: brew install ffmpeg)`)
  if (result.status !== 0) throw Error(`${command} failed: ${(result.stderr || '').trim().slice(0, 800)}`)
  return result.stdout
}

// Frame rates as exact fractions: { num: 30000, den: 1001 }.
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))
export function parseRate(text) {
  const [num, den = 1] = String(text).split('/').map(Number)
  if (!Number.isInteger(num) || !Number.isInteger(den) || num <= 0 || den <= 0) throw Error(`not a frame rate: ${text}`)
  const g = gcd(num, den)
  return { num: num / g, den: den / g }
}
// A source's rate: its frameRate string, or (for ledgers that only have fps) the nearest
// whole or NTSC (n*1000/1001) rate.
export function sourceRate(source) {
  if (source.frameRate) return parseRate(source.frameRate)
  const fps = Number(source.fps)
  if (!(fps > 0)) throw Error('the source has no frame rate')
  if (Math.abs(fps - Math.round(fps)) < 1e-6) return { num: Math.round(fps), den: 1 }
  const ntsc = Math.round(fps * 1.001)
  if (Math.abs(fps - ntsc * 1000 / 1001) < 1e-4) return parseRate(`${ntsc * 1000}/1001`)
  throw Error(`can't tell the exact frame rate from fps ${fps}; add frameRate (e.g. "30000/1001") to the source`)
}
export const nominal = rate => Math.round(rate.num / rate.den)
export const isNtsc = rate => rate.den === 1001
export const secondsAt = (frames, rate) => frames * rate.den / rate.num
// Frames as an FCPXML time: "1001/30000s", "4s".
export function rationalSeconds(frames, rate) {
  const num = frames * rate.den
  const g = gcd(num, rate.num) || 1
  const [n, d] = [num / g, rate.num / g]
  return d === 1 ? `${n}s` : `${n}/${d}s`
}

// HH:MM:SS:FF, non-drop. timecode() wraps at 24 hours.
export function timecodeFrames(tc, rate) {
  if (!tc) return 0
  if (tc.includes(';')) throw Error(`drop-frame timecode (${tc}) is not supported; transcode or restripe to non-drop`)
  const match = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/.exec(tc)
  if (!match) throw Error(`not an HH:MM:SS:FF timecode: ${tc}`)
  const [h, m, s, f] = match.slice(1).map(Number)
  const n = nominal(rate)
  if (h > 23 || m > 59 || s > 59 || f >= n) throw Error(`invalid timecode at ${n} fps: ${tc}`)
  return ((h * 60 + m) * 60 + s) * n + f
}
export function timecode(frame, rate) {
  const n = nominal(rate)
  let f = Math.round(frame)
  const ff = f % n
  f = Math.floor(f / n)
  return [Math.floor(f / 3600) % 24, Math.floor(f / 60) % 60, f % 60, ff].map(x => String(x).padStart(2, '0')).join(':')
}
export const startFrame = source => timecodeFrames(source.startTimecode, sourceRate(source))
export const totalFrames = source => source.frames ?? Math.floor(source.duration * Number(source.fps))

// Read a media file. Returns the "source" object the words file and the ledger carry.
// With videoRequired false, an audio-only file gets a source with fps and frameRate null.
export function probe(file, { videoRequired = true } = {}) {
  const path = realpathSync(file)
  const data = JSON.parse(run('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', path]))
  const streams = data.streams || []
  const video = streams.find(s => s.codec_type === 'video' && !s.disposition?.attached_pic)
  const audio = streams.find(s => s.codec_type === 'audio')
  const tmcd = streams.find(s => s.codec_tag_string === 'tmcd')
  const duration = Number(data.format?.duration)
  const st = statSync(path)
  const base = { path, size: st.size, mtime: st.mtime.toISOString(), container: data.format?.format_name ?? null, duration }
  const audioFields = { audio: Boolean(audio), audioChannels: audio?.channels ?? null, audioRate: audio ? Number(audio.sample_rate) : null }
  if (!video) {
    if (videoRequired) throw Error(`${file} has no video stream`)
    return { ...base, fps: null, frameRate: null, frames: null, startTimecode: null, timecodeIsTimeOfDay: false, ...audioFields }
  }
  const rate = parseRate(video.avg_frame_rate)
  const declared = parseRate(video.r_frame_rate)
  if (Math.abs(rate.num / rate.den - declared.num / declared.den) > 0.01) {
    throw Error(`${file} looks like variable frame rate (average ${video.avg_frame_rate}, declared ${video.r_frame_rate}); transcode to a constant rate first, e.g. ffmpeg -i in.mov -fps_mode cfr -r 30 out.mov`)
  }
  const startTimecode = tmcd?.tags?.timecode || video.tags?.timecode || data.format?.tags?.timecode || streams.find(s => s.tags?.timecode)?.tags.timecode || null
  if (startTimecode) timecodeFrames(startTimecode, rate) // refuses drop-frame and malformed timecode
  const frames = /^\d+$/.test(video.nb_frames ?? '') ? Number(video.nb_frames) : Math.floor(duration * rate.num / rate.den)
  return {
    ...base,
    videoCodec: video.codec_name,
    pixelFormat: video.pix_fmt ?? null,
    width: video.width,
    height: video.height,
    fps: rate.num / rate.den,
    frameRate: `${rate.num}/${rate.den}`,
    frames,
    startTimecode,
    timecodeIsTimeOfDay: Boolean(tmcd),
    ...audioFields,
  }
}

// The ledger: picks as word ranges, turned into frames with handles rounded outward and clamped.
// words: [{ index, word, start, end }] in seconds; picks: [{ startWord, endWord, title, reason, rating }].
export function makeLedger(transcript, picks, { purpose, purposeIsDefault = false, model, handle = 0.12, count, transcriptPath } = {}) {
  const { source, words } = transcript
  if (!Array.isArray(picks) || !picks.length) throw Error('no picks')
  if (!Number.isFinite(handle) || handle < 0 || handle > 2) throw Error('handle must be 0 to 2 seconds')
  const rate = sourceRate(source)
  const fps = rate.num / rate.den
  const last = Math.floor(source.duration * fps)
  const first = startFrame(source)
  return {
    schema: 1,
    source,
    transcript: transcriptPath ?? transcript.file ?? null,
    purpose,
    purposeIsDefault,
    model,
    handleSeconds: handle,
    count: count ?? picks.length,
    createdAt: new Date().toISOString(),
    bites: picks.map((p, i) => {
      if (!Number.isInteger(p.startWord) || !Number.isInteger(p.endWord) || p.startWord < 0 || p.endWord < p.startWord ||
        p.endWord >= words.length || !Number.isInteger(p.rating) || p.rating < 1 || p.rating > 5 ||
        typeof p.title !== 'string' || typeof p.reason !== 'string') {
        throw Error(`pick ${i + 1} is invalid: needs startWord <= endWord within the transcript, a title, a reason, and a rating 1-5`)
      }
      const inFrame = Math.max(0, Math.floor((words[p.startWord].start - handle) * fps))
      const outFrame = Math.min(last, Math.ceil((words[p.endWord].end + handle) * fps))
      if (outFrame <= inFrame) throw Error(`pick ${i + 1} is empty`)
      return {
        ...p,
        id: `bite-${i + 1}`,
        rank: i + 1,
        inFrame,
        outFrame,
        sourceIn: timecode(first + inFrame, rate),
        sourceOutExclusive: timecode(first + outFrame, rate),
        status: 'identified',
        files: {},
      }
    }),
  }
}

// Read a ledger and check its frames against its own source.
export function readLedger(path) {
  const ledger = JSON.parse(readFileSync(path, 'utf8'))
  if (!ledger.source?.path) throw Error(`${path} has no source.path; is it a bites ledger?`)
  if (!ledger.bites?.length) throw Error(`${path} has no bites`)
  const limit = Math.floor(ledger.source.duration * sourceRate(ledger.source).num / sourceRate(ledger.source).den)
  for (const b of ledger.bites) {
    if (!Number.isInteger(b.inFrame) || !Number.isInteger(b.outFrame) || b.inFrame < 0 || b.outFrame <= b.inFrame || b.outFrame > limit) {
      throw Error(`${b.id ?? 'a bite'} has invalid frames (inFrame ${b.inFrame}, outFrame ${b.outFrame}, source has ${limit})`)
    }
  }
  return ledger
}

// Probe the ledger's media again and refuse if it no longer matches what the picks were made on.
export function checkSource(ledger, file = ledger.source.path) {
  const now = probe(file)
  const was = sourceRate(ledger.source)
  if (now.frameRate !== `${was.num}/${was.den}`) throw Error(`${file} is ${now.frameRate} fps, but the ledger says ${was.num}/${was.den}; rebuild the ledger`)
  if ((now.startTimecode ?? null) !== (ledger.source.startTimecode ?? null)) {
    throw Error(`${file} starts at ${now.startTimecode}, but the ledger says ${ledger.source.startTimecode}; rebuild the ledger`)
  }
  return now
}

// Change bites in a ledger: reread it first (so fields other scripts wrote meanwhile survive),
// apply change(bite) to each bite whose id is listed (all if ids is null), write it atomically.
export function updateLedger(path, ids, change) {
  const fresh = JSON.parse(readFileSync(path, 'utf8'))
  for (const bite of fresh.bites) if (!ids || ids.includes(bite.id)) change(bite)
  writeFileSync(`${path}.tmp`, JSON.stringify(fresh, null, 2) + '\n')
  renameSync(`${path}.tmp`, path)
  return fresh
}
