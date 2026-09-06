import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Real sound, nothing else. The analyser sits on the mic stream and hands back levels sixty
// times a second; nothing is recorded, uploaded or transcribed.
// Nine bands for the nine columns, log-spaced from ~80Hz to ~6k so speech spreads across them
// instead of piling into the low end. Bins at 48k / fftSize 1024 are ~47Hz wide.
const BANDS: [number, number][] = [[2, 3], [3, 5], [5, 7], [7, 12], [12, 19], [19, 31], [31, 49], [49, 79], [79, 128]]
const FLOOR = 0.10 // room noise sits under this and the meter stays still
const GAIN = 1.8
const TILT = 0.15 // voice rolls off with frequency; lift the high columns so they get a say
// Meter ballistics, the thing that makes it read as motion rather than static: a bar rises
// almost at once and falls slowly. Time constants, so it is the same at any frame rate.
const ATTACK = 25, RELEASE = 180

export function useMic(onLevels: (levels: number[]) => void) {
  const [denied, setDenied] = useState(false)
  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'AudioContext' in window
  const ctx = useRef<AudioContext | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const raf = useRef(0)
  const cb = useRef(onLevels)
  useEffect(() => { cb.current = onLevels })

  // Release everything the moment voice is off, so the browser's mic indicator goes with it.
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current); raf.current = 0
    stream.current?.getTracks().forEach(t => t.stop()); stream.current = null
    void ctx.current?.close(); ctx.current = null
    cb.current(new Array(BANDS.length).fill(0))
  }, [])

  // Call this from the click itself: on iOS the audio context has to be born inside a gesture.
  const start = useCallback(async () => {
    if (!supported) { setDenied(true); return false }
    stop()
    const ac = new AudioContext(); ctx.current = ac
    void ac.resume()
    let ms: MediaStream
    try { ms = await navigator.mediaDevices.getUserMedia({ audio: true }) }
    catch { setDenied(true); void ac.close(); ctx.current = null; return false }
    if (ctx.current !== ac) { ms.getTracks().forEach(t => t.stop()); return false } // stopped while we waited
    setDenied(false)
    stream.current = ms
    const an = ac.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0.5
    ac.createMediaStreamSource(ms).connect(an)
    const data = new Uint8Array(an.frequencyBinCount)
    const cur = new Array(BANDS.length).fill(0)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(50, now - last); last = now
      an.getByteFrequencyData(data)
      const raw = BANDS.map(([a, b], c) => {
        let s = 0; for (let i = a; i < b; i++) s += data[i]
        return Math.max(0, Math.min(1, (s / (b - a) / 255 - FLOOR) * GAIN * (1 + c * TILT)))
      })
      // neighbours lean on each other a little, so adjacent columns move as a wave, not as noise
      const out = raw.map((v, c) => 0.2 * (raw[c - 1] ?? v) + 0.6 * v + 0.2 * (raw[c + 1] ?? v))
      for (let c = 0; c < cur.length; c++) {
        const k = 1 - Math.exp(-dt / (out[c] > cur[c] ? ATTACK : RELEASE))
        cur[c] += (out[c] - cur[c]) * k
      }
      cb.current(cur.slice())
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return true
  }, [supported, stop])

  useEffect(() => stop, [stop])
  return useMemo(() => ({ start, stop, denied, supported }), [start, stop, denied, supported])
}
