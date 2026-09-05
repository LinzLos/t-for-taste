import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Real sound, nothing else. The analyser sits on the mic stream and hands back levels sixty
// times a second; nothing is recorded, uploaded or transcribed. Three bands, so the three
// columns of the grip can read as a meter rather than a flicker.
// Bins at 48k / fftSize 256 are ~187Hz wide: low 0–375 · mid 375–2k · high 2k–6k.
const BANDS: [number, number][] = [[0, 2], [2, 11], [11, 33]]
const FLOOR = 0.12 // room noise sits under this and the grip stays still
const GAIN = 1.6

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
    cb.current([0, 0, 0])
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
    const an = ac.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.75
    ac.createMediaStreamSource(ms).connect(an)
    const data = new Uint8Array(an.frequencyBinCount)
    const tick = () => {
      an.getByteFrequencyData(data)
      cb.current(BANDS.map(([a, b]) => {
        let s = 0; for (let i = a; i < b; i++) s += data[i]
        return Math.max(0, Math.min(1, (s / (b - a) / 255 - FLOOR) * GAIN))
      }))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return true
  }, [supported, stop])

  useEffect(() => stop, [stop])
  return useMemo(() => ({ start, stop, denied, supported }), [start, stop, denied, supported])
}
