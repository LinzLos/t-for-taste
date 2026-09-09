import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { EASE } from './motion'
import type { GripperHandle } from './Gripper'

// Option B, behind `?word`: the dots spell the action. At rest they say PRESS; pressed, TALK; and the
// first sound drops the letters into bars — a 27×5 meter, finer than the 9×3, made of the same dots.
// Nothing moves until you make a sound, which keeps the one rule this grip has.
export type WordMode = 'rest' | 'open' | 'typing' | 'pending' | 'listening'
const COLS = 27, ROWS = 5, PITCH = 6, X0 = 12, Y0 = 8, R = 2
const W = 180, H = 64
const cx = (c: number) => X0 + c * PITCH
const cy = (r: number) => Y0 + r * PITCH
const FLAT = 'M 14 50 Q 90 50 166 50'
const SMILE = 'M 20 45 Q 90 67 160 45'
const PEAK_HOLD = 450, PEAK_FALL = 120
const HEARD = 0.15 // the level at which the word gives way to the meter
const STEPS = [0.12, 0.3, 0.5, 0.72] // rows above the always-lit bottom row, against the adaptive ceiling

// A 3×5 pixel face, rows top→bottom, three bits per row (4 = left, 2 = middle, 1 = right).
const GLYPH: Record<string, number[]> = {
  P: [7, 5, 7, 4, 4], R: [7, 5, 7, 6, 5], E: [7, 4, 7, 4, 7], S: [7, 4, 7, 1, 7],
  T: [7, 2, 2, 2, 2], A: [2, 5, 7, 5, 5], L: [4, 4, 4, 4, 7], K: [5, 5, 6, 5, 5],
}
const spell = (word: string) => {
  const lit = Array.from({ length: ROWS }, () => new Array<boolean>(COLS).fill(false))
  const width = word.length * 3 + (word.length - 1)
  let x = Math.floor((COLS - width) / 2)
  for (const ch of word) {
    const g = GLYPH[ch]
    for (let r = 0; r < ROWS; r++) for (let b = 0; b < 3; b++) if (g[r] & (4 >> b)) lit[r][x + b] = true
    x += 4
  }
  return lit
}
const PRESS = spell('PRESS'), TALK = spell('TALK')
const LINE = Array.from({ length: ROWS }, (_, r) => new Array<boolean>(COLS).fill(r === ROWS - 1))

export const WordGripper = forwardRef<GripperHandle, { mode: WordMode; denied?: boolean }>(
  function WordGripper({ mode, denied }, ref) {
    const { reduced } = useReducedMotion()
    const dots = useRef<(SVGCircleElement | null)[]>([])
    const mouth = useRef<SVGPathElement>(null)
    const heard = useRef(false)
    const peak = useRef(Array.from({ length: COLS }, () => ({ row: 1, t: 0 })))
    const listening = mode === 'listening'

    const show = useCallback((lit: boolean[][]) => {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const d = dots.current[r * COLS + c]; if (!d) continue
        d.setAttribute('cy', String(cy(r)))
        d.style.opacity = lit[r][c] ? '1' : '0'
      }
    }, [])

    // The fall: the letters drop to the baseline, each column a little after the last, then the meter owns the dots.
    const fall = useMotionValue(0)
    useEffect(() => fall.on('change', p => {
      for (let c = 0; c < COLS; c++) {
        const t = Math.max(0, Math.min(1, p * 1.3 - c * 0.012))
        const e = 1 - Math.pow(1 - t, 3)
        for (let r = 0; r < ROWS; r++) {
          const d = dots.current[r * COLS + c]; if (!d || !TALK[r][c]) continue
          d.setAttribute('cy', (cy(r) + (cy(ROWS - 1) - cy(r)) * e).toFixed(2))
        }
      }
      if (p >= 1) show(LINE) // landed: a clean baseline for the meter to rise from
    }), [fall, show])

    useEffect(() => {
      heard.current = false; fall.set(0)
      show(mode === 'rest' ? PRESS : mode === 'pending' || mode === 'listening' ? TALK : LINE)
    }, [mode, show, fall])

    useImperativeHandle(ref, () => ({
      setLevels(levels) {
        if (!listening) return
        // nine bands → twenty-seven columns, neighbours blended
        const at = (c: number) => { const p = (c / (COLS - 1)) * (levels.length - 1); const i = Math.floor(p), f = p - i
          return (levels[i] ?? 0) * (1 - f) + (levels[Math.min(i + 1, levels.length - 1)] ?? 0) * f }
        if (!heard.current) {
          if (Math.max(...levels) < HEARD) return
          heard.current = true
          if (reduced) fall.set(1); else animate(fall, 1, { duration: 0.28, ease: EASE })
          return
        }
        if (fall.get() < 1) return
        const now = performance.now()
        for (let c = 0; c < COLS; c++) {
          const l = at(c)
          const bar = 1 + STEPS.filter(s => l >= s).length
          const pk = peak.current[c]
          if (bar >= pk.row) { pk.row = bar; pk.t = now }
          else if (now - pk.t > PEAK_HOLD) { pk.row = Math.max(bar, pk.row - 1); pk.t = now - (PEAK_HOLD - PEAK_FALL) }
          for (let r = 0; r < ROWS; r++) {
            const fromBottom = ROWS - r
            const d = dots.current[r * COLS + c]; if (!d) continue
            d.style.opacity = fromBottom <= bar || fromBottom === pk.row ? '1' : '0'
          }
        }
      },
    }), [listening, reduced, fall])

    const d = useMotionValue(FLAT)
    useEffect(() => d.on('change', v => mouth.current?.setAttribute('d', v)), [d])
    useEffect(() => {
      const to = listening ? SMILE : FLAT
      if (reduced) { d.set(to); return }
      const ctrl = animate(d, to, { duration: 0.26, ease: EASE })
      return () => ctrl.stop()
    }, [listening, reduced, d])

    const label = denied ? 'microphone not allowed' : listening ? 'listening' : mode === 'pending' ? 'asking' : mode
    return (
      <svg className={`gripper wgrip wgrip--${mode}${denied ? ' gripper--denied' : ''}`}
        viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={label}>
        <rect className="gripper-plate" x="0" y="0" width={W} height={H} />
        <rect className="gripper-edge" x="0" y={H - 2} width={W} height="2" />
        {Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => (
          <circle key={`${r}-${c}`} ref={el => { dots.current[r * COLS + c] = el }} className="wdot"
            cx={cx(c)} cy={cy(r)} r={R} style={{ opacity: PRESS[r][c] ? 1 : 0 }} />
        )))}
        <path ref={mouth} className="gripper-mouth" d={FLAT} />
      </svg>
    )
  })
