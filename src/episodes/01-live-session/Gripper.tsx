import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { EASE } from './motion'

// One SVG, one viewBox, so it is the same drawing at any rendered size. At rest it is the cute thing:
// a 3×3 grip, a status dot, a slot. Listening, the nine dots seed a 27×5 meter across the whole plate
// (Lindsay, 2026-09-08: keep the cute, keep the big meter, lose the word). The grid is rigid; all the
// organic quality goes to the mouth, one quadratic whose pull point moves.
export type GripperMode = 'rest' | 'open' | 'typing' | 'pending' | 'listening'
export interface GripperHandle { setLevels: (levels: readonly number[]) => void }

export const W = 180, H = 64
const COLS = 27, ROWS = 5, PITCH = 6, X0 = 12, Y0 = 8, R_METER = 2
const cx = (c: number) => X0 + c * PITCH
const cy = (r: number) => Y0 + r * PITCH
// the resting 3×3: 8px pitch, 3px dots, and which meter cell each of the nine becomes (cols 0–2, rows 2–4)
const REST = [11, 19, 27], R_REST = 3
const seedOf = (r: number, c: number) => (r >= 2 && c <= 2 ? { i: r - 2, j: c } : null)
const STATUS = { x: cx(COLS - 1), y: 11 } // same inset as the grid; where the last column lands
const FLAT = 'M 14 47 Q 90 47 166 47'
const SMILE = 'M 20 42 Q 90 63 160 42' // its stroke bottoms out ~3px above the edge
const PEAK_HOLD = 450, PEAK_FALL = 120
const STEPS = [0.12, 0.3, 0.5, 0.72] // rows above the always-lit bottom row, against the adaptive ceiling

export const Gripper = forwardRef<GripperHandle, { mode: GripperMode; denied?: boolean }>(
  function Gripper({ mode, denied }, ref) {
    const { reduced } = useReducedMotion()
    const dots = useRef<(SVGCircleElement | null)[]>([]) // index = row * COLS + col
    const status = useRef<SVGCircleElement>(null)
    const mouth = useRef<SVGPathElement>(null)
    const listening = mode === 'listening'
    const spread = useMotionValue(0) // 0 = the 3×3 grip, 1 = the 27×5 meter

    // Levels write straight to the DOM: sixty updates a second is not a React render. Every dot is on or
    // off; a column is a bar with the bottom row always lit, plus a peak that holds and then falls.
    const peak = useRef(Array.from({ length: COLS }, () => ({ row: 1, t: 0 })))
    useImperativeHandle(ref, () => ({
      setLevels(levels) {
        const now = performance.now()
        const drawn = spread.get() >= 1 // the unroll owns the dots until it lands; the bookkeeping never waits
        const at = (c: number) => { const p = (c / (COLS - 1)) * (levels.length - 1); const i = Math.floor(p), f = p - i
          return (levels[i] ?? 0) * (1 - f) + (levels[Math.min(i + 1, levels.length - 1)] ?? 0) * f }
        for (let c = 0; c < COLS; c++) {
          const l = at(c)
          const bar = 1 + STEPS.filter(s => l >= s).length
          const pk = peak.current[c]
          if (bar >= pk.row) { pk.row = bar; pk.t = now }
          else if (now - pk.t > PEAK_HOLD) { pk.row = Math.max(bar, pk.row - 1); pk.t = now - (PEAK_HOLD - PEAK_FALL) }
          if (!drawn) continue
          for (let r = 0; r < ROWS; r++) {
            const d = dots.current[r * COLS + c]; if (!d) continue
            d.style.opacity = ROWS - r <= bar || ROWS - r === pk.row ? '1' : '0'
          }
        }
      },
    }), [spread])

    // The unroll: the nine resting dots travel to their meter cells and shrink to meter size, the rest of the
    // baseline arrives column by column, the upper seed dots go out, and the status dot yields to the last
    // column. One progress value drives all of it, so it reads as one thing spreading.
    useEffect(() => spread.on('change', p => {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const d = dots.current[r * COLS + c]; if (!d) continue
        const seed = seedOf(r, c)
        if (seed) {
          const t = Math.max(0, Math.min(1, p * 1.25 - seed.j * 0.04)), e = 1 - Math.pow(1 - t, 3)
          d.setAttribute('cx', (REST[seed.j] + (cx(c) - REST[seed.j]) * e).toFixed(2))
          d.setAttribute('cy', (REST[seed.i] + (cy(r) - REST[seed.i]) * e).toFixed(2))
          d.setAttribute('r', (R_REST + (R_METER - R_REST) * e).toFixed(2))
          d.style.opacity = r === ROWS - 1 ? '1' : String(1 - p)
        } else {
          const arrive = Math.max(0, Math.min(1, (p - 0.1 - (c - 3) * 0.02) * 4))
          d.style.opacity = r === ROWS - 1 ? String(arrive) : '0'
        }
      }
      if (status.current) status.current.style.opacity = String(1 - p)
    }), [spread])
    useEffect(() => {
      const to = listening ? 1 : 0
      if (reduced) { spread.set(to); return }
      const ctrl = animate(spread, to, { duration: 0.32, ease: EASE })
      return () => ctrl.stop()
    }, [listening, reduced, spread])

    // The mouth is a MotionValue tweened by hand and written straight to the attribute: not motion.path
    // (it lands on "undefined" for a frame), not animate(string, …) (a string is a selector).
    const d = useMotionValue(FLAT)
    useEffect(() => d.on('change', v => mouth.current?.setAttribute('d', v)), [d])
    useEffect(() => {
      const to = listening ? SMILE : FLAT
      if (reduced) { d.set(to); return }
      const ctrl = animate(d, to, { duration: 0.26, ease: EASE })
      return () => ctrl.stop()
    }, [listening, reduced, d])

    const label = denied ? 'microphone not allowed' : listening ? 'listening' : mode === 'pending' ? 'asking' : mode === 'typing' ? 'typing' : mode === 'open' ? 'open' : 'idle'
    return (
      <svg className={`gripper gripper--${mode}${denied ? ' gripper--denied' : ''}`}
        viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={label}>
        {/* one plate, fill only, and a 2px bottom edge — the same language as the field beside it */}
        <rect className="gripper-plate" x="0" y="0" width={W} height={H} />
        <rect className="gripper-edge" x="0" y={H - 2} width={W} height="2" />
        {Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
          const seed = seedOf(r, c)
          return (
            <circle key={`${r}-${c}`} ref={el => { dots.current[r * COLS + c] = el }} className="gripper-dot"
              cx={seed ? REST[seed.j] : cx(c)} cy={seed ? REST[seed.i] : cy(r)} r={seed ? R_REST : R_METER}
              style={seed ? undefined : { opacity: 0 }} />
          )
        }))}
        <circle ref={status} className="gripper-status" cx={STATUS.x} cy={STATUS.y} r="3" />
        <path ref={mouth} className="gripper-mouth" d={FLAT} />
      </svg>
    )
  })
