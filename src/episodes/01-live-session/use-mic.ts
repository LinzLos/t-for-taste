import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Real sound, nothing else. The analyser sits on the mic stream and hands back levels sixty
// times a second; nothing is recorded, uploaded or transcribed.
// Nine bands for the nine columns, log-spaced from ~140Hz to ~7k so speech spreads across them
// instead of piling into the low end. Bins at 48k / fftSize 1024 are ~47Hz wide. The band under
// 140Hz is left out on purpose: it is hum and fan, not voice.
const BANDS: [number, number][] = [[3, 5], [5, 7], [7, 12], [12, 19], [19, 31], [31, 49], [49, 79], [79, 110], [110, 150]]
const N = BANDS.length
const MARGIN = 0.04 // above the measured floor before a band counts at all
const TILT = 0.10 // voice rolls off with frequency; lift the high columns so they get a say
const TILTED = BANDS.map((_, c) => 1 + c * TILT)
// Every band tracks its own quiet level: it drops to any new low at once and creeps up slowly,
// so the room's noise is subtracted and only what rises above it moves the meter. Without this
// the low columns sit fully lit on fan noise before anyone has spoken.
const FLOOR_CREEP = 0.00004 // per ms → about 0.04 a second
// And its own loud level: the ceiling rides up on the loudest recent sound and sinks slowly, so the
// bars are read against how loud you have been, not against a fixed number. Constant talk then
// spreads across the rows instead of pinning every column to the top.
const CEIL_DECAY = 0.00012 // per ms
const SPAN_MIN = 0.12 // the ceiling never sits closer than this to the floor
// Meter ballistics, the thing that makes it read as motion rather than static: a bar rises
// almost at once and falls slowly. Time constants, so it is the same at any frame rate.
const ATTACK = 20, RELEASE = 260

// `stopped` and `cancelled` are what just happened, so the field can say so; `dismiss()` clears them.
export type MicState = 'off' | 'pending' | 'on' | 'stopped' | 'cancelled' | 'denied' | 'unsupported'

export function useMic(onLevels: (levels: readonly number[]) => void) {
  // One state, not three booleans, so every surface reads the same answer.
  const [state, setState] = useState<MicState>('off')
  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'AudioContext' in window
  const ctx = useRef<AudioContext | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const raf = useRef(0)
  const cb = useRef(onLevels)
  useEffect(() => { cb.current = onLevels })
  const zeros = useMemo(() => new Array<number>(N).fill(0), [])

  // Release everything the moment voice is off, so the browser's mic indicator goes with it.
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current); raf.current = 0
    stream.current?.getTracks().forEach(t => t.stop()); stream.current = null
    void ctx.current?.close().catch(() => {}); ctx.current = null
    cb.current(zeros)
    setState(s => (s === 'on' ? 'stopped' : s === 'pending' ? 'cancelled' : s))
  }, [zeros])

  // Acknowledged: the next keystroke, or a close, puts the field back to plain.
  const dismiss = useCallback(() => setState(s => (s === 'stopped' || s === 'cancelled' ? 'off' : s)), [])

  // Call this from the click itself: on iOS the audio context has to be born inside a gesture.
  const start = useCallback(async () => {
    if (!supported) { setState('unsupported'); return false }
    stop(); setState('pending') // a retry starts clean: not denied until the browser says so again
    const ac = new AudioContext(); ctx.current = ac
    let ms: MediaStream
    try {
      await ac.resume()
      ms = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      void ac.close().catch(() => {})
      if (ctx.current !== ac) return false // a newer request owns the state now
      setState('denied'); ctx.current = null; return false
    }
    if (ctx.current !== ac) { ms.getTracks().forEach(t => t.stop()); return false } // stopped while we waited
    stream.current = ms
    const an = ac.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0.5
    ac.createMediaStreamSource(ms).connect(an)
    // Everything the tick touches is allocated once: sixty frames a second is no place for garbage.
    const data = new Uint8Array(an.frequencyBinCount)
    const raw = new Float32Array(N), out = new Float32Array(N), floor = new Float32Array(N).fill(1), ceil = new Float32Array(N)
    const cur = new Array<number>(N).fill(0)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(50, now - last); last = now
      an.getByteFrequencyData(data)
      for (let c = 0; c < N; c++) {
        const [a, b] = BANDS[c]
        let s = 0; for (let i = a; i < b; i++) s += data[i]
        const v = s / (b - a) / 255
        floor[c] = v < floor[c] ? v : Math.min(v, floor[c] + FLOOR_CREEP * dt)
        const lifted = (v - floor[c] - MARGIN) * TILTED[c]
        ceil[c] = Math.max(lifted, ceil[c] - CEIL_DECAY * dt, floor[c] + SPAN_MIN)
        raw[c] = Math.max(0, Math.min(1, lifted / ceil[c]))
      }
      // neighbours lean on each other a little, so adjacent columns move as a wave, not as noise
      for (let c = 0; c < N; c++) out[c] = 0.2 * raw[c === 0 ? 0 : c - 1] + 0.6 * raw[c] + 0.2 * raw[c === N - 1 ? c : c + 1]
      const kUp = 1 - Math.exp(-dt / ATTACK), kDown = 1 - Math.exp(-dt / RELEASE)
      for (let c = 0; c < N; c++) cur[c] += (out[c] - cur[c]) * (out[c] > cur[c] ? kUp : kDown)
      cb.current(cur)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    setState('on')
    return true
  }, [supported, stop])

  useEffect(() => stop, [stop])
  return useMemo(() => ({ start, stop, dismiss, state, supported }), [start, stop, dismiss, state, supported])
}
